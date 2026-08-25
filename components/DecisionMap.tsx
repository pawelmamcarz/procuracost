import {
  buildDecisionRegimes,
  DECISION_MAP_AXIS_MAX,
  type DecisionKind,
} from "@/lib/decision-map";
import { decisionMapT, type Lang } from "@/lib/i18n";

const COLORS: Record<DecisionKind, string> = {
  formal: "#ef4444",
  undecided: "#f59e0b",
  adaptive: "#22c55e",
};

const REGIMES = buildDecisionRegimes();

interface Props {
  lang?: Lang;
}

export default function DecisionMap({ lang = "pl" }: Props) {
  const tx = decisionMapT[lang];
  const labelWidth = 200;
  const stripWidth = 460;
  const rowHeight = 30;
  const gap = 10;
  const top = 26;
  const height = top + REGIMES.length * (rowHeight + gap) + 34;
  const width = labelWidth + stripWidth + 16;
  const x = (value: number) => labelWidth + (value / DECISION_MAP_AXIS_MAX) * stripWidth;
  const formatContractValue = (value: number) =>
    value >= 1_000_000 ? `${value / 1_000_000}M` : `${value / 1_000}k`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {tx.eyebrow}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">
        {tx.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
        {(["formal", "undecided", "adaptive"] as const).map((kind) => (
          <span key={kind} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS[kind] }}
            />
            {tx.legend[kind]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-0 border-l-2 border-dashed border-blue-600" />
          {tx.legend.central}
        </span>
      </div>

      <div className="mt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[560px]"
          role="img"
          aria-label={tx.ariaLabel}
        >
          {[0, 2_000, 4_000, 6_000].map((tick) => (
            <g key={tick}>
              <line
                x1={x(tick)}
                y1={top - 6}
                x2={x(tick)}
                y2={height - 28}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={x(tick)}
                y={height - 12}
                textAnchor="middle"
                fontSize={10}
                fill="#9ca3af"
              >
                {tick === 0 ? "0" : `${tick / 1_000}k`}
              </text>
            </g>
          ))}
          <text
            x={x(DECISION_MAP_AXIS_MAX)}
            y={top - 12}
            textAnchor="end"
            fontSize={10}
            fill="#9ca3af"
          >
            {tx.axisLabel}
          </text>

          {REGIMES.map((regime, index) => {
            const y = top + index * (rowHeight + gap);
            return (
              <g key={regime.id}>
                <text
                  x={0}
                  y={y + rowHeight / 2 - 2}
                  fontSize={11.5}
                  fill="#374151"
                  fontWeight={600}
                >
                  {tx.rows[regime.id]}
                </text>
                <text
                  x={0}
                  y={y + rowHeight / 2 + 11}
                  fontSize={9.5}
                  fill="#9ca3af"
                >
                  {tx.contractValue(formatContractValue(regime.contractValue))}
                  {` · ${tx.dayDifference(regime.dayDifference)}`}
                </text>

                {regime.segments.map((segment) => (
                  <rect
                    key={`${segment.kind}-${segment.from}`}
                    x={x(segment.from)}
                    y={y}
                    width={Math.max(0, x(segment.to) - x(segment.from))}
                    height={rowHeight - 12}
                    rx={2}
                    fill={COLORS[segment.kind]}
                    opacity={segment.kind === "undecided" ? 0.55 : 0.85}
                  >
                    <title>{tx.legend[segment.kind]}</title>
                  </rect>
                ))}
                {regime.centralAt !== null && (
                  <line
                    x1={x(regime.centralAt)}
                    y1={y - 3}
                    x2={x(regime.centralAt)}
                    y2={y + rowHeight - 9}
                    stroke="#2563eb"
                    strokeWidth={2}
                    strokeDasharray="3 2"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        {tx.note}
      </p>
    </div>
  );
}
