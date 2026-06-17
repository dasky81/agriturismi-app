import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { creaClientServer } from "@/lib/supabase-server";
import ShareButtons from "@/components/ShareButtons";
import MappaWrapper from "@/components/MappaWrapper";
import type { Agriturismo } from "@/types";

// Cache della query nell'ambito di un singolo render (evita doppia chiamata tra generateMetadata e Page)
const getAgriturismo = cache(async (slug: string): Promise<Agriturismo | null> => {
  const supabase = await creaClientServer();
  const { data } = await supabase
    .from("agriturismi")
    .select("*")
    .eq("slug", slug)
    .eq("attivo", true)
    .single();
  return data as Agriturismo | null;
});

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const agriturismo = await getAgriturismo(slug);

  if (!agriturismo) {
    return { title: "Agriturismo non trovato — agriturismi.app" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agriturismi.app";
  const url = `${appUrl}/agriturismo/${slug}`;
  const descrizione =
    agriturismo.descrizione?.slice(0, 160) ??
    `Scopri ${agriturismo.nome}, agriturismo in ${agriturismo.regione ?? "Italia"}.`;

  return {
    title: `${agriturismo.nome} — agriturismi.app`,
    description: descrizione,
    openGraph: {
      title: agriturismo.nome,
      description: descrizione,
      url,
      siteName: "agriturismi.app",
      ...(agriturismo.foto_principale
        ? {
            images: [
              {
                url: agriturismo.foto_principale,
                width: 1200,
                height: 630,
                alt: agriturismo.nome,
              },
            ],
          }
        : {}),
      locale: "it_IT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: agriturismo.nome,
      description: descrizione,
      ...(agriturismo.foto_principale
        ? { images: [agriturismo.foto_principale] }
        : {}),
    },
    alternates: { canonical: url },
  };
}

export default async function SchedaAgriturismo({ params }: Params) {
  const { slug } = await params;
  const agriturismo = await getAgriturismo(slug);

  if (!agriturismo) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agriturismi.app";
  const url = `${appUrl}/agriturismo/${slug}`;

  const luogo = [agriturismo.comune, agriturismo.provincia, agriturismo.regione]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden">
        {agriturismo.foto_principale ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={agriturismo.foto_principale}
            alt={agriturismo.nome}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)",
            }}
          />
        )}
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Nome agriturismo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
          <div className="max-w-5xl mx-auto">
            {agriturismo.verificato && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white mb-2"
                style={{ backgroundColor: "#D4A017" }}
              >
                ✓ Verificato
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow">
              {agriturismo.nome}
            </h1>
            {luogo && (
              <p className="mt-1 text-white/80 text-sm flex items-center gap-1">
                <MapPin size={13} />
                {luogo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENUTO ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── COLONNA SINISTRA ── */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Sezione luogo */}
            {(agriturismo.regione || agriturismo.indirizzo) && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Dove si trova
                </h2>
                <div className="flex flex-col gap-2">
                  {agriturismo.indirizzo && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "#2D6A4F" }} />
                      <span>{agriturismo.indirizzo}</span>
                    </div>
                  )}
                  {agriturismo.comune && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={15} className="mt-0.5 shrink-0 opacity-0" />
                      <span>
                        {[agriturismo.comune, agriturismo.provincia, agriturismo.regione]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Mappa */}
            {agriturismo.lat !== null && agriturismo.lng !== null && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Mappa
                </h2>
                <MappaWrapper
                  lat={agriturismo.lat}
                  lng={agriturismo.lng}
                  nome={agriturismo.nome}
                />
              </section>
            )}

            {/* Descrizione */}
            {agriturismo.descrizione && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Descrizione
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {agriturismo.descrizione}
                </p>
              </section>
            )}
          </div>

          {/* ── COLONNA DESTRA ── */}
          <div className="flex flex-col gap-8">

            {/* Servizi */}
            {agriturismo.servizi.length > 0 && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Servizi
                </h2>
                <div className="flex flex-wrap gap-2">
                  {agriturismo.servizi.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: "#2D6A4F" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Tipo ospitalità */}
            {agriturismo.tipo_ospitalita.length > 0 && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Ospitalità
                </h2>
                <div className="flex flex-wrap gap-2">
                  {agriturismo.tipo_ospitalita.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Contatti */}
            {(agriturismo.telefono || agriturismo.email || agriturismo.sito_web) && (
              <section>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#2D6A4F" }}
                >
                  Contatti
                </h2>
                <div className="flex flex-col gap-3">
                  {agriturismo.telefono && (
                    <a
                      href={`tel:${agriturismo.telefono}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#2D6A4F] transition-colors"
                    >
                      <Phone size={15} style={{ color: "#2D6A4F" }} />
                      {agriturismo.telefono}
                    </a>
                  )}
                  {agriturismo.email && (
                    <a
                      href={`mailto:${agriturismo.email}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#2D6A4F] transition-colors"
                    >
                      <Mail size={15} style={{ color: "#2D6A4F" }} />
                      {agriturismo.email}
                    </a>
                  )}
                  {agriturismo.sito_web && (
                    <a
                      href={agriturismo.sito_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#2D6A4F] transition-colors"
                    >
                      <Globe size={15} style={{ color: "#2D6A4F" }} />
                      <span className="truncate">{agriturismo.sito_web.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink size={12} className="shrink-0 opacity-50" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Condivisione social */}
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#2D6A4F" }}
              >
                Condividi
              </h2>
              <ShareButtons url={url} titolo={agriturismo.nome} />
            </section>
          </div>
        </div>
      </div>

      {/* ── FOOTER PAGINA ─────────────────────────────────────────── */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        © 2026 agriturismi.app — Tutti i diritti riservati
      </footer>
    </div>
  );
}
