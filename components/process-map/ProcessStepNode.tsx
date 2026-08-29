import {
  CircleAlert,
  GitBranch,
  LockKeyhole,
  Route,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AlternativeId } from "@/lib/model-v2";

import type { ProcessRailNodeViewModel } from "./rail-view-model";

interface ProcessStepNodeProps {
  alternativeId: AlternativeId;
  node: ProcessRailNodeViewModel;
  inspectorId: string;
  mode: "editable" | "read-only";
  mobile?: boolean;
  focusIdSuffix?: string;
  idPrefix?: string;
  onSelect?: () => void;
}

function statusRows(node: ProcessRailNodeViewModel) {
  return [
    node.criticalText
      ? { text: node.criticalText, Icon: Route, tone: "text-gray-700" }
      : null,
    node.parallelText
      ? { text: node.parallelText, Icon: GitBranch, tone: "text-gray-600" }
      : null,
    node.lockText
      ? { text: node.lockText, Icon: LockKeyhole, tone: "text-amber-700" }
      : null,
    node.invalidText
      ? { text: node.invalidText, Icon: CircleAlert, tone: "text-amber-700" }
      : null,
  ].filter((status): status is NonNullable<typeof status> => status !== null);
}

function markerTone(alternativeId: AlternativeId): string {
  return alternativeId === "formalSequential"
    ? "border-red-500"
    : "border-green-500";
}

export function ProcessStepNode({
  alternativeId,
  node,
  inspectorId,
  mode,
  mobile = false,
  focusIdSuffix = "",
  idPrefix,
  onSelect,
}: ProcessStepNodeProps) {
  const rows = statusRows(node);
  const className = cn(
    "relative isolate flex min-h-[88px] w-full flex-col gap-1 border-0 border-b border-gray-200 bg-gray-50/90 px-3 pb-3 pt-4 text-left text-gray-900",
    "[clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    node.selected && "border-b-blue-500 bg-blue-50",
    node.locked && "border-l-4 border-l-amber-400",
    node.invalid && !node.locked && "border-l-4 border-l-amber-400",
    node.critical &&
      alternativeId === "formalSequential" &&
      "border-t-[3px] border-t-red-500",
    node.critical &&
      alternativeId === "adaptiveCompliant" &&
      "border-t-[3px] border-t-green-500",
    mobile && node.parallel && "ml-4 w-[calc(100%-1rem)]"
  );
  const domId = `${idPrefix ? `${idPrefix}-` : ""}process-step-${alternativeId}-${node.stepId}${focusIdSuffix}`;
  const content = (
    <>
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-3 w-3 shrink-0 rotate-45 items-center justify-center border-2 bg-white",
            markerTone(alternativeId)
          )}
          data-node-marker="diamond"
        >
          <span className="h-1 w-1 bg-gray-700" />
        </span>
        <span className="font-mono text-[11px] text-gray-500">
          {String(node.position).padStart(2, "0")}
        </span>
      </span>
      <span className="break-words text-sm font-semibold leading-snug">
        {node.label}
      </span>
      {node.timingSummary ? (
        <span className="font-mono text-[11px] leading-relaxed text-gray-600">
          {node.timingSummary}
        </span>
      ) : null}
      {rows.map(({ text, Icon, tone }) => (
        <span
          className={cn("flex items-center gap-1 text-[11px] font-medium", tone)}
          key={text}
        >
          <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {text}
        </span>
      ))}
      {node.selectedText ? (
        <span className="text-[11px] font-medium text-blue-700">
          {node.selectedText}
        </span>
      ) : null}
      <span className={mobile ? "text-xs text-gray-600" : "sr-only"}>
        {node.predecessorSummary}
      </span>
    </>
  );

  if (mode === "read-only") {
    return (
      <article
        aria-label={node.accessibleName}
        className={className}
        data-node-geometry="instrument"
        id={domId}
        tabIndex={0}
      >
        {content}
      </article>
    );
  }
  return (
    <button
      aria-controls={inspectorId}
      aria-label={node.accessibleName}
      aria-pressed={node.selected}
      className={className}
      data-node-geometry="instrument"
      data-alternative={alternativeId}
      data-step-id={node.stepId}
      id={domId}
      onClick={onSelect}
      type="button"
    >
      {content}
    </button>
  );
}
