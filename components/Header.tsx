import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import HeaderAuth from "./HeaderAuth";
import HeaderSearch from "./HeaderSearch";

export default async function Header() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nome: string | null = null;
  let ruolo: string | null = null;

  if (user) {
    const { data: profilo } = await supabase
      .from("profiles")
      .select("nome, ruolo")
      .eq("id", user.id)
      .single();
    nome = profilo?.nome ?? (user.user_metadata?.nome as string | undefined) ?? null;
    ruolo = profilo?.ruolo ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white" style={{ borderColor: "#DDDDDD" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

        {/* ── LOGO ─────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <path
              d="M15 2C15 2 5 9 5 18C5 23.5 9.5 28 15 28C20.5 28 25 23.5 25 18C25 9 15 2 15 2Z"
              fill="#2D6A4F"
            />
            <path
              d="M15 2C15 2 15 13 10.5 20"
              stroke="#52B788"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M15 2C15 2 15 15 19.5 21"
              stroke="#52B788"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-base font-bold tracking-tight text-gray-900">
            agriturismi.app
          </span>
        </Link>

        {/* ── BARRA RICERCA CENTRALE ────────────────────────── */}
        <div className="flex-1 flex justify-center">
          <HeaderSearch />
        </div>

        {/* ── AUTH DESTRA ──────────────────────────────────── */}
        <HeaderAuth utente={user ? { nome, ruolo } : null} />
      </div>
    </header>
  );
}
