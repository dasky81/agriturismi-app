import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { creaClientServer } from "@/lib/supabase-server";
import ShareButtons from "@/components/ShareButtons";
import { PostConAutore } from "@/types";

const getPost = cache(async (slug: string): Promise<PostConAutore | null> => {
  const supabase = await creaClientServer();
  const { data } = await supabase
    .from("post")
    .select(
      `*, autore:profiles(nome, cognome), agriturismo:agriturismi(id, slug, nome, regione)`
    )
    .eq("slug", slug)
    .eq("pubblicato", true)
    .single();
  return data as PostConAutore | null;
});

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post non trovato" };

  const baseUrl = "https://www.agriturismi.app";
  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.og_title ?? post.titolo,
    description: post.og_description ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.og_title ?? post.titolo,
      description: post.og_description ?? post.excerpt ?? undefined,
      url,
      type: "article",
      images: post.og_image ?? post.cover_url
        ? [{ url: (post.og_image ?? post.cover_url)! }]
        : [],
      publishedTime: post.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.og_title ?? post.titolo,
      description: post.og_description ?? post.excerpt ?? undefined,
      images: post.og_image ?? post.cover_url
        ? [(post.og_image ?? post.cover_url)!]
        : [],
    },
    alternates: { canonical: url },
  };
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const baseUrl = "https://www.agriturismi.app";
  const url = `${baseUrl}/blog/${post.slug}`;

  const nomeAutore = post.autore?.nome
    ? `${post.autore.nome} ${post.autore.cognome ?? ""}`.trim()
    : "Redazione";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titolo,
    description: post.excerpt ?? undefined,
    url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: nomeAutore },
    publisher: {
      "@type": "Organization",
      name: "agriturismi.app",
      url: "https://www.agriturismi.app",
    },
    ...(post.cover_url ? { image: post.cover_url } : {}),
    inLanguage: "it",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-gray-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-gray-600">
          Blog
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{post.titolo}</span>
      </nav>

      {/* Tag */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
        {post.titolo}
      </h1>

      {post.excerpt && (
        <p className="text-lg text-gray-500 mb-6 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Meta autore/data */}
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
        <span className="font-medium text-gray-600">{nomeAutore}</span>
        <span>·</span>
        <time dateTime={post.created_at}>{formatData(post.created_at)}</time>
      </div>

      {/* Cover */}
      {post.cover_url && (
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8">
          <Image
            src={post.cover_url}
            alt={post.titolo}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
      )}

      {/* Contenuto HTML */}
      {post.contenuto && (
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.contenuto }}
        />
      )}

      {/* Agriturismo collegato */}
      {post.agriturismo && (
        <div className="mt-10 p-5 bg-green-50 rounded-2xl border border-green-100">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
            Agriturismo in evidenza
          </p>
          <Link
            href={`/agriturismo/${post.agriturismo.slug}`}
            className="text-lg font-semibold text-gray-900 hover:text-[#2D6A4F] transition-colors"
          >
            {post.agriturismo.nome}
          </Link>
          {post.agriturismo.regione && (
            <p className="text-sm text-gray-500 mt-0.5">
              {post.agriturismo.regione}
            </p>
          )}
          <Link
            href={`/agriturismo/${post.agriturismo.slug}`}
            className="inline-block mt-3 text-sm font-medium text-[#2D6A4F] hover:underline"
          >
            Scopri la scheda →
          </Link>
        </div>
      )}

      {/* Condivisione */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Condividi questo articolo
        </p>
        <ShareButtons url={url} titolo={post.titolo} />
      </div>
    </main>
  );
}
