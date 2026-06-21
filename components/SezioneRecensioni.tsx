"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { creaClientBrowser } from "@/lib/supabase";

interface RecensioneUtente {
  id: string;
  voto: "consiglio" | "non_consiglio";
  titolo: string;
  testo: string;
  risposta_gestore: string | null;
  created_at: string;
  utente: { nome: string | null; cognome: string | null } | null;
}

interface ApiRisposta {
  recensioni: RecensioneUtente[];
  mia_recensione: { id: string; voto: string } | null;
  tot_consigli: number;
  tot_non_consigli: number;
}

function nomeBreve(utente: { nome: string | null; cognome: string | null } | null): string {
  if (!utente?.nome) return "Utente anonimo";
  const cog = utente.cognome ? utente.cognome[0].toUpperCase() + "." : "";
  return `${utente.nome} ${cog}`.trim();
}

export default function SezioneRecensioni({ agriturismo_id }: { agriturismo_id: string }) {
  const [reviews, setReviews] = useState<RecensioneUtente[]>([]);
  const [mia, setMia] = useState<{ id: string; voto: string } | null>(null);
  const [totConsigli, setTotConsigli] = useState(0);
  const [totNon, setTotNon] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [voto, setVoto] = useState<"consiglio" | "non_consiglio" | "">("");
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [invio, setInvio] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [erroreForm, setErroreForm] = useState("");

  useEffect(() => {
    async function carica() {
      const [risp, sb] = await Promise.all([
        fetch(`/api/recensioni?agriturismo_id=${agriturismo_id}`).then((r) => r.json() as Promise<ApiRisposta>),
        Promise.resolve(creaClientBrowser()),
      ]);
      setReviews(risp.recensioni ?? []);
      setMia(risp.mia_recensione);
      setTotConsigli(risp.tot_consigli ?? 0);
      setTotNon(risp.tot_non_consigli ?? 0);

      const { data: { user } } = await sb.auth.getUser();
      setLoggedIn(!!user);
      setLoading(false);
    }
    void carica();
  }, [agriturismo_id]);

  async function handleInvia(e: React.FormEvent) {
    e.preventDefault();
    if (!voto) { setErroreForm("Seleziona se consigli o meno la struttura."); return; }
    if (testo.length < 30) { setErroreForm("Il testo deve essere di almeno 30 caratteri."); return; }
    setErroreForm("");
    setInvio("sending");

    const risposta = await fetch("/api/recensioni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agriturismo_id, voto, titolo, testo }),
    });

    if (risposta.ok) {
      setInvio("success");
    } else {
      const d = await risposta.json() as { errore?: string };
      setErroreForm(d.errore ?? "Errore nell'invio. Riprova.");
      setInvio("error");
    }
  }

  const totale = totConsigli + totNon;
  const pct = totale > 0 ? Math.round((totConsigli / totale) * 100) : null;

  return (
    <section className="border-t border-gray-100 py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Recensioni
      </h2>

      {/* Sommario */}
      {totale > 0 && (
        <div className="mb-8 p-5 rounded-2xl border border-gray-100 bg-gray-50">
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {pct}% consiglia questa struttura
          </p>
          <div className="flex h-2 rounded-full overflow-hidden bg-red-100 mt-3 mb-3 max-w-xs">
            <div
              className="h-full rounded-full bg-[#2D6A4F] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            🟢 {totConsigli} consiglia{totConsigli !== 1 ? "no" : ""} · 🔴 {totNon} non consiglia{totNon !== 1 ? "no" : ""}
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Form recensione */}
          {!loggedIn && (
            <div className="mb-8 p-5 rounded-2xl border border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-3">Hai soggiornato qui? Lascia una recensione.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                Accedi per recensire
              </Link>
            </div>
          )}

          {loggedIn && !mia && invio !== "success" && (
            <div className="mb-8 p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <h3 className="font-semibold text-gray-900 mb-5">La tua esperienza</h3>
              <form onSubmit={(e) => void handleInvia(e)} className="flex flex-col gap-4">
                {/* Voto */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setVoto("consiglio")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      voto === "consiglio"
                        ? "border-[#2D6A4F] bg-green-50 text-[#2D6A4F]"
                        : "border-gray-200 text-gray-600 hover:border-[#2D6A4F]"
                    }`}
                  >
                    ✅ Consiglio
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoto("non_consiglio")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      voto === "non_consiglio"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:border-red-400"
                    }`}
                  >
                    ❌ Non consiglio
                  </button>
                </div>

                {voto === "non_consiglio" && (
                  <div className="px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                    ⚠️ Il tuo giudizio negativo deve essere motivato con un&apos;esperienza reale. Recensioni false o diffamatorie saranno rimosse.
                  </div>
                )}

                <input
                  type="text"
                  required
                  value={titolo}
                  onChange={(e) => setTitolo(e.target.value)}
                  placeholder="Titolo recensione (es. Soggiorno meraviglioso)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />

                <textarea
                  required
                  value={testo}
                  onChange={(e) => setTesto(e.target.value)}
                  rows={4}
                  placeholder="Racconta la tua esperienza. Cosa ti è piaciuto? Come era la struttura? Minimo 30 caratteri."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
                />
                <p className="text-xs text-gray-400 -mt-2">{testo.length}/30 min</p>

                {erroreForm && (
                  <p className="text-xs text-red-500">{erroreForm}</p>
                )}

                <button
                  type="submit"
                  disabled={invio === "sending"}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {invio === "sending" ? "Invio in corso…" : "Invia recensione"}
                </button>
              </form>
            </div>
          )}

          {invio === "success" && (
            <div className="mb-8 p-5 rounded-2xl border border-green-100 bg-green-50 text-center">
              <p className="text-sm font-semibold text-green-700">
                ✅ Recensione inviata! Sarà pubblicata dopo la moderazione.
              </p>
            </div>
          )}

          {loggedIn && mia && (
            <div className="mb-8 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500">
              Hai già recensito questa struttura {!mia.voto ? "" : `— "${mia.voto === "consiglio" ? "✅ Consiglio" : "❌ Non consiglio"}"`.trim()} (in attesa di moderazione).
            </div>
          )}
        </>
      )}

      {/* Lista recensioni */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 && !loading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Sii il primo a recensire questa struttura.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.voto === "consiglio"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.voto === "consiglio" ? "✅ Consiglia" : "❌ Non consiglia"}
                  </span>
                  <span className="text-sm text-gray-500">{nomeBreve(r.utente)}</span>
                </div>
                <time className="text-xs text-gray-400 shrink-0">
                  {new Date(r.created_at).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="font-semibold text-gray-900 mb-1">{r.titolo}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{r.testo}</p>
              {r.risposta_gestore && (
                <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
                  <p className="text-xs text-gray-500">
                    💬 <span className="font-semibold">Risposta della struttura:</span> {r.risposta_gestore}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
