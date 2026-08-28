import {
  SCENARIO_V2_IDS,
  buildDecisionRecordV2,
  createScenarioDraft,
  type ScenarioV2Id,
} from "@/lib/model-v2";

export interface ReferenceScenarioInterval {
  scenarioId: ScenarioV2Id;
  low: number;
  central: number;
  high: number;
}

export interface ReferenceScenarioComparisonData {
  rows: readonly ReferenceScenarioInterval[];
  denominator: number;
  unit: "PLN";
}

const REFERENCE_ROWS: readonly ReferenceScenarioInterval[] =
  SCENARIO_V2_IDS.map((scenarioId) => {
    const record = buildDecisionRecordV2(createScenarioDraft(scenarioId));
    return {
      scenarioId,
      low: record.comparison.deltaCostOuterEnvelope.low,
      central: record.comparison.deltaCost,
      high: record.comparison.deltaCostOuterEnvelope.high,
    };
  });

const REFERENCE_DENOMINATOR = Math.max(
  ...REFERENCE_ROWS.flatMap(({ low, high }) => [Math.abs(low), Math.abs(high)])
);

export function buildReferenceScenarioComparisonData(): ReferenceScenarioComparisonData {
  return {
    rows: REFERENCE_ROWS.map((row) => ({ ...row })),
    denominator: REFERENCE_DENOMINATOR,
    unit: "PLN",
  };
}
