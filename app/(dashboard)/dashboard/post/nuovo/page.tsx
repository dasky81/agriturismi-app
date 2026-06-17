"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { creaClientBrowser } from "@/lib/supabase";
import { Sparkles, Save, Loader2 } from "lucide-react";

/* Carica l'editor solo lato client per evitare problemi SSR con Tiptap */
const EditorPost = dynamic(() => import("@/components/EditorPost"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-xl border border-gray-200 bg-gray-50 animate-pulse" />
  ),
});

function slugify(testo: string): string {
  return testo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function NuovoPostPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [titolo, setTitolo] = useState("");
  const [agriturismo_nome, setAgriturismo_nome] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [pubblicato, setPubblicato] = useState(false);

  const [generando, setGenerando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [successo, setSuccesso] = useState(false);

  async function generaConAI() {
    if (!titolo.trim()) {
      setErrore("Inserisci prima un titolo per generare il contenuto.");
      return;
    }
    setErrore(null);
    setGenerando(true);
    try {
      const res = await fetch("/api/genera-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titolo: titolo.trim(),
          agriturismo_nome: agriturismo_nome.trim() || undefined,
        }),
      });
      const dati = (await res.json()) as { html?: string; errore?: string };
      if (!res.ok || !dati.html) {
        throw new Error(dati.errore ?? "Errore nella generazione");
      }
      setContenuto(dati.html);
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setGenerando(false);
    }
  }

  async function salva(e: React.FormEvent) {
    e.preventDefault();
    if (!titolo.trim()) {
      setErrore("Il titolo è obbligatorio.");
      return;
    }
    setErrore(null);
    setSalvando(true);
    try {
      const supabase = creaClientBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrore("Sessione scaduta. Accedi di nuovo.");
        return;
      }

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const slug = `${slugify(titolo)}-${Date.now().toString(36)}`;

      const { error } = await supabase.from("post").insert({
        titolo: titolo.trim(),
        slug,
        contenuto: contenuto || null,
        excerpt: excerpt.trim() || null,
        tags: tagsArray,
        pubblicato,
        autore_id: user.id,
      });

      if (error) throw new Error(error.message);

      setSuccesso(true);
      startTransition(() => {
        router.push("/dashboard/post");
        router.refresh();
      });
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "Errore durante il salvataggio");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuovo post</h1>
      </div>

      <form onSubmit={salva} className="flex flex-col gap-6">
        {/* Titolo */}
        <div>
          <label
            htmlFor="titolo"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Titolo <span className="text-red-400">*</span>
          </label>
          <input
            id="titolo"
            type="text"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
            placeholder="es. I migliori agriturismi in Toscana per l'autunno"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
          />
        </div>

        {/* Agriturismo collegato */}
        <div>
          <label
            htmlFor="agriturismo"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Agriturismo collegato{" "}
            <span className="text-gray-400 font-normal">(opzionale)</span>
          </label>
          <input
            id="agriturismo"
            type="text"
            value={agriturismo_nome}
            onChange={(e) => setAgriturismo_nome(e.target.value)}
            placeholder="Nome dell'agriturismo (usato dall'AI)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
          />
        </div>

        {/* Pulsante genera con AI */}
        <button
          type="button"
          onClick={generaConAI}
          disabled={generando}
          className="self-start inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {generando ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Genera con AI
            </>
          )}
        </button>

        {/* Editor Tiptap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contenuto
          </label>
          <EditorPost contenuto={contenuto} onChange={setContenuto} />
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Anteprima{" "}
            <span className="text-gray-400 font-normal">
              (breve descrizione per le card)
            </span>
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Una breve descrizione che apparirà nelle card e nei risultati di ricerca..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Tag{" "}
            <span className="text-gray-400 font-normal">
              (separati da virgola)
            </span>
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Toscana, autunno, vino, famiglia"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
          />
        </div>

        {/* Pubblicato */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={pubblicato}
              onChange={(e) => setPubblicato(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                pubblicato ? "bg-[#2D6A4F]" : "bg-gray-200"
              }`}
            />
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                pubblicato ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm text-gray-700">
            {pubblicato ? "Pubblica subito" : "Salva come bozza"}
          </span>
        </label>

        {/* Errore */}
        {errore && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
            {errore}
          </p>
        )}

        {/* Successo */}
        {successo && (
          <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
            Post salvato! Reindirizzo...
          </p>
        )}

        {/* Azioni */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#245a42] disabled:opacity-50 transition-colors"
          >
            {salvando ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save size={15} />
                Salva post
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 transition-colors"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
