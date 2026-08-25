import { calculateCosts, type ProcurementInputs } from "./calculations";
import type { ProcessType, TechLevelId } from "./process-templates";

export const DECISION_MAP_AXIS_MAX = 6_000;
export const DECISION_MAP_STEP = 100;

export type DecisionKind = "formal" | "undecided" | "adaptive";

export interface DecisionSegment {
  from: number;
  to: number;
  kind: DecisionKind;
}

const REFERENCE_ROWS = [
  { id: "pzpEu", processType: "pzp_eu", contractValue: 5_000_000 },
  { id: "pzpEuLarge", processType: "pzp_eu", contractValue: 20_000_000 },
  { id: "pzpNational", processType: "pzp_krajowy", contractValue: 500_000 },
  { id: "privateFormal", processType: "private_formal", contractValue: 5_000_000 },
  { id: "capex", processType: "capex", contractValue: 5_000_000 },
  { id: "discovery", processType: "discovery", contractValue: 2_000_000 },
  { id: "policyOnly", processType: "policy_only", contractValue: 5_000_000 },
  { id: "catalog", processType: "catalog_order", contractValue: 50_000 },
  { id: "mrp", processType: "mrp_order", contractValue: 500_000 },
] as const satisfies ReadonlyArray<{
  id: string;
  processType: Exclude<ProcessType, "custom">;
  contractValue: number;
}>;

export type DecisionMapRowId = (typeof REFERENCE_ROWS)[number]["id"];

export interface DecisionRegime {
  id: DecisionMapRowId;
  contractValue: number;
  dayDifference: number;
  segments: DecisionSegment[];
  centralAt: number | null;
}

const REFERENCE_TECH: TechLevelId = "partial_erp";

const REFERENCE_STAKEHOLDERS: ProcurementInputs["stakeholders"] = {
  requestor: { count: 1, dailyRate: 900 },
  buyer: { count: 1, dailyRate: 800 },
  lawyer: { count: 1, dailyRate: 1200 },
  finance: { count: 1, dailyRate: 900 },
  manager: { count: 1, dailyRate: 1500 },
  executive: { count: 1, dailyRate: 2500 },
};

export function classifyDecisionRange(lowDelta: number, highDelta: number): DecisionKind {
  if (highDelta < 0) return "formal";
  if (lowDelta > 0) return "adaptive";
  return "undecided";
}

function inputsFor(
  row: (typeof REFERENCE_ROWS)[number],
  dailyCostOfInaction: number,
): ProcurementInputs {
  return {
    contractValue: row.contractValue,
    tcoHorizonYears: 2,
    contractDurationYears: 2,
    processType: row.processType,
    techLevel: REFERENCE_TECH,
    stakeholders: REFERENCE_STAKEHOLDERS,
    dailyCostOfInaction,
    renegotiationCost: row.contractValue * 0.04,
    bypassAuditExposure: row.contractValue * 0.1,
  };
}

function compressSamples(samples: Array<{ at: number; kind: DecisionKind }>): DecisionSegment[] {
  const segments: DecisionSegment[] = [];
  let from = samples[0].at;
  let kind = samples[0].kind;

  for (const sample of samples.slice(1)) {
    if (sample.kind === kind) continue;
    segments.push({ from, to: sample.at, kind });
    from = sample.at;
    kind = sample.kind;
  }

  segments.push({ from, to: DECISION_MAP_AXIS_MAX, kind });
  return segments;
}

export function buildDecisionRegimes(): DecisionRegime[] {
  return REFERENCE_ROWS.map((row) => {
    const samples: Array<{ at: number; kind: DecisionKind }> = [];
    let baseline: ReturnType<typeof calculateCosts> | null = null;

    for (
      let dailyCostOfInaction = 0;
      dailyCostOfInaction <= DECISION_MAP_AXIS_MAX;
      dailyCostOfInaction += DECISION_MAP_STEP
    ) {
      const result = calculateCosts(inputsFor(row, dailyCostOfInaction));
      if (dailyCostOfInaction === 0) baseline = result;
      samples.push({
        at: dailyCostOfInaction,
        kind: classifyDecisionRange(
          result.uncertainty.lowDelta,
          result.uncertainty.highDelta,
        ),
      });
    }

    const threshold = baseline!.decisionThreshold.breakEvenDailyCostOfInaction;
    const centralAt = threshold !== null && threshold >= 0 && threshold <= DECISION_MAP_AXIS_MAX
      ? threshold
      : null;

    return {
      id: row.id,
      contractValue: row.contractValue,
      dayDifference: baseline!.decisionThreshold.effectiveDayDifference,
      segments: compressSamples(samples),
      centralAt,
    };
  });
}
