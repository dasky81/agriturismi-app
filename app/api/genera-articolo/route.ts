import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const SEED_SECRET = "agriturismi2026";

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
        description: "Contenuto HTML dell'articolo (600-800 parole). Usa solo tag h2, p, ul, li, strong.",
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

export async function POST(req: NextRequest) {
  const body = await req.json() as { titolo?: string; secret?: string };

  console.log("[genera-articolo] titolo:", body.titolo);
  console.log("[genera-articolo] ANTHROPIC_KEY:", process.env.ANTHROPIC_API_KEY ? "presente" : "MANCANTE");
  console.log("[genera-articolo] SERVICE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "presente" : "MANCANTE");

  if (body.secret !== SEED_SECRET) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  if (!body.titolo?.trim()) {
    return NextResponse.json({ errore: "titolo obbligatorio" }, { status: 400 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { errore: "SUPABASE_SERVICE_ROLE_KEY non impostata" },
      { status: 500 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { errore: "ANTHROPIC_API_KEY non impostata" },
      { status: 500 }
    );
  }

  const titolo = body.titolo.trim();
  const slug = slugify(titolo);

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  try {
    const risposta = await claude.messages.create({
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

    const toolBlock = risposta.content.find((b) => b.type === "tool_use");
    if (!toolBlock || toolBlock.type !== "tool_use") {
      throw new Error("Claude non ha chiamato il tool salva_articolo");
    }

    const input = toolBlock.input as Partial<ArticoloGenerato>;
    const articolo: ArticoloGenerato = {
      html: typeof input.html === "string" ? input.html : "",
      excerpt: typeof input.excerpt === "string" ? input.excerpt.slice(0, 160) : "",
      og_title: typeof input.og_title === "string" ? input.og_title.slice(0, 60) : titolo.slice(0, 60),
      og_description: typeof input.og_description === "string" ? input.og_description.slice(0, 155) : "",
      tags: Array.isArray(input.tags) ? input.tags : [],
    };

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
      console.error("[genera-articolo] Errore Supabase:", error.message);
      return NextResponse.json({ errore: error.message }, { status: 500 });
    }

    console.log("[genera-articolo] Salvato:", titolo);
    return NextResponse.json({ ok: true, slug, titolo });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[genera-articolo] Errore Claude:", msg);
    return NextResponse.json({ errore: msg }, { status: 500 });
  }
}
