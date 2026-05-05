import PathOptimizer from "@/components/PathOptimizer";

export default function OptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Random Forest — 30 drzew decyzyjnych
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Optymalizator ścieżki zakupowej
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Model rekomenduje optymalną metodę zakupu (ścieżkę przez pole polityki zakupowej)
          na podstawie parametrów zakupu. Zgodność z PZP weryfikowana automatycznie.
          Algorytm: ensemble 30 drzew decyzyjnych z losowymi podzbiorami cech — Breiman (2001).
        </p>
      </div>
      <PathOptimizer />
    </div>
  );
}
