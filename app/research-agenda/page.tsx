import Link from "next/link";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: `Research Agenda ${MODEL_VERSION}: ProcuraCost`,
  description: `Empirical validation agenda for the neutral ProcuraCost ${MODEL_VERSION} model.`,
};

export default function ResearchAgendaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">Research Agenda · Model {MODEL_VERSION}</p>
      <h1 className="mt-2 text-3xl font-bold">Validate mechanisms before monetizing them</h1>
      <p className="mt-4 text-gray-700">
        ProcuraCost is a transparent decision model, not a measured effect. The
        empirical program starts by measuring workflow, competition and contract
        design separately. Instruments require review before data collection.
      </p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Measurement priorities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Workflow: timestamps, parallel work and effort hours by role.</li>
            <li>Competition: bidder participation, qualification and price benchmarks.</li>
            <li>Contract design: clause-level adaptability and amendments.</li>
            <li>Outcomes: delay, lifecycle performance, bypass and audit findings.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Identification rule</h2>
          <p className="mt-3 text-gray-700">
            Estimate component outcomes separately before converting them to money.
            Compare lawful paths under the same governance boundary, control for
            purchase complexity and preserve sign reversals. Do not calibrate data to
            reproduce the Tunnel–Field thesis.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Current status</h2>
          <p className="mt-2 text-sm text-amber-900">
            {`No model-${MODEL_VERSION} survey, preregistration or confirmatory protocol is currently approved. New instruments must be derived from the separated constructs and reviewed before recruitment or data extraction.`}
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/research" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">Working paper</Link>
        <Link href="/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">Methodology</Link>
        <Link href="/model/assumptions" className="rounded-lg border px-5 py-3 text-sm font-semibold">Scenario ranges</Link>
      </div>
    </main>
  );
}
