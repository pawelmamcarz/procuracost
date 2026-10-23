import Link from "next/link";
import type { ReactNode } from "react";
import { NumberedPoint, NumberedProvenanceItem, NumberedProvenanceRule } from "@/components/NumberedProvenanceRule";
import Reveal from "@/components/motion/Reveal";
import ScenarioDrivers, { type DebateScenario, type DebateScenarioId } from "@/components/debate/ScenarioDrivers";
import TunnelFieldToggle from "@/components/debate/TunnelFieldToggle";
import { debateT, type Lang } from "@/lib/i18n";
import { buildDecisionRecordV2, createScenarioDraft } from "@/lib/model-v2";

const SCENARIOS: DebateScenarioId[] = [
  "fleet_tco_reframing",
  "erp_transformation_discovery",
  "logistics_service_redesign",
];
const CONTROLS = ["catalog_calloff_control", "mrp_release_control"] as const;
const linkClass = "inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function DebateBento({ lang }: { lang: Lang }) {
  const tx = debateT[lang];
  const prefix = lang === "en" ? "/en" : "";
  const scenarios: DebateScenario[] = SCENARIOS.map((id) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    const drivers: DebateScenario["drivers"] = [
      { id: "role", value: record.alternatives.formalSequential.result.roleCost.central - record.alternatives.adaptiveCompliant.result.roleCost.central },
      { id: "nonLabour", value: record.alternatives.formalSequential.result.nonLabourCost.central - record.alternatives.adaptiveCompliant.result.nonLabourCost.central },
      { id: "delay", value: record.alternatives.formalSequential.result.delayCost.central - record.alternatives.adaptiveCompliant.result.delayCost.central },
      { id: "contract", value: record.drivers.filter(({ id }) => id !== "role_cost" && id !== "non_labour_cost" && id !== "delay_cost").reduce((sum, driver) => sum + driver.contribution.central, 0) },
    ];
    return { id, drivers, total: record.comparison.deltaCost };
  });
  const currency = new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    style: "currency", currency: "PLN", maximumFractionDigits: 0,
  });

  function tile(index: number, span: string, children: ReactNode) {
    return (
      <Reveal className={`min-w-0 bg-white p-6 ${span}`} index={index}>
        <article data-debate-tile={index + 1} className="min-w-0">
          <p className="mb-3 text-xs font-medium text-gray-500">{tx.threads[index]}</p>
          <h3 className="text-xl font-bold tracking-tight text-gray-900">{tx.titles[index]}</h3>
          {children}
        </article>
      </Reveal>
    );
  }

  return (
    <section aria-label={tx.title} className="py-12" data-debate-hub={lang}>
      <header className="mb-7 max-w-3xl border-l-4 border-blue-700 pl-5">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{tx.title}</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">{tx.intro}</p>
      </header>
      <div className="grid grid-cols-1 gap-px border border-gray-200 bg-gray-200 md:grid-cols-6">
        {tile(0, "md:col-span-4 md:row-span-2", <>
          <TunnelFieldToggle lang={lang} />
          <Link className={linkClass} href={`${prefix}/model`}>{tx.links.model}</Link>
        </>)}
        {tile(1, "md:col-span-2", <>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-xs leading-6 text-gray-700">
            {[
              { title: tx.automation, items: tx.automationItems },
              { title: tx.human, items: tx.humanItems },
            ].map(({ title, items }) => (
              <div key={title}>
                <dt className="border-b border-gray-200 pb-2 font-semibold text-gray-900">{title}</dt>
                <dd><ul className="mt-2 space-y-3">{items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-wrap gap-x-4">
            <Link className={linkClass} href={`${prefix}/readiness`}>{tx.links.readiness}</Link>
            <Link className={linkClass} href="/kupiec-po-automatyzacji">{tx.links.article}</Link>
          </div>
        </>)}
        {tile(2, "md:col-span-2", <>
          <ul className="mt-4 divide-y divide-gray-200 text-sm leading-6 text-gray-700">
            {tx.measures.map((measure) => <li className="py-3" key={measure}>{measure}</li>)}
          </ul>
          <Link className={linkClass} href="/kupiec-po-automatyzacji">{tx.links.measures}</Link>
        </>)}
        {tile(3, "md:col-span-3", <>
          <ScenarioDrivers lang={lang} scenarios={scenarios} />
          <Link className={linkClass} href={`${prefix}/calculator`}>{tx.links.calculator}</Link>
        </>)}
        {tile(4, "md:col-span-3", <>
          <NumberedProvenanceRule className="mt-6">
            {tx.rules.map((rule, index) => (
              <NumberedProvenanceItem key={rule}>
                <NumberedPoint index={index} className="mr-3" />
                <span className="text-sm font-semibold text-gray-700">{rule}</span>
              </NumberedProvenanceItem>
            ))}
          </NumberedProvenanceRule>
          <p className="mt-6 text-sm leading-7 text-gray-700">{tx.rulePrinciple}</p>
          <Link className={linkClass} href={`${prefix}/methodology`}>{tx.links.methodology}</Link>
        </>)}
        {tile(5, "md:col-span-6", <>
          <dl className="mt-5 divide-y divide-gray-200">
            {CONTROLS.map((id) => (
              <div className="flex flex-wrap justify-between gap-3 py-3" key={id}>
                <dt className="text-sm text-gray-700">{tx.controls[id]}</dt>
                <dd className="font-mono text-sm tabular-nums text-gray-900">
                  {currency.format(buildDecisionRecordV2(createScenarioDraft(id)).comparison.deltaCost)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm leading-6 text-gray-600">{tx.controlNote}</p>
          <Link className={linkClass} href={`${prefix}/case-studies`}>{tx.links.cases}</Link>
        </>)}
        {tile(6, "md:col-span-6", <>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-gray-700 marker:font-mono marker:text-blue-700">
            {tx.questions.map((question) => <li className="pl-2" key={question}>{question}</li>)}
          </ol>
          <Link className={`${linkClass} mt-4`} href="/kupiec-po-automatyzacji">{tx.links.article}</Link>
        </>)}
      </div>
    </section>
  );
}
