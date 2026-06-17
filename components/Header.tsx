import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import HeaderAuth from "./HeaderAuth";

export default async function Header() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nome: string | null = null;
  if (user) {
    const { data: profilo } = await supabase
      .from("profiles")
      .select("nome")
      .eq("id", user.id)
      .single();
    nome = profilo?.nome ?? (user.user_metadata?.nome as string | undefined) ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden="true"
          >
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
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "#1B4332", fontFamily: "Georgia, serif" }}
          >
            agriturismi.app
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-7 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="nav-link hover:text-[#2D6A4F] transition-colors py-1"
          >
            Esplora
          </Link>
          <Link
            href="/blog"
            className="nav-link hover:text-[#2D6A4F] transition-colors py-1"
          >
            Blog
          </Link>
          <HeaderAuth utente={user ? { nome } : null} />
        </nav>
      </div>
    </header>
  );
}
