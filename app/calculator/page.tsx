"use client";

import { useState } from "react";
import CostCalculator from "@/components/CostCalculator";
import CostComparison from "@/components/CostComparison";
import PDFExport from "@/components/PDFExport";
import { calculateCosts, ComparisonResult } from "@/lib/calculations";
import { ProcurementInputs } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";

export default function CalculatorPage() {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  function handleCalculate(inputs: ProcurementInputs, scenario: Scenario) {
    const r = calculateCosts(inputs);
    setResult(r);
    setActiveScenario(scenario);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kalkulator kosztów procedur zakupowych</h1>
        <p className="mt-1 text-sm text-gray-500">
          Porównaj całkowite koszty sztywnej procedury przetargowej z podejściem opartym na polityce
          zakupowej. Wszystkie wartości bazowe oparte na publikacjach akademickich.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <CostCalculator onCalculate={handleCalculate} />
      </div>

      {result && activeScenario && (
        <div id="results" className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Wyniki: {activeScenario.name}
            </h2>
            <PDFExport result={result} scenario={activeScenario} />
          </div>
          <CostComparison result={result} scenario={activeScenario} />
        </div>
      )}
    </div>
  );
}
