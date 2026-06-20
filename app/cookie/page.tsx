import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — agriturismi.app",
  description: "Informativa sull'uso dei cookie su agriturismi.app",
};

export default function CookiePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Ultimo aggiornamento: giugno 2026</p>

      <div className="flex flex-col gap-8 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che vengono salvati nel tuo browser quando visiti un sito web.
            Permettono al sito di ricordare le tue preferenze e il tuo stato di autenticazione tra una visita e l&apos;altra.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookie che utilizziamo</h2>
          <p className="mb-4">agriturismi.app utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio.</p>

          <div className="flex flex-col gap-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-gray-900">Cookie di autenticazione Supabase</p>
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Tecnico</span>
              </div>
              <p className="text-gray-600 mb-1">
                Questi cookie mantengono la tua sessione attiva dopo il login, evitando di dover inserire
                le credenziali ad ogni visita.
              </p>
              <p className="text-gray-500"><strong>Nome:</strong> sb-* (vari cookie Supabase)</p>
              <p className="text-gray-500"><strong>Durata:</strong> sessione / 7 giorni (se "ricordami" attivo)</p>
              <p className="text-gray-500"><strong>Fornitore:</strong> Supabase Inc.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-gray-900">Cookie analytics Vercel</p>
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Analytics</span>
              </div>
              <p className="text-gray-600 mb-1">
                Cookie di analytics anonimi che ci permettono di capire come gli utenti interagiscono con il sito
                (pagine visitate, tempi di risposta). I dati sono aggregati e non identificano singoli utenti.
              </p>
              <p className="text-gray-500"><strong>Nome:</strong> _vercel_insights</p>
              <p className="text-gray-500"><strong>Durata:</strong> sessione</p>
              <p className="text-gray-500"><strong>Fornitore:</strong> Vercel Inc. (dati aggregati, nessuna profilazione)</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookie di terze parti e profilazione</h2>
          <p>
            <strong>agriturismi.app non utilizza cookie di profilazione di terze parti</strong>, non integra
            tracker pubblicitari (Facebook Pixel, Google Ads, ecc.) e non condivide dati di navigazione
            con reti pubblicitarie.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Come disabilitare i cookie</h2>
          <p className="mb-3">
            Puoi gestire o disabilitare i cookie attraverso le impostazioni del tuo browser.
            Tieni presente che disabilitare i cookie tecnici di autenticazione impedirà il corretto
            funzionamento del login.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</li>
            <li><strong>Firefox:</strong> Impostazioni → Privacy e sicurezza → Cookie e dati dei siti</li>
            <li><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati dei siti</li>
            <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni siti</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Contatti</h2>
          <p>
            Per qualsiasi domanda sulla cookie policy scrivi a{" "}
            <a href="mailto:privacy@agriturismi.app" className="text-[#2D6A4F] underline">privacy@agriturismi.app</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
