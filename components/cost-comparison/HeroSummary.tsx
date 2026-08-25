import { ComparisonResult, ProcurementInputs, formatPLN, formatPercent } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  inputs: ProcurementInputs;
  lang: Lang;
}

export default function HeroSummary({ result, scenario, inputs, lang }: Props) {
  const tx = comparisonT[lang];
  const {
    delta,
    deltaPercent,
    bypassProbability,
    rigidDays,
    flexibleDays,
    uncertainty,
    decisionThreshold,
    deltaDecomposition,
  } = result;

  const spendLabel = inputs.spendType
    ? (inputs.spendType === "direct" ? "Direct" : "Indirect")
    : null;

  const phaseLabel = inputs.processPhase
    ? (inputs.processPhase === "upstream" ? "Upstream" : "Downstream")
    : null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
      <p className="text-sm font-medium uppercase tracking-wide opacity-80">
        {tx.deltaHeadline}
      </p>
      <p className="mt-1 font-mono text-4xl font-bold">{formatPLN(delta)}</p>
      <p className="mt-1 text-lg opacity-90">
        <span className="font-mono">{formatPercent(Math.abs(deltaPercent))}</span>{" "}
        {deltaPercent >= 0 ? tx.higherThan : tx.lowerThan}
      </p>
      <div className="mt-3 rounded-xl border border-white/20 bg-white/10 p-3 text-sm">
        <p className="font-semibold">
          {lang === "en" ? "Scenario range" : "Przedział scenariuszowy"}:{" "}
          <span className="font-mono">
            {formatPLN(uncertainty.lowDelta)} – {formatPLN(uncertainty.highDelta)}
          </span>
        </p>
        <div className="mt-1.5 space-y-0.5 text-xs text-white/80">
          <div>
            {tx.axisEvidence}:{" "}
            <span className="font-mono">
              {formatPLN(uncertainty.evidenceLowDelta)} – {formatPLN(uncertainty.evidenceHighDelta)}
            </span>
          </div>
          <div>
            {tx.axisStructural}:{" "}
            <span className="font-mono">
              {formatPLN(uncertainty.structuralLowDelta)} – {formatPLN(uncertainty.structuralHighDelta)}
            </span>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-white/70">
          {uncertainty.widthDrivenBy === "structural" ? tx.axisNoteStructural : tx.axisNoteEvidence}
        </p>
        <p className="mt-1 text-xs text-white/70">
          {uncertainty.crossesZero
            ? (lang === "en"
                ? "The sign changes across defensible assumptions; neither path is a universal winner."
                : "Znak zmienia się przy dopuszczalnych założeniach; żadna ścieżka nie wygrywa uniwersalnie.")
            : (lang === "en"
                ? "The sign is stable within the declared scenario bounds, not statistically proven."
                : "Znak jest stabilny w zadeklarowanym zakresie scenariuszy, ale nie stanowi dowodu statystycznego.")}
        </p>
      </div>
      <div className="mt-3 flex gap-4 text-sm">
        <span className="rounded-lg bg-white/10 px-3 py-1">
          {tx.rigidLabel}: <strong className="font-mono">{rigidDays}</strong> {lang === "en" ? "days" : "dni"}
        </span>
        <span className="rounded-lg bg-white/10 px-3 py-1">
          {tx.flexibleLabel}: <strong className="font-mono">{flexibleDays}</strong> {lang === "en" ? "days" : "dni"}
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-white/20 bg-white/10 p-3 text-sm">
        <p className="font-semibold">{tx.decompositionTitle}</p>
        <div className="mt-1.5 space-y-0.5 text-xs text-white/85">
          <div>{tx.decompositionProcess}: <strong className="font-mono">{formatPLN(deltaDecomposition.process)}</strong></div>
          <div>
            {tx.decompositionDelay}: <strong className="font-mono">{formatPLN(deltaDecomposition.delay)}</strong>
            {delta !== 0 && (
              <span className="font-mono"> ({Math.round(deltaDecomposition.delayShareOfDeltaPercent)}%)</span>
            )}
          </div>
          <div>{tx.decompositionLifecycle}: <strong className="font-mono">{formatPLN(deltaDecomposition.lifecycle)}</strong></div>
        </div>
        <p className="mt-1.5 text-xs text-white/70">{tx.decompositionNote}</p>
      </div>

      <p className="mt-2 text-xs text-white/75">
        {tx.breakEvenLabel}:{" "}
        {decisionThreshold.status === "threshold_above_zero" ? (
          <>
            <strong className="font-mono">
              {formatPLN(decisionThreshold.breakEvenDailyCostOfInaction ?? 0)}/
              {lang === "en" ? "day" : "dzień"}
            </strong>. {decisionThreshold.effectiveDayDifference > 0
              ? tx.breakEvenAboveZero
              : tx.breakEvenAboveZeroFormalFaster}
          </>
        ) : decisionThreshold.status === "formal_costlier_at_zero_delay" ? (
          tx.breakEvenFormalLoses
        ) : decisionThreshold.status === "adaptive_costlier_at_zero_delay" ? (
          tx.breakEvenAdaptiveLoses
        ) : (
          tx.breakEvenNoDayDifference
        )}
      </p>

      {(spendLabel || phaseLabel) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {spendLabel && (
            <span className="rounded-full bg-white/20 px-3 py-0.5">
              {lang === "en" ? "Spend" : "Wydatki"}: <strong>{spendLabel}</strong>
            </span>
          )}
          {phaseLabel && (
            <span className="rounded-full bg-white/20 px-3 py-0.5">
              {lang === "en" ? "Phase" : "Faza"}: <strong>{phaseLabel}</strong>
            </span>
          )}
          <span className="text-white/60 italic ml-1">• {tx.modelAdjustContext}</span>
        </div>
      )}

      {(inputs.spendType || inputs.processPhase) && (
        <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3 text-xs text-white/90">
          <p className="font-medium mb-1">{tx.modelAdjustTitle}</p>
          <ul className="space-y-0.5 pl-1 text-white/80">
            {inputs.spendType === "direct" && (
              <li>• {tx.modelAdjustDirectTco}</li>
            )}
            {inputs.processPhase === "upstream" && (
              <li>• {tx.modelAdjustUpstreamBypass}</li>
            )}
            {inputs.processPhase === "downstream" && (
              <li>• {tx.modelAdjustDownstreamProd}</li>
            )}
            {inputs.spendType === "direct" && inputs.processPhase === "upstream" && (
              <li>• {tx.modelAdjustStrongest}</li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/10 p-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
            {tx.bypassLabel}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${Math.round(bypassProbability * 100)}%` }}
              />
            </div>
            <span className="font-mono text-sm font-bold">{Math.round(bypassProbability * 100)}%</span>
          </div>
          <p className="mt-1 text-xs opacity-60">
            {tx.bypassNote} {lang === "en" ? "Scenario assumption, not a predicted probability." : "Założenie scenariuszowe, nie prognoza prawdopodobieństwa."}
          </p>
        </div>
      </div>
      {scenario.caseStudy && (
        <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm">
          <p className="font-semibold">{scenario.caseStudy.title}</p>
          <p className="mt-1 opacity-90">
            {lang === "en" ? scenario.caseStudy.insightEn : scenario.caseStudy.insight}
          </p>
          <p className="mt-1 text-xs opacity-60">
            {lang === "en" ? "Source" : "Źródło"}: {scenario.caseStudy.source}
          </p>
        </div>
      )}
    </div>
  );
}
