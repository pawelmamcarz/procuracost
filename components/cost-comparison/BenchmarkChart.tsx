import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ComparisonResult, calculateCosts } from "@/lib/calculations";
import { SCENARIOS } from "@/lib/scenarios";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  lang: Lang;
}

export default function BenchmarkChart({ result, lang }: Props) {
  const tx = comparisonT[lang];
  const { delta, flexible } = result;

  const benchmarkData = useMemo(() => {
    const refItems = SCENARIOS.filter((s) => s.caseStudy).map((s) => {
      const r = calculateCosts(s.inputs);
      const premium = r.flexible.total > 0 ? Math.round((r.delta / r.flexible.total) * 100) : 0;
      return { name: lang === "en" ? s.nameEn : s.name, premium, isUser: false as boolean };
    });
    const userPremium = flexible.total > 0 ? Math.round((delta / flexible.total) * 100) : 0;
    const userEntry = { name: tx.benchmarkYours, premium: userPremium, isUser: true as boolean };
    const sorted = [...refItems, userEntry].sort((a, b) => a.premium - b.premium);
    const higherThanCount = refItems.filter((x) => x.premium < userPremium).length;
    return { data: sorted, userPremium, higherThanCount, total: refItems.length };
  }, [lang, delta, flexible.total, tx.benchmarkYours]);

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-gray-700">{tx.benchmarkTitle}</h3>
      <p className="mb-3 text-xs text-gray-400">{tx.benchmarkSubtitle}</p>
      <ResponsiveContainer width="100%" height={Math.max(180, benchmarkData.data.length * 28)}>
        <BarChart
          data={benchmarkData.data}
          layout="vertical"
          margin={{ top: 0, right: 50, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#374151" }}
            width={140}
          />
          <Tooltip formatter={(v) => [`${v}%`, lang === "en" ? "Premium" : "Premia"]} contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="premium" radius={[0, 4, 4, 0]}>
            {benchmarkData.data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.isUser ? "#3b82f6" : "#d1d5db"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-gray-500">
        {tx.benchmarkSummary(benchmarkData.userPremium, benchmarkData.higherThanCount, benchmarkData.total)}
      </p>
    </div>
  );
}
