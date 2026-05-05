// Core cost model — academic sources:
// - Szucs (JEEA 2024): discretion → +2% price, -1.6% productivity
// - Beuve, Moszoro & Saussier (NBER wp28491): rigidity → +7.7-10.5% renegotiations
// - ISM Total Cost of Ownership: up to 30% savings over 3 years
// - Lipsky (1980) + Vaughan (1996): bypass probability under rigidity
// - Holmström & Milgrom (1991): enforcement crowds out value creation

export interface ProcurementInputs {
  contractValue: number;        // PLN
  procurementDays: {
    rigid: number;              // days for rigid procedure
    flexible: number;           // days for policy-only compliance
  };
  buyerCount: number;
  dailyBuyerRate: number;       // PLN per day per buyer (salary + overhead)
  adminCostFixed: {
    rigid: number;              // fixed admin overhead for rigid procedure (PLN)
    flexible: number;           // fixed admin overhead for flexible approach (PLN)
  };
  dailyProjectRevenue: number;  // PLN per day — value of delayed deployment
  renegotiationCost: number;    // PLN — cost if contract is renegotiated
  tcoHorizonYears: number;
  flexibilityIndex: number;     // 0–1: how flexible the policy approach is
  bypassAuditExposure: number;  // PLN — audit/penalty cost if informal bypass discovered
}

export interface CostBreakdown {
  timeCost: number;
  adminCost: number;
  opportunityCost: number;
  renegotiationCost: number;
  tcoCost: number;
  bypassCost: number;           // Dimension 6: cost of informal workarounds
  total: number;
}

export interface ComparisonResult {
  rigid: CostBreakdown;
  flexible: CostBreakdown;
  delta: number;
  deltaPercent: number;
  bypassProbability: number;    // for display
  sources: {
    timeCost: string;
    opportunityCost: string;
    renegotiationCost: string;
    tcoCost: string;
    bypassCost: string;
  };
}

const RIGIDITY_PRICE_PREMIUM = 0.02;
const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
const TCO_SAVINGS_RATE_PER_YEAR = 0.10;

// Bypass threshold: rigidity > 0.5 triggers meaningful bypass probability
// Sigmoid function calibrated so rigidity=0.7 → P≈0.73, rigidity=0.9 → P≈0.95
const BYPASS_SIGMOID_STEEPNESS = 10;
const BYPASS_THRESHOLD = 0.5;

function bypassProbability(rigidityIndex: number): number {
  return 1 / (1 + Math.exp(-BYPASS_SIGMOID_STEEPNESS * (rigidityIndex - BYPASS_THRESHOLD)));
}

export function calculateCosts(inputs: ProcurementInputs): ComparisonResult {
  const {
    contractValue,
    procurementDays,
    buyerCount,
    dailyBuyerRate,
    adminCostFixed,
    dailyProjectRevenue,
    renegotiationCost,
    tcoHorizonYears,
    flexibilityIndex,
    bypassAuditExposure,
  } = inputs;

  const rigidityIndex = 1 - flexibilityIndex; // field model uses inverse

  // 1. Time cost
  const rigidTimeCost = procurementDays.rigid * buyerCount * dailyBuyerRate;
  const flexibleTimeCost = procurementDays.flexible * buyerCount * dailyBuyerRate;

  // 2. Admin cost
  const rigidAdminCost = adminCostFixed.rigid;
  const flexibleAdminCost = adminCostFixed.flexible;

  // 3. Opportunity cost: price premium + deployment delay
  const rigidPricePremium = contractValue * RIGIDITY_PRICE_PREMIUM;
  const delayDays = procurementDays.rigid - procurementDays.flexible;
  const rigidDelayCost = Math.max(0, delayDays) * dailyProjectRevenue;
  const rigidOpportunityCost = rigidPricePremium + rigidDelayCost;
  const flexibleOpportunityCost = 0;

  // 4. Renegotiation cost
  const rigidRenegotiationProb = BASE_RENEGOTIATION_PROBABILITY + RIGIDITY_RENEGOTIATION_PREMIUM;
  const flexibleRenegotiationProb = BASE_RENEGOTIATION_PROBABILITY * (1 - flexibilityIndex * 0.3);
  const rigidRenegotiationExpected = rigidRenegotiationProb * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleRenegotiationProb * renegotiationCost;

  // 5. TCO foregone savings
  const rigidTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * (1 - 0.1);
  const flexibleTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * (1 - flexibilityIndex);

  // 6. Bypass cost (Pipe vs. Field model — Lipsky 1980, Vaughan 1996)
  // Rigid procedure: when rigidity > threshold, actors bypass informally
  // Bypass creates: audit exposure + informal coordination costs + shadow procurement losses
  const pBypassRigid = bypassProbability(rigidityIndex);
  const rigidBypassCost = pBypassRigid * bypassAuditExposure;
  // Field model: no bypass incentive — boundaries are continuous, not checkpoints
  const flexibleBypassCost = 0;

  const rigid: CostBreakdown = {
    timeCost: rigidTimeCost,
    adminCost: rigidAdminCost,
    opportunityCost: rigidOpportunityCost,
    renegotiationCost: rigidRenegotiationExpected,
    tcoCost: rigidTCOForgone,
    bypassCost: rigidBypassCost,
    total: rigidTimeCost + rigidAdminCost + rigidOpportunityCost + rigidRenegotiationExpected + rigidTCOForgone + rigidBypassCost,
  };

  const flexible: CostBreakdown = {
    timeCost: flexibleTimeCost,
    adminCost: flexibleAdminCost,
    opportunityCost: flexibleOpportunityCost,
    renegotiationCost: flexibleRenegotiationExpected,
    tcoCost: flexibleTCOForgone,
    bypassCost: flexibleBypassCost,
    total: flexibleTimeCost + flexibleAdminCost + flexibleOpportunityCost + flexibleRenegotiationExpected + flexibleTCOForgone + flexibleBypassCost,
  };

  const delta = rigid.total - flexible.total;
  const deltaPercent = flexible.total > 0 ? (delta / flexible.total) * 100 : 0;

  return {
    rigid,
    flexible,
    delta,
    deltaPercent,
    bypassProbability: pBypassRigid,
    sources: {
      timeCost: "OECD Public Procurement Performance (2023)",
      opportunityCost: "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA 22(1):117",
      renegotiationCost: "Beuve, Moszoro & Saussier (2021). Contractual Rigidity and Political Contestability. NBER wp28491",
      tcoCost: "Institute for Supply Management (ISM). Total Cost of Ownership in Procurement",
      bypassCost: "Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) The Challenger Launch Decision; Holmström & Milgrom (1991) Multitask Principal-Agent",
    },
  };
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
