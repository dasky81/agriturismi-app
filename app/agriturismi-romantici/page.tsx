import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi Romantici per Coppie — Fughe d'amore in Italia | agriturismi.app",
  description:
    "I più romantici agriturismi italiani per coppie: suite con vasca idromassaggio, cene a lume di candela, piscine tra i vigneti e tramonti indimenticabili.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-romantici" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "spa",
  titolo: "Agriturismi Romantici per Coppie",
  descrizioneH1: "Agriturismi Romantici per Coppie",
  testoIntro:
    "L'Italia è il paese dell'amore, e un agriturismo romantico è il regalo più bello che puoi fare alla tua metà. Immagina una suite con vista sulle colline toscane, una cena a lume di candela con prodotti del territorio, un massaggio di coppia nella spa rustica e una passeggiata al tramonto tra i vigneti. Gli agriturismi romantici italiani sanno coniugare la semplicità autentica della vita rurale con un'ospitalità attenta e premurosa: ogni dettaglio è pensato per rendere il vostro soggiorno indimenticabile.",
  faq: [
    {
      d: "Qual è la regione italiana più romantica per un agriturismo di coppia?",
      r: "La Toscana, con le colline del Chianti e la Val d'Orcia, è la destinazione romantica per eccellenza. Anche l'Umbria, le Langhe piemontesi e la costa Amalfitana campana sono mete amatissime dalle coppie.",
    },
    {
      d: "Gli agriturismi romantici offrono cene private?",
      r: "Molte strutture di fascia alta preparano cene private sul terrazzo, in giardino o in sala riservata su richiesta. I menu sono solitamente fissi e a base di prodotti stagionali.",
    },
    {
      d: "Posso organizzare una proposta di matrimonio in agriturismo?",
      r: "Assolutamente sì. Molti agriturismi romantici organizzano proposte di matrimonio personalizzate: fiori, champagne, fotografo discreto e cena di gala. Contatta la struttura con anticipo.",
    },
    {
      d: "Gli agriturismi romantici hanno suite con vasca da bagno?",
      r: "Diversi agriturismi di fascia alta dispongono di suite con vasca idromassaggio, alcune addirittura sul terrazzo o con vista panoramica. Verifica con la struttura la disponibilità.",
    },
    {
      d: "Qual è il periodo più romantico per un agriturismo in Italia?",
      r: "La primavera (aprile-maggio) con i fiori sbocciati e l'autunno (settembre-ottobre) con i colori della vendemmia sono i periodi più suggestivi. L'inverno nelle Langhe o in Toscana ha un fascino nebbioso e raccolto.",
    },
  ],
  correlate: [
    { href: "/agriturismi-con-spa", label: "Con spa" },
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-piemonte", label: "In Piemonte" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
