import Link from "next/link";
import { calculateCosts } from "@/lib/calculations";
import { SCENARIOS } from "@/lib/scenarios";

export default function AssumptionsPage() {
  const example = SCENARIOS[0];
  const result = calculateCosts(example.inputs);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost 2.1</p>
      <h1 className="mt-2 text-3xl font-bold">Założenia i niepewność modelu</h1>
      <p className="mt-4 text-gray-600">
        Model porównuje formalną/sekwencyjną i adaptacyjną/zgodną ścieżkę tego
        samego zakupu. Nie zakłada z góry zwycięzcy. Słabo udokumentowane
        parametry są scenariuszami, a nie wynikami badań.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Dobór dostawcy", "Premia cenowa 2–9%; koszt mnoży ją jeszcze przez resztkowe ryzyko konkurencji i kontekst. Szucs kotwiczy punkt 6%."],
          ["Formalne aneksy", "0–0,105 aneksu na rok kontraktu; częstość zależna wyłącznie od profilu sztywności kontraktu."],
          ["TCO i obejścia", "TCO: centralnie 0%, trzyletni stres-test do 15%. Bazowe stopy obejść 1–30% są dalej skalowane kontrolą systemową. To założenia."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl bg-gray-50 p-6">
        <h2 className="font-semibold">Przykład kontrolny: {example.name}</h2>
        <p className="mt-2 text-sm text-gray-700">
          Centralna różnica formalna − adaptacyjna: {Math.round(result.delta).toLocaleString("pl-PL")} zł.
          Zakres scenariuszowy: {Math.round(result.uncertainty.lowDelta).toLocaleString("pl-PL")}–
          {Math.round(result.uncertainty.highDelta).toLocaleString("pl-PL")} zł
          {result.uncertainty.crossesZero ? "; znak wyniku nie jest odporny." : "; znak wyniku jest odporny w tym zakresie."}
        </p>
      </section>

      <p className="mt-6 text-sm text-gray-600">
        Pełne równania, pochodzenie parametrów i ograniczenia transferu opisuje{" "}
        <Link href="/methodology" className="text-blue-700 underline">metodologia</Link>.
        Dane wejściowe i wynik można wyeksportować z kalkulatora.
      </p>
    </main>
  );
}
