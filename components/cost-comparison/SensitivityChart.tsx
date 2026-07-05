import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProcurementInputs, formatPLN, formatCompact, calculateCosts } from "@/lib/calculations";
import { comparisonT, Lang } from "@/lib/i18n";

interface Props {
  inputs: ProcurementInputs;
  lang: Lang;
}

const SENSITIVITY_MULTIPLIERS = [0.1, 0.25, 0.5, 1, 2, 5, 10];

export default function SensitivityChart({ inputs, lang }: Props) {
  const tx = comparisonT[lang];

  const sensitivityData = useMemo(() => {
    const baseValue = inputs.contractValue;
    return SENSITIVITY_MULTIPLIERS.map((mult) => {
      const r = calculateCosts({ ...inputs, contractValue: baseValue * mult });
      const label = formatCompact(baseValue * mult);
      return {
        value: label,
        [tx.rigidLabel]: Math.round(r.rigid.total),
        [tx.flexibleLabel]: Math.round(r.flexible.total),
        delta: Math.round(r.delta),
      };
    });
  }, [inputs, tx.rigidLabel, tx.flexibleLabel]);

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-gray-700">{tx.sensitivityTitle}</h3>
      <p className="mb-3 text-xs text-gray-400">{tx.sensitivitySubtitle}</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={sensitivityData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="value"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            label={{ value: "PLN", position: "insideBottomRight", offset: -4, fontSize: 10 }}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <Tooltip
            formatter={(value) => [formatPLN(Number(value ?? 0)), ""]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey={tx.rigidLabel}
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={tx.flexibleLabel}
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="delta"
            stroke="#3b82f6"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
            name={tx.sensitivityCostGapLabel}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-gray-400">{tx.sensitivityFooterNote}</p>
    </div>
  );
}
