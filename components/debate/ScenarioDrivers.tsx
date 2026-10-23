"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import NumberTween from "@/components/motion/NumberTween";
import { debateT, type Lang } from "@/lib/i18n";

export type DebateScenarioId = keyof typeof debateT.pl.scenarios;
export type DebateDriverId = Exclude<keyof typeof debateT.pl.drivers, "total">;
export interface DebateScenario {
  id: DebateScenarioId;
  drivers: { id: DebateDriverId; value: number }[];
  total: number;
}

export default function ScenarioDrivers({ lang, scenarios }: { lang: Lang; scenarios: DebateScenario[] }) {
  const tx = debateT[lang];
  const [selected, setSelected] = useState(scenarios[0].id);
  const reducedMotion = useReducedMotion();
  const scenario = scenarios.find(({ id }) => id === selected)!;
  const currency = new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    style: "currency", currency: "PLN", maximumFractionDigits: 0,
  });
  const format = (value: number) => currency.format(value);
  const waterfall = scenario.drivers.map((driver, index) => {
    const start = scenario.drivers.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    return { ...driver, start, end: start + driver.value };
  });
  const rows = [...waterfall, { id: "total" as const, value: scenario.total, start: 0, end: scenario.total }];
  const minimum = Math.min(0, ...rows.flatMap(({ start, end }) => [start, end]));
  const maximum = Math.max(0, ...rows.flatMap(({ start, end }) => [start, end]));
  const scale = (value: number) => maximum === minimum ? 0 : ((value - minimum) / (maximum - minimum)) * 1000;
  const delay = scenario.drivers.find(({ id }) => id === "delay")!;

  return (
    <div className="mt-6 min-w-0">
      <fieldset>
        <legend className="mb-3 font-mono text-sm uppercase tracking-wide text-gray-600">{tx.scenarioLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {scenarios.map(({ id }) => (
            <button
              aria-pressed={selected === id}
              className={`min-h-11 border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                selected === id ? "border-blue-700 bg-blue-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
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
      <p className="mt-7 font-mono text-sm text-gray-600">{tx.drivers.delay}</p>
      <p className="mt-2 break-words text-4xl leading-tight text-blue-700 sm:text-5xl">
        <NumberTween value={delay.value} formatter={format} />
      </p>
      <p className="mt-4 text-sm leading-6 text-gray-600">{tx.central}</p>
      <dl className="mt-6" data-waterfall="cost-difference" key={selected}>
        {rows.map(({ id, value, start, end }, index) => (
          <div className={`border-t border-gray-200 py-3 ${id === "total" ? "font-semibold" : ""}`} key={id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <dt className="text-sm text-gray-700">{tx.drivers[id]}</dt>
              <dd className="text-sm text-gray-900"><NumberTween value={value} formatter={format} /></dd>
            </div>
            <svg viewBox="0 0 1000 32" preserveAspectRatio="none" className="mt-2 h-6 w-full overflow-visible" aria-hidden="true">
              <path d={`M${scale(0)} 0V32M0 31H1000`} className="stroke-gray-200" vectorEffect="non-scaling-stroke" />
              <m.rect
                x={scale(Math.min(start, end))}
                y="4"
                width={Math.abs(scale(end) - scale(start))}
                height="22"
                className={id === "total" ? "fill-gray-900" : "fill-blue-600"}
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: reducedMotion ? 1 : [0, 1] }}
                viewport={{ once: true }}
                style={{ transformOrigin: `${scale(start) / 10}% 50%` }}
                transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              />
              {value === 0 && <path d={`M${scale(start)} 4V26`} className="stroke-gray-600" vectorEffect="non-scaling-stroke" />}
            </svg>
          </div>
        ))}
      </dl>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {tx.scenarios[selected]}. {tx.central} {rows.map(({ id, value }) => `${tx.drivers[id]}: ${format(value)}`).join("; ")}.
      </p>
      <p className="mt-5 border-l-2 border-blue-700 pl-4 text-sm leading-6 text-gray-700">{tx.caveat}</p>
      <p className="mt-4 text-sm leading-6 text-gray-600">{tx.coverage}</p>
    </div>
  );
}
