import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi in Umbria — Il cuore verde d'Italia | agriturismi.app",
  description:
    "Agriturismi in Umbria tra uliveti, tartufi e borghi medievali. Scopri le migliori strutture umbre con piscina, ristorante e prodotti tipici.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-umbria" },
};

const config: ConfigPaginaSEO = {
  tipo: "regione",
  valore: "Umbria",
  titolo: "Agriturismi in Umbria",
  descrizioneH1: "Agriturismi in Umbria",
  testoIntro:
    "L'Umbria, il cuore verde d'Italia, è la meta ideale per chi cerca autenticità e tranquillità. Gli agriturismi umbri si trovano immersi in paesaggi di dolci colline punteggiate di uliveti, boschi di querce e campi di girasole. Qui potrete assaporare il tartufo nero di Norcia, l'olio extravergine DOP, il sagrantino di Montefalco e le lenticchie di Castelluccio. Assisi, Perugia, Orvieto e Spoleto sono a breve distanza, rendendo l'Umbria perfetta per un soggiorno che unisce natura, cultura e gastronomia.",
  faq: [
    {
      d: "Cosa si mangia negli agriturismi umbri?",
      r: "La cucina umbra è ricca e genuina: tartufo, cinghiale, umbricelli al ragù, torta al testo, formaggi pecorini e vini come Sagrantino e Orvieto Classico. Molti agriturismi servono solo prodotti della propria azienda.",
    },
    {
      d: "Gli agriturismi in Umbria sono adatti alle famiglie?",
      r: "Assolutamente sì. Molte strutture umbre offrono fattorie didattiche, spazi giochi per bambini, animali da cortile e attività all'aperto come trekking e mountain bike.",
    },
    {
      d: "Quando è la stagione del tartufo in Umbria?",
      r: "Il tartufo nero pregiato si raccoglie da dicembre a marzo, quello estivo da maggio a settembre. Molti agriturismi organizzano escursioni per la ricerca del tartufo con cani specializzati.",
    },
    {
      d: "Come raggiungere un agriturismo in Umbria senza auto?",
      r: "Le principali città umbre sono collegate da treni. Da Perugia, Foligno e Spoleto partono servizi di taxi o navette verso molti agriturismi. Consigliamo di verificare con la struttura al momento della prenotazione.",
    },
    {
      d: "Esistono agriturismi biologici in Umbria?",
      r: "Sì, l'Umbria ha una forte tradizione di agricoltura biologica. Molti agriturismi sono certificati biologici e offrono prodotti certificati. Usa la nostra ricerca AI per trovare agriturismi bio in Umbria.",
    },
  ],
  correlate: [
    { href: "/agriturismi-toscana", label: "Agriturismi in Toscana" },
    { href: "/agriturismi-lazio", label: "Agriturismi nel Lazio" },
    { href: "/agriturismi-biologici", label: "Agriturismi biologici" },
    { href: "/agriturismi-per-famiglie", label: "Agriturismi per famiglie" },
    { href: "/agriturismi-con-ristorante", label: "Con ristorante" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
