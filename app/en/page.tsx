import Link from "next/link";

const stats = [
  { value: "+2%", label: "higher contract prices under rigid procedures", source: "Szucs, JEEA 2024" },
  { value: "+7.7%", label: "increased renegotiation risk", source: "Beuve et al., NBER 2021" },
  { value: "42%", label: "longer project delivery times", source: "World Bank, 2023" },
  { value: "30%", label: "potential TCO savings with flexibility", source: "ISM" },
];

const principles = [
  {
    title: "Procedure ≠ Policy",
    body: "A procurement policy sets the principles and boundaries. A procedure is just one of many ways to implement them. Conflating the two costs organisations millions.",
  },
  {
    title: "The buyer as strategist",
    body: "Rigid procedures absolve the buyer of thinking — 'I followed the procedure, I'm safe.' A procurement policy demands reflection and creativity.",
  },
  {
    title: "Costs are measurable",
    body: "Every day of delay, every renegotiation, every missed opportunity has a price. This calculator helps you see it.",
  },
];

export default function EnHomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Research & Consulting Tool
        </span>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          What does procedure lock-in
          <br />
          actually cost you?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Rigid tender procedures generate measurable opportunity costs. This calculator lets you
          compare the real costs of a strict procedure against a policy-only flexible approach.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en/calculator"
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open calculator →
          </Link>
          <Link
            href="/methodology"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Methodology
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-700">{s.value}</p>
            <p className="mt-1 text-xs text-gray-600">{s.label}</p>
            <p className="mt-2 text-xs text-gray-400">{s.source}</p>
          </div>
        ))}
      </div>

      {/* Principles */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {principles.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-900">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Pipe vs. Field */}
      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">The Pipe vs. Field model</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">
              Procedure = Pipe
            </p>
            <p className="text-sm text-red-800">
              One path, one direction. Compliance is binary — you&apos;re either in the pipe or outside
              it. Under time pressure, people bypass it informally (email, phone, Excel). The bypass
              is invisible and accumulates risk.
            </p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">
              Policy + System = Field
            </p>
            <p className="text-sm text-green-800">
              Many paths, all safe. The ERP/AI system enforces boundaries continuously in real time.
              The buyer is a navigator, not an executor. There is nothing to bypass — the boundaries
              are everywhere and always active.
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-blue-600">
          Theoretical basis: Lipsky (1980), Vaughan (1996), Holmström &amp; Milgrom (1991),
          Breiman (2001)
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Analyse your scenario</h2>
        <p className="mt-2 text-blue-100">
          Choose a pre-built scenario or enter your own data. The result includes a detailed cost
          breakdown with academic citations.
        </p>
        <Link
          href="/en/calculator"
          className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Go to calculator
        </Link>
      </div>
    </div>
  );
}
