import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi al tuo account — agriturismi.app",
  description:
    "Accedi ad agriturismi.app per salvare i tuoi agriturismi preferiti e gestire il tuo profilo.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
