// Core cost model — academic sources:
// - Szucs (JEEA 2024): high discretion can increase prices and select less productive suppliers;
//   this countervailing governance risk is not mapped onto either base path without validation.
// - Beuve, Moszoro & Saussier (NBER wp28491): +1 SD rigidity is associated
//   with +7.7-10.5 percentage points in renegotiation probability
// - TCO opportunity rate and cap are explicit modeling assumptions pending calibration
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
  deriveStaffCostByRole,
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
  // Inactive schema field. Szucs (JEEA 2024) cannot support a rigidity penalty.
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
  trace: CalculationTrace;
  sources: {
    timeCost: string;
    opportunityCost: string;
    productivityCost: string;
    renegotiationCost: string;
    tcoCost: string;
    bypassCost: string;
  };
}

export interface CalculationTrace {
  sanitizedInputs: {
    contractValue: number;
    tcoHorizonYears: number;
    dailyCostOfInaction: number;
    renegotiationCost: number;
    bypassAuditExposure: number;
  };
  dimensions: DimensionMultipliers;
  process: {
    processType: ProcessType;
    techLevel: TechLevelId;
    stepCount: number;
    baseRigidity: number;
  };
  days: {
    rigid: number;
    flexible: number;
    delay: number;
  };
  staffCostsByRole: {
    rigid: Record<StakeholderRole, number>;
    flexible: Record<StakeholderRole, number>;
  };
  coordinationCosts: { rigid: number; flexible: number };
  toolCosts: { rigid: number; flexible: number };
  opportunity: {
    rigidPricePremium: number;
    rigidDelayCost: number;
  };
  productivityCosts: { rigid: number; flexible: number };
  renegotiation: {
    rigidProbability: number;
    flexibleProbability: number;
    rigidExpectedCost: number;
    flexibleExpectedCost: number;
  };
  tcoForegone: {
    rigidRate: number;
    flexibleRate: number;
    rigid: number;
    flexible: number;
  };
  bypass: {
    effectiveRigidity: number;
    rigidProbability: number;
    flexibleProbability: number;
    rigidExpectedCost: number;
    flexibleExpectedCost: number;
  };
}

export interface MatrixCell {
  techLevel: TechLevelId;
  processMode: "rigid" | "flexible";
  totalCost: number;
  days: number;
  bypassProbability: number;
}

export interface DimensionMultipliers {
  tcoMultiplier: number;
  delayMultiplier: number;
  bypassMultiplier: number;
  renegotiationMultiplier: number;
  staffIntensityMultiplier: number;
  coordinationIntensityMultiplier: number;
}

export type DimensionMultiplierKey = keyof DimensionMultipliers;
export type DimensionDetailKey =
  | "tco"
  | "delay"
  | "bypass"
  | "renegotiation"
  | "staff"
  | "coordination";

export interface DimensionMultiplierDetail {
  key: DimensionDetailKey;
  label: string;
  labelEn: string;
  value: number;
}

export const DIMENSION_DETAIL_TO_MULTIPLIER: Record<
  DimensionDetailKey,
  DimensionMultiplierKey
> = {
  tco: "tcoMultiplier",
  delay: "delayMultiplier",
  bypass: "bypassMultiplier",
  renegotiation: "renegotiationMultiplier",
  staff: "staffIntensityMultiplier",
  coordination: "coordinationIntensityMultiplier",
};

const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
const TCO_SAVINGS_RATE_PER_YEAR = 0.10;
const MAX_TCO_SAVINGS_RATE = 0.30;

/**
 * Returns a set of multipliers based on Spend Type (Direct/Indirect) and Process Phase (Upstream/Downstream).
 * This is the central place for dimension-based model behavior.
 */
export function getDimensionMultipliers(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
): DimensionMultipliers {
  let tcoMultiplier = 1;
  let delayMultiplier = 1;
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
): DimensionMultiplierDetail[] {
  const m = getDimensionMultipliers(spendType, processPhase);
  const details: DimensionMultiplierDetail[] = [];

  if (m.tcoMultiplier !== 1) details.push({ key: "tco", label: "Dźwignia TCO", labelEn: "TCO leverage", value: m.tcoMultiplier });
  if (m.delayMultiplier !== 1) details.push({ key: "delay", label: "Koszt opóźnienia", labelEn: "Delay penalty", value: m.delayMultiplier });
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

/** Assumed reduction factor applied to base probability in the flexible path. */
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
  const rigidStaffCostsByRole = deriveStaffCostByRole(
    steps, 
    false, 
    stakeholders, 
    inputs.processPhase, 
    inputs.spendType
  );

  const flexibleStaffCostsByRole = deriveStaffCostByRole(
    steps, 
    true, 
    stakeholders, 
    inputs.processPhase, 
    inputs.spendType
  );
  const adjustedRigidStaffCostsByRole = Object.fromEntries(
    Object.entries(rigidStaffCostsByRole).map(([role, cost]) => [
      role,
      cost * dims.staffIntensityMultiplier,
    ]),
  ) as Record<StakeholderRole, number>;
  const adjustedFlexibleStaffCostsByRole = Object.fromEntries(
    Object.entries(flexibleStaffCostsByRole).map(([role, cost]) => [
      role,
      cost * dims.staffIntensityMultiplier,
    ]),
  ) as Record<StakeholderRole, number>;
  const rigidStaffCost = Object.values(adjustedRigidStaffCostsByRole).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  const flexibleStaffCost = Object.values(adjustedFlexibleStaffCostsByRole).reduce(
    (sum, cost) => sum + cost,
    0,
  );

  // Coordination costs (email chains, phone, manual tracking)
  const rigidCoordCost = tech.coordCostPerDay * rigidDays * dims.coordinationIntensityMultiplier;
  const flexibleCoordCost = tech.coordCostPerDay * flexibleDays * dims.coordinationIntensityMultiplier;

  // Tool license (amortized per process)
  const rigidToolCost = tech.toolCostPerProcess;
  const flexibleToolCost = tech.toolCostPerProcess * FLEXIBLE_TOOL_UTILIZATION_RATE;

  // Opportunity cost: deployment delay only. Szucs (2024) estimates a price penalty
  // from high discretion, not from rigidity, so no price premium is assigned here.
  const rigidPricePremium = 0;

  const delayDays = Math.max(0, rigidDays - flexibleDays);
  const rigidDelayCost = delayDays * dailyCostOfInaction * dims.delayMultiplier;

  const rigidOpportunityCost = rigidPricePremium + rigidDelayCost;
  const flexibleOpportunityCost = 0;

  // Reserved output dimension. The former adjustment inverted Szucs (2024), so it
  // remains disabled until a validated governance-risk mapping is specified.
  const rigidProductivityCost = 0;
  const flexibleProductivityCost = 0;

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

  // TCO foregone savings. The opportunity rate is capped so long horizons and
  // contextual multipliers cannot imply savings above 30% of contract value.
  const rigidTCORate = Math.min(
    MAX_TCO_SAVINGS_RATE,
    TCO_SAVINGS_RATE_PER_YEAR * tcoYears * baseRigidity * dims.tcoMultiplier,
  );
  const flexibleTCORate = Math.min(
    MAX_TCO_SAVINGS_RATE,
    TCO_SAVINGS_RATE_PER_YEAR * tcoYears * PROCESS_RIGIDITY["policy_only"] * dims.tcoMultiplier,
  );
  const rigidTCOForgone = contractValue * rigidTCORate;
  const flexibleTCOForgone = contractValue * flexibleTCORate;

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
    flexibleBypassProbability: pBypassFlexible,
    rigidDays,
    flexibleDays,
    trace: {
      sanitizedInputs: {
        contractValue,
        tcoHorizonYears,
        dailyCostOfInaction,
        renegotiationCost,
        bypassAuditExposure,
      },
      dimensions: dims,
      process: {
        processType,
        techLevel,
        stepCount: steps.length,
        baseRigidity,
      },
      days: {
        rigid: rigidDays,
        flexible: flexibleDays,
        delay: delayDays,
      },
      staffCostsByRole: {
        rigid: adjustedRigidStaffCostsByRole,
        flexible: adjustedFlexibleStaffCostsByRole,
      },
      coordinationCosts: {
        rigid: rigidCoordCost,
        flexible: flexibleCoordCost,
      },
      toolCosts: {
        rigid: rigidToolCost,
        flexible: flexibleToolCost,
      },
      opportunity: {
        rigidPricePremium,
        rigidDelayCost,
      },
      productivityCosts: {
        rigid: rigidProductivityCost,
        flexible: flexibleProductivityCost,
      },
      renegotiation: {
        rigidProbability: rigidRenegotiationProb,
        flexibleProbability: flexibleRenegotiationProb,
        rigidExpectedCost: rigidRenegotiationExpected,
        flexibleExpectedCost: flexibleRenegotiationExpected,
      },
      tcoForegone: {
        rigidRate: rigidTCORate,
        flexibleRate: flexibleTCORate,
        rigid: rigidTCOForgone,
        flexible: flexibleTCOForgone,
      },
      bypass: {
        effectiveRigidity,
        rigidProbability: pBypassRigid,
        flexibleProbability: pBypassFlexible,
        rigidExpectedCost: rigidBypassCost,
        flexibleExpectedCost: flexibleBypassCost,
      },
    },
    sources: {
      timeCost: "OECD Public Procurement Performance (2023)",
      opportunityCost: "User-supplied daily cost of inaction × model-derived delay days; no exogenous price premium is assigned.",
      productivityCost: "Inactive in v1.2. Szucs (2024) finds adverse effects from high discretion, so it cannot support a rigidity penalty without a separate governance-risk model.",
      renegotiationCost: "Beuve, Moszoro & Saussier (2021). Contractual Rigidity and Political Contestability. NBER wp28491",
      tcoCost: "Modeling assumption: 10% annual TCO opportunity, exposed for sensitivity analysis; external calibration pending.",
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
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
}
