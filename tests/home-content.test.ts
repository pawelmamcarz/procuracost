import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import {
  HOME_EVIDENCE_IDS,
  buildCompactHomeRail,
  homeEvidenceRecords,
} from "@/components/home/home-surface-data";
import { ProcessRail } from "@/components/process-map/ProcessRail";
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

  it("builds one illustrative two-lane rail with split, merge, lock and critical states but no timing claim", () => {
    const viewModel = buildCompactHomeRail("en");
    const html = renderToStaticMarkup(
      createElement(ProcessRail, {
        viewModel,
        mode: "read-only",
        idPrefix: "home-illustration",
      })
    );

    expect(viewModel.lanes.formalSequential.nodes).toHaveLength(4);
    expect(viewModel.lanes.adaptiveCompliant.nodes).toHaveLength(4);
    expect(
      Object.values(viewModel.lanes).flatMap(({ nodes }) => nodes)
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ locked: true, lockText: "Locked legal wait" }),
        expect.objectContaining({ parallel: true, parallelText: "Parallel branch" }),
        expect.objectContaining({ merge: true }),
        expect.objectContaining({ critical: true, criticalText: "Critical path" }),
      ])
    );
    expect(html.match(/Shared legal and governance boundary/g)).toHaveLength(1);
    expect(html).toContain("Formal sequential alternative");
    expect(html).toContain("Adaptive compliant alternative");
    expect(html).toContain("Split");
    expect(html).toContain("Merge");
    expect(html).toContain("Locked legal wait");
    expect(html).toContain("Critical path");
    expect(html).not.toMatch(/active days|queue days|active \+|days,/i);
    for (const node of Object.values(viewModel.lanes).flatMap(
      ({ nodes }) => nodes
    )) {
      expect(node.timingSummary).toBe("");
      expect(node.accessibleName).not.toMatch(/active days|queue days/i);
    }
  });
});

describe("compact homepage presentation", () => {
  it("keeps paired copy and the exact neutral three-job terminology", () => {
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

  it("renders one read-only rail, three primary jobs and four official evidence rows in both languages", () => {
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
      expect(text).toContain(tx.rail.note);
      expect(text).toContain(
        lang === "pl"
          ? "Otwórz edytowalne porównanie procesów"
          : "Open the editable process comparison"
      );
      expect(markup.match(/data-home-job=/g)).toHaveLength(3);
      expect(markup.match(/data-home-process-rail=/g)).toHaveLength(1);
      expect(markup.match(/data-home-rail-action=/g)).toHaveLength(1);
      expect(evidenceIds).toEqual(HOME_EVIDENCE_IDS);
      expect(markup).not.toContain("szucs_discretion_price_2024");
      expect(markup).not.toContain("<table");
      expect(markup).not.toContain("min-w-[980px]");
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

  it("removes the legacy home calculation and visual dependency graph", () => {
    const source = readFileSync("components/EvidenceFieldHome.tsx", "utf8");
    const dataSource = readFileSync(
      "components/home/home-surface-data.ts",
      "utf8"
    );

    expect(source).not.toMatch(
      /BoundaryField|DecisionMap|calculateCosts|@\/lib\/scenarios|\bSCENARIOS\b/
    );
    expect(source).toContain("buildCompactHomeRail");
    expect(source).toContain("homeEvidenceRecords");
    expect(source).toContain("EvidenceDocket");
    expect(source).toContain("ProcessRail");
    expect(dataSource).toContain("buildIllustrativeProcessRailViewModel");
    expect(dataSource).not.toMatch(
      /CalibratedValue|WorkflowDesign|ProcessMapStep|lockedLegalProvenance|activeDays|queueDays|criticalPathStepIds/
    );
  });
});
