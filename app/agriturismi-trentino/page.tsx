import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Trentino — Dolomiti, mele e vini alpini | agriturismi.app",
  description:
    "Agriturismi in Trentino tra le Dolomiti UNESCO, mele della Val di Non, Müller Thurgau e ospitalità masi tipici. Natura e gusto nelle Alpi italiane.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-trentino" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Trentino",
  titolo: "Agriturismi in Trentino",
  descrizioneH1: "Agriturismi in Trentino",
  testoIntro:
    "Il Trentino è la porta delle Dolomiti, patrimonio naturale dell'UNESCO. Gli agriturismi trentini prendono il nome di 'masi' — tradizionali fattorie alpine in pietra e legno — e offrono un'esperienza autentica tra natura alpina, prodotti di montagna e silenzio rigenerante. Mele della Val di Non IGP, speck trentino, formaggi di malga, Grappa di Vino, Müller Thurgau e Teroldego Rotaliano: la gastronomia trentina è una scoperta continua. In estate si fa trekking e mountain bike; in inverno si scia sulle Dolomiti.",
  faq: [
    {
      d: "Cosa sono i masi in Trentino?",
      r: "I masi sono le tipiche fattorie di montagna trentine, spesso risalenti al Medioevo, con architettura alpina in pietra e legno. Molti masi oggi funzionano come agriturismi, offrendo ospitalità autentica.",
    },
    {
      d: "Gli agriturismi trentini sono aperti anche in inverno?",
      r: "Molti masi aprono in inverno, soprattutto quelli vicino alle stazioni sciistiche come Madonna di Campiglio, Canazei, Moena e Andalo. Alcuni chiudono tra novembre e metà dicembre.",
    },
    {
      d: "Cosa si mangia in un agriturismo trentino?",
      r: "Canederli in brodo, speck e formaggi di malga, strangolapreti, polenta con funghi porcini, torta di mele, zelten natalizio e vini locali come Teroldego e Nosiola.",
    },
    {
      d: "Posso portare i bambini in un maso trentino?",
      r: "Assolutamente. I masi trentini sono ideali per le famiglie: animali da cortile, passeggiate facili, parchi naturali e attività didattiche legate alla vita di montagna.",
    },
    {
      d: "Come si raggiunge il Trentino in treno?",
      r: "Il Trentino è collegato da una delle linee ferroviarie più servite d'Italia. Da Trento partono navette e pullman per le valli. I masi in montagna richiedono spesso l'auto propria.",
    },
  ],
  correlate: [
    { href: "/agriturismi-veneto", label: "Agriturismi in Veneto" },
    { href: "/agriturismi-piemonte", label: "Agriturismi in Piemonte" },
    { href: "/agriturismi-per-famiglie", label: "Per le famiglie" },
    { href: "/agriturismi-con-animali", label: "Con animali" },
    { href: "/agriturismi-con-ristorante", label: "Con ristorante" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
