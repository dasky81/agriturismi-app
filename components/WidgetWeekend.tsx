"use client";

import { useState } from "react";

export default function WidgetWeekend() {
  const [espanso, setEspanso] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usaGeo, setUsaGeo] = useState(false);
  const [invio, setInvio] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errore, setErrore] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInvio("loading");
    setErrore("");

    let lat: number | null = null;
    let lng: number | null = null;
    let citta: string | null = null;

    if (usaGeo && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch { /* geo negata, continua senza */ }
    }

    const risposta = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), nome: nome.trim() || null, lat, lng, citta }),
    });

    if (risposta.ok) {
      setInvio("success");
    } else {
      const d = await risposta.json() as { errore?: string };
      setErrore(d.errore ?? "Errore. Riprova.");
      setInvio("error");
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-gray-900">💡 Idee per il weekend</p>
            <p className="text-sm text-gray-500 mt-1">
              Ogni giovedì, ricevi idee su cosa fare nei dintorni questo weekend.
            </p>
          </div>
          <button
            onClick={() => setEspanso(!espanso)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors shrink-0 text-lg font-light"
            aria-label={espanso ? "Chiudi" : "Iscriviti"}
          >
            {espanso ? "−" : "+"}
          </button>
        </div>

        {espanso && (
          <>
            {invio === "success" ? (
              <div className="mt-5 p-4 rounded-xl bg-green-50 text-center">
                <p className="text-sm font-semibold text-green-700">
                  🎉 Perfetto! Ogni giovedì riceverai idee per il weekend nella tua zona.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 flex flex-col gap-3">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Il tuo nome (opzionale)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email *"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={usaGeo}
                    onChange={(e) => setUsaGeo(e.target.checked)}
                    className="w-4 h-4 accent-[#2D6A4F] rounded"
                  />
                  <span className="text-sm text-gray-600">
                    📍 Usa la mia posizione per suggerimenti personalizzati
                  </span>
                </label>

                {errore && <p className="text-xs text-red-500">{errore}</p>}

                <button
                  type="submit"
                  disabled={invio === "loading"}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {invio === "loading" ? "Iscrizione in corso…" : "Iscriviti gratis"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Nessuno spam. Cancellati quando vuoi.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}
