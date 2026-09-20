import { SITE_URL } from "@/app/seo-config";
import { researchPaperT, siteMetadataT, type Lang } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2";

const SCHEMA_CONTEXT = "https://schema.org";
const SITE_NAME = "ProcuraCost";
const BRAND_SUFFIX = " | ProcuraCost";

const IN_LANGUAGE = {
  pl: "pl-PL",
  en: "en-GB",
} as const;

const HOME_PATH = {
  pl: "/",
  en: "/en",
} as const;

const CALCULATOR_PATH = {
  pl: "/calculator",
  en: "/en/calculator",
} as const;

export function organizationJsonLd() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  };
}

export function websiteJsonLd(lang: Lang) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}${HOME_PATH[lang]}`,
    inLanguage: IN_LANGUAGE[lang],
  };
}

export function siteJsonLd(lang: Lang) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [organizationJsonLd(), websiteJsonLd(lang)],
  };
}

export function scholarlyArticleJsonLd() {
  const paper = researchPaperT.en;
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ScholarlyArticle",
    headline: paper.title,
    description: paper.metadata.description,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    inLanguage: IN_LANGUAGE.en,
    citation: paper.references.map((reference) => ({
      "@type": "CreativeWork",
      name: reference.label,
      url: reference.href,
    })),
  };
}

export function softwareApplicationJsonLd(lang: Lang) {
  const metadata = siteMetadataT[lang].calculator;
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "SoftwareApplication",
    name: metadata.title.replace(BRAND_SUFFIX, ""),
    description: metadata.description,
    url: `${SITE_URL}${CALCULATOR_PATH[lang]}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    inLanguage: IN_LANGUAGE[lang],
    offers: { "@type": "Offer", price: 0, priceCurrency: "PLN" },
    version: MODEL_V2_METADATA.modelVersion,
  };
}

export type BreadcrumbCrumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

export function jsonLdScriptContent(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
