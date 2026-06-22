"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const TIPI = [
  "agriturismo", "cantina", "ristorante", "noleggio",
  "campeggio", "glamping", "hotel", "beb", "attrazione",
];

const DOMINI = [
  "agriturismi.app", "cantine.app", "ristoranti.app",
  "noleggio.app", "green.camp", "soggiorni.app", "crociera.app", "viaggi.app",
];

interface Props {
  onAggiunto: () => void;
}

export default function FormAggiungiLuogo({ onAggiunto }: Props) {
  const [form, setForm] = useState({
    nome: "", slug: "", tipo: "agriturismo", dominio_fonte: "agriturismi.app",
    url_scheda: "", comune: "", regione: "", lat: "", lng: "", descrizione: "",
  });
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === "nome" && !form.slug) {
      setForm((p) => ({
        ...p,
        nome: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrore("");
    setSuccesso("");
    setCaricamento(true);

    const body = {
      nome: form.nome,
      slug: form.slug,
      tipo: form.tipo,
      dominio_fonte: form.dominio_fonte,
      url_scheda: form.url_scheda,
      comune: form.comune || undefined,
      regione: form.regione || undefined,
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      descrizione: form.descrizione || undefined,
    };

    const res = await fetch("/api/admin/network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json() as { ok?: boolean; errore?: string };
    if (!res.ok) {
      setErrore(data.errore ?? "Errore sconosciuto");
    } else {
      setSuccesso("Luogo aggiunto al network con successo.");
      setForm({
        nome: "", slug: "", tipo: "agriturismo", dominio_fonte: "agriturismi.app",
        url_scheda: "", comune: "", regione: "", lat: "", lng: "", descrizione: "",
      });
      onAggiunto();
    }
    setCaricamento(false);
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Nome *</label>
          <input
            name="nome" value={form.nome} onChange={handleChange} required
            placeholder="Cantina dei Colli"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
          <input
            name="slug" value={form.slug} onChange={handleChange} required
            placeholder="cantina-dei-colli"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Tipo *</label>
          <select
            name="tipo" value={form.tipo} onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          >
            {TIPI.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Dominio fonte *</label>
          <select
            name="dominio_fonte" value={form.dominio_fonte} onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          >
            {DOMINI.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">URL scheda *</label>
        <input
          name="url_scheda" type="url" value={form.url_scheda} onChange={handleChange} required
          placeholder="https://cantine.app/cantina/cantina-dei-colli"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Comune</label>
          <input
            name="comune" value={form.comune} onChange={handleChange}
            placeholder="Montepulciano"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Regione</label>
          <input
            name="regione" value={form.regione} onChange={handleChange}
            placeholder="Toscana"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Latitudine</label>
          <input
            name="lat" type="number" step="any" value={form.lat} onChange={handleChange}
            placeholder="43.1234"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Longitudine</label>
          <input
            name="lng" type="number" step="any" value={form.lng} onChange={handleChange}
            placeholder="11.7890"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Descrizione</label>
        <textarea
          name="descrizione" value={form.descrizione}
          onChange={(e) => setForm((p) => ({ ...p, descrizione: e.target.value }))}
          rows={2}
          placeholder="Breve descrizione del luogo..."
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
        />
      </div>

      {errore && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errore}</p>
      )}
      {successo && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">{successo}</p>
      )}

      <button
        type="submit"
        disabled={caricamento}
        className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#2D6A4F" }}
      >
        {caricamento && <Loader2 size={14} className="animate-spin" />}
        Aggiungi al network
      </button>
    </form>
  );
}
