"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  MapPin,
  Tag,
  Home as HomeIcon,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import type { FiltriRicerca } from "@/lib/claude";

type StatoRicerca = "inattivo" | "caricamento" | "completato" | "errore";

const SUGGERIMENTI = [
  "Agriturismo con piscina in Toscana",
  "Fattoria didattica per bambini",
  "Degustazione vini in Sicilia",
  "B&B biologico in Umbria",
];

const COME_FUNZIONA = [
  {
    icona: <MessageSquare size={28} strokeWidth={1.5} />,
    titolo: "Descrivi la tua vacanza",
    desc: "Scrivi in modo naturale cosa cerchi: la regione, i servizi, il tipo di esperienza che sogni.",
  },
  {
    icona: <Sparkles size={28} strokeWidth={1.5} />,
    titolo: "L'AI interpreta",
    desc: "Il nostro motore analizza la tua richiesta e individua i filtri più rilevanti in pochi secondi.",
  },
  {
    icona: <MapPin size={28} strokeWidth={1.5} />,
    titolo: "Trova il perfetto",
    desc: "Ottieni una selezione di agriturismi su misura, pronti da esplorare con un click.",
  },
];

const REGIONI = [
  { nome: "Toscana", emoji: "🌻", colore: "#C8733A", query: "Agriturismi in Toscana" },
  { nome: "Umbria", emoji: "🫒", colore: "#5C7A2F", query: "Agriturismi in Umbria" },
  { nome: "Sicilia", emoji: "🍋", colore: "#C9A227", query: "Agriturismi in Sicilia" },
  { nome: "Puglia", emoji: "🏺", colore: "#B8732C", query: "Agriturismi in Puglia" },
  { nome: "Piemonte", emoji: "🍇", colore: "#7A4C8C", query: "Agriturismi in Piemonte" },
  { nome: "Veneto", emoji: "🍾", colore: "#3D7C8C", query: "Agriturismi in Veneto" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [stato, setStato] = useState<StatoRicerca>("inattivo");
  const [filtri, setFiltri] = useState<FiltriRicerca | null>(null);
  const [messaggioErrore, setMessaggioErrore] = useState("");

  async function cercaQuery(q: string) {
    if (!q.trim()) return;
    setStato("caricamento");
    setFiltri(null);
    setMessaggioErrore("");
    try {
      const risposta = await fetch("/api/ricerca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!risposta.ok) throw new Error(`Errore ${risposta.status}`);
      const dati = (await risposta.json()) as { filtri: FiltriRicerca };
      setFiltri(dati.filtri);
      setStato("completato");
    } catch {
      setMessaggioErrore("Si è verificato un errore. Riprova.");
      setStato("errore");
    }
  }

  function handleCerca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void cercaQuery(query);
  }

  function handleSuggerimento(testo: string) {
    setQuery(testo);
    setFiltri(null);
    setStato("inattivo");
  }

  function handleRegione(q: string) {
    setQuery(q);
    window.scrollTo({ top: 0, behavior: "smooth" });
    void cercaQuery(q);
  }

  return (
    <div className="flex flex-col flex-1">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          {/* Eyebrow */}
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-4">
            Motore di ricerca AI · Agriturismi italiani
          </p>

          {/* Titolo */}
          <h1
            className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight mb-5"
          >
            Trova il tuo angolo<br />d&apos;Italia
          </h1>
          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Descrivi la vacanza che sogni, l&apos;AI trova l&apos;agriturismo perfetto per te
          </p>

          {/* Barra ricerca */}
          <form
            onSubmit={handleCerca}
            className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2 max-w-2xl mx-auto"
          >
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 shrink-0"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="es. Agriturismo con piscina in Toscana per famiglie..."
                className="w-full pl-11 pr-3 py-3.5 rounded-xl text-gray-800 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={stato === "caricamento" || !query.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-2 shrink-0"
              style={{ backgroundColor: "#1B4332" }}
            >
              {stato === "caricamento" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Analisi...
                </>
              ) : (
                "Cerca"
              )}
            </button>
          </form>

          {/* Suggerimenti */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {SUGGERIMENTI.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggerimento(s)}
                className="px-4 py-1.5 rounded-full text-sm border border-white/25 text-white/65 hover:bg-white/15 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── RISULTATI RICERCA ────────────────────────────────────── */}
      {(stato === "completato" || stato === "errore") && (
        <section className="bg-white border-b border-gray-100 py-8">
          <div className="max-w-2xl mx-auto px-4">
            {stato === "errore" && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
                {messaggioErrore}
              </div>
            )}

            {stato === "completato" && filtri && (
              <div
                className="rounded-2xl border bg-white shadow-sm px-6 py-5 flex flex-col gap-4"
                style={{ borderColor: "#2D6A4F33" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#2D6A4F" }}
                >
                  Filtri interpretati dall&apos;AI
                </p>

                <div className="flex flex-col gap-3">
                  {(filtri.regione ?? filtri.provincia) && (
                    <div className="flex items-center gap-3">
                      <MapPin size={15} className="shrink-0" style={{ color: "#2D6A4F" }} />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Luogo:</span>{" "}
                        {[filtri.provincia, filtri.regione].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}

                  {filtri.tipo_ospitalita.length > 0 && (
                    <div className="flex items-start gap-3">
                      <HomeIcon size={15} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                      <div className="flex flex-wrap gap-2">
                        {filtri.tipo_ospitalita.map((tipo) => (
                          <span
                            key={tipo}
                            className="px-3 py-0.5 rounded-full text-xs font-medium border"
                            style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}
                          >
                            {tipo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {filtri.servizi.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Tag size={15} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                      <div className="flex flex-wrap gap-2">
                        {filtri.servizi.map((servizio) => (
                          <span
                            key={servizio}
                            className="px-3 py-0.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: "#D4A017" }}
                          >
                            {servizio}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {filtri.keywords.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Star size={15} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                      <div className="flex flex-wrap gap-2">
                        {filtri.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!filtri.regione &&
                    !filtri.provincia &&
                    filtri.tipo_ospitalita.length === 0 &&
                    filtri.servizi.length === 0 &&
                    filtri.keywords.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Nessun filtro specifico rilevato. Prova a essere più preciso nella ricerca.
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── COME FUNZIONA ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ color: "#1B4332" }}
          >
            Come funziona
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-md mx-auto">
            Trovare l&apos;agriturismo ideale non è mai stato così semplice.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {COME_FUNZIONA.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {step.icona}
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "#52B788" }}
                  >
                    Step {i + 1}
                  </p>
                  <h3
                    className="font-display font-bold text-lg mb-2"
                    style={{ color: "#1B4332" }}
                  >
                    {step.titolo}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGIONI ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ color: "#1B4332" }}
          >
            Esplora per regione
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Scegli una regione e lascia parlare il territorio.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {REGIONI.map((r) => (
              <button
                key={r.nome}
                onClick={() => handleRegione(r.query)}
                className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${r.colore}14 0%, ${r.colore}07 100%)`,
                  borderColor: `${r.colore}30`,
                }}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {r.emoji}
                </span>
                <span
                  className="font-display font-bold text-base"
                  style={{ color: "#1B4332" }}
                >
                  {r.nome}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Logo + tagline */}
            <div>
              <p
                className="font-display text-xl font-bold text-white mb-1"
              >
                agriturismi.app
              </p>
              <p className="text-white/50 text-sm">
                Il motore di ricerca AI per gli agriturismi italiani.
              </p>
            </div>

            {/* Link */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/", label: "Esplora" },
                { href: "/blog", label: "Blog" },
                { href: "/login", label: "Accedi" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div
            className="mt-10 pt-6 border-t text-xs text-white/35 flex flex-col sm:flex-row justify-between gap-2"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <span>© 2026 agriturismi.app — Tutti i diritti riservati</span>
            <span>Made in Italy 🇮🇹</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
