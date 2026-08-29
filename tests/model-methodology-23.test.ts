import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import EnMethodologyPage, {
  metadata as enMethodologyMetadata,
} from "@/app/(en)/en/methodology/page";
import EnModelPage, {
  metadata as enModelMetadata,
} from "@/app/(en)/en/model/page";
import PlMethodologyPage, {
  metadata as plMethodologyMetadata,
} from "@/app/(pl)/methodology/page";
import PlModelPage, {
  metadata as plModelMetadata,
} from "@/app/(pl)/model/page";
import { methodologyOverviewT, modelOverviewT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string" || typeof value === "function") return [prefix];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("public model 2.3 explanation", () => {
  it("keeps the model and methodology dictionaries paired", () => {
    expect(leafPaths(modelOverviewT.pl).sort()).toEqual(
      leafPaths(modelOverviewT.en).sort()
    );
    expect(leafPaths(methodologyOverviewT.pl).sort()).toEqual(
      leafPaths(methodologyOverviewT.en).sort()
    );
  });

  it("renders the active model contract in both languages", () => {
    for (const [lang, Page, tx] of [
      ["pl", PlModelPage, modelOverviewT.pl],
      ["en", EnModelPage, modelOverviewT.en],
    ] as const) {
      const markup = renderToStaticMarkup(createElement(Page));

      expect(markup, lang).toContain(MODEL_V2_METADATA.modelVersion);
      expect(markup, lang).toContain(tx.title);
      expect(markup, lang).toContain(tx.sections.legalBoundary.title);
      expect(markup, lang).toContain(tx.sections.workflowDesign.title);
      expect(markup, lang).toContain(tx.sections.costRecord.title);
      expect(markup, lang).toContain(tx.sections.evidenceBoundary.title);
      expect(markup, lang).toContain(tx.rangeDisclosure);
      expect(markup, lang).toContain(
        `href="${lang === "en" ? "/en/readiness" : "/readiness"}"`
      );
      expect(markup, lang).toContain(
        `href="${lang === "en" ? "/en/practice/procurement-beyond-8" : "/practice/procurement-beyond-8"}"`
      );
      expect(markup, lang).not.toMatch(
        /seven cost dimensions|siedem wymiarów kosztu|optimizer|optymalizator|robust winner|odporn(?:y|ego) zwycięzc/i
      );
      expect(markup, lang).not.toMatch(/<table|bg-gradient|shadow-/);
    }
  });

  it("renders the calculation sequence and bounded practitioner use", () => {
    for (const [lang, Page, tx] of [
      ["pl", PlMethodologyPage, methodologyOverviewT.pl],
      ["en", EnMethodologyPage, methodologyOverviewT.en],
    ] as const) {
      const markup = renderToStaticMarkup(createElement(Page));
      const decodedMarkup = markup.replaceAll("&amp;", "&");

      expect(markup, lang).toContain(tx.title);
      for (const step of tx.steps) expect(markup, lang).toContain(step.title);
      for (const group of Object.values(tx.exampleGroups)) {
        expect(markup, lang).toContain(group.title);
        for (const example of group.items) {
          expect(markup, lang).toContain(example.scenarioId);
          expect(markup, lang).toContain(example.title);
        }
      }
      expect(markup, lang).toContain(tx.deltaIdentity);
      expect(decodedMarkup, lang).toContain(tx.practitionerBoundary);
      expect(markup, lang).toContain(tx.legalBoundary);
      expect(markup, lang).toContain(tx.rangeBoundary);
      expect(markup, lang).not.toMatch(
        /seven cost dimensions|siedem wymiarów kosztu|optimizer|optymalizator|95% confidence|95% ufności|statistically significant|istotn(?:y|a|e) statystycznie/i
      );
      expect(decodedMarkup, lang).not.toMatch(/wymiary niewycenione|unpriced dimensions/i);
      expect(markup, lang).not.toMatch(/<table|bg-gradient|shadow-/);
    }
  });

  it("keeps route files thin and all public copy in i18n", () => {
    const routeFiles = [
      "app/(pl)/model/page.tsx",
      "app/(en)/en/model/page.tsx",
      "app/(pl)/methodology/page.tsx",
      "app/(en)/en/methodology/page.tsx",
    ];
    for (const path of routeFiles) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toMatch(/Overview/);
      expect(source, path).not.toMatch(/Szucs|Beuve|siedem wymiarów|Seven cost/);
    }
    expect(plModelMetadata).toMatchObject(modelOverviewT.pl.metadata);
    expect(enModelMetadata).toMatchObject(modelOverviewT.en.metadata);
    expect(plMethodologyMetadata).toMatchObject(methodologyOverviewT.pl.metadata);
    expect(enMethodologyMetadata).toMatchObject(methodologyOverviewT.en.metadata);
    expect(plModelMetadata.alternates).toMatchObject({ canonical: "/model" });
    expect(enModelMetadata.alternates).toMatchObject({ canonical: "/en/model" });
    expect(plMethodologyMetadata.alternates).toMatchObject({ canonical: "/methodology" });
    expect(enMethodologyMetadata.alternates).toMatchObject({ canonical: "/en/methodology" });
  });
});
