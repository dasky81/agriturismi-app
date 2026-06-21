import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SezioneMeteo from "@/components/SezioneMeteo";
import NelleVicinanze from "@/components/NelleVicinanze";
import SezioneRecensioni from "@/components/SezioneRecensioni";
import {
  MapPin, Phone, Mail, Globe, ExternalLink,
  Waves, UtensilsCrossed, Wifi, Car, PawPrint,
  Baby, Wine, Mountain, Wind, Sparkles, Tag,
} from "lucide-react";
import { creaClientServer } from "@/lib/supabase-server";
import ShareButtons from "@/components/ShareButtons";
import MappaWrapper from "@/components/MappaWrapper";
import TrackingClient from "@/components/TrackingClient";
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

  const appUrl = "https://www.agriturismi.app";
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

  const appUrl = "https://www.agriturismi.app";
  const url = `${appUrl}/agriturismo/${slug}`;
  const luogo = [a.comune, a.provincia, a.regione].filter(Boolean).join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: a.nome,
    url,
    ...(a.descrizione ? { description: a.descrizione.slice(0, 200) } : {}),
    ...(a.telefono ? { telephone: a.telefono } : {}),
    ...(a.email ? { email: a.email } : {}),
    ...(a.sito_web ? { sameAs: a.sito_web } : {}),
    ...(a.foto_principale ? { image: a.foto_principale } : {}),
    address: {
      "@type": "PostalAddress",
      ...(a.indirizzo ? { streetAddress: a.indirizzo } : {}),
      ...(a.comune ? { addressLocality: a.comune } : {}),
      ...(a.provincia ? { addressRegion: a.provincia } : {}),
      addressCountry: "IT",
    },
    ...(a.lat != null && a.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng } }
      : {}),
    ...(a.verificato ? { hasVerificationStatus: "Verified" } : {}),
  };

  // Gallery: fino a 5 foto (principale + 4 dalla gallery)
  const fotoGallery = [
    ...(a.foto_principale ? [a.foto_principale] : []),
    ...(a.gallery ?? []),
  ].slice(0, 5);
  const hasFoto = fotoGallery.length > 0;

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackingClient agriturismo_id={a.id} />

      {/* ── GALLERY ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Titolo sopra gallery (mobile) */}
        <h1 className="sm:hidden text-2xl font-bold text-[#222222] mb-4">{a.nome}</h1>

        {hasFoto ? (
          <>
            {/* Mobile: solo foto principale */}
            <div className="sm:hidden rounded-2xl overflow-hidden h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotoGallery[0]} alt={a.nome} className="w-full h-full object-cover" />
            </div>
            {/* Desktop: griglia 4+1 */}
            <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px]">
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
          </>
        ) : (
          <div
            className="rounded-2xl h-64 sm:h-[420px] flex flex-col items-center justify-center gap-3 text-center px-6"
            style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)" }}
          >
            <span className="text-7xl opacity-20 select-none">📸</span>
            <p className="text-white/50 text-sm select-none max-w-xs">
              Foto non ancora disponibile
            </p>
            {!a.verificato && (
              <a
                href={`/rivendica-scheda?slug=${a.slug}`}
                className="mt-1 px-4 py-2 rounded-full text-xs font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                Sei il titolare? Aggiungi le tue foto →
              </a>
            )}
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
              <p className="hidden sm:block text-3xl font-bold text-[#222222] mb-2">
                {a.nome}
              </p>
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
              <p className="text-xs text-gray-400 mt-1.5">
                Ultimo aggiornamento:{" "}
                {new Date(a.updated_at).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Banner non rivendicata */}
            {!a.verificato && (
              <div
                className="rounded-xl border px-5 py-4"
                style={{ borderColor: "#DDDDDD", backgroundColor: "#F7F7F7" }}
              >
                <p className="text-sm text-[#717171] leading-relaxed mb-3">
                  ℹ️{" "}
                  <strong className="text-gray-800">Scheda informativa non rivendicata.</strong>{" "}
                  Le informazioni sono state raccolte da fonti pubblicamente accessibili e potrebbero
                  non essere aggiornate. Il titolare può richiedere gratuitamente modifica,
                  rivendicazione o rimozione della scheda.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/rivendica-scheda?slug=${a.slug}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    Rivendica questa scheda
                  </a>
                  <a
                    href={`mailto:info@agriturismi.app?subject=Segnalazione%20scheda%20${encodeURIComponent(a.nome)}&body=Scheda%3A%20${encodeURIComponent(`https://agriturismi.app/agriturismo/${a.slug}`)}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-[#717171] hover:bg-gray-100 transition-colors"
                    style={{ borderColor: "#DDDDDD" }}
                  >
                    Segnala un errore
                  </a>
                </div>
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

            {/* Segnala errore */}
            <div className="text-center pt-2">
              <a
                href={`mailto:info@agriturismi.app?subject=Segnalazione%20scheda%20${encodeURIComponent(a.nome)}&body=Scheda%3A%20${encodeURIComponent(url)}`}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ⚠️ Segnala un errore in questa scheda
              </a>
            </div>
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
                  <div className="flex flex-col gap-2">
                    {a.telefono && (
                      <a
                        href={`tel:${a.telefono}`}
                        className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 -mx-3"
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
                        className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 -mx-3"
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
                      <>
                        <a
                          href={a.sito_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-[#222222] hover:text-[#2D6A4F] transition-colors group w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 -mx-3"
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
                        <a
                          href={a.sito_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-green-50 mt-1"
                          style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}
                        >
                          🌐 Visita il sito ufficiale
                        </a>
                      </>
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

      {a.lat !== null && a.lng !== null && (
        <NelleVicinanze lat={a.lat} lng={a.lng} />
      )}

      <SezioneRecensioni agriturismo_id={a.id} />

      <SezioneMeteo />

    </div>
  );
}
