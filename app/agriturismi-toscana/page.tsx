import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Toscana — Le migliori strutture | agriturismi.app",
  description:
    "Scopri i migliori agriturismi in Toscana: colline, vigneti, olio d'oliva e ospitalità autentica. Cerca con l'AI la struttura perfetta per la tua vacanza.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-toscana" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Toscana",
  titolo: "Agriturismi in Toscana",
  descrizioneH1: "Agriturismi in Toscana",
  testoIntro:
    "La Toscana è la regione italiana per eccellenza dell'ospitalità rurale. Tra le colline del Chianti, i cipresseti della Val d'Orcia e i borghi medievali della Maremma, gli agriturismi toscani offrono esperienze uniche: degustazioni di vini pregiati come Brunello e Chianti Classico, cene a base di prodotti biologici, piscine con vista sulle vigne e passeggiate tra gli uliveti. Che tu voglia una romantica fuga di coppia o una vacanza in famiglia tra fattorie didattiche e animali, la Toscana ha l'agriturismo perfetto per te.",
  faq: [
    {
      d: "Qual è il periodo migliore per visitare gli agriturismi in Toscana?",
      r: "La primavera (aprile-giugno) e l'autunno (settembre-ottobre) sono i periodi ideali: il clima è mite, il paesaggio è verdeggiante o dorato, e si possono vivere la fioritura dei papaveri o la vendemmia.",
    },
    {
      d: "Gli agriturismi in Toscana offrono degustazioni di vino?",
      r: "Sì, molti agriturismi toscani, soprattutto nel Chianti, in Montalcino e a Montepulciano, organizzano degustazioni guidate di vini DOC e DOCG direttamente in cantina.",
    },
    {
      d: "Posso portare il cane in un agriturismo in Toscana?",
      r: "Molti agriturismi toscani accettano animali domestici, ma è sempre consigliabile verificare prima della prenotazione. Usa la ricerca AI per filtrare le strutture pet-friendly.",
    },
    {
      d: "Quali attività si possono fare negli agriturismi toscani?",
      r: "Trekking, mountain bike, equitazione, corsi di cucina toscana, raccolta delle olive, vendemmia, yoga tra i vigneti e visite ai borghi storici sono solo alcune delle esperienze disponibili.",
    },
    {
      d: "Come scelgo il migliore agriturismo in Toscana per le mie esigenze?",
      r: "Usa il nostro motore di ricerca AI: descrivi liberamente cosa cerchi (es. 'agriturismo con piscina e ristorante vicino a Siena') e l'AI selezionerà le strutture più adatte a te.",
    },
  ],
  correlate: [
    { href: "/agriturismi-umbria", label: "Agriturismi in Umbria" },
    { href: "/agriturismi-lazio", label: "Agriturismi nel Lazio" },
    { href: "/agriturismi-con-piscina", label: "Agriturismi con piscina" },
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
    { href: "/agriturismi-romantici", label: "Agriturismi romantici" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
