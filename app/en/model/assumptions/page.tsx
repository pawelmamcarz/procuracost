import Link from "next/link";
import { calculateCosts } from "@/lib/calculations";
import { SCENARIOS } from "@/lib/scenarios";

export default function AssumptionsPageEn() {
  const example = SCENARIOS[0];
  const result = calculateCosts(example.inputs);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">ProcuraCost 2.0</p>
      <h1 className="mt-2 text-3xl font-bold">Model assumptions and uncertainty</h1>
      <p className="mt-4 text-gray-600">
        The model compares a formal/sequential path with an adaptive/compliant
        path for the same purchase. It does not assume a winner. Weakly evidenced
        parameters are scenarios, not empirical findings.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Supplier selection", "0.02–0.09 of value; Szucs anchors direction and the 0.06 point."],
          ["Renegotiation", "0–10.5 pp; only the incremental contract-rigidity effect."],
          ["TCO and bypass", "TCO 0–15%; bypass 1–30%. Both ranges are assumptions."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl bg-gray-50 p-6">
        <h2 className="font-semibold">Control example: {example.nameEn}</h2>
        <p className="mt-2 text-sm text-gray-700">
          Central formal − adaptive difference: PLN {Math.round(result.delta).toLocaleString("en-GB")}.
          Scenario range: PLN {Math.round(result.uncertainty.lowDelta).toLocaleString("en-GB")}–
          {Math.round(result.uncertainty.highDelta).toLocaleString("en-GB")}
          {result.uncertainty.crossesZero ? "; the sign is not robust." : "; the sign is robust within this range."}
        </p>
      </section>

      <p className="mt-6 text-sm text-gray-600">
        See the <Link href="/en/methodology" className="text-blue-700 underline">methodology</Link>{" "}
        for equations, parameter provenance, and transfer limits. Inputs and results
        can be exported from the calculator.
      </p>
    </main>
  );
}
