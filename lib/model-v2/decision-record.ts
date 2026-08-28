import type {
  CalibratedValue,
  EvidenceClass,
  RangeValues,
} from "./calibrated-value";
import type { CalculationInputGateV2 } from "./calculation-input";
import {
  MODEL_V2_METADATA,
  type AlternativeId,
  type ContractCostDimensionId,
  type LockedLegalProvenance,
  type ModelContextV2,
  type ProcessMapStep,
} from "./domain";
import type {
  AlternativeCostResult,
  ComparisonCalculationInput,
  ComparisonCalculationResult,
} from "./engine";
import {
  EVIDENCE_REGISTRY,
  type EvidenceRecord,
} from "./evidence";
import type {
  ContractDesignIdV2,
  ScenarioAssumptionRecord,
  ScenarioDraft,
  ScenarioEconomicAssumptions,
  ScenarioV2,
  ScenarioV2Id,
  WorkflowDesignIdV2,
} from "./scenarios";

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];
const RANGE_CASES = ["low", "central", "high"] as const;
type RangeCase = (typeof RANGE_CASES)[number];

export type DecisionAxisId =
  | "legalGovernanceBoundary"
  | "procedureFamily"
  | "purchaseArchetype"
  | "executionChannel"
  | "systemSupport"
  | "initiatedOn";

export interface DecisionAxisRecord {
  id: DecisionAxisId;
  value: string;
}

export interface DecisionRecordMigrationMetadata {
  sourceSchemaVersion: "v2" | "legacy-v1";
  status: "native" | "exact" | "partial";
  confirmed: true;
  legacyScenarioId: string | null;
  fieldsRequiringConfirmation: string[];
}

export type MonetaryDriverId =
  | "role_cost"
  | "non_labour_cost"
  | "delay_cost"
  | Exclude<ContractCostDimensionId, "informal_bypass">;

export interface MonetaryDriverRecord {
  id: MonetaryDriverId;
  formalSequential: RangeValues;
  adaptiveCompliant: RangeValues;
  contribution: RangeValues;
}

export interface MonetaryCoverageRecord extends MonetaryDriverRecord {
  status: "included";
}

export interface DecisionProcessStep {
  id: string;
  labelKey: string;
  userLabel: string | null;
  predecessorIds: string[];
  activeDays: CalibratedValue;
  queueDays: CalibratedValue;
  roleHours: Record<string, CalibratedValue>;
  nonLabourCost: CalibratedValue;
  kind: ProcessMapStep["kind"];
  lockedLegalProvenance: LockedLegalProvenance | null;
  criticalPathCases: RangeCase[];
}

export interface DecisionAlternativeRecord {
  id: AlternativeId;
  designIds: {
    workflowDesignId: WorkflowDesignIdV2;
    contractDesignId: ContractDesignIdV2;
  };
  workflow: {
    steps: DecisionProcessStep[];
  };
  result: AlternativeCostResult;
}

export interface DecisionNonMonetizedDimension {
  id: ContractCostDimensionId;
  alternatives: Record<
    AlternativeId,
    { reasonKey: string; evidenceIds: string[] } | null
  >;
}

export interface CalculationAnchorRecord {
  path: string;
  evidenceClass: EvidenceClass;
  evidenceIds: string[];
}

export interface LegalProvenanceRecord extends LockedLegalProvenance {
  occurrences: Array<{
    alternativeId: AlternativeId;
    stepId: string;
  }>;
}

export interface DecisionRecordV2 {
  metadata: {
    schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
    modelVersion: typeof MODEL_V2_METADATA.modelVersion;
    calibrationId: typeof MODEL_V2_METADATA.calibrationId;
    legalRulesetId: typeof MODEL_V2_METADATA.legalRulesetId;
    scenarioId: ScenarioV2Id;
    currency: "PLN";
    migration: DecisionRecordMigrationMetadata;
  };
  axes: DecisionAxisRecord[];
  alternatives: Record<AlternativeId, DecisionAlternativeRecord>;
  comparison: {
    operation: "formalSequential_minus_adaptiveCompliant";
    deltaCost: number;
    deltaCostOuterEnvelope: { low: number; high: number };
  };
  drivers: MonetaryDriverRecord[];
  coverage: MonetaryCoverageRecord[];
  nonMonetizedDimensions: DecisionNonMonetizedDimension[];
  assumptions: ScenarioEconomicAssumptions;
  calculationAnchors: CalculationAnchorRecord[];
  externalEvidence: EvidenceRecord[];
  retainedAssumptions: ScenarioAssumptionRecord[];
  legalProvenance: LegalProvenanceRecord[];
}

export interface BuildDecisionRecordV2Args {
  scenario: ScenarioV2;
  source: ScenarioV2 | ScenarioDraft;
  calculationInput: ComparisonCalculationInput;
  calculationResult: ComparisonCalculationResult;
  migration: DecisionRecordMigrationMetadata;
}

export function nativeV2MigrationMetadata(): DecisionRecordMigrationMetadata {
  return {
    sourceSchemaVersion: "v2",
    status: "native",
    confirmed: true,
    legacyScenarioId: null,
    fieldsRequiringConfirmation: [],
  };
}

export function migrationMetadataFromCalculationGate(
  gate: CalculationInputGateV2
): DecisionRecordMigrationMetadata {
  if (gate.kind === "v2_url") {
    if (gate.result.status !== "valid" || !gate.result.canCalculate) {
      throw new Error("V2 URL gate is blocked by validation errors");
    }
    return nativeV2MigrationMetadata();
  }

  const migration = gate.result;
  if (migration.status === "ambiguous") {
    throw new Error("Ambiguous legacy migration cannot produce a decision record");
  }
  if (migration.status === "partial" && gate.confirmed !== true) {
    throw new Error("Partial legacy migration requires explicit confirmation");
  }
  return {
    sourceSchemaVersion: migration.sourceSchemaVersion,
    status: migration.status,
    confirmed: true,
    legacyScenarioId: migration.legacyScenarioId,
    fieldsRequiringConfirmation: [...migration.fieldsRequiringConfirmation],
  };
}

function cloneRange(value: RangeValues): RangeValues {
  return { low: value.low, central: value.central, high: value.high };
}

function contributionRange(
  formalSequential: RangeValues,
  adaptiveCompliant: RangeValues
): RangeValues {
  return {
    low: formalSequential.low - adaptiveCompliant.high,
    central: formalSequential.central - adaptiveCompliant.central,
    high: formalSequential.high - adaptiveCompliant.low,
  };
}

function driver(
  id: MonetaryDriverId,
  formalSequential: RangeValues,
  adaptiveCompliant: RangeValues
): MonetaryDriverRecord {
  return {
    id,
    formalSequential: cloneRange(formalSequential),
    adaptiveCompliant: cloneRange(adaptiveCompliant),
    contribution: contributionRange(formalSequential, adaptiveCompliant),
  };
}

function contractCostByDimension(
  input: ComparisonCalculationInput,
  alternative: AlternativeId,
  dimensionId: Exclude<ContractCostDimensionId, "informal_bypass">
): RangeValues {
  const dimensions = input.alternatives[alternative].contractDesign.dimensions.filter(
    ({ id }) => id === dimensionId
  );
  if (dimensions.length !== 1 || dimensions[0].status !== "monetized") {
    throw new Error(`Decision record requires one monetized ${dimensionId}`);
  }
  return dimensions[0].cost;
}

function buildDrivers(
  input: ComparisonCalculationInput,
  result: ComparisonCalculationResult
): MonetaryDriverRecord[] {
  const drivers = [
    driver(
      "role_cost",
      result.formalSequential.roleCost,
      result.adaptiveCompliant.roleCost
    ),
    driver(
      "non_labour_cost",
      result.formalSequential.nonLabourCost,
      result.adaptiveCompliant.nonLabourCost
    ),
    driver(
      "delay_cost",
      result.formalSequential.delayCost,
      result.adaptiveCompliant.delayCost
    ),
    ...(["competition_transfer", "contract_amendment", "tco"] as const).map(
      (id) =>
        driver(
          id,
          contractCostByDimension(input, "formalSequential", id),
          contractCostByDimension(input, "adaptiveCompliant", id)
        )
    ),
  ];
  return drivers.sort((left, right) => {
    const magnitude =
      Math.abs(right.contribution.central) -
      Math.abs(left.contribution.central);
    if (magnitude !== 0) return magnitude;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });
}

function buildCoverage(
  input: ComparisonCalculationInput,
  result: ComparisonCalculationResult
): MonetaryCoverageRecord[] {
  const ordered = [
    driver(
      "role_cost",
      result.formalSequential.roleCost,
      result.adaptiveCompliant.roleCost
    ),
    driver(
      "non_labour_cost",
      result.formalSequential.nonLabourCost,
      result.adaptiveCompliant.nonLabourCost
    ),
    driver(
      "delay_cost",
      result.formalSequential.delayCost,
      result.adaptiveCompliant.delayCost
    ),
    ...(["competition_transfer", "contract_amendment", "tco"] as const).map(
      (id) =>
        driver(
          id,
          contractCostByDimension(input, "formalSequential", id),
          contractCostByDimension(input, "adaptiveCompliant", id)
        )
    ),
  ];
  return ordered.map((entry) => ({ ...entry, status: "included" }));
}

function buildNonMonetizedDimensions(
  result: ComparisonCalculationResult
): DecisionNonMonetizedDimension[] {
  const ids = new Set<ContractCostDimensionId>();
  for (const alternative of ALTERNATIVE_IDS) {
    for (const dimension of result[alternative].nonMonetizedDimensions) {
      ids.add(dimension.id);
    }
  }
  return [...ids]
    .sort()
    .map((id) => ({
      id,
      alternatives: Object.fromEntries(
        ALTERNATIVE_IDS.map((alternative) => {
          const dimension = result[alternative].nonMonetizedDimensions.find(
            (candidate) => candidate.id === id
          );
          return [
            alternative,
            dimension
              ? {
                  reasonKey: dimension.reasonKey,
                  evidenceIds: [...dimension.evidenceIds],
                }
              : null,
          ];
        })
      ) as DecisionNonMonetizedDimension["alternatives"],
    }));
}

function isCalibratedValue(value: unknown): value is CalibratedValue {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CalibratedValue>;
  return (
    typeof candidate.low === "number" &&
    typeof candidate.central === "number" &&
    typeof candidate.high === "number" &&
    typeof candidate.rangeKind === "string" &&
    typeof candidate.evidenceClass === "string" &&
    Array.isArray(candidate.evidenceIds)
  );
}

function collectCalculationAnchors(
  value: unknown,
  path = ""
): CalculationAnchorRecord[] {
  if (isCalibratedValue(value)) {
    return [
      {
        path,
        evidenceClass: value.evidenceClass,
        evidenceIds: [...value.evidenceIds],
      },
    ];
  }
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) {
    return value.flatMap((child, index) =>
      collectCalculationAnchors(child, `${path}[${index}]`)
    );
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectCalculationAnchors(child, path ? `${path}.${key}` : key)
  );
}

function buildExternalEvidence(
  scenario: ScenarioV2,
  anchors: CalculationAnchorRecord[]
): EvidenceRecord[] {
  const ids = new Set([
    ...scenario.evidenceIds,
    ...anchors.flatMap(({ evidenceIds }) => evidenceIds),
  ]);
  return EVIDENCE_REGISTRY.filter(({ id }) => ids.has(id)).map((record) =>
    structuredClone(record)
  );
}

function buildLegalProvenance(
  input: ComparisonCalculationInput
): LegalProvenanceRecord[] {
  const records = new Map<string, LegalProvenanceRecord>();
  for (const alternative of ALTERNATIVE_IDS) {
    for (const step of input.alternatives[alternative].workflowDesign.steps) {
      const provenance = step.lockedLegalProvenance;
      if (!provenance) continue;
      const key = [
        provenance.legalRulesetId,
        provenance.ruleId,
        provenance.provision,
        provenance.initiatedOn,
        provenance.lockedActiveDays,
        provenance.lockedQueueDays,
      ].join("|");
      const existing = records.get(key);
      const occurrence = { alternativeId: alternative, stepId: step.id };
      if (existing) existing.occurrences.push(occurrence);
      else {
        records.set(key, {
          ...provenance,
          occurrences: [occurrence],
        });
      }
    }
  }
  return [...records.values()];
}

function buildStepRecord(
  step: ProcessMapStep,
  result: AlternativeCostResult
): DecisionProcessStep {
  return {
    id: step.id,
    labelKey: step.labelKey,
    userLabel: step.userLabel ?? null,
    predecessorIds: [...step.predecessorIds],
    activeDays: structuredClone(step.activeDays),
    queueDays: structuredClone(step.queueDays),
    roleHours: structuredClone(step.roleHours),
    nonLabourCost: structuredClone(step.nonLabourCost),
    kind: step.kind,
    lockedLegalProvenance: step.lockedLegalProvenance
      ? { ...step.lockedLegalProvenance }
      : null,
    criticalPathCases: RANGE_CASES.filter((rangeCase) =>
      result.criticalPathStepIds[rangeCase].includes(step.id)
    ),
  };
}

function sourceScenarioId(source: ScenarioV2 | ScenarioDraft): ScenarioV2Id {
  return source.kind === "registry_scenario"
    ? source.id
    : source.derivedFromScenarioId;
}

function assertRecordInputs(args: BuildDecisionRecordV2Args): ModelContextV2 {
  const context = args.source.context;
  if (
    sourceScenarioId(args.source) !== args.scenario.id ||
    context.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    context.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    context.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    context.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId
  ) {
    throw new Error("Decision record source metadata is inconsistent");
  }
  if (
    args.calculationInput.context.legalRulesetId !== context.legalRulesetId ||
    args.calculationInput.context.boundaryId !== context.boundaryId ||
    args.calculationInput.context.procedureFamilyId !==
      context.procedureFamilyId ||
    args.calculationInput.context.initiatedOn !== context.initiatedOn
  ) {
    throw new Error("Decision record calculation context is inconsistent");
  }
  return context;
}

export function buildDecisionRecordV2(
  args: BuildDecisionRecordV2Args
): DecisionRecordV2 {
  const context = assertRecordInputs(args);
  const anchors = collectCalculationAnchors(args.calculationInput);
  const drivers = buildDrivers(args.calculationInput, args.calculationResult);
  const alternatives = Object.fromEntries(
    ALTERNATIVE_IDS.map((alternative) => {
      const result = args.calculationResult[alternative];
      return [
        alternative,
        {
          id: alternative,
          designIds: {
            workflowDesignId: args.source.designIds.workflow[alternative],
            contractDesignId: args.source.designIds.contract[alternative],
          },
          workflow: {
            steps: args.calculationInput.alternatives[
              alternative
            ].workflowDesign.steps.map((step) => buildStepRecord(step, result)),
          },
          result: structuredClone(result),
        },
      ];
    })
  ) as Record<AlternativeId, DecisionAlternativeRecord>;

  return {
    metadata: {
      schemaVersion: MODEL_V2_METADATA.schemaVersion,
      modelVersion: MODEL_V2_METADATA.modelVersion,
      calibrationId: MODEL_V2_METADATA.calibrationId,
      legalRulesetId: MODEL_V2_METADATA.legalRulesetId,
      scenarioId: args.scenario.id,
      currency: "PLN",
      migration: structuredClone(args.migration),
    },
    axes: [
      { id: "legalGovernanceBoundary", value: context.boundaryId },
      { id: "procedureFamily", value: context.procedureFamilyId },
      { id: "purchaseArchetype", value: context.purchaseArchetypeId },
      { id: "executionChannel", value: context.executionChannelId },
      { id: "systemSupport", value: context.systemSupportId },
      { id: "initiatedOn", value: context.initiatedOn },
    ],
    alternatives,
    comparison: {
      operation: "formalSequential_minus_adaptiveCompliant",
      deltaCost: args.calculationResult.deltaCost,
      deltaCostOuterEnvelope: {
        ...args.calculationResult.deltaCostOuterEnvelope,
      },
    },
    drivers,
    coverage: buildCoverage(args.calculationInput, args.calculationResult),
    nonMonetizedDimensions: buildNonMonetizedDimensions(
      args.calculationResult
    ),
    assumptions: structuredClone(args.source.economicAssumptions),
    calculationAnchors: anchors,
    externalEvidence: buildExternalEvidence(args.scenario, anchors),
    retainedAssumptions: structuredClone(args.scenario.assumptions),
    legalProvenance: buildLegalProvenance(args.calculationInput),
  };
}
