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
    <header className="w-full py-4 px-6 border-b border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: "#2D6A4F" }}
        >
          agriturismi.app
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-[#2D6A4F] transition-colors">
            Esplora
          </Link>
          <Link href="#" className="hover:text-[#2D6A4F] transition-colors">
            Blog
          </Link>
          <HeaderAuth utente={user ? { nome } : null} />
        </nav>
      </div>
    </header>
  );
}
