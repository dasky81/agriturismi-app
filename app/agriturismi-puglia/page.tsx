import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Puglia — Trulli, ulivi e mare | agriturismi.app",
  description:
    "Agriturismi in Puglia tra trulli, muretti a secco, ulivi centenari e Adriatico cristallino. Scopri le migliori strutture pugliesi con l'AI.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-puglia" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Puglia",
  titolo: "Agriturismi in Puglia",
  descrizioneH1: "Agriturismi in Puglia",
  testoIntro:
    "La Puglia è una delle mete più amate d'Italia per chi cerca autenticità mediterranea. Gli agriturismi pugliesi si trovano tra i caratteristici trulli di Alberobello, gli uliveti millenari del Salento, le colline della Valle d'Itria e le coste dell'Adriatico e dello Ionio. Qui l'ospitalità è un'arte: orecchiette fatte a mano, burrata freschissima, taralli al rosmarino, primitivo di Manduria e fave e cicoria sono solo alcune delle delizie che vi aspettano in un agriturismo pugliese.",
  faq: [
    {
      d: "Cosa sono i masserie in Puglia?",
      r: "Le masserie sono le tipiche fattorie pugliesi, spesso risalenti al XVI-XVII secolo, con caratteristici edifici in pietra bianca. Molte masserie sono state convertite in agriturismi di lusso o boutique hotel.",
    },
    {
      d: "Gli agriturismi pugliesi hanno la piscina?",
      r: "Molte masserie e agriturismi pugliesi dispongono di piscina, spesso con vista sui vigneti o sugli ulivi. Usa il nostro filtro 'piscina' per trovare le strutture con questo servizio.",
    },
    {
      d: "Il Salento è incluso nella Puglia?",
      r: "Sì, il Salento è la penisola meridionale della Puglia, comprendente le province di Lecce, Brindisi e Taranto. È famoso per le spiagge di Gallipoli, Otranto, Santa Maria di Leuca e la cultura barocca leccese.",
    },
    {
      d: "Quando è la sagra delle orecchiette in Puglia?",
      r: "Le orecchiette si preparano tutto l'anno, ma il periodo migliore per assaporarle è l'estate, durante le sagre di paese. Molti agriturismi organizzano corsi di pasta fresca pugliese.",
    },
    {
      d: "Come si raggiunge un agriturismo in Valle d'Itria?",
      r: "La Valle d'Itria è servita dalle stazioni di Alberobello, Locorotondo e Martina Franca. L'auto propria è consigliata per raggiungere le masserie nelle campagne. Alcuni agriturismi offrono navetta dall'aeroporto di Bari.",
    },
  ],
  correlate: [
    { href: "/agriturismi-campania", label: "Agriturismi in Campania" },
    { href: "/agriturismi-sicilia", label: "Agriturismi in Sicilia" },
    { href: "/agriturismi-con-piscina", label: "Agriturismi con piscina" },
    { href: "/agriturismi-vicino-al-mare", label: "Vicino al mare" },
    { href: "/agriturismi-romantici", label: "Agriturismi romantici" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
