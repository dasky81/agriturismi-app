import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    email?: string;
    nome?: string;
    lat?: number | null;
    lng?: number | null;
    citta?: string | null;
  };

  const { email, nome, lat, lng, citta } = body;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ errore: "Email non valida" }, { status: 400 });
  }

  const { error } = await serviceRole()
    .from("iscritti_newsletter")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        nome: nome?.trim() || null,
        lat: lat ?? null,
        lng: lng ?? null,
        citta: citta ?? null,
        fonte: "widget_weekend",
        attivo: true,
      },
      { onConflict: "email" }
    );

  if (error) return NextResponse.json({ errore: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
