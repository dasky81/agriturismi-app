import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface CorpoRichiesta {
  titolo: string;
  agriturismo_nome?: string;
}

export async function POST(req: NextRequest) {
  let body: CorpoRichiesta;
  try {
    body = (await req.json()) as CorpoRichiesta;
  } catch {
    return NextResponse.json({ errore: "Corpo JSON non valido" }, { status: 400 });
  }

  const { titolo, agriturismo_nome } = body;

  if (!titolo || typeof titolo !== "string" || titolo.trim().length === 0) {
    return NextResponse.json({ errore: "Il titolo è obbligatorio" }, { status: 400 });
  }

  const contestoAgriturismo = agriturismo_nome
    ? `\nL'articolo è collegato all'agriturismo: "${agriturismo_nome}". Menzionalo naturalmente nel testo.`
    : "";

  const systemPrompt = `Sei un esperto redattore di contenuti per agriturismi italiani. Scrivi articoli coinvolgenti, autentici e informativi in italiano, con un tono caldo e appassionato. Usa formattazione HTML semantica: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>. Non usare <html>, <head>, <body> né classi CSS. Restituisci SOLO l'HTML dell'articolo, senza markdown, senza commenti.`;

  const userPrompt = `Scrivi un articolo blog completo di circa 600-800 parole con titolo: "${titolo.trim()}"${contestoAgriturismo}

L'articolo deve avere:
- Un'introduzione coinvolgente
- 2-3 sezioni con titoli <h2>
- Consigli pratici o dettagli evocativi
- Una conclusione ispirazionale

Restituisci solo l'HTML dell'articolo.`;

  try {
    const risposta = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const blocco = risposta.content[0];
    if (blocco.type !== "text") {
      return NextResponse.json(
        { errore: "Risposta inattesa dal modello" },
        { status: 500 }
      );
    }

    // Rimuovi eventuali fence markdown rimasti
    const html = blocco.text
      .replace(/^```html?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return NextResponse.json({ html });
  } catch (err) {
    console.error("[genera-post] Errore Claude:", err);
    return NextResponse.json(
      { errore: "Errore durante la generazione del testo" },
      { status: 500 }
    );
  }
}
