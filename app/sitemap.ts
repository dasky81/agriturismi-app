import { MetadataRoute } from "next";
import { creaClientServer } from "@/lib/supabase-server";

const BASE_URL = "https://agriturismi.app";

const PAGINE_STATICHE = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/blog", priority: 0.8, changeFrequency: "daily" as const },
  { url: "/agriturismi-toscana", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-umbria", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-sicilia", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-puglia", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-lazio", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-piemonte", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-veneto", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-campania", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-sardegna", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-trentino", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/agriturismi-con-piscina", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-per-famiglie", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-con-ristorante", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-con-spa", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-con-animali", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-vicino-al-mare", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-degustazione-vino", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-romantici", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-biologici", priority: 0.85, changeFrequency: "weekly" as const },
  { url: "/agriturismi-con-maneggio", priority: 0.85, changeFrequency: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await creaClientServer();

  const [{ data: agriturismi }, { data: post }] = await Promise.all([
    supabase
      .from("agriturismi")
      .select("slug, updated_at")
      .eq("attivo", true),
    supabase
      .from("post")
      .select("slug, updated_at")
      .eq("pubblicato", true),
  ]);

  const pagineSEO: MetadataRoute.Sitemap = PAGINE_STATICHE.map((p) => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const pagineAgriturismo: MetadataRoute.Sitemap = (agriturismi ?? []).map((a) => ({
    url: `${BASE_URL}/agriturismo/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const paginePost: MetadataRoute.Sitemap = (post ?? []).map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pagineSEO, ...pagineAgriturismo, ...paginePost];
}
