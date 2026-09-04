import type { Metadata } from "next";
import { IS_PREVIEW } from "@/app/seo-config";

import type { Lang } from "@/lib/i18n";
import { SITE_ROUTES } from "@/lib/site-routes";

export type SiteRouteKey = (typeof SITE_ROUTES)[number]["key"];

type LocalizedPageMetadataInput = {
  lang: Lang;
  routeKey: SiteRouteKey;
  title: string;
  description: string;
  robots?: Metadata["robots"];
};

type RoutePath = `/${string}`;

type LocalizedPathMetadataInput = Omit<LocalizedPageMetadataInput, "routeKey"> & {
  paths: Partial<Record<Lang, RoutePath>>;
};

const LANGUAGE_TAG = {
  pl: "pl-PL",
  en: "en-GB",
} as const;

const OPEN_GRAPH_LOCALE = {
  pl: "pl_PL",
  en: "en_GB",
} as const;

export function localizedPathMetadata({
  lang,
  paths,
  title,
  description,
  robots,
}: LocalizedPathMetadataInput): Metadata {
  const path = paths[lang];
  if (!path) throw new Error(`Localized metadata does not define a ${lang} path.`);

  const languages = Object.fromEntries(
    (["pl", "en"] as const).flatMap((candidateLang) => {
      const candidatePath = paths[candidateLang];
      return candidatePath ? [[LANGUAGE_TAG[candidateLang], candidatePath]] : [];
    }),
  );
  const alternateLocale = (["pl", "en"] as const)
    .filter((candidateLang) => candidateLang !== lang && Boolean(paths[candidateLang]))
    .map((candidateLang) => OPEN_GRAPH_LOCALE[candidateLang]);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "ProcuraCost",
      locale: OPEN_GRAPH_LOCALE[lang],
      alternateLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: IS_PREVIEW ? { index: false, follow: false } : robots,
  };
}

export function localizedPageMetadata({
  lang,
  routeKey,
  title,
  description,
  robots,
}: LocalizedPageMetadataInput): Metadata {
  const route = SITE_ROUTES.find((candidate) => candidate.key === routeKey);
  if (!route) throw new Error(`Unknown public route: ${routeKey}`);

  const path = route[lang];
  if (!path) throw new Error(`Public route ${routeKey} does not define a ${lang} path.`);

  return localizedPathMetadata({
    lang,
    paths: { pl: route.pl, en: route.en },
    title,
    description,
    robots,
  });
}
