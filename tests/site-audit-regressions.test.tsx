import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import DecisionRecordSummary from "@/components/decision-record/DecisionRecordSummary";
import { CalculatorWorkspaceView, CalculatorWorkspaceBootstrapStatus } from "@/components/calculator-v2/CalculatorWorkspace";
import { createCalculatorWorkspaceState } from "@/components/calculator-v2/editor-state";
import { buildDecisionRecordV2, createScenarioDraft } from "@/lib/model-v2";
import { calculatorV2T, decisionRecordT } from "@/lib/i18n";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("site audit regressions", () => {
  it.each(["pl", "en"] as const)("renders the calculator heading and explanation before JavaScript loads in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(CalculatorWorkspaceBootstrapStatus, { lang, status: "pending" }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(calculatorV2T[lang].journey.title);
    expect(html).toContain(calculatorV2T[lang].journey.introduction);
  });

  it("makes essential economics editable without opening advanced details", () => {
    const state = createCalculatorWorkspaceState(createScenarioDraft("fleet_tco_reframing"));
    const html = renderToStaticMarkup(createElement(CalculatorWorkspaceView, { lang: "en", state, activeStage: "costs", onStateChange: () => {}, onCopyBaseScenario: () => {} }));
    const advancedStart = html.indexOf("data-advanced-economics");
    for (const id of ["economic-contract-value-central", "economic-daily-cost-central"]) {
      expect(html.indexOf(`id="${id}"`)).toBeLessThan(advancedStart);
      expect(html.split(`id="${id}"`)).toHaveLength(2);
    }
  });

  it.each(["pl", "en"] as const)("keeps the unsaved %s workspace open when consulting a supporting tool", (lang) => {
    const state = createCalculatorWorkspaceState(createScenarioDraft("fleet_tco_reframing"));
    for (const activeStage of ["case", "workflows"] as const) {
      const html = renderToStaticMarkup(createElement(CalculatorWorkspaceView, {
        lang, state, activeStage, onStateChange: () => {}, onCopyBaseScenario: () => {},
      }));
      const route = `${lang === "en" ? "/en" : ""}/${activeStage === "case" ? "optimizer" : "assessment"}`;
      const link = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag).find((tag) => tag.includes(`href="${route}"`));
      expect(link).toContain('target="_blank"');
      expect(link).toContain('rel="noopener noreferrer"');
      expect(link).toContain('aria-describedby=');
      expect(html).toContain(calculatorV2T[lang].journey.opensInNewTab);
    }
  });

  it.each(["pl", "en"] as const)("does not claim a sign reversal for identical control maps in %s", (lang) => {
    const record = buildDecisionRecordV2(createScenarioDraft("catalog_calloff_control"));
    const html = renderToStaticMarkup(createElement(DecisionRecordSummary, { lang, record }));
    expect(record.comparison.deltaCost).toBe(0);
    expect(html).toContain(decisionRecordT[lang].delta.crossing);
    expect(html).not.toMatch(/The sign changes|Znak zmienia się/);
  });

  it.each([[0, 10], [-10, 0]])("distinguishes a zero-touching envelope [%s, %s] from strict cost ordering", (low, high) => {
    const record = buildDecisionRecordV2(createScenarioDraft("catalog_calloff_control"));
    record.comparison.deltaCostOuterEnvelope = { low, high };
    const html = renderToStaticMarkup(createElement(DecisionRecordSummary, { lang: "en", record }));
    expect(html).toContain(decisionRecordT.en.delta.touching);
    expect(html).not.toContain(decisionRecordT.en.delta.stable);
  });

  it("blocks preview indexing even when a page supplies permissive metadata", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.resetModules();
    const { default: robots } = await import("@/app/robots");
    const { localizedPageMetadata } = await import("@/lib/page-metadata");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(localizedPageMetadata({ lang: "en", routeKey: "home", title: "Preview", description: "Preview", robots: { index: true } }).robots).toEqual({ index: false, follow: false });
  });

  it("keeps the production sitemap canonical, reciprocal and free of unpublished episodes", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "deployment.vercel.app");
    vi.resetModules();
    const { default: sitemap } = await import("@/app/sitemap");
    const { default: robots } = await import("@/app/robots");
    const entries = sitemap();
    const pl = entries.find(({ url }) => url.endsWith("/calculator"));
    const en = entries.find(({ url }) => url.endsWith("/en/calculator"));
    expect(pl?.alternates).toEqual(en?.alternates);
    expect(pl?.alternates?.languages).toEqual({
      "pl-PL": "https://www.procuracost.com/calculator",
      "en-GB": "https://www.procuracost.com/en/calculator",
    });
    expect(entries.every(({ url }) => url.startsWith("https://www.procuracost.com"))).toBe(true);
    expect(entries.some(({ url }) => url.endsWith("/en/research") || url.includes("/shortcasty/"))).toBe(false);
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
  });
});
