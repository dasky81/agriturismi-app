"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, Sparkles, Upload, MapPin, CheckCircle } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

const OnboardingMappa = dynamic(() => import("@/components/OnboardingMappa"), { ssr: false });

const SERVIZI_LISTA = [
  { id: "colazione", label: "🌅 Prima colazione" },
  { id: "piscina", label: "🏊 Piscina" },
  { id: "wifi", label: "📶 Wi-Fi" },
  { id: "animali_ammessi", label: "🐾 Animali ammessi" },
  { id: "parcheggio", label: "🚗 Parcheggio" },
  { id: "ristorante", label: "🍽️ Ristorante" },
  { id: "corsi_cucina", label: "👨‍🍳 Corsi di cucina" },
  { id: "degustazione_vini", label: "🍷 Degustazione vini" },
  { id: "trekking", label: "🥾 Trekking" },
  { id: "mountain_bike", label: "🚵 Mountain bike" },
  { id: "equitazione", label: "🐎 Equitazione" },
  { id: "agricoltura", label: "🌾 Attività agricole" },
  { id: "pesca", label: "🎣 Pesca" },
  { id: "bambini", label: "👦 Area bambini" },
  { id: "spa", label: "💆 Spa / Benessere" },
];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS = [
  "Dati base",
  "Descrizione",
  "Posizione",
  "Foto",
  "Servizi",
  "Riepilogo",
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function OnboardingStruttura() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [utenteId, setUtenteId] = useState<string | null>(null);

  // Form data
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuale, setSlugManuale] = useState(false);
  const [descrizione, setDescrizione] = useState("");
  const [regione, setRegione] = useState("");
  const [provincia, setProvincia] = useState("");
  const [comune, setComune] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [lat, setLat] = useState(41.9028);
  const [lng, setLng] = useState(12.4964);
  const [latOk, setLatOk] = useState(false);
  const [fotoPrincipale, setFotoPrincipale] = useState<string | null>(null);
  const [servizi, setServizi] = useState<string[]>([]);

  // UI states
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");
  const [generandoDesc, setGenerandoDesc] = useState(false);
  const [geocodificando, setGeocodificando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [completato, setCompletato] = useState(false);
  const [slugCreato, setSlugCreato] = useState("");

  useEffect(() => {
    const sb = creaClientBrowser();
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login?redirect=/onboarding-struttura");
      else setUtenteId(user.id);
    });
  }, [router]);

  // Auto-genera slug dal nome
  useEffect(() => {
    if (!slugManuale) setSlug(slugify(nome));
  }, [nome, slugManuale]);

  async function geocodifica() {
    const q = [indirizzo, comune, regione].filter(Boolean).join(", ");
    if (!q) return;
    setGeocodificando(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=it`,
        { headers: { "User-Agent": "agriturismi.app/1.0" } }
      );
      const d = await r.json() as { lat: string; lon: string }[];
      if (d.length > 0) {
        setLat(parseFloat(d[0].lat));
        setLng(parseFloat(d[0].lon));
        setLatOk(true);
      } else {
        setErrore("Indirizzo non trovato. Prova con un indirizzo più generico.");
      }
    } catch {
      setErrore("Errore di geocodifica. Riprova più tardi.");
    }
    setGeocodificando(false);
  }

  async function generaDescrizione() {
    setGenerandoDesc(true);
    setErrore("");
    try {
      const res = await fetch("/api/genera-descrizione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, comune, regione, servizi }),
      });
      const data = await res.json() as { descrizione?: string; errore?: string };
      if (data.descrizione) setDescrizione(data.descrizione);
      else setErrore(data.errore ?? "Errore generazione descrizione.");
    } catch {
      setErrore("Errore di connessione. Riprova.");
    }
    setGenerandoDesc(false);
  }

  async function uploadFoto(file: File) {
    if (!utenteId) return;
    setUploadando(true);
    setErrore("");
    try {
      const sb = creaClientBrowser();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${utenteId}/${Date.now()}.${ext}`;
      const { data, error } = await sb.storage.from("strutture").upload(path, file, { upsert: true });
      if (error) throw new Error(error.message);
      const { data: urlData } = sb.storage.from("strutture").getPublicUrl(data.path);
      setFotoPrincipale(urlData.publicUrl);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore upload foto.");
    }
    setUploadando(false);
  }

  async function submit() {
    setCaricamento(true);
    setErrore("");
    try {
      const res = await fetch("/api/onboarding-struttura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, slug, descrizione,
          regione, provincia, comune, indirizzo,
          lat: latOk ? lat : null,
          lng: latOk ? lng : null,
          foto_principale: fotoPrincipale,
          servizi,
        }),
      });
      const data = await res.json() as { ok?: boolean; slug?: string; errore?: string };
      if (!res.ok) {
        setErrore(data.errore ?? "Errore durante il salvataggio.");
        setCaricamento(false);
        return;
      }
      setSlugCreato(data.slug ?? "");
      setCompletato(true);
    } catch {
      setErrore("Errore di connessione. Riprova.");
    }
    setCaricamento(false);
  }

  function toggleServizio(id: string) {
    setServizi((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  if (completato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <CheckCircle size={56} className="mx-auto mb-5" style={{ color: "#2D6A4F" }} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Struttura creata!</h1>
          <p className="text-sm text-gray-500 mb-8">
            La tua struttura è stata aggiunta con successo. Sarai contattato per la verifica.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/agriturismo/${slugCreato}`}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Vedi la tua scheda →
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors text-center"
            >
              Vai alla dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl">🌾</span>
          <h1 className="text-xl font-bold text-gray-900 mt-2">Configura la tua struttura</h1>
          <p className="text-sm text-gray-400 mt-1">Passo {step} di 6 — {STEP_LABELS[step - 1]}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {([1, 2, 3, 4, 5, 6] as Step[]).map((n) => (
            <div
              key={n}
              className="flex-1 h-1.5 rounded-full transition-colors"
              style={{ backgroundColor: n <= step ? "#2D6A4F" : "#E5E7EB" }}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {errore && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-5">{errore}</p>
          )}

          {/* ── STEP 1: Dati base ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Dati base</h2>
                <p className="text-xs text-gray-400">Il nome e l&apos;indirizzo web della tua struttura.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Nome struttura *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Agriturismo dei Colli"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  Slug URL <span className="text-gray-400">(auto-generato)</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400 shrink-0">
                    agriturismi.app/agriturismo/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuale(true);
                    }}
                    placeholder="agriturismo-dei-colli"
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>
              <button
                onClick={() => { setErrore(""); if (!nome.trim()) { setErrore("Inserisci il nome."); return; } setStep(2); }}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                Continua →
              </button>
            </div>
          )}

          {/* ── STEP 2: Descrizione ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Descrizione</h2>
                <p className="text-xs text-gray-400">Racconta la tua struttura ai viaggiatori.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Descrizione</label>
                <textarea
                  value={descrizione}
                  onChange={(e) => setDescrizione(e.target.value)}
                  rows={5}
                  placeholder="Descrivete la vostra struttura, i prodotti tipici, le attività disponibili..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
                />
              </div>
              <button
                type="button"
                onClick={() => void generaDescrizione()}
                disabled={generandoDesc}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-dashed border-[#2D6A4F] text-[#2D6A4F] hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                {generandoDesc ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {generandoDesc ? "Generazione in corso…" : "Genera con AI"}
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => { setErrore(""); setStep(3); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  Continua →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Posizione ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Posizione</h2>
                <p className="text-xs text-gray-400">Indica dove si trova la struttura.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Regione</label>
                  <input
                    value={regione} onChange={(e) => setRegione(e.target.value)}
                    placeholder="Toscana"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Provincia</label>
                  <input
                    value={provincia} onChange={(e) => setProvincia(e.target.value)}
                    placeholder="SI"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Comune</label>
                <input
                  value={comune} onChange={(e) => setComune(e.target.value)}
                  placeholder="Montalcino"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Indirizzo</label>
                <input
                  value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)}
                  placeholder="Via delle Vigne 12"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <button
                type="button"
                onClick={() => void geocodifica()}
                disabled={geocodificando}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 self-start"
              >
                {geocodificando ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                {geocodificando ? "Ricerca in corso…" : "Trova posizione sulla mappa"}
              </button>

              {latOk && (
                <>
                  <p className="text-xs text-[#2D6A4F] font-medium">
                    ✓ Posizione trovata · Clicca sulla mappa per correggere il pin
                  </p>
                  <OnboardingMappa
                    lat={lat}
                    lng={lng}
                    onChange={(la, lo) => { setLat(la); setLng(lo); }}
                  />
                </>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => { setErrore(""); setStep(4); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  Continua →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Foto ── */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Foto principale</h2>
                <p className="text-xs text-gray-400">La prima immagine che vedranno i viaggiatori.</p>
              </div>

              {fotoPrincipale ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoPrincipale}
                    alt="Foto principale"
                    className="w-full h-48 object-cover rounded-2xl border border-gray-200"
                  />
                  <button
                    onClick={() => setFotoPrincipale(null)}
                    className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50"
                  >
                    Rimuovi
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#2D6A4F] hover:bg-green-50 transition-colors">
                  {uploadando ? (
                    <Loader2 size={24} className="animate-spin text-[#2D6A4F]" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">
                    {uploadando ? "Caricamento in corso…" : "Clicca per caricare una foto"}
                  </span>
                  <span className="text-xs text-gray-400">JPG, PNG, WebP · max 5 MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadFoto(f);
                    }}
                  />
                </label>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => { setErrore(""); setStep(5); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {fotoPrincipale ? "Continua →" : "Salta per ora →"}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Servizi ── */}
          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Servizi offerti</h2>
                <p className="text-xs text-gray-400">Seleziona i servizi disponibili nella tua struttura.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SERVIZI_LISTA.map(({ id, label }) => {
                  const sel = servizi.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleServizio(id)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left"
                      style={sel
                        ? { borderColor: "#2D6A4F", backgroundColor: "#F0FDF4", color: "#1B4332" }
                        : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#374151" }}
                    >
                      <span className="w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center text-[10px]"
                        style={sel ? { borderColor: "#2D6A4F", backgroundColor: "#2D6A4F", color: "white" } : { borderColor: "#D1D5DB" }}>
                        {sel ? "✓" : ""}
                      </span>
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => { setErrore(""); setStep(6); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  Continua →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 6: Riepilogo ── */}
          {step === 6 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">Riepilogo</h2>
                <p className="text-xs text-gray-400">Controlla i dati prima di pubblicare.</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Nome", value: nome },
                  { label: "Slug", value: `agriturismi.app/agriturismo/${slug}` },
                  { label: "Regione", value: regione || "—" },
                  { label: "Comune", value: comune || "—" },
                  { label: "Indirizzo", value: indirizzo || "—" },
                  { label: "Posizione GPS", value: latOk ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Non impostata" },
                  { label: "Foto", value: fotoPrincipale ? "✓ Caricata" : "Nessuna" },
                  { label: "Servizi", value: servizi.length > 0 ? `${servizi.length} selezionati` : "Nessuno" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-medium text-gray-400 w-28 shrink-0">{label}</span>
                    <span className="text-xs text-gray-700 flex-1 break-all">{value}</span>
                  </div>
                ))}
                {descrizione && (
                  <div className="py-2">
                    <span className="text-xs font-medium text-gray-400 block mb-1">Descrizione</span>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{descrizione}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => void submit()}
                  disabled={caricamento}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {caricamento && <Loader2 size={14} className="animate-spin" />}
                  {caricamento ? "Salvataggio…" : "Pubblica struttura"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Hai già una struttura?{" "}
          <Link href="/dashboard" className="underline hover:text-gray-600">
            Vai alla dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
