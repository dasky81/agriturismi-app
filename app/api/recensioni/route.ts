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

async function getUtenteId(): Promise<string | null> {
  try {
    const auth = await creaClientServer();
    const { data: { user } } = await auth.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

async function isAdmin(utente_id: string | null): Promise<boolean> {
  if (!utente_id) return false;
  const { data } = await serviceRole()
    .from("profiles")
    .select("ruolo")
    .eq("id", utente_id)
    .single();
  return data?.ruolo === "admin";
}

// GET /api/recensioni?agriturismo_id=xxx   → recensioni moderate + propria
// GET /api/recensioni?pending=true          → admin: in attesa di moderazione
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agriturismo_id = searchParams.get("agriturismo_id");
  const pending = searchParams.get("pending") === "true";
  const sb = serviceRole();

  if (pending) {
    const utente_id = await getUtenteId();
    if (!(await isAdmin(utente_id))) {
      return NextResponse.json({ errore: "Non autorizzato" }, { status: 403 });
    }
    const { data } = await sb
      .from("recensioni")
      .select("*, agriturismo:agriturismi(nome, slug), utente:profiles(nome, cognome)")
      .eq("moderata", false)
      .order("created_at", { ascending: false });
    return NextResponse.json({ recensioni: data ?? [] });
  }

  if (!agriturismo_id) {
    return NextResponse.json({ errore: "agriturismo_id richiesto" }, { status: 400 });
  }

  const utente_id = await getUtenteId();

  const { data: moderate } = await sb
    .from("recensioni")
    .select("*, utente:profiles(nome, cognome)")
    .eq("agriturismo_id", agriturismo_id)
    .eq("moderata", true)
    .order("created_at", { ascending: false });

  let mia_recensione = null;
  if (utente_id) {
    const { data: mia } = await sb
      .from("recensioni")
      .select("*")
      .eq("agriturismo_id", agriturismo_id)
      .eq("utente_id", utente_id)
      .maybeSingle();
    mia_recensione = mia;
  }

  const reviews = moderate ?? [];
  const tot_consigli = reviews.filter((r) => r.voto === "consiglio").length;
  const tot_non_consigli = reviews.filter((r) => r.voto === "non_consiglio").length;

  return NextResponse.json({ recensioni: reviews, mia_recensione, tot_consigli, tot_non_consigli });
}

// POST /api/recensioni — inserisce nuova recensione
export async function POST(request: NextRequest) {
  const utente_id = await getUtenteId();
  if (!utente_id) {
    return NextResponse.json({ errore: "Devi essere autenticato" }, { status: 401 });
  }

  const body = await request.json() as {
    agriturismo_id?: string;
    voto?: string;
    titolo?: string;
    testo?: string;
  };
  const { agriturismo_id, voto, titolo, testo } = body;

  if (!agriturismo_id || !voto || !titolo || !testo) {
    return NextResponse.json({ errore: "Campi obbligatori mancanti" }, { status: 400 });
  }
  if (testo.length < 30) {
    return NextResponse.json({ errore: "Testo troppo breve (minimo 30 caratteri)" }, { status: 400 });
  }
  if (voto !== "consiglio" && voto !== "non_consiglio") {
    return NextResponse.json({ errore: "Voto non valido" }, { status: 400 });
  }

  const { error } = await serviceRole().from("recensioni").insert({
    agriturismo_id,
    utente_id,
    voto,
    titolo: titolo.trim(),
    testo: testo.trim(),
    moderata: false,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ errore: "Hai già recensito questa struttura" }, { status: 409 });
    }
    return NextResponse.json({ errore: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// PATCH /api/recensioni — approva (admin)
export async function PATCH(request: NextRequest) {
  const utente_id = await getUtenteId();
  if (!(await isAdmin(utente_id))) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 403 });
  }

  const { id } = await request.json() as { id?: string };
  if (!id) return NextResponse.json({ errore: "id richiesto" }, { status: 400 });

  const { error } = await serviceRole()
    .from("recensioni")
    .update({ moderata: true })
    .eq("id", id);

  if (error) return NextResponse.json({ errore: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/recensioni — elimina (admin)
export async function DELETE(request: NextRequest) {
  const utente_id = await getUtenteId();
  if (!(await isAdmin(utente_id))) {
    return NextResponse.json({ errore: "Non autorizzato" }, { status: 403 });
  }

  const { id } = await request.json() as { id?: string };
  if (!id) return NextResponse.json({ errore: "id richiesto" }, { status: 400 });

  const { error } = await serviceRole().from("recensioni").delete().eq("id", id);
  if (error) return NextResponse.json({ errore: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
