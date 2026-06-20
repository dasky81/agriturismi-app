import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Piemonte — Langhe, Monferrato e tartufo | agriturismi.app",
  description:
    "Agriturismi in Piemonte tra Langhe, Monferrato e Barolo. Degustazioni di Barolo e Barbaresco, tartufo d'Alba e ospitalità piemontese autentica.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-piemonte" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Piemonte",
  titolo: "Agriturismi in Piemonte",
  descrizioneH1: "Agriturismi in Piemonte",
  testoIntro:
    "Il Piemonte è il paradiso dei buongustai: Barolo, Barbaresco, Dolcetto d'Alba, tartufo bianco d'Alba, nocciole IGP, formaggi Castelmagno e Raschera. Gli agriturismi piemontesi si trovano nelle splendide colline patrimonio UNESCO delle Langhe e del Monferrato, con vedute mozzafiato sulle Alpi e i vigneti. In autunno, durante la Fiera del Tartufo di Alba, l'atmosfera è magica: nebbia mattutina, foglie dorate e profumo di tartufo nell'aria. Un agriturismo nelle Langhe è un'esperienza gastronomica e sensoriale indimenticabile.",
  faq: [
    {
      d: "Quando si raccoglie il tartufo bianco in Piemonte?",
      r: "Il tartufo bianco d'Alba si raccoglie da ottobre a dicembre. La Fiera Internazionale del Tartufo Bianco d'Alba si tiene ogni anno da ottobre a metà novembre.",
    },
    {
      d: "Quali vini si degustano negli agriturismi piemontesi?",
      r: "Barolo, Barbaresco, Barbera d'Asti, Dolcetto d'Alba, Moscato d'Asti e Nebbiolo sono i vini iconici. Molti agriturismi organizzano degustazioni guidate in cantina con il produttore.",
    },
    {
      d: "Le Langhe sono adatte per un weekend romantico in agriturismo?",
      r: "Assolutamente. Le colline delle Langhe, patrimonio UNESCO, con i loro vigneti, borghi come La Morra e Barolo, e ristoranti di eccellenza creano un contesto perfetto per una fuga romantica.",
    },
    {
      d: "Ci sono agriturismi con vista sulle Alpi in Piemonte?",
      r: "Sì, diversi agriturismi nel Cuneese, nel Biellese e nel VCO offrono panorami sulle Alpi. In inverno, alcuni si trovano vicino a stazioni sciistiche come Sestriere e Limone Piemonte.",
    },
    {
      d: "Come si raggiunge il Piemonte per un soggiorno in agriturismo?",
      r: "In aereo su Torino Caselle o Milano Malpensa; in treno fino ad Alba, Asti, Cuneo o Torino; poi in auto per raggiungere le campagne. L'auto è indispensabile per visitare le cantine sparse nelle colline.",
    },
  ],
  correlate: [
    { href: "/agriturismi-veneto", label: "Agriturismi in Veneto" },
    { href: "/agriturismi-toscana", label: "Agriturismi in Toscana" },
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
    { href: "/agriturismi-romantici", label: "Agriturismi romantici" },
    { href: "/agriturismi-con-ristorante", label: "Con ristorante" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
