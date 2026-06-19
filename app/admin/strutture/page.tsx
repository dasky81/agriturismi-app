"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ToggleLeft, ToggleRight, Trash2, ExternalLink, Plus } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface Struttura {
  id: string;
  nome: string;
  slug: string;
  regione: string | null;
  attivo: boolean;
  verificato: boolean;
  proprietario_id: string | null;
  created_at: string;
}

const REGIONI = [
  "Tutte", "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto",
];

export default function AdminStrutture() {
  const [strutture, setStrutture] = useState<Struttura[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filtroRegione, setFiltroRegione] = useState("Tutte");
  const [filtroVerificato, setFiltroVerificato] = useState<"tutti" | "verificati" | "non_verificati">("tutti");
  const supabase = creaClientBrowser();

  const carica = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("agriturismi")
      .select("id, nome, slug, regione, attivo, verificato, proprietario_id, created_at")
      .order("nome");
    if (filtroRegione !== "Tutte") q = q.eq("regione", filtroRegione);
    if (filtroVerificato === "verificati") q = q.eq("verificato", true);
    if (filtroVerificato === "non_verificati") q = q.eq("verificato", false);
    const { data } = await q;
    setStrutture((data ?? []) as Struttura[]);
    setLoading(false);
  }, [supabase, filtroRegione, filtroVerificato]);

  useEffect(() => { void carica(); }, [carica]);

  async function toggleAttivo(s: Struttura) {
    setBusy(s.id + "_a");
    await supabase.from("agriturismi").update({ attivo: !s.attivo }).eq("id", s.id);
    setStrutture((prev) => prev.map((x) => x.id === s.id ? { ...x, attivo: !s.attivo } : x));
    setBusy(null);
  }

  async function toggleVerificato(s: Struttura) {
    setBusy(s.id + "_v");
    await supabase.from("agriturismi").update({ verificato: !s.verificato }).eq("id", s.id);
    setStrutture((prev) => prev.map((x) => x.id === s.id ? { ...x, verificato: !s.verificato } : x));
    setBusy(null);
  }

  async function elimina(s: Struttura) {
    if (!confirm(`Eliminare "${s.nome}"? L'operazione è irreversibile.`)) return;
    setBusy(s.id + "_del");
    await supabase.from("agriturismi").delete().eq("id", s.id);
    setStrutture((prev) => prev.filter((x) => x.id !== s.id));
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strutture</h1>
          <p className="text-sm text-gray-500 mt-1">{strutture.length} strutture trovate</p>
        </div>
        <Link
          href="/aggiungi-struttura"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D6A4F" }}
        >
          <Plus size={15} />
          Aggiungi struttura
        </Link>
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filtroRegione}
          onChange={(e) => setFiltroRegione(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        >
          {REGIONI.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select
          value={filtroVerificato}
          onChange={(e) => setFiltroVerificato(e.target.value as typeof filtroVerificato)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        >
          <option value="tutti">Tutti gli stati</option>
          <option value="verificati">Solo verificati</option>
          <option value="non_verificati">Non verificati</option>
        </select>
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-12">Caricamento...</p>
        ) : strutture.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Nessuna struttura trovata</p>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Nome", "Regione", "Verificato", "Attivo", "Proprietario", "Creato il", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {strutture.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                    {s.nome}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.regione ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVerificato(s)}
                      disabled={busy === s.id + "_v"}
                      className="transition-opacity hover:opacity-70 disabled:opacity-40"
                    >
                      {s.verificato
                        ? <ToggleRight size={22} style={{ color: "#E8956D" }} />
                        : <ToggleLeft size={22} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAttivo(s)}
                      disabled={busy === s.id + "_a"}
                      className="transition-opacity hover:opacity-70 disabled:opacity-40"
                    >
                      {s.attivo
                        ? <ToggleRight size={22} style={{ color: "#2D6A4F" }} />
                        : <ToggleLeft size={22} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {s.proprietario_id ? (
                      <span className="inline-block text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ✓
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/agriturismo/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#2D6A4F] hover:bg-green-50 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => elimina(s)}
                        disabled={busy === s.id + "_del"}
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
