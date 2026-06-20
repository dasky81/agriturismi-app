import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { creaClientServer } from "@/lib/supabase-server";
import { PostConAutore } from "@/types";
import SezioneMeteo from "@/components/SezioneMeteo";

export const metadata: Metadata = {
  title: "Blog — Agriturismi.app",
  description:
    "Storie, guide e ispirazioni dagli agriturismi italiani: esperienze, ricette, stagioni e mete.",
};

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = await creaClientServer();

  const { data: post } = await supabase
    .from("post")
    .select(
      `*, autore:profiles(nome, cognome), agriturismo:agriturismi(id, slug, nome, regione)`
    )
    .eq("pubblicato", true)
    .order("created_at", { ascending: false });

  const posts = (post ?? []) as PostConAutore[];

  return (
    <div className="flex flex-col flex-1">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-3">
            Racconti · Guide · Ispirazione
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
          >
            Storie dal territorio
          </h1>
          <p className="text-white/65 text-lg max-w-lg mx-auto leading-relaxed">
            Esperienze autentiche, ricette di stagione e consigli per vivere
            al meglio gli agriturismi italiani.
          </p>
        </div>
      </section>

      {/* ── ARTICOLI ──────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto w-full px-4 py-12 flex-1">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📖</p>
            <p className="text-gray-400 font-medium">
              Nessun articolo pubblicato ancora.
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Torna presto per nuove storie dal territorio.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover */}
                {p.cover_url ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={p.cover_url}
                      alt={p.titolo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className="h-48 w-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)",
                    }}
                  >
                    <span className="text-5xl opacity-20 select-none">🌿</span>
                  </div>
                )}

                {/* Contenuto */}
                <div className="p-5 flex flex-col gap-2">
                  {/* Tag/categoria */}
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#D4A01720",
                            color: "#A07810",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Titolo */}
                  <h2 className="font-display font-bold text-[#1B4332] leading-snug line-clamp-2 group-hover:text-[#2D6A4F] transition-colors">
                    <Link href={`/blog/${p.slug}`}>{p.titolo}</Link>
                  </h2>

                  {/* Excerpt */}
                  {p.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {p.excerpt}
                    </p>
                  )}

                  {/* Footer card */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1 pt-3 border-t border-gray-50">
                    <span className="font-medium text-gray-500">
                      {p.autore?.nome
                        ? `${p.autore.nome} ${p.autore.cognome ?? ""}`.trim()
                        : "Redazione"}
                    </span>
                    <time dateTime={p.created_at}>{formatData(p.created_at)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <SezioneMeteo />

    </div>
  );
}
