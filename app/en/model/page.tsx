import Link from "next/link";

export const metadata = {
  title: "Model & assumptions — ProcuraCost",
  description: "Parameters, sources and limits of the neutral ProcuraCost 2.0 model.",
};

export default function ModelPageEn() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost 2.0</p>
      <h1 className="mt-2 text-3xl font-bold">Model and assumptions</h1>
      <p className="mt-4 text-lg text-gray-600">
        The model compares a formal/sequential path with an adaptive/compliant
        path for the same purchase. Both share the same legal and control boundary.
      </p>

      <section className="mt-10 space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">What the studies estimate</h2>
        <p>
          Szucs (2024) estimates about a 6 pp increase in normalized price and 28%
          lower measured productivity of selected contractors under discretion.
          Beuve, Moszoro and Spiller (2023) estimate a 7.7–10.5 pp renegotiation
          increase per standard deviation of contractual rigidity in one sector.
        </p>
        <h2 className="text-xl font-semibold text-gray-900">What the model assumes</h2>
        <p>
          Competition, contract and TCO-capture profiles, effort, technology and
          bypass rates are scenario calibrations. They are not measurements of
          Polish organizations. Read every result with its low/central/high range;
          that range is not a confidence interval.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/en/model/assumptions" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">View ranges</Link>
        <Link href="/en/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">Methodology</Link>
        <Link href="/research" className="rounded-lg border px-5 py-3 text-sm font-semibold">Source audit</Link>
      </div>
    </main>
  );
}
