import WidgetMeteo from "./WidgetMeteo";

export default function SezioneMeteo() {
  return (
    <section style={{ backgroundColor: "#F0FDF4" }} className="py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 overflow-hidden w-full">

        {/* Intestazione */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#2D6A4F" }}
          >
            Meteo vacanze
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: "#1B4332" }}
          >
            Pianifica la tua vacanza — controlla il meteo
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Scopri il tempo nella tua destinazione prima di partire.
          </p>
        </div>

        {/* Widget meteo */}
        <WidgetMeteo />

        {/* Banner meteo.travel */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-5 bg-white/80 rounded-xl border border-white/60">
          <span className="text-sm text-gray-500">
            Per previsioni complete, mappe e Travel News →
          </span>
          <a
            href="https://meteo.travel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: "#2D6A4F" }}
          >
            Visita meteo.travel ↗
          </a>
        </div>
      </div>
    </section>
  );
}
