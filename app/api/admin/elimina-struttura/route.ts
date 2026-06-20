import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { creaClientServer } from "@/lib/supabase-server";

export async function DELETE(request: NextRequest) {
  const body = await request.json() as { id?: string };
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "id mancante" }, { status: 400 });
  }

  const supabase = await creaClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { data: profilo } = await supabase
    .from("profiles")
    .select("ruolo")
    .eq("id", user.id)
    .single();

  if (profilo?.ruolo !== "admin") {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { error } = await serviceClient
    .from("agriturismi")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
