import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin, Phone, Mail, Globe, ExternalLink,
  Waves, UtensilsCrossed, Wifi, Car, PawPrint,
  Baby, Wine, Mountain, Wind, Sparkles, Tag,
} from "lucide-react";
import { creaClientServer } from "@/lib/supabase-server";
import ShareButtons from "@/components/ShareButtons";
import MappaWrapper from "@/components/MappaWrapper";
import type { Agriturismo } from "@/types";

const SERVIZI_ICONE: Record<string, React.ReactNode> = {
  piscina:              <Waves size={18} />,
  ristorante:           <UtensilsCrossed size={18} />,
  "Wi-Fi":              <Wifi size={18} />,
  parcheggio:           <Car size={18} />,
  "animali ammessi":    <PawPrint size={18} />,
  "area giochi bambini":<Baby size={18} />,
  "degustazione vini":  <Wine size={18} />,
  trekking:             <Mountain size={18} />,
  maneggio:             <Wind size={18} />,
  spa:                  <Sparkles size={18} />,
};

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
  const a = await getAgriturismo(slug);
  if (!a) return { title: "Agriturismo non trovato — agriturismi.app" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agriturismi.app";
  const url = `${appUrl}/agriturismo/${slug}`;
  const desc =
    a.descrizione?.slice(0, 160) ??
    `Scopri ${a.nome}, agriturismo in ${a.regione ?? "Italia"}.`;

  return {
    title: `${a.nome} — agriturismi.app`,
    description: desc,
    openGraph: {
      title: a.nome, description: desc, url,
      siteName: "agriturismi.app",
      ...(a.foto_principale ? { images: [{ url: a.foto_principale, width: 1200, height: 630, alt: a.nome }] } : {}),
      locale: "it_IT", type: "website",
    },
    twitter: {
      card: "summary_large_image", title: a.nome, description: desc,
      ...(a.foto_principale ? { images: [a.foto_principale] } : {}),
    },
    alternates: { canonical: url },
  };
}

export default async function SchedaAgriturismo({ params }: Params) {
  const { slug } = await params;
  const a = await getAgriturismo(slug);
  if (!a) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agriturismi.app";
  const url = `${appUrl}/agriturismo/${slug}`;
  const luogo = [a.comune, a.provincia, a.regione].filter(Boolean).join(" · ");

  // Gallery: fino a 5 foto (principale + 4 dalla gallery)
  const fotoGallery = [
    ...(a.foto_principale ? [a.foto_principale] : []),
    ...(a.gallery ?? []),
  ].slice(0, 5);
  const hasFoto = fotoGallery.length > 0;

  return (
    <div className="bg-white">

      {/* ── GALLERY ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Titolo sopra gallery (mobile) */}
        <h1 className="sm:hidden text-2xl font-bold text-[#222222] mb-4">{a.nome}</h1>

        {hasFoto ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-64 sm:h-[420px]">
            {/* Foto principale grande */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoGallery[0]}
              alt={a.nome}
              className="col-span-2 row-span-2 w-full h-full object-cover"
            />
            {/* 4 foto piccole (o placeholder) */}
            {[1, 2, 3, 4].map((i) =>
              fotoGallery[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={fotoGallery[i]}
                  alt={`${a.nome} ${i + 1}`}
                  className="col-span-1 row-span-1 w-full h-full object-cover"
                />
              ) : (
                <div
                  key={i}
                  className="col-span-1 row-span-1 w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)" }}
                >
                  <span className="text-2xl opacity-20">🌿</span>
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl h-64 sm:h-[420px] flex flex-col items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)" }}
          >
            <span className="text-8xl opacity-20 select-none">🌿</span>
            <span className="text-white/40 text-sm select-none">
              Foto non ancora disponibile
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENUTO ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── COLONNA SINISTRA ─────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Titolo (desktop) */}
            <div>
              <h1 className="hidden sm:block text-3xl font-bold text-[#222222] mb-2">
                {a.nome}
              </h1>
              <p className="flex flex-wrap items-center gap-2 text-sm text-[#717171]">
                {a.regione && <span>{a.regione}</span>}
                {a.comune && <><span>·</span><span>{a.comune}</span></>}
                {a.tipo_ospitalita.length > 0 && (
                  <><span>·</span><span>{a.tipo_ospitalita.join(", ")}</span></>
                )}
                {a.verificato && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    ✓ Verificato
                  </span>
                )}
              </p>
            </div>

            {/* Banner non rivendicata */}
            {!a.verificato && (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
                style={{ borderColor: "#DDDDDD", backgroundColor: "#F7F7F7" }}
              >
                <p className="text-xs text-[#717171]">
                  ⚑ Scheda informativa non rivendicata — i dati provengono da fonti pubbliche.
                </p>
                <a
                  href={`/rivendica-scheda?slug=${a.slug}`}
                  className="text-xs font-semibold underline underline-offset-2 shrink-0"
                  style={{ color: "#2D6A4F" }}
                >
                  Sei il titolare? Rivendica gratuitamente →
                </a>
              </div>
            )}

            <hr style={{ borderColor: "#DDDDDD" }} />

            {/* Dove si trova */}
            {luogo && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#717171" }}>
                  Dove si trova
                </h2>
                <div className="flex items-start gap-2 text-sm text-[#222222]">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "#2D6A4F" }} />
                  <span>
                    {[a.indirizzo, a.comune, a.provincia, a.regione]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </section>
            )}

            {/* Descrizione */}
            {a.descrizione && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#717171" }}>
                  La struttura
                </h2>
                <p className="text-sm text-[#222222] leading-relaxed whitespace-pre-line">
                  {a.descrizione}
                </p>
              </section>
            )}

            {a.descrizione_ai && (
              <div
                className="text-xs text-[#717171] bg-[#F7F7F7] rounded-xl px-4 py-3 border"
                style={{ borderColor: "#DDDDDD" }}
              >
                <Tag size={11} className="inline mr-1.5 opacity-60" />
                {a.descrizione_ai}
              </div>
            )}

            <hr style={{ borderColor: "#DDDDDD" }} />

            {/* Cosa offre */}
            {a.servizi.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#717171" }}>
                  Cosa offre
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {a.servizi.map((s) => (
                    <div key={s} className="flex items-center gap-3 text-sm text-[#222222]">
                      <span className="text-[#2D6A4F] shrink-0">
                        {SERVIZI_ICONE[s] ?? <Tag size={18} />}
                      </span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mappa */}
            {a.lat !== null && a.lng !== null && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#717171" }}>
                  Posizione
                </h2>
                <div className="rounded-2xl overflow-hidden">
                  <MappaWrapper lat={a.lat} lng={a.lng} nome={a.nome} />
                </div>
              </section>
            )}

            {/* Condividi */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#717171" }}>
                Condividi
              </h2>
              <ShareButtons url={url} titolo={a.nome} />
            </section>
          </div>

          {/* ── SIDEBAR DESTRA (sticky) ──────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-4">

              {/* Card contatti */}
              {(a.telefono || a.email || a.sito_web) && (
                <div
                  className="rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#DDDDDD" }}
                >
                  <h2 className="font-semibold text-[#222222] mb-4">
                    Contatta la struttura
                  </h2>
                  <div className="flex flex-col gap-3">
                    {a.telefono && (
                      <a
                        href={`tel:${a.telefono}`}
                        className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group"
                      >
                        <span
                          className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 group-hover:border-[#2D6A4F] transition-colors"
                          style={{ borderColor: "#DDDDDD" }}
                        >
                          <Phone size={15} />
                        </span>
                        {a.telefono}
                      </a>
                    )}
                    {a.email && (
                      <a
                        href={`mailto:${a.email}`}
                        className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group"
                      >
                        <span
                          className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 group-hover:border-[#2D6A4F] transition-colors"
                          style={{ borderColor: "#DDDDDD" }}
                        >
                          <Mail size={15} />
                        </span>
                        <span className="truncate">{a.email}</span>
                      </a>
                    )}
                    {a.sito_web && (
                      <a
                        href={a.sito_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group"
                      >
                        <span
                          className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 group-hover:border-[#2D6A4F] transition-colors"
                          style={{ borderColor: "#DDDDDD" }}
                        >
                          <Globe size={15} />
                        </span>
                        <span className="truncate flex-1">
                          {a.sito_web.replace(/^https?:\/\//, "")}
                        </span>
                        <ExternalLink size={12} className="shrink-0 opacity-50" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Card rivendica scheda */}
              {!a.verificato && (
                <div
                  className="rounded-2xl border p-5"
                  style={{ borderColor: "#DDDDDD", backgroundColor: "#F7F7F7" }}
                >
                  <p className="text-sm font-semibold text-[#222222] mb-1">
                    Sei il titolare?
                  </p>
                  <p className="text-xs text-[#717171] mb-3 leading-relaxed">
                    Rivendica questa scheda gratuitamente per aggiornare i dati,
                    aggiungere foto e ricevere contatti dai visitatori.
                  </p>
                  <a
                    href={`/rivendica-scheda?slug=${a.slug}`}
                    className="block w-full text-center py-2.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    Rivendica gratuitamente
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
