import { readFileSync } from "node:fs";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/app/seo-config";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { researchPaperT, siteMetadataT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2";
import {
  breadcrumbJsonLd,
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

  it("describes a two-level trail with absolute URLs and 1-based positions", () => {
    const trail = breadcrumbJsonLd([
      { name: "ProcuraCost", path: "/" },
      { name: "Metodologia", path: "/methodology" },
    ]);

    expect(trail["@context"]).toBe("https://schema.org");
    expect(trail["@type"]).toBe("BreadcrumbList");
    expect(trail.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "ProcuraCost", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Metodologia", item: `${SITE_URL}/methodology` },
    ]);
  });

  it("describes a section-level trail without exceeding two levels below home", () => {
    const trail = breadcrumbJsonLd([
      { name: "ProcuraCost", path: "/en" },
      { name: "Research", path: "/en/model" },
      { name: "Procurement cost model assumptions register", path: "/en/model/assumptions" },
    ]);

    expect(trail.itemListElement.map((entry) => entry.position)).toEqual([1, 2, 3]);
    expect(trail.itemListElement.map((entry) => entry.item)).toEqual([
      `${SITE_URL}/en`,
      `${SITE_URL}/en/model`,
      `${SITE_URL}/en/model/assumptions`,
    ]);
  });

  it("renders the breadcrumb script tag with a source-assertable marker", () => {
    const html = renderToStaticMarkup(
      createElement(BreadcrumbJsonLd, {
        lang: "pl",
        crumbs: [{ name: "Zespół", path: "/team" }],
      }),
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('data-breadcrumb="true"');
    expect(html).toContain(`${SITE_URL}/`);
    expect(html).toContain(`${SITE_URL}/team`);
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

describe("BreadcrumbList JSON-LD injection points", () => {
  it.each([
    { path: "app/(pl)/assessment/page.tsx", crumbPath: '"/assessment"' },
    { path: "app/(pl)/calculator/page.tsx", crumbPath: '"/calculator"' },
    { path: "components/MechanismsEvidencePage.tsx", crumbPath: '"/case-studies"' },
    { path: "app/(pl)/methodology/page.tsx", crumbPath: '"/methodology"' },
    { path: "app/(pl)/model/page.tsx", crumbPath: '"/model"' },
    { path: "app/(pl)/model/assumptions/page.tsx", crumbPath: '"/model/assumptions"' },
    { path: "app/(pl)/optimizer/page.tsx", crumbPath: '"/optimizer"' },
    { path: "app/(pl)/practice/procurement-beyond-8/page.tsx", crumbPath: '"/practice/procurement-beyond-8"' },
    { path: "app/(pl)/readiness/page.tsx", crumbPath: '"/readiness"' },
    { path: "app/(pl)/research-agenda/page.tsx", crumbPath: '"/research-agenda"' },
    { path: "app/(pl)/team/page.tsx", crumbPath: '"/team"' },
    { path: "app/(en)/en/assessment/page.tsx", crumbPath: '"/en/assessment"' },
    { path: "app/(en)/en/calculator/page.tsx", crumbPath: '"/en/calculator"' },
    { path: "components/MechanismsEvidencePage.tsx", crumbPath: '"/en/case-studies"' },
    { path: "app/(en)/en/methodology/page.tsx", crumbPath: '"/en/methodology"' },
    { path: "app/(en)/en/model/page.tsx", crumbPath: '"/en/model"' },
    { path: "app/(en)/en/model/assumptions/page.tsx", crumbPath: '"/en/model/assumptions"' },
    { path: "app/(en)/en/optimizer/page.tsx", crumbPath: '"/en/optimizer"' },
    { path: "app/(en)/en/practice/procurement-beyond-8/page.tsx", crumbPath: '"/en/practice/procurement-beyond-8"' },
    { path: "app/(en)/en/readiness/page.tsx", crumbPath: '"/en/readiness"' },
    { path: "app/(en)/research/page.tsx", crumbPath: '"/research"' },
    { path: "app/(en)/en/team/page.tsx", crumbPath: '"/en/team"' },
  ] as const)("injects a breadcrumb script in $path", ({ path, crumbPath }) => {
    const source = readFileSync(path, "utf8");
    expect(source).toContain("BreadcrumbJsonLd");
    expect(source).toContain(crumbPath);
  });

  it.each([
    { path: "app/(pl)/model/assumptions/page.tsx", sectionPath: '"/model"' },
    { path: "app/(en)/en/model/assumptions/page.tsx", sectionPath: '"/en/model"' },
  ] as const)("keeps the section crumb in $path", ({ path, sectionPath }) => {
    const source = readFileSync(path, "utf8");
    expect(source).toContain("navigationT");
    expect(source).toContain(sectionPath);
  });

  it.each([
    "app/(pl)/page.tsx",
    "app/(en)/en/page.tsx",
  ] as const)("skips the single-crumb home page %s", (path) => {
    const source = readFileSync(path, "utf8");
    expect(source).not.toContain("BreadcrumbJsonLd");
  });
});
