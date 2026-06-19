"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, Sparkles, X, MapPin } from "lucide-react";
import AgriCard from "@/components/AgriCard";
import { creaClientBrowser } from "@/lib/supabase";
import type { Agriturismo } from "@/types";

// ── Categorie tab ──────────────────────────────────────────────
type TipoFiltro = "all" | "regione" | "regioni" | "servizio";

interface Categoria {
  id: string;
  label: string;
  emoji: string;
  tipo: TipoFiltro;
  valore?: string;
  valori?: string[];
}

type AgriturismoCon = Agriturismo & { distanza_km?: number };

const CATEGORIE: Categoria[] = [
  { id: "all",      label: "Tutti",    emoji: "🌿", tipo: "all" },
  { id: "toscana",  label: "Toscana",  emoji: "🌻", tipo: "regione",  valore: "Toscana" },
  { id: "umbria",   label: "Umbria",   emoji: "🫒", tipo: "regione",  valore: "Umbria" },
  { id: "sicilia",  label: "Sicilia",  emoji: "🍋", tipo: "regione",  valore: "Sicilia" },
  { id: "puglia",   label: "Puglia",   emoji: "🏺", tipo: "regione",  valore: "Puglia" },
  { id: "piemonte", label: "Piemonte", emoji: "🍇", tipo: "regione",  valore: "Piemonte" },
  { id: "veneto",   label: "Veneto",   emoji: "🍾", tipo: "regione",  valore: "Veneto" },
  { id: "mare",     label: "Mare",     emoji: "🌊", tipo: "regioni",  valori: ["Sicilia", "Puglia", "Sardegna", "Campania"] },
  { id: "famiglie", label: "Famiglie", emoji: "👨‍👩‍👧", tipo: "servizio", valore: "area giochi bambini" },
  { id: "vino",     label: "Vino",     emoji: "🍷", tipo: "servizio", valore: "degustazione vini" },
  { id: "maneggio", label: "Maneggio", emoji: "🐴", tipo: "servizio", valore: "maneggio" },
];

// ── Homepage interna (legge searchParams) ──────────────────────
function HomeInterna() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryIniziale = searchParams.get("q") ?? "";
  const vicinoPar = searchParams.get("vicino") ?? "";

  const [categoriaAttiva, setCategoriaAttiva] = useState<Categoria>(CATEGORIE[0]);
  const [agriturismi, setAgriturismi] = useState<AgriturismoCon[]>([]);
  const [caricandoGrid, setCaricandoGrid] = useState(true);
  const [mostraAI, setMostraAI] = useState(!!queryIniziale);
  const [queryAI, setQueryAI] = useState(queryIniziale);
  const [caricandoAI, setCaricandoAI] = useState(false);
  const [messaggioErrore, setMessaggioErrore] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const supabase = creaClientBrowser();

  const caricaPerCategoria = useCallback(
    async (cat: Categoria) => {
      setCaricandoGrid(true);
      let query = supabase.from("agriturismi").select("*").eq("attivo", true);

      if (cat.tipo === "regione" && cat.valore) {
        query = query.eq("regione", cat.valore);
      } else if (cat.tipo === "regioni" && cat.valori) {
        query = query.in("regione", cat.valori);
      } else if (cat.tipo === "servizio" && cat.valore) {
        query = query.contains("servizi", [cat.valore]);
      }

      const { data } = await query.limit(24);
      setAgriturismi((data ?? []) as AgriturismoCon[]);
      setCaricandoGrid(false);
    },
    [supabase]
  );

  async function cercaVicinoAMe(lat: number, lng: number) {
    setCaricandoGrid(true);
    setMessaggioErrore("");
    try {
      const risposta = await fetch("/api/vicino-a-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      if (!risposta.ok) throw new Error();
      const dati = (await risposta.json()) as { agriturismi: AgriturismoCon[] };
      setAgriturismi(dati.agriturismi);
    } catch {
      setMessaggioErrore("Impossibile caricare strutture vicino a te. Riprova.");
    } finally {
      setCaricandoGrid(false);
    }
  }

  function handleGeoButton() {
    if (!("geolocation" in navigator)) {
      setMessaggioErrore("Il browser non supporta la geolocalizzazione.");
      return;
    }
    setMessaggioErrore("");
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        router.replace(`/?vicino=${lat},${lng}`);
      },
      () => {
        setGeoLoading(false);
        setMessaggioErrore("Attiva la posizione nel browser per usare questa funzione.");
      },
      { timeout: 10000 }
    );
  }

  // Carica grid al cambio categoria (skip se vicino o AI attivi)
  useEffect(() => {
    if (vicinoPar || mostraAI) return;
    void caricaPerCategoria(categoriaAttiva);
  }, [categoriaAttiva, caricaPerCategoria, vicinoPar, mostraAI]);

  // Gestisci param "vicino" da URL
  useEffect(() => {
    if (!vicinoPar) return;
    const parts = vicinoPar.split(",").map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
    void cercaVicinoAMe(parts[0], parts[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vicinoPar]);

  // Se c'è query iniziale dall'header, avvia ricerca AI
  useEffect(() => {
    if (queryIniziale) {
      void cercaConAI(queryIniziale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cercaConAI(q: string) {
    if (!q.trim()) return;
    setCaricandoAI(true);
    setCaricandoGrid(true);
    setMessaggioErrore("");
    try {
      const risposta = await fetch("/api/ricerca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!risposta.ok) throw new Error(`Errore ${risposta.status}`);
      const dati = (await risposta.json()) as { risultati: AgriturismoCon[] };
      setAgriturismi(dati.risultati ?? []);
    } catch {
      setMessaggioErrore("Si è verificato un errore. Riprova.");
    } finally {
      setCaricandoAI(false);
      setCaricandoGrid(false);
    }
  }

  function handleAISubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void cercaConAI(queryAI);
  }

  function chiudiAI() {
    setMostraAI(false);
    setQueryAI("");
    setMessaggioErrore("");
    void caricaPerCategoria(categoriaAttiva);
  }

  function handleTabClick(cat: Categoria) {
    setCategoriaAttiva(cat);
    if (mostraAI) {
      setMostraAI(false);
      setQueryAI("");
    }
    if (vicinoPar) {
      router.replace("/");
    }
    setMessaggioErrore("");
  }

  const mostraVicino = vicinoPar.length > 0;

  return (
    <div className="flex flex-col flex-1 bg-white">

      {/* ── CATEGORIA TABS ──────────────────────────────────────── */}
      <div className="border-b sticky top-20 z-40 bg-white" style={{ borderColor: "#DDDDDD" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            {CATEGORIE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat)}
                className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-all ${
                  categoriaAttiva.id === cat.id && !mostraAI && !mostraVicino
                    ? "border-[#222222] text-[#222222]"
                    : "border-transparent text-[#717171] hover:text-[#222222] hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}

            {/* Divider */}
            <div className="self-stretch w-px bg-gray-200 mx-2 shrink-0" />

            {/* Bottone Vicino a me */}
            <button
              onClick={handleGeoButton}
              disabled={geoLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all shrink-0 disabled:opacity-60 ${
                mostraVicino
                  ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {geoLoading ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
              Vicino a me
            </button>

            {/* Divider */}
            <div className="self-stretch w-px bg-gray-200 mx-2 shrink-0" />

            {/* Bottone AI search */}
            <button
              onClick={() => setMostraAI(!mostraAI)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
                mostraAI
                  ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                  : "border-gray-200 text-[#2D6A4F] hover:bg-gray-50"
              }`}
            >
              <Sparkles size={13} />
              Cerca con AI
            </button>
          </div>
        </div>
      </div>

      {/* ── AI SEARCH ESPANSO ─────────────────────────────────── */}
      {mostraAI && (
        <div className="border-b bg-[#F7F7F7] py-6" style={{ borderColor: "#DDDDDD" }}>
          <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleAISubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] shrink-0"
                />
                <input
                  type="text"
                  value={queryAI}
                  onChange={(e) => setQueryAI(e.target.value)}
                  placeholder="es. Agriturismo romantico con piscina in Toscana per 2 persone..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
                  style={{ borderColor: "#DDDDDD" }}
                />
              </div>
              <button
                type="submit"
                disabled={caricandoAI || !queryAI.trim()}
                className="px-5 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-2 shrink-0"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                {caricandoAI ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                {caricandoAI ? "Analisi..." : "Cerca"}
              </button>
              <button
                type="button"
                onClick={chiudiAI}
                className="p-3 rounded-xl border text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                style={{ borderColor: "#DDDDDD" }}
              >
                <X size={16} />
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-400 text-center">
              Descrivi liberamente la tua vacanza ideale — l&apos;AI troverà le strutture più adatte.
            </p>
          </div>
        </div>
      )}

      {/* ── GRIGLIA AGRITURISMI ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {messaggioErrore && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            {messaggioErrore}
          </p>
        )}

        {caricandoGrid ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[#2D6A4F]" />
          </div>
        ) : agriturismi.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">
              {mostraVicino ? "📍" : "🌿"}
            </p>
            <p className="font-semibold text-gray-700 mb-1">
              {mostraVicino
                ? "Nessun agriturismo entro 15 km da te"
                : "Nessun agriturismo trovato"}
            </p>
            <p className="text-sm text-gray-400">
              {mostraVicino
                ? "Prova ad allargare la ricerca o usa i filtri per categoria."
                : "Prova a selezionare una categoria diversa o usa la ricerca AI."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {mostraVicino
                ? `${agriturismi.length} struttur${agriturismi.length === 1 ? "a" : "e"} vicino a te`
                : mostraAI
                  ? `${agriturismi.length} agriturism${agriturismi.length === 1 ? "o" : "i"} trovati`
                  : `${agriturismi.length} struttur${agriturismi.length === 1 ? "a" : "e"}${categoriaAttiva.id !== "all" ? ` · ${categoriaAttiva.label}` : " in tutta Italia"}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agriturismi.map((a) => (
                <AgriCard key={a.id} agriturismo={a} distanza_km={a.distanza_km} />
              ))}
            </div>
          </>
        )}
      </main>

    </div>
  );
}

// ── Wrapper con Suspense per useSearchParams ───────────────────
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center flex-1 py-24">
          <Loader2 size={28} className="animate-spin text-[#2D6A4F]" />
        </div>
      }
    >
      <HomeInterna />
    </Suspense>
  );
}
