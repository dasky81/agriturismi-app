import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi con Spa e Benessere — Relax in campagna | agriturismi.app",
  description:
    "Agriturismi italiani con spa, sauna, idromassaggio e trattamenti benessere. Relax nella natura tra massaggi, bagni aromatici e prodotti naturali.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-con-spa" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "spa",
  titolo: "Agriturismi con Spa e Benessere",
  descrizioneH1: "Agriturismi con Spa e Benessere",
  testoIntro:
    "Il connubio tra agriturismo e benessere è una delle tendenze più apprezzate del turismo rurale italiano. Dopo una giornata tra vigneti e passeggiate nella natura, immergersi in una vasca idromassaggio o ricevere un massaggio con oli essenziali alle erbe aromatiche locali è il modo perfetto per rigenerarsi. Gli agriturismi con spa offrono trattamenti ispirati alla natura circostante: fanghi alle argille locali, bagni al vino, massaggi all'olio d'oliva, saune finlandesi con vista sulle colline.",
  faq: [
    {
      d: "Che tipo di spa si trova negli agriturismi italiani?",
      r: "Gli agriturismi propongono principalmente spa di piccole dimensioni con sauna, bagno turco, vasca idromassaggio e sala massaggi. Alcune masserie pugliesi e casali toscani hanno spa più strutturate con piscine riscaldate.",
    },
    {
      d: "I trattamenti spa negli agriturismi usano prodotti naturali?",
      r: "Spesso sì. Molte strutture usano prodotti ricavati dalla propria produzione: olio d'oliva per i massaggi, miele per i facciali, argille locali per i fanghi, erbe aromatiche per i bagni aromaterapici.",
    },
    {
      d: "Gli agriturismi con spa sono adatti per coppie?",
      r: "Sono tra le mete più romantiche in assoluto. Molte strutture offrono pacchetti coppia con cena, trattamenti in duo e sistemazioni in suite con vasca idromassaggio privata.",
    },
    {
      d: "Quanto costa un trattamento spa in un agriturismo?",
      r: "Un massaggio di 50 minuti costa mediamente tra 60€ e 90€. I pacchetti benessere di un weekend (camera + cena + spa) partono da circa 200€ a persona.",
    },
    {
      d: "Le spa degli agriturismi sono accessibili a chi non alloggia nella struttura?",
      r: "Alcune strutture aprono la spa a clienti esterni su prenotazione. È sempre meglio verificare direttamente con l'agriturismo per la disponibilità e le tariffe day-spa.",
    },
  ],
  correlate: [
    { href: "/agriturismi-con-piscina", label: "Con piscina" },
    { href: "/agriturismi-romantici", label: "Agriturismi romantici" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-puglia", label: "In Puglia" },
    { href: "/agriturismi-umbria", label: "In Umbria" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
