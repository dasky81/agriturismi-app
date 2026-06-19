"use client";

import { useState, useEffect, useCallback } from "react";
import { creaClientBrowser } from "@/lib/supabase";

interface Utente {
  id: string;
  nome: string | null;
  cognome: string | null;
  ruolo: string | null;
  created_at: string;
  strutture_count?: number;
}

const RUOLI = ["visitatore", "proprietario", "admin"];

export default function AdminUtenti() {
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const supabase = creaClientBrowser();

  const carica = useCallback(async () => {
    setLoading(true);
    const { data: profili } = await supabase
      .from("profiles")
      .select("id, nome, cognome, ruolo, created_at")
      .order("created_at", { ascending: false });

    if (!profili) { setLoading(false); return; }

    // Conta strutture per proprietario
    const { data: strutture } = await supabase
      .from("agriturismi")
      .select("proprietario_id");

    const conteggioMap: Record<string, number> = {};
    strutture?.forEach((s) => {
      if (s.proprietario_id) conteggioMap[s.proprietario_id] = (conteggioMap[s.proprietario_id] ?? 0) + 1;
    });

    setUtenti(profili.map((p) => ({ ...p, strutture_count: conteggioMap[p.id] ?? 0 })) as Utente[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void carica(); }, [carica]);

  async function cambiaRuolo(id: string, nuovoRuolo: string) {
    setBusy(id);
    await supabase.from("profiles").update({ ruolo: nuovoRuolo }).eq("id", id);
    setUtenti((prev) => prev.map((u) => u.id === id ? { ...u, ruolo: nuovoRuolo } : u));
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utenti</h1>
        <p className="text-sm text-gray-500 mt-1">{utenti.length} utenti registrati</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-12">Caricamento...</p>
        ) : utenti.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Nessun utente</p>
        ) : (
          <table className="w-full text-sm min-w-[580px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruolo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Strutture</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Registrato il</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {utenti.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {[u.nome, u.cognome].filter(Boolean).join(" ") || <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.ruolo ?? "visitatore"}
                      onChange={(e) => cambiaRuolo(u.id, e.target.value)}
                      disabled={busy === u.id}
                      className="text-xs px-2 py-1 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] disabled:opacity-50"
                    >
                      {RUOLI.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {(u.strutture_count ?? 0) > 0 ? (
                      <span className="inline-block text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {u.strutture_count} struttur{u.strutture_count === 1 ? "a" : "e"}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {new Date(u.created_at as string).toLocaleDateString("it-IT")}
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
