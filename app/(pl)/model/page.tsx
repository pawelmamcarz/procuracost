import Link from "next/link";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: "Model i założenia: ProcuraCost",
  description: `Parametry, źródła i ograniczenia neutralnego modelu ProcuraCost ${MODEL_VERSION}.`,
};

export default function ModelPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost {MODEL_VERSION}</p>
      <h1 className="mt-2 text-3xl font-bold">Model i założenia</h1>
      <p className="mt-4 text-lg text-gray-600">
        Model porównuje formalną/sekwencyjną i adaptacyjną/zgodną ścieżkę tego
        samego zakupu. Obie podlegają tej samej granicy prawnej i kontrolnej.
      </p>

      <section className="mt-10 space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Co jest wynikiem badań</h2>
        <p>
          Szucs (2024) w estymatach strukturalnych szacuje około 6% wzrostu ceny i około
          10% niższą produktywność wybranych wykonawców przy dyskrecji; efekt
          zidentyfikowano na zamówieniach poniżej progu ok. 25 mln HUF. Beuve, Moszoro
          i Spiller (2023) szacują wzrost częstości formalnych aneksów o 0,077–0,105 na
          rok kontraktu przy jednoczesnym wzroście o jedno odchylenie standardowe
          w każdej z siedmiu kategorii sztywności, w badanych francuskich kontraktach
          parkingowych. To nie jest prawdopodobieństwo zdarzenia.
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Co jest założeniem</h2>
        <p>
          Profile konkurencji i kontraktu, nakład pracy,
          technologia oraz stopy obejścia są kalibracjami scenariuszowymi. Nie są
          pomiarami polskich organizacji. TCO ma zerowy scenariusz centralny i zakres
          stresowy 0–15%. Wynik należy czytać z zakresem
          low/central/high, który nie jest przedziałem ufności.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/model/assumptions" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">Zobacz zakresy</Link>
        <Link href="/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">Metodologia</Link>
        <Link href="/research" className="rounded-lg border px-5 py-3 text-sm font-semibold">Audyt źródeł</Link>
      </div>
    </div>
  );
}
