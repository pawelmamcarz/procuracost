// Core cost model — academic sources:
// - Szucs (JEEA 2024): discretion → +2% price, -1.6% productivity loss under rigid selection
// - Beuve, Moszoro & Saussier (NBER wp28491): rigidity → +7.7-10.5% renegotiations
// - ISM Total Cost of Ownership: up to 30% savings over 3 years
// - Lipsky (1980) + Vaughan (1996): bypass probability under rigidity
// - Holmström & Milgrom (1991): enforcement crowds out value creation

import {
  ProcessType,
  TechLevelId,
  StakeholderRole,
  TECH_LEVELS,
  PROCESS_RIGIDITY,
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

  // New dimensions (follow-up from academic review feedback):
  spendType?: "direct" | "indirect";      // Direct = goes into product/service; Indirect = support spend
  processPhase?: "upstream" | "downstream"; // Upstream = strategic (sourcing/contracting/SRM); Downstream = operational P2P
}

export interface CostBreakdown {
  // Staff time cost (hours × role rates, from step participation matrix)
  timeCost: number;
  // Admin overhead: coordination (email/phone) + tool license
  adminCost: number;
  opportunityCost: number;
  // Szucs (JEEA 2024): rigid price selection → -1.6% supplier productivity
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

const RIGIDITY_PRICE_PREMIUM = 0.02;
// Szucs (JEEA 2024, p.127): lowest-price selection in rigid procedures reduces
// awarded supplier's productivity by ~1.6% vs. value-based selection
const RIGIDITY_PRODUCTIVITY_LOSS = 0.016;
const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
const TCO_SAVINGS_RATE_PER_YEAR = 0.10;

/**
 * Returns a set of multipliers based on Spend Type (Direct/Indirect) and Process Phase (Upstream/Downstream).
 * This is the central place for dimension-based model behavior.
 */
export function getDimensionMultipliers(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  let tcoMultiplier = 1;
  let delayMultiplier = 1;
  let productivityMultiplier = 1;
  let bypassMultiplier = 1;
  let renegotiationMultiplier = 1;
  let staffIntensityMultiplier = 1;   // how expensive the people involved are
  let coordinationIntensityMultiplier = 1; // how much coordination overhead

  // Direct spend generally has higher strategic leverage
  if (spendType === "direct") {
    tcoMultiplier *= 1.35;
    bypassMultiplier *= 1.15;
    renegotiationMultiplier *= 1.15;
  }

  // Upstream vs Downstream effects
  if (processPhase === "upstream") {
    delayMultiplier = 1.4;
    bypassMultiplier *= 1.25;
    renegotiationMultiplier *= 1.2;
    staffIntensityMultiplier = 1.25;      // more senior people involved
    coordinationIntensityMultiplier = 1.3; // higher meeting & alignment effort
  } else if (processPhase === "downstream") {
    delayMultiplier = 0.9;
    productivityMultiplier = 0.85;
    coordinationIntensityMultiplier = 0.85; // more standardized, less coordination
  }

  // Strongest effect: Direct + Upstream (critical strategic sourcing)
  if (spendType === "direct" && processPhase === "upstream") {
    tcoMultiplier *= 1.2;
    renegotiationMultiplier *= 1.15;
    staffIntensityMultiplier *= 1.15;
  }

  return {
    tcoMultiplier,
    delayMultiplier,
    productivityMultiplier,
    bypassMultiplier,
    renegotiationMultiplier,
    staffIntensityMultiplier,
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
  if (m.productivityMultiplier !== 1) details.push({ key: "productivity", label: "Wpływ na produktywność dostawcy", labelEn: "Supplier productivity impact", value: m.productivityMultiplier });
  if (m.bypassMultiplier !== 1) details.push({ key: "bypass", label: "Ryzyko obejścia", labelEn: "Bypass risk", value: m.bypassMultiplier });
  if (m.renegotiationMultiplier !== 1) details.push({ key: "renegotiation", label: "Ryzyko renegocjacji", labelEn: "Renegotiation exposure", value: m.renegotiationMultiplier });
  if (m.staffIntensityMultiplier !== 1) details.push({ key: "staff", label: "Intensywność pracy zespołu", labelEn: "Team effort intensity", value: m.staffIntensityMultiplier });
  if (m.coordinationIntensityMultiplier !== 1) details.push({ key: "coordination", label: "Intensywność koordynacji", labelEn: "Coordination overhead", value: m.coordinationIntensityMultiplier });

  return details;
}

const BYPASS_SIGMOID_STEEPNESS = 10;
const BYPASS_THRESHOLD = 0.5;

/** Share of tool license cost attributed to the flexible (policy-only) path.
 * A flexible approach typically uses only a fraction of the full sourcing/ERP
 * platform capabilities compared to a rigid, highly formalized process.
 */
const FLEXIBLE_TOOL_UTILIZATION_RATE = 0.3;

/** Reduction factor applied to base renegotiation probability in the flexible path.
 * Policy-based procurement materially lowers renegotiation risk (Beuve et al.).
 */
const FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR = 0.7;

/** Scaling factor for bypass probability under flexible/policy-driven approaches.
 * Even in a "field" model, some residual risk remains (e.g. ethical or documentation boundaries).
 */
const FLEXIBLE_BYPASS_PROBABILITY_SCALE = 0.1;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function bypassProbability(rigidityIndex: number): number {
  return 1 / (1 + Math.exp(-BYPASS_SIGMOID_STEEPNESS * (rigidityIndex - BYPASS_THRESHOLD)));
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
  const tcoYears = Math.max(0, tcoHorizonYears);

  // Dimension multipliers must be calculated early
  const dims = getDimensionMultipliers(inputs.spendType, inputs.processPhase);

  // Derive days from process step templates × tech multiplier + context
  const rigidDays = deriveRigidDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);
  const flexibleDays = deriveFlexibleDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);

  // Staff costs from step participation matrix
  const rigidStaffCost = deriveStaffCost(
    steps, 
    false, 
    stakeholders, 
    inputs.processPhase, 
    inputs.spendType
  ) * dims.staffIntensityMultiplier;

  const flexibleStaffCost = deriveStaffCost(
    steps, 
    true, 
    stakeholders, 
    inputs.processPhase, 
    inputs.spendType
  ) * dims.staffIntensityMultiplier;

  // Coordination costs (email chains, phone, manual tracking)
  const rigidCoordCost = tech.coordCostPerDay * rigidDays * dims.coordinationIntensityMultiplier;
  const flexibleCoordCost = tech.coordCostPerDay * flexibleDays * dims.coordinationIntensityMultiplier;

  // Tool license (amortized per process)
  const rigidToolCost = tech.toolCostPerProcess;
  const flexibleToolCost = tech.toolCostPerProcess * FLEXIBLE_TOOL_UTILIZATION_RATE;

  // Opportunity cost: price premium + deployment delay
  const rigidPricePremium = contractValue * RIGIDITY_PRICE_PREMIUM;

  const delayDays = Math.max(0, rigidDays - flexibleDays);
  const rigidDelayCost = delayDays * dailyCostOfInaction * dims.delayMultiplier;

  const rigidOpportunityCost = rigidPricePremium + rigidDelayCost;
  const flexibleOpportunityCost = 0;

  // Productivity cost
  const rigidProductivityCost = contractValue * RIGIDITY_PRODUCTIVITY_LOSS * baseRigidity * dims.productivityMultiplier;
  const flexibleProductivityCost = contractValue * RIGIDITY_PRODUCTIVITY_LOSS * PROCESS_RIGIDITY["policy_only"] * dims.productivityMultiplier;

  // Renegotiation
  const rigidRenegotiationProb = clamp(
    BASE_RENEGOTIATION_PROBABILITY + RIGIDITY_RENEGOTIATION_PREMIUM * dims.renegotiationMultiplier,
    0, 1,
  );
  const flexibleRenegotiationProb = clamp(
    BASE_RENEGOTIATION_PROBABILITY * FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR,
    0, 1,
  );
  const rigidRenegotiationExpected = rigidRenegotiationProb * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleRenegotiationProb * renegotiationCost;

  // TCO foregone savings
  const rigidTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoYears * baseRigidity * dims.tcoMultiplier;
  const flexibleTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoYears * PROCESS_RIGIDITY["policy_only"] * dims.tcoMultiplier;

  // Bypass probability
  const effectiveRigidity = clamp(baseRigidity * tech.bypassProbMultiplier * dims.bypassMultiplier, 0, 1);
  const pBypassRigid = bypassProbability(effectiveRigidity);
  const pBypassFlexible = tech.policyRigidityIndex * FLEXIBLE_BYPASS_PROBABILITY_SCALE;
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
    rigidDays,
    flexibleDays,
    sources: {
      timeCost: "OECD Public Procurement Performance (2023)",
      opportunityCost: "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA 22(1):117",
      productivityCost: "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA 22(1):127 (−1.6% productivity under rigid lowest-price selection)",
      renegotiationCost: "Beuve, Moszoro & Saussier (2021). Contractual Rigidity and Political Contestability. NBER wp28491",
      tcoCost: "Institute for Supply Management (ISM). Total Cost of Ownership in Procurement",
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
      bypassProbability: result.bypassProbability * FLEXIBLE_BYPASS_PROBABILITY_SCALE,
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
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
}
