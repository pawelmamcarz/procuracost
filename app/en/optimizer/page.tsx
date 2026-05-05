import PathOptimizer from "@/components/PathOptimizer";

export default function EnOptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Random Forest — 30 decision trees
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Procurement Path Optimizer
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          The model recommends the optimal procurement method based on purchase parameters.
          Compatibility with Polish Public Procurement Law (PZP) is verified automatically.
          Algorithm: ensemble of 30 decision trees with random feature subsets — Breiman (2001).
        </p>
      </div>
      <PathOptimizer lang="en" />
    </div>
  );
}
