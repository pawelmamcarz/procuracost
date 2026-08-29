import PrintButton from "./PrintButton";
import { researchPaperT } from "@/lib/i18n";

const tx = researchPaperT.en;

export const metadata = tx.metadata;

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            {tx.eyebrow}
          </p>
          <p className="mt-2 font-mono text-xs text-gray-500">
            {tx.provenance}
          </p>
        </div>
        <PrintButton label={tx.printAction} />
      </div>

      <article className="prose prose-sm max-w-none text-gray-800">
        <h1>{tx.title}</h1>

        <h2>{tx.abstractTitle}</h2>
        {tx.abstract.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

        <h2>{tx.modelContract.title}</h2>
        <ul>
          {tx.modelContract.items.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2>{tx.resultBoundary.title}</h2>
        <p><code>{tx.resultBoundary.formula}</code></p>
        <p>{tx.resultBoundary.body}</p>

        <h2>{tx.coverage.title}</h2>
        <p>{tx.coverage.body}</p>

        <h2>{tx.evidenceBoundary.title}</h2>
        <p>{tx.evidenceBoundary.body}</p>
        <ul>
          {tx.evidenceBoundary.items.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2>{tx.practitionerTitle}</h2>
        <p>{tx.practitionerBoundary}</p>

        <h2>{tx.scope.title}</h2>
        <ul>{tx.scope.items.map((item) => <li key={item}>{item}</li>)}</ul>

        <h2>{tx.referencesTitle}</h2>
        <ul>
          {tx.references.map((reference) => (
            <li key={reference.href}>
              <a href={reference.href}>{reference.label}</a>
            </li>
          ))}
        </ul>

        <p className="border-t pt-4 text-xs text-gray-500">
          {tx.repositoryNote}
        </p>
      </article>
    </div>
  );
}
