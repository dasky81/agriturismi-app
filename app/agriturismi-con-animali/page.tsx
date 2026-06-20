import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi che Accettano Animali — Pet-friendly in Italia | agriturismi.app",
  description:
    "Agriturismi italiani pet-friendly: porta il tuo cane o gatto in campagna. Strutture che accettano animali domestici con spazi verdi e libertà.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-con-animali" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "animali ammessi",
  titolo: "Agriturismi che Accettano Animali",
  descrizioneH1: "Agriturismi Pet-Friendly in Italia",
  testoIntro:
    "Partire in vacanza senza lasciare il tuo animale domestico a casa è possibile: gli agriturismi italiani pet-friendly sono pensati per accogliere anche i tuoi compagni a quattro zampe. I cani possono correre liberamente nei prati, i gatti esplorano i fienili, e persino i cavalli hanno spazio negli appositi paddock. La campagna è l'ambiente ideale per gli animali: aria pulita, spazi aperti, sentieri nella natura e nessuna regola assurda. Molte strutture mettono a disposizione ciotole, lettini e persino menù speciali per i tuoi pet.",
  faq: [
    {
      d: "Tutti gli agriturismi accettano cani?",
      r: "No, non tutti. Molti agriturismi accettano cani piccoli o medi, altri solo in strutture esterne (bungalow, casette). Alcuni vietano animali per motivi di salute o per la presenza di animali da fattoria. Verifica sempre prima.",
    },
    {
      d: "Ci sono agriturismi che accettano cani di grossa taglia?",
      r: "Sì, soprattutto quelli con ampi spazi verdi nelle zone collinari e montane. Gli agriturismi in Toscana, Umbria e Trentino sono spesso i più aperti ai cani grandi.",
    },
    {
      d: "I cani possono stare liberi in agriturismo?",
      r: "Dipende dalla struttura. Alcune aree sono recintate e sicure; in altre zone, per la presenza di animali da allevamento, i cani devono essere sempre al guinzaglio. Chiedi sempre alla struttura.",
    },
    {
      d: "Gli agriturismi pet-friendly fanno pagare un supplemento?",
      r: "Molte strutture applicano un supplemento per gli animali, solitamente tra 5€ e 20€ a notte. Alcune strutture accettano animali gratuitamente se di piccola taglia.",
    },
    {
      d: "Posso portare il mio gatto in agriturismo?",
      r: "I gatti sono generalmente meno accettati rispetto ai cani, soprattutto nelle strutture con animali da cortile. Alcune strutture li ammettono con la condizione che rimangano in camera o in un'area delimitata.",
    },
  ],
  correlate: [
    { href: "/agriturismi-per-famiglie", label: "Per famiglie" },
    { href: "/agriturismi-con-maneggio", label: "Con maneggio" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-umbria", label: "In Umbria" },
    { href: "/agriturismi-trentino", label: "In Trentino" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
