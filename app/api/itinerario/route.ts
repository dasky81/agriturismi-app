import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

interface GiornoItinerario {
  numero: number;
  mattina: string;
  pranzo: string;
  pomeriggio: string;
  cena: string;
}

interface Itinerario {
  destinazione: string;
  giorni: GiornoItinerario[];
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    destinazione?: string;
    giorni?: number;
    tipo?: string;
    interessi?: string[];
  };

  const { destinazione, giorni, tipo, interessi } = body;
  if (!destinazione || !giorni || !tipo) {
    return NextResponse.json({ errore: "Parametri mancanti" }, { status: 400 });
  }

  const interessiStr = (interessi ?? []).join(", ") || "generale";

  const prompt = `Sei un esperto di turismo italiano del network viaggi.app. Crea un itinerario dettagliato per ${giorni} giorni a ${destinazione} per ${tipo}. Interessi: ${interessiStr}. Per ogni giorno indica: mattina, pranzo, pomeriggio, cena. Includi suggerimenti concreti su agriturismi, cantine, ristoranti tipici, luoghi da vedere. Rispondi ESCLUSIVAMENTE con un oggetto JSON valido con questa struttura, senza testo prima o dopo, senza markdown, senza backtick: {"destinazione":"${destinazione}","giorni":[{"numero":1,"mattina":"...","pranzo":"...","pomeriggio":"...","cena":"..."}]}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const testo = message.content[0].type === "text" ? message.content[0].text : "";
    const normalizzato = testo.trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const jsonMatch = normalizzato.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON non trovato nella risposta");

    const itinerario = JSON.parse(jsonMatch[0]) as Itinerario;
    return NextResponse.json({ itinerario });
  } catch (err) {
    console.error("[itinerario]", err);
    return NextResponse.json({ errore: "Errore nella generazione dell'itinerario" }, { status: 500 });
  }
}
