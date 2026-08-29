import {
  buildDecisionRecordV2,
  createScenarioDraft,
  EVIDENCE_REGISTRY,
  MODEL_V2_METADATA,
  SCENARIOS_V2,
  type AlternativeId,
  type CalibratedValue,
  type DecisionAxisRecord,
  type DecisionRecordV2,
  type EvidenceRecord,
  type LockedLegalProvenance,
  type NonMonetizedContractDimension,
  type ScenarioAssumptionRecord,
  type ScenarioV2,
  type ScenarioV2Id,
} from "@/lib/model-v2";

export type ModelAssumptionValueId =
  | "contractValue"
  | "dailyCostOfInaction"
  | "competitionTransferRate"
  | "amendmentDifferential"
  | "tcoDifferential";

export type ModelAssumptionUnit = "pln" | "plnPerDay" | "percentage";

export interface ModelAssumptionCalibratedValue {
  readonly id: ModelAssumptionValueId;
  readonly unit: ModelAssumptionUnit;
  readonly value: CalibratedValue;
}

export interface ModelAssumptionsScenario {
  readonly ordinal: number;
  readonly id: ScenarioV2Id;
  readonly nameKey: string;
  readonly descriptionKey: string;
  readonly axes: readonly DecisionAxisRecord[];
  readonly pathCompetitionDiffers: boolean;
  readonly calibratedValues: readonly ModelAssumptionCalibratedValue[];
  readonly bypass: NonMonetizedContractDimension;
  readonly retainedAssumptionIds: readonly string[];
  readonly externalEvidenceIds: readonly string[];
}

export interface ModelAssumptionsLegalOccurrence {
  readonly scenarioId: ScenarioV2Id;
  readonly alternativeId: AlternativeId;
  readonly stepId: string;
}

export interface ModelAssumptionsLegalProvenance
  extends LockedLegalProvenance {
  readonly occurrences: ModelAssumptionsLegalOccurrence[];
}

export interface ModelAssumptionsData {
  readonly metadata: typeof MODEL_V2_METADATA;
  readonly scenarios: readonly ModelAssumptionsScenario[];
  readonly provenance: {
    readonly retainedAssumptions: readonly ScenarioAssumptionRecord[];
    readonly externalEvidence: readonly EvidenceRecord[];
    readonly lockedLegalProvenance: readonly ModelAssumptionsLegalProvenance[];
  };
  readonly neutralControl: {
    readonly record: DecisionRecordV2;
    readonly mapsIdentical: boolean;
  };
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function freezeProjection<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const nested of Object.values(value)) freezeProjection(nested);
  return Object.freeze(value);
}

function cloneValue(value: CalibratedValue): CalibratedValue {
  return { ...value, evidenceIds: [...value.evidenceIds] };
}

function scenarioAxes(scenario: ScenarioV2): DecisionAxisRecord[] {
  return [
    {
      id: "legalGovernanceBoundary",
      value: scenario.context.boundaryId,
    },
    { id: "procedureFamily", value: scenario.context.procedureFamilyId },
    { id: "purchaseArchetype", value: scenario.context.purchaseArchetypeId },
    { id: "executionChannel", value: scenario.context.executionChannelId },
    { id: "systemSupport", value: scenario.context.systemSupportId },
    { id: "initiatedOn", value: scenario.context.initiatedOn },
  ];
}

function scenarioCalibratedValues(
  scenario: ScenarioV2
): ModelAssumptionCalibratedValue[] {
  const assumptions = scenario.economicAssumptions;
  return [
    {
      id: "contractValue",
      unit: "pln",
      value: cloneValue(assumptions.contractValue),
    },
    {
      id: "dailyCostOfInaction",
      unit: "plnPerDay",
      value: cloneValue(assumptions.dailyCostOfInaction),
    },
    ...(assumptions.pathCompetitionDiffers &&
    assumptions.competitionTransferRate
      ? [
          {
            id: "competitionTransferRate" as const,
            unit: "percentage" as const,
            value: cloneValue(assumptions.competitionTransferRate),
          },
        ]
      : []),
    {
      id: "amendmentDifferential",
      unit: "pln",
      value: cloneValue(assumptions.amendmentDifferential),
    },
    {
      id: "tcoDifferential",
      unit: "pln",
      value: cloneValue(assumptions.tcoDifferential),
    },
  ];
}

function scenarioProjection(
  scenario: ScenarioV2,
  ordinal: number
): ModelAssumptionsScenario {
  return {
    ordinal,
    id: scenario.id,
    nameKey: scenario.nameKey,
    descriptionKey: scenario.descriptionKey,
    axes: scenarioAxes(scenario),
    pathCompetitionDiffers:
      scenario.economicAssumptions.pathCompetitionDiffers,
    calibratedValues: scenarioCalibratedValues(scenario),
    bypass: {
      ...scenario.economicAssumptions.bypass,
      evidenceIds: [...scenario.economicAssumptions.bypass.evidenceIds],
    },
    retainedAssumptionIds: scenario.assumptions.map(({ id }) => id),
    externalEvidenceIds: [...scenario.evidenceIds],
  };
}

function collectLockedLegalProvenance(): ModelAssumptionsLegalProvenance[] {
  const records = new Map<string, ModelAssumptionsLegalProvenance>();

  for (const scenario of SCENARIOS_V2) {
    for (const alternativeId of ALTERNATIVE_IDS) {
      const steps =
        scenario.calculationInput.alternatives[alternativeId].workflowDesign
          .steps;
      for (const step of steps) {
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
        const occurrence = {
          scenarioId: scenario.id,
          alternativeId,
          stepId: step.id,
        };
        const current = records.get(key);
        if (current) current.occurrences.push(occurrence);
        else records.set(key, { ...provenance, occurrences: [occurrence] });
      }
    }
  }

  return [...records.values()];
}

export function buildModelAssumptionsData(): ModelAssumptionsData {
  const neutralRecord = buildDecisionRecordV2(
    createScenarioDraft("catalog_calloff_control")
  );
  const formalWorkflow =
    neutralRecord.alternatives.formalSequential.workflow.steps;
  const adaptiveWorkflow =
    neutralRecord.alternatives.adaptiveCompliant.workflow.steps;

  return freezeProjection({
    metadata: { ...MODEL_V2_METADATA },
    scenarios: SCENARIOS_V2.map((scenario, index) =>
      scenarioProjection(scenario, index + 1)
    ),
    provenance: {
      retainedAssumptions: structuredClone(
        SCENARIOS_V2.flatMap(({ assumptions }) => assumptions)
      ),
      externalEvidence: structuredClone(EVIDENCE_REGISTRY),
      lockedLegalProvenance: collectLockedLegalProvenance(),
    },
    neutralControl: {
      record: neutralRecord,
      mapsIdentical:
        JSON.stringify(formalWorkflow) === JSON.stringify(adaptiveWorkflow),
    },
  });
}

export const MODEL_ASSUMPTIONS_DATA = buildModelAssumptionsData();
