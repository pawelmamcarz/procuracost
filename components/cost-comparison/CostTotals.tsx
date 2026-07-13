import { ComparisonResult, formatPLN } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  lang: Lang;
}

export default function CostTotals({ result, lang }: Props) {
  const tx = comparisonT[lang];
  const { rigid, flexible } = result;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-500">{tx.rigidLabel}</p>
        <p className="mt-1 text-2xl font-bold text-red-700">{formatPLN(rigid.total)}</p>
        <div className="mt-2 space-y-0.5 text-xs text-red-400">
          <div>{tx.staffCost}: {formatPLN(rigid.staffCost)}</div>
          <div>{tx.coordCost}: {formatPLN(rigid.coordCost)}</div>
          <div>{tx.toolCost}: {formatPLN(rigid.toolCost)}</div>
        </div>
      </div>
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-500">{tx.flexibleLabel}</p>
        <p className="mt-1 text-2xl font-bold text-green-700">{formatPLN(flexible.total)}</p>
        <div className="mt-2 space-y-0.5 text-xs text-green-400">
          <div>{tx.staffCost}: {formatPLN(flexible.staffCost)}</div>
          <div>{tx.coordCost}: {formatPLN(flexible.coordCost)}</div>
          <div>{tx.toolCost}: {formatPLN(flexible.toolCost)}</div>
        </div>
      </div>
    </div>
  );
}
