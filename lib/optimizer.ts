// Procurement Path Optimizer — Random Forest model
//
// Recommends optimal procurement path (field route) based on purchase parameters.
// Compatible with Polish Public Procurement Law (PZP) and private sector.
//
// Model: ensemble of 30 synthetic decision trees, each using random feature subsets.
// Theoretical basis: Breiman (2001) Random Forests; Holmström & Milgrom (1991) multitask model.

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
}

export type PathId =
  | "przetarg_otwarty"
  | "przetarg_ograniczony"
  | "dialog_konkurencyjny"
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
    pzpArticle: "PZP Art. 129",
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
    pzpArticle: "PZP Art. 145",
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
    pzpArticle: "PZP Art. 172",
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
  negocjacje: {
    id: "negocjacje",
    name: "Negocjacje bezpośrednie",
    nameEn: "Direct Negotiation",
    pzpArticle: "PZP Art. 160 / Art. 214 §1 pkt 1",
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
      "Iteracyjny, wieloetapowy proces zakupowy z krótkimi cyklami decyzyjnymi, warsztatami z dostawcami i szybką selekcją. Swiss Casinos: 4 tygodnie vs. 6 miesięcy.",
    descriptionEn:
      "Iterative, multi-stage procurement process with short decision cycles, supplier workshops and rapid selection. Swiss Casinos: 4 weeks vs. 6 months.",
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
    pzpArticle: "PZP Art. 214 §1 pkt 4/5",
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

// ─── Random Forest implementation ─────────────────────────────────────────────

// LCG pseudo-random (deterministic, reproducible)
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

// Score a single path from features (continuous score 0–100)
function scorePath(path: PathId, f: ProcurementFeatures, weights: number[]): number {
  const v = f.contractValue / 1_000_000; // normalize to millions
  const [w0, w1, w2, w3, w4, w5, w6, w7, w8] = weights;

  switch (path) {
    case "przetarg_otwarty":
      return (
        w0 * Math.min(v / 10, 1) * 25 +          // large value → open tender
        w1 * (f.supplierCount >= 5 ? 1 : f.supplierCount / 5) * 25 + // many suppliers
        w2 * ((6 - f.complexity) / 5) * 20 +     // low complexity
        w3 * (f.urgencyDays > 90 ? 1 : f.urgencyDays / 90) * 15 +   // time available
        w4 * (f.isPublicSector ? 1 : 0) * 15     // public sector
      );

    case "przetarg_ograniczony":
      return (
        w0 * Math.min(v / 5, 1) * 20 +
        w1 * (f.supplierCount >= 2 && f.supplierCount <= 6 ? 1 : 0) * 30 +
        w2 * (f.isPublicSector ? 1 : 0) * 20 +
        w3 * (f.complexity >= 3 ? f.complexity / 5 : 0) * 20 +
        w4 * (f.marketMaturity <= 3 ? 1 : 0) * 10
      );

    case "dialog_konkurencyjny":
      return (
        w0 * (f.complexity / 5) * 30 +
        w1 * (f.innovationRequired ? 1 : 0) * 25 +
        w2 * (f.isPublicSector ? 1 : 0) * 15 +
        w3 * Math.min(v / 3, 1) * 15 +
        w4 * (f.marketMaturity <= 2 ? 1 : 0.3) * 15
      );

    case "negocjacje":
      return (
        w0 * (f.strategicImportance / 5) * 25 +
        w1 * (f.supplierCount <= 4 ? 1 : 2 / f.supplierCount) * 20 +
        w2 * (!f.isPublicSector ? 1 : 0.4) * 20 +
        w3 * (f.urgencyDays < 90 ? (90 - f.urgencyDays) / 90 : 0) * 20 +
        w4 * (f.supplyRisk >= 3 ? f.supplyRisk / 5 : 0) * 15
      );

    case "agile":
      return (
        w0 * (f.innovationRequired ? 1 : 0.3) * 25 +
        w1 * (f.urgencyDays < 60 ? (60 - f.urgencyDays) / 60 : 0) * 30 +
        w2 * (!f.isPublicSector ? 1 : 0.2) * 25 +
        w3 * (f.complexity >= 3 ? f.complexity / 5 : 0) * 20
      );

    case "bezposrednie":
      return (
        w0 * (f.urgencyDays < 21 ? (21 - f.urgencyDays) / 21 : 0) * 35 +
        w1 * (f.supplyRisk >= 5 ? 1 : 0) * 30 +
        w2 * (f.contractValue < 130_000 ? 1 : 0) * 20 +
        w3 * (!f.isPublicSector ? 0.5 : 0) * 15
      );
  }
}

// Generate one tree's weight vector (random feature subset weighting)
function treeWeights(rand: () => number): number[] {
  // 9 weights, randomly 0 or 1 (feature subset), then normalized
  const active = Array.from({ length: 9 }, () => (rand() > 0.4 ? 1 : 0));
  // ensure at least 3 active
  while (active.filter(Boolean).length < 3) {
    active[Math.floor(rand() * 9)] = 1;
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
};

const N_TREES = 30;
const PATH_IDS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
  "negocjacje",
  "agile",
  "bezposrednie",
];

export function optimize(features: ProcurementFeatures, lang: "pl" | "en" = "pl"): OptimizationResult {
  const votes: Record<PathId, number> = {
    przetarg_otwarty: 0,
    przetarg_ograniczony: 0,
    dialog_konkurencyjny: 0,
    negocjacje: 0,
    agile: 0,
    bezposrednie: 0,
  };
  const scores: Record<PathId, number> = { ...votes };
  const FEATURE_LABELS = lang === "en" ? FEATURE_LABELS_EN : FEATURE_LABELS_PL;
  const featureHits: Record<string, number> = {};
  Object.keys(FEATURE_LABELS).forEach((k) => (featureHits[k] = 0));

  for (let t = 0; t < N_TREES; t++) {
    const rand = lcg(t * 31337 + 42);
    const weights = treeWeights(rand);

    // Score all paths with this tree's weights
    const treeScores = PATH_IDS.map((pid) => ({
      pid,
      s: scorePath(pid, features, weights),
    }));

    // Winner of this tree
    treeScores.sort((a, b) => b.s - a.s);
    const winner = treeScores[0];
    votes[winner.pid]++;
    scores[winner.pid] += winner.s;

    // Track which features were most active in this tree (weight > 0.5)
    weights.forEach((w, i) => {
      if (w > 0.5) {
        const key = Object.keys(FEATURE_LABELS)[i];
        if (key) featureHits[key] = (featureHits[key] || 0) + 1;
      }
    });
  }

  // Build ranked results
  const ranked: PathResult[] = PATH_IDS.map((pid) => {
    const rawScore = scores[pid] / Math.max(votes[pid], 1);
    return {
      path: PATHS[pid],
      score: Math.round(Math.min(rawScore, 100)),
      votes: votes[pid],
      confidence: votes[pid] / N_TREES,
      featureContributions: {},
    };
  }).sort((a, b) => b.votes - a.votes || b.score - a.score);

  // Feature importances (normalized hit frequency)
  const maxHits = Math.max(...Object.values(featureHits));
  const featureImportance: FeatureImportance[] = Object.entries(FEATURE_LABELS)
    .map(([key, label]) => ({
      feature: key,
      label,
      importance: maxHits > 0 ? featureHits[key] / maxHits : 0,
    }))
    .sort((a, b) => b.importance - a.importance);

  const topPath = ranked[0];

  // PZP policy note
  const policyNote = generatePolicyNote(features, topPath.path.id, lang);

  return { ranked, featureImportance, topPath, policyNote, lang };
}

function generatePolicyNote(f: ProcurementFeatures, winner: PathId, lang: "pl" | "en" = "pl"): string {
  if (lang === "en") {
    if (!f.isPublicSector) {
      return "Private sector: no mandatory PZP thresholds. The organisation's procurement policy is the only constraint — all paths are available.";
    }
    if (f.contractValue < 130_000) {
      return "Below the 130,000 PLN net threshold: purchase without applying PZP. Only the contracting authority's internal procurement policy applies.";
    }
    if (f.contractValue < 5_382_000) {
      return "National PZP thresholds (130,000 – 5,382,000 PLN for supplies/services): national procedures. Available: open tender, restricted tender, price inquiry, negotiations without notice (Art. 275).";
    }
    return "Above EU thresholds: full procedure under PZP and Directive 2014/24/EU. Available: open tender (Art. 129), restricted tender (Art. 145), competitive dialogue (Art. 172), negotiated procedure with notice (Art. 160).";
  }

  if (!f.isPublicSector) {
    return "Sektor prywatny: brak obligatoryjnych progów PZP. Polityka zakupowa organizacji jest jedynym ograniczeniem — wszystkie ścieżki są dostępne.";
  }
  if (f.contractValue < 130_000) {
    return "Poniżej progu 130 000 PLN netto: zakup bez stosowania PZP. Obowiązuje wyłącznie wewnętrzna polityka zakupowa zamawiającego.";
  }
  if (f.contractValue < 5_382_000) {
    return "Progi krajowe PZP (130 000 – 5 382 000 PLN dla dostaw/usług): tryby krajowe. Dostępne: przetarg nieograniczony, ograniczony, zapytanie o cenę, negocjacje bez ogłoszenia (Art. 275).";
  }
  return "Powyżej progów unijnych: pełne postępowanie zgodnie z PZP i Dyrektywą 2014/24/UE. Możliwe tryby: przetarg nieograniczony (Art. 129), ograniczony (Art. 145), dialog konkurencyjny (Art. 172), negocjacje z ogłoszeniem (Art. 160).";
}
