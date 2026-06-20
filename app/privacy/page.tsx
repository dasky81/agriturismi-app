import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — agriturismi.app",
  description: "Informativa sulla privacy ai sensi del GDPR per agriturismi.app",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Ultimo aggiornamento: giugno 2026</p>

      <div className="prose prose-sm max-w-none text-gray-700 flex flex-col gap-8">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento dei dati personali è <strong>Davide Sarrecchia</strong>,
            con sede in Ardea (Roma), Italia.
          </p>
          <p className="mt-2">
            Contatto: <a href="mailto:privacy@agriturismi.app" className="text-[#2D6A4F] underline">privacy@agriturismi.app</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Dati raccolti</h2>
          <p>Raccogliamo i seguenti dati personali:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li><strong>Dati di registrazione:</strong> indirizzo email e, facoltativamente, nome e cognome, forniti durante la creazione dell'account.</li>
            <li><strong>Dati di utilizzo:</strong> query di ricerca inserite nella barra AI per trovare agriturismi, associate all'account se loggato o in forma anonima altrimenti.</li>
            <li><strong>Dati di connessione:</strong> indirizzo IP, tipo di browser, pagine visitate, raccolti automaticamente per finalità di sicurezza e analytics aggregati.</li>
            <li><strong>Dati degli inserzionisti:</strong> per i gestori che rivendicano o inseriscono una struttura, raccogliamo nome dell'agriturismo, dati di contatto e informazioni sulla struttura.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Finalità e base giuridica</h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-medium">Gestione dell'account</p>
              <p className="text-gray-600 text-sm">Base: esecuzione del contratto (art. 6 par. 1 lett. b GDPR). Necessario per fornire il servizio.</p>
            </div>
            <div>
              <p className="font-medium">Miglioramento del servizio</p>
              <p className="text-gray-600 text-sm">Base: legittimo interesse (art. 6 par. 1 lett. f GDPR). Utilizziamo dati aggregati anonimi per migliorare la ricerca AI e la qualità delle schede.</p>
            </div>
            <div>
              <p className="font-medium">Comunicazioni di servizio</p>
              <p className="text-gray-600 text-sm">Base: esecuzione del contratto. Email transazionali relative al tuo account (conferma registrazione, reset password).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Conservazione dei dati</h2>
          <p>I dati personali sono conservati per il tempo strettamente necessario:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Dati dell'account: per tutta la durata del rapporto + 12 mesi dalla cancellazione.</li>
            <li>Log di ricerca: 90 giorni in forma pseudonimizzata.</li>
            <li>Dati di connessione: 30 giorni.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Condivisione con terze parti</h2>
          <p>Non vendiamo né cediamo i tuoi dati personali a terzi. Utilizziamo i seguenti fornitori di servizi:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li><strong>Supabase Inc.</strong> (USA) — archiviazione dati e autenticazione. Trattamento dati con garanzie adeguate (DPA).</li>
            <li><strong>Vercel Inc.</strong> (USA) — hosting dell'applicazione. Analytics anonimi aggregati.</li>
            <li><strong>Anthropic PBC</strong> (USA) — elaborazione delle query AI. Le query non vengono associate a dati personali.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Diritti dell'interessato</h2>
          <p>Ai sensi degli artt. 15-22 GDPR hai diritto di:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li><strong>Accesso</strong> — ottenere conferma che siano trattati dati che ti riguardano e una copia degli stessi.</li>
            <li><strong>Rettifica</strong> — correggere dati inesatti o completare dati incompleti.</li>
            <li><strong>Cancellazione</strong> ("diritto all'oblio") — richiedere la cancellazione dei tuoi dati personali.</li>
            <li><strong>Limitazione</strong> — richiedere la limitazione del trattamento in determinati casi.</li>
            <li><strong>Portabilità</strong> — ricevere i tuoi dati in formato strutturato e leggibile da macchina.</li>
            <li><strong>Opposizione</strong> — opporti al trattamento basato su legittimo interesse.</li>
          </ul>
          <p className="mt-3">
            Per esercitare i tuoi diritti scrivi a{" "}
            <a href="mailto:privacy@agriturismi.app" className="text-[#2D6A4F] underline">privacy@agriturismi.app</a>.
            Hai anche il diritto di proporre reclamo al{" "}
            <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#2D6A4F] underline">
              Garante per la Protezione dei Dati Personali
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Sicurezza</h2>
          <p>
            Adottiamo misure tecniche e organizzative adeguate a proteggere i dati personali da accessi non autorizzati,
            perdita o distruzione, incluse connessioni HTTPS cifrate e autenticazione sicura tramite Supabase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Modifiche</h2>
          <p>
            Questa informativa può essere aggiornata. In caso di modifiche sostanziali informeremo gli utenti
            registrati via email. La versione aggiornata è sempre disponibile a questa pagina.
          </p>
        </section>

      </div>
    </div>
  );
}
