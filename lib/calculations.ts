// Core cost model — academic sources:
// - Szucs (JEEA 2024): discretion → +2% price, -1.6% productivity
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
}

export interface CostBreakdown {
  // Staff time cost (hours × role rates, from step participation matrix)
  timeCost: number;
  // Admin overhead: coordination (email/phone) + tool license
  adminCost: number;
  opportunityCost: number;
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
const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
const TCO_SAVINGS_RATE_PER_YEAR = 0.10;

const BYPASS_SIGMOID_STEEPNESS = 10;
const BYPASS_THRESHOLD = 0.5;

function bypassProbability(rigidityIndex: number): number {
  return 1 / (1 + Math.exp(-BYPASS_SIGMOID_STEEPNESS * (rigidityIndex - BYPASS_THRESHOLD)));
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
function buildBreakdown(
  days: number,
  staffCost: number,
  coordCost: number,
  toolCost: number,
  opportunityCost: number,
  renegotiationExpected: number,
  tcoCost: number,
  bypassCost: number,
): CostBreakdown {
  const timeCost = staffCost;
  const adminCost = coordCost + toolCost;
  const total = timeCost + adminCost + opportunityCost + renegotiationExpected + tcoCost + bypassCost;
  return {
    timeCost,
    adminCost,
    opportunityCost,
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
  const {
    contractValue,
    tcoHorizonYears,
    processType,
    techLevel,
    stakeholders,
    dailyCostOfInaction,
    renegotiationCost,
    bypassAuditExposure,
    customSteps,
  } = inputs;

  const normalizedFlexibility = clamp(flexibilityIndex, 0, 1);
  const rigidityIndex = 1 - normalizedFlexibility; // field model uses inverse
  const tech = TECH_LEVELS[techLevel];
  const steps = getSteps(processType, customSteps);
  const baseRigidity = PROCESS_RIGIDITY[processType];

  // Derive days from process step templates × tech multiplier
  const rigidDays = deriveRigidDays(steps, tech.timeMultiplier);
  const flexibleDays = deriveFlexibleDays(steps, tech.timeMultiplier);

  // Staff costs from step participation matrix
  const rigidStaffCost = deriveStaffCost(steps, false, stakeholders);
  const flexibleStaffCost = deriveStaffCost(steps, true, stakeholders);

  // Coordination costs (email chains, phone, manual tracking)
  const rigidCoordCost = tech.coordCostPerDay * rigidDays;
  const flexibleCoordCost = tech.coordCostPerDay * flexibleDays;

  // Tool license (amortized per process); flexible path uses ~30% of tool capacity
  const rigidToolCost = tech.toolCostPerProcess;
  const flexibleToolCost = tech.toolCostPerProcess * 0.3;

  // Opportunity cost: price premium + deployment delay
  const rigidPricePremium = contractValue * RIGIDITY_PRICE_PREMIUM;
  const delayDays = Math.max(0, rigidDays - flexibleDays);
  const rigidDelayCost = delayDays * dailyCostOfInaction;
  const rigidOpportunityCost = rigidPricePremium + rigidDelayCost;
  const flexibleOpportunityCost = 0;

  // 4. Renegotiation cost
  const rigidRenegotiationProb = clamp(BASE_RENEGOTIATION_PROBABILITY + RIGIDITY_RENEGOTIATION_PREMIUM, 0, 1);
  const flexibleRenegotiationProb = clamp(BASE_RENEGOTIATION_PROBABILITY * (1 - normalizedFlexibility * 0.3), 0, 1);
  const rigidRenegotiationExpected = rigidRenegotiationProb * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleRenegotiationProb * renegotiationCost;

  // 5. TCO foregone savings
  const normalizedTcoHorizonYears = Math.max(0, tcoHorizonYears);
  const rigidTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * normalizedTcoHorizonYears * rigidityIndex;
  const flexibleTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * normalizedTcoHorizonYears * (rigidityIndex * 0.35);
  // Renegotiation cost
  const rigidRenegotiationExpected = (BASE_RENEGOTIATION_PROBABILITY + RIGIDITY_RENEGOTIATION_PREMIUM) * renegotiationCost;
  const flexibleRenegotiationExpected = BASE_RENEGOTIATION_PROBABILITY * 0.7 * renegotiationCost;

  // TCO foregone savings
  const rigidTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * 0.9;
  const flexibleTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * 0.3;

  // Bypass probability: base rigidity adjusted by tech level
  const effectiveRigidity = Math.min(1, baseRigidity * tech.bypassProbMultiplier);
  const pBypassRigid = bypassProbability(effectiveRigidity);
  // Field model: end-to-end system makes bypass structurally impossible
  const pBypassFlexible = tech.policyRigidityIndex * 0.1;
  const rigidBypassCost = pBypassRigid * bypassAuditExposure;
  const flexibleBypassCost = pBypassFlexible * bypassAuditExposure;

  const rigid = buildBreakdown(
    rigidDays, rigidStaffCost, rigidCoordCost, rigidToolCost,
    rigidOpportunityCost, rigidRenegotiationExpected, rigidTCOForgone, rigidBypassCost,
  );
  const flexible = buildBreakdown(
    flexibleDays, flexibleStaffCost, flexibleCoordCost, flexibleToolCost,
    flexibleOpportunityCost, flexibleRenegotiationExpected, flexibleTCOForgone, flexibleBypassCost,
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
      bypassProbability: result.bypassProbability * 0.1,
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
