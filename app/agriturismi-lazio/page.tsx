import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi nel Lazio — Campagna romana e borghi | agriturismi.app",
  description:
    "Agriturismi nel Lazio a pochi km da Roma: Castelli Romani, Ciociaria, Maremma laziale e lago di Bolsena. Trova la tua oasi di pace con l'AI.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-lazio" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Lazio",
  titolo: "Agriturismi nel Lazio",
  descrizioneH1: "Agriturismi nel Lazio",
  testoIntro:
    "Il Lazio offre una straordinaria varietà di paesaggi rurali a breve distanza dalla capitale. Dai Castelli Romani con i loro vini DOC ai laghi vulcanici di Bolsena e Bracciano, dalla Ciociaria ricca di tradizioni artigianali alla Maremma laziale con le sue dune e la macchia mediterranea. Gli agriturismi laziali sono la fuga ideale dal caos di Roma: bastano pochi chilometri per ritrovarsi in una campagna silenziosa, con prodotti biologici freschi, piscine tra gli uliveti e vista sui Monti Lepini.",
  faq: [
    {
      d: "Quanto dista il Lazio da Roma per andare in agriturismo?",
      r: "Molti agriturismi si trovano a meno di un'ora da Roma: i Castelli Romani sono a 30-40 km, il lago di Bolsena a 100 km, la Maremma laziale a circa 150 km.",
    },
    {
      d: "Esistono agriturismi con piscina vicino a Roma?",
      r: "Sì, diversi agriturismi nell'area dei Castelli Romani, in Ciociaria e nella Tuscia dispongono di piscina. Cerca con il filtro 'piscina' sulla nostra piattaforma.",
    },
    {
      d: "Cosa si mangia negli agriturismi laziali?",
      r: "Coda alla vaccinara, abbacchio al forno, carciofi alla romana, fettuccine al ragù, porchetta di Ariccia, vino Frascati e Cesanese del Piglio sono i protagonisti della cucina rurale laziale.",
    },
    {
      d: "Ci sono agriturismi con fattoria didattica nel Lazio?",
      r: "Sì, molte strutture laziali offrono fattorie didattiche per bambini, con animali da cortile, orti biologici e attività educative legate al ciclo delle stagioni.",
    },
    {
      d: "Il Lazio ha agriturismi vicino al mare?",
      r: "Sì, la costa laziale con le spiagge di Sabaudia, Sperlonga, Gaeta e la Maremma laziale ospita agriturismi a breve distanza dal mare. Usa il nostro filtro 'vicino al mare'.",
    },
  ],
  correlate: [
    { href: "/agriturismi-toscana", label: "Agriturismi in Toscana" },
    { href: "/agriturismi-umbria", label: "Agriturismi in Umbria" },
    { href: "/agriturismi-campania", label: "Agriturismi in Campania" },
    { href: "/agriturismi-per-famiglie", label: "Per le famiglie" },
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
