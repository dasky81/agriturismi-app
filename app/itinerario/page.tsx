"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const TIPI = ["Solo", "Coppia", "Famiglia con bambini", "Amici", "Over 60"];
const INTERESSI = [
  { id: "vino", label: "🍷 Vino e cantine" },
  { id: "agriturismo", label: "🌾 Agriturismo" },
  { id: "arte", label: "🏛️ Arte e cultura" },
  { id: "mare", label: "🏖️ Mare" },
  { id: "trekking", label: "🥾 Trekking" },
  { id: "gastronomia", label: "🍽️ Gastronomia" },
  { id: "cicloturismo", label: "🚴 Cicloturismo" },
];

interface GiornoItinerario {
  numero: number;
  mattina: string;
  pranzo: string;
  pomeriggio: string;
  cena: string;
}

interface ItinerarioAI {
  destinazione: string;
  giorni: GiornoItinerario[];
}

function ItinerarioApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [dove, setDove] = useState(searchParams.get("dove") ?? "");
  const [giorni, setGiorni] = useState(Number(searchParams.get("giorni") ?? 3));
  const [tipo, setTipo] = useState(searchParams.get("tipo") ?? TIPI[0]);
  const [interessi, setInteressi] = useState<string[]>(
    searchParams.get("interessi")?.split(",").filter(Boolean) ?? []
  );
  const [caricando, setCaricando] = useState(false);
  const [itinerario, setItinerario] = useState<ItinerarioAI | null>(null);
  const [errore, setErrore] = useState("");
  const [copiato, setCopiato] = useState(false);

  function toggleInteresse(id: string) {
    setInteressi((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function genera(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!dove.trim()) return;
    setCaricando(true);
    setErrore("");
    setItinerario(null);

    const params = new URLSearchParams({
      dove: dove.trim(),
      giorni: String(giorni),
      tipo,
      interessi: interessi.join(","),
    });
    router.replace(`/itinerario?${params.toString()}`, { scroll: false });

    const risposta = await fetch("/api/itinerario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinazione: dove.trim(),
        giorni,
        tipo,
        interessi: interessi.map((id) => INTERESSI.find((i) => i.id === id)?.label ?? id),
      }),
    });

    if (risposta.ok) {
      const d = await risposta.json() as { itinerario: ItinerarioAI };
      setItinerario(d.itinerario);
    } else {
      setErrore("Si è verificato un errore. Riprova tra un momento.");
    }
    setCaricando(false);
  }

  useEffect(() => {
    if (searchParams.get("dove") && !itinerario && !caricando) {
      void genera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function condividi() {
    void navigator.clipboard.writeText(window.location.href);
    setCopiato(true);
    setTimeout(() => setCopiato(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20 text-center">
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-3">
            network viaggi.app
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            🗺️ Crea il tuo itinerario con l&apos;AI
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto">
            Dimmi dove vai e per quanti giorni, l&apos;AI del network viaggi.app costruisce
            il tuo itinerario perfetto.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto w-full px-4 py-10">
        <form onSubmit={(e) => void genera(e)} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
              Dove vuoi andare?
            </label>
            <input
              type="text"
              required
              value={dove}
              onChange={(e) => setDove(e.target.value)}
              placeholder="es. Toscana, Sicilia, Lago di Garda…"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
                Quanti giorni?
              </label>
              <select
                value={giorni}
                onChange={(e) => setGiorni(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "giorno" : "giorni"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
                Con chi viaggi?
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
              >
                {TIPI.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">
              Interessi
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESSI.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => toggleInteresse(i.id)}
                  className={`px-3 py-2 rounded-xl text-sm border-2 transition-all ${
                    interessi.includes(i.id)
                      ? "border-[#2D6A4F] bg-green-50 text-[#2D6A4F] font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={caricando || !dove.trim()}
            className="w-full py-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            {caricando ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generazione in corso…
              </>
            ) : (
              "Genera itinerario con AI"
            )}
          </button>
        </form>

        {errore && (
          <p className="mt-4 text-sm text-red-500 text-center">{errore}</p>
        )}
      </div>

      {/* Output itinerario */}
      {itinerario && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-14">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Il tuo itinerario a {itinerario.destinazione} — {itinerario.giorni.length}{" "}
              {itinerario.giorni.length === 1 ? "giorno" : "giorni"}
            </h2>
            <button
              onClick={condividi}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copiato ? "✅ Copiato!" : "🔗 Condividi"}
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {itinerario.giorni.map((g) => (
              <div
                key={g.numero}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-gray-50" style={{ backgroundColor: "#F0FDF4" }}>
                  <p className="font-semibold text-[#2D6A4F] text-sm">Giorno {g.numero}</p>
                </div>
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "🌅 Mattina", testo: g.mattina },
                    { label: "🍽️ Pranzo", testo: g.pranzo },
                    { label: "☀️ Pomeriggio", testo: g.pomeriggio },
                    { label: "🌙 Cena", testo: g.cena },
                  ].map(({ label, testo }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{testo}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/?q=agriturismo a ${encodeURIComponent(itinerario.destinazione)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Cerca agriturismi a {itinerario.destinazione} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItinerarioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center flex-1 py-24">
          <Loader2 size={28} className="animate-spin text-[#2D6A4F]" />
        </div>
      }
    >
      <ItinerarioApp />
    </Suspense>
  );
}
