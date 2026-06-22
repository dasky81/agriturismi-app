"use client";

import { useState, useEffect } from "react";
import { creaClientBrowser } from "@/lib/supabase";

interface NetworkLuogo {
  id: string;
  nome: string;
  tipo: string;
  dominio_fonte: string;
  url_scheda: string;
  comune: string | null;
  regione: string | null;
  distanza_km: number;
}

const DOMINI_PROSSIMAMENTE: Record<string, { label: string; dominio: string }> = {
  cantina:    { label: "Cantine",     dominio: "cantine.app" },
  ristorante: { label: "Ristoranti",  dominio: "ristoranti.app" },
  attrazione: { label: "Da vedere",   dominio: "viaggi.app" },
};

const CATEGORIE = [
  { tipo: "cantina",    emoji: "🍷", titolo: "Cantine",    dominio: "cantine.app"    },
  { tipo: "ristorante", emoji: "🍽️", titolo: "Ristoranti", dominio: "ristoranti.app" },
  { tipo: "attrazione", emoji: "🏛️", titolo: "Da vedere",  dominio: "viaggi.app"     },
];

function CardLuoghi({
  emoji, titolo, luoghi, dominio, loading,
}: {
  emoji: string;
  titolo: string;
  luoghi: NetworkLuogo[];
  dominio: string;
  loading: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold text-gray-900 text-sm">{titolo}</h3>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : luoghi.length === 0 ? (
        <p className="text-xs text-gray-400">
          Prossimamente su <span className="font-medium">{dominio}</span>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {luoghi.slice(0, 3).map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
              <a
                href={l.url_scheda}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 truncate hover:text-[#2D6A4F] transition-colors"
              >
                {l.nome}
              </a>
              <span className="text-xs text-gray-400 shrink-0">
                {l.distanza_km < 1
                  ? `${Math.round(l.distanza_km * 1000)} m`
                  : `${l.distanza_km.toFixed(1)} km`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <a
        href={`https://${dominio}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-xs font-semibold text-[#2D6A4F] hover:underline"
      >
        Vedi su {dominio} →
      </a>
    </div>
  );
}

export default function NelleVicinanze({ lat, lng }: { lat: number; lng: number }) {
  const [perTipo, setPerTipo] = useState<Record<string, NetworkLuogo[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = creaClientBrowser();

    async function carica() {
      try {
        const { data } = await sb.rpc("network_luoghi_vicini", {
          lat_utente: lat,
          lng_utente: lng,
          raggio_km: 20,
        }) as { data: NetworkLuogo[] | null };

        if (data) {
          const grouped: Record<string, NetworkLuogo[]> = {};
          for (const l of data) {
            if (!grouped[l.tipo]) grouped[l.tipo] = [];
            grouped[l.tipo].push(l);
          }
          setPerTipo(grouped);
        }
      } catch { /* ignora errori di rete */ }
      setLoading(false);
    }

    void carica();
  }, [lat, lng]);

  return (
    <section className="border-t border-gray-100 py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Nelle vicinanze
        </h2>
        <p className="text-sm text-gray-500 mt-1">Esplora il territorio — il network viaggi.app</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {CATEGORIE.map(({ tipo, emoji, titolo, dominio }) => (
          <CardLuoghi
            key={tipo}
            emoji={emoji}
            titolo={titolo}
            luoghi={perTipo[tipo] ?? []}
            dominio={dominio}
            loading={loading}
          />
        ))}
      </div>

      <p className="text-[10px] text-gray-300 mt-4 text-center">
        Powered by viaggi.app network
      </p>
    </section>
  );
}
