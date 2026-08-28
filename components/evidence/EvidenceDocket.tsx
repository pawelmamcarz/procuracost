import { ExternalLink, Info } from "lucide-react";

import {
  decisionRecordT,
  modelV2T,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { EvidenceRecord } from "@/lib/model-v2";
import { cn } from "@/lib/utils";

export interface EvidenceDocketProps {
  lang: Lang;
  records: readonly EvidenceRecord[];
  variant: "compact" | "full" | "decision-record";
}

function modelCopy(lang: Lang, key: string): string {
  let value: unknown = modelV2T[lang];
  for (const segment of key.split(".")) {
    if (!value || typeof value !== "object" || !(segment in value)) {
      throw new Error(`Missing ${lang} model copy for ${key}`);
    }
    value = (value as Record<string, unknown>)[segment];
  }
  if (typeof value !== "string") {
    throw new Error(`Model copy key ${key} is not a string`);
  }
  return value;
}

function formatPublishedOn(value: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  return new Intl.DateTimeFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  );
}

export default function EvidenceDocket({
  lang,
  records,
  variant,
}: EvidenceDocketProps) {
  const tx = decisionRecordT[lang].evidence;
  const exportTx = researchExportV2T[lang];

  return (
    <ol
      className="divide-y divide-gray-200 border-y border-gray-200"
      data-evidence-variant={variant}
    >
      {records.map((record) => {
        const title = modelCopy(lang, record.source.titleKey);
        const publisher = modelCopy(lang, record.source.publisherKey);
        return (
          <li
            className={cn(
              "space-y-5 py-6",
              variant === "compact" ? "sm:py-5" : "sm:py-7"
            )}
            data-evidence-id={record.id}
            key={record.id}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs text-gray-500">{record.id}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {title}
                </p>
              </div>
              <p className="text-xs font-medium text-gray-600">
                {
                  (exportTx.evidenceClasses as Record<string, string>)[
                    record.type
                  ]
                }
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tx.supported}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {modelCopy(lang, record.supportedClaimKey)}
                </p>
              </div>
              <div className="border-l-2 border-amber-400 pl-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
                  <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {tx.unsupported}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {modelCopy(lang, record.unsupportedClaimKey)}
                </p>
              </div>
            </div>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  {tx.population}
                </dt>
                <dd className="mt-1 leading-relaxed text-gray-700">
                  {modelCopy(lang, record.jurisdictionOrPopulationKey)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  {tx.constructs}
                </dt>
                <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-gray-700">
                  {record.constructs.map((construct) => (
                    <span
                      data-evidence-construct={construct}
                      key={construct}
                    >
                      {tx.constructsById[construct]}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="font-medium text-gray-600">{tx.publisher}: </span>
                {publisher}
                {record.source.publishedOn ? (
                  <>
                    {" "}
                    <time dateTime={record.source.publishedOn}>
                      {formatPublishedOn(record.source.publishedOn, lang)}
                    </time>
                  </>
                ) : null}
              </p>
              <a
                aria-label={tx.externalLink(title)}
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                href={record.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {tx.openSource}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
