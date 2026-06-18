"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface Props {
  userId: string;
}

const REGIONI = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto",
];

const CATEGORIE = [
  "B&B", "appartamento", "camera", "glamping", "agriturismo",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export default function FormAggiungi({ userId }: Props) {
  const supabase = creaClientBrowser();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("B&B");
  const [regione, setRegione] = useState("");
  const [provincia, setProvincia] = useState("");
  const [comune, setComune] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [sitoWeb, setSitoWeb] = useState("");
  const [confermaTitolare, setConfermaTitolare] = useState(false);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confermaTitolare) {
      setErrore("Devi confermare di essere il titolare o gestore autorizzato.");
      return;
    }
    setErrore("");
    setCaricamento(true);

    const baseSlug = slugify(nome + (comune ? `-${slugify(comune)}` : ""));
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

    const { data, error } = await supabase
      .from("agriturismi")
      .insert({
        slug,
        nome: nome.trim(),
        tipo_ospitalita: [categoria],
        regione: regione || null,
        provincia: provincia.trim() || null,
        comune: comune.trim() || null,
        indirizzo: indirizzo.trim() || null,
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        sito_web: sitoWeb.trim() || null,
        proprietario_id: userId,
        verificato: false,
        attivo: true,
        servizi: [],
        gallery: [],
      })
      .select("slug")
      .single();

    if (error) {
      setErrore("Errore durante il salvataggio. Verifica i dati e riprova.");
      setCaricamento(false);
      return;
    }

    router.push(`/agriturismo/${data.slug}?nuovo=1`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">

      {/* Nome struttura */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nome della struttura <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Agriturismo Il Poggio"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition bg-white"
        >
          {CATEGORIE.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Regione + Provincia */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Regione <span className="text-red-500">*</span>
          </label>
          <select
            value={regione}
            onChange={(e) => setRegione(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition bg-white"
          >
            <option value="">Seleziona regione</option>
            {REGIONI.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Provincia
          </label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            placeholder="Siena"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Comune */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Comune <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={comune}
          onChange={(e) => setComune(e.target.value)}
          required
          placeholder="Montalcino"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Indirizzo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Indirizzo
        </label>
        <input
          type="text"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
          placeholder="Via Panoramica 12, 53024 Montalcino SI"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
        />
      </div>

      {/* Telefono + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telefono
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+39 0577 000000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@miastruttura.it"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition"
          />
        </div>
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

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Checkbox conferma titolare */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={confermaTitolare}
          onChange={(e) => setConfermaTitolare(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 shrink-0"
          style={{ accentColor: "#2D6A4F" }}
        />
        <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
          Confermo di essere il titolare o gestore autorizzato di questa struttura
          e di avere il diritto di inserirla su agriturismi.app. I dati forniti
          sono veritieri e aggiornati.
          <span className="text-red-500 ml-1">*</span>
        </span>
      </label>

      {errore && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {errore}
        </p>
      )}

      <button
        type="submit"
        disabled={caricamento || !confermaTitolare}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: "#2D6A4F" }}
      >
        {caricamento && <Loader2 size={16} className="animate-spin" />}
        Aggiungi la struttura
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        La scheda sarà visibile subito ma contrassegnata come &quot;non verificata&quot;.
        Potrai aggiungere foto e dettagli aggiuntivi dopo la pubblicazione.
      </p>
    </form>
  );
}
