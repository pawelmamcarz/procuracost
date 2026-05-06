"use client";

import { useState } from "react";
import { SCENARIOS, Scenario } from "@/lib/scenarios";
import { ProcurementInputs, ProcessType, TechLevelId, StakeholderRole } from "@/lib/calculations";
import { TECH_LEVELS, PROCESS_TYPE_META, deriveRigidDays, deriveFlexibleDays, getSteps } from "@/lib/process-templates";
import { calculatorT, Lang } from "@/lib/i18n";

interface Props {
  onCalculate: (inputs: ProcurementInputs, scenario: Scenario) => void;
  lang?: Lang;
}

const PROCESS_TYPES: Exclude<ProcessType, "custom">[] = [
  "pzp_eu",
  "pzp_krajowy",
  "private_formal",
  "policy_only",
  "catalog_order",
  "mrp_order",
  "capex",
];

const TECH_LEVEL_IDS: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];

const STAKEHOLDER_ROLES: StakeholderRole[] = ["requestor", "buyer", "lawyer", "finance", "manager", "executive"];

export default function CostCalculator({ onCalculate, lang = "pl" }: Props) {
  const tx = calculatorT[lang];
  const [selectedScenarioId, setSelectedScenarioId] = useState("fleet");
  const [inputs, setInputs] = useState<ProcurementInputs>(SCENARIOS[0].inputs);

  function handleScenarioChange(id: string) {
    setSelectedScenarioId(id);
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (scenario) setInputs(scenario.inputs);
  }

  function setProcessType(pt: ProcessType) {
    setInputs((prev) => ({ ...prev, processType: pt }));
  }

  function setTechLevel(tl: TechLevelId) {
    setInputs((prev) => ({ ...prev, techLevel: tl }));
  }

  function setStakeholder(role: StakeholderRole, field: "count" | "dailyRate", value: number) {
    setInputs((prev) => ({
      ...prev,
      stakeholders: {
        ...prev.stakeholders,
        [role]: { ...prev.stakeholders[role], [field]: value },
      },
    }));
  }

  function setField(field: keyof ProcurementInputs, value: number) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId)!;
    onCalculate(inputs, scenario);
  }

  // Derived preview of days based on current selections
  const steps = getSteps(inputs.processType, inputs.customSteps);
  const tech = TECH_LEVELS[inputs.techLevel];
  const previewRigidDays = deriveRigidDays(steps, tech.timeMultiplier);
  const previewFlexDays = deriveFlexibleDays(steps, tech.timeMultiplier);

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const sectionClass = "rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3";
  const sectionTitleClass = "text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Scenario selector */}
      <div>
        <label className={labelClass}>{tx.scenarioLabel}</label>
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
              {lang === "en" ? s.nameEn : s.name}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {SCENARIOS.find((s) => s.id === selectedScenarioId)?.[lang === "en" ? "descriptionEn" : "description"]}
        </p>
      </div>

      {/* Section 1: Process type */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>{tx.processTypeLabel}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PROCESS_TYPES.map((pt) => {
            const meta = PROCESS_TYPE_META[pt];
            const label = tx.processTypes[pt];
            return (
              <button
                key={pt}
                type="button"
                onClick={() => setProcessType(pt)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                  inputs.processType === pt
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className="ml-1 text-gray-400 font-normal">
                  {lang === "en" ? meta.descriptionEn.slice(0, 60) : meta.description.slice(0, 60)}…
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Tech level */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>{tx.techLevelLabel}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TECH_LEVEL_IDS.map((tl) => {
            const level = TECH_LEVELS[tl];
            return (
              <button
                key={tl}
                type="button"
                onClick={() => setTechLevel(tl)}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs transition-all ${
                  inputs.techLevel === tl
                    ? "border-teal-400 bg-teal-50 text-teal-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">{lang === "en" ? level.nameEn : level.name}</div>
                <div className="mt-0.5 text-gray-400">{level.examples.slice(0, 30)}</div>
              </button>
            );
          })}
        </div>
        {/* Derived days preview */}
        <div className="mt-2 flex gap-6 text-xs text-gray-500">
          <span>
            {tx.rigidProcedure}:{" "}
            <span className="font-semibold text-red-600">{previewRigidDays} {lang === "en" ? "days" : "dni"}</span>
          </span>
          <span>
            {tx.flexiblePolicy}:{" "}
            <span className="font-semibold text-green-600">{previewFlexDays} {lang === "en" ? "days" : "dni"}</span>
          </span>
          <span className="text-gray-400 italic">{tx.derivedNote}</span>
        </div>
      </div>

      {/* Section 3: Stakeholders */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>{tx.stakeholdersTitle}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-2 text-left font-medium">{lang === "en" ? "Role" : "Rola"}</th>
                <th className="pb-2 text-right font-medium">{tx.colCount}</th>
                <th className="pb-2 text-right font-medium">{tx.colDailyRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STAKEHOLDER_ROLES.map((role) => (
                <tr key={role}>
                  <td className="py-1.5 font-medium text-gray-700">
                    {tx.stakeholderRoles[role]}
                  </td>
                  <td className="py-1.5 pl-4">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={inputs.stakeholders[role].count}
                      onChange={(e) => setStakeholder(role, "count", +e.target.value)}
                      className="w-16 rounded border border-gray-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="py-1.5 pl-2">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={inputs.stakeholders[role].dailyRate}
                      onChange={(e) => setStakeholder(role, "dailyRate", +e.target.value)}
                      className="w-24 rounded border border-gray-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Financial parameters */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>{tx.financialTitle}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>{tx.contractValue}</label>
            <input
              type="number"
              className={inputClass}
              value={inputs.contractValue}
              onChange={(e) => setField("contractValue", +e.target.value)}
              min={0}
              step={100000}
            />
          </div>
          <div>
            <label className={labelClass}>
              {tx.dailyCostOfInaction}
              <span
                className="ml-1 cursor-help text-gray-400"
                title={tx.dailyCostOfInactionTooltip}
              >
                ⓘ
              </span>
            </label>
            <input
              type="number"
              className={inputClass}
              value={inputs.dailyCostOfInaction}
              onChange={(e) => setField("dailyCostOfInaction", +e.target.value)}
              min={0}
              step={1000}
            />
          </div>
          <div>
            <label className={labelClass}>{tx.renegotiationCost}</label>
            <input
              type="number"
              className={inputClass}
              value={inputs.renegotiationCost}
              onChange={(e) => setField("renegotiationCost", +e.target.value)}
              min={0}
              step={10000}
            />
          </div>
          <div>
            <label className={labelClass}>
              {tx.bypassExposure}
              <span className="ml-1 cursor-help text-gray-400" title={tx.bypassTooltip}>ⓘ</span>
            </label>
            <input
              type="number"
              className={inputClass}
              value={inputs.bypassAuditExposure}
              onChange={(e) => setField("bypassAuditExposure", +e.target.value)}
              min={0}
              step={50000}
            />
          </div>
          <div>
            <label className={labelClass}>{tx.tcoHorizon}</label>
            <input
              type="number"
              className={inputClass}
              value={inputs.tcoHorizonYears}
              onChange={(e) => setField("tcoHorizonYears", +e.target.value)}
              min={1}
              max={10}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        {tx.calculate}
      </button>
    </form>
  );
}
