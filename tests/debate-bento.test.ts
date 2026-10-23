import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DebateBento from "@/components/debate/DebateBento";
import MotionProvider from "@/components/motion/MotionProvider";
import ScenarioDrivers from "@/components/debate/ScenarioDrivers";
import { debateT, PHI_SET } from "@/lib/i18n";
import { buildDecisionRecordV2, createScenarioDraft } from "@/lib/model-v2";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe("editorial debate hub", () => {
  it.each(["pl", "en"] as const)("renders seven distinct tiles and the full panel questions in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang })));
    const tx = debateT[lang];
    expect(html).toContain(`aria-label="${tx.title}"`);
    expect(html).toContain(tx.intro);
    expect(html.match(/data-debate-tile="/g)).toHaveLength(7);
    for (const title of tx.titles) {
      expect(html).toContain(renderToStaticMarkup(createElement("h3", null, title)).replace(/<\/?h3>/g, ""));
    }
    expect(html).toContain(PHI_SET[lang]);
    expect(tx.questions).toHaveLength(8);
    for (const question of tx.questions) {
      expect(html).toContain(renderToStaticMarkup(createElement("li", null, question)).replace(/<\/?li>/g, ""));
    }
    expect(html).toContain('href="/kupiec-po-automatyzacji"');
    expect(html).toContain("md:grid-cols-6");
    expect(html).toContain("gap-px");
    const tiles = [...html.matchAll(/<div class="([^"]*bg-white p-6[^"]*)"[^>]*><article data-debate-tile=/g)];
    expect(tiles).toHaveLength(7);
    for (const [, classes] of tiles) {
      expect(classes).not.toMatch(/rounded-|shadow/);
    }
    expect(html).toContain(tx.caveat);
    expect(html).toContain(tx.coverage);
  });

  it.each(["pl", "en"] as const)("uses the article summary and keeps tile G questions without its self-link in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang, variant: "article" })));
    const tx = debateT[lang];
    expect(html).toContain(`aria-label="${tx.articleTitle}"`);
    expect(html).toContain(`>${tx.articleTitle}</h2>`);
    expect(html).toContain(tx.articleIntro);
    expect(html).not.toContain(tx.intro);
    expect(html.match(/data-debate-tile="/g)).toHaveLength(7);
    const questionsTile = html.match(/<article data-debate-tile="7"[\s\S]*?<\/article>/)?.[0];
    expect(questionsTile).toBeDefined();
    expect(questionsTile).not.toContain('href="/kupiec-po-automatyzacji"');
    for (const question of tx.questions) {
      expect(questionsTile).toContain(renderToStaticMarkup(createElement("li", null, question)).replace(/<\/?li>/g, ""));
    }
    const home = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang, variant: "home" })));
    expect(home.match(/<article data-debate-tile="7"[\s\S]*?<\/article>/)?.[0]).toContain('href="/kupiec-po-automatyzacji"');
  });

  it("keeps both languages in exact leaf-path parity", () => {
    expect(leafPaths(debateT.pl).sort()).toEqual(leafPaths(debateT.en).sort());
  });

  it("keeps server calculations outside the interactive scenario module", () => {
    const server = readFileSync(new URL("../components/debate/DebateBento.tsx", import.meta.url), "utf8");
    const client = readFileSync(new URL("../components/debate/ScenarioDrivers.tsx", import.meta.url), "utf8");
    expect(server).not.toContain('"use client"');
    expect(server).toContain("buildDecisionRecordV2(createScenarioDraft(id))");
    expect(client).not.toMatch(/from ["']@\/lib\/model-v2/);
    expect(client).toContain('fill="#3b82f6"');
    expect(client).toContain('className="sr-only"');
  });

  it.each(["catalog_calloff_control", "mrp_release_control"] as const)("derives %s as a neutral control", (id) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    expect(record.comparison.deltaCost).toBe(0);
    expect(record.alternatives.formalSequential.workflow.steps).toEqual(record.alternatives.adaptiveCompliant.workflow.steps);
  });

  it("renders driver values that reconcile with the native total", () => {
    const record = buildDecisionRecordV2(createScenarioDraft("fleet_tco_reframing"));
    const drivers = [
      { id: "role" as const, value: record.drivers.find(({ id }) => id === "role_cost")!.contribution.central },
      { id: "nonLabour" as const, value: record.drivers.find(({ id }) => id === "non_labour_cost")!.contribution.central },
      { id: "delay" as const, value: record.drivers.find(({ id }) => id === "delay_cost")!.contribution.central },
      { id: "contract" as const, value: record.drivers.filter(({ id }) => !["role_cost", "non_labour_cost", "delay_cost"].includes(id)).reduce((sum, driver) => sum + driver.contribution.central, 0) },
    ];
    expect(drivers.reduce((sum, driver) => sum + driver.value, 0)).toBeCloseTo(record.comparison.deltaCost);
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(ScenarioDrivers, {
      lang: "pl",
      scenarios: [{ id: "fleet_tco_reframing", drivers, total: record.comparison.deltaCost }],
    })));
    const format = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
    for (const { value } of drivers) expect(html).toContain(format.format(value));
  });
});
