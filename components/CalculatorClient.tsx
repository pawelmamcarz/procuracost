"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CostCalculator from "@/components/CostCalculator";
import { calculateCosts, ComparisonResult, ProcurementInputs } from "@/lib/calculations";
import { Scenario, SCENARIOS } from "@/lib/scenarios";
import { encodeInputsToParams, inputsFromSearchParams } from "@/components/calculator-url";
import { revealResult } from "@/components/result-reveal";

const CostComparison = dynamic(() => import("@/components/CostComparison"), { ssr: false });
const PDFExport = dynamic(() => import("@/components/PDFExport"), { ssr: false });

export default function CalculatorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { inputs: initialInputs, scenarioId: initialScenarioId } = inputsFromSearchParams(searchParams, SCENARIOS[0].inputs);

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeInputs, setActiveInputs] = useState<ProcurementInputs | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  function handleCalculate(inputs: ProcurementInputs, scenario: Scenario) {
    const r = calculateCosts(inputs);
    setResult(r);
    setActiveScenario(scenario);
    setActiveInputs(inputs);
    requestAnimationFrame(() => {
      revealResult(resultsRef.current);
    });
  }

  function handleInputsChange(inputs: ProcurementInputs, scenarioId: string) {
    const params = encodeInputsToParams(inputs, scenarioId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kalkulator kosztów procedur zakupowych</h1>
        <p className="mt-1 text-sm text-gray-500">
          Porównaj całkowite koszty dla trzech klas procesów: zakupów strategicznych, zakupów
          operacyjnych oraz strategicznych zakupów PZP. Czas i koszty wynikają z szablonu procesu
          i stawek uczestników — nie są wpisywane ręcznie.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <CostCalculator
          onCalculate={handleCalculate}
          initialInputs={initialInputs}
          initialScenarioId={initialScenarioId ?? undefined}
          onInputsChange={handleInputsChange}
        />
      </div>

      {result && activeScenario && activeInputs && (
        <div
          ref={resultsRef}
          role="region"
          tabIndex={-1}
          aria-live="polite"
          aria-labelledby="calculator-results-title"
          className="mt-10 scroll-mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 id="calculator-results-title" className="text-lg font-bold text-gray-900">
              Wyniki: {activeScenario.name}
            </h2>
            <PDFExport result={result} scenario={activeScenario} inputs={activeInputs} />
          </div>
          <CostComparison result={result} scenario={activeScenario} inputs={activeInputs} />
        </div>
      )}
    </div>
  );
}
