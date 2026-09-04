import type { MetadataRoute } from "next";
import { SITE_ROUTES, sitemapPaths } from "@/lib/site-routes";
import { EPISODES } from "@/lib/shortcasty";
import { SITE_URL } from "./seo-config";

function localizedAlternates(path: string) {
  const route = SITE_ROUTES.find(
    (candidate) => candidate.sitemap && !candidate.canonical && (candidate.pl === path || candidate.en === path),
  );

  if (!route?.pl || !route.en) return undefined;

  return {
    languages: {
      "pl-PL": `${SITE_URL}${route.pl}`,
      "en-GB": `${SITE_URL}${route.en}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...sitemapPaths().map((path) => ({
      url: `${SITE_URL}${path}`,
      alternates: localizedAlternates(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" || path === "/en" ? 1 : 0.7,
    })),
    ...EPISODES.filter((episode) => episode.publishedAt).map((episode) => ({
      url: `${SITE_URL}/shortcasty/${episode.slug}`,
      lastModified: episode.publishedAt,
    })),
  ];
}
