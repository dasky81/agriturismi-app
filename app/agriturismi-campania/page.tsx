import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Campania — Vesuvio, Amalfi e Cilento | agriturismi.app",
  description:
    "Agriturismi in Campania tra costa Amalfitana, Cilento, Irpinia e Vesuvio. Mozzarella di bufala, limoni di Sorrento e ospitalità partenopea.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-campania" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Campania",
  titolo: "Agriturismi in Campania",
  descrizioneH1: "Agriturismi in Campania",
  testoIntro:
    "La Campania è la terra della pizza, della mozzarella di bufala e dei limoni di Sorrento. Gli agriturismi campani si trovano in scenari straordinari: le terrazze profumate di limoni sulla Costa Amalfitana, i vigneti del Cilento, le pianure di Paestum dove pascolano le bufale, la fertile pianura vesuviana con i pomodori del Piennolo. Il Parco Nazionale del Cilento è uno dei luoghi con la più alta concentrazione di agriturismi biologici d'Italia, dove si produce l'olio DOP e si pratica ancora l'agricoltura tradizionale.",
  faq: [
    {
      d: "Ci sono agriturismi vicino alla Costiera Amalfitana?",
      r: "Sì, diversi agriturismi si trovano sulle colline sopra Ravello, Tramonti e Scala, con vista mozzafiato sulla Costiera. Producono limoncello, olio d'oliva e vini locali.",
    },
    {
      d: "Dove si trovano gli agriturismi con bufale in Campania?",
      r: "Le bufale si allevano principalmente nella Piana del Sele (Paestum, Eboli, Battipaglia) e nella piana di Aversa nel Casertano. Molti agriturismi producono mozzarella fresca ogni mattina.",
    },
    {
      d: "Il Cilento è adatto per un agriturismo eco-friendly?",
      r: "Assolutamente. Il Parco Nazionale del Cilento e Vallo di Diano è uno dei territori più vocati all'agricoltura biologica. Molti agriturismi sono certificati bio e seguono la dieta mediterranea tradizionale.",
    },
    {
      d: "Posso visitare Pompei da un agriturismo in Campania?",
      r: "Sì, diversi agriturismi nell'area vesuviana sono a meno di 30 minuti da Pompei ed Ercolano. L'area è raggiungibile anche con i treni della Circumvesuviana.",
    },
    {
      d: "Quali prodotti tipici si trovano negli agriturismi campani?",
      r: "Mozzarella di bufala DOP, limoni di Sorrento IGP, pomodoro San Marzano DOP, olio Cilento DOP, vini Taurasi DOCG e Greco di Tufo, fichi bianchi del Cilento e caciocavallo silano.",
    },
  ],
  correlate: [
    { href: "/agriturismi-puglia", label: "Agriturismi in Puglia" },
    { href: "/agriturismi-sicilia", label: "Agriturismi in Sicilia" },
    { href: "/agriturismi-lazio", label: "Agriturismi nel Lazio" },
    { href: "/agriturismi-vicino-al-mare", label: "Vicino al mare" },
    { href: "/agriturismi-biologici", label: "Agriturismi biologici" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
