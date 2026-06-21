"use client";

import { useState, useEffect, useCallback } from "react";

interface RecensioneAdmin {
  id: string;
  voto: "consiglio" | "non_consiglio";
  titolo: string;
  testo: string;
  created_at: string;
  agriturismo: { nome: string; slug: string } | null;
  utente: { nome: string | null; cognome: string | null } | null;
}

export default function AdminRecensioniPage() {
  const [recensioni, setRecensioni] = useState<RecensioneAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [azione, setAzione] = useState<Record<string, boolean>>({});

  const carica = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/recensioni?pending=true");
    const d = await r.json() as { recensioni: RecensioneAdmin[] };
    setRecensioni(d.recensioni ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void carica(); }, [carica]);

  async function approva(id: string) {
    setAzione((p) => ({ ...p, [id]: true }));
    await fetch("/api/recensioni", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRecensioni((prev) => prev.filter((r) => r.id !== id));
    setAzione((p) => ({ ...p, [id]: false }));
  }

  async function elimina(id: string) {
    setAzione((p) => ({ ...p, [id]: true }));
    await fetch("/api/recensioni", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRecensioni((prev) => prev.filter((r) => r.id !== id));
    setAzione((p) => ({ ...p, [id]: false }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recensioni in attesa</h1>
        <p className="text-sm text-gray-500 mt-1">
          Approva o elimina le recensioni prima della pubblicazione.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recensioni.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-500 font-medium">Nessuna recensione in attesa di moderazione.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recensioni.map((r) => {
            const agri = r.agriturismo;
            const utente = r.utente;
            const nomeUtente = [utente?.nome, utente?.cognome].filter(Boolean).join(" ") || "Anonimo";
            const busy = azione[r.id] ?? false;

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.voto === "consiglio"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.voto === "consiglio" ? "✅ Consiglia" : "❌ Non consiglia"}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {agri?.nome ?? "—"}
                  </span>
                  <span className="text-xs text-gray-400">· {nomeUtente}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(r.created_at).toLocaleDateString("it-IT")}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{r.titolo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.testo}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => void approva(r.id)}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    ✅ Approva
                  </button>
                  <button
                    onClick={() => void elimina(r.id)}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    ❌ Elimina
                  </button>
                  {agri?.slug && (
                    <a
                      href={`/agriturismo/${agri.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-[#2D6A4F] hover:underline self-center"
                    >
                      Vedi scheda →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
