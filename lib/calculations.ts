// Core cost model based on academic sources:
// - Szucs (JEEA 2024): discretion → +2% price, -1.6% productivity
// - Beuve, Moszoro & Saussier (NBER wp28491): rigidity → +7.7-10.5% renegotiations
// - ISM Total Cost of Ownership: up to 30% savings over 3 years with TCO approach

export interface ProcurementInputs {
  contractValue: number;        // PLN
  procurementDays: {
    rigid: number;              // days for rigid procedure
    flexible: number;           // days for policy-only compliance
  };
  buyerCount: number;           // number of procurement staff involved
  dailyBuyerRate: number;       // PLN per day per buyer (salary + overhead)
  adminCostFixed: {
    rigid: number;              // fixed admin overhead for rigid procedure (PLN)
    flexible: number;           // fixed admin overhead for flexible approach (PLN)
  };
  dailyProjectRevenue: number;  // PLN per day — value of delayed deployment
  renegotiationCost: number;    // PLN — cost if contract is renegotiated
  tcoHorizonYears: number;      // TCO horizon in years
  flexibilityIndex: number;     // 0–1: how flexible the policy approach is
}

export interface CostBreakdown {
  timeCost: number;
  adminCost: number;
  opportunityCost: number;
  renegotiationCost: number;
  tcoCost: number;
  total: number;
}

export interface ComparisonResult {
  rigid: CostBreakdown;
  flexible: CostBreakdown;
  delta: number;
  deltaPercent: number;
  // source references for each dimension
  sources: {
    timeCost: string;
    opportunityCost: string;
    renegotiationCost: string;
    tcoCost: string;
  };
}

// Price premium caused by rigidity (Szucs 2024)
const RIGIDITY_PRICE_PREMIUM = 0.02;

// Additional renegotiation probability under rigidity (Beuve et al. NBER wp28491)
const RIGIDITY_RENEGOTIATION_PREMIUM = 0.077;

// Baseline renegotiation probability for public contracts
const BASE_RENEGOTIATION_PROBABILITY = 0.22;

// TCO savings potential with full flexibility (ISM)
const TCO_SAVINGS_RATE_PER_YEAR = 0.10; // 30% over 3 years ≈ 10% per year

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
  } = inputs;

  // 1. Time cost
  const rigidTimeCost = procurementDays.rigid * buyerCount * dailyBuyerRate;
  const flexibleTimeCost = procurementDays.flexible * buyerCount * dailyBuyerRate;

  // 2. Admin cost
  const rigidAdminCost = adminCostFixed.rigid;
  const flexibleAdminCost = adminCostFixed.flexible;

  // 3. Opportunity cost
  // a) Price premium: rigid procedures lead to higher prices (less discretion = less negotiation)
  const rigidPricePremium = contractValue * RIGIDITY_PRICE_PREMIUM;
  // b) Deployment delay: extra days × daily revenue value
  const delayDays = procurementDays.rigid - procurementDays.flexible;
  const rigidDelayCost = Math.max(0, delayDays) * dailyProjectRevenue;
  const rigidOpportunityCost = rigidPricePremium + rigidDelayCost;
  const flexibleOpportunityCost = 0;

  // 4. Renegotiation cost
  const rigidRenegotiationProb = BASE_RENEGOTIATION_PROBABILITY + RIGIDITY_RENEGOTIATION_PREMIUM;
  const flexibleRenegotiationProb = BASE_RENEGOTIATION_PROBABILITY * (1 - flexibilityIndex * 0.3);
  const rigidRenegotiationExpected = rigidRenegotiationProb * renegotiationCost;
  const flexibleRenegotiationExpected = flexibleRenegotiationProb * renegotiationCost;

  // 5. TCO cost (foregone savings)
  // Rigid: low flexibility → less TCO optimization
  const rigidTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * (1 - 0.1);
  // Flexible: higher flexibility → more TCO savings captured
  const flexibleTCOForgone = contractValue * TCO_SAVINGS_RATE_PER_YEAR * tcoHorizonYears * (1 - flexibilityIndex);

  const rigid: CostBreakdown = {
    timeCost: rigidTimeCost,
    adminCost: rigidAdminCost,
    opportunityCost: rigidOpportunityCost,
    renegotiationCost: rigidRenegotiationExpected,
    tcoCost: rigidTCOForgone,
    total: rigidTimeCost + rigidAdminCost + rigidOpportunityCost + rigidRenegotiationExpected + rigidTCOForgone,
  };

  const flexible: CostBreakdown = {
    timeCost: flexibleTimeCost,
    adminCost: flexibleAdminCost,
    opportunityCost: flexibleOpportunityCost,
    renegotiationCost: flexibleRenegotiationExpected,
    tcoCost: flexibleTCOForgone,
    total: flexibleTimeCost + flexibleAdminCost + flexibleOpportunityCost + flexibleRenegotiationExpected + flexibleTCOForgone,
  };

  const delta = rigid.total - flexible.total;
  const deltaPercent = flexible.total > 0 ? (delta / flexible.total) * 100 : 0;

  return {
    rigid,
    flexible,
    delta,
    deltaPercent,
    sources: {
      timeCost: "OECD Public Procurement Performance (2023)",
      opportunityCost: "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA 22(1):117",
      renegotiationCost: "Beuve, Moszoro & Saussier (2021). Contractual Rigidity and Political Contestability. NBER wp28491",
      tcoCost: "Institute for Supply Management (ISM). Total Cost of Ownership in Procurement",
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
