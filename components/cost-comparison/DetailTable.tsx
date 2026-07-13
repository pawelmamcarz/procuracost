import { ComparisonResult, formatPLN } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  lang: Lang;
}

export default function DetailTable({ result, lang }: Props) {
  const tx = comparisonT[lang];
  const COST_LABELS = tx.costLabels;
  const { rigid, flexible, delta } = result;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.tableTitle}</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">{tx.colCostDim}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-red-500">{tx.rigidLabel}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-green-500">{tx.flexibleLabel}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">{tx.colDiff}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(Object.keys(COST_LABELS) as Array<keyof typeof COST_LABELS>).map((key) => {
              const r = rigid[key as keyof typeof rigid] as number;
              const f = flexible[key as keyof typeof flexible] as number;
              const diff = r - f;
              return (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{COST_LABELS[key]}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatPLN(r)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatPLN(f)}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {diff > 0 ? (
                      <span className="text-red-500">+{formatPLN(diff)}</span>
                    ) : diff < 0 ? (
                      <span className="text-green-500">{formatPLN(diff)}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3">{lang === "en" ? "TOTAL" : "SUMA"}</td>
              <td className="px-4 py-3 text-right text-red-600">{formatPLN(rigid.total)}</td>
              <td className="px-4 py-3 text-right text-green-600">{formatPLN(flexible.total)}</td>
              <td className="px-4 py-3 text-right text-red-600">+{formatPLN(delta)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
