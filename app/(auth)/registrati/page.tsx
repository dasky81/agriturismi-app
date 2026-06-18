"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { registrati, accediConGoogle } from "@/lib/auth";

type Ruolo = "visitatore" | "proprietario";

interface FormData {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  // Proprietario extra
  nome_struttura: string;
  comune_struttura: string;
  telefono: string;
}

function RegistratiInterna() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1: scelta ruolo | Step 2: form
  const [step, setStep] = useState<1 | 2>(1);
  const [ruolo, setRuolo] = useState<Ruolo>("visitatore");
  const [form, setForm] = useState<FormData>({
    nome: "", cognome: "", email: "", password: "",
    nome_struttura: "", comune_struttura: "", telefono: "",
  });
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [googleCaricamento, setGoogleCaricamento] = useState(false);
  const [successo, setSuccesso] = useState(false);

  // Pre-seleziona proprietario se arrivato dal CTA header
  useEffect(() => {
    if (searchParams.get("ruolo") === "proprietario") {
      setRuolo("proprietario");
      setStep(2);
    }
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSceltaRuolo(r: Ruolo) {
    setRuolo(r);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore("");
    setCaricamento(true);

    const extra =
      ruolo === "proprietario"
        ? {
            nome_struttura: form.nome_struttura || undefined,
            comune_struttura: form.comune_struttura || undefined,
            telefono: form.telefono || undefined,
          }
        : undefined;

    const { data, error } = await registrati(
      form.nome, form.cognome, form.email, form.password, ruolo, extra
    );

    if (error) {
      const msg = error.message.includes("already registered")
        ? "Esiste già un account con questa email."
        : "Registrazione non riuscita. Riprova.";
      setErrore(msg);
      setCaricamento(false);
      return;
    }

    if (data?.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setSuccesso(true);
    setCaricamento(false);
  }

  async function handleGoogle() {
    setGoogleCaricamento(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await accediConGoogle(redirectTo);
    if (error) {
      setErrore("Errore durante la registrazione con Google.");
      setGoogleCaricamento(false);
    }
  }

  if (successo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#2D6A4F" }} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Controlla la tua email</h2>
        <p className="text-sm text-gray-500 mb-6">
          Abbiamo inviato un link di conferma a{" "}
          <span className="font-medium text-gray-700">{form.email}</span>.
        </p>
        <Link href="/login" className="text-sm font-medium hover:underline" style={{ color: "#2D6A4F" }}>
          Torna al login
        </Link>
      </div>
    );
  }

  // ── STEP 1: Scelta ruolo ────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Benvenuto</h1>
        <p className="text-sm text-gray-500 mb-8">
          Come vuoi usare agriturismi.app?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Viaggiatore */}
          <button
            onClick={() => handleSceltaRuolo("visitatore")}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:border-[#2D6A4F] hover:bg-green-50 group text-left"
            style={{ borderColor: "#DDDDDD" }}
          >
            <span className="text-4xl">🏡</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-[#2D6A4F]">
                Sono un viaggiatore
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Cerca e scopri agriturismi in tutta Italia
              </p>
            </div>
          </button>

          {/* Proprietario */}
          <button
            onClick={() => handleSceltaRuolo("proprietario")}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:border-[#E8956D] hover:bg-orange-50 group text-left"
            style={{ borderColor: "#DDDDDD" }}
          >
            <span className="text-4xl">🌾</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-[#E8956D]">
                Ho un agriturismo
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Gestisci e promuovi la tua struttura
              </p>
            </div>
          </button>
        </div>

        <p className="text-sm text-center text-gray-500">
          Hai già un account?{" "}
          <Link href="/login" className="font-medium hover:underline" style={{ color: "#2D6A4F" }}>
            Accedi
          </Link>
        </p>
      </div>
    );
  }

  // ── STEP 2: Form registrazione ─────────────────────────────────
  const isProprietario = ruolo === "proprietario";
  const accent = isProprietario ? "#E8956D" : "#2D6A4F";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header step 2 */}
      <button
        onClick={() => setStep(1)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-5"
      >
        ← Torna alla scelta
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{isProprietario ? "🌾" : "🏡"}</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Crea il tuo account</h1>
          <p className="text-xs text-gray-500">
            {isProprietario ? "Proprietario di agriturismo" : "Viaggiatore"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              id="nome" name="nome" type="text" value={form.nome}
              onChange={handleChange} required autoComplete="given-name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
              style={{ ["--tw-ring-color" as string]: accent }}
              placeholder="Mario"
            />
          </div>
          <div>
            <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
            <input
              id="cognome" name="cognome" type="text" value={form.cognome}
              onChange={handleChange} required autoComplete="family-name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
              placeholder="Rossi"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email" name="email" type="email" value={form.email}
            onChange={handleChange} required autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
            placeholder="mario@esempio.it"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password" name="password" type="password" value={form.password}
            onChange={handleChange} required minLength={8} autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
            placeholder="Minimo 8 caratteri"
          />
        </div>

        {/* Campi extra proprietario */}
        {isProprietario && (
          <>
            <div className="h-px bg-gray-100" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              La tua struttura
            </p>

            <div>
              <label htmlFor="nome_struttura" className="block text-sm font-medium text-gray-700 mb-1">Nome struttura</label>
              <input
                id="nome_struttura" name="nome_struttura" type="text" value={form.nome_struttura}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
                placeholder="Agriturismo dei Colli"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="comune_struttura" className="block text-sm font-medium text-gray-700 mb-1">Comune</label>
                <input
                  id="comune_struttura" name="comune_struttura" type="text" value={form.comune_struttura}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
                  placeholder="Es. Siena"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input
                  id="telefono" name="telefono" type="tel" value={form.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
                  placeholder="+39 055 123456"
                />
              </div>
            </div>
          </>
        )}

        {errore && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errore}</p>
        )}

        <button
          type="submit"
          disabled={caricamento}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: accent }}
        >
          {caricamento && <Loader2 size={16} className="animate-spin" />}
          Crea account
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">oppure</span>
        </div>
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleCaricamento}
        className="w-full py-3 rounded-xl font-medium text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {googleCaricamento ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
        )}
        Continua con Google
      </button>

      <p className="mt-5 text-xs text-center text-gray-400">
        Registrandoti accetti i{" "}
        <Link href="#" className="underline hover:text-gray-600">Termini di servizio</Link>{" "}
        e la{" "}
        <Link href="#" className="underline hover:text-gray-600">Privacy policy</Link>.
      </p>
    </div>
  );
}

export default function RegistratiPage() {
  return (
    <Suspense fallback={null}>
      <RegistratiInterna />
    </Suspense>
  );
}
