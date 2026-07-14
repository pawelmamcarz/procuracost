// Procurement Path Optimizer — weighted rule-based scoring model
//
// Recommends a procurement path (field route) based on purchase parameters.
// Compatible with Polish Public Procurement Law (PZP) and the private sector.
//
// HONEST DESCRIPTION OF THE METHOD: this is NOT a trained machine-learning model. It is a
// hand-authored scoring function (one common-criteria profile per path). The 30 runs are a
// sensitivity sweep — the same formula re-evaluated with reweighted coefficients — used to
// report how stable the recommendation is, not independent learners. Every path is evaluated
// on the same criteria and denominator. The weights are modeling assumptions, not parameters
// fitted to real procurement outcomes. Feature importance is a ranking-margin ablation.
// Theoretical grounding for the path logic: Holmström & Milgrom (1991) multitask model; Kraljic (1983).
//
// Above-threshold public-sector recommendations are hard-filtered to the two procedures available
// without additional statutory grounds. Special procedures are not recommended unless the model
// collects and verifies their legal conditions.

export interface ProcurementFeatures {
  contractValue: number;       // PLN
  supplierCount: number;       // estimated qualified suppliers (1–50+)
  complexity: number;          // 1–5: 1=standard commodity, 5=novel/R&D
  urgencyDays: number;         // days available for procurement (7–365+)
  isPublicSector: boolean;
  innovationRequired: boolean;
  supplyRisk: number;          // 1–5: 1=commoditized, 5=single source
  strategicImportance: number; // 1–5
  marketMaturity: number;      // 1–5: 1=new market, 5=mature commodity
  procurementObject?: "supplies_services" | "works";
  authorityLevel?: "central" | "subcentral";

  // New contextual dimensions (aligned with cost model)
  spendType?: "direct" | "indirect";
  processPhase?: "upstream" | "downstream";
}

export type PathId =
  | "przetarg_otwarty"
  | "przetarg_ograniczony"
  | "dialog_konkurencyjny"
  | "tryb_podstawowy"
  | "negocjacje"
  | "agile"
  | "bezposrednie";

export interface ProcurementPath {
  id: PathId;
  name: string;
  nameEn: string;
  pzpArticle: string | null;
  description: string;
  descriptionEn: string;
  typicalDays: [number, number]; // [min, max]
  conditions: string[];
  conditionsEn: string[];
  risks: string[];
  risksEn: string[];
  color: string;
}

export const PATHS: Record<PathId, ProcurementPath> = {
  przetarg_otwarty: {
    id: "przetarg_otwarty",
    name: "Przetarg nieograniczony",
    nameEn: "Open Tender",
    pzpArticle: "PZP Art. 132",
    description:
      "Klasyczny przetarg otwarty — oferty składa nieograniczona liczba podmiotów. Maksymalna konkurencja, pełna przejrzystość, najdłuższy czas.",
    descriptionEn:
      "Classic open tender — offers submitted by an unlimited number of entities. Maximum competition, full transparency, longest timeline.",
    typicalDays: [60, 180],
    conditions: [
      "Wartość na poziomie lub powyżej właściwego progu unijnego",
      "Rynek dojrzały, wielu dostawców",
      "Specyfikacja dobrze znana",
      "Czas nie jest presją",
    ],
    conditionsEn: [
      "Value at or above the applicable EU threshold",
      "Mature market, many suppliers",
      "Well-defined specification",
      "Time is not a constraint",
    ],
    risks: [
      "Długi czas procesu",
      "Mała elastyczność negocjacyjna",
      "Ryzyko ofert nieporównywalnych",
    ],
    risksEn: [
      "Long process duration",
      "Low negotiation flexibility",
      "Risk of non-comparable bids",
    ],
    color: "#3b82f6",
  },
  przetarg_ograniczony: {
    id: "przetarg_ograniczony",
    name: "Przetarg ograniczony",
    nameEn: "Restricted Tender",
    pzpArticle: "PZP Art. 140",
    description:
      "Zaproszenie do składania ofert kierowane do wybranych, wstępnie kwalifikowanych dostawców. Łączy konkurencję z filtrem kompetencji.",
    descriptionEn:
      "Invitation to tender sent to selected, pre-qualified suppliers. Combines competition with a competence filter.",
    typicalDays: [45, 120],
    conditions: [
      "Rynek z ograniczoną liczbą kwalifikowanych dostawców",
      "Wysokie wymagania techniczne",
      "Sektor publiczny",
    ],
    conditionsEn: [
      "Market with limited qualified suppliers",
      "High technical requirements",
      "Public sector",
    ],
    risks: [
      "Ryzyko wykluczenia najlepszych ofert",
      "Konieczność precyzyjnej kwalifikacji wstępnej",
    ],
    risksEn: [
      "Risk of excluding best offers",
      "Requires precise pre-qualification",
    ],
    color: "#8b5cf6",
  },
  dialog_konkurencyjny: {
    id: "dialog_konkurencyjny",
    name: "Dialog konkurencyjny",
    nameEn: "Competitive Dialogue",
    pzpArticle: "PZP Art. 169",
    description:
      "Wieloetapowe negocjacje z wybranymi dostawcami — zamawiający nie zna optymalnego rozwiązania i iteracyjnie go odkrywa. Idealny dla innowacji i złożonych projektów.",
    descriptionEn:
      "Multi-stage negotiations with selected suppliers — the contracting authority does not know the optimal solution and iteratively discovers it. Ideal for innovation and complex projects.",
    typicalDays: [90, 270],
    conditions: [
      "Wysoka złożoność lub innowacyjność",
      "Specyfikacja nieznana lub otwarta",
      "Sektor publiczny powyżej progów",
      "2–5 dostawców zdolnych do odpowiedzi",
    ],
    conditionsEn: [
      "High complexity or innovation required",
      "Unknown or open specification",
      "Public sector above thresholds",
      "2–5 suppliers capable of responding",
    ],
    risks: [
      "Wysokie koszty procesu po stronie dostawców",
      "Ryzyko ujawnienia informacji konkurencyjnych",
      "Długi czas",
    ],
    risksEn: [
      "High process costs for suppliers",
      "Risk of disclosing competitive information",
      "Long duration",
    ],
    color: "#f59e0b",
  },
  tryb_podstawowy: {
    id: "tryb_podstawowy",
    name: "Tryb podstawowy",
    nameEn: "Basic mode",
    pzpArticle: "PZP Art. 275",
    description:
      "Domyślny krajowy tryb konkurencyjny dla zamówień poniżej progu unijnego (od 170 000 PLN od 1.01.2026). Trzy warianty: bez negocjacji, z fakultatywnymi negocjacjami oraz z obowiązkowymi negocjacjami.",
    descriptionEn:
      "The default national competitive procedure below the EU threshold (from PLN 170,000 since 1 January 2026), with three statutory variants.",
    typicalDays: [30, 90],
    conditions: [
      "Wartość między 170 000 PLN a progiem unijnym",
      "Sektor publiczny (postępowanie krajowe PZP)",
      "Standardowy zakup konkurencyjny",
      "Brak wyjątkowej pilności",
    ],
    conditionsEn: [
      "Value between PLN 170,000 and the EU threshold",
      "Public sector (national PZP procedure)",
      "Standard competitive purchase",
      "No exceptional urgency",
    ],
    risks: [
      "Krótsze terminy niż w trybach unijnych, ale wciąż sformalizowane",
      "Wymaga publikacji w Biuletynie Zamówień Publicznych",
    ],
    risksEn: [
      "Shorter deadlines than EU procedures, but still formalized",
      "Requires publication in the Public Procurement Bulletin",
    ],
    color: "#6366f1",
  },
  negocjacje: {
    id: "negocjacje",
    name: "Negocjacje bezpośrednie",
    nameEn: "Direct Negotiation",
    pzpArticle: "PZP Art. 153 (przesłanki negocjacji z ogłoszeniem) / Art. 214 ust. 1",
    description:
      "Elastyczne negocjacje z wybranymi partnerami bez pełnego postępowania przetargowego. Szybsze, bardziej relacyjne, wymagają silnych kompetencji kupca.",
    descriptionEn:
      "Flexible negotiations with selected partners without a full tender procedure. Faster, more relational, requires strong buyer competencies.",
    typicalDays: [20, 90],
    conditions: [
      "Sektor prywatny LUB szczególne przesłanki PZP",
      "Relacja z dostawcą strategiczna",
      "Wysoka wartość + złożoność + presja czasu",
      "Rynek oligopolistyczny",
    ],
    conditionsEn: [
      "Private sector OR specific PZP grounds",
      "Strategic supplier relationship",
      "High value + complexity + time pressure",
      "Oligopolistic market",
    ],
    risks: [
      "Ryzyko percepcji faworyzowania",
      "Konieczność dokumentacji uzasadnienia",
      "Wymaga dojrzałości kupca",
    ],
    risksEn: [
      "Risk of perceived favoritism",
      "Requires documentation of justification",
      "Requires buyer maturity",
    ],
    color: "#10b981",
  },
  agile: {
    id: "agile",
    name: "Agile / Lean Procurement",
    nameEn: "Agile Procurement",
    pzpArticle: "Sektor prywatny / pilotaż publiczny",
    description:
      "Iteracyjny, wieloetapowy proces zakupowy z krótkimi cyklami decyzyjnymi, warsztatami z dostawcami i szybką selekcją. Raport praktyczny Agile Business Consortium opisuje czterotygodniowy sourcing ERP w Swiss Casinos; nie jest to niezależne badanie.",
    descriptionEn:
      "Iterative, multi-stage procurement with short decision cycles and supplier workshops. An Agile Business Consortium practitioner report describes a four-week ERP sourcing cycle at Swiss Casinos; it is not an independent study.",
    typicalDays: [14, 60],
    conditions: [
      "Wysoka innowacyjność lub presja czasu",
      "Sektor prywatny (lub pilotaż w publicznym)",
      "Dostawcy zdolni do szybkiej odpowiedzi",
      "Kupiec z doświadczeniem agile",
    ],
    conditionsEn: [
      "High innovation or time pressure",
      "Private sector (or public sector pilot)",
      "Suppliers capable of rapid response",
      "Buyer with agile experience",
    ],
    risks: [
      "Ograniczone zastosowanie w sektorze publicznym",
      "Wymaga zaangażowania dostawców w warsztaty",
    ],
    risksEn: [
      "Limited applicability in public sector",
      "Requires supplier engagement in workshops",
    ],
    color: "#06b6d4",
  },
  bezposrednie: {
    id: "bezposrednie",
    name: "Zamówienie z wolnej ręki",
    nameEn: "Direct Award",
    pzpArticle: "PZP Art. 214 ust. 1 pkt 1 (monopol) / pkt 5 (pilność)",
    description:
      "Bezpośrednie zlecenie bez postępowania konkurencyjnego. Uzasadnione w przypadku monopolu, awarii lub wyjątkowej pilności. Wymaga szczegółowej dokumentacji przesłanek.",
    descriptionEn:
      "Direct award without competitive procedure. Justified in cases of monopoly, emergency or exceptional urgency. Requires detailed documentation of grounds.",
    typicalDays: [1, 21],
    conditions: [
      "Monopol techniczny lub prawny",
      "Awaria / zagrożenie ciągłości",
      "Wyjątkowa pilność nieprzewidywalna",
      "Poniżej progu 170 000 PLN (bez PZP)",
    ],
    conditionsEn: [
      "Technical or legal monopoly",
      "Emergency / continuity threat",
      "Exceptional unforeseeable urgency",
      "Below PLN 170,000 threshold (PZP does not apply)",
    ],
    risks: [
      "Najwyższe ryzyko audytowe",
      "Brak efektu konkurencji = ryzyko zawyżonej ceny",
      "Wymaga szczelnej dokumentacji",
    ],
    risksEn: [
      "Highest audit risk",
      "No competition effect = risk of inflated price",
      "Requires airtight documentation",
    ],
    color: "#ef4444",
  },
};

// ─── Weighted rule-based scoring + sensitivity sweep ────────────────────────────

// LCG pseudo-random (deterministic, reproducible)
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

// Every path is scored on the SAME criteria. A weight index therefore always means
// the same feature, and the denominator is common across candidates. This is a
// transparent multi-criteria suitability model, not an outcome prediction.
type ScoringFeature =
  | "contractValue"
  | "supplierCount"
  | "complexity"
  | "urgencyDays"
  | "isPublicSector"
  | "innovationRequired"
  | "supplyRisk"
  | "strategicImportance"
  | "marketMaturity"
  | "spendType"
  | "processPhase";

const SCORING_FEATURES: ScoringFeature[] = [
  "contractValue",
  "supplierCount",
  "complexity",
  "urgencyDays",
  "isPublicSector",
  "innovationRequired",
  "supplyRisk",
  "strategicImportance",
  "marketMaturity",
  "spendType",
  "processPhase",
];

type SuitabilityProfile = Record<ScoringFeature, (f: ProcurementFeatures) => number>;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const highRating = (value: number) => clamp01((value - 1) / 4);
const lowRating = (value: number) => clamp01((5 - value) / 4);
const nearRating = (value: number, target: number) => clamp01(1 - Math.abs(value - target) / 4);
const highValue = (f: ProcurementFeatures, target: number) => clamp01(f.contractValue / target);
const manySuppliers = (f: ProcurementFeatures, target: number) => clamp01(f.supplierCount / target);
const fewSuppliers = (f: ProcurementFeatures, target: number) => clamp01(target / Math.max(1, f.supplierCount));
const timeAvailable = (f: ProcurementFeatures, target: number) => clamp01(f.urgencyDays / target);
const timePressure = (f: ProcurementFeatures, target: number) => clamp01((target - f.urgencyDays) / target);
const categoryFit = (actual: string | undefined, preferred: string, neutral = 0.5) =>
  actual === undefined ? neutral : actual === preferred ? 1 : 0.25;

const PATH_SUITABILITY: Record<PathId, SuitabilityProfile> = {
  przetarg_otwarty: {
    contractValue: (f) => highValue(f, 10_000_000),
    supplierCount: (f) => manySuppliers(f, 8),
    complexity: (f) => lowRating(f.complexity),
    urgencyDays: (f) => timeAvailable(f, 120),
    isPublicSector: (f) => (f.isPublicSector ? 1 : 0.55),
    innovationRequired: (f) => (f.innovationRequired ? 0.25 : 1),
    supplyRisk: (f) => lowRating(f.supplyRisk),
    strategicImportance: (f) => nearRating(f.strategicImportance, 3),
    marketMaturity: (f) => highRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "indirect"),
    processPhase: (f) => categoryFit(f.processPhase, "downstream"),
  },
  przetarg_ograniczony: {
    contractValue: (f) => highValue(f, 5_000_000),
    supplierCount: (f) => nearRating(clamp01(f.supplierCount / 2) * 5, 3),
    complexity: (f) => highRating(f.complexity),
    urgencyDays: (f) => timeAvailable(f, 90),
    isPublicSector: (f) => (f.isPublicSector ? 1 : 0.55),
    innovationRequired: (f) => (f.innovationRequired ? 0.55 : 0.8),
    supplyRisk: (f) => nearRating(f.supplyRisk, 3),
    strategicImportance: (f) => highRating(f.strategicImportance),
    marketMaturity: (f) => nearRating(f.marketMaturity, 3),
    spendType: (f) => categoryFit(f.spendType, "direct"),
    processPhase: (f) => categoryFit(f.processPhase, "upstream"),
  },
  dialog_konkurencyjny: {
    contractValue: (f) => highValue(f, 3_000_000),
    supplierCount: (f) => nearRating(clamp01(f.supplierCount / 2) * 5, 3),
    complexity: (f) => highRating(f.complexity),
    urgencyDays: (f) => timeAvailable(f, 150),
    isPublicSector: (f) => (f.isPublicSector ? 1 : 0.65),
    innovationRequired: (f) => (f.innovationRequired ? 1 : 0.35),
    supplyRisk: (f) => nearRating(f.supplyRisk, 3),
    strategicImportance: (f) => highRating(f.strategicImportance),
    marketMaturity: (f) => lowRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "direct"),
    processPhase: (f) => categoryFit(f.processPhase, "upstream"),
  },
  tryb_podstawowy: {
    contractValue: (f) =>
      f.contractValue >= PZP_EXEMPTION_PLN && f.contractValue < applicableEuThreshold(f) ? 1 : 0,
    supplierCount: (f) => manySuppliers(f, 4),
    complexity: (f) => lowRating(f.complexity),
    urgencyDays: (f) => timeAvailable(f, 45),
    isPublicSector: (f) => (f.isPublicSector ? 1 : 0),
    innovationRequired: (f) => (f.innovationRequired ? 0.4 : 1),
    supplyRisk: (f) => lowRating(f.supplyRisk),
    strategicImportance: (f) => nearRating(f.strategicImportance, 3),
    marketMaturity: (f) => highRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "indirect"),
    processPhase: (f) => categoryFit(f.processPhase, "downstream"),
  },
  negocjacje: {
    contractValue: (f) => highValue(f, 2_000_000),
    supplierCount: (f) => fewSuppliers(f, 4),
    complexity: (f) => highRating(f.complexity),
    urgencyDays: (f) => timePressure(f, 120),
    isPublicSector: (f) => (f.isPublicSector ? 0.2 : 1),
    innovationRequired: (f) => (f.innovationRequired ? 0.8 : 0.55),
    supplyRisk: (f) => highRating(f.supplyRisk),
    strategicImportance: (f) => highRating(f.strategicImportance),
    marketMaturity: (f) => lowRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "direct"),
    processPhase: (f) => categoryFit(f.processPhase, "upstream"),
  },
  agile: {
    contractValue: (f) => nearRating(clamp01(f.contractValue / 2_000_000) * 5, 3),
    supplierCount: (f) => nearRating(clamp01(f.supplierCount / 3) * 5, 3),
    complexity: (f) => highRating(f.complexity),
    urgencyDays: (f) => timePressure(f, 90),
    isPublicSector: (f) => (f.isPublicSector ? 0.15 : 1),
    innovationRequired: (f) => (f.innovationRequired ? 1 : 0.35),
    supplyRisk: (f) => nearRating(f.supplyRisk, 3),
    strategicImportance: (f) => highRating(f.strategicImportance),
    marketMaturity: (f) => lowRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "indirect", 0.6),
    processPhase: (f) => categoryFit(f.processPhase, "downstream", 0.6),
  },
  bezposrednie: {
    contractValue: (f) => clamp01(1 - f.contractValue / PZP_EXEMPTION_PLN),
    supplierCount: (f) => fewSuppliers(f, 1),
    complexity: (f) => lowRating(f.complexity),
    urgencyDays: (f) => timePressure(f, 30),
    isPublicSector: (f) => (f.isPublicSector ? 0.2 : 0.8),
    innovationRequired: (f) => (f.innovationRequired ? 0.15 : 0.8),
    supplyRisk: (f) => highRating(f.supplyRisk),
    strategicImportance: (f) => lowRating(f.strategicImportance),
    marketMaturity: (f) => highRating(f.marketMaturity),
    spendType: (f) => categoryFit(f.spendType, "indirect"),
    processPhase: (f) => categoryFit(f.processPhase, "downstream"),
  },
};

function scorePath(path: PathId, f: ProcurementFeatures, weights: number[]): number {
  const denominator = weights.reduce((sum, weight) => sum + weight, 0);
  if (denominator <= 0) return 0;
  const achieved = SCORING_FEATURES.reduce((sum, feature, index) => {
    const suitability = clamp01(PATH_SUITABILITY[path][feature](f));
    return sum + weights[index] * suitability;
  }, 0);
  return (100 * achieved) / denominator;
}

// All criteria remain active. Each run varies every common weight by ±25% so the
// result measures local weight sensitivity without silently dropping information.
function runWeights(rand: () => number): number[] {
  return SCORING_FEATURES.map(() => 0.75 + rand() * 0.5);
}

export interface PathResult {
  path: ProcurementPath;
  score: number;        // 0–100
  votes: number;        // winning sensitivity runs out of 30
  confidence: number;   // winning-run share, not statistical confidence
  featureContributions: Record<string, number>; // suitability by common criterion
}

export interface OptimizationResult {
  ranked: PathResult[];
  featureImportance: FeatureImportance[];
  topPath: PathResult;
  policyNote: string;
  lang: "pl" | "en";
  explanation: string;
}

export interface FeatureImportance {
  feature: string;
  label: string;
  importance: number; // 0–1
}

const FEATURE_LABELS_PL: Record<keyof ProcurementFeatures, string> = {
  contractValue: "Wartość kontraktu",
  supplierCount: "Liczba dostawców",
  complexity: "Złożoność zakupu",
  urgencyDays: "Presja czasu",
  isPublicSector: "Sektor publiczny",
  innovationRequired: "Innowacyjność",
  supplyRisk: "Ryzyko podaży",
  strategicImportance: "Ważność strategiczna",
  marketMaturity: "Dojrzałość rynku",
  spendType: "Rodzaj wydatku (Direct/Indirect)",
  processPhase: "Faza procesu (Upstream/Downstream)",
  procurementObject: "Przedmiot zamówienia",
  authorityLevel: "Poziom zamawiającego",
};

const FEATURE_LABELS_EN: Record<keyof ProcurementFeatures, string> = {
  contractValue: "Contract value",
  supplierCount: "Supplier count",
  complexity: "Complexity",
  urgencyDays: "Time pressure",
  isPublicSector: "Public sector",
  innovationRequired: "Innovation",
  supplyRisk: "Supply risk",
  strategicImportance: "Strategic importance",
  marketMaturity: "Market maturity",
  spendType: "Spend type (Direct/Indirect)",
  processPhase: "Process phase (Upstream/Downstream)",
  procurementObject: "Procurement object",
  authorityLevel: "Authority level",
};

const N_SENSITIVITY_RUNS = 30;
const PATH_IDS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
  "tryb_podstawowy",
  "negocjacje",
  "agile",
  "bezposrednie",
];

// ─── Polish PZP thresholds (2026–2027, UZP conversion of EU thresholds) ──────────
// Per Obwieszczenie Prezesa UZP z 8.12.2025 (M.P. 2025 poz. 1247): 1 EUR = 4.31 PLN,
// valid 2026–2027. Supplies/services EU threshold for sub-central contracting
// authorities = 216,000 EUR × 4.31 ≈ PLN 930,960; construction works ≈ PLN 23.3M.
const PZP_EXEMPTION_PLN = 170_000;
const EU_THRESHOLD_CENTRAL_SUPPLIES_SERVICES_PLN = 603_400;
const EU_THRESHOLD_SUPPLIES_SERVICES_PLN = 930_960;
const EU_THRESHOLD_WORKS_PLN = 23_291_240;

function applicableEuThreshold(f: ProcurementFeatures): number {
  if (f.procurementObject === "works") return EU_THRESHOLD_WORKS_PLN;
  return f.authorityLevel === "central"
    ? EU_THRESHOLD_CENTRAL_SUPPLIES_SERVICES_PLN
    : EU_THRESHOLD_SUPPLIES_SERVICES_PLN;
}

// Art. 129(2): only open and restricted procedures are available without additional
// statutory grounds. Competitive dialogue also requires an Art. 153 condition, which
// this form does not collect or verify.
const PUBLIC_DEFAULT_EU_PATHS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
];

// Art. 266 excludes the EU-threshold procedures in this band; Art. 275 provides
// the national basic mode. Exceptional modes require separate statutory grounds,
// which this input form does not collect.
const PUBLIC_BELOW_EU_PATHS: PathId[] = ["tryb_podstawowy"];

// Paths available where PZP's national 'tryb podstawowy' does not apply (private sector, or
// public buys below the 170k PLN PZP exemption): every path except the band-specific tryb podstawowy.
const GENERAL_PATHS: PathId[] = PATH_IDS.filter((p) => p !== "tryb_podstawowy");

// Hard legal filter: the set of paths the tool is ALLOWED to recommend for these features,
// so a recommendation can never contradict the legality note.
function feasiblePathIds(f: ProcurementFeatures): PathId[] {
  if (!f.isPublicSector) return GENERAL_PATHS;                  // private sector: policy is the only constraint
  if (f.contractValue < PZP_EXEMPTION_PLN) return GENERAL_PATHS; // below 170k PLN: PZP does not apply
  // Public sector in the 170k PLN–EU band: use the national basic mode (Art. 275).
  if (f.contractValue < applicableEuThreshold(f)) return PUBLIC_BELOW_EU_PATHS;
  // Public sector at/above the EU threshold: only procedures available without
  // additional grounds. Dialogue, negotiated and single-source procedures require
  // statutory conditions that are not modeled here.
  return PUBLIC_DEFAULT_EU_PATHS;
}

// Neutral baseline used for ablation feature importance. "Unset" is the documented
// neutral for the contextual dimensions (all dimension effects off).
const NEUTRAL_FEATURES: ProcurementFeatures = {
  contractValue: 1_000_000,
  supplierCount: 5,
  complexity: 3,
  urgencyDays: 90,
  isPublicSector: false,
  innovationRequired: false,
  supplyRisk: 3,
  strategicImportance: 3,
  marketMaturity: 3,
  spendType: undefined,
  processPhase: undefined,
  procurementObject: "supplies_services",
  authorityLevel: "subcentral",
};

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function rating(value: number): number {
  return Math.min(5, Math.max(1, finiteOr(value, 3)));
}

function sanitizeFeatures(features: ProcurementFeatures): ProcurementFeatures {
  return {
    contractValue: Math.max(0, finiteOr(features.contractValue, NEUTRAL_FEATURES.contractValue)),
    supplierCount: Math.max(0, finiteOr(features.supplierCount, NEUTRAL_FEATURES.supplierCount)),
    complexity: rating(features.complexity),
    urgencyDays: Math.max(0, finiteOr(features.urgencyDays, NEUTRAL_FEATURES.urgencyDays)),
    isPublicSector: Boolean(features.isPublicSector),
    innovationRequired: Boolean(features.innovationRequired),
    supplyRisk: rating(features.supplyRisk),
    strategicImportance: rating(features.strategicImportance),
    marketMaturity: rating(features.marketMaturity),
    procurementObject: features.procurementObject === "works" ? "works" : "supplies_services",
    authorityLevel: features.authorityLevel === "central" ? "central" : "subcentral",
    spendType: features.spendType === "direct" || features.spendType === "indirect"
      ? features.spendType
      : undefined,
    processPhase: features.processPhase === "upstream" || features.processPhase === "downstream"
      ? features.processPhase
      : undefined,
  };
}

const UNIT_WEIGHTS: number[] = SCORING_FEATURES.map(() => 1);

function rankingMargin(
  path: PathId,
  features: ProcurementFeatures,
  candidates: PathId[],
): number {
  const pathScore = scorePath(path, features, UNIT_WEIGHTS);
  const competitorScore = Math.max(
    ...candidates.filter((candidate) => candidate !== path).map((candidate) =>
      scorePath(candidate, features, UNIT_WEIGHTS)),
    0,
  );
  return pathScore - competitorScore;
}

// Neutralize one common criterion and measure the change in the winner's margin over
// its strongest feasible competitor. This captures ranking sensitivity rather than a
// path's isolated score and remains deterministic.
function ablationImportance(
  features: ProcurementFeatures,
  topPathId: PathId,
  candidates: PathId[],
  labels: Record<keyof ProcurementFeatures, string>,
): FeatureImportance[] {
  const base = rankingMargin(topPathId, features, candidates);
  const raw = SCORING_FEATURES.map((key) => {
    const perturbed = { ...features, [key]: NEUTRAL_FEATURES[key] };
    const delta = Math.abs(base - rankingMargin(topPathId, perturbed, candidates));
    return { feature: key as string, label: labels[key], importance: delta };
  });
  const max = Math.max(...raw.map((r) => r.importance), 0);
  return raw
    .map((r) => ({ ...r, importance: max > 0 ? r.importance / max : 0 }))
    .sort((a, b) => b.importance - a.importance);
}

export function optimize(features: ProcurementFeatures, lang: "pl" | "en" = "pl"): OptimizationResult {
  const safeFeatures = sanitizeFeatures(features);
  const candidates = feasiblePathIds(safeFeatures);
  const FEATURE_LABELS = lang === "en" ? FEATURE_LABELS_EN : FEATURE_LABELS_PL;

  const votes: Record<string, number> = {};
  const scoreSum: Record<string, number> = {};
  candidates.forEach((pid) => { votes[pid] = 0; scoreSum[pid] = 0; });

  // Sensitivity sweep: re-evaluate the scoring formula with reweighted coefficients to
  // measure how STABLE the winner is. These are not independent learners.
  for (let t = 0; t < N_SENSITIVITY_RUNS; t++) {
    const rand = lcg(t * 31337 + 42);
    const weights = runWeights(rand);
    const runScores = candidates.map((pid) => ({ pid, s: scorePath(pid, safeFeatures, weights) }));
    runScores.forEach(({ pid, s }) => { scoreSum[pid] += s; });
    runScores.sort((a, b) => b.s - a.s);
    votes[runScores[0].pid]++;
  }

  // Rank by sweep votes (share of runs won) with mean normalized score as the tiebreak,
  // so the displayed confidence = votes/30 genuinely describes the displayed winner.
  const ranked: PathResult[] = candidates
    .map((pid) => ({
      path: PATHS[pid],
      score: Math.round(scoreSum[pid] / N_SENSITIVITY_RUNS),
      votes: votes[pid],
      confidence: votes[pid] / N_SENSITIVITY_RUNS, // share of weight-sensitivity runs where this path won
      featureContributions: Object.fromEntries(
        SCORING_FEATURES.map((feature) => [
          feature,
          Math.round(100 * clamp01(PATH_SUITABILITY[pid][feature](safeFeatures))),
        ]),
      ),
    }))
    .sort((a, b) => b.votes - a.votes || b.score - a.score);

  const topPath = ranked[0];
  const featureImportance = candidates.length > 1
    ? ablationImportance(safeFeatures, topPath.path.id, candidates, FEATURE_LABELS)
    : SCORING_FEATURES.map((feature) => ({
        feature,
        label: FEATURE_LABELS[feature],
        importance: 0,
      }));

  const policyNote = generatePolicyNote(safeFeatures, lang);
  const explanation = candidates.length > 1
    ? generateExplanation(safeFeatures, topPath, featureImportance, lang)
    : lang === "en"
      ? `"${topPath.path.nameEn}" is the only default procedure represented for this legal band. The 30/30 result reflects the legal filter, not statistical confidence or comparative superiority.`
      : `„${topPath.path.name}” jest jedynym domyślnym trybem ujętym dla tego pasma prawnego. Wynik 30/30 odzwierciedla filtr prawny, a nie pewność statystyczną ani porównawczą wyższość.`;

  return { ranked, featureImportance, topPath, policyNote, lang, explanation };
}

function describeFeatureValue(
  feature: keyof ProcurementFeatures,
  features: ProcurementFeatures,
  lang: "pl" | "en"
): string {
  const pl = lang === "pl";
  const v = features[feature];
  switch (feature) {
    case "contractValue": {
      const m = (v as number) / 1_000_000;
      const tag = m >= 10 ? (pl ? "bardzo wysoka" : "very high") :
                  m >= 2  ? (pl ? "wysoka" : "high") :
                  m >= 0.5 ? (pl ? "średnia" : "medium") : (pl ? "niska" : "low");
      return `${pl ? "wartość kontraktu" : "contract value"}: ${tag} (${m.toFixed(1)}M PLN)`;
    }
    case "urgencyDays": {
      const d = v as number;
      const tag = d <= 21 ? (pl ? "krytyczna pilność" : "critical urgency") :
                  d <= 60 ? (pl ? "pilny" : "urgent") :
                  d <= 180 ? (pl ? "umiarkowany" : "moderate") : (pl ? "brak presji" : "no pressure");
      return `${pl ? "presja czasu" : "time pressure"}: ${tag} (${d} ${pl ? "dni" : "days"})`;
    }
    case "supplierCount": {
      const n = v as number;
      const tag = n === 1 ? (pl ? "monopol" : "monopoly") :
                  n <= 3  ? (pl ? "bardzo mało" : "very few") :
                  n <= 7  ? (pl ? "kilku" : "few") : (pl ? "wielu" : "many");
      return `${pl ? "liczba dostawców" : "supplier count"}: ${tag} (${n})`;
    }
    case "isPublicSector":
      return `${pl ? "sektor publiczny" : "public sector"}: ${v ? (pl ? "tak" : "yes") : (pl ? "nie" : "no")}`;
    case "innovationRequired":
      return `${pl ? "innowacyjność wymagana" : "innovation required"}: ${v ? (pl ? "tak" : "yes") : (pl ? "nie" : "no")}`;
    case "procurementObject":
      return `${pl ? "przedmiot" : "object"}: ${v === "works" ? (pl ? "roboty budowlane" : "works") : (pl ? "dostawy/usługi" : "supplies/services")}`;
    case "authorityLevel":
      return `${pl ? "zamawiający" : "authority"}: ${v === "central" ? (pl ? "centralny" : "central") : (pl ? "subcentralny" : "sub-central")}`;
    default: {
      const n = v as number;
      const labels = pl
        ? ["bardzo niski", "niski", "średni", "wysoki", "bardzo wysoki"]
        : ["very low", "low", "medium", "high", "very high"];
      const featureName = pl
        ? ({ complexity: "złożoność", supplyRisk: "ryzyko podaży", strategicImportance: "ważność strategiczna", marketMaturity: "dojrzałość rynku" } as Record<string, string>)[feature] ?? feature
        : feature.replace(/([A-Z])/g, " $1").toLowerCase();
      return `${featureName}: ${labels[n - 1] ?? n}`;
    }
  }
}

function generateExplanation(
  features: ProcurementFeatures,
  topPath: PathResult,
  featureImportance: FeatureImportance[],
  lang: "pl" | "en"
): string {
  const pathName = lang === "en" ? topPath.path.nameEn : topPath.path.name;
  const pct = Math.round(topPath.confidence * 100);
  const votes = topPath.votes;
  const top = featureImportance.slice(0, 2);
  const f1 = describeFeatureValue(top[0]?.feature as keyof ProcurementFeatures, features, lang);
  const f2 = top[1] ? describeFeatureValue(top[1].feature as keyof ProcurementFeatures, features, lang) : null;

  if (lang === "en") {
    return `The model recommends "${pathName}" mainly because of: ${f1}${f2 ? ` and ${f2}` : ""} (largest sensitivity of the ranking margin). The winner held in ${votes}/30 weight-sensitivity runs (stability: ${pct}%).`;
  }
  return `Model rekomenduje "${pathName}" przede wszystkim ze względu na: ${f1}${f2 ? ` oraz ${f2}` : ""} (największy wpływ na margines rankingu). Rekomendacja utrzymała się w ${votes}/30 przebiegach wrażliwości wag (stabilność: ${pct}%).`;
}

function generatePolicyNote(f: ProcurementFeatures, lang: "pl" | "en" = "pl"): string {
  if (lang === "en") {
    if (!f.isPublicSector) {
      return "Private sector: PZP thresholds do not apply. The scorer compares the represented non-PZP organisational paths subject to internal policy.";
    }
    if (f.contractValue < PZP_EXEMPTION_PLN) {
      return "Below the PLN 170,000 net threshold: PZP does not apply (threshold effective from 1 January 2026). Internal rules and public-spending principles still apply.";
    }
    if (f.contractValue < applicableEuThreshold(f)) {
      return "Between PLN 170,000 and the applicable EU threshold (PLN 603,400 or 930,960 for supplies/services; PLN 23,291,240 for works): the national 'tryb podstawowy' applies (Art. 275). Exceptional modes require documented statutory grounds.";
    }
    return "At/above the EU threshold, the default filter offers open tender (Art. 132) and restricted tender (Art. 140), which Art. 129(2) permits without additional grounds. Competitive dialogue, negotiated procedures and single-source awards are outside this recommendation because they require separately documented statutory conditions.";
  }

  if (!f.isPublicSector) {
    return "Sektor prywatny: progi PZP nie mają zastosowania. Scorer porównuje ujęte ścieżki organizacyjne poza PZP, z zastrzeżeniem polityki wewnętrznej.";
  }
  if (f.contractValue < PZP_EXEMPTION_PLN) {
    return "Poniżej progu 170 000 PLN netto (od 1.01.2026): ustawy PZP nie stosuje się, lecz nadal obowiązują reguły wewnętrzne oraz zasady racjonalnego i przejrzystego wydatkowania.";
  }
  if (f.contractValue < applicableEuThreshold(f)) {
    return "Między 170 000 PLN a właściwym progiem UE (603 400 lub 930 960 PLN dla dostaw/usług; 23 291 240 PLN dla robót): tryb podstawowy (art. 275). Tryby wyjątkowe wymagają udokumentowanych przesłanek ustawowych.";
  }
  return "Na/powyżej progu UE filtr domyślnie oferuje przetarg nieograniczony (art. 132) i ograniczony (art. 140), które art. 129 ust. 2 dopuszcza bez dodatkowych przesłanek. Dialog konkurencyjny, tryby negocjacyjne i wolna ręka pozostają poza rekomendacją, ponieważ wymagają osobno udokumentowanych przesłanek ustawowych.";
}
