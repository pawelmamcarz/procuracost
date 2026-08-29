import type {
  AlternativeId,
  ComparisonAlternatives,
  ContractDesign,
  ModelContextV2,
  WorkflowDesign,
} from "./domain";
import { resolveLegalWaits } from "./legal";
import {
  assertValidProcessMap,
  createLockedLegalWaitStep,
} from "./process-map";
import {
  SCENARIOS_V2,
  type ContractDesignIdV2,
  type ScenarioV2Id,
  type WorkflowDesignIdV2,
} from "./scenarios";

export interface WorkflowDesignRegistryEntry {
  id: WorkflowDesignIdV2;
  scenarioId: ScenarioV2Id;
  alternativeId: AlternativeId;
}

export interface ContractDesignRegistryEntry {
  id: ContractDesignIdV2;
  scenarioId: ScenarioV2Id;
  alternativeId: AlternativeId;
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export const WORKFLOW_DESIGN_REGISTRY: readonly WorkflowDesignRegistryEntry[] =
  Object.freeze(
    SCENARIOS_V2.flatMap((scenario) =>
      ALTERNATIVE_IDS.map((alternativeId) =>
        Object.freeze({
          id: scenario.designIds.workflow[alternativeId],
          scenarioId: scenario.id,
          alternativeId,
        })
      )
    )
  );

export const CONTRACT_DESIGN_REGISTRY: readonly ContractDesignRegistryEntry[] =
  Object.freeze(
    SCENARIOS_V2.flatMap((scenario) =>
      ALTERNATIVE_IDS.map((alternativeId) =>
        Object.freeze({
          id: scenario.designIds.contract[alternativeId],
          scenarioId: scenario.id,
          alternativeId,
        })
      )
    )
  );

function assertCompatibleDesign(
  kind: "workflow" | "contract",
  entry: WorkflowDesignRegistryEntry | ContractDesignRegistryEntry | undefined,
  scenarioId: ScenarioV2Id,
  alternativeId: AlternativeId
): asserts entry is WorkflowDesignRegistryEntry | ContractDesignRegistryEntry {
  if (!entry) throw new Error(`Unknown model 2.3 ${kind} design`);
  if (entry.scenarioId !== scenarioId) {
    throw new Error(
      `Incompatible ${kind} design scenario ${entry.scenarioId}; expected ${scenarioId}`
    );
  }
  if (entry.alternativeId !== alternativeId) {
    throw new Error(
      `Incompatible ${kind} design alternative ${entry.alternativeId}; expected ${alternativeId}`
    );
  }
}

export function resolveWorkflowDesign(
  id: WorkflowDesignIdV2,
  scenarioId: ScenarioV2Id,
  alternativeId: AlternativeId
): WorkflowDesign {
  const entry = WORKFLOW_DESIGN_REGISTRY.find((candidate) => candidate.id === id);
  assertCompatibleDesign("workflow", entry, scenarioId, alternativeId);
  const scenario = SCENARIOS_V2.find(({ id: candidateId }) => candidateId === entry.scenarioId)!;
  return structuredClone(
    scenario.calculationInput.alternatives[entry.alternativeId].workflowDesign
  );
}

export function resolveContractDesign(
  id: ContractDesignIdV2,
  scenarioId: ScenarioV2Id,
  alternativeId: AlternativeId
): ContractDesign {
  const entry = CONTRACT_DESIGN_REGISTRY.find((candidate) => candidate.id === id);
  assertCompatibleDesign("contract", entry, scenarioId, alternativeId);
  const scenario = SCENARIOS_V2.find(({ id: candidateId }) => candidateId === entry.scenarioId)!;
  return structuredClone(
    scenario.calculationInput.alternatives[entry.alternativeId].contractDesign
  );
}

function reconcileWorkflowLegalWaits(
  workflow: WorkflowDesign,
  context: ModelContextV2
): WorkflowDesign {
  const expected = resolveLegalWaits(context);
  const currentIds = workflow.steps
    .filter(({ lockedLegalProvenance }) => lockedLegalProvenance !== undefined)
    .map(({ id }) => id);
  const expectedIds = expected.map(({ id }) => id);
  if (
    currentIds.length !== expectedIds.length ||
    currentIds.some((id, index) => id !== expectedIds[index])
  ) {
    throw new Error(
      "Incompatible locked legal wait shape; select a design compatible with the legal context"
    );
  }

  const expectedById = new Map(expected.map((wait) => [wait.id, wait] as const));
  const reconciled: WorkflowDesign = {
    steps: workflow.steps.map((step) => {
      if (!step.lockedLegalProvenance) return structuredClone(step);
      const wait = expectedById.get(step.id)!;
      const replacement = createLockedLegalWaitStep(wait, step.predecessorIds);
      replacement.labelKey = step.labelKey;
      replacement.userLabel = step.userLabel;
      return replacement;
    }),
  };
  assertValidProcessMap(reconciled, expected);
  return reconciled;
}

export function reconcileAlternativeLegalWaits(
  alternatives: ComparisonAlternatives,
  context: ModelContextV2
): ComparisonAlternatives {
  const reconciled = structuredClone(alternatives);
  for (const alternative of ALTERNATIVE_IDS) {
    reconciled[alternative].workflowDesign = reconcileWorkflowLegalWaits(
      alternatives[alternative].workflowDesign,
      context
    );
  }
  return reconciled;
}
