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
  const body = await request.json() as {
    pagina?: string;
    agriturismo_id?: string | null;
    referrer?: string | null;
    sessione_id?: string | null;
  };

  const { pagina, agriturismo_id, referrer, sessione_id } = body;

  if (!pagina) return NextResponse.json({ ok: false });

  // Non tracciare route interne
  if (
    pagina.startsWith("/admin") ||
    pagina.startsWith("/dashboard") ||
    pagina.startsWith("/api")
  ) {
    return NextResponse.json({ ok: true });
  }

  // Recupera utente opzionale
  let utente_id: string | null = null;
  try {
    const authClient = await creaClientServer();
    const { data: { user } } = await authClient.auth.getUser();
    utente_id = user?.id ?? null;
  } catch {
    // Continua senza utente_id
  }

  await serviceRole()
    .from("visite")
    .insert({
      pagina,
      agriturismo_id: agriturismo_id ?? null,
      referrer: referrer ?? null,
      sessione_id: sessione_id ?? null,
      utente_id,
      user_agent: request.headers.get("user-agent") ?? null,
    });

  return NextResponse.json({ ok: true });
}
