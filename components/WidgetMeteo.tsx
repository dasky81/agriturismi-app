"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Loader2, Wind, Droplets } from "lucide-react";

// ── Tipi ────────────────────────────────────────────────────────────────────
interface Previsione {
  data: string;
  code: number;
  max: number;
  min: number;
}

interface DatiMeteo {
  temp: number;
  humidity: number;
  windspeed: number;
  code: number;
  citta: string;
  paese: string;
  previsioni: Previsione[];
}

type StatoGeo = "loading" | "success" | "denied" | "error";
type StatoCerca = "idle" | "loading" | "notfound" | "error";

// ── WMO weather codes ────────────────────────────────────────────────────────
function wmo(code: number): { emoji: string; desc: string } {
  if (code === 0) return { emoji: "☀️", desc: "Sereno" };
  if (code <= 2) return { emoji: "🌤️", desc: "Parzialmente nuvoloso" };
  if (code === 3) return { emoji: "☁️", desc: "Coperto" };
  if (code <= 48) return { emoji: "🌫️", desc: "Nebbia" };
  if (code <= 55) return { emoji: "🌦️", desc: "Pioggerella" };
  if (code <= 65) return { emoji: "🌧️", desc: "Pioggia" };
  if (code <= 75) return { emoji: "❄️", desc: "Neve" };
  if (code <= 77) return { emoji: "🌨️", desc: "Neve granulare" };
  if (code <= 82) return { emoji: "🌦️", desc: "Rovesci" };
  if (code === 95) return { emoji: "⛈️", desc: "Temporale" };
  return { emoji: "⛈️", desc: "Temporale con grandine" };
}

// ── Formattazione ─────────────────────────────────────────────────────────────
const GIORNI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

function formatDataIt(d: Date): string {
  return `${GIORNI[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]}`;
}

function formatOra(d: Date): string {
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

function giornoBreveForecast(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return GIORNI[d.getDay()].slice(0, 3).toUpperCase();
}

// ── API types ─────────────────────────────────────────────────────────────────
interface RispostaOpenMeteo {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    windspeed_10m: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface RispostaNominatim {
  lat: string;
  lon: string;
  display_name: string;
}

// ── API calls ──────────────────────────────────────────────────────────────────
async function fetchOpenMeteo(lat: number, lng: number): Promise<RispostaOpenMeteo> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("meteo error");
  return r.json() as Promise<RispostaOpenMeteo>;
}

async function reverseGeocode(lat: number, lng: number): Promise<{ citta: string; paese: string }> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=it`,
      { headers: { "User-Agent": "agriturismi.app/1.0" } }
    );
    const d = await r.json() as {
      address: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        country?: string;
      };
    };
    const citta =
      d.address.city ??
      d.address.town ??
      d.address.village ??
      d.address.municipality ??
      d.address.county ??
      "La tua posizione";
    return { citta, paese: d.address.country ?? "" };
  } catch {
    return { citta: "La tua posizione", paese: "" };
  }
}

async function geocodifica(
  query: string
): Promise<{ lat: number; lng: number; citta: string; paese: string } | null> {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=it`,
    { headers: { "User-Agent": "agriturismi.app/1.0" } }
  );
  const data = await r.json() as RispostaNominatim[];
  if (!data.length) return null;
  const parti = data[0].display_name.split(",");
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    citta: parti[0].trim(),
    paese: parti[parti.length - 1].trim(),
  };
}

async function costruisciMeteo(
  lat: number,
  lng: number,
  citta: string,
  paese: string
): Promise<DatiMeteo> {
  const d = await fetchOpenMeteo(lat, lng);
  return {
    temp: Math.round(d.current.temperature_2m),
    humidity: Math.round(d.current.relative_humidity_2m),
    windspeed: Math.round(d.current.windspeed_10m),
    code: d.current.weathercode,
    citta,
    paese,
    previsioni: d.daily.time.map((t, i) => ({
      data: t,
      code: d.daily.weathercode[i],
      max: Math.round(d.daily.temperature_2m_max[i]),
      min: Math.round(d.daily.temperature_2m_min[i]),
    })),
  };
}

// ── Componente ─────────────────────────────────────────────────────────────────
export default function WidgetMeteo() {
  const [meteoLocale, setMeteoLocale] = useState<DatiMeteo | null>(null);
  const [meteoDest, setMeteoDest] = useState<DatiMeteo | null>(null);
  const [statoGeo, setStatoGeo] = useState<StatoGeo>("loading");
  const [statoCerca, setStatoCerca] = useState<StatoCerca>("idle");
  const [inputCerca, setInputCerca] = useState("");
  const [ora, setOra] = useState("");
  const [dataOggi, setDataOggi] = useState("");

  useEffect(() => {
    function aggiorna() {
      const now = new Date();
      setOra(formatOra(now));
      setDataOggi(formatDataIt(now));
    }
    aggiorna();
    const iv = setInterval(aggiorna, 60_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatoGeo("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const { citta, paese } = await reverseGeocode(lat, lng);
          const dati = await costruisciMeteo(lat, lng, citta, paese);
          setMeteoLocale(dati);
          setStatoGeo("success");
        } catch {
          setStatoGeo("error");
        }
      },
      () => setStatoGeo("denied"),
      { timeout: 8000 }
    );
  }, []);

  async function handleGeoClick() {
    if (!("geolocation" in navigator)) { setStatoGeo("denied"); return; }
    setStatoGeo("loading");
    setMeteoDest(null);
    setInputCerca("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const { citta, paese } = await reverseGeocode(lat, lng);
          const dati = await costruisciMeteo(lat, lng, citta, paese);
          setMeteoLocale(dati);
          setStatoGeo("success");
        } catch {
          setStatoGeo("error");
        }
      },
      () => setStatoGeo("denied"),
      { timeout: 8000 }
    );
  }

  async function handleCerca(e: React.FormEvent) {
    e.preventDefault();
    const q = inputCerca.trim();
    if (!q) return;
    setStatoCerca("loading");
    try {
      const loc = await geocodifica(q);
      if (!loc) { setStatoCerca("notfound"); return; }
      const dati = await costruisciMeteo(loc.lat, loc.lng, loc.citta, loc.paese);
      setMeteoDest(dati);
      setStatoCerca("idle");
    } catch {
      setStatoCerca("error");
    }
  }

  const datiAttivi = meteoDest ?? meteoLocale;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="grid min-w-0 lg:grid-cols-[300px_1fr]">

        {/* ── SINISTRA — Meteo posizione attuale ─────────────────── */}
        <div className="flex flex-col gap-5 p-5 sm:p-7 min-w-0" style={{ backgroundColor: "#0F172A" }}>

          {/* Branding */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 whitespace-nowrap">
            🌤️ Meteo · powered by{" "}
            <a
              href="https://meteo.travel"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              meteo.travel
            </a>
          </p>

          {/* Ora */}
          {ora && (
            <div>
              <p className="text-3xl font-bold text-white tabular-nums tracking-tight">{ora}</p>
              <p className="text-xs text-white/40 mt-0.5 capitalize">{dataOggi}</p>
            </div>
          )}

          {/* Stato meteo */}
          {statoGeo === "loading" && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Loader2 size={15} className="animate-spin" />
              Rilevamento posizione…
            </div>
          )}

          {statoGeo === "denied" && (
            <div className="flex flex-col gap-3">
              <p className="text-white/40 text-xs leading-relaxed">
                Attiva la posizione nel browser per vedere il meteo della tua zona.
              </p>
              <button
                onClick={() => void handleGeoClick()}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#52B788] hover:text-white transition-colors w-fit"
              >
                <MapPin size={12} /> Prova di nuovo
              </button>
            </div>
          )}

          {statoGeo === "error" && (
            <div className="flex flex-col gap-3">
              <p className="text-white/40 text-xs">Impossibile ottenere il meteo attuale.</p>
              <button
                onClick={() => void handleGeoClick()}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#52B788] hover:text-white transition-colors w-fit"
              >
                <MapPin size={12} /> Riprova
              </button>
            </div>
          )}

          {statoGeo === "success" && meteoLocale && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-white font-semibold text-lg leading-tight">{meteoLocale.citta}</p>
                {meteoLocale.paese && (
                  <p className="text-white/30 text-xs mt-0.5">{meteoLocale.paese}</p>
                )}
              </div>

              <div className="flex items-end gap-3">
                <span className="text-6xl sm:text-7xl font-bold text-white tabular-nums leading-none">
                  {meteoLocale.temp}°
                </span>
                <span className="text-4xl sm:text-5xl mb-1.5">{wmo(meteoLocale.code).emoji}</span>
              </div>

              <p className="text-white/60 text-sm">{wmo(meteoLocale.code).desc}</p>

              <div className="flex gap-5 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Droplets size={12} /> {meteoLocale.humidity}%
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Wind size={12} /> {meteoLocale.windspeed} km/h
                </div>
              </div>
            </div>
          )}

          {/* Aggiorna posizione (fondo card) */}
          {statoGeo === "success" && (
            <button
              onClick={() => void handleGeoClick()}
              className="mt-auto flex items-center gap-1.5 text-[10px] text-white/20 hover:text-white/50 transition-colors w-fit"
            >
              <MapPin size={11} /> Aggiorna posizione
            </button>
          )}
        </div>

        {/* ── DESTRA — Cerca destinazione + Previsioni ────────────── */}
        <div className="flex flex-col gap-6 p-5 sm:p-7 bg-white min-w-0">

          {/* Form ricerca */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Cerca destinazione
            </p>
            <form onSubmit={(e) => void handleCerca(e)} className="flex flex-col gap-2">
              <input
                type="text"
                value={inputCerca}
                onChange={(e) => setInputCerca(e.target.value)}
                placeholder="es. Firenze, Taormina, Alberobello…"
                className="block w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition min-w-0"
              />
              <button
                type="submit"
                disabled={!inputCerca.trim() || statoCerca === "loading"}
                className="block w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                {statoCerca === "loading" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
                Cerca
              </button>
            </form>

            {statoCerca === "notfound" && (
              <p className="mt-2 text-xs text-red-500">
                Destinazione non trovata. Prova un termine più specifico.
              </p>
            )}
            {statoCerca === "error" && (
              <p className="mt-2 text-xs text-red-500">
                Errore di rete. Riprova tra un momento.
              </p>
            )}
          </div>

          {/* Previsioni 7 giorni */}
          {datiAttivi ? (
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Previsioni 7 giorni
                {meteoDest && (
                  <span className="ml-2 normal-case font-normal text-gray-400">
                    · {meteoDest.citta}
                  </span>
                )}
                {!meteoDest && meteoLocale && (
                  <span className="ml-2 normal-case font-normal text-gray-400">
                    · {meteoLocale.citta}
                  </span>
                )}
              </p>
              <div className="overflow-x-auto">
                <div className="flex gap-2 pb-1">
                {datiAttivi.previsioni.map((p) => {
                  const { emoji } = wmo(p.code);
                  return (
                    <div
                      key={p.data}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors shrink-0 w-14 sm:flex-1 sm:w-auto"
                    >
                      <span className="text-[10px] font-bold text-gray-400">
                        {giornoBreveForecast(p.data)}
                      </span>
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-xs font-bold text-gray-700">{p.max}°</span>
                      <span className="text-[10px] text-gray-400">{p.min}°</span>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-sm text-gray-400 text-center max-w-[200px]">
                {statoGeo === "loading"
                  ? "Caricamento meteo in corso…"
                  : "Cerca una città per vedere le previsioni a 7 giorni."}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <button
              onClick={() => void handleGeoClick()}
              disabled={statoGeo === "loading"}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#2D6A4F] transition-colors disabled:opacity-40"
            >
              {statoGeo === "loading" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <MapPin size={12} />
              )}
              📍 Usa la mia posizione
            </button>
            <p className="text-[10px] text-gray-300">Dati: Open-Meteo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
