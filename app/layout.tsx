import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.agriturismi.app";

export const metadata: Metadata = {
  title: {
    default: "agriturismi.app — Motore di ricerca AI per agriturismi italiani",
    template: "%s | agriturismi.app",
  },
  description:
    "Trova l'agriturismo perfetto in Italia con la ricerca in linguaggio naturale. Toscana, Umbria, Sicilia, Puglia e tutta Italia.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "agriturismi.app",
    locale: "it_IT",
    url: SITE_URL,
    title: "agriturismi.app — Motore di ricerca AI per agriturismi italiani",
    description:
      "Trova l'agriturismo perfetto in Italia con la ricerca in linguaggio naturale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "agriturismi.app — Motore di ricerca AI per agriturismi italiani",
    description:
      "Trova l'agriturismo perfetto in Italia con la ricerca in linguaggio naturale.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "agriturismi.app",
  url: SITE_URL,
  description:
    "Motore di ricerca AI per trovare agriturismi in Italia.",
  inLanguage: "it",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
