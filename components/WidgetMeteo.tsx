"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function WidgetMeteo() {
  const [destinazione, setDestinazione] = useState("");

  function apriMeteo(e: React.FormEvent) {
    e.preventDefault();
    const dest = destinazione.trim();
    if (!dest) return;
    const slug = dest.toLowerCase().replace(/\s+/g, "-").replace(/[àáâã]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u");
    window.open(`https://meteo.travel/${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        {/* Titolo */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              🌤️ Meteo per la tua vacanza
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              powered by{" "}
              <a
                href="https://meteo.travel"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 transition-colors"
              >
                meteo.travel
              </a>
            </p>
          </div>
          <a
            href="https://meteo.travel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#2D6A4F] transition-colors shrink-0"
          >
            Vedi meteo attuale
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Form ricerca */}
        <form onSubmit={apriMeteo} className="flex gap-2">
          <input
            type="text"
            value={destinazione}
            onChange={(e) => setDestinazione(e.target.value)}
            placeholder="Dove vuoi andare? es. Siena, Taormina, Matera…"
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
          />
          <button
            type="submit"
            disabled={!destinazione.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 shrink-0"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            🌤️ Vedi meteo
          </button>
        </form>

        <p className="text-[11px] text-gray-400 mt-3">
          Aprirà meteo.travel con le previsioni per la tua destinazione
        </p>
      </div>
    </section>
  );
}
