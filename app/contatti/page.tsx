"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

type Tipo = "info" | "rivendicazione" | "partnership" | "altro";

export default function ContattiPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState<Tipo>("info");
  const [messaggio, setMessaggio] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState("");

  const supabase = creaClientBrowser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore("");
    if (!nome.trim() || !email.trim() || !messaggio.trim()) {
      setErrore("Compila tutti i campi obbligatori.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contatti").insert({
      nome: nome.trim(),
      email: email.trim(),
      telefono: telefono.trim() || null,
      tipo,
      messaggio: messaggio.trim(),
    });
    setLoading(false);
    if (error) {
      setErrore("Errore durante l'invio. Riprova.");
    } else {
      setInviato(true);
    }
  }

  if (inviato) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle size={48} className="mx-auto mb-4 text-[#2D6A4F]" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messaggio inviato!</h1>
        <p className="text-gray-500">
          Grazie per averci contattato. Ti risponderemo al più presto a{" "}
          <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contattaci</h1>
        <p className="text-gray-500">
          Hai domande, vuoi segnalare la tua struttura o proporre una partnership?
          Scrivici.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Mario Rossi"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mario@esempio.it"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefono <span className="text-gray-400 font-normal">(opzionale)</span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+39 333 123 4567"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oggetto <span className="text-red-500">*</span>
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition"
            >
              <option value="info">Informazioni generali</option>
              <option value="rivendicazione">Rivendica struttura</option>
              <option value="partnership">Partnership</option>
              <option value="altro">Altro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Messaggio <span className="text-red-500">*</span>
          </label>
          <textarea
            value={messaggio}
            onChange={(e) => setMessaggio(e.target.value)}
            placeholder="Scrivi il tuo messaggio..."
            rows={5}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition resize-none"
          />
        </div>

        {errore && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{errore}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#2D6A4F" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Invio in corso..." : "Invia messaggio"}
        </button>
      </form>
    </div>
  );
}
