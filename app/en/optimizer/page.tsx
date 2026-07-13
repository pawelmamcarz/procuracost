import PathOptimizer from "@/components/PathOptimizer";

export default function EnOptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Transparent heuristic — 30 scoring variants
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Procurement Path Optimizer
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          The tool ranks procurement methods using explicit rules and scenario inputs.
          Its PZP note is orientation only, not an automated legal compliance check.
          Thresholds are updated for 2026–2027.
        </p>
        <a
          href="https://www.gov.pl/web/uzp-en/current-thresholds-in-public-procurement-and-current-average-exchange-rate-pln-euro"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-blue-600 underline"
        >
          Threshold source: Polish Public Procurement Office
        </a>
      </div>
      <PathOptimizer lang="en" />
    </div>
  );
}
