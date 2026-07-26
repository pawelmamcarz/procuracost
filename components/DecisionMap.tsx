import { calculateCosts, type ProcurementInputs } from "@/lib/calculations";
import type { ProcessType, TechLevelId } from "@/lib/process-templates";

const STAKE: ProcurementInputs["stakeholders"] = {
  requestor: { count: 1, dailyRate: 900 },
  buyer: { count: 1, dailyRate: 800 },
  lawyer: { count: 1, dailyRate: 1200 },
  finance: { count: 1, dailyRate: 900 },
  manager: { count: 1, dailyRate: 1500 },
  executive: { count: 1, dailyRate: 2500 },
};

const REF_TECH: TechLevelId = "partial_erp";

const ROWS: Array<{ type: Exclude<ProcessType, "custom">; cv: number; pl: string; en: string }> = [
  { type: "pzp_eu", cv: 5_000_000, pl: "PZP — przetarg UE", en: "PZP — EU tender" },
  { type: "pzp_eu", cv: 20_000_000, pl: "PZP — przetarg UE (duży)", en: "PZP — EU tender (large)" },
  { type: "pzp_krajowy", cv: 500_000, pl: "PZP — tryb podstawowy", en: "PZP — national basic mode" },
  { type: "private_formal", cv: 5_000_000, pl: "Przetarg prywatny (RFP)", en: "Private tender (RFP)" },
  { type: "capex", cv: 5_000_000, pl: "Inwestycja CAPEX", en: "CAPEX investment" },
  { type: "discovery", cv: 2_000_000, pl: "Zakup odkrywczy", en: "Discovery purchase" },
  { type: "policy_only", cv: 5_000_000, pl: "Ścieżka adaptacyjna", en: "Adaptive path" },
  { type: "catalog_order", cv: 50_000, pl: "Zamówienie z katalogu", en: "Catalog order" },
  { type: "mrp_order", cv: 500_000, pl: "Zlecenie MRP", en: "MRP order" },
];

const AXIS_MAX = 6_000;

interface Regime {
  label: { pl: string; en: string };
  cv: number;
  dayDiff: number;
  segments: Array<{ from: number; to: number; kind: "formal" | "undecided" | "adaptive" }>;
  centralAt: number | null;
  flatVerdict: "formal" | "adaptive" | "tie" | null;
}

function computeRegimes(): Regime[] {
  return ROWS.map((row) => {
    const r = calculateCosts({
      contractValue: row.cv,
      tcoHorizonYears: 2,
      contractDurationYears: 2,
      processType: row.type,
      techLevel: REF_TECH,
      stakeholders: STAKE,
      dailyCostOfInaction: 0,
      renegotiationCost: row.cv * 0.04,
      bypassAuditExposure: row.cv * 0.10,
    });
    const dd = r.rigidDays - r.flexibleDays;
    const iLow = r.uncertainty.evidenceLowDelta;
    const iHigh = r.uncertainty.evidenceHighDelta;
    const iCentral = r.delta;

    const base = { label: { pl: row.pl, en: row.en }, cv: row.cv, dayDiff: dd };

    if (dd === 0) {
      const flatVerdict = iCentral < 0 ? "formal" as const : iCentral > 0 ? "adaptive" as const : "tie" as const;
      return { ...base, segments: [], centralAt: null, flatVerdict };
    }

    const clamp = (v: number) => Math.min(AXIS_MAX, Math.max(0, v));
    if (dd > 0) {
      const rf = clamp(-iHigh / dd);
      const ra = clamp(-iLow / dd);
      return {
        ...base,
        segments: [
          { from: 0, to: rf, kind: "formal" as const },
          { from: rf, to: ra, kind: "undecided" as const },
          { from: ra, to: AXIS_MAX, kind: "adaptive" as const },
        ].filter((s) => s.to - s.from > 0),
        centralAt: clamp(-iCentral / dd),
        flatVerdict: null,
      };
    }
    const ra = clamp(-iLow / dd);
    const rf = clamp(-iHigh / dd);
    return {
      ...base,
      segments: [
        { from: 0, to: ra, kind: "adaptive" as const },
        { from: ra, to: rf, kind: "undecided" as const },
        { from: rf, to: AXIS_MAX, kind: "formal" as const },
      ].filter((s) => s.to - s.from > 0),
      centralAt: -iCentral / dd >= 0 && -iCentral / dd <= AXIS_MAX ? -iCentral / dd : null,
      flatVerdict: null,
    };
  });
}

const COLORS = { formal: "#ef4444", undecided: "#f59e0b", adaptive: "#22c55e" } as const;

interface Props {
  lang?: "pl" | "en";
}

export default function DecisionMap({ lang = "pl" }: Props) {
  const pl = lang === "pl";
  const regimes = computeRegimes();

  const LABEL_W = 200;
  const STRIP_W = 460;
  const ROW_H = 30;
  const GAP = 10;
  const TOP = 26;
  const H = TOP + regimes.length * (ROW_H + GAP) + 34;
  const W = LABEL_W + STRIP_W + 16;
  const x = (v: number) => LABEL_W + (v / AXIS_MAX) * STRIP_W;
  const fmtCv = (v: number) => (v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1000}k`);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {pl ? "Kiedy tunel, kiedy pole — mapa progów" : "When tunnel, when field — threshold map"}
      </p>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
        {pl
          ? "Oś pozioma: koszt dnia bezczynności, który podajesz Ty. Kolor mówi, która ścieżka wygrywa w danej kategorii — i gdzie wynik zależy od założeń."
          : "Horizontal axis: the daily cost of inaction you supply. The color shows which path wins in each category — and where the result depends on assumptions."}
      </p>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.formal }} />
          {pl ? "formalna wygrywa odpornie" : "formal wins robustly"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.undecided }} />
          {pl ? "decydują założenia" : "assumptions decide"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.adaptive }} />
          {pl ? "adaptacyjna wygrywa odpornie" : "adaptive wins robustly"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-0 border-l-2 border-dashed border-blue-600" />
          {pl ? "próg centralny" : "central threshold"}
        </span>
      </div>

      <div className="mt-2 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px] w-full" role="img"
          aria-label={pl ? "Mapa progów decyzyjnych wg kategorii zakupu" : "Decision-threshold map by purchase category"}>
          {[0, 2000, 4000, 6000].map((t) => (
            <g key={t}>
              <line x1={x(t)} y1={TOP - 6} x2={x(t)} y2={H - 28} stroke="#f3f4f6" strokeWidth={1} />
              <text x={x(t)} y={H - 12} textAnchor="middle" fontSize={10} fill="#9ca3af">
                {t === 0 ? "0" : `${t / 1000}k`}
              </text>
            </g>
          ))}
          <text x={x(AXIS_MAX)} y={TOP - 12} textAnchor="end" fontSize={10} fill="#9ca3af">
            {pl ? "PLN / dzień zwłoki →" : "PLN / day of delay →"}
          </text>

          {regimes.map((reg, i) => {
            const y = TOP + i * (ROW_H + GAP);
            return (
              <g key={reg.label.en}>
                <text x={0} y={y + ROW_H / 2 - 2} fontSize={11.5} fill="#374151" fontWeight={600}>
                  {pl ? reg.label.pl : reg.label.en}
                </text>
                <text x={0} y={y + ROW_H / 2 + 11} fontSize={9.5} fill="#9ca3af">
                  CV {fmtCv(reg.cv)}{reg.dayDiff !== 0
                    ? ` · Δ ${reg.dayDiff > 0 ? "+" : ""}${reg.dayDiff.toFixed(0)} ${pl ? "dni" : "days"}`
                    : ` · Δ 0 ${pl ? "dni" : "days"}`}
                </text>

                {reg.segments.length === 0 ? (
                  <g>
                    <rect x={x(0)} y={y} width={STRIP_W} height={ROW_H - 12} rx={4} fill="#e5e7eb" />
                    <text x={x(0) + 8} y={y + ROW_H / 2 - 3} fontSize={10} fill="#6b7280">
                      {pl
                        ? `zwłoka bez znaczenia — ${reg.flatVerdict === "formal" ? "formalna minimalnie tańsza" : reg.flatVerdict === "adaptive" ? "adaptacyjna minimalnie tańsza" : "remis"}`
                        : `delay irrelevant — ${reg.flatVerdict === "formal" ? "formal marginally cheaper" : reg.flatVerdict === "adaptive" ? "adaptive marginally cheaper" : "tie"}`}
                    </text>
                  </g>
                ) : (
                  <g>
                    {reg.segments.map((s) => (
                      <rect key={s.kind + s.from} x={x(s.from)} y={y}
                        width={Math.max(0, x(s.to) - x(s.from))} height={ROW_H - 12} rx={2}
                        fill={COLORS[s.kind]} opacity={s.kind === "undecided" ? 0.55 : 0.85} />
                    ))}
                    {reg.centralAt !== null && reg.centralAt > 0 && reg.centralAt < AXIS_MAX && (
                      <line x1={x(reg.centralAt)} y1={y - 3} x2={x(reg.centralAt)} y2={y + ROW_H - 9}
                        stroke="#2563eb" strokeWidth={2} strokeDasharray="3 2" />
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs text-gray-400 leading-relaxed">
        {pl
          ? "Wejścia porównawcze: technologia partial ERP, kontrakt 2-letni, aneks 4% CV, ekspozycja 10% CV. Progi rosną z wartością kontraktu; zakup odkrywczy jest odwrócony — tam ścieżka formalna jest szybsza, więc drożejąca zwłoka pomaga formalności. Pasy „decydują założenia” to obwiednia scenariuszy dowodowych — to nie są przedziały ufności. Pełna mapa: replication/outputs/decision-thresholds.md."
          : "Comparator inputs: partial-ERP technology, 2-year contract, amendment 4% of CV, exposure 10% of CV. Thresholds grow with contract value; the discovery category is inverted — its formal path is faster, so costlier delay helps formality. The “assumptions decide” bands are the evidence-scenario envelope, not confidence intervals. Full map: replication/outputs/decision-thresholds.md."}
      </p>
    </div>
  );
}
