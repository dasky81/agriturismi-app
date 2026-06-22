import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { creaClientServer } from "@/lib/supabase-server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const auth = await creaClientServer();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ errore: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json() as {
    nome?: string;
    comune?: string;
    regione?: string;
    servizi?: string[];
  };

  const { nome, comune, regione, servizi } = body;
  if (!nome) {
    return NextResponse.json({ errore: "Nome obbligatorio" }, { status: 400 });
  }

  const serviziStr = (servizi ?? []).join(", ") || "nessun servizio specificato";
  const luogo = [comune, regione].filter(Boolean).join(", ") || "Italia";

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Scrivi una descrizione accattivante per un agriturismo italiano chiamato "${nome}", situato a ${luogo}. Servizi offerti: ${serviziStr}. La descrizione deve essere in italiano, tra 80 e 120 parole, coinvolgente per i turisti, evoca calore e autenticità rurale. Restituisci SOLO il testo della descrizione, senza titoli o prefazioni.`,
      },
    ],
  });

  const descrizione = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  return NextResponse.json({ descrizione });
}
