import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi per Famiglie con Bambini — Fattorie e natura | agriturismi.app",
  description:
    "I migliori agriturismi italiani per famiglie con bambini: fattorie didattiche, animali, orti e spazi giochi. Vacanze in campagna sicure e divertenti.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-per-famiglie" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "area giochi bambini",
  titolo: "Agriturismi per Famiglie con Bambini",
  descrizioneH1: "Agriturismi per Famiglie con Bambini",
  testoIntro:
    "Un agriturismo è il luogo ideale per una vacanza in famiglia: i bambini imparano a raccogliere le uova, ad accarezzare gli animali da cortile, a preparare la pasta fresca con la nonna della fattoria. Lontano dagli schermi e dal traffico, la campagna italiana offre esperienze formative e divertenti che i piccoli porteranno nel cuore per sempre. Gli agriturismi per famiglie dispongono solitamente di ampi spazi verdi, aree giochi sicure, piscine con area bassa, menu per bambini e attività didattiche legate alle stagioni.",
  faq: [
    {
      d: "Da che età i bambini possono andare in agriturismo?",
      r: "Sin dalla nascita! Molti agriturismi accettano bambini di qualsiasi età e dispongono di lettini, seggioloni e spazi attrezzati. I bambini dai 3-4 anni in su amano particolarmente le attività con gli animali.",
    },
    {
      d: "Cosa si fa in un agriturismo per bambini?",
      r: "Raccolta di frutta e verdura, mungitura delle mucche, alimentazione degli animali da cortile, corsi di cucina per piccoli chef, costruzione di spaventapasseri, laboratori di pane e pizza, trekking facili.",
    },
    {
      d: "Gli agriturismi per famiglie hanno la piscina?",
      r: "Molti sì. Alcune strutture dispongono di piscine con area bassa per i bambini piccoli. Usa il nostro filtro combinato 'piscina + bambini' nella ricerca AI.",
    },
    {
      d: "I bambini mangiano senza problemi in agriturismo?",
      r: "Generalmente sì. La cucina degli agriturismi è semplice, genuina e spesso adattabile ai gusti dei più piccoli. Molte strutture preparano pasta al burro, pastina in brodo e pietanze leggere su richiesta.",
    },
    {
      d: "Quali sono le regioni italiane con più agriturismi per famiglie?",
      r: "Toscana, Umbria, Veneto, Trentino e Lazio sono le regioni con la maggiore offerta di agriturismi family-friendly. Il Trentino è particolarmente apprezzato per i masi con fattoria didattica.",
    },
  ],
  correlate: [
    { href: "/agriturismi-con-animali", label: "Con animali" },
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-trentino", label: "In Trentino" },
    { href: "/agriturismi-umbria", label: "In Umbria" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
