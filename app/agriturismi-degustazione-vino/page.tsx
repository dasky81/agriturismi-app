import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi con Degustazione Vino — Cantine e wine tour | agriturismi.app",
  description:
    "Agriturismi italiani con degustazione vino in cantina: Barolo, Brunello, Amarone, Primitivo e Nero d'Avola. Enoturismo autentico direttamente dal produttore.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-degustazione-vino" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "degustazione vini",
  titolo: "Agriturismi con Degustazione Vino",
  descrizioneH1: "Agriturismi con Degustazione di Vino",
  testoIntro:
    "L'Italia è il paese del vino per eccellenza: 350 varietà di uve autoctone, 77 DOCG, 341 DOC e migliaia di produttori artigianali distribuiti su tutto il territorio. Gli agriturismi con degustazione vino sono la porta d'accesso più autentica a questo patrimonio: non il vino al ristorante, ma il vino nella cantina dove è nato, spiegato dal vignaiolo stesso. Dal Barolo di Castiglione Falletto al Brunello di Montalcino, dall'Amarone della Valpolicella al Primitivo di Manduria, ogni bottiglia racconta una storia di terra e fatica.",
  faq: [
    {
      d: "Come funziona una degustazione vino in agriturismo?",
      r: "Tipicamente comprende una visita alla cantina e ai vigneti, seguita da una degustazione guidata di 3-6 vini abbinati a salumi, formaggi e pane locale. La durata è di 1-2 ore.",
    },
    {
      d: "Bisogna prenotare le degustazioni vino in agriturismo?",
      r: "Sì, quasi sempre. Molte cantine producono quantità limitate e organizzano degustazioni su appuntamento. Prenota con almeno 48 ore di anticipo, soprattutto nel weekend.",
    },
    {
      d: "Posso acquistare le bottiglie dopo la degustazione?",
      r: "Assolutamente sì. Acquistare vino direttamente alla cantina è uno dei piaceri dell'enoturismo: si risparmia rispetto alla grande distribuzione e si porta a casa un pezzo di territorio.",
    },
    {
      d: "Le degustazioni in agriturismo sono adatte ai bambini?",
      r: "I bambini possono partecipare alla visita in cantina e ai vigneti. Per loro è disponibile succo d'uva fresco o mosto. Le degustazioni di vino sono riservate agli adulti.",
    },
    {
      d: "Qual è la regione italiana con più agriturismi per la degustazione vino?",
      r: "Toscana (Chianti, Montalcino, Montepulciano), Piemonte (Langhe), Veneto (Valpolicella, Soave), Puglia (Primitivo, Negroamaro) e Sicilia (Etna, Marsala) sono le più ricche.",
    },
  ],
  correlate: [
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-piemonte", label: "In Piemonte" },
    { href: "/agriturismi-veneto", label: "In Veneto" },
    { href: "/agriturismi-con-ristorante", label: "Con ristorante" },
    { href: "/agriturismi-romantici", label: "Romantici" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
