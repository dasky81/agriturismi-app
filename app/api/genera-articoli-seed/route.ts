import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SEED_SECRET = "agriturismi2026";

const TITOLI = [
  "I migliori agriturismi in Toscana: guida completa 2026",
  "Agriturismo con piscina: le migliori strutture in Italia",
  "Agriturismi per famiglie con bambini: cosa cercare",
  "Weekend romantico in agriturismo: idee e consigli",
  "Degustazione vini in agriturismo: le regioni migliori",
];

function slugify(testo: string): string {
  return testo
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface ArticoloGenerato {
  html: string;
  excerpt: string;
  og_title: string;
  og_description: string;
  tags: string[];
}

const TOOL_SALVA: Anthropic.Tool = {
  name: "salva_articolo",
  description: "Salva l'articolo blog generato con tutti i metadati SEO",
  input_schema: {
    type: "object" as const,
    properties: {
      html: {
        type: "string",
        description:
          "Contenuto HTML dell'articolo (600-800 parole). Usa solo tag h2, p, ul, li, strong.",
      },
      excerpt: {
        type: "string",
        description: "Breve riassunto dell'articolo, max 160 caratteri.",
      },
      og_title: {
        type: "string",
        description: "Titolo SEO ottimizzato, max 60 caratteri.",
      },
      og_description: {
        type: "string",
        description: "Descrizione SEO, max 155 caratteri.",
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Array di 3-5 tag tematici.",
      },
    },
    required: ["html", "excerpt", "og_title", "og_description", "tags"],
  },
};

async function generaArticolo(client: Anthropic, titolo: string): Promise<ArticoloGenerato> {
  const risposta = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    tools: [TOOL_SALVA],
    tool_choice: { type: "tool", name: "salva_articolo" },
    system:
      "Sei un esperto di turismo rurale italiano. Scrivi articoli blog ottimizzati SEO per il sito agriturismi.app. " +
      "Tono: caldo, autentico, esperto. Struttura: intro coinvolgente, 3-4 sezioni con H2, conclusione con CTA. " +
      "Chiama SEMPRE il tool salva_articolo con il contenuto generato.",
    messages: [
      {
        role: "user",
        content: `Scrivi un articolo per il blog di agriturismi.app con questo titolo: "${titolo}"`,
      },
    ],
  });

  // Con tool_choice forced, il primo blocco è sempre tool_use
  const toolBlock = risposta.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Claude non ha chiamato il tool salva_articolo");
  }

  const input = toolBlock.input as Partial<ArticoloGenerato>;

  return {
    html: typeof input.html === "string" ? input.html : "",
    excerpt: typeof input.excerpt === "string" ? input.excerpt.slice(0, 160) : "",
    og_title: typeof input.og_title === "string" ? input.og_title.slice(0, 60) : titolo.slice(0, 60),
    og_description: typeof input.og_description === "string" ? input.og_description.slice(0, 155) : "",
    tags: Array.isArray(input.tags) ? input.tags : [],
  };
}

// Timeout esteso per Vercel (richiede piano Pro — su Hobby il max è 60s)
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  // Debug iniziale — visibile nei log Vercel
  console.log("[genera-articoli-seed] ENV:", process.env.NODE_ENV);
  console.log("[genera-articoli-seed] SECRET ricevuto:", req.headers.get("x-seed-secret"));
  console.log("[genera-articoli-seed] SERVICE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "presente" : "MANCANTE");
  console.log("[genera-articoli-seed] ANTHROPIC_KEY:", process.env.ANTHROPIC_API_KEY ? "presente" : "MANCANTE");

  // Protezione solo tramite secret — funziona in dev e produzione
  const secret = req.headers.get("x-seed-secret");
  if (secret !== SEED_SECRET) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { errore: "SUPABASE_SERVICE_ROLE_KEY non impostata — aggiungila in Vercel → Settings → Environment Variables" },
      { status: 500 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { errore: "ANTHROPIC_API_KEY non impostata — aggiungila in Vercel → Settings → Environment Variables" },
      { status: 500 }
    );
  }

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  );

  // Genera tutti gli articoli in parallelo (da ~150s sequenziale a ~30s parallelo)
  const jobs = TITOLI.map(async (titolo) => {
    const slug = slugify(titolo);
    try {
      console.log(`[genera-articoli-seed] Avvio: "${titolo}"`);
      const articolo = await generaArticolo(claude, titolo);

      const { error } = await supabase.from("post").upsert(
        {
          slug,
          titolo,
          contenuto: articolo.html,
          excerpt: articolo.excerpt,
          og_title: articolo.og_title,
          og_description: articolo.og_description,
          tags: articolo.tags,
          pubblicato: true,
          autore_id: null,
          agriturismo_id: null,
          cover_url: null,
          og_image: null,
        },
        { onConflict: "slug" }
      );

      if (error) {
        console.error(`[genera-articoli-seed] Errore Supabase "${titolo}":`, error.message);
        return { titolo, slug, salvato: false, errore: error.message };
      }
      console.log(`[genera-articoli-seed] Salvato: "${titolo}"`);
      return { titolo, slug, salvato: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[genera-articoli-seed] Errore "${titolo}":`, msg);
      return { titolo, slug, salvato: false, errore: msg };
    }
  });

  const risultati = await Promise.all(jobs);

  const salvati = risultati.filter((r) => r.salvato).length;
  return NextResponse.json({
    success: salvati > 0,
    salvati,
    totale: TITOLI.length,
    articoli: risultati,
  });
}
