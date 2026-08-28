import { calculatorV2T, modelV2T, type Lang } from "@/lib/i18n";
import type {
  AlternativeId,
  ProcessMapStep,
  WorkflowDesign,
} from "@/lib/model-v2";

import {
  deriveRailLayout,
  type RailLayoutConnector,
  type RailLayoutNode,
  type RailStepTextData,
} from "./rail-layout";

export const PROCESS_RAIL_GEOMETRY = {
  startOffset: 72,
  depthColumn: 160,
  branchRow: 112,
  nodeWidth: 136,
  nodeMinHeight: 88,
  endOffset: 104,
} as const;

export interface ProcessRailNodeViewModel extends RailLayoutNode {
  position: number;
  activeCentral: string;
  queueCentral: string;
  elapsedCentral: string;
  timingSummary: string;
  parallelText: string | null;
  predecessorSummary: string;
  x: number;
  y: number;
}

export interface ProcessRailConnectorViewModel extends RailLayoutConnector {
  path: string;
}

export interface ProcessRailLaneViewModel {
  alternativeId: AlternativeId;
  label: string;
  viewportLabel: string;
  addStepLabel: string;
  startLabel: string;
  outcomeLabel: string;
  splitLabel: string;
  mergeLabel: string;
  predecessorsLabel: string;
  nodes: ProcessRailNodeViewModel[];
  mobileSequence: ProcessRailNodeViewModel[];
  connectors: ProcessRailConnectorViewModel[];
  canvasWidth: number;
  canvasHeight: number;
  startX: number;
  outcomeX: number;
}

export interface ProcessRailViewModel {
  boundaryLabel: string;
  inspectorId: "process-step-inspector";
  lanes: Record<AlternativeId, ProcessRailLaneViewModel>;
}

export interface BuildProcessRailViewModelOptions {
  lang: Lang;
  workflows: Record<AlternativeId, WorkflowDesign>;
  selectedAlternative: AlternativeId;
  selectedStepId: string | null;
  criticalPathStepIds: Record<AlternativeId, readonly string[]>;
  invalidStepIds: Record<AlternativeId, readonly string[]>;
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function lookupString(value: unknown, segments: readonly string[]): string | null {
  let cursor: unknown = value;
  for (const segment of segments) {
    if (typeof cursor !== "object" || cursor === null || !(segment in cursor)) {
      return null;
    }
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return typeof cursor === "string" ? cursor : null;
}

export function resolveProcessStepLabel(
  step: Pick<ProcessMapStep, "labelKey" | "userLabel">,
  lang: Lang
): string {
  if (step.userLabel?.trim()) return step.userLabel.trim();
  const translated = lookupString(modelV2T[lang], step.labelKey.split("."));
  return translated ?? calculatorV2T[lang].rail.unnamedStep;
}

function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 2,
  }).format(value);
}

function textByStepId(
  workflow: WorkflowDesign,
  alternativeId: AlternativeId,
  lang: Lang,
  selected: boolean,
  selectedStepId: string | null,
  criticalPathStepIds: readonly string[],
  invalidStepIds: readonly string[]
): Record<string, RailStepTextData> {
  const tx = calculatorV2T[lang];
  const labelById = new Map(
    workflow.steps.map((step) => [step.id, resolveProcessStepLabel(step, lang)])
  );
  const critical = new Set(criticalPathStepIds);
  const invalid = new Set(invalidStepIds);

  return Object.fromEntries(
    workflow.steps.map((step, index) => {
      const predecessorNames = step.predecessorIds.map(
        (id) => labelById.get(id) ?? tx.rail.unknownPredecessor
      );
      const statuses = [
        critical.has(step.id) ? tx.rail.criticalPath : null,
        step.lockedLegalProvenance ? tx.rail.lockedLegalWait : null,
        invalid.has(step.id) ? tx.rail.needsCorrection : null,
        selected && selectedStepId === step.id ? tx.rail.selected : null,
      ].filter((value): value is string => value !== null);
      const active = formatNumber(step.activeDays.central, lang);
      const queue = formatNumber(step.queueDays.central, lang);
      const predecessors = predecessorNames.length
        ? predecessorNames.join(", ")
        : tx.rail.noPredecessor;
      const label = labelById.get(step.id) ?? tx.rail.unnamedStep;
      return [
        step.id,
        {
          label,
          predecessorNames,
          lockText: step.lockedLegalProvenance
            ? tx.rail.lockedLegalWait
            : null,
          criticalText: critical.has(step.id) ? tx.rail.criticalPath : null,
          invalidText: invalid.has(step.id) ? tx.rail.needsCorrection : null,
          selectedText:
            selected && selectedStepId === step.id ? tx.rail.selected : null,
          accessibleName: tx.rail.accessibleNode(
            tx.alternatives[alternativeId],
            index + 1,
            label,
            statuses.join(", "),
            active,
            queue,
            predecessors
          ),
        },
      ];
    })
  );
}

function connectorPath(
  connector: RailLayoutConnector,
  nodes: Map<string, ProcessRailNodeViewModel>
): string {
  const from = nodes.get(connector.fromStepId);
  const to = nodes.get(connector.toStepId);
  if (!from || !to) return "";
  const startX = from.x + PROCESS_RAIL_GEOMETRY.nodeWidth;
  const startY = from.y + PROCESS_RAIL_GEOMETRY.nodeMinHeight / 2;
  const endX = to.x;
  const endY = to.y + PROCESS_RAIL_GEOMETRY.nodeMinHeight / 2;
  const midpoint = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} H ${midpoint} V ${endY} H ${endX}`;
}

function buildLane(
  options: BuildProcessRailViewModelOptions,
  alternativeId: AlternativeId
): ProcessRailLaneViewModel {
  const { lang } = options;
  const tx = calculatorV2T[lang];
  const workflow = options.workflows[alternativeId];
  const layout = deriveRailLayout(workflow, {
    textByStepId: textByStepId(
      workflow,
      alternativeId,
      lang,
      options.selectedAlternative === alternativeId,
      options.selectedStepId,
      options.criticalPathStepIds[alternativeId],
      options.invalidStepIds[alternativeId]
    ),
    selectedStepId:
      options.selectedAlternative === alternativeId
        ? options.selectedStepId
        : null,
    criticalPathStepIds: options.criticalPathStepIds[alternativeId],
    invalidStepIds: options.invalidStepIds[alternativeId],
  });
  const nodes = layout.nodes.map((node, index): ProcessRailNodeViewModel => {
    const activeCentral = formatNumber(
      workflow.steps.find(({ id }) => id === node.stepId)!.activeDays.central,
      lang
    );
    const queueCentral = formatNumber(
      workflow.steps.find(({ id }) => id === node.stepId)!.queueDays.central,
      lang
    );
    const elapsedCentral = formatNumber(
      workflow.steps.find(({ id }) => id === node.stepId)!.activeDays.central +
        workflow.steps.find(({ id }) => id === node.stepId)!.queueDays.central,
      lang
    );
    return {
      ...node,
      position: index + 1,
      activeCentral,
      queueCentral,
      elapsedCentral,
      timingSummary: tx.rail.timingSummary(
        activeCentral,
        queueCentral,
        elapsedCentral
      ),
      parallelText: node.parallel ? tx.rail.parallelBranch : null,
      predecessorSummary: `${tx.rail.predecessors}: ${
        node.predecessorNames.length
          ? node.predecessorNames.join(", ")
          : tx.rail.noPredecessor
      }`,
      x:
        PROCESS_RAIL_GEOMETRY.startOffset +
        node.depth * PROCESS_RAIL_GEOMETRY.depthColumn,
      y: node.branchIndex * PROCESS_RAIL_GEOMETRY.branchRow,
    };
  });
  const nodeMap = new Map(nodes.map((node) => [node.stepId, node]));
  const maxDepth = Math.max(0, ...nodes.map(({ depth }) => depth));
  const maxBranchCount = Math.max(1, ...nodes.map(({ branchCount }) => branchCount));
  const outcomeX =
    PROCESS_RAIL_GEOMETRY.startOffset +
    (maxDepth + 1) * PROCESS_RAIL_GEOMETRY.depthColumn;
  const canvasWidth = outcomeX + PROCESS_RAIL_GEOMETRY.endOffset;
  const canvasHeight = Math.max(
    PROCESS_RAIL_GEOMETRY.nodeMinHeight + 24,
    (maxBranchCount - 1) * PROCESS_RAIL_GEOMETRY.branchRow +
      PROCESS_RAIL_GEOMETRY.nodeMinHeight +
      24
  );

  return {
    alternativeId,
    label: tx.alternatives[alternativeId],
    viewportLabel: tx.rail.graphRegion(tx.alternatives[alternativeId]),
    addStepLabel: tx.rail.addStep,
    startLabel: tx.rail.start,
    outcomeLabel: tx.rail.outcome,
    splitLabel: tx.rail.split,
    mergeLabel: tx.rail.merge,
    predecessorsLabel: tx.rail.predecessors,
    nodes,
    mobileSequence: nodes,
    connectors: layout.connectors.map((connector) => ({
      ...connector,
      path: connectorPath(connector, nodeMap),
    })),
    canvasWidth,
    canvasHeight,
    startX: 8,
    outcomeX,
  };
}

export function buildProcessRailViewModel(
  options: BuildProcessRailViewModelOptions
): ProcessRailViewModel {
  return {
    boundaryLabel: calculatorV2T[options.lang].rail.boundary,
    inspectorId: "process-step-inspector",
    lanes: Object.fromEntries(
      ALTERNATIVE_IDS.map((alternativeId) => [
        alternativeId,
        buildLane(options, alternativeId),
      ])
    ) as Record<AlternativeId, ProcessRailLaneViewModel>,
  };
}
