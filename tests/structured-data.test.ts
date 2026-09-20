import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/app/seo-config";
import { researchPaperT, siteMetadataT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2";
import {
  jsonLdScriptContent,
  organizationJsonLd,
  scholarlyArticleJsonLd,
  siteJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";

describe("JSON-LD structured data builders", () => {
  it("describes the site as an Organization with the canonical logo", () => {
    expect(organizationJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ProcuraCost",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    });
  });

  it.each([
    { lang: "pl", url: `${SITE_URL}/`, inLanguage: "pl-PL" },
    { lang: "en", url: `${SITE_URL}/en`, inLanguage: "en-GB" },
  ] as const)("describes the $lang site as a WebSite", ({ lang, url, inLanguage }) => {
    expect(websiteJsonLd(lang)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ProcuraCost",
      url,
      inLanguage,
    });
  });

  it("bundles Organization and WebSite into one site graph per language", () => {
    const graph = siteJsonLd("en");
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"].map((entry) => entry["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
    expect(graph["@graph"][1].url).toBe(`${SITE_URL}/en`);
  });

  it("describes the working paper as a ScholarlyArticle citing every reference", () => {
    const article = scholarlyArticleJsonLd();

    expect(article["@context"]).toBe("https://schema.org");
    expect(article["@type"]).toBe("ScholarlyArticle");
    expect(article.headline).toBe(researchPaperT.en.title);
    expect(article.description).toBe(researchPaperT.en.metadata.description);
    expect(article.author).toMatchObject({ "@type": "Organization", name: "ProcuraCost" });
    expect(article.isPartOf).toMatchObject({ "@type": "WebSite", url: SITE_URL });
    expect(article.inLanguage).toBe("en-GB");
    expect(article.citation).toHaveLength(researchPaperT.en.references.length);
    for (const [index, reference] of researchPaperT.en.references.entries()) {
      expect(article.citation[index]).toEqual({
        "@type": "CreativeWork",
        name: reference.label,
        url: reference.href,
      });
    }
  });

  it.each([
    { lang: "pl", path: "/calculator" },
    { lang: "en", path: "/en/calculator" },
  ] as const)("describes the $lang calculator as a free SoftwareApplication", ({ lang, path }) => {
    const application = softwareApplicationJsonLd(lang);

    expect(application["@context"]).toBe("https://schema.org");
    expect(application["@type"]).toBe("SoftwareApplication");
    expect(application.name).toBe(
      siteMetadataT[lang].calculator.title.replace(" | ProcuraCost", ""),
    );
    expect(application.name).not.toContain("ProcuraCost");
    expect(application.description).toBe(siteMetadataT[lang].calculator.description);
    expect(application.url).toBe(`${SITE_URL}${path}`);
    expect(application.applicationCategory).toBe("FinanceApplication");
    expect(application.operatingSystem).toBe("Any (web browser)");
    expect(application.offers).toMatchObject({ "@type": "Offer", price: 0 });
    expect(application.version).toBe(MODEL_V2_METADATA.modelVersion);
  });

  it("escapes HTML-open characters when serialising script content", () => {
    expect(jsonLdScriptContent({ tag: "<b>" })).toBe('{"tag":"\\u003cb>"}');
  });
});

describe("JSON-LD script injection points", () => {
  it.each([
    { path: "app/(pl)/layout.tsx", marker: 'siteJsonLd("pl")' },
    { path: "app/(en)/layout.tsx", marker: 'siteJsonLd("en")' },
    { path: "app/(en)/research/page.tsx", marker: "scholarlyArticleJsonLd()" },
    { path: "app/(pl)/calculator/page.tsx", marker: 'softwareApplicationJsonLd("pl")' },
    { path: "app/(en)/en/calculator/page.tsx", marker: 'softwareApplicationJsonLd("en")' },
  ] as const)("injects a JSON-LD script in $path", ({ path, marker }) => {
    const source = readFileSync(path, "utf8");
    expect(source).toContain("application/ld+json");
    expect(source).toContain(marker);
    expect(source).toContain("jsonLdScriptContent");
  });
});
