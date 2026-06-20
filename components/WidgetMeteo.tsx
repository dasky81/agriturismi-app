"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

const WMO: Record<number, { emoji: string; desc: string }> = {
  0:  { emoji: "☀️",  desc: "Sereno" },
  1:  { emoji: "🌤️", desc: "Prevalentemente sereno" },
  2:  { emoji: "⛅",  desc: "Parzialmente nuvoloso" },
  3:  { emoji: "☁️",  desc: "Coperto" },
  45: { emoji: "🌫️", desc: "Nebbia" },
  48: { emoji: "🌫️", desc: "Nebbia con brina" },
  51: { emoji: "🌦️", desc: "Pioggerella leggera" },
  53: { emoji: "🌦️", desc: "Pioggerella" },
  55: { emoji: "🌧️", desc: "Pioggerella intensa" },
  61: { emoji: "🌧️", desc: "Pioggia leggera" },
  63: { emoji: "🌧️", desc: "Pioggia" },
  65: { emoji: "🌧️", desc: "Pioggia intensa" },
  71: { emoji: "❄️",  desc: "Neve leggera" },
  73: { emoji: "❄️",  desc: "Neve" },
  75: { emoji: "❄️",  desc: "Neve intensa" },
  77: { emoji: "🌨️", desc: "Neve granulare" },
  80: { emoji: "🌦️", desc: "Rovesci leggeri" },
  81: { emoji: "🌦️", desc: "Rovesci" },
  82: { emoji: "🌧️", desc: "Rovesci intensi" },
  95: { emoji: "⛈️",  desc: "Temporale" },
  96: { emoji: "⛈️",  desc: "Temporale con grandine" },
  99: { emoji: "⛈️",  desc: "Temporale forte" },
};

function meteoInfo(code: number) {
  return WMO[code] ?? { emoji: "🌡️", desc: "Meteo" };
}

interface Meteo {
  temp: number;
  code: number;
  vento: number;
  citta?: string;
}

async function fetchMeteo(lat: number, lng: number, citta?: string): Promise<Meteo> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`;
  const r = await fetch(url);
  const d = await r.json() as {
    current: { temperature_2m: number; weathercode: number; windspeed_10m: number };
  };
  return {
    temp: Math.round(d.current.temperature_2m),
    code: d.current.weathercode,
    vento: Math.round(d.current.windspeed_10m),
    citta,
  };
}

async function geocodifica(q: string): Promise<{ lat: number; lng: number; nome: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  const r = await fetch(url, { headers: { "User-Agent": "agriturismi.app/1.0" } });
  const data = await r.json() as Array<{ lat: string; lon: string; display_name: string }>;
  if (!data.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    nome: data[0].display_name.split(",")[0],
  };
}

function SchermataMeteo({ m }: { m: Meteo }) {
  const info = meteoInfo(m.code);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-4xl">{info.emoji}</span>
      <p className="text-2xl font-bold text-gray-900 mt-1">{m.temp}°C</p>
      <p className="text-sm text-gray-500">{info.desc}</p>
      <p className="text-xs text-gray-400">
        {m.citta ? `${m.citta} · ` : ""}Vento {m.vento} km/h
      </p>
    </div>
  );
}

export default function WidgetMeteo() {
  const [meteoLocale, setMeteoLocale] = useState<Meteo | null>(null);
  const [meteoDest, setMedeoDest] = useState<Meteo | null>(null);
  const [cercandoGeo, setCercandoGeo] = useState(false);
  const [cercandoDest, setCercandoDest] = useState(false);
  const [input, setInput] = useState("");
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    setCercandoGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void fetchMeteo(pos.coords.latitude, pos.coords.longitude, "Posizione attuale")
          .then(setMeteoLocale)
          .finally(() => setCercandoGeo(false));
      },
      () => { setGeoError(true); setCercandoGeo(false); },
      { timeout: 8000 }
    );
  }, []);

  async function cercaDestinazione(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setCercandoDest(true);
    try {
      const loc = await geocodifica(input.trim());
      if (loc) {
        const m = await fetchMeteo(loc.lat, loc.lng, loc.nome);
        setMedeoDest(m);
      }
    } catch { /* ignore */ }
    setCercandoDest(false);
  }

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">🌤️ Meteo</h2>
        <div className="grid sm:grid-cols-2 gap-8">

          {/* Posizione attuale */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Dove sei
            </p>
            {cercandoGeo ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Rilevazione posizione…
              </div>
            ) : geoError ? (
              <p className="text-sm text-gray-400">Posizione non disponibile</p>
            ) : meteoLocale ? (
              <SchermataMeteo m={meteoLocale} />
            ) : (
              <p className="text-sm text-gray-400">
                Consenti l&apos;accesso alla posizione per vedere il meteo locale
              </p>
            )}
          </div>

          {/* Destinazione */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Dove vuoi andare?
            </p>
            <form onSubmit={(e) => void cercaDestinazione(e)} className="flex gap-2 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="es. Siena, Matera, Taormina…"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
              <button
                type="submit"
                disabled={cercandoDest || !input.trim()}
                className="px-3 py-2 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                {cercandoDest
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Search size={14} />}
              </button>
            </form>
            {meteoDest && <SchermataMeteo m={meteoDest} />}
          </div>
        </div>
      </div>
    </section>
  );
}
