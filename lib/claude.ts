import Anthropic from "@anthropic-ai/sdk";

export interface FiltriRicerca {
  regione: string | null;
  provincia: string | null;
  servizi: string[];
  tipo_ospitalita: string[];
  keywords: string[];
}

const FILTRI_DEFAULT: FiltriRicerca = {
  regione: null,
  provincia: null,
  servizi: [],
  tipo_ospitalita: [],
  keywords: [],
};

const client = new Anthropic();

export async function cercaAgriturismi(
  query: string
): Promise<FiltriRicerca> {
  const messaggio = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: `Sei un assistente che interpreta ricerche in linguaggio naturale per agriturismi italiani.
Estrai dalla query i filtri strutturati e rispondi ESCLUSIVAMENTE con un oggetto JSON valido.
Non aggiungere mai testo, spiegazioni, markdown o backtick — solo JSON puro.

Il formato JSON deve essere esattamente questo:
{
  "regione": "nome regione italiana o null",
  "provincia": "nome provincia italiana o null",
  "servizi": ["lista", "servizi", "richiesti"],
  "tipo_ospitalita": ["tipi", "di", "ospitalità"],
  "keywords": ["parole", "chiave", "aggiuntive"]
}

Esempi di servizi: piscina, fattoria didattica, degustazione vini, cavalli, spa, ristorante, wifi, animali domestici, biciclette, escursioni
Esempi di tipo_ospitalita: bed and breakfast, appartamento, agriturismo con ristorante, glamping, camping
Esempi di keywords: famiglia, bambini, romantico, biologico, vista mare, montagna, tranquillo`,
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
  });

  const testo =
    messaggio.content[0].type === "text" ? messaggio.content[0].text : "";

  console.log("[claude] risposta grezza:", testo);

  // Rimuovi eventuali backtick markdown (```json ... ```)
  const testoNormalizzato = testo
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const dati = JSON.parse(testoNormalizzato) as Partial<FiltriRicerca>;
    return {
      regione: typeof dati.regione === "string" ? dati.regione : null,
      provincia: typeof dati.provincia === "string" ? dati.provincia : null,
      servizi: Array.isArray(dati.servizi) ? dati.servizi : [],
      tipo_ospitalita: Array.isArray(dati.tipo_ospitalita)
        ? dati.tipo_ospitalita
        : [],
      keywords: Array.isArray(dati.keywords) ? dati.keywords : [],
    };
  } catch (err) {
    console.error("[claude] errore nel parsing della risposta JSON:", err);
    console.error("[claude] testo normalizzato:", testoNormalizzato);
    return { ...FILTRI_DEFAULT };
  }
}
