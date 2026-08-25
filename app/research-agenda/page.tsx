import Link from "next/link";
import { researchAgendaT } from "@/lib/i18n";
import { MODEL_VERSION } from "@/lib/version";

const tx = researchAgendaT.pl;

export const metadata = {
  title: tx.metadataTitle(MODEL_VERSION),
  description: tx.metadataDescription(MODEL_VERSION),
};

export default function ResearchAgendaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">{tx.eyebrow(MODEL_VERSION)}</p>
      <h1 className="mt-2 text-3xl font-bold">{tx.title}</h1>
      <p className="mt-4 text-gray-700">{tx.intro}</p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{tx.prioritiesTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            {tx.priorities.map((priority) => <li key={priority}>{priority}</li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{tx.identificationTitle}</h2>
          <p className="mt-3 text-gray-700">{tx.identificationRule}</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">{tx.statusTitle}</h2>
          <p className="mt-2 text-sm text-amber-900">{tx.status(MODEL_VERSION)}</p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/research" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">{tx.actions.paper}</Link>
        <Link href="/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">{tx.actions.methodology}</Link>
        <Link href="/model/assumptions" className="rounded-lg border px-5 py-3 text-sm font-semibold">{tx.actions.scenarios}</Link>
      </div>
    </main>
  );
}
