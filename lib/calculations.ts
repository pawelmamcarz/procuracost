// Core cost model — each dimension cites a specific source. Outputs are model
// ESTIMATES under the assumptions documented in docs/MODEL_PARAMETERS.md, not
// measured facts. The model is SYMMETRIC IN STRUCTURE: the flexible (discretionary)
// path carries its own favoritism/selection-quality cost, so ΔC_total is structurally
// capable of going negative. Numerically that capability is INERT: ΔC_total > 0 in
// all 9 reference scenarios and across an 11,844-config full-input-space sweep
// (scripts/symmetry-sweep.ts, 2026-07-05); in low-corruption-risk operational
// contexts the gap approaches zero (min observed ≈ +0.4% of contract value) but
// never flips sign. Disclose this; never present rigid-wins as an observed result.
//
// - Szucs (JEEA 2024, DOI 10.1093/jeea/jvad017): discretion RAISES prices and selects
//   less-productive contractors. Competitive (rigid) tendering averts this favoritism
//   premium — the governance value credited to formal procedures here.
// - Beuve, Moszoro & Spiller (NBER wp28491; JLEO 2023): 2SLS/IV estimate (rigidity
//   instrumented by political contestability; exclusion restriction load-bearing); French
//   car-park sector; +7.7–10.5pp renegotiation probability per-SD-dose. Applied here with
//   an explicit mapping (full 0→1 rigidity swing ≈ 1 SD, anchored at the 7.7pp lower
//   bound) and hard-capped at the 10.5pp upper bound of the cited band.
// - TCO ceiling (~30% over multiple years): an UNATTRIBUTED practitioner heuristic from
//   grey literature — no verifiable ISM/peer-reviewed source exists (the circulating "ISM"
//   attribution traces to a content farm on ISM's former domain). Kept only as a Grade-C
//   conservative cap, discounted to present value here (not a flat compounding rate).
// - Lipsky (1980) + Vaughan (1996): informal bypass as a behavioural hazard.
// - Holmström & Milgrom (1991): enforcement can crowd out value creation.

import {
  ProcessType,
  TechLevelId,
  StakeholderRole,
  TECH_LEVELS,
  PROCESS_RIGIDITY,
  CORRUPTION_RISK_CONTEXT,
  getSteps,
  deriveRigidDays,
  deriveFlexibleDays,
  deriveStaffCost,
  ProcessStep,
} from "./process-templates";

export type { ProcessType, TechLevelId, StakeholderRole };

export interface ProcurementInputs {
  contractValue: number;
  tcoHorizonYears: number;
  processType: ProcessType;
  techLevel: TechLevelId;
  stakeholders: Record<StakeholderRole, { count: number; dailyRate: number }>;
  dailyCostOfInaction: number; // PLN/day — value lost per day without the contract
  renegotiationCost: number;   // PLN — cost if contract requires renegotiation
  bypassAuditExposure: number; // PLN — audit/penalty cost if informal bypass discovered
  customSteps?: ProcessStep[];

  // New dimensions — modeling assumption (Grade C); direction from Kraljic; the
  // Direct-TCO ×1.15 magnitude is to be expert-elicited (not yet empirically anchored):
  spendType?: "direct" | "indirect";      // Direct = goes into product/service; Indirect = support spend
  processPhase?: "upstream" | "downstream"; // Upstream = strategic (sourcing/contracting/SRM); Downstream = operational P2P
}

export interface CostBreakdown {
  // Staff time cost (hours × role rates, from step participation matrix)
  timeCost: number;
  // Admin overhead: coordination (email/phone) + tool license
  adminCost: number;
  // Opportunity cost: deployment-delay cost over this path's own duration
  opportunityCost: number;
  // Favoritism / selection-quality cost: expected price-dispersion and value loss from
  // DISCRETION (Szucs 2024). Borne mainly by the flexible path; competitive tendering
  // averts it. (Field kept as `productivityCost` for breakdown-chart compatibility.)
  productivityCost: number;
  renegotiationCost: number;
  tcoCost: number;
  bypassCost: number;
  total: number;
  // Sub-breakdown for transparency
  days: number;
  staffCost: number;
  coordCost: number;
  toolCost: number;
}

export interface ComparisonResult {
  rigid: CostBreakdown;
  flexible: CostBreakdown;
  delta: number;
  deltaPercent: number;
  bypassProbability: number;
  flexibleBypassProbability: number;
  rigidDays: number;
  flexibleDays: number;
  sources: {
    timeCost: string;
    opportunityCost: string;
    productivityCost: string;
    renegotiationCost: string;
    tcoCost: string;
    bypassCost: string;
  };
}

export interface MatrixCell {
  techLevel: TechLevelId;
  processMode: "rigid" | "flexible";
  totalCost: number;
  days: number;
  bypassProbability: number;
}

// Szucs (2024): discretion raises prices ~6% (structural causal estimate; reduced-form
// fuzzy-RD ~9%, selection-corrected ~8%) and selects ~10% less-productive contractors
// (structural). Hungarian public-procurement RDD + structural selection-correction;
// JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017. This is the per-unit-discretion
// favoritism premium that competitive tendering averts.
const DISCRETION_FAVORITISM_PREMIUM = 0.06;
// Beuve, Moszoro & Spiller: +7.7pp renegotiation probability per SD of contractual
// rigidity (lower bound of the cited 7.7–10.5pp band). Mapping assumption (documented
// in MODEL_PARAMETERS.md): the full 0→1 swing of the rigidity index is treated as one
// standard deviation, anchored conservatively at the lower bound.
const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;
// Upper bound of the cited band — context multipliers may move the premium within
// 7.7–10.5pp but never above it.
const RENEGOTIATION_PREMIUM_MAX = 0.105;
// Beuve, Moszoro & Spiller: unconditional renegotiation probability ~22%.
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
// Annual foregone-savings rate; the cumulative (discounted) figure is capped at the
// ~30%-over-multiple-years practitioner ceiling so it can never exceed the cited bound.
// The ceiling is an unattributed grey-literature heuristic (Grade C), not an ISM study.
const TCO_SAVINGS_RATE_PER_YEAR = 0.10;
const TCO_CUMULATIVE_CAP = 0.30;
// Discount rate for multi-year flows (foregone TCO savings) → present value.
const DISCOUNT_RATE = 0.05;

// Direct/Indirect × Upstream/Downstream context multipliers (getDimensionMultipliers).
// Grade-C modeling assumptions; each scales ONE cost channel through the shared
// per-path formulas. Audited invariant: no dimension's total context uplift exceeds
// ~×1.5 (scripts/recompute.ts / MODEL_PARAMETERS.md §4).
const DIRECT_TCO_MULTIPLIER = 1.15;
const DIRECT_BYPASS_MULTIPLIER = 1.15;
const DIRECT_RENEGOTIATION_MULTIPLIER = 1.15;
const UPSTREAM_BYPASS_MULTIPLIER = 1.25;
const UPSTREAM_RENEGOTIATION_MULTIPLIER = 1.20;
const UPSTREAM_COORDINATION_MULTIPLIER = 1.15;
const DOWNSTREAM_DELAY_MULTIPLIER = 0.90;
const DOWNSTREAM_PRODUCTIVITY_MULTIPLIER = 0.85;
const DOWNSTREAM_COORDINATION_MULTIPLIER = 0.85;
const DIRECT_UPSTREAM_RENEGOTIATION_MULTIPLIER = 1.15;

/**
 * Returns a set of multipliers based on Spend Type (Direct/Indirect) and Process Phase (Upstream/Downstream).
 * This is the central place for dimension-based model behavior.
 */
export function getDimensionMultipliers(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  // One economic channel per mechanism: calendar time is lengthened by the step-level
  // day boosts in deriveRigidDays/deriveFlexibleDays, and staff seniority by the
  // role-level multipliers in deriveStaffCost — so no delay or staff-intensity scalar
  // is applied here on top (that double-counted the same effect before the 2026-07
  // correction). No dimension's total context uplift may exceed ~×1.5 across all
  // channels combined (audited by scripts/recompute.ts).
  let tcoMultiplier = 1;
  let delayMultiplier = 1;
  let productivityMultiplier = 1;
  let bypassMultiplier = 1;
  let renegotiationMultiplier = 1;
  let coordinationIntensityMultiplier = 1; // per-day meeting & alignment effort

  // Direct spend generally has higher strategic leverage
  if (spendType === "direct") {
    tcoMultiplier *= DIRECT_TCO_MULTIPLIER;
    bypassMultiplier *= DIRECT_BYPASS_MULTIPLIER;
    renegotiationMultiplier *= DIRECT_RENEGOTIATION_MULTIPLIER;
  }

  // Upstream vs Downstream effects
  if (processPhase === "upstream") {
    bypassMultiplier *= UPSTREAM_BYPASS_MULTIPLIER;
    renegotiationMultiplier *= UPSTREAM_RENEGOTIATION_MULTIPLIER;
    coordinationIntensityMultiplier = UPSTREAM_COORDINATION_MULTIPLIER; // higher meeting & alignment effort per day
  } else if (processPhase === "downstream") {
    delayMultiplier = DOWNSTREAM_DELAY_MULTIPLIER;
    productivityMultiplier = DOWNSTREAM_PRODUCTIVITY_MULTIPLIER;
    coordinationIntensityMultiplier = DOWNSTREAM_COORDINATION_MULTIPLIER; // more standardized, less coordination
  }

  // Strongest effect: Direct + Upstream (critical strategic sourcing)
  if (spendType === "direct" && processPhase === "upstream") {
    renegotiationMultiplier *= DIRECT_UPSTREAM_RENEGOTIATION_MULTIPLIER;
  }

  return {
    tcoMultiplier,
    delayMultiplier,
    productivityMultiplier,
    bypassMultiplier,
    renegotiationMultiplier,
    coordinationIntensityMultiplier,
  };
}

/**
 * Human-readable labels for the dimension multipliers (for UI/PDF/reports).
 * Returns array of { key, label, labelEn, value } for the non-1.0 factors.
 */
export function getDimensionMultiplierDetails(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  const m = getDimensionMultipliers(spendType, processPhase);
  const details: Array<{ key: string; label: string; labelEn: string; value: number }> = [];

  if (m.tcoMultiplier !== 1) details.push({ key: "tco", label: "Dźwignia TCO", labelEn: "TCO leverage", value: m.tcoMultiplier });
  if (m.delayMultiplier !== 1) details.push({ key: "delay", label: "Koszt opóźnienia", labelEn: "Delay penalty", value: m.delayMultiplier });
  if (m.productivityMultiplier !== 1) details.push({ key: "productivity", label: "Wpływ na jakość wyboru dostawcy", labelEn: "Supplier selection-quality impact", value: m.productivityMultiplier });
  if (m.bypassMultiplier !== 1) details.push({ key: "bypass", label: "Ryzyko obejścia", labelEn: "Bypass risk", value: m.bypassMultiplier });
  if (m.renegotiationMultiplier !== 1) details.push({ key: "renegotiation", label: "Ryzyko renegocjacji", labelEn: "Renegotiation exposure", value: m.renegotiationMultiplier });
  if (m.coordinationIntensityMultiplier !== 1) details.push({ key: "coordination", label: "Intensywność koordynacji", labelEn: "Coordination overhead", value: m.coordinationIntensityMultiplier });

  return details;
}

// Bypass probability rises with rigidity but is bounded — recalibrated so that even the
// most rigid process under manual tooling lands well below certainty (no 0.99 saturation).
// These are modeling assumptions (sign only, not magnitude): the realised rigid ~86% exceeds
// the empirical off-contract band (~1.8–50%), so the ceiling should be revisited via a
// primary maverick/bypass audit before any magnitude claim is made.
const BYPASS_SIGMOID_STEEPNESS = 6;
const BYPASS_THRESHOLD = 0.9;
const BYPASS_PROBABILITY_CEILING = 0.95;

/** Share of tool license cost attributed to the flexible (policy-only) path.
 * A flexible approach typically uses only a fraction of the full sourcing/ERP
 * platform capabilities compared to a rigid, highly formalized process.
 */
const FLEXIBLE_TOOL_UTILIZATION_RATE = 0.3;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function bypassProbability(rigidityIndex: number): number {
  return 1 / (1 + Math.exp(-BYPASS_SIGMOID_STEEPNESS * (rigidityIndex - BYPASS_THRESHOLD)));
}

// Rigidity-driven renegotiation premium (Beuve et al.), one formula for BOTH paths —
// the rigidity difference alone drives the delta. Context multipliers may move the
// premium within the cited 7.7–10.5pp band but never above it.
function renegotiationPremium(rigidity: number, contextMultiplier: number): number {
  return Math.min(
    RIGIDITY_RENEGOTIATION_PREMIUM * rigidity * contextMultiplier,
    RENEGOTIATION_PREMIUM_MAX,
  );
}

/** Present-value annuity factor: Σ_{y=1..years} 1/(1+rate)^y. */
function npvAnnuityFactor(years: number, rate: number): number {
  let sum = 0;
  for (let y = 1; y <= Math.floor(years); y++) sum += 1 / Math.pow(1 + rate, y);
  return sum;
}

function buildBreakdown(
  days: number,
  staffCost: number,
  coordCost: number,
  toolCost: number,
  opportunityCost: number,
  productivityCost: number,
  renegotiationExpected: number,
  tcoCost: number,
  bypassCost: number,
): CostBreakdown {
  const timeCost = staffCost;
  const adminCost = coordCost + toolCost;
  const total =
    timeCost + adminCost + opportunityCost + productivityCost +
    renegotiationExpected + tcoCost + bypassCost;
  return {
    timeCost,
    adminCost,
    opportunityCost,
    productivityCost,
    renegotiationCost: renegotiationExpected,
    tcoCost,
    bypassCost,
    total,
    days,
    staffCost,
    coordCost,
    toolCost,
  };
}

export function calculateCosts(inputs: ProcurementInputs): ComparisonResult {
  // Basic sanitization of inputs (defensive programming)
  const contractValue = Math.max(0, inputs.contractValue);
  const tcoHorizonYears = Math.max(0, inputs.tcoHorizonYears);
  const dailyCostOfInaction = Math.max(0, inputs.dailyCostOfInaction);
  const renegotiationCost = Math.max(0, inputs.renegotiationCost);
  const bypassAuditExposure = Math.max(0, inputs.bypassAuditExposure);

  const {
    processType,
    techLevel,
    stakeholders,
    customSteps,
  } = inputs;

  const tech = TECH_LEVELS[techLevel];
  const steps = getSteps(processType, customSteps);
  const baseRigidity = PROCESS_RIGIDITY[processType];
  // The flexible path is scored against TWO rigidity figures, both bounded so the
  // "field" path can never read as MORE rigid than the "tunnel":
  //  1. flexibleRigidity — the PROCESS-level policy rigidity min(ρ, ρ_policy_only), used
  //     by the favoritism, renegotiation and TCO dimensions.
  //  2. the TECH-level policyRigidityIndex (0.05–0.35), used by the bypass sigmoid to
  //     reflect that manual tooling makes even a policy process easier to bypass —
  //     but capped at flexibleRigidity below, so a low-rigidity operational process on
  //     manual/sourcing_tool tooling is never scored more bypass-prone than its own
  //     rigid path (the operational-type inversion this used to produce).
  const flexibleRigidity = Math.min(baseRigidity, PROCESS_RIGIDITY["policy_only"]);
  const corruptionContext = CORRUPTION_RISK_CONTEXT[processType];
  const tcoYears = Math.max(0, tcoHorizonYears);

  // Dimension multipliers must be calculated early
  const dims = getDimensionMultipliers(inputs.spendType, inputs.processPhase);

  // Derive days from process step templates × tech multiplier + context
  const rigidDays = deriveRigidDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);
  const flexibleDays = deriveFlexibleDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);

  // Staff costs from step participation matrix. The role-level seniority multipliers
  // inside deriveStaffCost are the SOLE staff-intensity channel — no outer scalar.
  const rigidStaffCost = deriveStaffCost(
    steps,
    false,
    stakeholders,
    inputs.processPhase,
    inputs.spendType
  );

  const flexibleStaffCost = deriveStaffCost(
    steps,
    true,
    stakeholders,
    inputs.processPhase,
    inputs.spendType
  );

  // Coordination costs (email chains, phone, manual tracking)
  const rigidCoordCost = tech.coordCostPerDay * rigidDays * dims.coordinationIntensityMultiplier;
  const flexibleCoordCost = tech.coordCostPerDay * flexibleDays * dims.coordinationIntensityMultiplier;

  // Tool license (amortized per process)
  const rigidToolCost = tech.toolCostPerProcess;
  const flexibleToolCost = tech.toolCostPerProcess * FLEXIBLE_TOOL_UTILIZATION_RATE;

  // Opportunity cost: deployment-delay cost over EACH path's own duration. Both paths
  // tie up value while procuring; the saving is the difference, reported honestly as a
  // delta of two non-zero quantities (no zero-friction baseline).
  const rigidOpportunityCost = rigidDays * dailyCostOfInaction * dims.delayMultiplier;
  const flexibleOpportunityCost = flexibleDays * dailyCostOfInaction * dims.delayMultiplier;

  // Favoritism / selection-quality cost (Szucs 2024). Scales with DISCRETION (1 − rigidity)
  // and the context's corruption risk. The flexible (discretionary) path bears more of it;
  // competitive tendering averts it — so rigid CAN be cheaper on this dimension.
  const rigidProductivityCost =
    contractValue * DISCRETION_FAVORITISM_PREMIUM * (1 - baseRigidity) * corruptionContext * dims.productivityMultiplier;
  const flexibleProductivityCost =
    contractValue * DISCRETION_FAVORITISM_PREMIUM * (1 - flexibleRigidity) * corruptionContext * dims.productivityMultiplier;

  // Renegotiation — ONE formula for both paths (Beuve et al.): the premium scales with
  // each path's own rigidity; the rigidity difference alone drives the delta.
  const rigidRenegotiationProb = clamp(
    BASE_RENEGOTIATION_PROBABILITY + renegotiationPremium(baseRigidity, dims.renegotiationMultiplier),
    0, 1,
  );
  const flexibleRenegotiationProb = clamp(
    BASE_RENEGOTIATION_PROBABILITY + renegotiationPremium(flexibleRigidity, dims.renegotiationMultiplier),
    0, 1,
  );
  const rigidRenegotiationExpected = rigidRenegotiationProb * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleRenegotiationProb * renegotiationCost;

  // TCO foregone savings — present value of the annual stream, capped at the ~30%
  // practitioner ceiling. The context multiplier scales the whole dimension including
  // the cap (effective ceiling = 0.30 × tcoMultiplier); otherwise the direct-spend
  // leverage claim would silently vanish exactly where the cap binds.
  const discountedHorizon = npvAnnuityFactor(tcoYears, DISCOUNT_RATE);
  const rigidTCOForgone = contractValue * dims.tcoMultiplier * Math.min(
    TCO_SAVINGS_RATE_PER_YEAR * discountedHorizon * baseRigidity,
    TCO_CUMULATIVE_CAP,
  );
  const flexibleTCOForgone = contractValue * dims.tcoMultiplier * Math.min(
    TCO_SAVINGS_RATE_PER_YEAR * discountedHorizon * flexibleRigidity,
    TCO_CUMULATIVE_CAP,
  );

  // Bypass probability (behavioural hazard) — ONE formula for both paths: the sigmoid
  // maps intrinsic rigidity to a hazard; tech ease and context scale the REALIZED
  // probability outside the sigmoid, so high-rigidity processes stay differentiated
  // and never saturate. The flexible path runs at the tech level's policy rigidity,
  // but capped at flexibleRigidity so a low-rigidity operational process (catalog_order,
  // mrp_order) on manual/sourcing_tool tooling is never scored MORE bypass-prone than
  // its own rigid path — which would invert the Tunnel/Field thesis.
  const realizedBypassProb = (rigidity: number) => clamp(
    bypassProbability(rigidity) * tech.bypassProbMultiplier * dims.bypassMultiplier,
    0, BYPASS_PROBABILITY_CEILING,
  );
  const pBypassRigid = realizedBypassProb(baseRigidity);
  const pBypassFlexible = realizedBypassProb(Math.min(tech.policyRigidityIndex, flexibleRigidity));
  const rigidBypassCost = pBypassRigid * bypassAuditExposure;
  const flexibleBypassCost = pBypassFlexible * bypassAuditExposure;

  const rigid = buildBreakdown(
    rigidDays, rigidStaffCost, rigidCoordCost, rigidToolCost,
    rigidOpportunityCost, rigidProductivityCost,
    rigidRenegotiationExpected, rigidTCOForgone, rigidBypassCost,
  );
  const flexible = buildBreakdown(
    flexibleDays, flexibleStaffCost, flexibleCoordCost, flexibleToolCost,
    flexibleOpportunityCost, flexibleProductivityCost,
    flexibleRenegotiationExpected, flexibleTCOForgone, flexibleBypassCost,
  );

  const delta = rigid.total - flexible.total;
  const deltaPercent = flexible.total > 0 ? (delta / flexible.total) * 100 : 0;

  return {
    rigid,
    flexible,
    delta,
    deltaPercent,
    bypassProbability: pBypassRigid,
    flexibleBypassProbability: pBypassFlexible,
    rigidDays,
    flexibleDays,
    sources: {
      timeCost: "Step durations: legal minima (PZP 2019 + Dyrektywa 2014/24/UE) and practitioner benchmarks — not a single empirical source",
      opportunityCost: "Deployment-delay cost = procurement duration × daily cost of inaction (model construction)",
      productivityCost: "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017 — discretion raises prices and lowers supplier value; competitive tendering averts this favoritism premium",
      renegotiationCost: "Beuve, Moszoro & Spiller. Contractual Rigidity and Political Contestability. NBER wp28491 (publ. JLEO 2023) — 2SLS/IV (rigidity instrumented by political contestability; exclusion restriction load-bearing), French car-park sector, +7.7–10.5pp per-SD-dose. Applied with an explicit 0→1-index ≈ 1 SD mapping, anchored at the 7.7pp lower bound and hard-capped at 10.5pp",
      tcoCost: "Up to ~30% TCO reduction over multiple years — an unattributed practitioner heuristic from grey literature (no verifiable ISM or peer-reviewed source; Grade C), kept only as a conservative cap, discounted at 5%",
      bypassCost: "Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) The Challenger Launch Decision; Holmström & Milgrom (1991) Multitask Principal-Agent",
    },
  };
}

// 2D cost matrix: all 4 tech levels × rigid/flexible for the given process type
export function calculateMatrix(inputs: ProcurementInputs): MatrixCell[] {
  const techLevels: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];
  const cells: MatrixCell[] = [];

  for (const tl of techLevels) {
    const result = calculateCosts({ ...inputs, techLevel: tl });
    cells.push({
      techLevel: tl,
      processMode: "rigid",
      totalCost: result.rigid.total,
      days: result.rigidDays,
      bypassProbability: result.bypassProbability,
    });
    cells.push({
      techLevel: tl,
      processMode: "flexible",
      totalCost: result.flexible.total,
      days: result.flexibleDays,
      bypassProbability: result.flexibleBypassProbability,
    });
  }

  return cells;
}

export function formatPLN(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatCompact(value: number): string {
  const sign = value < 0 ? "-" : "";
  const v = Math.abs(value);
  if (v >= 1_000_000) return `${sign}${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${sign}${(v / 1_000).toFixed(0)}k`;
  return `${sign}${v}`;
}
