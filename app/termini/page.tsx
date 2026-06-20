import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini e Condizioni — agriturismi.app",
  description: "Termini e condizioni d'uso di agriturismi.app",
};

export default function TerminiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Termini e Condizioni</h1>
      <p className="text-sm text-gray-400 mb-8">Ultimo aggiornamento: giugno 2026</p>

      <div className="flex flex-col gap-8 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Il servizio</h2>
          <p>
            agriturismi.app è un motore di ricerca e directory di agriturismi italiani con funzionalità AI.
            Il servizio è erogato gratuitamente da Davide Sarrecchia (Ardea, Roma) e consente di:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Cercare agriturismi tramite ricerca testuale o AI</li>
            <li>Visualizzare schede informative di strutture ricettive</li>
            <li>Registrarsi per salvare preferiti e accedere alla propria area personale</li>
            <li>Inserire o rivendicare la scheda della propria struttura</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Schede non rivendicate</h2>
          <p className="mb-2">
            Una parte delle schede presenti su agriturismi.app è stata creata a partire da dati
            pubblicamente accessibili (siti ufficiali, registri camerali, portali regionali del turismo,
            fonti aperte) e <strong>non è stata rivendicata dal titolare della struttura</strong>.
          </p>
          <p className="mb-2">
            Queste schede sono contrassegnate come &quot;informative non rivendicate&quot; e potrebbero contenere
            informazioni non aggiornate o incomplete. agriturismi.app non garantisce l&apos;accuratezza,
            completezza o attualità dei dati presenti in schede non rivendicate.
          </p>
          <p>
            I titolari possono gratuitamente rivendicare, modificare o richiedere la rimozione della
            propria scheda scrivendo a{" "}
            <a href="mailto:info@agriturismi.app" className="text-[#2D6A4F] underline">info@agriturismi.app</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Limitazione di responsabilità</h2>
          <p className="mb-2">
            agriturismi.app non è un portale di prenotazione e non intermedia alcuna transazione tra
            viaggiatori e strutture. I contatti riportati nelle schede (telefono, email, sito web)
            sono forniti a titolo informativo.
          </p>
          <p className="mb-2">
            Il gestore del servizio non si assume responsabilità per:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Inesattezze o incompletezze nei dati delle schede non rivendicate</li>
            <li>Danni derivanti dall&apos;utilizzo delle informazioni presenti nel sito</li>
            <li>Indisponibilità temporanea del servizio</li>
            <li>Contenuti di siti web di terze parti raggiungibili tramite link</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Condotta degli utenti</h2>
          <p>Utilizzando agriturismi.app l&apos;utente si impegna a:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Non inserire dati falsi o fuorvianti nelle schede</li>
            <li>Non utilizzare il servizio per fini commerciali non autorizzati</li>
            <li>Non effettuare scraping massivo dei contenuti</li>
            <li>Rispettare i diritti di proprietà intellettuale di agriturismi.app e dei suoi contenuti</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Processo di rimozione scheda</h2>
          <p>
            I titolari di strutture che desiderano richiedere la rimozione della propria scheda possono
            farlo inviando una email a{" "}
            <a href="mailto:info@agriturismi.app" className="text-[#2D6A4F] underline">info@agriturismi.app</a>{" "}
            con oggetto &quot;Richiesta rimozione scheda&quot; e includendo il nome della struttura,
            l&apos;URL della scheda e la prova della titolarità.
          </p>
          <p className="mt-2">Le richieste vengono elaborate entro 7 giorni lavorativi.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Proprietà intellettuale</h2>
          <p>
            Il codice sorgente, il design, il marchio agriturismi.app e i contenuti originali sono
            di proprietà di Davide Sarrecchia. Le descrizioni originali create dal team e dalla AI
            di agriturismi.app sono protette da copyright. I dati fattuali sulle strutture (nome,
            indirizzo, telefono) sono dati pubblici.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Legge applicabile</h2>
          <p>
            I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è
            competente il Foro di Roma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contatti</h2>
          <p>
            Per qualsiasi domanda sui presenti termini:{" "}
            <a href="mailto:info@agriturismi.app" className="text-[#2D6A4F] underline">info@agriturismi.app</a>
          </p>
        </section>

      </div>
    </div>
  );
}
