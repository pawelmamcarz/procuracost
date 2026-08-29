import { LockKeyhole, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AlternativeId } from "@/lib/model-v2";

import { ProcessStepNode } from "./ProcessStepNode";
import type {
  ProcessRailLaneViewModel,
  ProcessRailViewModel,
} from "./rail-view-model";
import { PROCESS_RAIL_GEOMETRY } from "./rail-view-model";

type ProcessRailProps =
  | {
      viewModel: ProcessRailViewModel;
      mode: "read-only";
      idPrefix?: string;
    }
  | {
      viewModel: ProcessRailViewModel;
      mode: "editable";
      onSelectStep: (alternativeId: AlternativeId, stepId: string) => void;
      onAddStep: (alternativeId: AlternativeId) => void;
    };

const LANE_ORDER: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function laneRule(alternativeId: AlternativeId): string {
  return alternativeId === "formalSequential"
    ? "border-red-500"
    : "border-green-500";
}

function connectorTone(
  alternativeId: AlternativeId,
  critical: boolean
): string {
  if (!critical) return "text-gray-300";
  return alternativeId === "formalSequential"
    ? "text-red-500"
    : "text-green-500";
}

function DesktopLane({
  lane,
  props,
}: {
  lane: ProcessRailLaneViewModel;
  props: ProcessRailProps;
}) {
  return (
    <div className="hidden lg:block">
      <div
        aria-label={lane.viewportLabel}
        className="overflow-x-auto border-y border-gray-200 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        role="region"
        tabIndex={0}
      >
        <div
          className="relative"
          style={{ height: lane.canvasHeight, width: lane.canvasWidth }}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            focusable="false"
            height={lane.canvasHeight}
            viewBox={`0 0 ${lane.canvasWidth} ${lane.canvasHeight}`}
            width={lane.canvasWidth}
          >
            {lane.connectors.map((connector) => (
              <path
                className={cn(
                  "fill-none stroke-current",
                  connectorTone(lane.alternativeId, connector.critical)
                )}
                d={connector.path}
                key={`${connector.fromStepId}-${connector.toStepId}`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={connector.critical ? 4 : 1.5}
              />
            ))}
          </svg>
          <div
            className="absolute top-8 flex items-center gap-2 font-mono text-[11px] text-gray-500"
            style={{ left: lane.startX }}
          >
            <span className="h-2.5 w-2.5 rounded-full border-2 border-gray-400 bg-white" />
            {lane.startLabel}
          </div>
          {lane.nodes.map((node) => (
            <div
              className="absolute"
              data-branch={node.branchIndex}
              data-depth={node.depth}
              key={node.stepId}
              style={{
                left: node.x,
                top: node.y,
                width: PROCESS_RAIL_GEOMETRY.nodeWidth,
              }}
            >
              <ProcessStepNode
                alternativeId={lane.alternativeId}
                idPrefix={props.mode === "read-only" ? props.idPrefix : undefined}
                inspectorId={props.viewModel.inspectorId}
                mode={props.mode}
                node={node}
                onSelect={
                  props.mode === "editable"
                    ? () =>
                        props.onSelectStep(lane.alternativeId, node.stepId)
                    : undefined
                }
              />
            </div>
          ))}
          <div
            className="absolute top-8 flex items-center gap-2 font-mono text-[11px] text-gray-500"
            style={{ left: lane.outcomeX }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
            {lane.outcomeLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLane({
  lane,
  props,
}: {
  lane: ProcessRailLaneViewModel;
  props: ProcessRailProps;
}) {
  return (
    <div
      className={cn("space-y-3 border-l-2 pl-3 lg:hidden", laneRule(lane.alternativeId))}
      data-mobile-sequence="true"
    >
      <p className="font-mono text-[11px] text-gray-500">{lane.startLabel}</p>
      {lane.mobileSequence.map((node) => (
        <div className="space-y-2" key={node.stepId}>
          {node.parallel && node.branchIndex === 0 ? (
            <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <span aria-hidden="true">↳</span>
              {lane.splitLabel}
            </p>
          ) : null}
          {node.merge ? (
            <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <span aria-hidden="true">↲</span>
              {lane.mergeLabel}
            </p>
          ) : null}
          <ProcessStepNode
            alternativeId={lane.alternativeId}
            focusIdSuffix="-mobile"
            idPrefix={props.mode === "read-only" ? props.idPrefix : undefined}
            inspectorId={props.viewModel.inspectorId}
            mobile
            mode={props.mode}
            node={node}
            onSelect={
              props.mode === "editable"
                ? () => props.onSelectStep(lane.alternativeId, node.stepId)
                : undefined
            }
          />
          <p className="pl-3 text-xs text-gray-600">
            <span className="font-medium">{lane.predecessorsLabel}: </span>
            {node.predecessorNames.length
              ? node.predecessorNames.join(", ")
              : "−"}
          </p>
        </div>
      ))}
      <p className="font-mono text-[11px] text-gray-500">{lane.outcomeLabel}</p>
    </div>
  );
}

function Lane({ lane, props }: { lane: ProcessRailLaneViewModel; props: ProcessRailProps }) {
  return (
    <section aria-label={lane.label} className="border-t border-gray-200 py-5">
      <div className="grid gap-4 lg:grid-cols-[9rem_minmax(0,1fr)] lg:items-start">
        <div className={cn("border-l-2 pl-3", laneRule(lane.alternativeId))}>
          <h3 className="text-sm font-semibold leading-snug text-gray-900">
            {lane.label}
          </h3>
          {props.mode === "editable" ? (
            <button
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              id={`process-lane-add-${lane.alternativeId}`}
              onClick={() => props.onAddStep(lane.alternativeId)}
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              {lane.addStepLabel}
            </button>
          ) : null}
        </div>
        <DesktopLane lane={lane} props={props} />
        <div className="lg:hidden">
          <MobileLane lane={lane} props={props} />
        </div>
      </div>
    </section>
  );
}

export function ProcessRail(props: ProcessRailProps) {
  return (
    <div className="relative" data-boundary-geometry="chamfered">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        <path
          className="fill-amber-50/30 stroke-amber-400"
          d="M 26 1 H 968 L 999 18 V 82 L 968 99 H 26 L 1 82 V 18 Z"
          data-boundary-outline="shared"
          strokeLinejoin="round"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle className="fill-amber-500" cx="26" cy="1" r="2.5" />
        <circle className="fill-amber-500" cx="999" cy="18" r="2.5" />
        <circle className="fill-amber-500" cx="968" cy="99" r="2.5" />
        <circle className="fill-amber-500" cx="1" cy="82" r="2.5" />
      </svg>
      <div className="relative px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3 py-3 text-amber-900">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 rotate-45 items-center justify-center border border-amber-500 bg-amber-50"
          >
            <LockKeyhole className="h-4 w-4 -rotate-45" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide">
            {props.viewModel.boundaryLabel}
          </p>
        </div>
        {LANE_ORDER.map((alternativeId) => (
          <Lane
            key={alternativeId}
            lane={props.viewModel.lanes[alternativeId]}
            props={props}
          />
        ))}
      </div>
    </div>
  );
}
