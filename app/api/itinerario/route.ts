import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { creaClientServer } from "@/lib/supabase-server";

const client = new Anthropic();

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

interface NetworkLuogo {
  id: string;
  nome: string;
  tipo: string;
  dominio_fonte: string;
  url_scheda: string;
  comune: string | null;
  regione: string | null;
  lat: number;
  lng: number;
  descrizione: string | null;
  foto_principale: string | null;
  servizi: string[];
  verificato: boolean;
  distanza_km: number;
}

const TIPO_LABEL: Record<string, string> = {
  agriturismo: "AGRITURISMI",
  cantina: "CANTINE",
  ristorante: "RISTORANTI",
  noleggio: "NOLEGGI",
  campeggio: "CAMPEGGI",
  glamping: "GLAMPING",
  hotel: "HOTEL",
  beb: "B&B",
  attrazione: "ATTRAZIONI",
};

async function geocodifica(dest: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(dest)}&format=json&limit=1&accept-language=it`,
      { headers: { "User-Agent": "agriturismi.app/1.0" } }
    );
    const d = await r.json() as { lat: string; lon: string }[];
    if (!d.length) return null;
    return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) };
  } catch {
    return null;
  }
}

function buildNetworkSection(luoghi: NetworkLuogo[]): string {
  if (!luoghi.length) return "Nessuna struttura del network trovata entro 50km.";

  const perTipo: Record<string, NetworkLuogo[]> = {};
  for (const l of luoghi) {
    if (!perTipo[l.tipo]) perTipo[l.tipo] = [];
    perTipo[l.tipo].push(l);
  }

  return Object.entries(perTipo)
    .map(([tipo, lista]) => {
      const label = TIPO_LABEL[tipo] ?? tipo.toUpperCase();
      const nomi = lista
        .slice(0, 5)
        .map((l) => `${l.nome} (${l.comune ?? l.regione ?? ""}, ${l.distanza_km.toFixed(1)}km)`)
        .join(", ");
      return `${label}: ${nomi}`;
    })
    .join("\n");
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    destinazione?: string;
    giorni?: number;
    tipo_viaggiatore?: string;
    interessi?: string[];
  };

  const { destinazione, giorni, tipo_viaggiatore, interessi } = body;
  if (!destinazione || !giorni || !tipo_viaggiatore) {
    return NextResponse.json({ errore: "Parametri mancanti" }, { status: 400 });
  }

  // 1. Geocodifica destinazione
  const coords = await geocodifica(destinazione);

  // 2. Cerca strutture nel network vicino alla destinazione
  let networkLuoghi: NetworkLuogo[] = [];
  if (coords) {
    const { data } = await serviceRole().rpc("network_luoghi_vicini", {
      lat_utente: coords.lat,
      lng_utente: coords.lng,
      raggio_km: 50,
    }) as { data: NetworkLuogo[] | null };
    networkLuoghi = data ?? [];
  }

  // 3. Costruisci prompt con dati reali
  const networkSection = buildNetworkSection(networkLuoghi);
  const interessiStr = (interessi ?? []).join(", ") || "turismo generale";

  const systemPrompt = `Sei l'AI del network viaggi.app, l'ecosistema di viaggi italiano. Hai accesso ai dati reali di strutture, agriturismi, cantine, ristoranti e campeggi del network. Il tuo compito è creare itinerari personalizzati usando SOLO le strutture reali del network quando disponibili. Se una categoria non ha strutture nel network, puoi suggerire alternative generiche ma specifica nell'attivita "non ancora nel network viaggi.app". Rispondi SOLO con JSON valido, senza markdown, senza backtick, senza testo prima o dopo.`;

  const userPrompt = `Crea un itinerario di ${giorni} giorni a ${destinazione} per ${tipo_viaggiatore}. Interessi: ${interessiStr}.

Strutture disponibili nel network viaggi.app entro 50km da ${destinazione}:
${networkSection}

Formato risposta JSON esatto:
{
  "titolo": "Itinerario ${giorni} giorni a ${destinazione}",
  "destinazione": "${destinazione}",
  "giorni": ${giorni},
  "giorni_dettaglio": [
    {
      "numero": 1,
      "titolo": "Titolo descrittivo della giornata",
      "mattina": {
        "attivita": "descrizione attività mattutina",
        "luogo": "nome del luogo",
        "tipo": "tipo (agriturismo/cantina/ristorante/attrazione/altro)",
        "nel_network": true,
        "url_scheda": "https://... o null"
      },
      "pranzo": {
        "attivita": "descrizione pranzo",
        "luogo": "nome ristorante o luogo",
        "tipo": "ristorante",
        "nel_network": false,
        "url_scheda": null
      },
      "pomeriggio": {
        "attivita": "descrizione attività pomeridiana",
        "luogo": "nome del luogo",
        "tipo": "tipo",
        "nel_network": false,
        "url_scheda": null
      },
      "cena": {
        "attivita": "descrizione cena",
        "luogo": "nome ristorante",
        "tipo": "ristorante",
        "nel_network": false,
        "url_scheda": null
      },
      "dove_dormire": {
        "nome": "nome struttura ricettiva",
        "tipo": "agriturismo/hotel/beb/campeggio",
        "nel_network": false,
        "url_scheda": null
      }
    }
  ],
  "consigli_pratici": ["consiglio 1", "consiglio 2", "consiglio 3"],
  "strutture_network_usate": 0
}`;

  let itinerario: unknown;
  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const testo = message.content[0].type === "text" ? message.content[0].text : "";
    const normalizzato = testo
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const jsonMatch = normalizzato.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON non trovato");
    itinerario = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("[itinerario] Claude error:", err);
    return NextResponse.json({ errore: "Errore nella generazione dell'itinerario" }, { status: 500 });
  }

  // 4. Ottieni utente corrente (opzionale)
  let utente_id: string | null = null;
  try {
    const auth = await creaClientServer();
    const { data: { user } } = await auth.auth.getUser();
    utente_id = user?.id ?? null;
  } catch { /* non autenticato */ }

  // 5. Salva itinerario in Supabase
  const parsed = itinerario as { strutture_network_usate?: number };
  const { data: saved } = await serviceRole()
    .from("itinerari")
    .insert({
      utente_id,
      destinazione,
      giorni,
      tipo_viaggiatore,
      interessi: interessi ?? [],
      contenuto: itinerario,
      strutture_network_usate: parsed.strutture_network_usate ?? 0,
      condivisibile: true,
    })
    .select("share_token")
    .single();

  return NextResponse.json({
    itinerario,
    share_token: saved?.share_token ?? null,
  });
}
