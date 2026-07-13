import Link from "next/link";

export const metadata = {
  title: "Model i założenia — ProcuraCost",
  description: "Parametry, źródła i ograniczenia neutralnego modelu ProcuraCost 2.0.",
};

export default function ModelPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost 2.0</p>
      <h1 className="mt-2 text-3xl font-bold">Model i założenia</h1>
      <p className="mt-4 text-lg text-gray-600">
        Model porównuje formalną/sekwencyjną i adaptacyjną/zgodną ścieżkę tego
        samego zakupu. Obie podlegają tej samej granicy prawnej i kontrolnej.
      </p>

      <section className="mt-10 space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Co jest wynikiem badań</h2>
        <p>
          Szucs (2024) szacuje około 6 pp wzrostu znormalizowanej ceny i 28% niższą
          produktywność wybranych wykonawców przy dyskrecji. Beuve, Moszoro i Spiller
          (2023) szacują 7,7–10,5 pp wzrostu prawdopodobieństwa renegocjacji na jedno
          odchylenie standardowe sztywności kontraktowej w konkretnym sektorze.
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Co jest założeniem</h2>
        <p>
          Profile konkurencji, kontraktu i przechwycenia TCO, nakład pracy,
          technologia oraz stopy obejścia są kalibracjami scenariuszowymi. Nie są
          pomiarami polskich organizacji. Wynik zawsze należy czytać z zakresem
          low/central/high, który nie jest przedziałem ufności.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/model/assumptions" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">Zobacz zakresy</Link>
        <Link href="/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">Metodologia</Link>
        <Link href="/research" className="rounded-lg border px-5 py-3 text-sm font-semibold">Audyt źródeł</Link>
      </div>
    </main>
  );
}
