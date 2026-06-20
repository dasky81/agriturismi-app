import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Veneto — Prosecco, Dolomiti e laghi | agriturismi.app",
  description:
    "Agriturismi in Veneto tra le colline del Prosecco, le Dolomiti, il lago di Garda e la laguna veneziana. Ospitalità autentica nella terra del buon vivere.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-veneto" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Veneto",
  titolo: "Agriturismi in Veneto",
  descrizioneH1: "Agriturismi in Veneto",
  testoIntro:
    "Il Veneto è una regione di straordinaria varietà: dal lago di Garda con il suo microclima mediterraneo, alle colline del Prosecco di Conegliano-Valdobbiadene (patrimonio UNESCO), dai vigneti del Soave e del Valpolicella alle vette dolomitiche. Gli agriturismi veneti offrono esperienze diversissime: degustazioni di Amarone e Prosecco, passeggiate tra i vigneti del Bardolino, escursioni sulle Dolomiti e soggiorni nella tranquilla campagna padovana e trevigiana, con la cucina veneta a fare da filo conduttore.",
  faq: [
    {
      d: "Cos'è il Prosecco e dove si produce in Veneto?",
      r: "Il Prosecco DOCG si produce nelle colline tra Conegliano e Valdobbiadene, riconosciute patrimonio UNESCO nel 2019. Molti agriturismi di questa zona offrono degustazioni e visite alle cantine.",
    },
    {
      d: "Gli agriturismi sul lago di Garda esistono?",
      r: "Sì, l'area gardesana ospita diversi agriturismi che producono olio d'oliva, vino e agrumi. La sponda veneta del Garda comprende Bardolino, Garda e Lazise.",
    },
    {
      d: "Ci sono agriturismi in Veneto vicino alle Dolomiti?",
      r: "Sì, le zone di Feltre, Belluno e le Prealpi venete ospitano agriturismi immersi nella natura alpina, ideali per chi ama trekking, sci e panorami dolomitici.",
    },
    {
      d: "Cosa si mangia tipicamente negli agriturismi veneti?",
      r: "Risotto all'Amarone, polenta e baccalà alla vicentina, bigoli in salsa, sarde in saor, tiramisù artigianale e cicchetti veneziani sono le specialità da non perdere.",
    },
    {
      d: "Posso visitare Venezia da un agriturismo in Veneto?",
      r: "Assolutamente. Molti agriturismi nel Veneziano, nel Padovano e nel Trevigiano sono collegati a Venezia con treni o barche. Un soggiorno in campagna è anche più economico e autentico.",
    },
  ],
  correlate: [
    { href: "/agriturismi-trentino", label: "Agriturismi in Trentino" },
    { href: "/agriturismi-piemonte", label: "Agriturismi in Piemonte" },
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
    { href: "/agriturismi-per-famiglie", label: "Per le famiglie" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
