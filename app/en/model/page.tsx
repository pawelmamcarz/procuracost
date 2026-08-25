import Link from "next/link";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: "Model & assumptions: ProcuraCost",
  description: `Parameters, sources and limits of the neutral ProcuraCost ${MODEL_VERSION} model.`,
};

export default function ModelPageEn() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost {MODEL_VERSION}</p>
      <h1 className="mt-2 text-3xl font-bold">Model and assumptions</h1>
      <p className="mt-4 text-lg text-gray-600">
        The model compares a formal/sequential path with an adaptive/compliant
        path for the same purchase. Both share the same legal and control boundary.
      </p>

      <section className="mt-10 space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">What the studies estimate</h2>
        <p>
          Szucs (2024) estimates, in the structural specification, about a 6% price
          increase and about 10% lower average productivity of selected contractors
          under discretion; the effect is identified on contracts below a threshold of
          roughly 25 million HUF. Beuve, Moszoro and Spiller (2023) estimate 0.077–0.105
          additional formal amendments per contract-year for a simultaneous
          one-standard-deviation increase in each of the seven rigidity categories, in
          French car-park contracts. This is not an event probability.
        </p>
        <h2 className="text-xl font-semibold text-gray-900">What the model assumes</h2>
        <p>
          Competition and contract profiles, effort, technology and
          bypass rates are scenario calibrations. They are not measurements of
          Polish organizations. TCO is zero centrally and stress-tested at 0–15%.
          Read every result with its low/central/high range;
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
