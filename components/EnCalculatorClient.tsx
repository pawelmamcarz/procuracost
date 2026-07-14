"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CostCalculator from "@/components/CostCalculator";
import { calculateCosts, ComparisonResult, ProcurementInputs } from "@/lib/calculations";
import { Scenario, SCENARIOS } from "@/lib/scenarios";
import { encodeInputsToParams, inputsFromSearchParams } from "@/components/calculator-url";

const CostComparison = dynamic(() => import("@/components/CostComparison"), { ssr: false });
const PDFExport = dynamic(() => import("@/components/PDFExport"), { ssr: false });

export default function EnCalculatorClient() {
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
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleInputsChange(inputs: ProcurementInputs, scenarioId: string) {
    const params = encodeInputsToParams(inputs, scenarioId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Procurement Cost Calculator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare total costs across three process classes: strategic procurement, operational
          procurement and strategic PZP procurement. Duration and admin costs are derived from the
          process template and stakeholder rates — not entered manually.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <CostCalculator
          onCalculate={handleCalculate}
          lang="en"
          initialInputs={initialInputs}
          initialScenarioId={initialScenarioId ?? undefined}
          onInputsChange={handleInputsChange}
        />
      </div>

      {result && activeScenario && activeInputs && (
        <div ref={resultsRef} className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Results: {activeScenario.nameEn}
            </h2>
            <PDFExport result={result} scenario={activeScenario} inputs={activeInputs} />
          </div>
          <CostComparison result={result} scenario={activeScenario} inputs={activeInputs} lang="en" />
        </div>
      )}
    </div>
  );
}
