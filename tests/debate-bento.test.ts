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

function visibleText(markup: string) {
  return markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

function expectNoEventCopy(markup: string) {
  expect(visibleText(markup)).not.toMatch(/panel|dyrektor|director|2 grudnia|2 December|debat|debate/i);
}

describe("editorial debate hub", () => {
  it.each(["pl", "en"] as const)("renders seven distinct tiles and the full questions in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang })));
    const tx = debateT[lang];
    expectNoEventCopy(html);
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
    expect(html).toContain('data-blueprint="workflow"');
    expect(html).toContain('viewBox="0 0 960 520"');
    expect(html).toContain('viewBox="0 0 320 1000"');
    expect(html).toContain("md:hidden");
    expect(html).toContain("hidden h-auto w-full md:block");
    expect(html.match(/data-legal-lock="identical"/g)).toHaveLength(4);
    expect(html.match(/data-boundary="shared"/g)).toHaveLength(2);
    for (let question = 1; question <= 4; question++) {
      expect(html).toContain(`id="question-${question}"`);
      expect(html).toContain(`href="#question-${question}"`);
    }
    for (const route of ["model", "readiness", "methodology", "calculator", "case-studies"]) {
      expect(html).toContain(`href="${lang === "en" ? "/en" : ""}/${route}"`);
    }
    expect(html).toContain(tx.diagram.standard);
    expect(html).toContain(tx.diagram.exception);
    expect(html).toContain(tx.diagram.wait);
    expect(html).not.toMatch(/shadow-|gradient|—/);
    expect(html).toContain("text-4xl");
    expect(html).toContain("md:col-span-4");
    expect(html).toContain("bg-blue-50");
    expect(html).toContain(tx.caveat);
    expect(html).toContain(tx.coverage);
  });

  it.each(["pl", "en"] as const)("uses the article summary and keeps tile G questions without its self-link in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang, variant: "article" })));
    const tx = debateT[lang];
    expectNoEventCopy(html);
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

  it.each(["pl", "en"] as const)("insets portrait boundary labels and emphasises desktop decisions in %s", (lang) => {
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(DebateBento, { lang })));
    const desktop = html.match(/<svg viewBox="0 0 960 520"[\s\S]*?<\/svg>/)?.[0];
    const portrait = html.match(/<svg viewBox="0 0 320 1000"[\s\S]*?<\/svg>/)?.[0];
    expect(portrait).toContain('x="282" y="680" text-anchor="middle" transform="rotate(-90 282 680)"');
    expect(portrait).toContain('x="34" y="760" text-anchor="middle" transform="rotate(-90 34 760)"');
    expect(portrait).toContain('x="173" y="978"');
    expect(desktop).toContain('text-[23px] lg:text-[18px]');
    expect(desktop).toContain('stroke-red-300" stroke-width="5"');
    expect(desktop).toContain('cx="590" cy="390" r="27" class="fill-blue-700"');
    expect(desktop).toContain('stroke-white text-[18px] font-semibold [paint-order:stroke]');
  });

  it("uses the requested bilingual article copy", () => {
    expect(debateT.pl.intro).toBe("Cztery pytania o pracę zakupów, gdy rutynę przejmują systemy i agenci AI: kto robi co, kto ustala reguły, procedura czy polityka, co mierzyć.");
    expect(debateT.en.intro).toBe("Four questions about procurement work once systems and AI agents take over routine tasks: who does what, who sets the rules, procedure or policy, what to measure.");
    expect(debateT.pl.articleTitle).toBe("Cztery pytania w skrócie");
    expect(debateT.pl.articleIntro).toBe("Każdy kafel prowadzi do modelu albo do pytań do dyskusji.");
    expect(debateT.en.articleTitle).toBe("Four questions at a glance");
    expect(debateT.en.articleIntro).toBe("Each tile leads to the model or to discussion questions.");
    expect(debateT.pl.threads).toEqual(["Pytanie 3", "Pytanie 1", "Pytanie 4", "Pytania 3 i 4", "Pytanie 2", "Pytanie 3", "Pytania 1 do 4"]);
    expect(debateT.en.threads).toEqual(["Question 3", "Question 1", "Question 4", "Questions 3 and 4", "Question 2", "Question 3", "Questions 1 to 4"]);
    expect(debateT.pl.titles[6]).toBe("Pytania do dyskusji w zespole zakupów");
    expect(debateT.en.titles[6]).toBe("Questions for a procurement team discussion");
    expect(debateT.pl.articleEyebrow).toBe("Artykuł / ProcuraCost");
    expect(debateT.en.articleEyebrow).toBe("Article / ProcuraCost");
    expect(debateT.pl.researchLink.body).toBe("Artykuł o roli kupca po automatyzacji: podział pracy, właściciele reguł, procedura czy polityka, miary.");
    expect(debateT.en.researchLink.body).toBe(debateT.pl.researchLink.body);
  });

  it("keeps server calculations outside the interactive scenario module", () => {
    const server = readFileSync(new URL("../components/debate/DebateBento.tsx", import.meta.url), "utf8");
    const client = readFileSync(new URL("../components/debate/ScenarioDrivers.tsx", import.meta.url), "utf8");
    expect(server).not.toContain('"use client"');
    expect(server).toContain("buildDecisionRecordV2(createScenarioDraft(id))");
    expect(client).not.toMatch(/from ["']@\/lib\/model-v2/);
    expect(client).toContain('data-waterfall="cost-difference"');
    expect(client).toContain("fill-blue-600");
    expect(client).toContain("start: 0, end: scenario.total");
    expect(client).toContain('className="sr-only"');
  });

  it("keeps body copy legible and the diagram labels localised", () => {
    for (const path of ["DebateBento", "ScenarioDrivers", "TunnelFieldToggle", "BlueprintDiagram"]) {
      const source = readFileSync(new URL(`../components/debate/${path}.tsx`, import.meta.url), "utf8");
      expect(source).not.toContain("text-xs");
      expect(source).not.toMatch(/shadow-|gradient|—/);
    }
    const drawing = readFileSync(new URL("../components/debate/BlueprintDiagram.tsx", import.meta.url), "utf8");
    expect(drawing).toContain('phi.slice(phi.indexOf("{") + 1, -1)');
    expect(drawing).toContain("labels.diagram.gates");
    expect(drawing).toContain("labels.diagram.standard");
    expect(drawing).toContain("labels.diagram.exception");
    expect(drawing).toContain('selected === "both" || selected === name ? 1 : 0.2');
  });

  it.each(["catalog_calloff_control", "mrp_release_control"] as const)("derives %s as a neutral control", (id) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    expect(record.comparison.deltaCost).toBe(0);
    expect(record.alternatives.formalSequential.workflow.steps).toEqual(record.alternatives.adaptiveCompliant.workflow.steps);
  });

  it.each(["fleet_tco_reframing", "erp_transformation_discovery", "logistics_service_redesign"] as const)("renders %s driver values that reconcile with the native total", (id) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    const drivers = [
      { id: "role" as const, value: record.drivers.find(({ id }) => id === "role_cost")!.contribution.central },
      { id: "nonLabour" as const, value: record.drivers.find(({ id }) => id === "non_labour_cost")!.contribution.central },
      { id: "delay" as const, value: record.drivers.find(({ id }) => id === "delay_cost")!.contribution.central },
      { id: "contract" as const, value: record.drivers.filter(({ id }) => !["role_cost", "non_labour_cost", "delay_cost"].includes(id)).reduce((sum, driver) => sum + driver.contribution.central, 0) },
    ];
    expect(drivers.reduce((sum, driver) => sum + driver.value, 0)).toBeCloseTo(record.comparison.deltaCost);
    const html = renderToStaticMarkup(createElement(MotionProvider, null, createElement(ScenarioDrivers, {
      lang: "pl",
      scenarios: [{ id, drivers, total: record.comparison.deltaCost }],
    })));
    const format = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
    for (const { value } of drivers) expect(html).toContain(format.format(value));
  });
});
