"use client";

import { useState } from "react";
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import NumberTween from "@/components/motion/NumberTween";
import { debateT, type Lang } from "@/lib/i18n";

export type DebateScenarioId = keyof typeof debateT.pl.scenarios;
export type DebateDriverId = Exclude<keyof typeof debateT.pl.drivers, "total">;
export interface DebateScenario {
  id: DebateScenarioId;
  drivers: { id: DebateDriverId; value: number }[];
  total: number;
}

const CHART_HEIGHT = 176;

export default function ScenarioDrivers({ lang, scenarios }: { lang: Lang; scenarios: DebateScenario[] }) {
  const tx = debateT[lang];
  const [selected, setSelected] = useState(scenarios[0].id);
  const scenario = scenarios.find(({ id }) => id === selected)!;
  const currency = new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });
  const format = (value: number) => currency.format(value);
  const data = scenario.drivers.map(({ id, value }) => ({ name: tx.drivers[id], value }));

  return (
    <div className="mt-5 min-w-0">
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-gray-600">{tx.scenarioLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {scenarios.map(({ id }) => (
            <button
              aria-pressed={selected === id}
              className={`min-h-11 border px-3 py-2 text-left text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                selected === id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
              key={id}
              onClick={() => setSelected(id)}
              type="button"
            >
              {tx.scenarios[id]}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="mt-4 text-xs leading-6 text-gray-600">{tx.central}</p>
      <dl className="mt-3 text-sm">
        {[...scenario.drivers, { id: "total" as const, value: scenario.total }].map(({ id, value }) => (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 border-b border-gray-200 py-2" key={id}>
            <dt className="text-gray-700">{tx.drivers[id]}</dt>
            <dd className="text-right text-xs text-gray-900"><NumberTween value={value} formatter={format} /></dd>
          </div>
        ))}
      </dl>
      <div aria-hidden="true" className="mt-4 min-w-0">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} minWidth={0}>
          <BarChart data={data} layout="vertical" accessibilityLayer={false} margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => format(Number(value))} />
            <ReferenceLine x={0} />
            <Bar dataKey="value" fill="#3b82f6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {tx.scenarios[selected]}. {tx.central} {data.map(({ name, value }) => `${name}: ${format(value)}`).join("; ")}. {tx.drivers.total}: {format(scenario.total)}.
      </p>
      <p className="mt-4 border-l-2 border-blue-700 pl-4 text-xs leading-6 text-gray-600">{tx.caveat}</p>
      <p className="mt-3 text-xs leading-6 text-gray-600">{tx.coverage}</p>
    </div>
  );
}
