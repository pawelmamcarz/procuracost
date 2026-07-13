import type { MetadataRoute } from "next";
import { EPISODES } from "@/lib/shortcasty";
import { SITE_URL } from "./seo-config";

const PL_ROUTES = [
  "/",
  "/assessment",
  "/calculator",
  "/case-studies",
  "/methodology",
  "/model",
  "/model/assumptions",
  "/optimizer",
  "/research",
  "/shortcasty",
  "/team",
];

const EN_ROUTES = [
  "/en",
  "/en/assessment",
  "/en/calculator",
  "/en/case-studies",
  "/en/model",
  "/en/model/assumptions",
  "/en/optimizer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = [...PL_ROUTES, ...EN_ROUTES].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "/" || route === "/en" ? 1 : 0.7,
  }));

  const episodeEntries = EPISODES.map((episode) => ({
    url: `${SITE_URL}/shortcasty/${episode.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...episodeEntries];
}
