"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ToggleLeft, ToggleRight, Trash2, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface Post {
  id: string;
  titolo: string;
  slug: string;
  pubblicato: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [msgGenera, setMsgGenera] = useState("");
  const supabase = creaClientBrowser();

  const carica = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("post")
      .select("id, titolo, slug, pubblicato, created_at, updated_at")
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void carica(); }, [carica]);

  async function togglePubblicato(p: Post) {
    setBusy(p.id);
    await supabase.from("post").update({ pubblicato: !p.pubblicato }).eq("id", p.id);
    setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, pubblicato: !p.pubblicato } : x));
    setBusy(null);
  }

  async function elimina(p: Post) {
    if (!confirm(`Eliminare "${p.titolo}"?`)) return;
    setBusy(p.id + "_del");
    await supabase.from("post").delete().eq("id", p.id);
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
    setBusy(null);
  }

  async function generaArticoli() {
    setGenerando(true);
    setMsgGenera("Generazione in corso (3-4 minuti)…");
    try {
      const res = await fetch("/api/genera-articoli-seed", {
        headers: { "x-seed-secret": "agriturismi2026" },
      });
      const dati = await res.json() as { salvati: number; totale: number };
      setMsgGenera(`✅ ${dati.salvati}/${dati.totale} articoli generati e salvati`);
      void carica();
    } catch {
      setMsgGenera("❌ Errore durante la generazione");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} articoli totali</p>
        </div>
        <div className="flex items-center gap-3">
          {msgGenera && <p className="text-xs text-gray-500">{msgGenera}</p>}
          <button
            onClick={generaArticoli}
            disabled={generando}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            {generando ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Genera 5 articoli con AI
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-12">Caricamento...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Nessun articolo</p>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titolo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pubblicato</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Data</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[260px] truncate">
                    {p.titolo}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePubblicato(p)}
                      disabled={busy === p.id}
                      className="transition-opacity hover:opacity-70 disabled:opacity-40"
                    >
                      {p.pubblicato
                        ? <ToggleRight size={22} style={{ color: "#2D6A4F" }} />
                        : <ToggleLeft size={22} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#2D6A4F] hover:bg-green-50 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => elimina(p)}
                        disabled={busy === p.id + "_del"}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
