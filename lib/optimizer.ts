// Procurement Path Optimizer — weighted rule-based scoring model
//
// Recommends a procurement path (field route) based on purchase parameters.
// Compatible with Polish Public Procurement Law (PZP) and the private sector.
//
// HONEST DESCRIPTION OF THE METHOD: this is NOT a trained machine-learning model. It is a
// hand-authored scoring function (one closed-form formula per path). The 30 "trees" are a
// sensitivity sweep — the same formula re-evaluated with reweighted coefficients — used to
// report how stable the recommendation is, not independent learners. The scoring weights are
// modeling assumptions, not parameters fitted to real procurement outcomes. Feature importances
// are computed by genuine ablation (neutralize a feature, measure the change in the top score).
// Theoretical grounding for the path logic: Holmström & Milgrom (1991) multitask model; Kraljic (1983).
//
// Above-threshold public-sector recommendations are hard-filtered to the lawful PZP trybów so the
// tool can never recommend a legally-impossible path.

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
      "Wartość powyżej progów unijnych lub krajowych",
      "Rynek dojrzały, wielu dostawców",
      "Specyfikacja dobrze znana",
      "Czas nie jest presją",
    ],
    conditionsEn: [
      "Value above EU or national thresholds",
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
      "Domyślny krajowy tryb konkurencyjny dla zamówień poniżej progu unijnego (od 130 000 PLN). Trzy warianty: bez negocjacji, z fakultatywnymi negocjacjami oraz z obowiązkowymi negocjacjami. Krótsze terminy niż w trybach unijnych przy zachowaniu konkurencji i przejrzystości.",
    descriptionEn:
      "The default national competitive procedure for contracts below the EU threshold (from PLN 130,000). Three variants: without negotiations, with optional negotiations, and with mandatory negotiations. Shorter deadlines than EU procedures while preserving competition and transparency.",
    typicalDays: [30, 90],
    conditions: [
      "Wartość między 130 000 PLN a progiem unijnym",
      "Sektor publiczny (postępowanie krajowe PZP)",
      "Standardowy zakup konkurencyjny",
      "Brak wyjątkowej pilności",
    ],
    conditionsEn: [
      "Value between PLN 130,000 and the EU threshold",
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
      "Iteracyjny, wieloetapowy proces zakupowy z krótkimi cyklami decyzyjnymi, warsztatami z dostawcami i szybką selekcją. Swiss Casinos: wybór dostawcy ERP w ok. 6 tygodni zamiast 6 miesięcy (LAP Alliance, 2020).",
    descriptionEn:
      "Iterative, multi-stage procurement process with short decision cycles, supplier workshops and rapid selection. Swiss Casinos: ERP supplier sourced in ~6 weeks instead of 6 months (LAP Alliance, 2020).",
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
      "Poniżej progu 130 000 PLN (bez PZP)",
    ],
    conditionsEn: [
      "Technical or legal monopoly",
      "Emergency / continuity threat",
      "Exceptional unforeseeable urgency",
      "Below 130,000 PLN threshold (no PZP required)",
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

// Each path is a declarative list of scoring terms. A term's factor(f) is bounded by
// maxFactor, so the per-run score can be normalized to a TRUE 0–100 scale for every
// path ("share of this path's achievable maximum under the run's weights"). This removes
// the structural bias where paths with dimension bonuses had higher raw ceilings
// (~164 vs 100) and were systematically favored in vote-based winner selection.
type TermSpec = {
  w: number;                              // weight index (0–6)
  scale: number;                          // path-specific term scale
  maxFactor: number;                      // largest value factor() can return
  factor: (f: ProcurementFeatures) => number;
};

const N_WEIGHTS = 7; // w0–w4 base terms + w5/w6 spendType & processPhase dimension terms

const isDirect = (f: ProcurementFeatures) => f.spendType === "direct";
const isUpstream = (f: ProcurementFeatures) => f.processPhase === "upstream";
const isDownstream = (f: ProcurementFeatures) => f.processPhase === "downstream";
const vMln = (f: ProcurementFeatures) => f.contractValue / 1_000_000;

const PATH_TERMS: Record<PathId, TermSpec[]> = {
  przetarg_otwarty: [
    { w: 0, scale: 25, maxFactor: 1, factor: (f) => Math.min(vMln(f) / 10, 1) },                       // large value → open tender
    { w: 1, scale: 25, maxFactor: 1, factor: (f) => (f.supplierCount >= 5 ? 1 : f.supplierCount / 5) }, // many suppliers
    { w: 2, scale: 20, maxFactor: 1, factor: (f) => (6 - f.complexity) / 5 },                           // low complexity
    { w: 3, scale: 15, maxFactor: 1, factor: (f) => (f.urgencyDays > 90 ? 1 : f.urgencyDays / 90) },    // time available
    { w: 4, scale: 15, maxFactor: 1, factor: (f) => (f.isPublicSector ? 1 : 0) },                       // public sector
  ],
  przetarg_ograniczony: [
    { w: 0, scale: 20, maxFactor: 1, factor: (f) => Math.min(vMln(f) / 5, 1) },
    { w: 1, scale: 30, maxFactor: 1, factor: (f) => (f.supplierCount >= 2 && f.supplierCount <= 6 ? 1 : 0) },
    { w: 2, scale: 20, maxFactor: 1, factor: (f) => (f.isPublicSector ? 1 : 0) },
    { w: 3, scale: 20, maxFactor: 1, factor: (f) => (f.complexity >= 3 ? f.complexity / 5 : 0) },
    { w: 4, scale: 10, maxFactor: 1, factor: (f) => (f.marketMaturity <= 3 ? 1 : 0) },
  ],
  dialog_konkurencyjny: [
    { w: 0, scale: 30, maxFactor: 1, factor: (f) => f.complexity / 5 },
    { w: 1, scale: 25, maxFactor: 1, factor: (f) => (f.innovationRequired ? 1 : 0) },
    { w: 2, scale: 15, maxFactor: 1, factor: (f) => (f.isPublicSector ? 1 : 0) },
    { w: 3, scale: 15, maxFactor: 1, factor: (f) => Math.min(vMln(f) / 3, 1) },
    { w: 4, scale: 15, maxFactor: 1, factor: (f) => (f.marketMaturity <= 2 ? 1 : 0.3) },
    // Dialog/competitive negotiation is the natural fit for complex, high-stakes
    // Direct + Upstream sourcing where relationship and risk allocation matter.
    { w: 5, scale: 14, maxFactor: 1.35, factor: (f) => (isUpstream(f) ? 1.35 : 0.65) },
    { w: 6, scale: 12, maxFactor: 1.6, factor: (f) => (isDirect(f) && isUpstream(f) ? 1.6 : isDirect(f) ? 1.1 : 0.7) },
  ],
  tryb_podstawowy: [
    // Default competitive Polish procedure below the EU threshold: public-sector,
    // mid-value (130k–EU band), non-emergency, standard buys.
    { w: 0, scale: 30, maxFactor: 1, factor: (f) => (f.isPublicSector ? 1 : 0) },
    { w: 1, scale: 30, maxFactor: 1, factor: (f) =>
        f.contractValue >= PZP_EXEMPTION_PLN && f.contractValue < EU_THRESHOLD_SUPPLIES_SERVICES_PLN ? 1 : 0 },
    { w: 2, scale: 15, maxFactor: 1, factor: (f) => (f.urgencyDays >= 21 ? 1 : f.urgencyDays / 21) },
    { w: 3, scale: 15, maxFactor: 1, factor: (f) => (f.supplierCount >= 2 ? 1 : f.supplierCount / 2) },
    { w: 4, scale: 10, maxFactor: 1, factor: (f) => (6 - f.complexity) / 5 },
  ],
  negocjacje: [
    { w: 0, scale: 25, maxFactor: 1, factor: (f) => f.strategicImportance / 5 },
    { w: 1, scale: 20, maxFactor: 1, factor: (f) => (f.supplierCount <= 4 ? 1 : 2 / f.supplierCount) },
    { w: 2, scale: 20, maxFactor: 1, factor: (f) => (!f.isPublicSector ? 1 : 0.4) },
    { w: 3, scale: 20, maxFactor: 1, factor: (f) => (f.urgencyDays < 90 ? (90 - f.urgencyDays) / 90 : 0) },
    { w: 4, scale: 15, maxFactor: 1, factor: (f) => (f.supplyRisk >= 3 ? f.supplyRisk / 5 : 0) },
    // Direct + Upstream → strong preference for flexible, relationship-heavy paths;
    // Downstream → more tolerance for simpler, operational paths.
    { w: 5, scale: 25, maxFactor: 1.8, factor: (f) => (isUpstream(f) && isDirect(f) ? 1.8 : 0.4) },
    { w: 6, scale: 15, maxFactor: 1.25, factor: (f) => (isDownstream(f) ? 0.45 : 1.25) },
  ],
  agile: [
    { w: 0, scale: 25, maxFactor: 1, factor: (f) => (f.innovationRequired ? 1 : 0.3) },
    { w: 1, scale: 30, maxFactor: 1, factor: (f) => (f.urgencyDays < 60 ? (60 - f.urgencyDays) / 60 : 0) },
    { w: 2, scale: 25, maxFactor: 1, factor: (f) => (!f.isPublicSector ? 1 : 0.2) },
    { w: 3, scale: 20, maxFactor: 1, factor: (f) => (f.complexity >= 3 ? f.complexity / 5 : 0) },
    // Downstream + Indirect favors faster, lighter execution paths
    { w: 5, scale: 8, maxFactor: 1.25, factor: (f) => (isDownstream(f) ? 1.25 : 0.85) },
    { w: 6, scale: 6, maxFactor: 1.15, factor: (f) => (isDirect(f) ? 0.9 : 1.15) },
  ],
  bezposrednie: [
    { w: 0, scale: 35, maxFactor: 1, factor: (f) => (f.urgencyDays < 21 ? (21 - f.urgencyDays) / 21 : 0) },
    { w: 1, scale: 30, maxFactor: 1, factor: (f) => (f.supplyRisk >= 5 ? 1 : 0) },
    { w: 2, scale: 20, maxFactor: 1, factor: (f) => (f.contractValue < 130_000 ? 1 : 0) },
    { w: 3, scale: 15, maxFactor: 0.5, factor: (f) => (!f.isPublicSector ? 0.5 : 0) },
    // Direct + Upstream almost never fits single-source without justification; Downstream+Indirect often does
    { w: 5, scale: 10, maxFactor: 1.4, factor: (f) => (isDirect(f) && isUpstream(f) ? 0.25 : isDownstream(f) ? 1.4 : 1.0) },
    { w: 6, scale: 6, maxFactor: 1.3, factor: (f) => (isDownstream(f) && !isDirect(f) ? 1.3 : 0.9) },
  ],
};

// Score a single path from features. Normalized per run to a true 0–100 scale: the
// achieved weighted sum divided by this path's achievable maximum under the same
// weights, so every path competes on an equal ceiling.
function scorePath(path: PathId, f: ProcurementFeatures, weights: number[]): number {
  let achieved = 0;
  let achievable = 0;
  for (const term of PATH_TERMS[path]) {
    const w = weights[term.w];
    achieved += w * term.factor(f) * term.scale;
    achievable += w * term.maxFactor * term.scale;
  }
  return achievable > 0 ? (100 * achieved) / achievable : 0;
}

// Generate one sweep run's weight vector (random feature subset weighting).
// Exactly N_WEIGHTS weights — every generated weight is read by at least one path.
function treeWeights(rand: () => number): number[] {
  const active = Array.from({ length: N_WEIGHTS }, () => (rand() > 0.4 ? 1 : 0));
  // ensure at least 3 active
  while (active.filter(Boolean).length < 3) {
    active[Math.floor(rand() * N_WEIGHTS)] = 1;
  }
  // scale with random importance
  return active.map((a) => (a ? 0.5 + rand() * 0.5 : 0));
}

export interface PathResult {
  path: ProcurementPath;
  score: number;        // 0–100
  votes: number;        // out of 30 trees
  confidence: number;   // votes / 30
  featureContributions: Record<string, number>; // % contribution
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
};

const N_TREES = 30;
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
// The supplies/services threshold is the conservative default since the optimizer
// does not capture the procurement object type.
const PZP_EXEMPTION_PLN = 130_000;
const EU_THRESHOLD_SUPPLIES_SERVICES_PLN = 930_960;

// Lawful competitive trybów for public-sector procurement at/above the EU threshold
// without documented statutory grounds for a negotiated / single-source award.
const PUBLIC_COMPETITIVE_PATHS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
];

// Lawful paths for public-sector procurement in the 130k PLN–EU-threshold band: the national
// 'tryb podstawowy' (Art. 275) is the default competitive procedure here. The ≥EU-threshold
// trybów (open / restricted tender, competitive dialogue) remain available; a negotiated or
// single-source award still requires documented przesłanki (Art. 275 ust. 2 / 305).
const PUBLIC_BELOW_EU_PATHS: PathId[] = [
  "tryb_podstawowy",
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
];

// Paths available where PZP's national 'tryb podstawowy' does not apply (private sector, or
// public buys below the 130k PLN PZP exemption): every path except the band-specific tryb podstawowy.
const GENERAL_PATHS: PathId[] = PATH_IDS.filter((p) => p !== "tryb_podstawowy");

// Hard legal filter: the set of paths the tool is ALLOWED to recommend for these features,
// so a recommendation can never contradict the legality note.
function feasiblePathIds(f: ProcurementFeatures): PathId[] {
  if (!f.isPublicSector) return GENERAL_PATHS;                  // private sector: policy is the only constraint
  if (f.contractValue < PZP_EXEMPTION_PLN) return GENERAL_PATHS; // below 130k PLN: PZP does not apply
  // Public sector in the 130k PLN–EU band: the national tryb podstawowy (Art. 275) is the lawful
  // default, alongside the competitive trybów. Negotiated / single-source awards require przesłanki.
  if (f.contractValue < EU_THRESHOLD_SUPPLIES_SERVICES_PLN) return PUBLIC_BELOW_EU_PATHS;
  // Public sector at/above the EU threshold: only the full-procedure competitive trybów by default.
  // Negotiated and single-source awards require documented przesłanki (Art. 153 / 214) not modeled here.
  return PUBLIC_COMPETITIVE_PATHS;
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
};

const UNIT_WEIGHTS: number[] = Array.from({ length: N_WEIGHTS }, () => 1);

// Genuine ablation importance: neutralize each feature, measure |Δ score| of the top path
// using the full unbagged scorer. Input-dependent and deterministic (no RNG).
// Paths whose term list contains no spendType/processPhase term (the three competitive
// tender modes) correctly report 0 importance for those features by construction.
function ablationImportance(
  features: ProcurementFeatures,
  topPathId: PathId,
  labels: Record<keyof ProcurementFeatures, string>
): FeatureImportance[] {
  const base = scorePath(topPathId, features, UNIT_WEIGHTS);
  const raw = (Object.keys(labels) as (keyof ProcurementFeatures)[]).map((key) => {
    const perturbed = { ...features, [key]: NEUTRAL_FEATURES[key] };
    const delta = Math.abs(base - scorePath(topPathId, perturbed, UNIT_WEIGHTS));
    return { feature: key as string, label: labels[key], importance: delta };
  });
  const max = Math.max(...raw.map((r) => r.importance), 0);
  return raw
    .map((r) => ({ ...r, importance: max > 0 ? r.importance / max : 0 }))
    .sort((a, b) => b.importance - a.importance);
}

export function optimize(features: ProcurementFeatures, lang: "pl" | "en" = "pl"): OptimizationResult {
  const candidates = feasiblePathIds(features);
  const FEATURE_LABELS = lang === "en" ? FEATURE_LABELS_EN : FEATURE_LABELS_PL;

  const votes: Record<string, number> = {};
  const scoreSum: Record<string, number> = {};
  candidates.forEach((pid) => { votes[pid] = 0; scoreSum[pid] = 0; });

  // Sensitivity sweep: re-evaluate the scoring formula with reweighted coefficients to
  // measure how STABLE the winner is. These are not independent learners.
  for (let t = 0; t < N_TREES; t++) {
    const rand = lcg(t * 31337 + 42);
    const weights = treeWeights(rand);
    const runScores = candidates.map((pid) => ({ pid, s: scorePath(pid, features, weights) }));
    runScores.forEach(({ pid, s }) => { scoreSum[pid] += s; });
    runScores.sort((a, b) => b.s - a.s);
    votes[runScores[0].pid]++;
  }

  // Rank by sweep votes (share of runs won) with mean normalized score as the tiebreak,
  // so the displayed confidence = votes/30 genuinely describes the displayed winner.
  const ranked: PathResult[] = candidates
    .map((pid) => ({
      path: PATHS[pid],
      score: Math.round(scoreSum[pid] / N_TREES),
      votes: votes[pid],
      confidence: votes[pid] / N_TREES, // share of sweep runs where this path won (ensemble agreement)
      featureContributions: {},
    }))
    .sort((a, b) => b.votes - a.votes || b.score - a.score);

  const topPath = ranked[0];
  const featureImportance = ablationImportance(features, topPath.path.id, FEATURE_LABELS);

  const policyNote = generatePolicyNote(features, topPath.path.id, lang);
  const explanation = generateExplanation(features, topPath, featureImportance, lang);

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
    return `The model recommends "${pathName}" mainly because of: ${f1}${f2 ? ` and ${f2}` : ""} (largest sensitivity of the score). The winner held in ${votes}/30 sensitivity runs (ensemble agreement: ${pct}%).`;
  }
  return `Model rekomenduje "${pathName}" przede wszystkim ze względu na: ${f1}${f2 ? ` oraz ${f2}` : ""} (największy wpływ na wynik). Rekomendacja utrzymała się w ${votes}/30 przebiegach analizy wrażliwości (zgodność: ${pct}%).`;
}

function generatePolicyNote(f: ProcurementFeatures, winner: PathId, lang: "pl" | "en" = "pl"): string {
  if (lang === "en") {
    if (!f.isPublicSector) {
      return "Private sector: PZP thresholds do not apply. The organisation's procurement policy is the only constraint — all paths are available.";
    }
    if (f.contractValue < PZP_EXEMPTION_PLN) {
      return "Below the PLN 130,000 net threshold: purchase without applying PZP. Only the contracting authority's internal procurement policy applies.";
    }
    if (f.contractValue < EU_THRESHOLD_SUPPLIES_SERVICES_PLN) {
      return "Between PLN 130,000 and the EU threshold (≈ PLN 600k–930k for supplies/services; ≈ PLN 23.3M for works): the national 'tryb podstawowy' applies (Art. 275, three variants), plus negotiations without notice or a single-source award where statutory grounds are documented.";
    }
    return "At/above the EU threshold: full procedure under PZP and Directive 2014/24/EU. Competitive trybów: open tender (Art. 132), restricted tender (Art. 140), competitive dialogue (Art. 169). A negotiated procedure with notice (Art. 153) or a single-source award (Art. 214) requires documented statutory grounds.";
  }

  if (!f.isPublicSector) {
    return "Sektor prywatny: progi PZP nie mają zastosowania. Polityka zakupowa organizacji jest jedynym ograniczeniem — wszystkie ścieżki są dostępne.";
  }
  if (f.contractValue < PZP_EXEMPTION_PLN) {
    return "Poniżej progu 130 000 PLN netto: zakup bez stosowania PZP. Obowiązuje wyłącznie wewnętrzna polityka zakupowa zamawiającego.";
  }
  if (f.contractValue < EU_THRESHOLD_SUPPLIES_SERVICES_PLN) {
    return "Między 130 000 PLN a progiem UE (≈ 600 tys.–930 tys. PLN dla dostaw/usług; ≈ 23,3 mln PLN dla robót budowlanych): tryb podstawowy (Art. 275, trzy warianty), a także negocjacje bez ogłoszenia lub wolna ręka, gdy udokumentowane są ustawowe przesłanki.";
  }
  return "Na/powyżej progu UE: pełne postępowanie zgodnie z PZP i Dyrektywą 2014/24/UE. Tryby konkurencyjne: przetarg nieograniczony (Art. 132), ograniczony (Art. 140), dialog konkurencyjny (Art. 169). Negocjacje z ogłoszeniem (Art. 153) lub wolna ręka (Art. 214) wymagają udokumentowanych przesłanek.";
}
