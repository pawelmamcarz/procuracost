"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ComparisonResult, formatPLN, formatPercent } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
}

const COST_LABELS: Record<string, string> = {
  timeCost: "Koszt czasu",
  adminCost: "Koszty admin.",
  opportunityCost: "Utracone okazje",
  renegotiationCost: "Renegocjacje",
  tcoCost: "Utracone oszczędności TCO",
};

export default function CostComparison({ result, scenario }: Props) {
  const { rigid, flexible, delta, deltaPercent, sources } = result;

  const chartData = (Object.keys(COST_LABELS) as Array<keyof typeof rigid>).map((key) => ({
    name: COST_LABELS[key],
    "Procedura sztywna": rigid[key as keyof typeof rigid] as number,
    "Polityka zakupowa": flexible[key as keyof typeof flexible] as number,
  }));

  const summaryData = [
    {
      name: "SUMA",
      "Procedura sztywna": rigid.total,
      "Polityka zakupowa": flexible.total,
    },
  ];

  const sourcesEntries = Object.entries(sources);

  return (
    <div className="space-y-8">
      {/* Delta headline */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
        <p className="text-sm font-medium uppercase tracking-wide opacity-80">
          Koszt utracony przywiązania do procedur
        </p>
        <p className="mt-1 text-4xl font-bold">{formatPLN(delta)}</p>
        <p className="mt-1 text-lg opacity-90">
          {formatPercent(deltaPercent)} wyższy niż podejście oparte na polityce zakupowej
        </p>
        {scenario.caseStudy && (
          <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
            <p className="font-semibold">{scenario.caseStudy.title}</p>
            <p className="mt-1 opacity-90">{scenario.caseStudy.insight}</p>
            <p className="mt-1 text-xs opacity-60">Źródło: {scenario.caseStudy.source}</p>
          </div>
        )}
      </div>

      {/* Side-by-side totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
            Procedura sztywna
          </p>
          <p className="mt-1 text-2xl font-bold text-red-700">{formatPLN(rigid.total)}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-500">
            Polityka zakupowa
          </p>
          <p className="mt-1 text-2xl font-bold text-green-700">{formatPLN(flexible.total)}</p>
        </div>
      </div>

      {/* Stacked bar chart */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Porównanie wg wymiaru kosztów</h3>
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
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1000
                  ? `${(v / 1000).toFixed(0)}k`
                  : `${v}`
              }
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value) => [formatPLN(Number(value ?? 0)), ""]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
            <Bar dataKey="Procedura sztywna" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Polityka zakupowa" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed breakdown table */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Szczegółowe zestawienie</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Wymiar kosztów</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-red-500">Procedura sztywna</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-green-500">Polityka zakupowa</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Różnica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(Object.keys(COST_LABELS) as Array<keyof typeof rigid>).map((key) => {
                const r = rigid[key as keyof typeof rigid] as number;
                const f = flexible[key as keyof typeof flexible] as number;
                const diff = r - f;
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{COST_LABELS[key]}</td>
                    <td className="px-4 py-3 text-right text-red-600">{formatPLN(r)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatPLN(f)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-600">
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
                <td className="px-4 py-3">SUMA</td>
                <td className="px-4 py-3 text-right text-red-600">{formatPLN(rigid.total)}</td>
                <td className="px-4 py-3 text-right text-green-600">{formatPLN(flexible.total)}</td>
                <td className="px-4 py-3 text-right text-red-600">+{formatPLN(delta)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Sources */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Źródła naukowe modelu
        </h3>
        <ul className="space-y-1">
          {sourcesEntries.map(([key, src]) => (
            <li key={key} className="text-xs text-gray-500">
              <span className="font-medium text-gray-600">{COST_LABELS[key]}:</span> {src}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
