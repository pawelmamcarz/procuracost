import { deepFreeze } from "./deep-freeze";
import { MODEL_V2_METADATA, type AlternativeId } from "./domain";
import {
  calculateComparison,
  type ComparisonCalculationInput,
  type ComparisonCalculationResult,
} from "./engine";
import type { DecisionRecordV2 } from "./decision-record";
import { SCENARIOS_V2, SCENARIO_V2_IDS, type ScenarioV2Id } from "./scenarios";

export type ComparisonSign =
  | "formalSequential_lower"
  | "adaptiveCompliant_lower"
  | "crosses_zero"
  | "equal";

export interface ComparisonProjection {
  deltaCost: number;
  deltaCostOuterEnvelope: { low: number; high: number };
}

export interface ScenarioDiagnosticV2 {
  scenarioId: ScenarioV2Id;
  sign: ComparisonSign;
  formalSequential: {
    elapsedDays: { low: number; central: number; high: number };
    totalCost: { low: number; central: number; high: number };
  };
  adaptiveCompliant: {
    elapsedDays: { low: number; central: number; high: number };
    totalCost: { low: number; central: number; high: number };
  };
  comparison: DecisionRecordV2["comparison"];
  legalWaits: Array<{
    ruleId: string;
    provision: string;
    lockedActiveDays: number;
    lockedQueueDays: number;
    alternativeIds: AlternativeId[];
  }>;
}

export interface ModelDiagnosticsV2 {
  metadata: typeof MODEL_V2_METADATA;
  scenarioOrder: ScenarioV2Id[];
  scenarios: ScenarioDiagnosticV2[];
  invariants: {
    metadataConsistent: true;
    rangesOrdered: true;
    deltaIdentity: true;
    controlsNeutral: true;
    publicLegalWaitsLockedAndShared: true;
  };
}

export interface SwapAuditV2 {
  scenarioId: string;
  original: ComparisonCalculationResult;
  swapped: ComparisonCalculationResult;
  failures: string[];
}

export interface SymmetrySweepV2 {
  schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
  modelVersion: typeof MODEL_V2_METADATA.modelVersion;
  examined: number;
  failures: Array<{ scenarioId: string; failures: string[] }>;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function assertFiniteRange(value: unknown, path: string): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value as Record<string, unknown>;
  if (
    typeof record.low === "number" &&
    typeof record.central === "number" &&
    typeof record.high === "number"
  ) {
    if (![record.low, record.central, record.high].every(Number.isFinite)) {
      throw new Error(`${path} contains a non-finite range value`);
    }
    if (!(record.low <= record.central && record.central <= record.high)) {
      throw new Error(`${path} must satisfy low <= central <= high`);
    }
  }
  for (const [key, child] of Object.entries(record)) {
    assertFiniteRange(child, `${path}.${key}`);
  }
}

function assertCanonicalMetadata(record: DecisionRecordV2): void {
  const { metadata } = record;
  if (
    metadata.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    metadata.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    metadata.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    metadata.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId ||
    metadata.currency !== "PLN"
  ) {
    throw new Error(`Inconsistent metadata for ${metadata.scenarioId}`);
  }
}

function assertDeltaIdentity(record: DecisionRecordV2): void {
  const formal = record.alternatives.formalSequential.result.totalCost;
  const adaptive = record.alternatives.adaptiveCompliant.result.totalCost;
  const expected = {
    operation: "formalSequential_minus_adaptiveCompliant" as const,
    deltaCost: formal.central - adaptive.central,
    deltaCostOuterEnvelope: {
      low: formal.low - adaptive.high,
      high: formal.high - adaptive.low,
    },
  };
  if (JSON.stringify(record.comparison) !== JSON.stringify(expected)) {
    throw new Error(`Delta identity failed for ${record.metadata.scenarioId}`);
  }
  if (
    record.comparison.deltaCost < record.comparison.deltaCostOuterEnvelope.low ||
    record.comparison.deltaCost > record.comparison.deltaCostOuterEnvelope.high
  ) {
    throw new Error(`Central delta is outside the envelope for ${record.metadata.scenarioId}`);
  }
}

function assertLegalWaits(record: DecisionRecordV2): void {
  for (const provenance of record.legalProvenance) {
    const alternativeIds = provenance.occurrences.map(
      ({ alternativeId }) => alternativeId
    );
    if (
      JSON.stringify(alternativeIds) !==
      JSON.stringify(["formalSequential", "adaptiveCompliant"])
    ) {
      throw new Error(`Legal wait ${provenance.ruleId} is not shared by both alternatives`);
    }
    for (const occurrence of provenance.occurrences) {
      const step = record.alternatives[
        occurrence.alternativeId
      ].workflow.steps.find(({ id }) => id === occurrence.stepId);
      if (
        !step?.lockedLegalProvenance ||
        step.lockedLegalProvenance.ruleId !== provenance.ruleId ||
        step.lockedLegalProvenance.lockedActiveDays !==
          provenance.lockedActiveDays ||
        step.lockedLegalProvenance.lockedQueueDays !==
          provenance.lockedQueueDays ||
        step.activeDays.low !== provenance.lockedActiveDays ||
        step.activeDays.central !== provenance.lockedActiveDays ||
        step.activeDays.high !== provenance.lockedActiveDays ||
        step.queueDays.low !== provenance.lockedQueueDays ||
        step.queueDays.central !== provenance.lockedQueueDays ||
        step.queueDays.high !== provenance.lockedQueueDays
      ) {
        throw new Error(`Legal wait ${provenance.ruleId} differs from its locked step`);
      }
    }
  }
}

export function classifyComparisonSign(
  comparison: ComparisonProjection
): ComparisonSign {
  const { low, high } = comparison.deltaCostOuterEnvelope;
  if (![comparison.deltaCost, low, high].every(Number.isFinite) || low > high) {
    throw new Error("Comparison range must be finite and ordered");
  }
  if (comparison.deltaCost === 0 && low === 0 && high === 0) return "equal";
  if (low <= 0 && high >= 0) return "crosses_zero";
  return high < 0 ? "formalSequential_lower" : "adaptiveCompliant_lower";
}

export function buildScenarioDiagnostic(
  record: DecisionRecordV2
): ScenarioDiagnosticV2 {
  assertCanonicalMetadata(record);
  assertFiniteRange(record, record.metadata.scenarioId);
  assertDeltaIdentity(record);
  assertLegalWaits(record);

  const projectAlternative = (alternativeId: AlternativeId) => ({
    elapsedDays: clone(record.alternatives[alternativeId].result.elapsedDays),
    totalCost: clone(record.alternatives[alternativeId].result.totalCost),
  });

  return deepFreeze({
    scenarioId: record.metadata.scenarioId,
    sign: classifyComparisonSign(record.comparison),
    formalSequential: projectAlternative("formalSequential"),
    adaptiveCompliant: projectAlternative("adaptiveCompliant"),
    comparison: clone(record.comparison),
    legalWaits: record.legalProvenance.map((provenance) => ({
      ruleId: provenance.ruleId,
      provision: provenance.provision,
      lockedActiveDays: provenance.lockedActiveDays,
      lockedQueueDays: provenance.lockedQueueDays,
      alternativeIds: provenance.occurrences.map(
        ({ alternativeId }) => alternativeId
      ),
    })),
  });
}

function assertNeutralControl(record: DecisionRecordV2): void {
  const { low, high } = record.comparison.deltaCostOuterEnvelope;
  if (
    JSON.stringify(record.alternatives.formalSequential.result) !==
      JSON.stringify(record.alternatives.adaptiveCompliant.result) ||
    record.comparison.deltaCost !== 0 ||
    low !== -high
  ) {
    throw new Error(`Control ${record.metadata.scenarioId} is not neutral`);
  }
}

export function runCanonicalDiagnostics(
  records: readonly DecisionRecordV2[]
): ModelDiagnosticsV2 {
  const scenarioOrder = records.map(({ metadata }) => metadata.scenarioId);
  if (JSON.stringify(scenarioOrder) !== JSON.stringify(SCENARIO_V2_IDS)) {
    throw new Error("Diagnostics require all canonical scenarios in registry order");
  }

  const scenarios = records.map(buildScenarioDiagnostic);
  for (const controlId of [
    "catalog_calloff_control",
    "mrp_release_control",
  ] as const) {
    const record = records.find(({ metadata }) => metadata.scenarioId === controlId);
    if (!record) throw new Error(`Missing neutral control ${controlId}`);
    assertNeutralControl(record);
  }

  return deepFreeze({
    metadata: { ...MODEL_V2_METADATA },
    scenarioOrder: [...scenarioOrder],
    scenarios,
    invariants: {
      metadataConsistent: true,
      rangesOrdered: true,
      deltaIdentity: true,
      controlsNeutral: true,
      publicLegalWaitsLockedAndShared: true,
    },
  });
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function renderDiagnosticsMarkdown(report: ModelDiagnosticsV2): string {
  const rows = report.scenarios.map(
    (scenario) =>
      `| ${scenario.scenarioId} | ${scenario.sign} | ${formatNumber(scenario.formalSequential.totalCost.central)} | ${formatNumber(scenario.adaptiveCompliant.totalCost.central)} | ${formatNumber(scenario.comparison.deltaCost)} | ${formatNumber(scenario.comparison.deltaCostOuterEnvelope.low)} to ${formatNumber(scenario.comparison.deltaCostOuterEnvelope.high)} |`
  );
  return [
    `# Model ${report.metadata.modelVersion} diagnostics`,
    "",
    "Operation: formalSequential − adaptiveCompliant.",
    "Declared ranges are scenario envelopes, not statistical estimates.",
    "",
    "| Scenario | Classification | Formal central | Adaptive central | Delta central | Delta envelope |",
    "|---|---|---:|---:|---:|---:|",
    ...rows,
    "",
  ].join("\n");
}

function swappedInput(input: ComparisonCalculationInput): ComparisonCalculationInput {
  const cloned = clone(input);
  return {
    ...cloned,
    alternatives: {
      formalSequential: cloned.alternatives.adaptiveCompliant,
      adaptiveCompliant: cloned.alternatives.formalSequential,
    },
  };
}

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function auditSwapSymmetry(
  input: ComparisonCalculationInput,
  explicitScenarioId?: string
): SwapAuditV2 {
  const original = calculateComparison(input);
  const swapped = calculateComparison(swappedInput(input));
  const failures: string[] = [];
  if (!same(swapped.formalSequential, original.adaptiveCompliant)) {
    failures.push("formalSequential result did not equal original adaptiveCompliant");
  }
  if (!same(swapped.adaptiveCompliant, original.formalSequential)) {
    failures.push("adaptiveCompliant result did not equal original formalSequential");
  }
  if (!(swapped.deltaCost === -original.deltaCost)) {
    failures.push("central delta did not negate");
  }
  if (
    !(
      swapped.deltaCostOuterEnvelope.low ===
        -original.deltaCostOuterEnvelope.high &&
      swapped.deltaCostOuterEnvelope.high ===
        -original.deltaCostOuterEnvelope.low
    )
  ) {
    failures.push("outer envelope did not reverse and negate");
  }
  const scenarioId =
    explicitScenarioId ??
    SCENARIOS_V2.find(({ calculationInput }) => calculationInput === input)?.id ??
    "user_input";
  return deepFreeze({
    scenarioId,
    original: clone(original),
    swapped: clone(swapped),
    failures,
  });
}

export function runCanonicalSymmetrySweep(
  entries: ReadonlyArray<{
    id: string;
    calculationInput: ComparisonCalculationInput;
  }>
): SymmetrySweepV2 {
  const failures = entries.flatMap(({ id, calculationInput }) => {
    const audit = auditSwapSymmetry(calculationInput, id);
    return audit.failures.length > 0
      ? [{ scenarioId: id, failures: [...audit.failures] }]
      : [];
  });
  return deepFreeze({
    schemaVersion: MODEL_V2_METADATA.schemaVersion,
    modelVersion: MODEL_V2_METADATA.modelVersion,
    examined: entries.length,
    failures,
  });
}

export function renderSymmetrySweepMarkdown(report: SymmetrySweepV2): string {
  return [
    `# Model ${report.modelVersion} swap-symmetry sweep`,
    "",
    `Examined inputs: ${report.examined}`,
    `Invariant failures: ${report.failures.length}`,
    ...(report.failures.length > 0
      ? [
          "",
          ...report.failures.map(
            ({ scenarioId, failures }) =>
              `- ${scenarioId}: ${failures.join("; ")}`
          ),
        ]
      : []),
    "",
  ].join("\n");
}
