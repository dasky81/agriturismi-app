import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { creaClientServer } from "@/lib/supabase-server";

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function isAdmin(): Promise<boolean> {
  try {
    const auth = await creaClientServer();
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return false;
    const { data } = await serviceRole()
      .from("profiles")
      .select("ruolo")
      .eq("id", user.id)
      .single();
    return data?.ruolo === "admin";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 403 });
  }

  const body = await request.json() as {
    nome?: string;
    slug?: string;
    tipo?: string;
    dominio_fonte?: string;
    url_scheda?: string;
    comune?: string;
    regione?: string;
    lat?: number;
    lng?: number;
    descrizione?: string;
  };

  const { nome, slug, tipo, dominio_fonte, url_scheda, comune, regione, lat, lng, descrizione } = body;

  if (!nome || !slug || !tipo || !dominio_fonte || !url_scheda) {
    return NextResponse.json({ errore: "Campi obbligatori mancanti" }, { status: 400 });
  }

  const { error } = await serviceRole().from("network_luoghi").insert({
    nome: nome.trim(),
    slug: slug.trim(),
    tipo,
    dominio_fonte,
    url_scheda: url_scheda.trim(),
    comune: comune?.trim() || null,
    regione: regione?.trim() || null,
    lat: lat ?? null,
    lng: lng ?? null,
    descrizione: descrizione?.trim() || null,
    attivo: true,
    verificato: false,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ errore: "Luogo già presente nel network (slug duplicato)" }, { status: 409 });
    }
    return NextResponse.json({ errore: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
