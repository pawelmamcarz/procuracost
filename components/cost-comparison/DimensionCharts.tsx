import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { ComparisonResult, formatPLN, formatCompact } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  result: ComparisonResult;
  lang: Lang;
}

const RADAR_DIMENSIONS = [
  { key: "timeCost", label: { pl: "Czas", en: "Time" } },
  { key: "opportunityCost", label: { pl: "Okazje", en: "Opportunity" } },
  { key: "renegotiationCost", label: { pl: "Renegocjacje", en: "Renegotiation" } },
  { key: "tcoCost", label: { pl: "TCO", en: "TCO" } },
  { key: "bypassCost", label: { pl: "Obejście", en: "Bypass" } },
  { key: "productivityCost", label: { pl: "Jakość wyboru", en: "Selection" } },
] as const;

export default function DimensionCharts({ result, lang }: Props) {
  const tx = comparisonT[lang];
  const COST_LABELS = tx.costLabels;
  const { rigid, flexible } = result;

  const chartData = (Object.keys(COST_LABELS) as Array<keyof typeof COST_LABELS>).map((key) => ({
    name: COST_LABELS[key],
    [tx.rigidLabel]: rigid[key as keyof typeof rigid] as number,
    [tx.flexibleLabel]: flexible[key as keyof typeof flexible] as number,
  }));

  const radarData = RADAR_DIMENSIONS.map(({ key, label }) => {
    const r = rigid[key as keyof typeof rigid] as number;
    const f = flexible[key as keyof typeof flexible] as number;
    const maxVal = Math.max(r, f, 1);
    return {
      dimension: label[lang],
      [tx.rigidLabel]: Math.round((r / maxVal) * 100),
      [tx.flexibleLabel]: Math.round((f / maxVal) * 100),
    };
  });

  return (
    <>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.chartTitle}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value) => [formatPLN(Number(value ?? 0)), ""]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
            <Bar dataKey={tx.rigidLabel} fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey={tx.flexibleLabel} fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">{tx.radarTitle}</h3>
        <p className="mb-3 text-xs text-gray-400">{tx.radarSubtitle}</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Radar
              name={tx.rigidLabel}
              dataKey={tx.rigidLabel}
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.18}
            />
            <Radar
              name={tx.flexibleLabel}
              dataKey={tx.flexibleLabel}
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.18}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
