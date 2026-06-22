import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

interface Momento {
  attivita: string;
  luogo: string;
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
  dove_dormire: { nome: string; tipo: string; nel_network: boolean; url_scheda: string | null };
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

type Params = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const { data } = await serviceRole()
    .from("itinerari")
    .select("destinazione, giorni")
    .eq("share_token", token)
    .eq("condivisibile", true)
    .single();

  if (!data) return { title: "Itinerario — agriturismi.app" };
  return {
    title: `Itinerario ${data.giorni} giorni a ${data.destinazione} — agriturismi.app`,
    description: `Scopri questo itinerario personalizzato di ${data.giorni} giorni a ${data.destinazione}, creato con il network viaggi.app.`,
  };
}

export default async function ItinerarioCondivisoPage({ params }: Params) {
  const { token } = await params;

  const { data } = await serviceRole()
    .from("itinerari")
    .select("*")
    .eq("share_token", token)
    .eq("condivisibile", true)
    .single();

  if (!data) notFound();

  const it = data.contenuto as ItinerarioAI;

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/70 mb-4">
            Powered by viaggi.app network
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
            {it.titolo}
          </h1>
          {it.strutture_network_usate > 0 && (
            <p className="text-sm text-[#52B788] font-medium">
              ✅ {it.strutture_network_usate} struttur{it.strutture_network_usate === 1 ? "a" : "e"} del network viaggi.app
            </p>
          )}
          <div className="mt-6">
            <Link
              href="/itinerario"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#2D6A4F] hover:bg-gray-50 transition-colors"
            >
              ✨ Crea il tuo itinerario →
            </Link>
          </div>
        </div>
      </section>

      {/* Contenuto */}
      <div className="max-w-4xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col gap-5 mb-10">
          {it.giorni_dettaglio.map((g) => (
            <div
              key={g.numero}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-gray-50" style={{ backgroundColor: "#F0FDF4" }}>
                <p className="font-bold text-[#2D6A4F] text-sm">
                  Giorno {g.numero}{g.titolo ? ` — ${g.titolo}` : ""}
                </p>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-5">
                {[
                  { label: "🌅 Mattina", m: g.mattina },
                  { label: "🍴 Pranzo", m: g.pranzo },
                  { label: "☀️ Pomeriggio", m: g.pomeriggio },
                  { label: "🌙 Cena", m: g.cena },
                ].map(({ label, m }) => (
                  <div key={label}>
                    <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{m.attivita}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center flex-wrap gap-1">
                      <span>{m.luogo}</span>
                      {m.nel_network && <BadgeNetwork url={m.url_scheda} />}
                    </p>
                  </div>
                ))}
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
        </div>

        {it.consigli_pratici?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">💡 Consigli pratici</h3>
            <ul className="flex flex-col gap-2">
              {it.consigli_pratici.map((c, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-[#2D6A4F] shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-100">
          <p className="text-gray-500 text-sm mb-4">
            Vuoi un itinerario personalizzato per la tua prossima vacanza?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/itinerario"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              ✨ Crea il tuo itinerario
            </Link>
            <Link
              href={`/?q=agriturismo a ${encodeURIComponent(it.destinazione)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🔍 Agriturismi a {it.destinazione}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
