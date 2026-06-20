import Link from "next/link";

const RETE = [
  { label: "viaggi.app", href: "https://viaggi.app" },
  { label: "crociera.app", href: "https://crociera.app" },
  { label: "cantine.app", href: "https://cantine.app" },
  { label: "green.camp", href: "https://green.camp" },
  { label: "soggiorni.app", href: "https://soggiorni.app" },
  { label: "noleggi.app", href: "https://noleggi.app" },
  { label: "ristoranti.app", href: "https://ristoranti.app" },
  { label: "meteo.travel", href: "https://meteo.travel" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-auto" style={{ borderColor: "#DDDDDD" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Scopri */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
              Scopri
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/agriturismi-toscana", label: "Toscana" },
                { href: "/agriturismi-umbria", label: "Umbria" },
                { href: "/agriturismi-sicilia", label: "Sicilia" },
                { href: "/agriturismi-puglia", label: "Puglia" },
                { href: "/agriturismi-veneto", label: "Veneto" },
                { href: "/agriturismi-con-piscina", label: "Con piscina" },
                { href: "/agriturismi-per-famiglie", label: "Per famiglie" },
                { href: "/agriturismi-romantici", label: "Romantici" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ospita */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
              Ospita con noi
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/per-gestori", label: "Per gestori" },
                { href: "/aggiungi-struttura", label: "Aggiungi struttura" },
                { href: "/rivendica-scheda", label: "Rivendica la tua scheda" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporto */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
              Supporto
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/login", label: "Accedi" },
                { href: "/registrati", label: "Registrati" },
                { href: "/contatti", label: "Contatti" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/cookie", label: "Cookie Policy" },
                { href: "/termini", label: "Termini e Condizioni" },
                { href: "/disclaimer", label: "Disclaimer Schede" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rete viaggi.app */}
        <div
          className="border-t pt-6 pb-4 text-center"
          style={{ borderColor: "#DDDDDD" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Rete viaggi.app
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {RETE.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-medium transition-colors ${
                  label === "agriturismi.app"
                    ? "text-[#2D6A4F] font-semibold"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderColor: "#DDDDDD" }}
        >
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path
                d="M15 2C15 2 5 9 5 18C5 23.5 9.5 28 15 28C20.5 28 25 23.5 25 18C25 9 15 2 15 2Z"
                fill="#2D6A4F"
              />
              <path d="M15 2C15 2 15 13 10.5 20" stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M15 2C15 2 15 15 19.5 21" stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div>
              <span className="text-sm font-semibold text-gray-900 block leading-tight">agriturismi.app</span>
              <span className="text-[10px] text-gray-400 leading-none">by viaggi.app</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 agriturismi.app — Tutti i diritti riservati · Made in Italy 🇮🇹
          </p>
        </div>
      </div>
    </footer>
  );
}
