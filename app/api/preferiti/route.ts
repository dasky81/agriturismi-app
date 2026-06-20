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

export async function GET() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ids: [], loggedIn: false });
  }

  const { data } = await serviceRole()
    .from("preferiti")
    .select("agriturismo_id")
    .eq("utente_id", user.id);

  return NextResponse.json({
    ids: (data ?? []).map((r: { agriturismo_id: string }) => r.agriturismo_id),
    loggedIn: true,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json() as { agriturismo_id?: string };
  const { agriturismo_id } = body;
  if (!agriturismo_id) {
    return NextResponse.json({ error: "agriturismo_id mancante" }, { status: 400 });
  }

  const { error } = await serviceRole()
    .from("preferiti")
    .insert({ utente_id: user.id, agriturismo_id });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json() as { agriturismo_id?: string };
  const { agriturismo_id } = body;
  if (!agriturismo_id) {
    return NextResponse.json({ error: "agriturismo_id mancante" }, { status: 400 });
  }

  await serviceRole()
    .from("preferiti")
    .delete()
    .eq("utente_id", user.id)
    .eq("agriturismo_id", agriturismo_id);

  return NextResponse.json({ ok: true });
}
