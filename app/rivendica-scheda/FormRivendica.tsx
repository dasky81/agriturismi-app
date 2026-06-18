"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface Agriturismo {
  id: string;
  nome: string;
  slug: string;
  regione: string | null;
}

interface Props {
  userId: string;
  agriturismo: Agriturismo;
}

const RUOLI = ["proprietario", "gestore", "delegato"] as const;

export default function FormRivendica({ userId, agriturismo }: Props) {
  const supabase = creaClientBrowser();

  const [nome, setNome] = useState("");
  const [ruolo, setRuolo] = useState<string>("proprietario");
  const [telefono, setTelefono] = useState("");
  const [emailAziendale, setEmailAziendale] = useState("");
  const [sitoWeb, setSitoWeb] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore("");
    setCaricamento(true);

    const messaggioCompleto = [
      `Nome: ${nome}`,
      `Ruolo: ${ruolo}`,
      `Telefono: ${telefono}`,
      `Email aziendale: ${emailAziendale}`,
      ...(sitoWeb ? [`Sito web: ${sitoWeb}`] : []),
      "",
      `Messaggio: ${messaggio}`,
    ].join("\n");

    const { error } = await supabase.from("rivendicazioni").insert({
      agriturismo_id: agriturismo.id,
      utente_id: userId,
      stato: "pending",
      messaggio: messaggioCompleto,
    });

    if (error) {
      setErrore("Errore durante l'invio. Riprova o contattaci direttamente.");
      setCaricamento(false);
      return;
    }

    setInviato(true);
    setCaricamento(false);
  }

  if (inviato) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#2D6A4F" }} />
        <h2 className="font-display text-xl font-bold mb-2" style={{ color: "#1B4332" }}>
          Richiesta inviata!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Abbiamo ricevuto la tua richiesta per la scheda di{" "}
          <strong>{agriturismo.nome}</strong>.<br />
          Ti contatteremo entro 48 ore per completare la verifica.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          Controlla la tua casella email per eventuali aggiornamenti.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
      {/* Struttura rivendicata */}
      <div className="rounded-xl bg-[#FAFAF7] border border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-500 mb-0.5">Stai rivendicando la scheda di:</p>
        <p className="font-display font-bold text-sm" style={{ color: "#1B4332" }}>
          {agriturismo.nome}
          {agriturismo.regione && (
            <span className="font-normal text-gray-400 ml-2">— {agriturismo.regione}</span>
          )}
        </p>
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nome e cognome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Mario Rossi"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Ruolo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Ruolo <span className="text-red-500">*</span>
        </label>
        <select
          value={ruolo}
          onChange={(e) => setRuolo(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition bg-white"
        >
          {RUOLI.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Telefono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Telefono <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          placeholder="+39 0577 000000"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Email aziendale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email aziendale <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={emailAziendale}
          onChange={(e) => setEmailAziendale(e.target.value)}
          required
          placeholder="info@miastruttura.it"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
        <p className="mt-1 text-xs text-gray-400">
          Usa l&apos;email del dominio aziendale per velocizzare la verifica.
        </p>
      </div>

      {/* Sito web */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Sito web ufficiale
        </label>
        <input
          type="url"
          value={sitoWeb}
          onChange={(e) => setSitoWeb(e.target.value)}
          placeholder="https://www.miastruttura.it"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Messaggio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Messaggio (opzionale)
        </label>
        <textarea
          value={messaggio}
          onChange={(e) => setMessaggio(e.target.value)}
          rows={3}
          placeholder="Aggiungi eventuali note o informazioni che ritieni utili..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition resize-none"
        />
      </div>

      {errore && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {errore}
        </p>
      )}

      <button
        type="submit"
        disabled={caricamento}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#2D6A4F" }}
      >
        {caricamento && <Loader2 size={16} className="animate-spin" />}
        Invia richiesta di rivendicazione
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Il tuo profilo verrà verificato dal nostro team entro 48 ore lavorative.
        La rivendicazione è gratuita.
      </p>
    </form>
  );
}
