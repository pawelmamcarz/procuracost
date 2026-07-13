import type { Metadata } from "next";
import PathOptimizer from "@/components/PathOptimizer";

export const metadata: Metadata = {
  title: "Procurement Path Optimizer — ProcuraCost",
  description:
    "A rule-based model with a 30-run sensitivity sweep recommending a lawful procurement path based on your purchase parameters.",
};

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
          The model compares procurement methods from purchase parameters and applies encoded PZP
          threshold filters for public-sector cases. It is a weighted scoring function, not a trained
          ML model; 30 runs show recommendation sensitivity. It is illustrative and does not replace
          legal analysis or the authority&apos;s internal rules.
        </p>
      </div>
      <PathOptimizer lang="en" />
    </div>
  );
}
