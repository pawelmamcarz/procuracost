import { navigationT, type Lang, type NavigationLabelKey } from "@/lib/i18n";

type RoutePath = `/${string}`;

type NavigationConfig = {
  pl?: NavigationLabelKey;
  en?: NavigationLabelKey;
  highlight?: boolean;
};

type SiteRoute = {
  key: string;
  pl: RoutePath;
  en?: RoutePath;
  aliases?: readonly RoutePath[];
  canonical?: boolean;
  nav?: NavigationConfig;
  sitemap: boolean;
};

export const SITE_ROUTES: readonly SiteRoute[] = [
  { key: "home", pl: "/", en: "/en", sitemap: true },
  { key: "calculator", pl: "/calculator", en: "/en/calculator", nav: { pl: "calculator", en: "calculator" }, sitemap: true },
  { key: "optimizer", pl: "/optimizer", en: "/en/optimizer", nav: { pl: "optimizer", en: "optimizer", highlight: true }, sitemap: true },
  { key: "caseStudies", pl: "/case-studies", en: "/en/case-studies", nav: { pl: "caseStudies", en: "caseStudies" }, sitemap: true },
  { key: "assessment", pl: "/assessment", en: "/en/assessment", nav: { pl: "assessment", en: "assessment" }, sitemap: true },
  { key: "team", pl: "/team", en: "/en/team", nav: { pl: "team", en: "team" }, sitemap: true },
  { key: "methodology", pl: "/methodology", en: "/en/methodology", nav: { pl: "methodology", en: "methodology" }, sitemap: true },
  { key: "model", pl: "/model", en: "/en/model", nav: { en: "model" }, sitemap: true },
  { key: "modelAssumptions", pl: "/model/assumptions", en: "/en/model/assumptions", sitemap: true },
  { key: "research", pl: "/research", aliases: ["/en/research"], canonical: true, nav: { pl: "research" }, sitemap: true },
  { key: "researchAgenda", pl: "/research-agenda", nav: { pl: "researchAgenda" }, sitemap: true },
  { key: "shortcasts", pl: "/shortcasty", en: "/en/shortcasty", sitemap: false },
] as const;

export type NavigationItem = { href: RoutePath; label: string; highlight?: boolean };

function splitPathname(pathname: string) {
  const suffixStart = pathname.search(/[?#]/);
  return suffixStart === -1 ? { path: pathname, suffix: "" } : { path: pathname.slice(0, suffixStart), suffix: pathname.slice(suffixStart) };
}

function homepageFor(lang: Lang): RoutePath {
  const home = SITE_ROUTES.find((route) => route.key === "home");
  if (!home) throw new Error("The route manifest must define a homepage.");
  return lang === "en" ? home.en ?? home.pl : home.pl;
}

export function localizedCounterpart(pathname: string, targetLang: Lang): string {
  const { path, suffix } = splitPathname(pathname);
  const route = SITE_ROUTES.find((candidate) => candidate.pl === path || candidate.en === path || candidate.aliases?.includes(path as RoutePath));
  if (!route) return `${homepageFor(targetLang)}${suffix}`;
  if (route.canonical) return `${route.pl}${suffix}`;
  return `${targetLang === "en" ? route.en ?? homepageFor("en") : route.pl}${suffix}`;
}

export function navigationFor(lang: Lang): NavigationItem[] {
  return SITE_ROUTES.flatMap((route) => {
    const labelKey = route.nav?.[lang];
    const href = lang === "en" ? route.en : route.pl;
    return labelKey && href ? [{ href, label: navigationT[lang][labelKey], highlight: route.nav?.highlight }] : [];
  });
}

export function sitemapPaths(): RoutePath[] {
  return [...new Set(SITE_ROUTES.flatMap((route) => !route.sitemap ? [] : route.en && !route.canonical ? [route.pl, route.en] : [route.pl]))];
}
