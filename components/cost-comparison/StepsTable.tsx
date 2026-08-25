import { ProcurementInputs } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";
import { deriveStepTimings, getSteps, TECH_LEVELS, PROCESS_TYPE_META } from "@/lib/process-templates";

interface Props {
  inputs: ProcurementInputs;
  rigidDays: number;
  flexibleDays: number;
  lang: Lang;
}

export default function StepsTable({ inputs, rigidDays, flexibleDays, lang }: Props) {
  const tx = comparisonT[lang];
  const steps = getSteps(inputs.processType, inputs.customSteps);
  const timing = deriveStepTimings(
    steps,
    TECH_LEVELS[inputs.techLevel].timeMultiplier,
    inputs.processPhase,
    inputs.spendType,
  );
  const formatDays = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

  const processLabel = inputs.processType !== "custom"
    ? (lang === "en" ? PROCESS_TYPE_META[inputs.processType].nameEn : PROCESS_TYPE_META[inputs.processType].name)
    : (lang === "en" ? "Custom" : "Własny");

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.stepsTitle}</h3>
      <p className="mb-3 text-xs text-gray-400">{processLabel}: {TECH_LEVELS[inputs.techLevel][lang === "en" ? "nameEn" : "name"]}</p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-500">
                {lang === "en" ? "Step" : "Krok"}
              </th>
              <th className="px-3 py-2 text-right font-medium text-red-400">{tx.stepsRigidDays}</th>
              <th className="px-3 py-2 text-right font-medium text-green-400">{tx.stepsFlexDays}</th>
              <th className="px-3 py-2 text-center font-medium text-gray-400">{tx.stepsMandatory}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-400 hidden sm:table-cell">{tx.stepsParticipants}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timing.steps.map(({ step, rigidDays: stepRigidDays, flexibleDays: stepFlexibleDays }) => (
              <tr key={step.id} className={step.mandatoryWait ? "bg-amber-50" : "hover:bg-gray-50"}>
                <td className="px-3 py-2 font-medium text-gray-700">
                  {lang === "en" ? step.nameEn : step.name}
                  {step.mandatoryWait && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-xs text-amber-600">
                      {lang === "en" ? "⚖ legal" : "⚖ prawo"}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-red-600">
                  {formatDays(stepRigidDays)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {stepFlexibleDays === null ? (
                    <span className="italic text-gray-300">{tx.stepsEliminated}</span>
                  ) : (
                    <span className="text-green-600">
                      {formatDays(stepFlexibleDays)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {step.mandatoryWait ? "✓" : ""}
                </td>
                <td className="px-3 py-2 text-gray-400 hidden sm:table-cell">
                  {Object.entries(step.participation)
                    .map(([r, h]) => `${r} ${h}h`)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td className="px-3 py-2">{lang === "en" ? "TOTAL" : "SUMA"}</td>
              <td className="px-3 py-2 text-right text-red-600">{rigidDays}</td>
              <td className="px-3 py-2 text-right text-green-600">{flexibleDays}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
