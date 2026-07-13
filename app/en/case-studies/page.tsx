import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";
import { PROCESS_TYPE_META, TECH_LEVELS } from "@/lib/process-templates";

export default function EnCaseStudiesPage() {
  const withStudies = SCENARIOS.filter((s) => s.caseStudy);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Illustrative Archetypes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Synthetic scenarios exercise different model settings. Their inputs and outputs are
          ProcuraCost assumptions, not organization data, external benchmarks, or realized savings.
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
              <h2 className="mt-3 text-lg font-bold text-gray-900">{s.nameEn}</h2>
              <p className="mt-2 text-sm text-gray-600">{s.caseStudy!.insightEn}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-medium text-red-600">Rigid procedure</p>
                  <p className="mt-1 text-gray-600">{result.rigidDays} days</p>
                  <p className="text-gray-400">{processLabel}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-medium text-green-600">Procurement policy</p>
                  <p className="mt-1 text-gray-600">{result.flexibleDays} days</p>
                  <p className="text-gray-400">{techLabel}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Source: ProcuraCost model 1.2.0; assumptions in lib/scenarios.ts
              </p>
            </div>
          );
        })}
      </div>

      {/* Reading guidance */}
      <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">How should these scenarios be read?</h2>
        <p className="mt-2 text-sm text-blue-800">
          Results show only the consequences of the entered parameters. A high percentage does not
          establish that a flexible route will realize those savings; it identifies assumptions to
          test with timing, role-effort, renegotiation, and delay-cost data.
        </p>
        <p className="mt-3 text-xs text-blue-600">
          Parameter source: lib/scenarios.ts. Full calculation trace: npm run replicate.
        </p>
      </div>

      {/* Enforcement Fallacy box */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">Enforcement-Only Responses</h2>
        <p className="mt-2 text-sm text-amber-800">
          Lipsky (1980), Vaughan (1996), and Holmström &amp; Milgrom (1991) motivate hypotheses
          about adaptation, hidden deviation, and multitask incentives. They do not prove that
          procurement enforcement generally fails. Pilots must distinguish path mismatch from
          misconduct, weak capability, and inadequate control.
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
