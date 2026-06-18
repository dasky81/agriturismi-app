import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi Vicino al Mare — Campagna e spiagge | agriturismi.app",
  description:
    "Agriturismi italiani vicino al mare: il meglio di due mondi, campagna autentica e spiagge a pochi km. Puglia, Sicilia, Sardegna, Toscana e Campania.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-vicino-al-mare" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "piscina",
  titolo: "Agriturismi Vicino al Mare",
  descrizioneH1: "Agriturismi Vicino al Mare",
  testoIntro:
    "Perché scegliere tra mare e campagna quando puoi avere entrambi? Gli agriturismi vicino al mare sono la soluzione perfetta per chi vuole godersi le spiagge cristalline dell'Italia meridionale e insulare, senza rinunciare all'autenticità di una fattoria: colazione con prodotti freschi dell'azienda, serate tranquille lontano dal caos dei lidi, prezzi più contenuti rispetto agli hotel balneari e un rapporto genuino con i proprietari. Puglia, Sicilia, Sardegna, Campania e Maremma toscana offrono gli scenari più belli.",
  faq: [
    {
      d: "Quanto distano gli agriturismi vicino al mare dalla spiaggia?",
      r: "In media tra i 5 e i 20 km. Alcuni si trovano a pochi minuti a piedi da calette private; altri richiedono l'auto per raggiungere la spiaggia. Leggi sempre la descrizione della struttura.",
    },
    {
      d: "Gli agriturismi vicino al mare hanno la spiaggia privata?",
      r: "Pochi agriturismi dispongono di spiaggia privata. Alcune strutture in Puglia, Sardegna e Sicilia hanno però accesso privilegiato a calette riservate o convenzionato con stabilimenti balneari vicini.",
    },
    {
      d: "Qual è la regione con più agriturismi vicino al mare?",
      r: "Puglia, Sicilia e Sardegna hanno la maggiore concentrazione. Anche la Maremma toscana, il Cilento campano e la costa laziale offrono ottime opzioni.",
    },
    {
      d: "Gli agriturismi vicino al mare sono aperti solo d'estate?",
      r: "Molti sì, ma non tutti. In Puglia e Sicilia alcune strutture aprono da aprile a ottobre. La Maremma e il Cilento hanno agriturismi aperti tutto l'anno.",
    },
    {
      d: "È più conveniente un agriturismo vicino al mare rispetto a un hotel?",
      r: "Generalmente sì. A parità di stelle e servizi, un agriturismo balneare costa mediamente il 20-40% in meno rispetto a un hotel sulla spiaggia, con il valore aggiunto della cucina casalinga e degli spazi aperti.",
    },
  ],
  correlate: [
    { href: "/agriturismi-sicilia", label: "In Sicilia" },
    { href: "/agriturismi-puglia", label: "In Puglia" },
    { href: "/agriturismi-sardegna", label: "In Sardegna" },
    { href: "/agriturismi-campania", label: "In Campania" },
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
