"use client";

import { useState } from "react";
import { SCENARIOS, Scenario } from "@/lib/scenarios";
import { ProcurementInputs } from "@/lib/calculations";
import { formatPLN } from "@/lib/calculations";

interface Props {
  onCalculate: (inputs: ProcurementInputs, scenario: Scenario) => void;
}

export default function CostCalculator({ onCalculate }: Props) {
  const [selectedScenarioId, setSelectedScenarioId] = useState("fleet");
  const [inputs, setInputs] = useState<ProcurementInputs>(SCENARIOS[0].inputs);

  function handleScenarioChange(id: string) {
    setSelectedScenarioId(id);
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (scenario) setInputs(scenario.inputs);
  }

  function handleChange(field: string, value: number) {
    setInputs((prev) => {
      if (field === "rigidDays") return { ...prev, procurementDays: { ...prev.procurementDays, rigid: value } };
      if (field === "flexibleDays") return { ...prev, procurementDays: { ...prev.procurementDays, flexible: value } };
      if (field === "rigidAdmin") return { ...prev, adminCostFixed: { ...prev.adminCostFixed, rigid: value } };
      if (field === "flexibleAdmin") return { ...prev, adminCostFixed: { ...prev.adminCostFixed, flexible: value } };
      return { ...prev, [field]: value };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId)!;
    onCalculate(inputs, scenario);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Scenario selector */}
      <div>
        <label className={labelClass}>Scenariusz zakupowy</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleScenarioChange(s.id)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                selectedScenarioId === s.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {SCENARIOS.find((s) => s.id === selectedScenarioId)?.description}
        </p>
      </div>

      {/* Main parameters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={labelClass}>Wartość kontraktu (PLN)</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.contractValue}
            onChange={(e) => handleChange("contractValue", +e.target.value)}
            min={0}
            step={100000}
          />
        </div>
        <div>
          <label className={labelClass}>Liczba kupców</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.buyerCount}
            onChange={(e) => handleChange("buyerCount", +e.target.value)}
            min={1}
            max={20}
          />
        </div>
        <div>
          <label className={labelClass}>Stawka kupca / dzień (PLN)</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.dailyBuyerRate}
            onChange={(e) => handleChange("dailyBuyerRate", +e.target.value)}
            min={0}
            step={100}
          />
        </div>
        <div>
          <label className={labelClass}>Dzienny przychód projektu (PLN)</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.dailyProjectRevenue}
            onChange={(e) => handleChange("dailyProjectRevenue", +e.target.value)}
            min={0}
            step={1000}
          />
        </div>
        <div>
          <label className={labelClass}>Koszt renegocjacji (PLN)</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.renegotiationCost}
            onChange={(e) => handleChange("renegotiationCost", +e.target.value)}
            min={0}
            step={10000}
          />
        </div>
        <div>
          <label className={labelClass}>Horyzont TCO (lata)</label>
          <input
            type="number"
            className={inputClass}
            value={inputs.tcoHorizonYears}
            onChange={(e) => handleChange("tcoHorizonYears", +e.target.value)}
            min={1}
            max={10}
          />
        </div>
      </div>

      {/* Procedure times */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-600">
            Procedura sztywna
          </p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Czas trwania (dni)</label>
              <input
                type="number"
                className={inputClass}
                value={inputs.procurementDays.rigid}
                onChange={(e) => handleChange("rigidDays", +e.target.value)}
                min={1}
              />
            </div>
            <div>
              <label className={labelClass}>Koszty administracyjne (PLN)</label>
              <input
                type="number"
                className={inputClass}
                value={inputs.adminCostFixed.rigid}
                onChange={(e) => handleChange("rigidAdmin", +e.target.value)}
                min={0}
                step={5000}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-green-600">
            Polityka zakupowa (elastyczna)
          </p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Czas trwania (dni)</label>
              <input
                type="number"
                className={inputClass}
                value={inputs.procurementDays.flexible}
                onChange={(e) => handleChange("flexibleDays", +e.target.value)}
                min={1}
              />
            </div>
            <div>
              <label className={labelClass}>Koszty administracyjne (PLN)</label>
              <input
                type="number"
                className={inputClass}
                value={inputs.adminCostFixed.flexible}
                onChange={(e) => handleChange("flexibleAdmin", +e.target.value)}
                min={0}
                step={5000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flexibility index */}
      <div>
        <label className={labelClass}>
          Indeks elastyczności podejścia polityki:{" "}
          <span className="font-semibold text-gray-800">
            {Math.round(inputs.flexibilityIndex * 100)}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={inputs.flexibilityIndex}
          onChange={(e) => handleChange("flexibilityIndex", +e.target.value)}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Niska elastyczność (0%)</span>
          <span>Pełna elastyczność (100%)</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        Oblicz koszty utracone
      </button>
    </form>
  );
}
