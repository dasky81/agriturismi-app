import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crea il tuo account — agriturismi.app",
  description:
    "Registrati gratuitamente su agriturismi.app per salvare i tuoi agriturismi preferiti e scoprire le migliori strutture italiane.",
  robots: { index: false, follow: true },
};

export default function RegistratiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
