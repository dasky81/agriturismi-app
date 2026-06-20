import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Per gestori di agriturismo — agriturismi.app",
  description:
    "Porta il tuo agriturismo online gratuitamente. Raggiungi migliaia di viaggiatori che cercano agriturismi con l'AI.",
};

const VANTAGGI = [
  {
    emoji: "🤖",
    titolo: "Trovato dall'AI",
    desc: "La nostra AI mostra la tua struttura a chi cerca esattamente quello che offri — piscina, cucina tipica, bambini benvenuti, maneggio. Visibilità mirata, non casuale.",
  },
  {
    emoji: "🆓",
    titolo: "Sempre gratuito",
    desc: "Nessun abbonamento, nessuna commissione sulle prenotazioni, nessun costo nascosto. La scheda base è e rimarrà sempre gratuita.",
  },
  {
    emoji: "📊",
    titolo: "Statistiche visite",
    desc: "Vedi quante persone visitano la tua scheda ogni giorno, da quali regioni provengono e quali servizi cercano di più.",
  },
  {
    emoji: "🏷️",
    titolo: "Badge Verificato",
    desc: "Dopo la verifica del titolare, la tua scheda ottiene il badge verde «Verificato» che aumenta la fiducia dei viaggiatori.",
  },
  {
    emoji: "📸",
    titolo: "Foto e servizi",
    desc: "Carica fino a 20 foto, descrivi la tua struttura con parole tue e seleziona i servizi offerti. Tutto gestibile dal tuo pannello.",
  },
];

const STEPS = [
  {
    n: "1",
    titolo: "Cerca la tua struttura",
    desc: "Usa la barra di ricerca per trovare la scheda già presente su agriturismi.app. Molte strutture sono già indicizzate.",
  },
  {
    n: "2",
    titolo: "Rivendica o aggiungi",
    desc: "Se la scheda esiste clicca «Rivendica scheda». Se non è presente usa «Aggiungi struttura» per crearla da zero.",
  },
  {
    n: "3",
    titolo: "Verifica la titolarità",
    desc: "Il nostro team verifica che tu sia il titolare della struttura tramite email aziendale o documenti. Entro 48 ore.",
  },
  {
    n: "4",
    titolo: "Completa la scheda",
    desc: "Aggiungi foto, descrizione, servizi e orari. La scheda ottiene il badge «Verificato» e scala nella visibilità.",
  },
];

const FAQ = [
  {
    q: "È davvero gratuito?",
    a: "Sì, completamente. La scheda base — con foto, descrizione, mappa e contatti — è e rimarrà sempre gratuita. Non prendiamo commissioni sulle prenotazioni perché non siamo un portale di prenotazione: mettiamo in contatto i viaggiatori con te direttamente.",
  },
  {
    q: "Quanto tempo ci vuole per aggiungere la mia struttura?",
    a: "Compilare il form richiede circa 10 minuti. La verifica avviene entro 48 ore lavorative. Dopo la verifica puoi completare la scheda con tutte le foto e i dettagli che vuoi.",
  },
  {
    q: "Come funziona la verifica?",
    a: "Ti chiediamo di dimostrare di essere il titolare della struttura: solitamente è sufficiente rispondere da un'email con il dominio dell'agriturismo o mostrare un documento. Nulla di complesso.",
  },
  {
    q: "Posso aggiornare i dati in qualsiasi momento?",
    a: "Sì. Dal tuo pannello di controllo puoi modificare descrizione, foto, servizi, prezzi e contatti in qualsiasi momento, senza dover attendere approvazioni.",
  },
  {
    q: "Come posso rimuovere la scheda se cambio idea?",
    a: "Scrivici a info@agriturismi.app con oggetto «Rimozione scheda» e il nome della struttura. Elaboriamo le richieste entro 7 giorni lavorativi.",
  },
];

export default function PerGestoriPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-[#52B788] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Per proprietari · Per gestori
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Porta il tuo agriturismo<br className="hidden sm:block" /> online — gratis
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Raggiungi migliaia di viaggiatori che cercano agriturismi con l&apos;AI.
            Senza commissioni. Senza abbonamenti.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registrati?ruolo=proprietario"
              className="px-8 py-4 rounded-2xl text-base font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E8956D" }}
            >
              Registra la tua struttura gratis
            </Link>
            <Link
              href="/rivendica-scheda"
              className="px-8 py-4 rounded-2xl text-base font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              Hai già una scheda? Rivendicala
            </Link>
          </div>
        </div>
      </section>

      {/* ── PERCHÉ SCEGLIERE ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Perché scegliere agriturismi.app
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Non siamo l&apos;ennesimo portale. Siamo il primo motore di ricerca AI per agriturismi italiani.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VANTAGGI.map((v) => (
            <div
              key={v.titolo}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
            >
              <span className="text-3xl">{v.emoji}</span>
              <h3 className="font-bold text-gray-900 text-base">{v.titolo}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COME FUNZIONA ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Come funziona
            </h2>
            <p className="text-gray-500">In quattro semplici passaggi, la tua struttura è online.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm border border-gray-100"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base shrink-0"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.titolo}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIANI ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Piani disponibili
          </h2>
          <p className="text-gray-500">Inizia gratis, senza carta di credito.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Piano gratuito */}
          <div className="rounded-2xl border-2 p-7 flex flex-col gap-4" style={{ borderColor: "#2D6A4F" }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#2D6A4F" }}>
                Piano Gratuito
              </p>
              <p className="text-3xl font-bold text-gray-900">€ 0</p>
              <p className="text-sm text-gray-400 mt-0.5">per sempre</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-gray-700">
              {[
                "Scheda pubblica con info base",
                "Foto (fino a 5)",
                "Mappa interattiva",
                "Numero di telefono e email",
                "Badge Verificato",
                "Trovato dalla ricerca AI",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span style={{ color: "#2D6A4F" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/registrati?ruolo=proprietario"
              className="block w-full text-center py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 mt-auto"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Inizia gratis
            </Link>
          </div>

          {/* Piano Premium */}
          <div className="rounded-2xl border border-gray-200 p-7 flex flex-col gap-4 opacity-75">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Piano Premium — prossimamente
              </p>
              <p className="text-3xl font-bold text-gray-400">Da € 9/mese</p>
              <p className="text-sm text-gray-400 mt-0.5">tutto incluso</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              {[
                "Tutto del piano gratuito",
                "Posizione prioritaria nei risultati",
                "Fino a 20 foto",
                "Analytics avanzate (visite, click, fonti)",
                "Risposta alle recensioni",
                "Notifiche lead (chi ha cercato la tua struttura)",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-gray-300">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="block w-full text-center py-3 rounded-xl text-sm font-bold text-gray-400 bg-gray-100 mt-auto cursor-not-allowed">
              In arrivo
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
            Domande frequenti
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                  {item.q}
                  <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200 text-base">
                    ↓
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ───────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Inizia gratis oggi
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Unisciti a centinaia di gestori che hanno già portato il loro agriturismo
          online con agriturismi.app.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/registrati?ruolo=proprietario"
            className="px-8 py-4 rounded-2xl text-base font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            Registra la tua struttura gratis
          </Link>
          <Link
            href="/rivendica-scheda"
            className="px-8 py-4 rounded-2xl text-base font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Rivendica scheda esistente
          </Link>
        </div>
      </section>

    </div>
  );
}
