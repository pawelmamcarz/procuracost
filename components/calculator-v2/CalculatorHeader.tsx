import { calculatorV2T, type Lang } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2";

export default function CalculatorHeader({ lang }: { lang: Lang }) {
  const tx = calculatorV2T[lang];
  return (
    <header className="border-b border-gray-200 pb-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
        {tx.journey.eyebrow}
      </p>
      <div className="mt-4 border-l-4 border-blue-700 pl-5 sm:pl-7">
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.journey.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
          {tx.journey.introduction}
        </p>
      </div>
      <details className="mt-6 max-w-3xl border-y border-gray-200 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          {tx.workspace.modelLabel} {MODEL_V2_METADATA.modelVersion}
        </summary>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-gray-500">
          <span>
            {tx.workspace.calibrationLabel}: {MODEL_V2_METADATA.calibrationId}
          </span>
          <span>
            {tx.workspace.rulesetLabel}: {MODEL_V2_METADATA.legalRulesetId}
          </span>
        </p>
      </details>
    </header>
  );
}
