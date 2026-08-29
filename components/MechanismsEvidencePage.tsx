import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import { mechanismsEvidenceT, type Lang } from "@/lib/i18n";
import { EVIDENCE_REGISTRY } from "@/lib/model-v2";

export interface MechanismsEvidencePageProps {
  lang: Lang;
}

export default function MechanismsEvidencePage({
  lang,
}: MechanismsEvidencePageProps) {
  const tx = mechanismsEvidenceT[lang];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="max-w-3xl border-b border-gray-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          {tx.introduction}
        </p>
      </header>

      <section className="py-10" aria-labelledby="mechanisms-evidence-register">
        <div className="mb-7 max-w-3xl">
          <h2
            id="mechanisms-evidence-register"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            {tx.registerTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {tx.registerDescription}
          </p>
        </div>
        <EvidenceDocket
          lang={lang}
          records={EVIDENCE_REGISTRY}
          variant="full"
        />
        <p className="mt-7 max-w-3xl border-l-2 border-blue-700 pl-4 text-sm leading-6 text-gray-700">
          {tx.scopeNote}
        </p>
      </section>
    </div>
  );
}
