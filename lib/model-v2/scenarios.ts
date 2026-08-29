import type { CalibratedValue } from "./calibrated-value";
import type {
  AlternativeId,
  ComparisonAlternatives,
  ContractDesign,
  ModelContextV2,
  NonMonetizedContractDimension,
  ProcessMapStep,
  WorkflowDesign,
} from "./domain";
import { MODEL_V2_METADATA } from "./domain";
import type { ComparisonCalculationInput } from "./engine";
import type { EvidenceConstruct } from "./evidence";
import { deepFreeze } from "./deep-freeze";
import { resolveLegalWaits } from "./legal";
import { createLockedLegalWaitStep } from "./process-map";
import {
  RETAINED_SUPPORT_PROFILES,
  RETAINED_WORKFLOW_TEMPLATES,
  type RetainedRoleId,
  type RetainedWorkflowTemplateId,
} from "./retained-workflow-seeds";

export const SCENARIO_V2_IDS = deepFreeze([
  "fleet_tco_reframing",
  "erp_transformation_discovery",
  "logistics_service_redesign",
  "critical_material_continuity",
  "public_it_open_with_market_consultation",
  "stable_private_standard_service",
  "stable_capex_replacement",
  "discovery_solution_codesign",
  "catalog_calloff_control",
  "mrp_release_control",
] as const);

export type ScenarioV2Id = (typeof SCENARIO_V2_IDS)[number];
export type WorkflowDesignIdV2 =
  `${ScenarioV2Id}.workflow.${AlternativeId}`;
export type ContractDesignIdV2 =
  `${ScenarioV2Id}.contract.${AlternativeId}`;

export interface ScenarioSourceMetadata {
  titleKey: string;
  publisherKey: string;
  sourceModelVersion: "2.2.2";
  publicationKind: "legacy_model_registry";
}

export interface ScenarioAssumptionRecord {
  id: string;
  evidenceClass: "retained_legacy_assumption";
  sourceUrl: string;
  source: ScenarioSourceMetadata;
  labelKey: string;
  detailKey: string;
  constructs: EvidenceConstruct[];
}

export interface ScenarioDesignIds {
  workflow: Record<AlternativeId, WorkflowDesignIdV2>;
  contract: Record<AlternativeId, ContractDesignIdV2>;
}

export interface ScenarioEconomicAssumptions {
  contractValue: CalibratedValue;
  dailyCostOfInaction: CalibratedValue;
  pathCompetitionDiffers: boolean;
  competitionTransferRate: CalibratedValue | null;
  amendmentDifferential: CalibratedValue;
  tcoDifferential: CalibratedValue;
  bypass: NonMonetizedContractDimension;
}

export interface ScenarioV2 {
  kind: "registry_scenario";
  id: ScenarioV2Id;
  legacyAliases: readonly [string];
  nameKey: string;
  descriptionKey: string;
  sourceUrl: string;
  source: ScenarioSourceMetadata;
  constructs: EvidenceConstruct[];
  assumptions: ScenarioAssumptionRecord[];
  evidenceIds: string[];
  designIds: ScenarioDesignIds;
  context: ModelContextV2;
  economicAssumptions: ScenarioEconomicAssumptions;
  calculationInput: ComparisonCalculationInput;
}

export interface ScenarioDraft
  extends Omit<ComparisonCalculationInput, "context"> {
  kind: "user_draft";
  derivedFromScenarioId: ScenarioV2Id;
  designIds: ScenarioDesignIds;
  context: ModelContextV2;
  economicAssumptions: ScenarioEconomicAssumptions;
}

interface ScenarioSeed {
  id: ScenarioV2Id;
  legacyAlias: string;
  context: Omit<
    ModelContextV2,
    | "schemaVersion"
    | "modelVersion"
    | "calibrationId"
    | "legalRulesetId"
    | "initiatedOn"
  >;
  contractValue: number;
  dailyCostOfInaction: number;
  roleDailyRates: Record<string, number>;
  retainedWorkflowTemplateId: RetainedWorkflowTemplateId;
  pathCompetitionDiffers: boolean;
  evidenceIds: string[];
  constructs: EvidenceConstruct[];
}

const SCENARIO_SOURCE_URL = "https://www.procuracost.com/model/assumptions";
const INITIATED_ON = "2026-08-28";
const COMPETITION_EVIDENCE_ID = "szucs_discretion_price_2024";

function retainedValue(value: number, evidenceId: string): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "calibrated",
    evidenceClass: "retained_legacy_assumption",
    evidenceIds: [evidenceId],
  };
}

function retainedStressValue(
  central: number,
  evidenceId: string
): CalibratedValue {
  return {
    low: central * 0.25,
    central,
    high: central * 4,
    rangeKind: "stress",
    evidenceClass: "retained_legacy_assumption",
    evidenceIds: [evidenceId],
  };
}

function competitionRate(): CalibratedValue {
  return {
    low: 0.02,
    central: 0.06,
    high: 0.09,
    rangeKind: "stress",
    evidenceClass: "empirical_anchor",
    evidenceIds: [COMPETITION_EVIDENCE_ID],
  };
}

function zeroCompetitionCost(
  evidenceId: string,
  pathCompetitionDiffers: boolean
): CalibratedValue {
  return pathCompetitionDiffers
    ? {
        low: 0,
        central: 0,
        high: 0,
        rangeKind: "stress",
        evidenceClass: "empirical_anchor",
        evidenceIds: [COMPETITION_EVIDENCE_ID],
      }
    : retainedValue(0, evidenceId);
}

function workflowFromRetainedSeed(
  scenarioId: ScenarioV2Id,
  alternative: AlternativeId,
  templateId: RetainedWorkflowTemplateId,
  assumptionId: string,
  context: ModelContextV2,
  sharedStepIds: boolean
): WorkflowDesign {
  const template = RETAINED_WORKFLOW_TEMPLATES[templateId];
  const supportProfile = RETAINED_SUPPORT_PROFILES[context.systemSupportId];
  const expectedLegalWaits = resolveLegalWaits(context);
  const namespace = sharedStepIds ? "shared" : alternative;
  const steps: ProcessMapStep[] = [];
  let predecessorId: string | null = null;
  let legalWaitIndex = 0;
  let toolCostAssigned = false;

  for (const seedStep of template.steps) {
    if (seedStep.kind === "legal_wait_slot") {
      const wait = expectedLegalWaits[legalWaitIndex];
      if (!wait || !wait.id.endsWith(`.${seedStep.slotId}`)) {
        throw new Error(
          `Missing fixed legal rule for retained slot ${seedStep.slotId}`
        );
      }
      const legalStep = createLockedLegalWaitStep(
        wait,
        predecessorId ? [predecessorId] : []
      );
      legalStep.labelKey = wait.labelKey.replace(
        "model.legal.",
        "workflow.legal."
      );
      steps.push(legalStep);
      predecessorId = legalStep.id;
      legalWaitIndex += 1;
      continue;
    }

    const baseActiveDays =
      alternative === "formalSequential"
        ? seedStep.formalDays
        : seedStep.adaptiveDays;
    const activeDays = baseActiveDays * supportProfile.timeMultiplier;

    const effortRatio =
      alternative === "adaptiveCompliant" &&
      seedStep.formalDays > 0
        ? seedStep.adaptiveDays / seedStep.formalDays
        : 1;
    const roleHours = Object.fromEntries(
      (
        Object.entries(seedStep.roleHours) as [
          RetainedRoleId,
          number,
        ][]
      ).map(([roleId, hours]) => [
        roleId,
        retainedValue(
          hours * effortRatio * supportProfile.timeMultiplier,
          assumptionId
        ),
      ])
    );
    const consumesEffort = Object.values(seedStep.roleHours).some(
      (hours) => Number.isFinite(hours) && hours > 0
    );
    const toolCost = toolCostAssigned
      ? 0
      : context.executionChannelId === "catalog_calloff" ||
          context.executionChannelId === "mrp_release"
        ? supportProfile.toolCostPerOperationalOrder
        : supportProfile.toolCostPerSourcingEvent;
    toolCostAssigned = true;

    const step: ProcessMapStep = {
      id: `${scenarioId}.${namespace}.${seedStep.id}`,
      labelKey: `workflow.steps.${seedStep.id}`,
      predecessorIds: predecessorId ? [predecessorId] : [],
      activeDays: retainedValue(activeDays, assumptionId),
      queueDays: retainedValue(0, assumptionId),
      roleHours,
      nonLabourCost: retainedValue(
        (consumesEffort
          ? activeDays * supportProfile.coordinationCostPerActiveDay
          : 0) + toolCost,
        assumptionId
      ),
      kind: "activity",
    };
    steps.push(step);
    predecessorId = step.id;
  }

  if (legalWaitIndex !== expectedLegalWaits.length) {
    throw new Error(
      `Retained process map omitted ${expectedLegalWaits.length - legalWaitIndex} fixed legal waits`
    );
  }

  return { steps };
}

function contractDesign(
  contractValue: number,
  assumptionId: string,
  pathCompetitionDiffers: boolean,
  alternative: AlternativeId
): ContractDesign {
  const competitionCost =
    pathCompetitionDiffers && alternative === "adaptiveCompliant"
      ? {
          low: contractValue * 0.02,
          central: contractValue * 0.06,
          high: contractValue * 0.09,
          rangeKind: "stress" as const,
          evidenceClass: "empirical_anchor" as const,
          evidenceIds: [COMPETITION_EVIDENCE_ID],
        }
      : zeroCompetitionCost(assumptionId, pathCompetitionDiffers);

  return {
    dimensions: [
      { id: "competition_transfer", status: "monetized", cost: competitionCost },
      {
        id: "contract_amendment",
        status: "monetized",
        cost: retainedValue(0, assumptionId),
      },
      { id: "tco", status: "monetized", cost: retainedValue(0, assumptionId) },
      {
        id: "informal_bypass",
        status: "notMonetized",
        reasonKey: "reasons.bypassNotMonetized",
        evidenceIds: [],
      },
    ],
  };
}

function sourceMetadata(id: ScenarioV2Id): ScenarioSourceMetadata {
  return {
    titleKey: `scenarios.${id}.sourceTitle`,
    publisherKey: "scenarios.sourcePublisher",
    sourceModelVersion: "2.2.2",
    publicationKind: "legacy_model_registry",
  };
}

function buildScenario(seed: ScenarioSeed): ScenarioV2 {
  const assumptionId = `scenario.${seed.id}.retained-legacy`;
  const context: ModelContextV2 = {
    ...MODEL_V2_METADATA,
    ...seed.context,
    initiatedOn: INITIATED_ON,
  };
  const sharedStepIds = !seed.pathCompetitionDiffers;
  const formalWorkflow = workflowFromRetainedSeed(
    seed.id,
    "formalSequential",
    seed.retainedWorkflowTemplateId,
    assumptionId,
    context,
    sharedStepIds
  );
  const adaptiveWorkflow = workflowFromRetainedSeed(
    seed.id,
    "adaptiveCompliant",
    seed.retainedWorkflowTemplateId,
    assumptionId,
    context,
    sharedStepIds
  );
  const alternatives: ComparisonAlternatives = {
    formalSequential: {
      workflowDesign: formalWorkflow,
      contractDesign: contractDesign(
        seed.contractValue,
        assumptionId,
        seed.pathCompetitionDiffers,
        "formalSequential"
      ),
    },
    adaptiveCompliant: {
      workflowDesign: adaptiveWorkflow,
      contractDesign: contractDesign(
        seed.contractValue,
        assumptionId,
        seed.pathCompetitionDiffers,
        "adaptiveCompliant"
      ),
    },
  };
  const roleHourlyRates = Object.fromEntries(
    Object.entries(seed.roleDailyRates).map(([roleId, rate]) => [
      roleId,
      retainedValue(rate / 8, assumptionId),
    ])
  );
  const dailyCostOfInaction = retainedStressValue(
    seed.dailyCostOfInaction,
    assumptionId
  );
  const zeroDifferential = retainedValue(0, assumptionId);
  const bypass: NonMonetizedContractDimension = {
    id: "informal_bypass",
    status: "notMonetized",
    reasonKey: "reasons.bypassNotMonetized",
    evidenceIds: [],
  };

  return {
    kind: "registry_scenario",
    id: seed.id,
    legacyAliases: [seed.legacyAlias],
    nameKey: `scenarios.${seed.id}.name`,
    descriptionKey: `scenarios.${seed.id}.description`,
    sourceUrl: SCENARIO_SOURCE_URL,
    source: sourceMetadata(seed.id),
    constructs: [...seed.constructs],
    assumptions: [
      {
        id: assumptionId,
        evidenceClass: "retained_legacy_assumption",
        sourceUrl: SCENARIO_SOURCE_URL,
        source: sourceMetadata(seed.id),
        labelKey: `scenarios.${seed.id}.assumptionLabel`,
        detailKey: `scenarios.${seed.id}.assumptionDetail`,
        constructs: [...seed.constructs],
      },
    ],
    evidenceIds: [...seed.evidenceIds],
    designIds: {
      workflow: {
        formalSequential: `${seed.id}.workflow.formalSequential` as WorkflowDesignIdV2,
        adaptiveCompliant: `${seed.id}.workflow.adaptiveCompliant` as WorkflowDesignIdV2,
      },
      contract: {
        formalSequential: `${seed.id}.contract.formalSequential` as ContractDesignIdV2,
        adaptiveCompliant: `${seed.id}.contract.adaptiveCompliant` as ContractDesignIdV2,
      },
    },
    context,
    economicAssumptions: {
      contractValue: retainedValue(seed.contractValue, assumptionId),
      dailyCostOfInaction,
      pathCompetitionDiffers: seed.pathCompetitionDiffers,
      competitionTransferRate: seed.pathCompetitionDiffers
        ? competitionRate()
        : null,
      amendmentDifferential: zeroDifferential,
      tcoDifferential: retainedValue(0, assumptionId),
      bypass,
    },
    calculationInput: {
      context,
      alternatives,
      roleHourlyRates,
      dailyCostOfInaction,
    },
  };
}

const DEFAULT_ROLE_RATES = {
  requestor: 900,
  buyer: 800,
  lawyer: 1_200,
  finance: 900,
  manager: 1_500,
  executive: 2_500,
};

const SCENARIO_SEEDS: ScenarioSeed[] = [
  {
    id: "fleet_tco_reframing",
    legacyAlias: "fleet",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_competitive",
      purchaseArchetypeId: "capital_investment",
      executionChannelId: "sourcing_event",
      systemSupportId: "transactional_erp",
    },
    contractValue: 5_000_000,
    dailyCostOfInaction: 5_000,
    roleDailyRates: DEFAULT_ROLE_RATES,
    retainedWorkflowTemplateId: "strategic_private_formal",
    pathCompetitionDiffers: true,
    evidenceIds: ["ec_innovation_procurement_guidance"],
    constructs: ["workflow_duration", "tco", "contract_adaptability"],
  },
  {
    id: "erp_transformation_discovery",
    legacyAlias: "erp",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_negotiated",
      purchaseArchetypeId: "incomplete_requirement",
      executionChannelId: "sourcing_event",
      systemSupportId: "sourcing_platform",
    },
    contractValue: 3_000_000,
    dailyCostOfInaction: 8_200,
    roleDailyRates: {
      requestor: 1_200,
      buyer: 1_200,
      lawyer: 1_500,
      finance: 1_000,
      manager: 1_800,
      executive: 3_000,
    },
    retainedWorkflowTemplateId: "strategic_private_formal",
    pathCompetitionDiffers: true,
    evidenceIds: [
      "california_modular_it_procurement",
      "oecd_rvul_problem_definition",
    ],
    constructs: [
      "workflow_duration",
      "problem_definition",
      "modular_contracting",
    ],
  },
  {
    id: "logistics_service_redesign",
    legacyAlias: "logistics",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_competitive",
      purchaseArchetypeId: "complex_service",
      executionChannelId: "sourcing_event",
      systemSupportId: "transactional_erp",
    },
    contractValue: 8_000_000,
    dailyCostOfInaction: 1_800,
    roleDailyRates: {
      requestor: 900,
      buyer: 900,
      lawyer: 1_300,
      finance: 1_000,
      manager: 1_600,
      executive: 2_800,
    },
    retainedWorkflowTemplateId: "strategic_private_formal",
    pathCompetitionDiffers: true,
    evidenceIds: ["ec_innovation_procurement_guidance"],
    constructs: ["workflow_duration", "contract_adaptability"],
  },
  {
    id: "critical_material_continuity",
    legacyAlias: "production",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_negotiated",
      purchaseArchetypeId: "continuity_critical",
      executionChannelId: "sourcing_event",
      systemSupportId: "manual",
    },
    contractValue: 12_000_000,
    dailyCostOfInaction: 50_000,
    roleDailyRates: {
      requestor: 800,
      buyer: 700,
      lawyer: 1_200,
      finance: 800,
      manager: 1_400,
      executive: 2_500,
    },
    retainedWorkflowTemplateId: "strategic_private_formal",
    pathCompetitionDiffers: true,
    evidenceIds: [],
    constructs: ["workflow_duration", "contract_adaptability"],
  },
  {
    id: "public_it_open_with_market_consultation",
    legacyAlias: "pipe_vs_field",
    context: {
      boundaryId: "pzp_classic_eu",
      procedureFamilyId: "pzp_open",
      purchaseArchetypeId: "incomplete_requirement",
      executionChannelId: "sourcing_event",
      systemSupportId: "transactional_erp",
      buyerRegime: "classic",
      procurementObject: "supplies_services",
      communicationMethod: "electronic",
    },
    contractValue: 5_000_000,
    dailyCostOfInaction: 10_000,
    roleDailyRates: { ...DEFAULT_ROLE_RATES, buyer: 900, lawyer: 1_300 },
    retainedWorkflowTemplateId: "pzp_open",
    pathCompetitionDiffers: true,
    evidenceIds: [
      "oecd_rvul_problem_definition",
      "uzp_preliminary_market_consultation",
      "ec_innovation_procurement_guidance",
    ],
    constructs: [
      "workflow_duration",
      "problem_definition",
      "market_consultation",
      "innovation_procurement",
    ],
  },
  {
    id: "stable_private_standard_service",
    legacyAlias: "governance_control",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_competitive",
      purchaseArchetypeId: "standardized_recurring",
      executionChannelId: "sourcing_event",
      systemSupportId: "integrated_source_to_pay",
    },
    contractValue: 5_000_000,
    dailyCostOfInaction: 0,
    roleDailyRates: DEFAULT_ROLE_RATES,
    retainedWorkflowTemplateId: "policy_control",
    pathCompetitionDiffers: true,
    evidenceIds: [COMPETITION_EVIDENCE_ID],
    constructs: ["workflow_duration", "competition_transfer"],
  },
  {
    id: "stable_capex_replacement",
    legacyAlias: "capex_investment",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_competitive",
      purchaseArchetypeId: "capital_investment",
      executionChannelId: "sourcing_event",
      systemSupportId: "transactional_erp",
    },
    contractValue: 15_000_000,
    dailyCostOfInaction: 13_700,
    roleDailyRates: {
      requestor: 1_000,
      buyer: 900,
      lawyer: 1_500,
      finance: 1_000,
      manager: 1_600,
      executive: 3_000,
    },
    retainedWorkflowTemplateId: "capex_replacement",
    pathCompetitionDiffers: true,
    evidenceIds: ["ec_innovation_procurement_guidance"],
    constructs: ["workflow_duration", "tco", "contract_amendment"],
  },
  {
    id: "discovery_solution_codesign",
    legacyAlias: "discovery_rd",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "private_negotiated",
      purchaseArchetypeId: "incomplete_requirement",
      executionChannelId: "sourcing_event",
      systemSupportId: "transactional_erp",
    },
    contractValue: 3_000_000,
    dailyCostOfInaction: 5_500,
    roleDailyRates: {
      requestor: 900,
      buyer: 900,
      lawyer: 1_300,
      finance: 1_000,
      manager: 1_600,
      executive: 2_800,
    },
    retainedWorkflowTemplateId: "discovery_codesign",
    pathCompetitionDiffers: true,
    evidenceIds: [
      "oecd_rvul_problem_definition",
      "ec_innovation_procurement_guidance",
    ],
    constructs: ["workflow_duration", "problem_definition", "role_effort"],
  },
  {
    id: "catalog_calloff_control",
    legacyAlias: "catalog",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "framework_calloff",
      purchaseArchetypeId: "standardized_recurring",
      executionChannelId: "catalog_calloff",
      systemSupportId: "integrated_source_to_pay",
    },
    contractValue: 50_000,
    dailyCostOfInaction: 500,
    roleDailyRates: { ...DEFAULT_ROLE_RATES, requestor: 800 },
    retainedWorkflowTemplateId: "catalog_calloff",
    pathCompetitionDiffers: false,
    evidenceIds: [],
    constructs: ["workflow_duration"],
  },
  {
    id: "mrp_release_control",
    legacyAlias: "mrp",
    context: {
      boundaryId: "private_policy",
      procedureFamilyId: "framework_calloff",
      purchaseArchetypeId: "continuity_critical",
      executionChannelId: "mrp_release",
      systemSupportId: "integrated_source_to_pay",
    },
    contractValue: 500_000,
    dailyCostOfInaction: 8_000,
    roleDailyRates: { ...DEFAULT_ROLE_RATES, requestor: 800 },
    retainedWorkflowTemplateId: "mrp_release",
    pathCompetitionDiffers: false,
    evidenceIds: [],
    constructs: ["workflow_duration"],
  },
];

export const SCENARIOS_V2: readonly ScenarioV2[] = deepFreeze(
  SCENARIO_SEEDS.map(buildScenario)
);

export const LEGACY_SCENARIO_ALIASES = deepFreeze(
  Object.fromEntries(
    SCENARIOS_V2.map((scenario) => [scenario.legacyAliases[0], scenario.id])
  ) as Record<string, ScenarioV2Id>
);

export function scenarioV2ById(id: string): ScenarioV2 | undefined {
  return SCENARIOS_V2.find((scenario) => scenario.id === id);
}

export function createScenarioDraft(id: ScenarioV2Id): ScenarioDraft {
  const scenario = scenarioV2ById(id);
  if (!scenario) throw new Error(`Unknown model 2.3 scenario: ${id}`);

  const input = structuredClone(scenario.calculationInput);
  const economicAssumptions = structuredClone(scenario.economicAssumptions);
  return {
    kind: "user_draft",
    derivedFromScenarioId: id,
    designIds: structuredClone(scenario.designIds),
    ...input,
    context: structuredClone(scenario.context),
    dailyCostOfInaction: structuredClone(
      economicAssumptions.dailyCostOfInaction
    ),
    economicAssumptions,
  };
}
