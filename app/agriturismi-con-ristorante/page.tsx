import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi con Ristorante — Cucina tipica a km zero | agriturismi.app",
  description:
    "Agriturismi italiani con ristorante e cucina tipica: prodotti dell'azienda, ricette tradizionali e sapori autentici. Prenota la tua tavola in campagna.",
  alternates: { canonical: "https://www.agriturismi.app/agriturismi-con-ristorante" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "ristorante",
  titolo: "Agriturismi con Ristorante",
  descrizioneH1: "Agriturismi con Ristorante",
  testoIntro:
    "Mangiare in un agriturismo con ristorante è un'esperienza gastronomica autentica e irripetibile. A differenza dei ristoranti convenzionali, la cucina degli agriturismi è a chilometro zero: i pomodori vengono dall'orto, il vino dalla cantina, il pane è fatto nel forno a legna. I menu cambiano con le stagioni e raccontano il territorio attraverso i sapori. Dalle orecchiette pugliesi alle pappardelle al cinghiale toscane, dai bigoli veneti al porceddu sardo: ogni agriturismo è un viaggio culinario nell'Italia autentica.",
  faq: [
    {
      d: "Devo prenotare il ristorante dell'agriturismo in anticipo?",
      r: "Sì, quasi sempre. La maggior parte degli agriturismi prepara i pasti solo su prenotazione, spesso entro le 24-48 ore prima. Molti servono solo gli ospiti alloggiati.",
    },
    {
      d: "I ristoranti degli agriturismi accettano anche non ospiti?",
      r: "Dipende dalla struttura. Alcuni agriturismi aprono il loro ristorante anche a clienti esterni, soprattutto nel weekend. Verifica contattando direttamente la struttura.",
    },
    {
      d: "Quanto costa una cena tipica in un agriturismo?",
      r: "In media tra i 25€ e i 45€ a persona, vino incluso. Le strutture di fascia alta o nelle zone turistiche più rinomate (Chianti, Costiera Amalfitana) possono arrivare a 60-80€.",
    },
    {
      d: "Gli agriturismi con ristorante rispettano le intolleranze alimentari?",
      r: "La maggior parte delle strutture è disponibile ad adattarsi a intolleranze al glutine, lattosio e allergie varie, ma è fondamentale comunicarlo al momento della prenotazione.",
    },
    {
      d: "Posso organizzare un evento o un matrimonio in un agriturismo con ristorante?",
      r: "Molti agriturismi con ristorante accettano prenotazioni per eventi privati, compleanni, anniversari e matrimoni. Le strutture con spazi all'aperto sono particolarmente richieste in estate.",
    },
  ],
  correlate: [
    { href: "/agriturismi-degustazione-vino", label: "Degustazione vino" },
    { href: "/agriturismi-biologici", label: "Biologici" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-puglia", label: "In Puglia" },
    { href: "/agriturismi-piemonte", label: "In Piemonte" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
