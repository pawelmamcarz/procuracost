import { FileLock2 } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import type { AlternativeId } from "@/lib/model-v2";

import { deriveDesignProvenance } from "./design-provenance";
import type { CalculatorWorkspaceState } from "./editor-state";

export interface AlternativeDesignControlsProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export function AlternativeDesignControls({
  lang,
  state,
}: AlternativeDesignControlsProps) {
  const tx = calculatorV2T[lang];
  const provenance = deriveDesignProvenance(state);
  return (
    <section aria-labelledby="base-design-provenance-heading">
      <div className="flex items-start gap-3">
        <FileLock2
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
        />
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            id="base-design-provenance-heading"
          >
            {tx.workspace.baseDesignProvenance}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {tx.workspace.designNarrowing}
          </p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
        {ALTERNATIVE_IDS.map((alternativeId) => {
          const lane = provenance.lanes[alternativeId];
          return (
            <fieldset className="py-4" key={alternativeId}>
              <legend className="text-sm font-semibold text-gray-900">
                {tx.alternatives[alternativeId]}
              </legend>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-gray-600">
                    {tx.workspace.workflowDesign}
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-gray-900">
                    {lane.selectedWorkflowId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-600">
                    {tx.workspace.contractDesign}
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-gray-900">
                    {lane.selectedContractId}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs font-medium text-gray-600">
                {lane.locallyEdited
                  ? tx.workspace.locallyEdited
                  : tx.workspace.unchangedFromBase}
              </p>
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}
