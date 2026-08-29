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
import { deepFreeze } from "./deep-freeze";
import type { ComparisonCalculationInput } from "./engine";
import { resolveLegalWaits } from "./legal";
import { assertValidProcessMap } from "./process-map";
import { assertSameRegisteredScenarioContext } from "./registered-context";
import {
  scenarioV2ById,
  type ScenarioDraft,
  type ScenarioV2Id,
} from "./scenarios";

export interface NativeCalculationInputGateV2 {
  kind: "v2_url";
  result: V2CalculatorUrlDecodeResult;
}

const MATERIALIZED_INPUTS = new WeakSet<object>();

function registerMaterializedCalculationInput(
  input: ComparisonCalculationInput
): ComparisonCalculationInput {
  const immutableInput = deepFreeze(input);
  MATERIALIZED_INPUTS.add(immutableInput);
  return immutableInput;
}

export function assertMaterializedCalculationInputIntegrity(
  input: ComparisonCalculationInput
): void {
  if (!MATERIALIZED_INPUTS.has(input)) {
    throw new Error(
      "Materialized calculation input is not registered by the calculation builder"
    );
  }
}

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
    const disadvantaged = assumptions.competitionDisadvantagedAlternative;
    if (!disadvantaged || !ALTERNATIVE_IDS.includes(disadvantaged)) {
      throw new Error(
        "competitionDisadvantagedAlternative is required when path competition differs"
      );
    }
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
      alternative !== disadvantaged
    );
  } else {
    if (assumptions.competitionDisadvantagedAlternative !== null) {
      throw new Error(
        "competitionDisadvantagedAlternative must be null when path competition does not differ"
      );
    }
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

export function assertRegisteredScenarioContext(draft: ScenarioDraft): void {
  const scenario = scenarioV2ById(draft.derivedFromScenarioId);
  if (!scenario) {
    throw new Error(
      `Unknown model 2.3 scenario: ${draft.derivedFromScenarioId}`
    );
  }
  assertSameRegisteredScenarioContext(
    draft.context,
    scenario.context,
    "Draft"
  );
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
  gate: NativeCalculationInputGateV2 | undefined,
  draft: ScenarioDraft
): void {
  if (!gate) return;
  if (gate.kind !== "v2_url") {
    throw new Error(
      "Native calculation accepts only a v2 URL gate; use the explicit legacy adapter"
    );
  }
  if (gate.result.status !== "valid" || !gate.result.canCalculate) {
    throw new Error("V2 URL gate is blocked by validation errors");
  }
  assertGateScenario(gate.result.state, draft.derivedFromScenarioId);
}

export function buildCalculationInputFromDraft(
  draft: ScenarioDraft,
  gate?: NativeCalculationInputGateV2
): ComparisonCalculationInput {
  const snapshot = structuredClone(draft);
  const gateSnapshot = gate ? structuredClone(gate) : undefined;
  if (snapshot.kind !== "user_draft") {
    throw new Error("Calculation materialization requires a user draft");
  }
  assertFixedMetadata(snapshot);
  assertRegisteredScenarioContext(snapshot);
  assertGateAllowsCalculation(gateSnapshot, snapshot);
  assertNonNegativeValue(
    snapshot.economicAssumptions.contractValue,
    "contractValue"
  );
  assertNonNegativeValue(
    snapshot.economicAssumptions.dailyCostOfInaction,
    "dailyCostOfInaction"
  );

  const expectedLegalWaits = resolveLegalWaits(snapshot.context);
  const alternatives = snapshot.alternatives;
  for (const alternative of ALTERNATIVE_IDS) {
    const registeredWorkflow = resolveWorkflowDesign(
      snapshot.designIds.workflow[alternative],
      snapshot.derivedFromScenarioId,
      alternative
    );
    const workflow = alternatives[alternative].workflowDesign;
    if (
      workflow.steps.some(
        ({ lockedLegalProvenance }) => lockedLegalProvenance !== undefined
      ) &&
      alternatives[alternative].workflowDesign.registeredDesignId !==
        snapshot.designIds.workflow[alternative]
    ) {
      throw new Error(
        `Workflow design provenance does not match the registered ${alternative} design`
      );
    }
    resolveContractDesign(
      snapshot.designIds.contract[alternative],
      snapshot.derivedFromScenarioId,
      alternative
    );
    alternatives[alternative].contractDesign = materializeContractDesign(
      snapshot,
      alternative
    );
    assertValidProcessMap(
      workflow,
      expectedLegalWaits,
      registeredWorkflow.requiredLegalDependencies
    );
  }

  return registerMaterializedCalculationInput({
    kind: "materialized_calculation_input",
    registeredScenarioId: snapshot.derivedFromScenarioId,
    context: snapshot.context,
    alternatives,
    roleHourlyRates: snapshot.roleHourlyRates,
    dailyCostOfInaction: cloneValue(
      snapshot.economicAssumptions.dailyCostOfInaction
    ),
  });
}
