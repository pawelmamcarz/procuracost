import PathOptimizer from "@/components/PathOptimizer";

export default function OptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Model regułowy — analiza wrażliwości (30 przebiegów)
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Optymalizator ścieżki zakupowej
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Model rekomenduje metodę zakupu (ścieżkę przez pole polityki zakupowej) na podstawie
          parametrów zakupu; rekomendacje dla sektora publicznego są filtrowane do dopuszczalnych
          trybów PZP. To ważona funkcja oceny (nie trenowana sieć ML); 30 przebiegów to analiza
          wrażliwości pokazująca stabilność rekomendacji. Narzędzie ilustracyjne.
        </p>
      </div>
      <PathOptimizer />
    </div>
  );
}
