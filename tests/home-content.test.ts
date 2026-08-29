import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import {
  HOME_EVIDENCE_IDS,
  homeEvidenceRecords,
} from "@/components/home/home-surface-data";
import { homeT } from "@/lib/i18n";
import { EVIDENCE_REGISTRY } from "@/lib/model-v2";
import { SITE_ROUTES } from "@/lib/site-routes";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

function renderedText(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim();
}

function routeHref(key: string, lang: "pl" | "en") {
  const route = SITE_ROUTES.find((candidate) => candidate.key === key)!;
  return lang === "en" ? route.en ?? route.pl : route.pl ?? route.en;
}

describe("model 2.3 compact homepage data", () => {
  it("selects exactly four official records in registry order and returns isolated values", () => {
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

describe("compact homepage presentation", () => {
  it("keeps paired copy, decision-tool framing and an explicit scenario range", () => {
    expect(leafPaths(homeT.en).sort()).toEqual(leafPaths(homeT.pl).sort());
    expect(homeT.pl.hero.title).toBe(
      "Porównaj koszt dwóch dopuszczalnych projektów procesu zakupowego."
    );
    expect(homeT.en.hero.title).toBe(
      "Compare the cost of two lawful procurement workflow designs."
    );
    expect(homeT.pl.neutrality).toBe(
      "Model dopuszcza oba kierunki różnicy. Znak wyniku nie jest założony."
    );
    expect(homeT.en.neutrality).toBe(
      "The model permits either direction of difference. The sign is not assumed."
    );
    expect(homeT.pl.jobs.eyebrow).toBe("Narzędzia do decyzji zakupowej");
    expect(homeT.en.jobs.eyebrow).toBe("Procurement decision tools");
    expect(homeT.pl.modelContract).toMatchObject({
      uncertaintyLabel: "Deklarowany zakres scenariusza",
      uncertaintyValue: "niski · centralny · wysoki",
    });
    expect(homeT.en.modelContract).toMatchObject({
      uncertaintyLabel: "Declared scenario range",
      uncertaintyValue: "low · central · high",
    });
    expect(JSON.stringify(homeT.pl.modelContract)).not.toContain("Dowody ×");
    expect(JSON.stringify(homeT.en.modelContract)).not.toContain("Evidence ×");
    expect(homeT.pl.jobs.items.map(({ label }) => label)).toEqual([
      "Porównaj koszt",
      "Porównaj dopasowanie",
      "Opisz profil projektu procesu",
    ]);
    expect(homeT.en.jobs.items.map(({ label }) => label)).toEqual([
      "Compare cost",
      "Compare suitability",
      "Describe the process design profile",
    ]);
  });

  it("renders one topology figure, three primary jobs and four official evidence rows in both languages", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang })
      );
      const text = renderedText(markup);
      const tx = homeT[lang];
      const evidenceIds = [...markup.matchAll(/data-evidence-id="([^"]+)"/g)].map(
        ([, id]) => id
      );

      expect(text).toContain(tx.hero.title);
      expect(text).toContain(tx.neutrality);
      expect(text).toContain(tx.boundary.note);
      expect(text).toContain(
        lang === "pl"
          ? "Otwórz edytowalne porównanie procesów"
          : "Open the editable process comparison"
      );
      expect(markup.match(/data-home-job=/g)).toHaveLength(3);
      expect(markup.match(/data-home-topology-section=/g)).toHaveLength(1);
      expect(markup.match(/data-home-topology=/g)).toHaveLength(1);
      expect(markup.match(/data-home-topology-action=/g)).toHaveLength(1);
      expect(evidenceIds).toEqual(HOME_EVIDENCE_IDS);
      expect(markup).not.toContain("szucs_discretion_price_2024");
      expect(markup).not.toContain("<table");
      expect(markup).not.toContain("min-w-[980px]");
      expect(markup).not.toContain("data-home-process-rail");
      expect(markup).not.toContain("data-mobile-sequence");
      expect(markup).not.toMatch(/bg-gradient|shadow-|transition-/);
      expect(markup).not.toContain("slate-");
    }
  });

  it("links the three jobs, calculator and mechanisms register through the route manifest", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang })
      );
      for (const key of [
        "calculator",
        "optimizer",
        "assessment",
        "caseStudies",
      ]) {
        expect(markup).toContain(`href="${routeHref(key, lang)}"`);
      }
    }
  });

  it("isolates the homepage topology from the calculator rail and model calculations", () => {
    const source = readFileSync("components/EvidenceFieldHome.tsx", "utf8");
    const dataSource = readFileSync(
      "components/home/home-surface-data.ts",
      "utf8"
    );

    expect(source).not.toMatch(
      /ProcessRail|DecisionMap|calculateCosts|@\/lib\/scenarios|\bSCENARIOS\b/
    );
    expect(source).toContain("BoundaryField");
    expect(source).not.toContain("buildCompactHomeRail");
    expect(source).toContain("homeEvidenceRecords");
    expect(source).toContain("EvidenceDocket");
    expect(dataSource).not.toContain("buildIllustrativeProcessRailViewModel");
    expect(dataSource).not.toMatch(
      /CalibratedValue|WorkflowDesign|ProcessMapStep|lockedLegalProvenance|activeDays|queueDays|criticalPathStepIds/
    );
  });
});
