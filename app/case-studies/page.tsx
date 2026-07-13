import type { Metadata } from "next";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";
import { PROCESS_TYPE_META, TECH_LEVELS } from "@/lib/process-templates";

export const metadata: Metadata = {
  title: "Case studies — ProcuraCost",
  description:
    "Ilustracje mechanizmów zakupowych z jawnym oddzieleniem źródeł od wyników modelu.",
};

export default function CaseStudiesPage() {
  const withStudies = SCENARIOS.filter((s) => s.caseStudy);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ilustracje mechanizmów zakupowych, nie eksperymenty ani dowody przyczynowe. Wartości
          kalkulatora pochodzą z modelu i nie są wynikami opisanych organizacji.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {withStudies.map((s) => {
          const result = calculateCosts(s.inputs);
          const processLabel = s.inputs.processType !== "custom"
            ? PROCESS_TYPE_META[s.inputs.processType].name
            : "Własny";
          const techLabel = TECH_LEVELS[s.inputs.techLevel].name;
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">
                {s.name}
              </span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">{s.caseStudy!.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{s.caseStudy!.insight}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-medium text-red-600">Ścieżka formalna</p>
                  <p className="mt-1 text-gray-600">{result.rigidDays} dni</p>
                  <p className="text-gray-400">{processLabel}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-medium text-green-600">Ścieżka adaptacyjna</p>
                  <p className="mt-1 text-gray-600">{result.flexibleDays} dni</p>
                  <p className="text-gray-400">{techLabel}</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                Liczba dni to ilustracyjny wynik modelu dla zakupu tej wielkości, nie dane z cytowanego źródła.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Zakres ΔC: {Math.round(result.uncertainty.lowPercentOfContractValue * 10) / 10}% do {Math.round(result.uncertainty.highPercentOfContractValue * 10) / 10}% wartości kontraktu.
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Źródło: {s.caseStudy!.source}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
