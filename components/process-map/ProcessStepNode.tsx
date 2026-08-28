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
    "relative flex min-h-[88px] w-full flex-col gap-1 rounded-md border bg-white p-3 text-left text-gray-900",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    node.selected && "border-blue-500 bg-blue-50",
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
      <span className="font-mono text-[11px] text-gray-500">
        {String(node.position).padStart(2, "0")}
      </span>
      <span className="break-words text-sm font-semibold leading-snug">
        {node.label}
      </span>
      <span className="font-mono text-[11px] leading-relaxed text-gray-600">
        {node.timingSummary}
      </span>
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
