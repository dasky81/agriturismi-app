import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer Schede — agriturismi.app",
  description: "Informazioni sulle schede informative non rivendicate presenti su agriturismi.app",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Disclaimer Schede</h1>
      <p className="text-sm text-gray-400 mb-8">Informazioni sulle schede degli agriturismi</p>

      {/* Box evidenza */}
      <div
        className="rounded-2xl border px-6 py-5 mb-10"
        style={{ borderColor: "#DDDDDD", backgroundColor: "#F7F7F7" }}
      >
        <p className="text-sm font-semibold text-gray-900 mb-2">
          ℹ️ In breve
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Su agriturismi.app sono presenti schede create a partire da dati pubblici, non ancora
          rivendicate dai titolari. Queste schede sono chiaramente indicate come &quot;informative&quot; e
          potrebbero non essere aggiornate. Il titolare può rivendicare, modificare o rimuovere
          gratuitamente la propria scheda.
        </p>
      </div>

      <div className="flex flex-col gap-8 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cosa sono le schede informative</h2>
          <p className="mb-2">
            agriturismi.app indicizza e mostra schede di agriturismi italiani. Alcune schede sono state
            create dal team di agriturismi.app raccogliendo dati da <strong>fonti pubblicamente accessibili</strong>:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Siti ufficiali degli agriturismi</li>
            <li>Portali del turismo regionali e provinciali</li>
            <li>Registri camerali e albi regionali degli agriturismi</li>
            <li>Elenchi pubblici disponibili online</li>
          </ul>
          <p className="mt-3">
            Queste schede sono contrassegnate con &quot;Scheda informativa non rivendicata&quot; e il badge
            &quot;Verificato&quot; non è mostrato.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Accuratezza delle informazioni</h2>
          <p className="mb-2">
            Per le schede non rivendicate, agriturismi.app <strong>non garantisce</strong> che le
            informazioni siano complete, accurate o aggiornate. In particolare:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Numeri di telefono e indirizzi email potrebbero essere cambiati</li>
            <li>I servizi offerti potrebbero essere diversi da quelli indicati</li>
            <li>La struttura potrebbe non essere più operativa</li>
            <li>I prezzi non sono indicati nelle schede informative</li>
          </ul>
          <p className="mt-3">
            Ti consigliamo sempre di contattare direttamente la struttura per verificare
            disponibilità e informazioni aggiornate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Sei il titolare della struttura?</h2>
          <p className="mb-4">
            Se sei il proprietario o gestore di un agriturismo presente su agriturismi.app,
            puoi esercitare gratuitamente uno dei seguenti diritti:
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
              <span className="text-xl shrink-0">✏️</span>
              <div>
                <p className="font-semibold text-gray-900">Modifica i dati</p>
                <p className="text-gray-600">
                  Segnala informazioni errate o incomplete e le aggiorneremo entro 7 giorni lavorativi.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
              <span className="text-xl shrink-0">🏷️</span>
              <div>
                <p className="font-semibold text-gray-900">Rivendica la scheda</p>
                <p className="text-gray-600">
                  Prenditi la gestione della tua scheda: aggiungi foto, descrizione aggiornata,
                  servizi e ottieni il badge &quot;Verificato&quot;.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
              <span className="text-xl shrink-0">🗑️</span>
              <div>
                <p className="font-semibold text-gray-900">Rimuovi la scheda</p>
                <p className="text-gray-600">
                  Se preferisci non essere presente su agriturismi.app, rimuoveremo la scheda
                  entro 7 giorni lavorativi dalla tua richiesta.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Come contattarci</h2>
          <p className="mb-3">Per qualsiasi richiesta riguardante le schede scrivi a:</p>
          <a
            href="mailto:info@agriturismi.app?subject=Richiesta%20scheda%20agriturismo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            ✉️ info@agriturismi.app
          </a>
          <p className="mt-4 text-gray-500">
            Oppure usa la pagina{" "}
            <Link href="/contatti" className="text-[#2D6A4F] underline">Contatti</Link>.
            Rispondiamo entro 48 ore nei giorni lavorativi.
          </p>
        </section>

      </div>
    </div>
  );
}
