import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  CALCULATOR_RESULT_HEADING_ID,
  CalculatorResultBoundary,
} from "@/components/calculator-v2/CalculatorWorkspace";
import CostComparison from "@/components/CostComparison";
import DecisionRecord from "@/components/decision-record/DecisionRecord";
import { decisionRecordT } from "@/lib/i18n";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
  type CalibratedValue,
  type ScenarioDraft,
} from "@/lib/model-v2";
import {
  decisionRecordWithSign,
  fleetDecisionRecord,
  labelledDecisionRecord,
  recordWithSuppliedDriverSentinel,
} from "@/tests/fixtures/decision-record-ui-v2";

const SECTION_ORDER = [
  "summary",
  "alternatives",
  "drivers",
  "coverage",
  "assumptions",
  "evidence",
  "reference",
  "actions",
] as const;

function renderRecord(
  record = fleetDecisionRecord(),
  lang: "pl" | "en" = "en",
  actions = createElement("span", { "data-action-sentinel": true }, "Actions")
) {
  return renderToStaticMarkup(
    createElement(
      CalculatorResultBoundary,
      null,
      createElement(DecisionRecord, { actions, lang, record })
    )
  );
}

function section(markup: string, name: (typeof SECTION_ORDER)[number]) {
  const start = markup.indexOf(`data-decision-record-section="${name}"`);
  const nextName = SECTION_ORDER[SECTION_ORDER.indexOf(name) + 1];
  const end = nextName
    ? markup.indexOf(`data-decision-record-section="${nextName}"`)
    : markup.length;
  return markup.slice(start, end);
}

describe("neutral decision record UI", () => {
  it("renders metadata and the exact eight-part hierarchy with actions last", () => {
    const markup = renderRecord();
    const indices = SECTION_ORDER.map((name) =>
      markup.indexOf(`data-decision-record-section="${name}"`)
    );

    expect(indices.every((index) => index >= 0)).toBe(true);
    expect(indices).toEqual([...indices].sort((a, b) => a - b));
    expect(markup).toContain("2.3.0");
    expect(markup).toContain("source-scenario-2026-08-28");
    expect(markup).toContain("pl-pzp-2026-2027");
    expect(markup).toContain("fleet_tco_reframing");
    expect(markup).toContain("PLN");
    expect(markup.indexOf("data-action-sentinel")).toBeGreaterThan(
      indices.at(-1)!
    );
  });

  it("uses one programmatically focusable result heading inside the labelled reveal region", () => {
    const markup = renderRecord();

    expect(markup).toMatch(
      /<article(?=[^>]*aria-labelledby="decision-record-heading")(?=[^>]*id="decision-record")(?=[^>]*role="region")(?=[^>]*tabindex="-1")[^>]*>/
    );
    expect(markup).toContain(
      `id="${CALCULATOR_RESULT_HEADING_ID}" tabindex="-1"`
    );
    expect(markup.match(/id="decision-record-heading"/g)).toHaveLength(1);
    expect(markup.match(/data-result-reveal/g)).toHaveLength(1);
    expect(markup.match(/id="decision-record"/g)).toHaveLength(1);
    expect(markup).not.toContain('<article data-decision-record="true"');
  });

  it("names the explicitly disadvantaged competition side in the assumptions record", () => {
    const markup = renderRecord(
      buildDecisionRecordV2(
        createScenarioDraft("stable_private_standard_service")
      )
    );
    const assumptions = section(markup, "assumptions");

    expect(assumptions).toMatch(
      /Alternative with restricted supplier access[\s\S]*Adaptive compliant alternative/
    );
  });

  it("keeps the compatibility shell as one labelled result article", () => {
    const markup = renderToStaticMarkup(
      createElement(CostComparison, {
        lang: "en",
        record: fleetDecisionRecord(),
      })
    );

    expect(markup.match(/id="decision-record"/g)).toHaveLength(1);
    expect(markup).toMatch(
      /<article(?=[^>]*aria-labelledby="decision-record-heading")(?=[^>]*id="decision-record")(?=[^>]*role="region")(?=[^>]*tabindex="-1")[^>]*>/
    );
  });

  it.each([
    {
      label: "one edited contract value",
      edit: (draft: ScenarioDraft, value: CalibratedValue) => {
        draft.economicAssumptions.contractValue = value;
      },
    },
    {
      label: "one edited competition-transfer range",
      edit: (draft: ScenarioDraft, value: CalibratedValue) => {
        draft.economicAssumptions.competitionTransferRate = value;
      },
    },
    {
      label: "one edited role hourly rate",
      edit: (draft: ScenarioDraft, value: CalibratedValue) => {
        draft.roleHourlyRates.buyer = value;
      },
    },
  ])("counts $label once from the atomic record", ({ edit }) => {
    const draft = createScenarioDraft("stable_private_standard_service");
    edit(draft, {
      low: 0.04,
      central: 0.06,
      high: 0.08,
      rangeKind: "calibrated",
      evidenceClass: "user_input",
      evidenceIds: [],
    });

    const markup = renderRecord(buildDecisionRecordV2(draft));

    expect(markup).toContain("User-supplied values: 1.");
  });

  it.each([
    {
      record: decisionRecordWithSign(1_250, 500, 2_000),
      central: "The formal sequential total is higher at the central assumptions.",
      range:
        "The sign is stable within the declared ranges; this is not statistical evidence.",
    },
    {
      record: decisionRecordWithSign(-1_250, -2_000, -500),
      central: "The adaptive compliant total is higher at the central assumptions.",
      range:
        "The sign is stable within the declared ranges; this is not statistical evidence.",
    },
    {
      record: decisionRecordWithSign(0, 0, 0),
      central: "The central totals are equal.",
      range:
        "The sign is stable within the declared ranges; this is not statistical evidence.",
    },
    {
      record: decisionRecordWithSign(1_250, -500, 2_000),
      central: "The formal sequential total is higher at the central assumptions.",
      range:
        "The sign changes within the declared ranges. The model does not identify a stable cost ordering.",
    },
  ])("states every central and range sign neutrally", ({ record, central, range }) => {
    const markup = renderRecord(record);
    const summary = section(markup, "summary");

    expect(summary).toContain(central);
    expect(summary).toContain(range);
    expect(summary).not.toMatch(
      /\b(?:winner|optimal|recommended|saving|savings|loss|confidence)\b/i
    );
  });

  it("gives both alternatives equal written structure with ranges, duration, steps and legal locks", () => {
    const record = fleetDecisionRecord();
    const alternatives = section(renderRecord(record), "alternatives");
    const visibleText = alternatives.replace(/<[^>]+>/g, " ");

    expect(alternatives.match(/data-alternative-row=/g)).toHaveLength(2);
    expect(alternatives).toContain("Formal sequential alternative");
    expect(alternatives).toContain("Adaptive compliant alternative");
    expect(alternatives.match(/data-total-range=/g)).toHaveLength(2);
    expect(alternatives.match(/data-duration-range=/g)).toHaveLength(2);
    expect(alternatives.match(/data-step-count=/g)).toHaveLength(2);
    expect(alternatives.match(/data-lock-count=/g)).toHaveLength(2);
    expect(alternatives.match(/data-mobile-sequence=/g)).toHaveLength(2);
    expect(visibleText).not.toContain(
      record.alternatives.formalSequential.workflow.steps[0].id
    );
  });

  it.each([
    {
      lang: "en",
      duration: "Low: 44 days; Central: 44 days; High: 44 days",
    },
    {
      lang: "pl",
      duration: "Niski: 44 dni; Centralny: 44 dni; Wysoki: 44 dni",
    },
  ] as const)(
    "labels every alternative range and duration unit in $lang",
    ({ lang, duration }) => {
      const alternatives = section(renderRecord(fleetDecisionRecord(), lang), "alternatives");

      expect(alternatives).toContain(duration);
      expect(alternatives).toMatch(
        lang === "en"
          ? /Low: [^<]*PLN; Central: [^<]*PLN; High: [^<]*PLN/
          : /Niski: [^<]*zł; Centralny: [^<]*zł; Wysoki: [^<]*zł/
      );
    }
  );

  it("prefers a non-blank user label and resolves a null label key", () => {
    const alternatives = section(
      renderRecord(labelledDecisionRecord()),
      "alternatives"
    );

    expect(alternatives).toContain("Supplier landscape review");
    expect(alternatives).toContain("Fleet market sounding");
    expect(alternatives).not.toContain("workflow.steps.fleet_operating_baseline");
  });

  it("renders supplied driver contribution values unchanged and keeps non-monetised dimensions out of driver rows", () => {
    const record = recordWithSuppliedDriverSentinel();
    const markup = renderRecord(record);
    const drivers = section(markup, "drivers");
    const coverage = section(markup, "coverage");

    expect(drivers).toContain("-9,876.54 PLN");
    expect(drivers).toContain("1,234.56 PLN");
    expect(drivers).toContain("7,654.32 PLN");
    expect(drivers).not.toContain("Off-process purchasing");
    expect(coverage).toContain("Off-process purchasing");
  });

  it("keeps every Task 5 decision-record dictionary leaf paired", () => {
    function paths(value: unknown, path = ""): string[] {
      if (typeof value === "string" || typeof value === "function") {
        return [path];
      }
      if (!value || typeof value !== "object") return [];
      return Object.entries(value).flatMap(([key, child]) =>
        paths(child, path ? `${path}.${key}` : key)
      );
    }

    expect(paths(decisionRecordT.pl).sort()).toEqual(
      paths(decisionRecordT.en).sort()
    );
  });
});
