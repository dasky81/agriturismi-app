import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import { BookOpen, PlusCircle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilo } = await supabase
    .from("profiles")
    .select("nome, cognome, ruolo")
    .eq("id", user!.id)
    .single();

  const { count: totalePost } = await supabase
    .from("post")
    .select("*", { count: "exact", head: true })
    .eq("autore_id", user!.id);

  const { count: totalePublicati } = await supabase
    .from("post")
    .select("*", { count: "exact", head: true })
    .eq("autore_id", user!.id)
    .eq("pubblicato", true);

  const nomeUtente =
    profilo?.nome
      ? `${profilo.nome} ${profilo.cognome ?? ""}`.trim()
      : "Utente";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Benvenuto, {nomeUtente}
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Gestisci i tuoi contenuti su Agriturismi.app
      </p>

      {/* Statistiche rapide */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
            Post totali
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalePost ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
            Pubblicati
          </p>
          <p className="text-3xl font-bold text-[#2D6A4F]">
            {totalePublicati ?? 0}
          </p>
        </div>
      </div>

      {/* Azioni rapide */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Azioni rapide
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard/post"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-[#2D6A4F]" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Gestisci post</p>
            <p className="text-xs text-gray-400">Modifica e pubblica articoli</p>
          </div>
        </Link>

        <Link
          href="/dashboard/post/nuovo"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <PlusCircle size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Nuovo post</p>
            <p className="text-xs text-gray-400">
              Scrivi o genera con l&apos;AI
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
