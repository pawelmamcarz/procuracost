import Link from "next/link";

export const metadata = {
  title: "Model 2.1 Methodology | ProcuraCost",
  description: "Neutral comparative model with explicit scenario uncertainty.",
};

export default function EnMethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Model 2.1</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">A methodology without a built-in winner</h1>
        <p className="mt-2 text-sm text-gray-600">
          The formal/sequential and adaptive/compliant paths share the same legal, competition,
          ethics, authorization, and documentation boundary.
        </p>
      </header>

      <section>
        <h2 className="font-bold text-gray-900">Separate constructs</h2>
        <p className="mt-2 text-sm text-gray-600">
          Workflow formality is no longer treated as a proxy for competition, contract rigidity,
          system control, or discretion. Each mechanism has a separate parameter and evidence caveat.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Seven cost dimensions</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-gray-600">
          <li>activity- and role-level staff effort;</li>
          <li>non-labor administrative overhead plus equal technology cost;</li>
          <li>delay valued with user-supplied cost of inaction;</li>
          <li>selection risk driven by competition effectiveness;</li>
          <li>annual formal-amendment frequency driven by contract rigidity and contract duration;</li>
          <li>a TCO scenario pool that is zero in the central case;</li>
          <li>a scenario bypass rate, not an invented probability curve.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="font-bold text-amber-900">Reading the range</h2>
        <p className="mt-2 text-sm text-amber-800">
          The low and high ΔC values are assumption stress tests, not confidence intervals. A range
          crossing zero means the model does not identify a robust winner.
          The break-even threshold states the daily inaction cost at which the central result
          starts to favor the faster adaptive path.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">PZP boundary</h2>
        <p className="mt-2 text-sm text-gray-600">
          The adaptive path does not change the applicable PZP procedure; it changes only
          non-mandatory internal work. Publication and standstill periods are not shortened.
          The optimizer applies the PLN 170,000 threshold and the relevant EU threshold. It offers
          only the basic mode in the national band and, by default, only open or restricted tender
          above the EU threshold. Special procedures require a separate legal-grounds assessment.
        </p>
      </section>

      <p className="text-sm"><Link href="/research" className="font-medium text-blue-600 hover:underline">Full working paper and verified references →</Link></p>
    </div>
  );
}
