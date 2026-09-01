import Link from "next/link";

import { footerT, type Lang } from "@/lib/i18n";
import { VERSION } from "@/lib/version";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const tx = footerT[lang];
  const prefix = lang === "en" ? "/en" : "";

  return (
    <footer className="border-t-4 border-blue-700 bg-gray-50 px-5 py-8 text-xs text-gray-600 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-gray-900">ProcuraCost</span>
            <span className="font-mono text-gray-500">{VERSION}</span>
          </p>
          <p className="mt-2 max-w-2xl leading-5">{tx.modelNote}</p>
          <p className="mt-1 max-w-2xl leading-5 text-gray-500">
            {tx.localDraftNote}
          </p>
        </div>
        <nav
          aria-label={tx.resourceNavigation}
          className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 md:justify-end"
        >
          <Link className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700" href={`${prefix}/methodology`}>
            {tx.methodology}
          </Link>
          <Link className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700" href={`${prefix}/case-studies`}>
            {tx.evidence}
          </Link>
          <Link className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700" href={`${prefix}/team`}>
            {tx.team}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
