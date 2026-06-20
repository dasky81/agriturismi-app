import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sincronizza nome/cognome da metadata al profilo
      const meta = data.user.user_metadata as { nome?: string; cognome?: string } | undefined;
      if (meta?.nome || meta?.cognome) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          nome: meta.nome ?? null,
          cognome: meta.cognome ?? null,
        });
      }

      // Rileva primo accesso (created_at ≈ last_sign_in_at)
      const isFirstLogin = (() => {
        try {
          const created = new Date(data.user.created_at).getTime();
          const lastSignIn = new Date(data.user.last_sign_in_at!).getTime();
          return Math.abs(created - lastSignIn) < 5000;
        } catch {
          return false;
        }
      })();

      const redirectPath = isFirstLogin ? "/auth/benvenuto?tipo=nuovo" : "/";
      return NextResponse.redirect(new URL(redirectPath, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?errore=oauth", origin));
}
