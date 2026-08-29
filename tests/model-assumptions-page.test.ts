import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import EnLayout, {
  metadata as enMetadata,
} from "@/app/(en)/en/model/assumptions/layout";
import EnPage from "@/app/(en)/en/model/assumptions/page";
import PlLayout, {
  metadata as plMetadata,
} from "@/app/(pl)/model/assumptions/layout";
import PlPage from "@/app/(pl)/model/assumptions/page";
import { modelAssumptionsT, modelV2T } from "@/lib/i18n";
import { MODEL_V2_METADATA, SCENARIO_V2_IDS } from "@/lib/model-v2";

function occurrences(markup: string, fragment: string): number {
  return markup.split(fragment).length - 1;
}

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "function" || typeof value !== "object" || !value) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, nested]) =>
    leafPaths(nested, prefix ? `${prefix}.${key}` : key)
  );
}

function inlineJsxCopy(source: string): string[] {
  const sourceFile = ts.createSourceFile(
    "ModelAssumptionsPage.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const copy: string[] = [];

  function visit(node: ts.Node): void {
    if (ts.isJsxText(node) && /\p{L}{2}/u.test(node.text)) copy.push(node.text.trim());
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      (ts.isStringLiteral(node.expression) ||
        ts.isNoSubstitutionTemplateLiteral(node.expression)) &&
      /\p{L}{2}/u.test(node.expression.text)
    ) {
      copy.push(node.expression.text);
    }
    ts.forEachChild(node, visit);
  }
  ts.forEachChild(sourceFile, visit);
  return copy;
}

describe("model assumptions routes", () => {
  it.each([
    ["pl", PlPage, PlLayout, plMetadata],
    ["en", EnPage, EnLayout, enMetadata],
  ] as const)(
    "renders the complete canonical scenario register in %s",
    (lang, Page, Layout, metadata) => {
      const page = createElement(Page);
      const markup = renderToStaticMarkup(
        createElement(Layout, null, page)
      );

      let previousIndex = -1;
      for (const scenarioId of SCENARIO_V2_IDS) {
        const scenarioName = modelV2T[lang].scenarios[scenarioId].name;
        const index = markup.indexOf(scenarioName);
        expect(index, `${scenarioId} is rendered`).toBeGreaterThan(previousIndex);
        previousIndex = index;
      }

      expect(markup).toContain("data-model-assumptions-ledger=\"true\"");
      expect(occurrences(markup, "data-neutral-control=\"true\"")).toBe(1);
      expect(occurrences(markup, "data-disclosure-affordance=\"true\"")).toBe(
        SCENARIO_V2_IDS.length
      );
      expect(occurrences(markup, "<summary")).toBe(SCENARIO_V2_IDS.length);
      expect(occurrences(markup, "<summary")).toBe(
        occurrences(markup, "<summary class=")
      );
      expect(markup).not.toMatch(/rounded-|shadow-|bg-gradient|<table/i);
      expect(markup).not.toContain("—");
      expect(metadata.title).toContain(MODEL_V2_METADATA.modelVersion);
      expect(metadata.description).toContain(MODEL_V2_METADATA.calibrationId);
    }
  );

  it.each([
    ["pl", PlPage, [
      "Przeniesione założenia",
      "Dowody zewnętrzne",
      "Zablokowane pochodzenie prawne",
      "Zakup poza zatwierdzonym procesem nie jest monetyzowany",
      "Zakres stresowy",
    ]],
    ["en", EnPage, [
      "Retained assumptions",
      "External evidence",
      "Locked legal provenance",
      "Off-process purchasing is not monetised",
      "Stress range",
    ]],
  ] as const)("separates provenance and neutral controls in %s", (_lang, Page, labels) => {
    const markup = renderToStaticMarkup(createElement(Page));

    for (const label of labels) expect(markup).toContain(label);
    expect(markup).toContain("data-neutral-maps-identical=\"true\"");
    expect(markup).toContain("data-neutral-delta=\"0\"");
  });

  it("keeps the complete assumptions dictionary in exact PL/EN leaf parity", () => {
    expect(leafPaths(modelAssumptionsT.pl).sort()).toEqual(
      leafPaths(modelAssumptionsT.en).sort()
    );
    expect(plMetadata).toEqual(modelAssumptionsT.pl.metadata);
    expect(enMetadata).toEqual(modelAssumptionsT.en.metadata);
  });

  it("keeps the rendered ledger and TSX source free of decision claims and inline prose", () => {
    const polishMarkup = renderToStaticMarkup(createElement(PlPage));
    const englishMarkup = renderToStaticMarkup(createElement(EnPage));
    const source = readFileSync("components/ModelAssumptionsPage.tsx", "utf8");

    expect(englishMarkup.toLowerCase()).not.toMatch(
      /\b(?:confidence|mature|maturity|ranking|recommend(?:ation|ed)?|robust(?:ness)?|score|scoring|winner)\b/
    );
    expect(polishMarkup.toLowerCase()).not.toMatch(
      /(?:dojrzał|pewnoś|punktac|ranking|rekomend|odporn|zwycię)/
    );
    expect(inlineJsxCopy(source)).toEqual([]);
  });

  it.each([
    ["pl", PlPage, "Otwórz źródło:"],
    ["en", EnPage, "Open source:"],
  ] as const)("gives every external source link a unique name in %s", (_lang, Page, prefix) => {
    const markup = renderToStaticMarkup(createElement(Page));
    const labels = [...markup.matchAll(/aria-label="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((label) => label.startsWith(prefix));

    expect(labels).toHaveLength(5);
    expect(new Set(labels).size).toBe(5);
  });
});
