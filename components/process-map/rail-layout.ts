export interface RailTopologyStep {
  id: string;
  predecessorIds: readonly string[];
  locked?: boolean;
  lockedLegalProvenance?: unknown;
}

export interface RailTopology {
  steps: readonly RailTopologyStep[];
}

export interface RailStepTextData {
  label: string;
  predecessorNames: string[];
  lockText: string | null;
  criticalText: string | null;
  invalidText: string | null;
  selectedText: string | null;
  accessibleName: string;
}

export interface RailLayoutOptions {
  textByStepId: Record<string, RailStepTextData>;
  selectedStepId: string | null;
  criticalPathStepIds: readonly string[];
  invalidStepIds: readonly string[];
}

export interface RailLayoutNode extends RailStepTextData {
  stepId: string;
  predecessorIds: string[];
  depth: number;
  branchIndex: number;
  branchCount: number;
  parallel: boolean;
  merge: boolean;
  locked: boolean;
  critical: boolean;
  invalid: boolean;
  selected: boolean;
}

export interface RailLayoutConnector {
  fromStepId: string;
  toStepId: string;
  critical: boolean;
}

export interface RailLayout {
  nodes: RailLayoutNode[];
  mobileSequence: RailLayoutNode[];
  connectors: RailLayoutConnector[];
}

function stableTopologicalStepIds(workflow: RailTopology): string[] {
  const stepIds = workflow.steps.map(({ id }) => id);
  const knownIds = new Set(stepIds);
  const sourceIndex = new Map(stepIds.map((id, index) => [id, index]));
  const indegree = new Map<string, number>();
  const successors = new Map<string, string[]>();

  for (const step of workflow.steps) {
    const knownPredecessors = [
      ...new Set(step.predecessorIds.filter((id) => knownIds.has(id))),
    ];
    indegree.set(step.id, knownPredecessors.length);
    for (const predecessorId of knownPredecessors) {
      const current = successors.get(predecessorId) ?? [];
      current.push(step.id);
      successors.set(predecessorId, current);
    }
  }

  const ready = stepIds.filter((id) => indegree.get(id) === 0);
  const ordered: string[] = [];
  while (ready.length > 0) {
    const stepId = ready.shift()!;
    ordered.push(stepId);
    for (const successorId of successors.get(stepId) ?? []) {
      const remaining = (indegree.get(successorId) ?? 0) - 1;
      indegree.set(successorId, remaining);
      if (remaining === 0) {
        ready.push(successorId);
        ready.sort(
          (left, right) =>
            (sourceIndex.get(left) ?? 0) - (sourceIndex.get(right) ?? 0)
        );
      }
    }
  }

  const orderedSet = new Set(ordered);
  return [...ordered, ...stepIds.filter((id) => !orderedSet.has(id))];
}

export function deriveRailLayout(
  workflow: RailTopology,
  options: RailLayoutOptions
): RailLayout {
  const orderedIds = stableTopologicalStepIds(workflow);
  const knownIds = new Set(workflow.steps.map(({ id }) => id));
  const stepById = new Map(workflow.steps.map((step) => [step.id, step]));
  const criticalIds = new Set(options.criticalPathStepIds);
  const invalidIds = new Set(options.invalidStepIds);
  const criticalConnectors = new Set(
    options.criticalPathStepIds.slice(1).map(
      (stepId, index) =>
        `${options.criticalPathStepIds[index]}\u0000${stepId}`
    )
  );
  const depthById = new Map<string, number>();

  for (const stepId of orderedIds) {
    const step = stepById.get(stepId)!;
    const predecessorDepths = step.predecessorIds.flatMap((predecessorId) => {
      const depth = depthById.get(predecessorId);
      return depth === undefined ? [] : [depth];
    });
    depthById.set(
      stepId,
      predecessorDepths.length === 0 ? 0 : Math.max(...predecessorDepths) + 1
    );
  }

  const idsByDepth = new Map<number, string[]>();
  for (const stepId of orderedIds) {
    const depth = depthById.get(stepId)!;
    idsByDepth.set(depth, [...(idsByDepth.get(depth) ?? []), stepId]);
  }

  const nodes = orderedIds.map((stepId): RailLayoutNode => {
    const step = stepById.get(stepId)!;
    const text = options.textByStepId[stepId];
    if (!text) throw new Error(`Missing rail text for step ${stepId}`);
    const depth = depthById.get(stepId)!;
    const branchIds = idsByDepth.get(depth)!;
    const knownPredecessorCount = step.predecessorIds.filter((id) =>
      knownIds.has(id)
    ).length;

    return {
      ...text,
      predecessorNames: [...text.predecessorNames],
      stepId,
      predecessorIds: [...step.predecessorIds],
      depth,
      branchIndex: branchIds.indexOf(stepId),
      branchCount: branchIds.length,
      parallel: branchIds.length > 1,
      merge: knownPredecessorCount > 1,
      locked:
        step.locked === true || step.lockedLegalProvenance !== undefined,
      critical: criticalIds.has(stepId),
      invalid: invalidIds.has(stepId),
      selected: options.selectedStepId === stepId,
    };
  });

  const connectors = orderedIds.flatMap((toStepId) => {
    const step = stepById.get(toStepId)!;
    return step.predecessorIds
      .filter((fromStepId) => knownIds.has(fromStepId))
      .map((fromStepId): RailLayoutConnector => ({
        fromStepId,
        toStepId,
        critical: criticalConnectors.has(`${fromStepId}\u0000${toStepId}`),
      }));
  });

  return {
    nodes,
    mobileSequence: nodes,
    connectors,
  };
}
