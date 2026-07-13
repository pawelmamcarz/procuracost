import { ComparisonResult } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  lang: Lang;
}

export default function SourcesList({ result, lang }: Props) {
  const tx = comparisonT[lang];
  const COST_LABELS = tx.costLabels;
  const sourcesEntries = Object.entries(result.sources);

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {tx.sourcesTitle}
      </h3>
      <ul className="space-y-1">
        {sourcesEntries.map(([key, src]) => (
          <li key={key} className="text-xs text-gray-500">
            <span className="font-medium text-gray-600">
              {COST_LABELS[key as keyof typeof COST_LABELS]}:
            </span>{" "}
            {src}
          </li>
        ))}
      </ul>
    </div>
  );
}
