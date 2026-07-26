// ProcuraCost 2.2. Outputs are scenario estimates under assumptions documented in
// docs/MODEL_PARAMETERS.md, not measured facts. Formal/sequential and
// adaptive/compliant paths share the same legal boundary; no winner is imposed.
//
// 2.2 reports ΔC decomposed into three buckets with different time bases and
// different evidential standing, because summing them into one headline number
// hid the fact that the delay bucket dominated it:
//   - process   (per procurement event): staff, admin, selection, bypass
//   - delay     (per procurement event): elapsed-day difference × a daily cost the
//                USER supplies. This bucket is an accounting identity, not a finding.
//   - lifecycle (over the contract life): formal amendments, foregone lifecycle value
//
// - Szucs (JEEA 2024, DOI 10.1093/jeea/jvad017): discretion RAISES prices and selects
//   less-productive contractors. Competitive (rigid) tendering averts this favoritism
//   premium — the governance value credited to formal procedures here.
// - Beuve, Moszoro & Spiller (JLEO 2023): 2SLS/IV estimate (rigidity instrumented by
//   political contestability); French car-park sector; +0.077–0.105 formal amendments
//   per contract-year for a ONE-STANDARD-DEVIATION increase in each rigidity category.
//   ProcuraCost multiplies it by a 0–1 calibration profile that is NOT a z-score, so
//   the slope is a scenario assumption anchored to an external order of magnitude —
//   not a transferred estimate. Only the between-path difference is interpretable.
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
  deriveActiveDays,
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
  // Annual real discount rate, in percent. Optional; DEFAULT_DISCOUNT_RATE_PCT applies.
  // Model 2.1 had no discount rate at all and summed a per-event cost with an
  // undiscounted whole-of-contract-life amendment stream — for a ten-year CAPEX that
  // overstated the lifecycle side by roughly a quarter and left `total` with no time base.
  discountRatePct?: number;
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
  // Bucket subtotals. `total` remains their sum for backward compatibility, but the
  // three buckets have different time bases and must be read separately.
  processCost: number;   // per procurement event: time + admin + selection + bypass
  delayCost: number;     // per procurement event: days × user-supplied daily cost
  lifecycleCost: number; // over the contract life: amendments + foregone lifecycle value
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
    discountRatePct: number;
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

// How to read `breakEvenDailyCostOfInaction`.
// - threshold_above_zero: the delay bucket decides. Adaptive wins only once the daily
//   cost of inaction exceeds the reported threshold.
// - formal_costlier_at_zero_delay: the formal path is already more expensive with the
//   delay bucket removed entirely. The threshold is negative and not actionable.
// - adaptive_costlier_at_zero_delay: mirror case.
// - no_day_difference: both paths take the same time, so no threshold exists.
export type BreakEvenStatus =
  | "threshold_above_zero"
  | "formal_costlier_at_zero_delay"
  | "adaptive_costlier_at_zero_delay"
  | "no_day_difference";

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
  // ΔC split by time base and evidential standing. `delay` is the elapsed-day
  // difference multiplied by a daily cost the user supplies; it is an accounting
  // identity and is reported separately so it cannot be read as a modeled finding.
  deltaDecomposition: {
    process: number;
    delay: number;
    lifecycle: number;
    // |delay| as a share of |delta|, in percent. Disclosed because in the built-in
    // scenarios this bucket carries 77–99% of the headline number.
    delayShareOfDeltaPercent: number;
  };
  decisionThreshold: {
    // Signed calendar-day advantage of the adaptive path (positive = adaptive faster).
    effectiveDayDifference: number;
    // Formal-minus-adaptive delta after removing the delay bucket.
    nonDelayDelta: number;
    // Raw solution of ΔC(c_d) = 0. May be negative or null — see `status`, which
    // must be used to interpret it. Never clamped: a clamped zero is indistinguishable
    // from "formal already loses with free delay", which is a different claim.
    breakEvenDailyCostOfInaction: number | null;
    status: BreakEvenStatus;
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
  // Discovery: the formal path forces an early requirement freeze, so it captures LESS
  // lifecycle value than the adaptive one by a wide margin — but co-design with a small
  // set of suppliers genuinely weakens competition, which is the trade the type exists to
  // represent. This is the one profile row where the competition gap is large.
  discovery: { formalCompetition: 0.82, adaptiveCompetition: 0.62, formalContractRigidity: 0.55, adaptiveContractRigidity: 0.30, formalTcoCapture: 0.60, adaptiveTcoCapture: 0.78 },
  catalog_order: { formalCompetition: 0.90, adaptiveCompetition: 0.90, formalContractRigidity: 0.25, adaptiveContractRigidity: 0.20, formalTcoCapture: 0.80, adaptiveTcoCapture: 0.82 },
  mrp_order: { formalCompetition: 0.90, adaptiveCompetition: 0.90, formalContractRigidity: 0.20, adaptiveContractRigidity: 0.18, formalTcoCapture: 0.85, adaptiveTcoCapture: 0.86 },
  capex: { formalCompetition: 0.88, adaptiveCompetition: 0.80, formalContractRigidity: 0.70, adaptiveContractRigidity: 0.40, formalTcoCapture: 0.70, adaptiveTcoCapture: 0.75 },
  custom: { formalCompetition: 0.80, adaptiveCompetition: 0.75, formalContractRigidity: 0.55, adaptiveContractRigidity: 0.35, formalTcoCapture: 0.70, adaptiveTcoCapture: 0.75 },
};

// Direct/Indirect × Upstream/Downstream context multipliers (getDimensionMultipliers).
//
// SCOPE, stated explicitly because the earlier shape overpromised: context reaches
// exactly TWO channels — role hours and non-labor coordination. Model 2.1 also
// declared tco/delay/productivity/bypass/renegotiation multipliers, but all five were
// hardcoded to 1, so four of the seven dimensions had no context sensitivity at all
// while the API implied otherwise. They are removed in 2.2 rather than left inert.
// Reviving any of them requires an argument for the specific mechanism, not a constant.
//
// Grade-C modeling assumptions. Audited invariant: no dimension's total context uplift
// exceeds ~×1.5 (scripts/recompute.ts / docs/MODEL_PARAMETERS.md).
const UPSTREAM_COORDINATION_MULTIPLIER = 1.15;
const DOWNSTREAM_COORDINATION_MULTIPLIER = 0.85;

/**
 * Context multipliers from Spend Type (Direct/Indirect) and Process Phase
 * (Upstream/Downstream). Calendar time comes only from the process template and
 * technology; context never alters a statutory wait or the user-supplied daily
 * inaction cost.
 */
export function getDimensionMultipliers(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  const staffMultiplier = getStaffContextMultiplier(processPhase, spendType);
  let coordinationIntensityMultiplier = 1; // per-day meeting & alignment effort

  if (processPhase === "upstream") {
    coordinationIntensityMultiplier = UPSTREAM_COORDINATION_MULTIPLIER;
  } else if (processPhase === "downstream") {
    coordinationIntensityMultiplier = DOWNSTREAM_COORDINATION_MULTIPLIER;
  }

  return { staffMultiplier, coordinationIntensityMultiplier };
}

/**
 * Human-readable labels for the dimension multipliers (for UI/PDF/reports).
 * Returns array of { key, value } for the non-1.0 factors. User-facing labels
 * live in lib/i18n.ts (dimensionMultiplierLabelsT) — the model layer stays
 * language-free.
 */
export type DimensionMultiplierKey = "staff" | "coordination";

export function getDimensionMultiplierDetails(
  spendType?: "direct" | "indirect",
  processPhase?: "upstream" | "downstream"
) {
  const m = getDimensionMultipliers(spendType, processPhase);
  const details: Array<{ key: DimensionMultiplierKey; value: number }> = [];

  if (m.staffMultiplier !== 1) details.push({ key: "staff", value: m.staffMultiplier });
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

// Expected annual formal-amendment frequency for a path.
//
// UNIT WARNING (load-bearing, see docs/MODEL_PARAMETERS.md): `slope` is anchored to an
// external 2SLS/IV estimate expressed per ONE STANDARD DEVIATION of a survey rigidity
// index, while `contractRigidity` is a hand-authored 0–1 calibration score that is not
// a z-score. The product is therefore a scenario assumption with an external order-of-
// magnitude anchor, not a transferred effect size. Only the difference between the two
// paths is interpretable; neither level is.
//
// The bound is structural rather than a magic constant: the profile is 0–1, so the
// frequency can never exceed the slope. (Model 2.1 clamped at 0.105, which was
// unreachable — the maximum attainable product was 0.105 × 0.75 = 0.079.)
function renegotiationAnnualFrequency(contractRigidity: number, slope: number): number {
  return clamp(slope, 0, 1) * clamp(contractRigidity, 0, 1);
}

function nonNegativeFinite(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * Annual real discount rate applied to lifecycle flows. 4% is the conventional real
 * social discount rate used in Polish and EU public-investment appraisal; it is a
 * declared assumption, not an estimate, and the user can override it.
 */
export const DEFAULT_DISCOUNT_RATE_PCT = 4;

/** Years over which the TCO savings pool is defined. The pool is a cumulative figure. */
const TCO_POOL_YEARS = 3;

/**
 * Present value of one unit received annually for `years`, at annual rate `rate`.
 * Reduces to `years` when the rate is zero, so a zero-rate run reproduces the
 * undiscounted model exactly.
 */
function annuityFactor(years: number, rate: number): number {
  const n = nonNegativeFinite(years);
  const r = Number.isFinite(rate) ? Math.max(0, rate) : 0;
  if (n === 0) return 0;
  if (r === 0) return n;
  return (1 - Math.pow(1 + r, -n)) / r;
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
  const processCost = timeCost + adminCost + productivityCost + bypassCost;
  const delayCost = opportunityCost;
  const lifecycleCost = renegotiationExpected + tcoCost;
  const total = processCost + delayCost + lifecycleCost;
  return {
    timeCost,
    adminCost,
    opportunityCost,
    productivityCost,
    renegotiationCost: renegotiationExpected,
    tcoCost,
    bypassCost,
    total,
    processCost,
    delayCost,
    lifecycleCost,
    days,
    staffCost,
    coordCost,
    toolCost,
  };
}

type PointComparisonResult = Omit<ComparisonResult, "uncertainty" | "decisionThreshold" | "deltaDecomposition">;

function calculateCostsForEvidenceCase(inputs: ProcurementInputs, evidenceCase: EvidenceCase): PointComparisonResult {
  // Basic sanitization of inputs (defensive programming)
  const contractValue = nonNegativeFinite(inputs.contractValue);
  const tcoHorizonYears = nonNegativeFinite(inputs.tcoHorizonYears);
  const contractDurationYears = nonNegativeFinite(inputs.contractDurationYears);
  const dailyCostOfInaction = nonNegativeFinite(inputs.dailyCostOfInaction);
  const renegotiationCost = nonNegativeFinite(inputs.renegotiationCost);
  const bypassAuditExposure = nonNegativeFinite(inputs.bypassAuditExposure);
  const discountRatePct = Number.isFinite(inputs.discountRatePct as number)
    ? Math.max(0, inputs.discountRatePct as number)
    : DEFAULT_DISCOUNT_RATE_PCT;
  const discountRate = discountRatePct / 100;

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
    inputs.spendType,
    tech.timeMultiplier,
  );

  const flexibleStaffCost = deriveStaffCost(
    steps,
    true,
    stakeholders,
    inputs.processPhase,
    inputs.spendType,
    tech.timeMultiplier,
  );

  // Illustrative non-labor administrative overhead. Stakeholder labor is already
  // captured by the step participation matrix and is not repeated here.
  //
  // Charged over ACTIVE days only. Model 2.1 charged it over every elapsed day, so a
  // pzp_eu process accrued "per-day meeting & alignment effort" across all 45 days of
  // statutory publication and standstill — periods in which, by construction, no role
  // has any participation hours at all.
  const rigidActiveDays = deriveActiveDays(steps, tech.timeMultiplier, false);
  const flexibleActiveDays = deriveActiveDays(steps, tech.timeMultiplier, true);
  const rigidCoordCost = tech.coordCostPerDay * rigidActiveDays * dims.coordinationIntensityMultiplier;
  const flexibleCoordCost = tech.coordCostPerDay * flexibleActiveDays * dims.coordinationIntensityMultiplier;

  // Tool license (amortized per process)
  const rigidToolCost = tech.toolCostPerProcess;
  const flexibleToolCost = tech.toolCostPerProcess * FLEXIBLE_TOOL_UTILIZATION_RATE;

  // Opportunity cost: deployment-delay cost over EACH path's own duration. Both paths
  // tie up value while procuring; the saving is the difference, reported honestly as a
  // delta of two non-zero quantities (no zero-friction baseline).
  const rigidOpportunityCost = rigidDays * dailyCostOfInaction;
  const flexibleOpportunityCost = flexibleDays * dailyCostOfInaction;

  // Favoritism / selection-quality cost (Szucs 2024). Competition effectiveness is
  // distinct from workflow or contract rigidity; an adaptive route may still compete.
  const rigidProductivityCost =
    contractValue * evidence.favoritismPremium * (1 - profile.formalCompetition) * corruptionContext;
  const flexibleProductivityCost =
    contractValue * evidence.favoritismPremium * (1 - profile.adaptiveCompetition) * corruptionContext;

  // Beuve et al. measure CONTRACTUAL rigidity in French car-park contracts. We model
  // only the incremental premium; their 22% sample mean is not exported as a universal
  // baseline for unrelated sectors.
  const rigidRenegotiationFrequency = renegotiationAnnualFrequency(
    profile.formalContractRigidity, evidence.renegotiationSlope,
  );
  const flexibleRenegotiationFrequency = renegotiationAnnualFrequency(
    profile.adaptiveContractRigidity, evidence.renegotiationSlope,
  );
  // Lifecycle flows are discounted to present value at award — the single time base for
  // the whole model. Model 2.1 multiplied the annual frequency by contract duration with
  // no discounting, so a ten-year contract contributed ten full-value amendment years.
  const contractAnnuity = annuityFactor(contractDurationYears, discountRate);
  const rigidExpectedAmendments = rigidRenegotiationFrequency * contractDurationYears;
  const flexibleExpectedAmendments = flexibleRenegotiationFrequency * contractDurationYears;
  const rigidRenegotiationExpected = rigidRenegotiationFrequency * renegotiationCost * contractAnnuity;
  const flexibleRenegotiationExpected = flexibleRenegotiationFrequency * renegotiationCost * contractAnnuity;

  // TCO is a cumulative scenario potential over the user-selected horizon, not an
  // invented annual law. The evidence range is 0–15%; the old unsupported 30% headline
  // no longer drives the default result.
  // The pool is a cumulative figure defined over TCO_POOL_YEARS, so it enters as an
  // annual flow discounted over whichever is shorter — the pool window or the user's
  // horizon. This gives both lifecycle channels the same treatment: model 2.1 scaled
  // amendments linearly and without bound in contract duration while capping TCO at
  // three years, so the same purchase was driven in two directions by two horizons.
  // At a zero discount rate this reproduces the 2.1 value exactly.
  const tcoYears = Math.min(nonNegativeFinite(tcoHorizonYears), TCO_POOL_YEARS);
  const tcoAnnualPool = (contractValue * evidence.tcoSavingsPotential) / TCO_POOL_YEARS;
  const tcoPool = tcoAnnualPool * annuityFactor(tcoYears, discountRate);
  const rigidTCOForgone = tcoPool * (1 - profile.formalTcoCapture);
  const flexibleTCOForgone = tcoPool * (1 - profile.adaptiveTcoCapture);

  // Bypass has no defensible structural probability function in the cited theory.
  // Use broad observable-rate scenarios and let system controls scale both paths.
  // Bounded as a probability. The old 0.50 cap was unreachable (max attainable
  // 0.30 × 1.50 = 0.45) and read as a substantive limit it never imposed.
  const pBypassRigid = clamp(evidence.formalBypassProbability * tech.bypassProbMultiplier, 0, 1);
  const pBypassFlexible = clamp(evidence.adaptiveBypassProbability * tech.bypassProbMultiplier, 0, 1);
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
        discountRatePct,
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
      opportunityCost: "Deployment-delay cost = procurement duration × daily cost of inaction. This is an accounting identity between a template-derived day count and a user-supplied price per day; it is not a modeled or measured effect, and it is reported as its own bucket for that reason",
      productivityCost: "Szucs (2024), JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017, structural estimates: discretion increases prices by about 6% and lowers average contractor total factor productivity by about 10%. (The invalid raw discontinuity reports roughly 32%.) The model monetizes price only and stress-tests 2–9%. Identified on Hungarian contracts below the ~25m HUF / ~90k USD invitational threshold, so transfer to Polish EU-threshold or private procurement is a scenario, not a measurement",
      renegotiationCost: "Scenario assumption with an external order-of-magnitude anchor. Beuve, Moszoro & Spiller (2023), JLEO 39(1):281–308, DOI 10.1093/jleo/ewab039 report +0.077–0.105 formal amendments per contract-year per ONE STANDARD DEVIATION of a rigidity index, by 2SLS/IV, in French car-park contracts. ProcuraCost multiplies that slope by a 0–1 calibration profile that is not a z-score, so the product is not a transferred estimate. Only the difference between the two paths is interpretable; neither reported level is",
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
  const processDelta = central.rigid.processCost - central.flexible.processCost;
  const delayDelta = central.rigid.delayCost - central.flexible.delayCost;
  const lifecycleDelta = central.rigid.lifecycleCost - central.flexible.lifecycleCost;
  const nonDelayDelta = processDelta + lifecycleDelta;

  // Signed: positive means the adaptive path is faster. Model 2.1 clamped this at 0,
  // which silently hid any template where the formal path is the faster one.
  const effectiveDayDifference = central.rigidDays - central.flexibleDays;

  // ΔC(c_d) = nonDelayDelta + effectiveDayDifference × c_d. Solve for zero. The raw
  // solution is reported unclamped and paired with a status, because a clamped 0 and a
  // genuine 0 mean different things: the first says "formal already loses with free
  // delay", the second says "any positive delay cost tips it".
  const breakEvenDailyCostOfInaction = effectiveDayDifference !== 0
    ? -nonDelayDelta / effectiveDayDifference
    : null;

  let status: BreakEvenStatus;
  if (breakEvenDailyCostOfInaction === null) {
    status = "no_day_difference";
  } else if (breakEvenDailyCostOfInaction >= 0) {
    status = "threshold_above_zero";
  } else if (nonDelayDelta > 0) {
    status = "formal_costlier_at_zero_delay";
  } else {
    status = "adaptive_costlier_at_zero_delay";
  }

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
    deltaDecomposition: {
      process: processDelta,
      delay: delayDelta,
      lifecycle: lifecycleDelta,
      delayShareOfDeltaPercent: central.delta !== 0
        ? (Math.abs(delayDelta) / Math.abs(central.delta)) * 100
        : 0,
    },
    decisionThreshold: {
      effectiveDayDifference,
      nonDelayDelta,
      breakEvenDailyCostOfInaction,
      status,
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
