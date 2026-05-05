import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";
import { PROCESS_TYPE_META, TECH_LEVELS } from "@/lib/process-templates";

export default function EnCaseStudiesPage() {
  const withStudies = SCENARIOS.filter((s) => s.caseStudy);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-world examples of flexible procurement — from airlines to IT implementations.
          Each calculator scenario is based on a documented case.
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
                Source: {s.caseStudy!.source}
              </p>
            </div>
          );
        })}
      </div>

      {/* Airlines box */}
      <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">Why don&apos;t airlines use open tenders?</h2>
        <p className="mt-2 text-sm text-blue-800">
          Fleet procurement (e.g. LOT — 40 Airbus A220, Ryanair — 100× Boeing 737 post-9/11) is
          conducted through direct manufacturer negotiations, often exploiting market crises to
          achieve below-catalogue pricing. No public tender could match that level of timing and
          negotiation flexibility. Result: Ryanair built a 400+ aircraft fleet with margins
          competitors can only envy.
        </p>
        <p className="mt-3 text-xs text-blue-600">
          Sources: Airfleets.net (LOT fleet 2026); IJRAR (2019) Ryanair Strategic Positioning;
          ResearchGate — Low-Cost Strategy in Aviation
        </p>
      </div>

      {/* Enforcement Fallacy box */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">The Enforcement Fallacy</h2>
        <p className="mt-2 text-sm text-amber-800">
          A common counter-argument: &ldquo;if users bypass the process, the process isn&apos;t
          enforced well enough — just block the bypass.&rdquo; This misunderstands the dynamics.
          Lipsky (1980) showed that frontline workers <em>always</em> adapt rules to operational
          reality. Vaughan (1996) demonstrated that forced compliance without operational slack
          creates &ldquo;normalization of deviance&rdquo; — invisible workarounds that accumulate
          until catastrophic failure. Holmström &amp; Milgrom (1991) proved that enforcing
          compliance on measurable steps crowds out value creation on unmeasured ones. Enforcement
          does not fix the incentive structure — it hides the problem.
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
