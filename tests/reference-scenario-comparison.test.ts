import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReferenceScenarioComparison from "@/components/decision-record/ReferenceScenarioComparison";
import {
  buildReferenceScenarioComparisonData,
} from "@/components/decision-record/reference-scenarios";
import {
  SCENARIO_V2_IDS,
  buildDecisionRecordV2,
  createScenarioDraft,
} from "@/lib/model-v2";

describe("reference scenario comparison", () => {
  it("uses all ten scenarios in canonical registry order on one zero-centred PLN denominator", () => {
    const data = buildReferenceScenarioComparisonData();

    expect(data.rows.map(({ scenarioId }) => scenarioId)).toEqual(
      SCENARIO_V2_IDS
    );
    expect(data.rows).toHaveLength(10);
    expect(data.unit).toBe("PLN");
    const freshRows = SCENARIO_V2_IDS.map((scenarioId) => {
      const record = buildDecisionRecordV2(createScenarioDraft(scenarioId));
      return {
        scenarioId,
        low: record.comparison.deltaCostOuterEnvelope.low,
        central: record.comparison.deltaCost,
        high: record.comparison.deltaCostOuterEnvelope.high,
      };
    });
    expect(data.rows).toEqual(freshRows);
    expect(data.denominator).toBe(
      Math.max(
        ...freshRows.flatMap(({ low, high }) => [
          Math.abs(low),
          Math.abs(high),
        ])
      )
    );
  });

  it("returns isolated rows instead of exposing the module-level reference data", () => {
    const first = buildReferenceScenarioComparisonData();
    const second = buildReferenceScenarioComparisonData();

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.rows).not.toBe(second.rows);
    expect(first.rows[0]).not.toBe(second.rows[0]);
  });

  it("writes every bound and a text active state in both languages", () => {
    const data = buildReferenceScenarioComparisonData();
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(ReferenceScenarioComparison, {
          activeScenarioId: "fleet_tco_reframing",
          data,
          lang,
        })
      );

      expect(markup).toContain('data-reference-active="true"');
      expect(markup).toContain(
        lang === "pl" ? "Aktywny scenariusz" : "Active scenario"
      );
      for (const row of data.rows) {
        expect(markup).toContain(`data-scenario-id="${row.scenarioId}"`);
        expect(markup).toContain(`data-low="${row.low}"`);
        expect(markup).toContain(`data-central="${row.central}"`);
        expect(markup).toContain(`data-high="${row.high}"`);
      }
    }
  });
});
