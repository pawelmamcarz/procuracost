import { useMemo } from "react";
import {
  ProcurementInputs,
  formatPLN,
  calculateMatrix,
  MatrixCell,
  TechLevelId,
  getDimensionMultiplierDetails,
} from "@/lib/calculations";
import { comparisonT, dimensionMultiplierLabelsT, Lang } from "@/lib/i18n";
import { TECH_LEVELS } from "@/lib/process-templates";

interface Props {
  inputs: ProcurementInputs;
  lang: Lang;
}

const TECH_LEVEL_IDS: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];

function matrixColor(cost: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (cost - min) / (max - min);
  // green (low cost) → yellow → red (high cost)
  if (ratio < 0.5) {
    const g = Math.round(200 + ratio * 2 * 55);
    return `rgb(${Math.round(ratio * 2 * 255)}, ${g}, 60)`;
  }
  const r = 255;
  const g = Math.round(200 - (ratio - 0.5) * 2 * 180);
  return `rgb(${r}, ${Math.max(20, g)}, 40)`;
}

export default function CostMatrix({ inputs, lang }: Props) {
  const tx = comparisonT[lang];
  const matrix = useMemo(() => calculateMatrix(inputs), [inputs]);
  const allCosts = matrix.map((c) => c.totalCost);
  const minCost = Math.min(...allCosts);
  const maxCost = Math.max(...allCosts);

  function getCell(tl: TechLevelId, mode: "rigid" | "flexible"): MatrixCell {
    return matrix.find((c) => c.techLevel === tl && c.processMode === mode)!;
  }

  return (
    <>
      <div>
        <h3 className="mb-1.5 text-sm font-semibold text-gray-700">{tx.matrixTitle}</h3>
        {(inputs.spendType || inputs.processPhase) ? (
          <div className="mb-2 rounded-md bg-blue-50 border border-blue-100 px-2.5 py-1.5 text-[11px] text-blue-700">
            <span className="font-medium">{tx.matrixContextLabel}</span>{" "}
            <span className="font-semibold">
              {inputs.spendType === "direct" ? tx.matrixContextDirect : inputs.spendType === "indirect" ? tx.matrixContextIndirect : ""}
              {inputs.spendType && inputs.processPhase ? " × " : ""}
              {inputs.processPhase === "upstream" ? tx.matrixContextUpstream : inputs.processPhase === "downstream" ? tx.matrixContextDownstream : ""}
            </span>
            <span className="ml-1 text-blue-600/70">— {tx.matrixContextDetail}</span>
          </div>
        ) : (
          <p className="mb-2 text-[10px] text-gray-500">{tx.matrixNoContextNote}</p>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">{tx.matrixTechLabel}</th>
                <th className="px-3 py-2 text-center font-medium text-red-400" colSpan={2}>{tx.matrixRigid}</th>
                <th className="px-3 py-2 text-center font-medium text-green-500" colSpan={2}>{tx.matrixFlexible}</th>
              </tr>
              <tr className="bg-gray-50 text-gray-400">
                <th />
                <th className="px-3 py-1 text-right">{tx.matrixTotalCost}</th>
                <th className="px-3 py-1 text-right">{tx.matrixDays}</th>
                <th className="px-3 py-1 text-right">{tx.matrixTotalCost}</th>
                <th className="px-3 py-1 text-right">{tx.matrixDays}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TECH_LEVEL_IDS.map((tl) => {
                const rigidCell = getCell(tl, "rigid");
                const flexCell = getCell(tl, "flexible");
                const isActive = tl === inputs.techLevel;
                return (
                  <tr key={tl} className={isActive ? "ring-1 ring-inset ring-blue-300 bg-blue-50" : "hover:bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {lang === "en" ? TECH_LEVELS[tl].nameEn : TECH_LEVELS[tl].name}
                      {isActive && (
                        <span className="ml-1.5 rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-600">
                          {lang === "en" ? "current" : "aktualne"}
                        </span>
                      )}
                    </td>
                    <td
                      className="px-3 py-2 text-right font-semibold tabular-nums"
                      style={{ color: matrixColor(rigidCell.totalCost, minCost, maxCost) }}
                    >
                      {formatPLN(rigidCell.totalCost)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-400 tabular-nums">{rigidCell.days}</td>
                    <td
                      className="px-3 py-2 text-right font-semibold tabular-nums"
                      style={{ color: matrixColor(flexCell.totalCost, minCost, maxCost) }}
                    >
                      {formatPLN(flexCell.totalCost)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-400 tabular-nums">{flexCell.days}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">{tx.matrixColorLegend}</p>
      </div>

      {(inputs.spendType || inputs.processPhase) && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-[11px]">
          <div className="mb-1 font-medium text-blue-800">{tx.appliedMultipliersTitle}</div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-blue-700 tabular-nums">
            {getDimensionMultiplierDetails(inputs.spendType, inputs.processPhase).map((d) => (
              <span key={d.key}>
                {dimensionMultiplierLabelsT[lang][d.key]}: <span className="font-semibold">{d.value.toFixed(2)}x</span>
              </span>
            ))}
          </div>
          <div className="mt-1 text-[10px] text-blue-600/70">{tx.appliedMultipliersNote}</div>
        </div>
      )}
    </>
  );
}
