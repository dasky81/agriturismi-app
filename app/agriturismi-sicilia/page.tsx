import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Sicilia — Mare, sole e tradizioni | agriturismi.app",
  description:
    "Agriturismi in Sicilia tra limoni, ulivi, vigneti e mare cristallino. Trova la struttura perfetta nella terra del sole con la nostra ricerca AI.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-sicilia" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Sicilia",
  titolo: "Agriturismi in Sicilia",
  descrizioneH1: "Agriturismi in Sicilia",
  testoIntro:
    "La Sicilia è la più grande isola del Mediterraneo e uno dei luoghi più affascinanti d'Italia per un soggiorno in agriturismo. Immagina di svegliarti con vista sull'Etna, fare colazione con arance di Ribera e ricotta fresca, poi trascorrere la giornata tra spiagge di sabbia nera, vigneti di Nero d'Avola e antichi templi greci. Gli agriturismi siciliani offrono cucina autentica con arancini, pasta alla Norma, caponata e cannoli fatti in casa, circondati da paesaggi che cambiano dal mare alle montagne interne.",
  faq: [
    {
      d: "Qual è il periodo migliore per visitare un agriturismo in Sicilia?",
      r: "Primavera (aprile-giugno) e autunno (settembre-novembre) sono ideali: il clima è mite, il mare è ancora caldo a settembre e si evita l'affollamento estivo. L'estate è perfetta per chi ama il mare.",
    },
    {
      d: "Gli agriturismi siciliani sono vicini al mare?",
      r: "Molti agriturismi siciliani si trovano a breve distanza da coste meravigliose, soprattutto nelle province di Agrigento, Trapani, Siracusa e Ragusa. Usa il filtro 'vicino al mare' nella nostra ricerca.",
    },
    {
      d: "Si può visitare l'Etna da un agriturismo in Sicilia?",
      r: "Assolutamente. Diversi agriturismi si trovano sulle pendici dell'Etna, a Zafferana Etnea o Bronte, offrendo escursioni guidate al vulcano e degustazioni di vini Etna DOC.",
    },
    {
      d: "Quali specialità culinarie si trovano negli agriturismi siciliani?",
      r: "Pasta alla Norma, arancini, caponata, pani ca meusa, pesce spada alla ghiotta, cassata, cannoli con ricotta di pecora fresca. La cucina siciliana è un patrimonio di sapori millenari.",
    },
    {
      d: "Come si raggiunge la Sicilia per una vacanza in agriturismo?",
      r: "In aereo con voli diretti su Palermo, Catania e Trapani; in traghetto da Napoli, Genova, Civitavecchia o dalla Calabria; in treno con traghetto incluso. L'auto propria è consigliata per visitare le zone interne.",
    },
  ],
  correlate: [
    { href: "/agriturismi-puglia", label: "Agriturismi in Puglia" },
    { href: "/agriturismi-campania", label: "Agriturismi in Campania" },
    { href: "/agriturismi-sardegna", label: "Agriturismi in Sardegna" },
    { href: "/agriturismi-vicino-al-mare", label: "Vicino al mare" },
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
