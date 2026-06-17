import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import { Post } from "@/types";
import { PlusCircle, Eye, EyeOff, Pencil } from "lucide-react";

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPostPage() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilo } = await supabase
    .from("profiles")
    .select("ruolo")
    .eq("id", user!.id)
    .single();

  /* Admin vede tutti i post, proprietari solo i propri */
  const query = supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

  if (profilo?.ruolo !== "admin") {
    query.eq("autore_id", user!.id);
  }

  const { data: posts } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">I miei post</h1>
        <Link
          href="/dashboard/post/nuovo"
          className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#245a42] transition-colors"
        >
          <PlusCircle size={16} />
          Nuovo post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="font-medium">Nessun post ancora</p>
          <p className="text-sm mt-1">
            <Link
              href="/dashboard/post/nuovo"
              className="text-[#2D6A4F] hover:underline"
            >
              Crea il tuo primo articolo
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Titolo</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">
                  Data
                </th>
                <th className="px-4 py-3 font-medium sr-only">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(posts as Post[]).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900 line-clamp-1">
                      {p.titolo}
                    </span>
                    {p.excerpt && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {p.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.pubblicato
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.pubblicato ? (
                        <>
                          <Eye size={11} /> Pubblicato
                        </>
                      ) : (
                        <>
                          <EyeOff size={11} /> Bozza
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-gray-400">
                    {formatData(p.created_at)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/dashboard/post/${p.id}/modifica`}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Pencil size={13} />
                      Modifica
                    </Link>
                    {p.pubblicato && (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="ml-3 inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:underline"
                      >
                        Visualizza
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
