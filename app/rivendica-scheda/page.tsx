import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { creaClientServer } from "@/lib/supabase-server";
import FormRivendica from "./FormRivendica";

export const metadata: Metadata = {
  title: "Rivendica la tua scheda — agriturismi.app",
  description:
    "Sei il titolare o gestore di un agriturismo? Rivendica gratuitamente la scheda per aggiornarla con foto, descrizioni e contatti ufficiali.",
};

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function RivendicaSchedaPage({ searchParams }: Props) {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/rivendica-scheda");
  }

  const { slug } = await searchParams;

  let agriturismo: {
    id: string;
    nome: string;
    slug: string;
    regione: string | null;
  } | null = null;

  if (slug) {
    const { data } = await supabase
      .from("agriturismi")
      .select("id, nome, slug, regione")
      .eq("slug", slug)
      .single();
    agriturismo = data;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-3">
            Gestori · Proprietari · Delegati
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-3">
            Rivendica la tua scheda
          </h1>
          <p className="text-white/65 text-base max-w-lg mx-auto">
            Prendi il controllo della tua presenza online. Aggiorna foto,
            descrizione, orari e contatti — gratuitamente.
          </p>
        </div>
      </section>

      {/* ── CONTENUTO ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Info box */}
        <div className="rounded-2xl border border-[#2D6A4F33] bg-white px-6 py-5 mb-8 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#2D6A4F" }}>
            Come funziona
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">1.</span>
              <span>Compila il modulo con i tuoi dati e il tuo ruolo nella struttura.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">2.</span>
              <span>Il nostro team verifica la tua identità entro 48 ore lavorative.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">3.</span>
              <span>Una volta approvato, potrai aggiornare liberamente la scheda della tua struttura.</span>
            </div>
          </div>
        </div>

        {agriturismo ? (
          <FormRivendica userId={user.id} agriturismo={agriturismo} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display font-bold text-lg text-gray-700 mb-2">
              Struttura non trovata
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Non abbiamo trovato la scheda che stai cercando di rivendicare.
              Assicurati di usare il link dalla pagina della struttura.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Cerca la tua struttura
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
