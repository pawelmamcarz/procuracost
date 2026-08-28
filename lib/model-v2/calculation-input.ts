import {
  assertValidCalibratedValue,
  type CalibratedValue,
} from "./calibrated-value";
import type {
  V2CalculatorUrlDecodeResult,
  V2CalculatorUrlState,
} from "./calculator-url";
import {
  MODEL_V2_METADATA,
  type AlternativeId,
  type ContractCostDimensionId,
  type ContractDesign,
} from "./domain";
import {
  resolveContractDesign,
  resolveWorkflowDesign,
} from "./design-registry";
import type { ComparisonCalculationInput } from "./engine";
import type { LegacyMigrationResult } from "./legacy-migration";
import {
  type LegacyMigrationAudit,
  validateLegacyMigrationDraftForCalculation,
} from "./legacy-migration-draft";
import { resolveLegalWaits } from "./legal";
import { assertValidProcessMap } from "./process-map";
import {
  scenarioV2ById,
  type ScenarioDraft,
  type ScenarioV2Id,
} from "./scenarios";

export type CalculationInputGateV2 =
  | {
      kind: "v2_url";
      result: V2CalculatorUrlDecodeResult;
    }
  | {
      kind: "legacy_migration";
      result: LegacyMigrationResult;
      confirmed?: boolean;
      audit?: LegacyMigrationAudit;
    };

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function cloneValue(value: CalibratedValue): CalibratedValue {
  return { ...value, evidenceIds: [...value.evidenceIds] };
}

function assertNonNegativeValue(
  value: CalibratedValue,
  fieldName: string
): void {
  assertValidCalibratedValue(value, fieldName);
  if (value.low < 0) throw new Error(`${fieldName} cannot be negative`);
}

function assertZeroAllocation(
  value: CalibratedValue,
  fieldName: string
): void {
  assertValidCalibratedValue(value, fieldName);
  if (value.low !== 0 || value.central !== 0 || value.high !== 0) {
    throw new Error(
      `${fieldName} allocation is unsupported until a signed allocation convention is defined`
    );
  }
}

function monetizedDimensionCost(
  design: ContractDesign,
  dimensionId: Exclude<ContractCostDimensionId, "informal_bypass">
): CalibratedValue {
  const matches = design.dimensions.filter(({ id }) => id === dimensionId);
  if (matches.length !== 1 || matches[0].status !== "monetized") {
    throw new Error(
      `Expected one monetized ${dimensionId} dimension in each alternative`
    );
  }
  return matches[0].cost;
}

function derivedCompetitionCost(
  contractValue: CalibratedValue,
  rate: CalibratedValue,
  zero: boolean
): CalibratedValue {
  return {
    low: zero ? 0 : contractValue.low * rate.low,
    central: zero ? 0 : contractValue.central * rate.central,
    high: zero ? 0 : contractValue.high * rate.high,
    rangeKind: "stress",
    evidenceClass: rate.evidenceClass,
    evidenceIds: [...rate.evidenceIds],
  };
}

function materializeContractDesign(
  draft: ScenarioDraft,
  alternative: AlternativeId
): ContractDesign {
  const current = draft.alternatives[alternative].contractDesign;
  const assumptions = draft.economicAssumptions;
  const amendment = monetizedDimensionCost(current, "contract_amendment");
  const tco = monetizedDimensionCost(current, "tco");

  assertZeroAllocation(assumptions.amendmentDifferential, "contract_amendment");
  assertZeroAllocation(assumptions.tcoDifferential, "tco");
  assertZeroAllocation(amendment, "contract_amendment");
  assertZeroAllocation(tco, "tco");
  if (assumptions.bypass.status !== "notMonetized") {
    throw new Error("informal_bypass must remain non-monetised");
  }

  let competitionCost: CalibratedValue;
  if (assumptions.pathCompetitionDiffers) {
    const rate = assumptions.competitionTransferRate;
    if (!rate) {
      throw new Error(
        "competitionTransferRate is required when path competition differs"
      );
    }
    assertNonNegativeValue(rate, "competitionTransferRate");
    if (rate.high > 1) {
      throw new Error("competitionTransferRate cannot exceed 1");
    }
    competitionCost = derivedCompetitionCost(
      assumptions.contractValue,
      rate,
      alternative === "formalSequential"
    );
  } else {
    if (assumptions.competitionTransferRate !== null) {
      throw new Error(
        "competitionTransferRate must be null when path competition does not differ"
      );
    }
    const existing = monetizedDimensionCost(current, "competition_transfer");
    assertZeroAllocation(existing, "competition_transfer");
    competitionCost = cloneValue(existing);
  }

  return {
    dimensions: [
      {
        id: "competition_transfer",
        status: "monetized",
        cost: competitionCost,
      },
      {
        id: "contract_amendment",
        status: "monetized",
        cost: cloneValue(amendment),
      },
      { id: "tco", status: "monetized", cost: cloneValue(tco) },
      {
        ...assumptions.bypass,
        evidenceIds: [...assumptions.bypass.evidenceIds],
      },
    ],
  };
}

function assertFixedMetadata(draft: ScenarioDraft): void {
  for (const field of [
    "schemaVersion",
    "modelVersion",
    "calibrationId",
    "legalRulesetId",
  ] as const) {
    if (draft.context[field] !== MODEL_V2_METADATA[field]) {
      throw new Error(
        `Unsupported ${field}: ${String(draft.context[field])}`
      );
    }
  }
  if (!scenarioV2ById(draft.derivedFromScenarioId)) {
    throw new Error(
      `Unknown model 2.3 scenario: ${draft.derivedFromScenarioId}`
    );
  }
}

function assertGateScenario(
  state: V2CalculatorUrlState,
  scenarioId: ScenarioV2Id
): void {
  if (state.scenarioId !== scenarioId) {
    throw new Error(
      `Calculation gate scenario ${state.scenarioId} does not match draft ${scenarioId}`
    );
  }
  if (
    state.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    state.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    state.calibrationId !== MODEL_V2_METADATA.calibrationId
  ) {
    throw new Error("Calculation gate uses unsupported fixed model metadata");
  }
}

function assertGateAllowsCalculation(
  gate: CalculationInputGateV2 | undefined,
  draft: ScenarioDraft
): void {
  if (!gate) return;
  if (gate.kind === "v2_url") {
    if (gate.result.status !== "valid" || !gate.result.canCalculate) {
      throw new Error("V2 URL gate is blocked by validation errors");
    }
    assertGateScenario(gate.result.state, draft.derivedFromScenarioId);
    return;
  }

  const migration = gate.result;
  if (migration.status === "ambiguous") {
    throw new Error("Ambiguous legacy migration cannot be calculated");
  }
  if (migration.status === "partial" && gate.confirmed !== true) {
    throw new Error("Partial legacy migration requires explicit confirmation");
  }
  if (!gate.audit) {
    throw new Error("Legacy migration requires adapter-provided audit data");
  }
  validateLegacyMigrationDraftForCalculation(draft, gate);
  assertGateScenario(
    migration.status === "exact" ? migration.state : migration.draftState,
    draft.derivedFromScenarioId
  );
}

export function buildCalculationInputFromDraft(
  draft: ScenarioDraft,
  gate?: CalculationInputGateV2
): ComparisonCalculationInput {
  assertFixedMetadata(draft);
  assertGateAllowsCalculation(gate, draft);
  assertNonNegativeValue(
    draft.economicAssumptions.contractValue,
    "contractValue"
  );
  assertNonNegativeValue(
    draft.economicAssumptions.dailyCostOfInaction,
    "dailyCostOfInaction"
  );

  const expectedLegalWaits = resolveLegalWaits(draft.context);
  const alternatives = structuredClone(draft.alternatives);
  for (const alternative of ALTERNATIVE_IDS) {
    resolveWorkflowDesign(
      draft.designIds.workflow[alternative],
      draft.derivedFromScenarioId,
      alternative
    );
    resolveContractDesign(
      draft.designIds.contract[alternative],
      draft.derivedFromScenarioId,
      alternative
    );
    alternatives[alternative].contractDesign = materializeContractDesign(
      draft,
      alternative
    );
    assertValidProcessMap(
      alternatives[alternative].workflowDesign,
      expectedLegalWaits
    );
  }

  return {
    context: structuredClone(draft.context),
    alternatives,
    roleHourlyRates: structuredClone(draft.roleHourlyRates),
    dailyCostOfInaction: cloneValue(
      draft.economicAssumptions.dailyCostOfInaction
    ),
  };
}
