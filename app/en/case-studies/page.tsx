import type { Metadata } from "next";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";
import { PROCESS_TYPE_META, TECH_LEVELS } from "@/lib/process-templates";

export const metadata: Metadata = {
  title: "Case Studies — ProcuraCost",
  description:
    "Procurement-mechanism illustrations with sources kept separate from model outputs.",
};

export default function EnCaseStudiesPage() {
  const withStudies = SCENARIOS.filter((s) => s.caseStudy);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Illustrations of procurement mechanisms, not experiments or causal evidence. Calculator
          values come from the model and are not outcomes reported by these organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {withStudies.map((s) => {
          const result = calculateCosts(s.inputs);
          const processLabel = s.inputs.processType !== "custom"
            ? PROCESS_TYPE_META[s.inputs.processType].nameEn
            : "Custom";
          const techLabel = TECH_LEVELS[s.inputs.techLevel].nameEn;
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">
                {s.nameEn}
              </span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">{s.caseStudy!.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{s.caseStudy!.insightEn}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-medium text-red-600">Formal path</p>
                  <p className="mt-1 text-gray-600">{result.rigidDays} days</p>
                  <p className="text-gray-400">{processLabel}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-medium text-green-600">Adaptive path</p>
                  <p className="mt-1 text-gray-600">{result.flexibleDays} days</p>
                  <p className="text-gray-400">{techLabel}</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                Day figures are illustrative model output for a purchase of this size, not the figures from the cited case.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ΔC range: {result.uncertainty.lowPercentOfContractValue.toFixed(1)}% to {result.uncertainty.highPercentOfContractValue.toFixed(1)}% of contract value.
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Source: {s.caseStudy!.source}
              </p>
            </div>
          );
        })}
      </div>

      {/* Enforcement Fallacy box */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">The Enforcement Fallacy</h2>
        <p className="mt-2 text-sm text-amber-800">
          Organizational theory suggests mechanisms through which strict enforcement can displace
          effort or hide workarounds. Lipsky (1980), Vaughan (1996), and Holmström &amp; Milgrom
          (1991) concern different settings; their application to procurement is analogical and
          does not establish a bypass probability or a universal causal effect.
        </p>
        <p className="mt-3 text-xs text-amber-600">
          Sources: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) The Challenger Launch
          Decision; Holmström &amp; Milgrom (1991) Multitask Principal-Agent Problems and
          Incentive Contracts
        </p>
      </div>
    </div>
  );
}
