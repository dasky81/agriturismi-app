"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const TIPI = [
  { id: "Solo", emoji: "🧍", label: "Solo" },
  { id: "Coppia", emoji: "👫", label: "Coppia" },
  { id: "Famiglia con bambini", emoji: "👨‍👩‍👧", label: "Famiglia" },
  { id: "Amici", emoji: "👥", label: "Amici" },
  { id: "Over 60", emoji: "🧓", label: "Over 60" },
];

const INTERESSI = [
  { id: "vino", label: "🍷 Vino e cantine" },
  { id: "agriturismo", label: "🌾 Agriturismo e natura" },
  { id: "arte", label: "🏛️ Arte e cultura" },
  { id: "mare", label: "🏖️ Mare e relax" },
  { id: "trekking", label: "🥾 Trekking" },
  { id: "gastronomia", label: "🍽️ Gastronomia" },
  { id: "cicloturismo", label: "🚴 Cicloturismo" },
  { id: "borghi", label: "🛕 Borghi storici" },
];

const LOADING_MESSAGES = [
  "Cerco strutture nel network viaggi.app…",
  "Analizzo agriturismi nella zona…",
  "Trovo cantine e ristoranti vicini…",
  "Compongo il tuo itinerario perfetto…",
];

interface Momento {
  attivita: string;
  luogo: string;
  tipo: string;
  nel_network: boolean;
  url_scheda: string | null;
}

interface DoveDormire {
  nome: string;
  tipo: string;
  nel_network: boolean;
  url_scheda: string | null;
}

interface Giornata {
  numero: number;
  titolo: string;
  mattina: Momento;
  pranzo: Momento;
  pomeriggio: Momento;
  cena: Momento;
  dove_dormire: DoveDormire;
}

interface ItinerarioAI {
  titolo: string;
  destinazione: string;
  giorni: number;
  giorni_dettaglio: Giornata[];
  consigli_pratici: string[];
  strutture_network_usate: number;
}

function BadgeNetwork({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors ml-2"
    >
      ✅ Nel network
    </a>
  );
}

function MomentoCard({ label, m }: { label: string; m: Momento }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">
        {m.attivita}
      </p>
      <p className="text-xs text-gray-400 mt-0.5 flex items-center flex-wrap gap-1">
        <span>{m.luogo}</span>
        {m.nel_network && <BadgeNetwork url={m.url_scheda} />}
      </p>
    </div>
  );
}

function ItinerarioApp() {
  const [dove, setDove] = useState("");
  const [giorni, setGiorni] = useState(3);
  const [tipo, setTipo] = useState(TIPI[0].id);
  const [interessi, setInteressi] = useState<string[]>([]);
  const [caricando, setCaricando] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [itinerario, setItinerario] = useState<ItinerarioAI | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [errore, setErrore] = useState("");
  const [copiato, setCopiato] = useState(false);
  const [linkCopiato, setLinkCopiato] = useState(false);

  useEffect(() => {
    if (!caricando) return;
    const iv = setInterval(
      () => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length),
      2200
    );
    return () => clearInterval(iv);
  }, [caricando]);

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
    setShareToken(null);
    setMsgIdx(0);

    const interessiLabel = interessi.map(
      (id) => INTERESSI.find((i) => i.id === id)?.label ?? id
    );

    const risposta = await fetch("/api/itinerario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinazione: dove.trim(),
        giorni,
        tipo_viaggiatore: tipo,
        interessi: interessiLabel,
      }),
    });

    if (risposta.ok) {
      const d = await risposta.json() as { itinerario: ItinerarioAI; share_token: string | null };
      setItinerario(d.itinerario);
      setShareToken(d.share_token);
    } else {
      setErrore("Si è verificato un errore. Riprova tra un momento.");
    }
    setCaricando(false);
  }

  function copiaItinerario() {
    if (!itinerario) return;
    const linee = [
      itinerario.titolo,
      "",
      ...itinerario.giorni_dettaglio.flatMap((g) => [
        `--- Giorno ${g.numero}: ${g.titolo} ---`,
        `🌅 Mattina: ${g.mattina.attivita} @ ${g.mattina.luogo}`,
        `🍴 Pranzo: ${g.pranzo.attivita} @ ${g.pranzo.luogo}`,
        `☀️ Pomeriggio: ${g.pomeriggio.attivita} @ ${g.pomeriggio.luogo}`,
        `🌙 Cena: ${g.cena.attivita} @ ${g.cena.luogo}`,
        `🛏️ Dove dormire: ${g.dove_dormire.nome}`,
        "",
      ]),
      ...(itinerario.consigli_pratici?.length
        ? ["Consigli pratici:", ...itinerario.consigli_pratici.map((c) => `• ${c}`)]
        : []),
      "",
      "Creato con il network viaggi.app — https://viaggi.app",
    ];
    void navigator.clipboard.writeText(linee.join("\n"));
    setCopiato(true);
    setTimeout(() => setCopiato(false), 2000);
  }

  function condividi() {
    const url = shareToken
      ? `${window.location.origin}/itinerario/${shareToken}`
      : window.location.href;
    void navigator.clipboard.writeText(url);
    setLinkCopiato(true);
    setTimeout(() => setLinkCopiato(false), 2000);
  }

  // Strutture network usate nell'itinerario
  const struttureNetwork = itinerario?.giorni_dettaglio.flatMap((g) =>
    [g.mattina, g.pranzo, g.pomeriggio, g.cena]
      .filter((m) => m.nel_network && m.url_scheda)
      .map((m) => ({ nome: m.luogo, tipo: m.tipo, url: m.url_scheda! }))
  ) ?? [];
  const struttureUniche = struttureNetwork.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i
  );

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20 text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/70 mb-4">
            Powered by viaggi.app network
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            🗺️ Il tuo itinerario personalizzato
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto leading-relaxed">
            L&apos;AI del network viaggi.app organizza la tua vacanza usando strutture
            reali italiane — agriturismi, cantine, ristoranti e molto altro.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto w-full px-4 py-10">
        <form onSubmit={(e) => void genera(e)} className="flex flex-col gap-7">

          {/* Dove */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
              Dove vuoi andare?
            </label>
            <input
              type="text"
              required
              value={dove}
              onChange={(e) => setDove(e.target.value)}
              placeholder="es. Toscana, Alberobello, Lago di Garda…"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          {/* Giorni */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
              Quanti giorni? <span className="text-[#2D6A4F] font-bold">{giorni}</span>
            </label>
            <input
              type="range"
              min={1}
              max={14}
              value={giorni}
              onChange={(e) => setGiorni(Number(e.target.value))}
              className="w-full accent-[#2D6A4F]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 giorno</span>
              <span>14 giorni</span>
            </div>
          </div>

          {/* Con chi */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">
              Con chi viaggi?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TIPI.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    tipo === t.id
                      ? "border-[#2D6A4F] bg-green-50 text-[#2D6A4F]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interessi */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">
              Cosa ti interessa?
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESSI.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => toggleInteresse(i.id)}
                  className={`px-3 py-2 rounded-xl text-sm border-2 transition-all ${
                    interessi.includes(i.id)
                      ? "border-[#2D6A4F] bg-green-50 text-[#2D6A4F] font-semibold"
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
            className="w-full py-4 rounded-xl text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            {caricando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span key={msgIdx} className="transition-all">
                  {LOADING_MESSAGES[msgIdx]}
                </span>
              </>
            ) : (
              "✨ Genera il mio itinerario"
            )}
          </button>
        </form>

        {errore && (
          <p className="mt-4 text-sm text-red-500 text-center">{errore}</p>
        )}
      </div>

      {/* Risultato */}
      {itinerario && (
        <div className="border-t border-gray-100 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 py-10">

            {/* Header risultato */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{itinerario.titolo}</h2>
                {itinerario.strutture_network_usate > 0 && (
                  <p className="text-sm text-[#2D6A4F] font-medium mt-1">
                    ✅ {itinerario.strutture_network_usate} struttur{itinerario.strutture_network_usate === 1 ? "a" : "e"} del network viaggi.app
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={copiaItinerario}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copiato ? "✅ Copiato!" : "📋 Copia"}
                </button>
                <button
                  onClick={condividi}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {linkCopiato ? "✅ Link copiato!" : "🔗 Condividi"}
                </button>
                <button
                  onClick={() => void genera()}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  🔄 Rigenera
                </button>
                <Link
                  href={`/?q=agriturismo a ${encodeURIComponent(itinerario.destinazione)}`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  🔍 Agriturismi a {itinerario.destinazione}
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
              {/* Giorni */}
              <div className="flex flex-col gap-5">
                {itinerario.giorni_dettaglio.map((g) => (
                  <div
                    key={g.numero}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div
                      className="px-5 py-3 border-b border-gray-50"
                      style={{ backgroundColor: "#F0FDF4" }}
                    >
                      <p className="font-bold text-[#2D6A4F] text-sm">
                        Giorno {g.numero}
                        {g.titolo ? ` — ${g.titolo}` : ""}
                      </p>
                    </div>
                    <div className="p-5 grid sm:grid-cols-2 gap-5">
                      <MomentoCard label="🌅 Mattina" m={g.mattina} />
                      <MomentoCard label="🍴 Pranzo" m={g.pranzo} />
                      <MomentoCard label="☀️ Pomeriggio" m={g.pomeriggio} />
                      <MomentoCard label="🌙 Cena" m={g.cena} />
                    </div>
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        🛏️ <span className="font-medium">{g.dove_dormire.nome}</span>
                      </span>
                      {g.dove_dormire.nel_network && (
                        <BadgeNetwork url={g.dove_dormire.url_scheda} />
                      )}
                    </div>
                  </div>
                ))}

                {/* Consigli pratici */}
                {itinerario.consigli_pratici?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 text-sm mb-3">
                      💡 Consigli pratici
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {itinerario.consigli_pratici.map((c, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-[#2D6A4F] shrink-0">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar: strutture network */}
              <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-28">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Strutture nel network
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Presenti in questo itinerario
                </p>
                {struttureUniche.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    Nessuna struttura del network trovata entro 50km. Aggiungi la tua struttura su{" "}
                    <a href="https://viaggi.app" className="text-[#2D6A4F] hover:underline">
                      viaggi.app
                    </a>
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {struttureUniche.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-sm text-[#2D6A4F] hover:underline"
                        >
                          <span className="text-xs shrink-0 mt-0.5 text-gray-400">
                            {s.tipo === "agriturismo" ? "🏡" :
                             s.tipo === "cantina" ? "🍷" :
                             s.tipo === "ristorante" ? "🍽️" : "📍"}
                          </span>
                          <span>{s.nome}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-[10px] text-gray-400">
                    Powered by{" "}
                    <a href="https://viaggi.app" className="text-[#2D6A4F]">
                      viaggi.app network
                    </a>
                  </p>
                </div>
              </aside>
            </div>
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
