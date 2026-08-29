import type { Metadata } from "next";
import ReadinessDiagnostic from "@/components/ReadinessDiagnostic";
import { readinessT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "readiness",
  ...readinessT.en.metadata,
});

export default function EnReadinessPage() {
  const tx = readinessT.en;
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {tx.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{tx.subtitle}</p>
        <p className="mt-3 font-mono text-xs text-gray-400">{tx.duration}</p>
      </header>
      <div className="mt-10">
        <ReadinessDiagnostic lang="en" />
      </div>
    </div>
  );
}
