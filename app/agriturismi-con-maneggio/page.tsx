import { Metadata } from "next";
import PaginaSEO from "@/components/PaginaSEO";
import type { ConfigPaginaSEO } from "@/components/PaginaSEO";

export const metadata: Metadata = {
  title: "Agriturismi con Maneggio — Equitazione in campagna | agriturismi.app",
  description:
    "Agriturismi italiani con maneggio e cavalli: lezioni di equitazione, passeggiate a cavallo e trekking equestre. Per principianti e cavalieri esperti.",
  alternates: { canonical: "https://agriturismi.app/agriturismi-con-maneggio" },
};

const config: ConfigPaginaSEO = {
  tipo: "servizio",
  valore: "maneggio",
  titolo: "Agriturismi con Maneggio",
  descrizioneH1: "Agriturismi con Maneggio e Cavalli",
  testoIntro:
    "Passeggiare a cavallo tra i boschi umbri, galoppare sulle spiagge della Maremma o trottare tra i vigneti del Chianti: un agriturismo con maneggio trasforma una vacanza in campagna in un'avventura equestre indimenticabile. I cavalli sono parte integrante della tradizione rurale italiana, e molti agriturismi custodiscono razze autoctone come il Maremmano, il Murgese o il Sarcidano. Sia per chi monta per la prima volta, sia per cavalieri esperti, il trekking equestre è uno dei modi più poetici per scoprire il territorio italiano.",
  faq: [
    {
      d: "È necessario saper montare a cavallo per andare in un agriturismo con maneggio?",
      r: "No. La maggior parte degli agriturismi con maneggio offre lezioni per principianti di tutte le età. I cavalli utilizzati per i principianti sono solitamente docili e abituati ai novizi.",
    },
    {
      d: "I bambini possono fare equitazione in agriturismo?",
      r: "Sì, molte strutture offrono lezioni di pony e mini-percorsi guidati per bambini dai 4-5 anni in su. L'equitazione in agriturismo è un'esperienza formativa e divertente per i più piccoli.",
    },
    {
      d: "Come è organizzato un trekking equestre in agriturismo?",
      r: "Tipicamente, il trekking equestre prevede un briefing di sicurezza, la selezione del cavallo adatto e una passeggiata guidata di 1-3 ore nel territorio circostante. Per gruppi esperti si organizzano percorsi di più giorni.",
    },
    {
      d: "Posso portare il mio cavallo in un agriturismo con maneggio?",
      r: "Alcuni agriturismi con maneggio accettano cavalli ospiti, dotati di box e pascolo. Verifica preventivamente la disponibilità e le eventuali condizioni sanitarie richieste.",
    },
    {
      d: "Quali regioni italiane sono le migliori per l'equitazione in agriturismo?",
      r: "La Maremma toscana è la capitale dell'equitazione rurale italiana, con i butteri maremmani. Umbria, Lazio (Monti Lepini), Sardegna e Sicilia interna offrono percorsi spettacolari.",
    },
  ],
  correlate: [
    { href: "/agriturismi-con-animali", label: "Con animali" },
    { href: "/agriturismi-per-famiglie", label: "Per famiglie" },
    { href: "/agriturismi-toscana", label: "In Toscana" },
    { href: "/agriturismi-umbria", label: "In Umbria" },
    { href: "/agriturismi-sardegna", label: "In Sardegna" },
  ],
};

export default function Page() {
  return <PaginaSEO config={config} />;
}
