import { MetadataRoute } from "next";
import { creaClientServer } from "@/lib/supabase-server";

const BASE_URL = "https://www.agriturismi.app";

const PAGINE_STATICHE: Array<{
  url: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { url: "/",                    priority: 1.0, changeFrequency: "daily" },
  { url: "/blog",                priority: 0.6, changeFrequency: "daily" },
  { url: "/aggiungi-struttura",  priority: 0.5, changeFrequency: "monthly" },
  { url: "/per-gestori",         priority: 0.5, changeFrequency: "monthly" },
];

const PAGINE_SEO: Array<{
  url: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  // Regionali
  { url: "/agriturismi-toscana",   changeFrequency: "weekly" },
  { url: "/agriturismi-umbria",    changeFrequency: "weekly" },
  { url: "/agriturismi-sicilia",   changeFrequency: "weekly" },
  { url: "/agriturismi-puglia",    changeFrequency: "weekly" },
  { url: "/agriturismi-lazio",     changeFrequency: "weekly" },
  { url: "/agriturismi-piemonte",  changeFrequency: "weekly" },
  { url: "/agriturismi-veneto",    changeFrequency: "weekly" },
  { url: "/agriturismi-campania",  changeFrequency: "weekly" },
  { url: "/agriturismi-sardegna",  changeFrequency: "weekly" },
  { url: "/agriturismi-trentino",  changeFrequency: "weekly" },
  // Tematiche
  { url: "/agriturismi-con-piscina",        changeFrequency: "weekly" },
  { url: "/agriturismi-per-famiglie",       changeFrequency: "weekly" },
  { url: "/agriturismi-con-ristorante",     changeFrequency: "weekly" },
  { url: "/agriturismi-con-spa",            changeFrequency: "weekly" },
  { url: "/agriturismi-con-animali",        changeFrequency: "weekly" },
  { url: "/agriturismi-vicino-al-mare",     changeFrequency: "weekly" },
  { url: "/agriturismi-degustazione-vino",  changeFrequency: "weekly" },
  { url: "/agriturismi-romantici",          changeFrequency: "weekly" },
  { url: "/agriturismi-biologici",          changeFrequency: "weekly" },
  { url: "/agriturismi-con-maneggio",       changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await creaClientServer();

  const [{ data: agriturismi }, { data: post }] = await Promise.all([
    supabase.from("agriturismi").select("slug, updated_at").eq("attivo", true),
    supabase.from("post").select("slug, updated_at").eq("pubblicato", true),
  ]);

  const pagineSEO: MetadataRoute.Sitemap = PAGINE_SEO.map((p) => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: 0.8,
  }));

  const pagineStatiche: MetadataRoute.Sitemap = PAGINE_STATICHE.map((p) => ({
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

  return [...pagineStatiche, ...pagineSEO, ...pagineAgriturismo, ...paginePost];
}
