import PathOptimizer from "@/components/PathOptimizer";

export default function EnOptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Rule-based model — sensitivity analysis (30 runs)
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Procurement Path Optimizer
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          The model recommends a procurement method based on purchase parameters; public-sector
          recommendations are hard-filtered to the lawful PZP procedures. It is a weighted scoring
          function (not a trained ML model); the 30 runs are a sensitivity sweep showing how stable
          the recommendation is. Illustrative tool.
        </p>
      </div>
      <PathOptimizer lang="en" />
    </div>
  );
}
