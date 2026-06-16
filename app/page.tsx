"use client";

import { useState } from "react";
import { Search, Loader2, MapPin, Tag, Home, Star } from "lucide-react";
import type { FiltriRicerca } from "@/lib/claude";

type StatoRicerca = "inattivo" | "caricamento" | "completato" | "errore";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [stato, setStato] = useState<StatoRicerca>("inattivo");
  const [filtri, setFiltri] = useState<FiltriRicerca | null>(null);
  const [messaggioErrore, setMessaggioErrore] = useState("");

  async function handleCerca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    setStato("caricamento");
    setFiltri(null);
    setMessaggioErrore("");

    try {
      const risposta = await fetch("/api/ricerca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!risposta.ok) {
        throw new Error(`Errore ${risposta.status}`);
      }

      const dati = (await risposta.json()) as { filtri: FiltriRicerca };
      setFiltri(dati.filtri);
      setStato("completato");
    } catch {
      setMessaggioErrore("Si è verificato un errore. Riprova.");
      setStato("errore");
    }
  }

  function handleSuggerimento(testo: string) {
    setQuery(testo);
    setFiltri(null);
    setStato("inattivo");
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header */}
      <header className="w-full py-4 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight" style={{ color: "#2D6A4F" }}>
            agriturismi.app
          </span>
          <nav className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-[#2D6A4F] transition-colors">Esplora</a>
            <a href="#" className="hover:text-[#2D6A4F] transition-colors">Blog</a>
            <a href="#" className="hover:text-[#2D6A4F] transition-colors">Accedi</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ color: "#2D6A4F" }}
            >
              Trova il tuo agriturismo
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
              Descrivi la vacanza che sogni e la nostra AI troverà l&apos;agriturismo perfetto per te.
            </p>
          </div>

          {/* Barra di ricerca */}
          <form onSubmit={handleCerca} className="w-full flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca un agriturismo in linguaggio naturale..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={stato === "caricamento" || !query.trim()}
              className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D6A4F] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              {stato === "caricamento" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analisi...
                </>
              ) : (
                "Cerca"
              )}
            </button>
          </form>

          {/* Tag suggerimenti */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Agriturismo con piscina in Toscana",
              "Fattoria didattica per bambini",
              "Degustazione vini in Sicilia",
              "B&B biologico in Umbria",
            ].map((suggerimento) => (
              <button
                key={suggerimento}
                onClick={() => handleSuggerimento(suggerimento)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:text-white"
                style={{
                  borderColor: "#D4A017",
                  color: "#D4A017",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D4A017";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#D4A017";
                }}
              >
                {suggerimento}
              </button>
            ))}
          </div>

          {/* Risultato filtri */}
          {stato === "errore" && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {messaggioErrore}
            </div>
          )}

          {stato === "completato" && filtri && (
            <div
              className="w-full rounded-xl border bg-white shadow-sm px-6 py-5 flex flex-col gap-4"
              style={{ borderColor: "#2D6A4F33" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#2D6A4F" }}>
                Filtri interpretati dall&apos;AI
              </p>

              <div className="flex flex-col gap-3">
                {(filtri.regione || filtri.provincia) && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="shrink-0" style={{ color: "#2D6A4F" }} />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Luogo:</span>{" "}
                      {[filtri.provincia, filtri.regione].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}

                {filtri.tipo_ospitalita.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Home size={16} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                    <div className="flex flex-wrap gap-2">
                      {filtri.tipo_ospitalita.map((tipo) => (
                        <span
                          key={tipo}
                          className="px-3 py-1 rounded-full text-xs font-medium border"
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
                    <Tag size={16} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                    <div className="flex flex-wrap gap-2">
                      {filtri.servizi.map((servizio) => (
                        <span
                          key={servizio}
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
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
                    <Star size={16} className="shrink-0 mt-0.5" style={{ color: "#2D6A4F" }} />
                    <div className="flex flex-wrap gap-2">
                      {filtri.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!filtri.regione && !filtri.provincia && filtri.tipo_ospitalita.length === 0 && filtri.servizi.length === 0 && filtri.keywords.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nessun filtro specifico rilevato. Prova a essere più preciso nella ricerca.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        © 2026 agriturismi.app — Tutti i diritti riservati
      </footer>
    </div>
  );
}
