"use client";

import { useState } from "react";
import CostCalculator from "@/components/CostCalculator";
import CostComparison from "@/components/CostComparison";
import PDFExport from "@/components/PDFExport";
import { calculateCosts, ComparisonResult, ProcurementInputs } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";

export default function EnCalculatorPage() {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeInputs, setActiveInputs] = useState<ProcurementInputs | null>(null);

  function handleCalculate(inputs: ProcurementInputs, scenario: Scenario) {
    const r = calculateCosts(inputs);
    setResult(r);
    setActiveScenario(scenario);
    setActiveInputs(inputs);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Procurement Cost Calculator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare the total costs of a rigid tender procedure against a policy-based flexible approach.
          Duration and admin costs are derived from the process template and stakeholder rates — not entered manually.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <CostCalculator onCalculate={handleCalculate} lang="en" />
      </div>

      {result && activeScenario && activeInputs && (
        <div id="results" className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Results: {activeScenario.nameEn}
            </h2>
            <PDFExport result={result} scenario={activeScenario} lang="en" />
          </div>
          <CostComparison result={result} scenario={activeScenario} inputs={activeInputs} lang="en" />
        </div>
      )}
    </div>
  );
}
