"use client";

import { useState } from "react";
import { creaClientBrowser } from "@/lib/supabase";
import { CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";

export interface Rivendicazione {
  id: string;
  agriturismo_id: string;
  utente_id: string;
  stato: string;
  messaggio: string | null;
  created_at: string;
  agriturismo: { nome: string; slug: string } | null;
  utente: { nome: string | null; cognome: string | null } | null;
}

export interface AgriturismoBrief {
  id: string;
  nome: string;
  slug: string;
  regione: string | null;
  attivo: boolean;
  verificato: boolean;
}

interface Stats {
  totaleStrutture: number;
  totaleUtenti: number;
  totalePending: number;
}

interface Props {
  rivendicazioniInitial: Rivendicazione[];
  agriturismiInitial: AgriturismoBrief[];
  stats: Stats;
}

export default function AdminPannel({ rivendicazioniInitial, agriturismiInitial, stats }: Props) {
  const [rivendicazioni, setRivendicazioni] = useState(rivendicazioniInitial);
  const [agriturismi, setAgriturismi] = useState(agriturismiInitial);
  const [loading, setLoading] = useState<string | null>(null);

  const supabase = creaClientBrowser();

  async function handleApprova(riv: Rivendicazione) {
    setLoading(riv.id);
    await supabase.from("rivendicazioni").update({ stato: "approvata" }).eq("id", riv.id);
    await supabase
      .from("agriturismi")
      .update({ verificato: true, proprietario_id: riv.utente_id })
      .eq("id", riv.agriturismo_id);
    setRivendicazioni((prev) => prev.filter((r) => r.id !== riv.id));
    setLoading(null);
  }

  async function handleRifiuta(id: string) {
    setLoading(id);
    await supabase.from("rivendicazioni").update({ stato: "rifiutata" }).eq("id", id);
    setRivendicazioni((prev) => prev.filter((r) => r.id !== id));
    setLoading(null);
  }

  async function handleToggleAttivo(id: string, current: boolean) {
    setLoading(id + "_attivo");
    await supabase.from("agriturismi").update({ attivo: !current }).eq("id", id);
    setAgriturismi((prev) =>
      prev.map((a) => (a.id === id ? { ...a, attivo: !current } : a))
    );
    setLoading(null);
  }

  async function handleToggleVerificato(id: string, current: boolean) {
    setLoading(id + "_ver");
    await supabase.from("agriturismi").update({ verificato: !current }).eq("id", id);
    setAgriturismi((prev) =>
      prev.map((a) => (a.id === id ? { ...a, verificato: !current } : a))
    );
    setLoading(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Gestione piattaforma agriturismi.app</p>
      </div>

      {/* ── STATISTICHE ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Strutture attive" value={stats.totaleStrutture} emoji="🏡" />
        <StatCard label="Utenti registrati" value={stats.totaleUtenti} emoji="👤" />
        <StatCard label="Rivendicazioni pending" value={stats.totalePending} emoji="⚑" accent />
      </div>

      {/* ── RIVENDICAZIONI PENDING ───────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Rivendicazioni in attesa{" "}
          {rivendicazioni.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-orange-500">
              {rivendicazioni.length}
            </span>
          )}
        </h2>

        {rivendicazioni.length === 0 ? (
          <p className="text-sm text-gray-400 bg-gray-50 rounded-2xl px-6 py-8 text-center">
            Nessuna rivendicazione in attesa.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {rivendicazioni.map((riv) => (
              <div
                key={riv.id}
                className="flex items-start justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {riv.agriturismo?.nome ?? "Struttura sconosciuta"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Da: {riv.utente?.nome ?? "—"} {riv.utente?.cognome ?? ""}
                  </p>
                  {riv.messaggio && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {riv.messaggio}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {new Date(riv.created_at).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprova(riv)}
                    disabled={loading === riv.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    <CheckCircle size={13} />
                    Approva
                  </button>
                  <button
                    onClick={() => handleRifiuta(riv.id)}
                    disabled={loading === riv.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={13} />
                    Rifiuta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── LISTA AGRITURISMI ────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tutte le strutture ({agriturismi.length})
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Regione</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attivo</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verificato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agriturismi.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <a
                      href={`/agriturismo/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-[#2D6A4F] transition-colors"
                    >
                      {a.nome}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                    {a.regione ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleToggleAttivo(a.id, a.attivo)}
                      disabled={loading === a.id + "_attivo"}
                      className="inline-flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                      aria-label={a.attivo ? "Disattiva" : "Attiva"}
                    >
                      {a.attivo ? (
                        <ToggleRight size={22} style={{ color: "#2D6A4F" }} />
                      ) : (
                        <ToggleLeft size={22} className="text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleToggleVerificato(a.id, a.verificato)}
                      disabled={loading === a.id + "_ver"}
                      className="inline-flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                      aria-label={a.verificato ? "Rimuovi verifica" : "Verifica"}
                    >
                      {a.verificato ? (
                        <ToggleRight size={22} style={{ color: "#E8956D" }} />
                      ) : (
                        <ToggleLeft size={22} className="text-gray-300" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label, value, emoji, accent,
}: {
  label: string; value: number; emoji: string; accent?: boolean;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5"
      style={accent && value > 0 ? { borderColor: "#E8956D" } : undefined}
    >
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
