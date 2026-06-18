import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { creaClientServer } from "@/lib/supabase-server";
import FormAggiungi from "./FormAggiungi";

export const metadata: Metadata = {
  title: "Aggiungi la tua struttura — agriturismi.app",
  description:
    "Sei il titolare di un agriturismo non ancora presente su agriturismi.app? Aggiungilo gratuitamente in pochi minuti.",
};

export default async function AggiungiStrutturaPage() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/aggiungi-struttura");
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
            Gestori · Proprietari
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-3">
            Aggiungi la tua struttura
          </h1>
          <p className="text-white/65 text-base max-w-lg mx-auto">
            Inserisci il tuo agriturismo gratuitamente. Sarà visibile a
            migliaia di viaggiatori in cerca di esperienze autentiche.
          </p>
        </div>
      </section>

      {/* ── FORM ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Info box */}
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
      </div>
    </div>
  );
}
