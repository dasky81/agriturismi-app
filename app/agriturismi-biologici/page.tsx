import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi Biologici — Cibo naturale e sostenibilità | agriturismi.app",
  description:
    "Agriturismi italiani biologici certificati: prodotti bio, cucina naturale, sostenibilità ambientale e rispetto per la terra. Scegli il verde che fa bene.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-biologici" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "ristorante",
  titolo: "Agriturismi Biologici",
  descrizioneH1: "Agriturismi Biologici in Italia",
  testoIntro:
    "L'Italia è uno dei principali produttori di prodotti biologici certificati in Europa, e molti dei migliori agriturismi italiani sono certificati biologici. Scegliere un agriturismo bio significa non solo mangiare meglio — senza pesticidi, conservanti e additivi — ma anche sostenere un modello agricolo rispettoso dell'ambiente, della biodiversità e delle comunità rurali. In un agriturismo biologico la terra è curata con metodi tradizionali e naturali, gli animali vivono allo stato brado e i prodotti seguono il ritmo delle stagioni.",
  faq: [
    {
      d: "Come si riconosce un agriturismo biologico certificato?",
      r: "Un agriturismo biologico certificato espone il logo europeo biologico (foglia verde su sfondo bianco) e il numero di certificazione rilasciato da un organismo accreditato come ICEA, Bioagricert o QC&I.",
    },
    {
      d: "I prodotti biologici degli agriturismi costano di più?",
      r: "Spesso sì, di circa il 10-30% in più rispetto ai prodotti convenzionali. Tuttavia la qualità, il sapore e la salubrità sono notevolmente superiori. Molti considerano la differenza di prezzo un investimento nella salute.",
    },
    {
      d: "Gli agriturismi biologici accettano vegani e vegetariani?",
      r: "La maggior parte degli agriturismi bio è molto attenta alle esigenze alimentari degli ospiti. Molti propongono menu vegetariani o vegani basati su cereali, legumi e verdure biologiche dell'orto.",
    },
    {
      d: "Qual è la regione italiana con più agriturismi biologici?",
      r: "L'Umbria, il Cilento campano, la Toscana e il Trentino sono le regioni con la maggiore concentrazione di agriturismi biologici certificati. La Sicilia è in forte crescita nel settore bio.",
    },
    {
      d: "Gli agriturismi biologici hanno anche attività didattiche sull'agricoltura?",
      r: "Molti sì. Le fattorie biologiche spesso organizzano laboratori per adulti e bambini su compostaggio, semina, raccolta e trasformazione dei prodotti. È un'ottima scelta per famiglie con bambini curiosi.",
    },
  ],
  correlate: [
    { href: "/agriturismi-umbria", label: "In Umbria" },
    { href: "/agriturismi-campania", label: "In Campania" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-per-famiglie", label: "Per famiglie" },
    { href: "/agriturismi-con-ristorante", label: "Con ristorante" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
