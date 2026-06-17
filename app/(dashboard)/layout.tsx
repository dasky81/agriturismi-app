import { redirect } from "next/navigation";
import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import { BookOpen, PlusCircle, LayoutDashboard } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: profilo } = await supabase
    .from("profiles")
    .select("nome, cognome, ruolo")
    .eq("id", user.id)
    .single();

  const nomeUtente =
    profilo?.nome ?? user.email?.split("@")[0] ?? "Utente";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 px-4 gap-1 shrink-0">
        <div className="mb-4 px-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Area riservata
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
            {nomeUtente}
          </p>
          {profilo?.ruolo && (
            <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium capitalize">
              {profilo.ruolo}
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LayoutDashboard size={16} />
            Panoramica
          </Link>
          <Link
            href="/dashboard/post"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <BookOpen size={16} />
            I miei post
          </Link>
          <Link
            href="/dashboard/post/nuovo"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <PlusCircle size={16} />
            Nuovo post
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Torna al sito
          </Link>
        </div>
      </aside>

      {/* Contenuto principale */}
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
