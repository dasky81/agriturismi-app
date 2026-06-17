import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { creaClientServer } from "@/lib/supabase-server";
import { PostConAutore } from "@/types";

export const metadata: Metadata = {
  title: "Blog — Agriturismi.app",
  description:
    "Articoli, guide e consigli sugli agriturismi italiani: esperienze, ricette, stagioni e mete.",
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
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="mt-2 text-gray-500">
          Storie, guide e ispirazioni dagli agriturismi italiani.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          Nessun articolo pubblicato ancora.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {p.cover_url ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={p.cover_url}
                    alt={p.titolo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">🌿</span>
                </div>
              )}

              <div className="p-5">
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="hover:text-[#2D6A4F] transition-colors"
                  >
                    {p.titolo}
                  </Link>
                </h2>

                {p.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                    {p.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                  <span>
                    {p.autore?.nome
                      ? `${p.autore.nome} ${p.autore.cognome ?? ""}`.trim()
                      : "Redazione"}
                  </span>
                  <time dateTime={p.created_at}>
                    {formatData(p.created_at)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
