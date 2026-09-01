import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import {
  HOME_EVIDENCE_IDS,
  homeEvidenceRecords,
} from "@/components/home/home-surface-data";
import { homeExperienceT } from "@/lib/i18n";
import { EVIDENCE_REGISTRY } from "@/lib/model-v2";
import { SITE_ROUTES } from "@/lib/site-routes";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function routeHref(key: string, lang: "pl" | "en") {
  const route = SITE_ROUTES.find((candidate) => candidate.key === key)!;
  return lang === "en" ? route.en ?? route.pl : route.pl ?? route.en;
}

describe("retained model 2.3 homepage evidence data", () => {
  it("keeps the four official records isolated from the registry", () => {
    expect(HOME_EVIDENCE_IDS).toEqual([
      "california_modular_it_procurement",
      "oecd_rvul_problem_definition",
      "uzp_preliminary_market_consultation",
      "ec_innovation_procurement_guidance",
    ]);

    const first = homeEvidenceRecords();
    const second = homeEvidenceRecords();
    expect(first.map(({ id }) => id)).toEqual(HOME_EVIDENCE_IDS);
    expect(second).toEqual(first);
    expect(first).toHaveLength(4);
    for (const [index, record] of first.entries()) {
      const registryRecord = EVIDENCE_REGISTRY.find(({ id }) => id === record.id)!;
      expect(record).not.toBe(registryRecord);
      expect(record).not.toBe(second[index]);
      expect(record.source).not.toBe(registryRecord.source);
      expect(record.constructs).not.toBe(registryRecord.constructs);
      expect(record.assumptionKeys).not.toBe(registryRecord.assumptionKeys);
    }
  });
});

describe("decision-led homepage presentation", () => {
  it("keeps the new experience dictionary in exact PL/EN parity", () => {
    expect(leafPaths(homeExperienceT.en).sort()).toEqual(
      leafPaths(homeExperienceT.pl).sort(),
    );
    expect(homeExperienceT.pl.journey.steps).toHaveLength(4);
    expect(homeExperienceT.en.journey.steps).toHaveLength(4);
    expect(homeExperienceT.pl.trust.items).toHaveLength(3);
    expect(homeExperienceT.en.trust.items).toHaveLength(3);
  });

  it("renders two paths, the record structure and four practical stages", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang }),
      );
      const tx = homeExperienceT[lang];

      expect(markup).toContain(tx.hero.title);
      expect(markup.match(/data-home-path=/g)).toHaveLength(2);
      expect(markup.match(/data-guided-step=/g)).toHaveLength(4);
      expect(markup).toContain('data-record-preview="structure"');
      expect(markup).not.toContain("data-evidence-id");
      expect(markup).not.toContain("data-home-topology");
      expect(markup).not.toMatch(/bg-gradient|shadow-|min-w-\[980px\]/);
    }
  });

  it("links only the two entry paths from the homepage architecture", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang }),
      );

      expect(markup).toContain(`href="${routeHref("calculator", lang)}"`);
      expect(markup).toContain(`href="${routeHref("model", lang)}"`);
      expect(markup).not.toContain(`href="${routeHref("optimizer", lang)}"`);
      expect(markup).not.toContain(`href="${routeHref("assessment", lang)}"`);
    }
  });

  it("keeps model data and detailed diagrams outside the entry component", () => {
    const source = readFileSync("components/EvidenceFieldHome.tsx", "utf8");

    expect(source).not.toMatch(
      /BoundaryField|EvidenceDocket|homeEvidenceRecords|ProcessRail|DecisionMap|calculateCosts|@\/lib\/scenarios|\bSCENARIOS\b/,
    );
    expect(source).toContain("homeExperienceT");
  });
});
