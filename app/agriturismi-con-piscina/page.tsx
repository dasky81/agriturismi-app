import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi con Piscina — Relax tra natura e campagna | agriturismi.app",
  description:
    "I migliori agriturismi italiani con piscina: immersi tra vigneti, uliveti e colline. Prenota il tuo soggiorno con piscina privata o panoramica.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-con-piscina" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "piscina",
  titolo: "Agriturismi con Piscina",
  descrizioneH1: "Agriturismi con Piscina",
  testoIntro:
    "Immagina di tuffarti in una piscina panoramica mentre lo sguardo scorre sui vigneti toscani o sulle colline umbre. Gli agriturismi italiani con piscina uniscono il comfort di una struttura vacanze moderna con l'autenticità della vita rurale. Dalle masserie pugliesi con infinity pool sugli ulivi, ai masi trentini con vasche idromassaggio vista Dolomiti, fino ai casali toscani con piscina privata tra i cipressi: ogni immersione è un'esperienza unica. La piscina in agriturismo è sempre immersa nella natura, lontano dal caos dei resort.",
  faq: [
    {
      d: "Le piscine degli agriturismi sono private o condivise?",
      r: "Dipende dalla struttura. Alcune masserie di lusso offrono piscine private per ogni suite; la maggior parte degli agriturismi ha piscine condivise tra gli ospiti, generalmente molto meno affollate rispetto agli hotel.",
    },
    {
      d: "Gli agriturismi con piscina sono adatti ai bambini?",
      r: "Molti sì, con piscine dotate di area bassa per i più piccoli. Alcuni agriturismi hanno anche parchi giochi e animatori estivi. Verifica sempre le dotazioni specifiche prima di prenotare.",
    },
    {
      d: "Qual è il periodo migliore per un agriturismo con piscina?",
      r: "Da giugno a settembre, con l'apice in luglio-agosto. Giugno e settembre sono spesso i mesi migliori: caldo ma non torrido, strutture meno affollate e prezzi più contenuti.",
    },
    {
      d: "Le piscine degli agriturismi sono riscaldate?",
      r: "Non tutte. Alcune strutture di lusso dispongono di piscine riscaldate utilizzabili anche in primavera e autunno. Verifica questo dettaglio se hai in programma una visita fuori stagione.",
    },
    {
      d: "Si può trovare un agriturismo con piscina e ristorante nello stesso posto?",
      r: "Sì, molti agriturismi con piscina dispongono anche di ristorante con cucina tipica regionale. Usa la nostra ricerca AI per trovare strutture che abbinano questi due servizi.",
    },
  ],
  correlate: [
    { href: "/agriturismi-con-spa", label: "Agriturismi con spa" },
    { href: "/agriturismi-romantici", label: "Agriturismi romantici" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-puglia", label: "In Puglia" },
    { href: "/agriturismi-umbria", label: "In Umbria" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
