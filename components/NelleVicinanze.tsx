"use client";

import { useState, useEffect } from "react";

interface OverpassNode {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OverpassRisposta {
  elements: OverpassNode[];
}

interface Luogo {
  id: number;
  nome: string;
  distanza: number;
  lat: number;
  lon: number;
}

function distanzaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

async function fetchOverpass(query: string): Promise<OverpassNode[]> {
  const resp = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(10000),
  });
  const d = (await resp.json()) as OverpassRisposta;
  return d.elements ?? [];
}

function toLuoghi(nodes: OverpassNode[], lat: number, lng: number, max: number): Luogo[] {
  return nodes
    .filter((n) => n.tags?.name)
    .map((n) => ({
      id: n.id,
      nome: n.tags.name,
      distanza: distanzaKm(lat, lng, n.lat, n.lon),
      lat: n.lat,
      lon: n.lon,
    }))
    .sort((a, b) => a.distanza - b.distanza)
    .slice(0, max);
}

function CardLuoghi({
  emoji,
  titolo,
  luoghi,
  linkLabel,
  linkHref,
  loading,
}: {
  emoji: string;
  titolo: string;
  luoghi: Luogo[];
  linkLabel: string;
  linkHref: string;
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
        <p className="text-xs text-gray-400">Nessuno trovato nelle vicinanze.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {luoghi.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-gray-700 truncate">{l.nome}</span>
              <span className="text-xs text-gray-400 shrink-0">
                {l.distanza < 1
                  ? `${Math.round(l.distanza * 1000)} m`
                  : `${l.distanza.toFixed(1)} km`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-xs font-semibold text-[#2D6A4F] hover:underline"
      >
        {linkLabel} →
      </a>
    </div>
  );
}

export default function NelleVicinanze({ lat, lng }: { lat: number; lng: number }) {
  const [cantine, setCantine] = useState<Luogo[]>([]);
  const [ristoranti, setRistoranti] = useState<Luogo[]>([]);
  const [attrazioni, setAttrazioni] = useState<Luogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carica() {
      try {
        const [cNodes, rNodes, aNodes] = await Promise.allSettled([
          fetchOverpass(
            `[out:json][timeout:8];node["amenity"="winery"]["name"](around:20000,${lat},${lng});out body 10;`
          ),
          fetchOverpass(
            `[out:json][timeout:8];node["amenity"="restaurant"]["name"](around:5000,${lat},${lng});out body 10;`
          ),
          fetchOverpass(
            `[out:json][timeout:8];node["tourism"="attraction"]["name"](around:15000,${lat},${lng});out body 10;`
          ),
        ]);

        if (cNodes.status === "fulfilled") setCantine(toLuoghi(cNodes.value, lat, lng, 3));
        if (rNodes.status === "fulfilled") setRistoranti(toLuoghi(rNodes.value, lat, lng, 3));
        if (aNodes.status === "fulfilled") setAttrazioni(toLuoghi(aNodes.value, lat, lng, 3));
      } catch { /* silently ignore */ }
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
        <CardLuoghi
          emoji="🍷"
          titolo="Cantine"
          luoghi={cantine}
          linkLabel="Vedi su cantine.app"
          linkHref="https://cantine.app"
          loading={loading}
        />
        <CardLuoghi
          emoji="🍽️"
          titolo="Ristoranti"
          luoghi={ristoranti}
          linkLabel="Vedi su ristoranti.app"
          linkHref="https://ristoranti.app"
          loading={loading}
        />
        <CardLuoghi
          emoji="🏛️"
          titolo="Da vedere"
          luoghi={attrazioni}
          linkLabel="Pianifica con viaggi.app"
          linkHref="https://viaggi.app"
          loading={loading}
        />
      </div>

      <p className="text-[10px] text-gray-300 mt-4 text-center">
        Powered by viaggi.app network · Dati: OpenStreetMap
      </p>
    </section>
  );
}
