import type { MetadataRoute } from "next";
import { SITE_ROUTES, sitemapPaths } from "@/lib/site-routes";
import { SITE_URL } from "./seo-config";

function localizedAlternates(path: string) {
  const route = SITE_ROUTES.find(
    (candidate) => candidate.sitemap && !candidate.canonical && (candidate.pl === path || candidate.en === path),
  );

  if (!route?.en) return undefined;

  return {
    languages: {
      pl: `${SITE_URL}${route.pl}`,
      en: `${SITE_URL}${route.en}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths().map((path) => ({
    url: `${SITE_URL}${path}`,
    alternates: localizedAlternates(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" || path === "/en" ? 1 : 0.7,
  }));
}
