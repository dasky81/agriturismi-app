"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface Rivendicazione {
  id: string;
  agriturismo_id: string;
  utente_id: string;
  stato: string;
  messaggio: string | null;
  created_at: string;
  agriturismo: { nome: string; slug: string } | null;
  utente: { nome: string | null; cognome: string | null; telefono: string | null; ruolo: string | null } | null;
}

type FiltroStato = "tutti" | "pending" | "approvata" | "rifiutata";

const BADGE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  approvata: "bg-green-100 text-green-700",
  rifiutata: "bg-red-100 text-red-700",
};

export default function AdminRivendicazioni() {
  const [lista, setLista] = useState<Rivendicazione[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroStato>("pending");
  const supabase = creaClientBrowser();

  const carica = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("rivendicazioni")
      .select("id, agriturismo_id, utente_id, stato, messaggio, created_at, agriturismo:agriturismi(nome, slug), utente:profiles(nome, cognome, telefono, ruolo)")
      .order("created_at", { ascending: false });
    if (filtro !== "tutti") q = q.eq("stato", filtro);
    const { data } = await q;
    setLista((data ?? []) as unknown as Rivendicazione[]);
    setLoading(false);
  }, [supabase, filtro]);

  useEffect(() => { void carica(); }, [carica]);

  async function approva(r: Rivendicazione) {
    setBusy(r.id);
    await supabase.from("rivendicazioni").update({ stato: "approvata" }).eq("id", r.id);
    await supabase.from("agriturismi").update({ verificato: true, proprietario_id: r.utente_id }).eq("id", r.agriturismo_id);
    setLista((prev) => prev.map((x) => x.id === r.id ? { ...x, stato: "approvata" } : x));
    setBusy(null);
  }

  async function rifiuta(id: string) {
    setBusy(id);
    await supabase.from("rivendicazioni").update({ stato: "rifiutata" }).eq("id", id);
    setLista((prev) => prev.map((x) => x.id === id ? { ...x, stato: "rifiutata" } : x));
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rivendicazioni</h1>
        <p className="text-sm text-gray-500 mt-1">Richieste di proprietà delle strutture</p>
      </div>

      {/* Filtro stato */}
      <div className="flex gap-2">
        {(["tutti", "pending", "approvata", "rifiutata"] as FiltroStato[]).map((s) => (
          <button
            key={s}
            onClick={() => setFiltro(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filtro === s
                ? "bg-[#2D6A4F] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "tutti" ? "Tutte" : s}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Caricamento...</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">Nessuna rivendicazione</p>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {r.agriturismo?.nome ?? "Struttura sconosciuta"}
                    </p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${BADGE[r.stato] ?? "bg-gray-100 text-gray-600"}`}>
                      {r.stato}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-gray-500 mb-2">
                    <span><span className="text-gray-400">Richiedente:</span> {[r.utente?.nome, r.utente?.cognome].filter(Boolean).join(" ") || "—"}</span>
                    <span><span className="text-gray-400">Ruolo:</span> {r.utente?.ruolo ?? "—"}</span>
                    <span><span className="text-gray-400">Telefono:</span> {r.utente?.telefono ?? "—"}</span>
                  </div>
                  {r.messaggio && (
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-2">
                      {r.messaggio}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-2">
                    {new Date(r.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>

                {r.stato === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approva(r)}
                      disabled={busy === r.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: "#2D6A4F" }}
                    >
                      <CheckCircle size={13} />
                      Approva
                    </button>
                    <button
                      onClick={() => rifiuta(r.id)}
                      disabled={busy === r.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Rifiuta
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
