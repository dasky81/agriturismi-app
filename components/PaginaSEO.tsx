import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import AgriCard from "./AgriCard";
import type { Agriturismo } from "@/types";

export interface ConfigPaginaSEO {
  tipo: "regione" | "servizio";
  valore: string;
  titolo: string;
  descrizioneH1: string;
  testoIntro: string;
  faq: Array<{ d: string; r: string }>;
  correlate: Array<{ href: string; label: string }>;
}

interface Props {
  config: ConfigPaginaSEO;
}

export default async function PaginaSEO({ config }: Props) {
  const supabase = await creaClientServer();

  let query = supabase
    .from("agriturismi")
    .select("*")
    .eq("attivo", true);

  if (config.tipo === "regione") {
    query = query.ilike("regione", config.valore);
  } else {
    query = query.contains("servizi", [config.valore]);
  }

  const { data } = await query.limit(12);
  const agriturismi = (data ?? []) as Agriturismo[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.titolo,
    description: config.testoIntro,
    url: `https://agriturismi.app${config.tipo === "regione" ? `/agriturismi-${config.valore.toLowerCase()}` : `/agriturismi-${config.valore.toLowerCase().replace(/\s+/g, "-")}`}`,
    numberOfItems: agriturismi.length,
  };

  return (
    <div className="flex flex-col flex-1">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-14 sm:pt-24 sm:pb-18 text-center">
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-4">
            Agriturismi italiani
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            {config.descrizioneH1}
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {config.testoIntro}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#52B788" }}
          >
            <span>🔍</span> Cerca con l&apos;AI
          </Link>
        </div>
      </section>

      {/* ── ELENCO AGRITURISMI ───────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="font-display text-2xl sm:text-3xl font-bold mb-8"
            style={{ color: "#1B4332" }}
          >
            {agriturismi.length > 0
              ? `${agriturismi.length} agriturismi selezionati`
              : "Esplora gli agriturismi"}
          </h2>

          {agriturismi.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agriturismi.map((a) => (
                <AgriCard key={a.id} agriturismo={a} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🌿</p>
              <p className="text-gray-500 mb-2">
                Nessun agriturismo trovato in questo momento.
              </p>
              <p className="text-gray-400 text-sm">
                Usa la ricerca AI per scoprire tutte le strutture disponibili.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Trova il tuo agriturismo ideale
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Descrivi la vacanza che sogni e lascia che l&apos;AI trovi la struttura
            perfetta per te.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[#1B4332] bg-white text-base transition-all hover:opacity-90 shadow-lg"
          >
            <span>✨</span> Cerca con l&apos;AI
          </Link>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center"
            style={{ color: "#1B4332" }}
          >
            Domande frequenti
          </h2>
          <div className="flex flex-col gap-4">
            {config.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-gray-100 bg-[#FAFAF7] p-5"
              >
                <summary className="font-semibold text-[#1B4332] cursor-pointer list-none flex items-center justify-between gap-4">
                  {item.d}
                  <span className="text-[#52B788] shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {item.r}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── LINK CORRELATI ──────────────────────────────────────── */}
      {config.correlate.length > 0 && (
        <section className="py-10" style={{ backgroundColor: "#FAFAF7" }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2
              className="font-display text-lg font-bold mb-5"
              style={{ color: "#1B4332" }}
            >
              Scopri anche
            </h2>
            <div className="flex flex-wrap gap-3">
              {config.correlate.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:bg-white"
                  style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-display text-xl font-bold text-white mb-1">
                agriturismi.app
              </p>
              <p className="text-white/50 text-sm">
                Il motore di ricerca AI per gli agriturismi italiani.
              </p>
            </div>
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
            className="mt-8 pt-6 border-t text-xs text-white/35 flex flex-col sm:flex-row justify-between gap-2"
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
