import type { Metadata } from "next";
import Link from "next/link";
import { creaClientServer } from "@/lib/supabase-server";
import FormAggiungi from "./FormAggiungi";

export const metadata: Metadata = {
  title: "Aggiungi la tua struttura — agriturismi.app",
  description:
    "Sei il titolare di un agriturismo? Aggiungilo gratuitamente su agriturismi.app in pochi minuti e raggiungi migliaia di viaggiatori.",
};

export default async function AggiungiStrutturaPage() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-3">
            Gestori · Proprietari
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-3">
            Aggiungi il tuo agriturismo — è gratis
          </h1>
          <p className="text-white/65 text-base max-w-lg mx-auto mb-8">
            Raggiungi migliaia di viaggiatori che cercano agriturismi con l&apos;AI.
            Senza commissioni. Senza abbonamenti. Sempre gratuito.
          </p>

          {/* Vantaggi bullet */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-white/80 mb-2">
            <span className="flex items-center gap-2">✓ Trovato dall&apos;AI</span>
            <span className="flex items-center gap-2">✓ Badge Verificato</span>
            <span className="flex items-center gap-2">✓ Gestione foto e servizi</span>
            <span className="flex items-center gap-2">✓ Statistiche visite</span>
          </div>
        </div>
      </section>

      {/* ── CONTENUTO ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-12">

        {user ? (
          <>
            {/* Info box — solo se loggato */}
            <div className="rounded-2xl border border-[#2D6A4F33] bg-white px-6 py-5 mb-8 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#2D6A4F" }}>
                Cosa succede dopo
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="shrink-0">✓</span>
                  <span>La scheda è pubblicata immediatamente, contrassegnata come &quot;non verificata&quot;.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0">✓</span>
                  <span>Puoi aggiungere foto, descrizione e servizi dal tuo pannello di controllo.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0">✓</span>
                  <span>Il badge &quot;Verificato&quot; viene assegnato dopo la verifica del nostro team.</span>
                </div>
              </div>
            </div>

            <FormAggiungi userId={user.id} />
          </>
        ) : (
          /* CTA login — se non loggato */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 text-center">
            <p className="text-4xl mb-4">🏡</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Accedi o registrati per continuare
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Per aggiungere o gestire la tua struttura hai bisogno di un account gratuito.
              Ci vogliono meno di 2 minuti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/registrati?ruolo=proprietario&redirect=/aggiungi-struttura"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                Registrati gratis — sono un gestore
              </Link>
              <Link
                href="/login?redirect=/aggiungi-struttura"
                className="px-6 py-3 rounded-xl text-sm font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Ho già un account — Accedi
              </Link>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              Hai già una scheda su agriturismi.app?{" "}
              <Link href="/rivendica-scheda" className="text-[#2D6A4F] underline">
                Rivendicala gratuitamente
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
