import Link from "next/link";

import {
  contextualToolT,
  type ContextualToolStage,
  type Lang,
} from "@/lib/i18n";

export default function ContextualToolNotice({
  lang,
  stage,
}: {
  lang: Lang;
  stage: ContextualToolStage;
}) {
  const tx = contextualToolT[lang][stage];
  const prefix = lang === "en" ? "/en" : "";

  return (
    <aside
      className="mb-8 grid gap-4 border-y border-blue-200 bg-blue-50 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      data-contextual-tool-stage={stage}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">
          {tx.label}
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-700">
          {tx.body}
        </p>
      </div>
      <Link
        className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4"
        href={`${prefix}/calculator#${stage}`}
      >
        {tx.action}
      </Link>
    </aside>
  );
}
