import { NextRequest, NextResponse } from "next/server";
import { cercaAgriturismi } from "@/lib/claude";
import { creaClientServer } from "@/lib/supabase-server";
import type { Agriturismo } from "@/types";

console.log(
  "[ricerca] ANTHROPIC_API_KEY:",
  process.env.ANTHROPIC_API_KEY ? "chiave presente" : "chiave MANCANTE"
);

export async function POST(request: NextRequest) {
  const body = await request.json() as { query?: unknown };
  const query = typeof body.query === "string" ? body.query.trim() : "";

  if (!query) {
    return NextResponse.json(
      { errore: "Il campo 'query' è obbligatorio." },
      { status: 400 }
    );
  }

  try {
    const filtri = await cercaAgriturismi(query);

    // Query Supabase con i filtri estratti da Claude
    const supabase = await creaClientServer();
    let q = supabase.from("agriturismi").select("*").eq("attivo", true);

    if (filtri.regione) {
      q = q.ilike("regione", filtri.regione);
    } else if (filtri.provincia) {
      q = q.ilike("provincia", filtri.provincia);
    }

    if (filtri.servizi.length > 0) {
      q = q.overlaps("servizi", filtri.servizi);
    }

    if (filtri.tipo_ospitalita.length > 0) {
      q = q.overlaps("tipo_ospitalita", filtri.tipo_ospitalita);
    }

    const { data } = await q.limit(20);
    const risultati = (data ?? []) as Agriturismo[];

    return NextResponse.json({ filtri, risultati });
  } catch (err) {
    const errore = err instanceof Error ? err : new Error(String(err));
    console.error("[ricerca] Errore:", {
      message: errore.message,
      stack: errore.stack,
    });

    return NextResponse.json(
      {
        errore: errore.message,
        stack: process.env.NODE_ENV === "development" ? errore.stack : undefined,
      },
      { status: 500 }
    );
  }
}
