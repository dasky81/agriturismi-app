"use client";

import { useState, useEffect, useCallback } from "react";
import { creaClientBrowser } from "@/lib/supabase";

interface Contatto {
  id: string;
  nome: string;
  email: string;
  telefono: string | null;
  messaggio: string;
  tipo: string;
  letto: boolean;
  created_at: string;
}

type FiltroLetto = "tutti" | "non_letti" | "letti";
type FiltroTipo = "tutti" | "info" | "rivendicazione" | "partnership" | "altro";

const TIPO_LABEL: Record<string, string> = {
  info: "Info",
  rivendicazione: "Rivendicazione",
  partnership: "Partnership",
  altro: "Altro",
};

export default function AdminContatti() {
  const [lista, setLista] = useState<Contatto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroLetto, setFiltroLetto] = useState<FiltroLetto>("tutti");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("tutti");
  const supabase = creaClientBrowser();

  const carica = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("contatti").select("*").order("created_at", { ascending: false });
    if (filtroLetto === "non_letti") q = q.eq("letto", false);
    if (filtroLetto === "letti") q = q.eq("letto", true);
    if (filtroTipo !== "tutti") q = q.eq("tipo", filtroTipo);
    const { data } = await q;
    setLista((data ?? []) as Contatto[]);
    setLoading(false);
  }, [supabase, filtroLetto, filtroTipo]);

  useEffect(() => { void carica(); }, [carica]);

  async function segnaLetto(id: string) {
    await supabase.from("contatti").update({ letto: true }).eq("id", id);
    setLista((prev) => prev.map((c) => c.id === id ? { ...c, letto: true } : c));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contatti</h1>
        <p className="text-sm text-gray-500 mt-1">Messaggi ricevuti dal form pubblico</p>
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filtroLetto}
          onChange={(e) => setFiltroLetto(e.target.value as FiltroLetto)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        >
          <option value="tutti">Tutti i messaggi</option>
          <option value="non_letti">Non letti</option>
          <option value="letti">Letti</option>
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        >
          <option value="tutti">Tutti i tipi</option>
          <option value="info">Info</option>
          <option value="rivendicazione">Rivendicazione</option>
          <option value="partnership">Partnership</option>
          <option value="altro">Altro</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Caricamento...</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">Nessun messaggio</p>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-colors ${
                !c.letto ? "border-[#2D6A4F]/30" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm">{c.nome}</p>
                    {!c.letto && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                        NUOVO
                      </span>
                    )}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {TIPO_LABEL[c.tipo] ?? c.tipo}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    <a href={`mailto:${c.email}`} className="hover:text-[#2D6A4F] transition-colors">
                      {c.email}
                    </a>
                    {c.telefono && <span>{c.telefono}</span>}
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">
                    {c.messaggio}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-2">
                    {new Date(c.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>

                {!c.letto && (
                  <button
                    onClick={() => segnaLetto(c.id)}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Segna letto
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
