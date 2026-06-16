import { NextRequest, NextResponse } from "next/server";
import { cercaAgriturismi } from "@/lib/claude";

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
    return NextResponse.json({ filtri });
  } catch (err) {
    const errore = err instanceof Error ? err : new Error(String(err));
    console.error("[ricerca] Errore durante cercaAgriturismi:", {
      message: errore.message,
      stack: errore.stack,
      cause: errore.cause,
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
