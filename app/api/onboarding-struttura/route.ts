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

export async function POST(request: NextRequest) {
  const auth = await creaClientServer();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ errore: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json() as {
    nome?: string;
    slug?: string;
    descrizione?: string;
    regione?: string;
    provincia?: string;
    comune?: string;
    indirizzo?: string;
    lat?: number;
    lng?: number;
    foto_principale?: string;
    servizi?: string[];
  };

  const { nome, slug, descrizione, regione, provincia, comune, indirizzo, lat, lng, foto_principale, servizi } = body;

  if (!nome || !slug) {
    return NextResponse.json({ errore: "Nome e slug obbligatori" }, { status: 400 });
  }

  // Verifica slug univoco
  const { data: existing } = await serviceRole()
    .from("agriturismi")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ errore: "Slug già in uso. Prova un altro nome." }, { status: 409 });
  }

  const { data: agriturismo, error } = await serviceRole()
    .from("agriturismi")
    .insert({
      nome: nome.trim(),
      slug: slug.trim(),
      descrizione: descrizione?.trim() || null,
      regione: regione?.trim() || null,
      provincia: provincia?.trim() || null,
      comune: comune?.trim() || null,
      indirizzo: indirizzo?.trim() || null,
      lat: lat ?? null,
      lng: lng ?? null,
      foto_principale: foto_principale ?? null,
      servizi: servizi ?? [],
      proprietario_id: user.id,
      attivo: true,
      verificato: false,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ errore: error.message }, { status: 500 });
  }

  // Aggiorna ruolo utente a proprietario se non lo è già
  await serviceRole()
    .from("profiles")
    .update({ ruolo: "proprietario" })
    .eq("id", user.id)
    .neq("ruolo", "admin");

  return NextResponse.json({ ok: true, id: agriturismo.id, slug: agriturismo.slug });
}
