// ProcuraCost 2.1. Outputs are scenario estimates under assumptions documented in
// docs/MODEL_PARAMETERS.md, not measured facts. Formal/sequential and
// adaptive/compliant paths share the same legal boundary; no winner is imposed.
//
// - Szucs (JEEA 2024, DOI 10.1093/jeea/jvad017): discretion RAISES prices and selects
//   less-productive contractors. Competitive (rigid) tendering averts this favoritism
//   premium — the governance value credited to formal procedures here.
// - Beuve, Moszoro & Spiller (NBER wp28491; JLEO 2023): 2SLS/IV estimate (rigidity
//   instrumented by political contestability; exclusion restriction load-bearing); French
//   car-park sector; +0.077–0.105 formal amendments per contract-year for a one-SD
//   increase in each rigidity category. This is a frequency, not an event probability.
// - TCO and bypass magnitudes are broad scenarios, not literature estimates.
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
  getStaffContextMultiplier,
  ProcessStep,
} from "./process-templates";
import { MODEL_VERSION } from "./version";

export type { ProcessType, TechLevelId, StakeholderRole };

export interface ProcurementInputs {
  contractValue: number;
  tcoHorizonYears: number;
  contractDurationYears: number; // years — exposure period for annual amendment frequency
  processType: ProcessType;
  techLevel: TechLevelId;
  stakeholders: Record<StakeholderRole, { count: number; dailyRate: number }>;
  dailyCostOfInaction: number; // PLN/day — value lost per day without the contract
  renegotiationCost: number;   // PLN — cost if contract requires renegotiation
  bypassAuditExposure: number; // PLN — audit/penalty cost if informal bypass discovered
  customSteps?: ProcessStep[];

  // Context dimensions. Their numeric multipliers are transparent assumptions.
  spendType?: "direct" | "indirect";      // Direct = goes into product/service; Indirect = support spend
  processPhase?: "upstream" | "downstream"; // Upstream = strategic (sourcing/contracting/SRM); Downstream = operational P2P
}

export interface CostBreakdown {
  // Staff time cost (hours × role rates, from step participation matrix)
  timeCost: number;
  // Non-labor administrative overhead plus tool license. Role hours are separate.
  adminCost: number;
  // Opportunity cost: deployment-delay cost over this path's own duration
  opportunityCost: number;
  // Competition / selection-quality cost. Field name retained for compatibility.
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

// The 7 symmetric cost dimensions of the model (order matches CostBreakdown).
export const COST_DIMENSION_KEYS = [
  "timeCost",
  "adminCost",
  "opportunityCost",
  "productivityCost",
  "renegotiationCost",
  "tcoCost",
  "bypassCost",
] as const;
export type CostDimensionKey = (typeof COST_DIMENSION_KEYS)[number];

// Full computation trace for researcher export / replication. Purely descriptive:
// every value is copied from the same intermediates that produce the breakdowns,
// so adding it never changes a numeric result.
export interface CalculationTrace {
  modelVersion: string;
  sanitizedInputs: {
    contractValue: number;
    tcoHorizonYears: number;
    contractDurationYears: number;
    dailyCostOfInaction: number;
    renegotiationCost: number;
    bypassAuditExposure: number;
  };
  context: {
    spendType?: "direct" | "indirect";
    processPhase?: "upstream" | "downstream";
  };
  process: {
    processType: ProcessType;
    techLevel: TechLevelId;
    stepCount: number;
    baseRigidity: number;
    flexibleRigidity: number;
    corruptionContext: number;
  };
  multipliers: DimensionMultipliers;
  multiplierDetails: DimensionMultiplierDetail[];
  days: { rigid: number; flexible: number };
  probabilities: {
    bypassRigid: number;
    bypassFlexible: number;
  };
  renegotiation: {
    annualFrequencyRigid: number;
    annualFrequencyFlexible: number;
    expectedCountRigid: number;
    expectedCountFlexible: number;
  };
  dimensions: Record<CostDimensionKey, { rigid: number; flexible: number }>;
}

export interface ComparisonResult {
  rigid: CostBreakdown;
  flexible: CostBreakdown;
  delta: number;
  // Formal-minus-adaptive delta as a percentage of the adaptive modeled total.
  deltaPercent: number;
  bypassProbability: number;
  flexibleBypassProbability: number;
  rigidDays: number;
  flexibleDays: number;
  uncertainty: {
    lowDelta: number;
    centralDelta: number;
    highDelta: number;
    lowPercentOfContractValue: number;
    highPercentOfContractValue: number;
    crossesZero: boolean;
  };
  decisionThreshold: {
    // Effective calendar-day advantage; the user-supplied daily cost is not
    // altered by a hidden context coefficient.
    effectiveDayDifference: number;
    // Formal-minus-adaptive delta after removing opportunity cost.
    nonDelayDelta: number;
    // Daily inaction cost above which the central result favours adaptive.
    breakEvenDailyCostOfInaction: number | null;
  };
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

export interface MatrixCell {
  techLevel: TechLevelId;
  processMode: "rigid" | "flexible";
  totalCost: number;
  days: number;
  bypassProbability: number;
}

type EvidenceCase = "low" | "central" | "high";

// Scenario ranges, not confidence intervals. `low` minimizes the rigid-minus-adaptive
// delta; `high` maximizes it. Wide bounds expose weak evidence instead of laundering it
// into a precise point estimate.
const EVIDENCE_CASES = {
  low: { favoritismPremium: 0.09, renegotiationSlope: 0, tcoSavingsPotential: 0, formalBypassProbability: 0.02, adaptiveBypassProbability: 0.15 },
  central: { favoritismPremium: 0.06, renegotiationSlope: 0.077, tcoSavingsPotential: 0, formalBypassProbability: 0.05, adaptiveBypassProbability: 0.05 },
  high: { favoritismPremium: 0.02, renegotiationSlope: 0.105, tcoSavingsPotential: 0.15, formalBypassProbability: 0.30, adaptiveBypassProbability: 0.01 },
} as const;

// Competition, contract design and commercial flexibility are separate constructs.
// These Grade-C defaults are transparent scenario inputs, never measurements.
const PATH_PROFILES: Record<ProcessType, {
  formalCompetition: number;
  adaptiveCompetition: number;
  formalContractRigidity: number;
  adaptiveContractRigidity: number;
  formalTcoCapture: number;
  adaptiveTcoCapture: number;
}> = {
  pzp_eu: { formalCompetition: 0.95, adaptiveCompetition: 0.90, formalContractRigidity: 0.75, adaptiveContractRigidity: 0.45, formalTcoCapture: 0.65, adaptiveTcoCapture: 0.70 },
  pzp_krajowy: { formalCompetition: 0.90, adaptiveCompetition: 0.85, formalContractRigidity: 0.65, adaptiveContractRigidity: 0.40, formalTcoCapture: 0.67, adaptiveTcoCapture: 0.72 },
  private_formal: { formalCompetition: 0.85, adaptiveCompetition: 0.75, formalContractRigidity: 0.60, adaptiveContractRigidity: 0.30, formalTcoCapture: 0.70, adaptiveTcoCapture: 0.75 },
  policy_only: { formalCompetition: 0.75, adaptiveCompetition: 0.70, formalContractRigidity: 0.35, adaptiveContractRigidity: 0.25, formalTcoCapture: 0.73, adaptiveTcoCapture: 0.78 },
  catalog_order: { formalCompetition: 0.90, adaptiveCompetition: 0.90, formalContractRigidity: 0.25, adaptiveContractRigidity: 0.20, formalTcoCapture: 0.80, adaptiveTcoCapture: 0.82 },
  mrp_order: { formalCompetition: 0.90, adaptiveCompetition: 0.90, formalContractRigidity: 0.20, adaptiveContractRigidity: 0.18, formalTcoCapture: 0.85, adaptiveTcoCapture: 0.86 },
  capex: { formalCompetition: 0.88, adaptiveCompetition: 0.80, formalContractRigidity: 0.70, adaptiveContractRigidity: 0.40, formalTcoCapture: 0.70, adaptiveTcoCapture: 0.75 },
  custom: { formalCompetition: 0.80, adaptiveCompetition: 0.75, formalContractRigidity: 0.55, adaptiveContractRigidity: 0.35, formalTcoCapture: 0.70, adaptiveTcoCapture: 0.75 },
};

// Direct/Indirect × Upstream/Downstream context multipliers (getDimensionMultipliers).
// Grade-C modeling assumptions; each scales ONE cost channel through the shared
// per-path formulas. Audited invariant: no dimension's total context uplift exceeds
// ~×1.5 (scripts/recompute.ts / MODEL_PARAMETERS.md §4).
const UPSTREAM_COORDINATION_MULTIPLIER = 1.15;
const DOWNSTREAM_COORDINATION_MULTIPLIER = 0.85;

/**
 * Returns a set of multipliers based on Spend Type (Direct/Indirect) and Process Phase (Upstream/Downstream).
 * This is the central place for dimension-based model behavior.
 */
export function getDimensionMultipliers(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  // Calendar time comes only from the process template and technology. Context
  // changes broad staff effort and non-labor coordination; it does not alter the
  // user-supplied daily inaction cost or reuse one mechanism for another.
  const staffMultiplier = getStaffContextMultiplier(processPhase, spendType);
  const tcoMultiplier = 1;
  const delayMultiplier = 1;
  const productivityMultiplier = 1;
  const bypassMultiplier = 1;
  const renegotiationMultiplier = 1;
  let coordinationIntensityMultiplier = 1; // per-day meeting & alignment effort

  // Upstream vs Downstream effects
  if (processPhase === "upstream") {
    coordinationIntensityMultiplier = UPSTREAM_COORDINATION_MULTIPLIER; // higher meeting & alignment effort per day
  } else if (processPhase === "downstream") {
    coordinationIntensityMultiplier = DOWNSTREAM_COORDINATION_MULTIPLIER; // more standardized, less coordination
  }

  return {
    staffMultiplier,
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
 * Returns array of { key, value } for the non-1.0 factors. User-facing labels
 * live in lib/i18n.ts (dimensionMultiplierLabelsT) — the model layer stays
 * language-free.
 */
export type DimensionMultiplierKey =
  | "staff"
  | "tco"
  | "delay"
  | "productivity"
  | "bypass"
  | "renegotiation"
  | "coordination";

export function getDimensionMultiplierDetails(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  const m = getDimensionMultipliers(spendType, processPhase);
  const details: Array<{ key: DimensionMultiplierKey; value: number }> = [];

  if (m.staffMultiplier !== 1) details.push({ key: "staff", value: m.staffMultiplier });
  if (m.tcoMultiplier !== 1) details.push({ key: "tco", value: m.tcoMultiplier });
  if (m.delayMultiplier !== 1) details.push({ key: "delay", value: m.delayMultiplier });
  if (m.productivityMultiplier !== 1) details.push({ key: "productivity", value: m.productivityMultiplier });
  if (m.bypassMultiplier !== 1) details.push({ key: "bypass", value: m.bypassMultiplier });
  if (m.renegotiationMultiplier !== 1) details.push({ key: "renegotiation", value: m.renegotiationMultiplier });
  if (m.coordinationIntensityMultiplier !== 1) details.push({ key: "coordination", value: m.coordinationIntensityMultiplier });

  return details;
}

export type DimensionMultipliers = ReturnType<typeof getDimensionMultipliers>;
export type DimensionMultiplierDetail = ReturnType<typeof getDimensionMultiplierDetails>[number];

/** Both paths use the selected technology stack, so both carry the same tool cost. */
const FLEXIBLE_TOOL_UTILIZATION_RATE = 1;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function renegotiationAnnualFrequency(contractRigidity: number, slope: number, contextMultiplier: number): number {
  return clamp(slope * contractRigidity * contextMultiplier, 0, 0.105);
}

function nonNegativeFinite(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
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

type PointComparisonResult = Omit<ComparisonResult, "uncertainty" | "decisionThreshold">;

function calculateCostsForEvidenceCase(inputs: ProcurementInputs, evidenceCase: EvidenceCase): PointComparisonResult {
  // Basic sanitization of inputs (defensive programming)
  const contractValue = nonNegativeFinite(inputs.contractValue);
  const tcoHorizonYears = nonNegativeFinite(inputs.tcoHorizonYears);
  const contractDurationYears = nonNegativeFinite(inputs.contractDurationYears);
  const dailyCostOfInaction = nonNegativeFinite(inputs.dailyCostOfInaction);
  const renegotiationCost = nonNegativeFinite(inputs.renegotiationCost);
  const bypassAuditExposure = nonNegativeFinite(inputs.bypassAuditExposure);

  const {
    processType,
    techLevel,
    stakeholders,
    customSteps,
  } = inputs;

  const tech = TECH_LEVELS[techLevel];
  const steps = getSteps(processType, customSteps);
  const evidence = EVIDENCE_CASES[evidenceCase];
  const profile = PATH_PROFILES[processType];
  const baseRigidity = PROCESS_RIGIDITY[processType];
  // Retained in the trace for compatibility; economic formulas below use the separate
  // competition, contract-rigidity and TCO-capture profile fields.
  const flexibleRigidity = profile.adaptiveContractRigidity;
  const corruptionContext = CORRUPTION_RISK_CONTEXT[processType];

  // Dimension multipliers must be calculated early
  const dims = getDimensionMultipliers(inputs.spendType, inputs.processPhase);

  // Derive days from process step templates × tech multiplier + context
  const rigidDays = deriveRigidDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);
  const flexibleDays = deriveFlexibleDays(steps, tech.timeMultiplier, inputs.processPhase, inputs.spendType);

  // Staff costs from step participation matrix and one broad context factor.
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

  // Illustrative non-labor administrative overhead. Stakeholder labor is already
  // captured by the step participation matrix and is not repeated here.
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

  // Favoritism / selection-quality cost (Szucs 2024). Competition effectiveness is
  // distinct from workflow or contract rigidity; an adaptive route may still compete.
  const rigidProductivityCost =
    contractValue * evidence.favoritismPremium * (1 - profile.formalCompetition) * corruptionContext * dims.productivityMultiplier;
  const flexibleProductivityCost =
    contractValue * evidence.favoritismPremium * (1 - profile.adaptiveCompetition) * corruptionContext * dims.productivityMultiplier;

  // Beuve et al. measure CONTRACTUAL rigidity in French car-park contracts. We model
  // only the incremental premium; their 22% sample mean is not exported as a universal
  // baseline for unrelated sectors.
  const rigidRenegotiationFrequency = renegotiationAnnualFrequency(
    profile.formalContractRigidity, evidence.renegotiationSlope, dims.renegotiationMultiplier,
  );
  const flexibleRenegotiationFrequency = renegotiationAnnualFrequency(
    profile.adaptiveContractRigidity, evidence.renegotiationSlope, dims.renegotiationMultiplier,
  );
  const rigidExpectedAmendments = rigidRenegotiationFrequency * contractDurationYears;
  const flexibleExpectedAmendments = flexibleRenegotiationFrequency * contractDurationYears;
  const rigidRenegotiationExpected = rigidExpectedAmendments * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleExpectedAmendments * renegotiationCost;

  // TCO is a cumulative scenario potential over the user-selected horizon, not an
  // invented annual law. The evidence range is 0–15%; the old unsupported 30% headline
  // no longer drives the default result.
  const horizonScale = clamp(tcoHorizonYears / 3, 0, 1);
  const tcoPool = contractValue * evidence.tcoSavingsPotential * horizonScale * dims.tcoMultiplier;
  const rigidTCOForgone = tcoPool * (1 - profile.formalTcoCapture);
  const flexibleTCOForgone = tcoPool * (1 - profile.adaptiveTcoCapture);

  // Bypass has no defensible structural probability function in the cited theory.
  // Use broad observable-rate scenarios and let system controls scale both paths.
  const pBypassRigid = clamp(
    evidence.formalBypassProbability * tech.bypassProbMultiplier * dims.bypassMultiplier, 0, 0.50,
  );
  const pBypassFlexible = clamp(
    evidence.adaptiveBypassProbability * tech.bypassProbMultiplier * dims.bypassMultiplier, 0, 0.50,
  );
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
      modelVersion: MODEL_VERSION,
      sanitizedInputs: {
        contractValue,
        tcoHorizonYears,
        contractDurationYears,
        dailyCostOfInaction,
        renegotiationCost,
        bypassAuditExposure,
      },
      context: {
        spendType: inputs.spendType,
        processPhase: inputs.processPhase,
      },
      process: {
        processType,
        techLevel,
        stepCount: steps.length,
        baseRigidity,
        flexibleRigidity,
        corruptionContext,
      },
      multipliers: dims,
      multiplierDetails: getDimensionMultiplierDetails(inputs.spendType, inputs.processPhase),
      days: { rigid: rigidDays, flexible: flexibleDays },
      probabilities: {
        bypassRigid: pBypassRigid,
        bypassFlexible: pBypassFlexible,
      },
      renegotiation: {
        annualFrequencyRigid: rigidRenegotiationFrequency,
        annualFrequencyFlexible: flexibleRenegotiationFrequency,
        expectedCountRigid: rigidExpectedAmendments,
        expectedCountFlexible: flexibleExpectedAmendments,
      },
      dimensions: {
        timeCost: { rigid: rigid.timeCost, flexible: flexible.timeCost },
        adminCost: { rigid: rigid.adminCost, flexible: flexible.adminCost },
        opportunityCost: { rigid: rigid.opportunityCost, flexible: flexible.opportunityCost },
        productivityCost: { rigid: rigid.productivityCost, flexible: flexible.productivityCost },
        renegotiationCost: { rigid: rigid.renegotiationCost, flexible: flexible.renegotiationCost },
        tcoCost: { rigid: rigid.tcoCost, flexible: flexible.tcoCost },
        bypassCost: { rigid: rigid.bypassCost, flexible: flexible.bypassCost },
      },
    },
    sources: {
      timeCost: "Step durations: legal minima (PZP 2019 + Dyrektywa 2014/24/UE) and practitioner benchmarks — not a single empirical source",
      opportunityCost: "Deployment-delay cost = procurement duration × daily cost of inaction (model construction)",
      productivityCost: "Szucs (2024), JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017: discretion increased normalized prices by about 6 percentage points and selected firms with about 28% lower measured productivity in the corrected main specification. The model monetizes price only and stress-tests 2–9%; Hungarian public-procurement transfer caveat applies",
      renegotiationCost: "Beuve, Moszoro & Spiller (2023), JLEO 39(1):281–308, DOI 10.1093/jleo/ewab039: 2SLS/IV estimate for annual formal-amendment frequency, not event probability, in French car-park contracts. The model maps 0–0.105 additional amendments per contract-year to a separate contract-rigidity profile and multiplies by contract duration and user-supplied per-amendment cost",
      tcoCost: "Scenario assumption only: a three-year cumulative non-acquisition lifecycle savings pool is stress-tested at 0–15%, scaled by min(horizon years / 3, 1), and multiplied by path-specific capture rates. The central case is zero because no transferable empirical estimate is available",
      bypassCost: "Scenario assumption only: illustrative bypass-rate range, scaled by system controls. Lipsky (1980), Vaughan (1996), and Holmström & Milgrom (1991) support mechanisms, not probabilities",
    },
  };
}

export function calculateCosts(inputs: ProcurementInputs): ComparisonResult {
  const central = calculateCostsForEvidenceCase(inputs, "central");
  const low = calculateCostsForEvidenceCase(inputs, "low");
  const high = calculateCostsForEvidenceCase(inputs, "high");
  const contractValue = nonNegativeFinite(inputs.contractValue);
  const lowDelta = Math.min(low.delta, central.delta, high.delta);
  const highDelta = Math.max(low.delta, central.delta, high.delta);
  const centralOpportunityDelta = central.rigid.opportunityCost - central.flexible.opportunityCost;
  const nonDelayDelta = central.delta - centralOpportunityDelta;
  const effectiveDayDifference = Math.max(
    0,
    (central.rigidDays - central.flexibleDays) * central.trace.multipliers.delayMultiplier,
  );
  const breakEvenDailyCostOfInaction = effectiveDayDifference > 0
    ? Math.max(0, -nonDelayDelta / effectiveDayDifference)
    : null;

  return {
    ...central,
    uncertainty: {
      lowDelta,
      centralDelta: central.delta,
      highDelta,
      lowPercentOfContractValue: contractValue > 0 ? (lowDelta / contractValue) * 100 : 0,
      highPercentOfContractValue: contractValue > 0 ? (highDelta / contractValue) * 100 : 0,
      crossesZero: lowDelta <= 0 && highDelta >= 0,
    },
    decisionThreshold: {
      effectiveDayDifference,
      nonDelayDelta,
      breakEvenDailyCostOfInaction,
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
