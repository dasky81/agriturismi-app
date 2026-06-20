import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Sardegna — Natura selvaggia e tradizioni | agriturismi.app",
  description:
    "Agriturismi in Sardegna tra Barbagia, Gallura e Costa Smeralda. Pecorino sardo, mirto, pane carasau e spiagge da sogno.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-sardegna" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Sardegna",
  titolo: "Agriturismi in Sardegna",
  descrizioneH1: "Agriturismi in Sardegna",
  testoIntro:
    "La Sardegna è un'isola di bellezza rara, dove la natura incontaminata incontra tradizioni antiche di millenni. Gli agriturismi sardi — tradizionalmente chiamati 'agriturismo' o in sardo 'agritursimo' — si trovano nelle aree più autentiche: la Barbagia con i suoi pastori e le feste tradizionali, la Gallura con la macchia mediterranea e il granito, il Sulcis con le miniere e le spiagge segrete. Qui si mangia con le mani davanti al fuoco: porceddu arrosto, pane carasau, formaggi pecorini, mirto e vernaccia di Oristano.",
  faq: [
    {
      d: "Come si raggiunge la Sardegna per un soggiorno in agriturismo?",
      r: "In aereo su Cagliari, Olbia o Alghero; in traghetto da Civitavecchia, Genova, Livorno, Napoli e Palermo. L'auto è indispensabile per raggiungere gli agriturismi nelle aree interne.",
    },
    {
      d: "Cosa si mangia in un agriturismo sardo?",
      r: "Porceddu (maialino da latte arrosto), malloreddus alla campidanese, pecora in cappotto, seadas con miele amaro, pane carasau, formaggi pecorini, culurgiones e vini Cannonau e Vermentino.",
    },
    {
      d: "Gli agriturismi sardi sono vicini alle spiagge più belle?",
      r: "Molti agriturismi del Sassarese e della Gallura sono a breve distanza dalla Costa Smeralda, dalla Maddalena e dalle spiagge di Santa Teresa di Gallura. Nel Sud Sardegna si trovano vicino a Villasimius.",
    },
    {
      d: "Qual è la stagione migliore per un agriturismo in Sardegna?",
      r: "Maggio-giugno e settembre-ottobre sono ideali: il mare è caldo, le spiagge meno affollate e il clima perfetto. L'estate è meravigliosa ma molto calda e affollata nelle zone costiere.",
    },
    {
      d: "Ci sono agriturismi in Barbagia?",
      r: "Sì, la Barbagia è il cuore rurale della Sardegna, con agriturismi autentici a Orgosolo, Oliena, Mamoiada e Gavoi. Qui si vive la Sardegna più vera: pastorizia, artigianato e feste tradizionali.",
    },
  ],
  correlate: [
    { href: "/agriturismi-sicilia", label: "Agriturismi in Sicilia" },
    { href: "/agriturismi-puglia", label: "Agriturismi in Puglia" },
    { href: "/agriturismi-vicino-al-mare", label: "Vicino al mare" },
    { href: "/agriturismi-biologici", label: "Agriturismi biologici" },
    { href: "/agriturismi-con-animali", label: "Con animali" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
