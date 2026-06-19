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

async function generaArticolo(client: Anthropic, titolo: string): Promise<ArticoloGenerato> {
  const risposta = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: `Sei un esperto di turismo rurale italiano. Scrivi un articolo blog ottimizzato SEO in italiano per il sito agriturismi.app. Tono: caldo, autentico, esperto. Struttura: intro coinvolgente, 3-4 sezioni con H2, conclusione con CTA.

Restituisci ESCLUSIVAMENTE un oggetto JSON valido (senza backtick né markdown) con questi campi:
{
  "html": "contenuto HTML dell'articolo 600-800 parole, usa solo h2, p, ul, li, strong",
  "excerpt": "stringa di max 160 caratteri che riassume l'articolo",
  "og_title": "titolo SEO ottimizzato max 60 caratteri",
  "og_description": "descrizione SEO max 155 caratteri",
  "tags": ["tag1", "tag2", "tag3"]
}`,
    messages: [
      {
        role: "user",
        content: `Titolo dell'articolo: "${titolo}"`,
      },
    ],
  });

  const testo = risposta.content[0].type === "text" ? risposta.content[0].text : "{}";
  const normalizzato = testo
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const dati = JSON.parse(normalizzato) as Partial<ArticoloGenerato>;

  return {
    html: typeof dati.html === "string" ? dati.html : "",
    excerpt: typeof dati.excerpt === "string" ? dati.excerpt.slice(0, 160) : "",
    og_title: typeof dati.og_title === "string" ? dati.og_title.slice(0, 60) : titolo.slice(0, 60),
    og_description: typeof dati.og_description === "string" ? dati.og_description.slice(0, 155) : "",
    tags: Array.isArray(dati.tags) ? dati.tags : [],
  };
}

export async function GET(req: NextRequest) {
  // Protezione: solo in development o con header segreto
  const secret = req.headers.get("x-seed-secret");
  if (process.env.NODE_ENV !== "development" && secret !== SEED_SECRET) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Client Supabase diretto (usa service role se disponibile, altrimenti anon)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const risultati: Array<{
    titolo: string;
    slug: string;
    salvato: boolean;
    errore?: string;
  }> = [];

  for (const titolo of TITOLI) {
    const slug = slugify(titolo);
    try {
      console.log(`[genera-articoli-seed] Generando: "${titolo}"...`);
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
        console.error(`[genera-articoli-seed] Errore Supabase per "${titolo}":`, error);
        risultati.push({ titolo, slug, salvato: false, errore: error.message });
      } else {
        console.log(`[genera-articoli-seed] Salvato: "${titolo}"`);
        risultati.push({ titolo, slug, salvato: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[genera-articoli-seed] Errore per "${titolo}":`, msg);
      risultati.push({ titolo, slug, salvato: false, errore: msg });
    }
  }

  const salvati = risultati.filter((r) => r.salvato).length;
  return NextResponse.json({
    success: salvati > 0,
    salvati,
    totale: TITOLI.length,
    articoli: risultati,
  });
}
