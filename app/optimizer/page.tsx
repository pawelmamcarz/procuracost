import PathOptimizer from "@/components/PathOptimizer";

export default function OptimizerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Transparentna heurystyka — 30 wariantów scoringu
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Optymalizator ścieżki zakupowej
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Narzędzie porządkuje możliwe metody zakupu na podstawie jawnych reguł i parametrów
          scenariusza. Nota PZP ma charakter orientacyjny i nie stanowi automatycznej
          weryfikacji prawnej. Progi zaktualizowano dla lat 2026–2027.
        </p>
        <a
          href="https://www.gov.pl/web/uzp/aktualne-progi-unijne-oraz-ich-rownowartosci-w-zlotych-na-lata-2026-2027"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-blue-600 underline"
        >
          Źródło progów: Urząd Zamówień Publicznych
        </a>
      </div>
      <PathOptimizer />
    </div>
  );
}
