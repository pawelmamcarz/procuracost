// Procurement Path Optimizer — deterministic heuristic scoring ensemble
//
// Recommends optimal procurement path (field route) based on purchase parameters.
// Includes non-binding orientation for Polish Public Procurement Law (PZP) thresholds.
//
// Model: 30 reproducible scoring variants over transparent expert-authored rules.
// This is a decision-support heuristic, not a trained machine-learning classifier.

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
      "Iteracyjny, wieloetapowy proces zakupowy z krótkimi cyklami decyzyjnymi, warsztatami z dostawcami i szybką selekcją.",
    descriptionEn:
      "Iterative, multi-stage procurement process with short decision cycles, supplier workshops and rapid selection.",
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
      "Poniżej progu 170 000 PLN (bez PZP od 1.01.2026)",
    ],
    conditionsEn: [
      "Technical or legal monopoly",
      "Emergency / continuity threat",
      "Exceptional unforeseeable urgency",
      "Below the 170,000 PLN threshold (no PZP required from 1 Jan 2026)",
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

// ─── Deterministic scoring ensemble ───────────────────────────────────────────

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
  const [w0, w1, w2, w3, w4] = weights;
  const w9 = weights[9];
  const w10 = weights[10];

  const isDirect = f.spendType === "direct";
  const isUpstream = f.processPhase === "upstream";
  const isDownstream = f.processPhase === "downstream";

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
        w4 * (f.marketMaturity <= 2 ? 1 : 0.3) * 15 +
        // Deepened dimension effects: dialog/competitive negotiation is the natural fit
        // for complex, high-stakes Direct + Upstream sourcing where relationship and risk allocation matter.
        w9 * (isUpstream ? 1.35 : 0.65) * 14 +
        w10 * (isDirect && isUpstream ? 1.6 : isDirect ? 1.1 : 0.7) * 12
      );

    case "negocjacje":
      return (
        w0 * (f.strategicImportance / 5) * 25 +
        w1 * (f.supplierCount <= 4 ? 1 : 2 / f.supplierCount) * 20 +
        w2 * (!f.isPublicSector ? 1 : 0.4) * 20 +
        w3 * (f.urgencyDays < 90 ? (90 - f.urgencyDays) / 90 : 0) * 20 +
        w4 * (f.supplyRisk >= 3 ? f.supplyRisk / 5 : 0) * 15 +
        // New dimensions - very strong and realistic impact (pogłębienie modelu)
        // Direct + Upstream → bardzo silna preferencja dla elastycznych, zaawansowanych ścieżek (dialog, negocjacje)
        // Downstream → większa tolerancja dla prostszych, operacyjnych ścieżek
        w9 * (isUpstream && isDirect ? 1.8 : 0.4) * 25 +
        w10 * (isDownstream ? 0.45 : 1.25) * 15
      );

    case "agile":
      return (
        w0 * (f.innovationRequired ? 1 : 0.3) * 25 +
        w1 * (f.urgencyDays < 60 ? (60 - f.urgencyDays) / 60 : 0) * 30 +
        w2 * (!f.isPublicSector ? 1 : 0.2) * 25 +
        w3 * (f.complexity >= 3 ? f.complexity / 5 : 0) * 20 +
        // Downstream + Indirect favors faster, lighter execution paths
        w9 * (isDownstream ? 1.25 : 0.85) * 8 +
        w10 * (isDirect ? 0.9 : 1.15) * 6
      );

    case "bezposrednie":
      return (
        w0 * (f.urgencyDays < 21 ? (21 - f.urgencyDays) / 21 : 0) * 35 +
        w1 * (f.supplyRisk >= 5 ? 1 : 0) * 30 +
        w2 * (f.contractValue < 170_000 ? 1 : 0) * 20 +
        w3 * (!f.isPublicSector ? 0.5 : 0) * 15 +
        // Direct + Upstream almost never fits single-source without justification; Downstream+Indirect often does
        w9 * (isDirect && isUpstream ? 0.25 : isDownstream ? 1.4 : 1.0) * 10 +
        w10 * (isDownstream && !isDirect ? 1.3 : 0.9) * 6
      );
  }
}

// Generate one scoring variant's deterministic rule-weight vector.
function voterWeights(rand: () => number): number[] {
  // 11 weights now (added spendType + processPhase)
  const active = Array.from({ length: 11 }, () => (rand() > 0.4 ? 1 : 0));
  // ensure at least 3 active
  while (active.filter(Boolean).length < 3) {
    active[Math.floor(rand() * 11)] = 1;
  }
  // scale with random importance
  return active.map((a) => (a ? 0.5 + rand() * 0.5 : 0));
}

export interface PathResult {
  path: ProcurementPath;
  score: number;        // 0–100
  votes: number;        // out of 30 scoring variants
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
  importance: number; // 0–1, normalized local sensitivity
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

const N_VOTERS = 30;
const PZP_APPLICATION_THRESHOLD_PLN = 170_000;
const EU_CENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN = 603_400;
const EU_SUBCENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN = 930_960;
const PATH_IDS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
  "negocjacje",
  "agile",
  "bezposrednie",
];

const REFERENCE_FEATURES: ProcurementFeatures = {
  contractValue: 1_000_000,
  supplierCount: 5,
  complexity: 3,
  urgencyDays: 90,
  isPublicSector: false,
  innovationRequired: false,
  supplyRisk: 3,
  strategicImportance: 3,
  marketMaturity: 3,
  spendType: "indirect",
  processPhase: "downstream",
};

function evaluateEnsemble(features: ProcurementFeatures) {
  const votes = Object.fromEntries(PATH_IDS.map((path) => [path, 0])) as Record<PathId, number>;
  const scores = Object.fromEntries(PATH_IDS.map((path) => [path, 0])) as Record<PathId, number>;

  for (let voter = 0; voter < N_VOTERS; voter++) {
    const rand = lcg(voter * 31337 + 42);
    const weights = voterWeights(rand);
    const voterScores = PATH_IDS.map((path) => ({
      path,
      score: scorePath(path, features, weights),
    }));

    for (const result of voterScores) scores[result.path] += result.score;
    voterScores.sort((a, b) => b.score - a.score);
    votes[voterScores[0].path]++;
  }

  return { votes, scores };
}

export function optimize(features: ProcurementFeatures, lang: "pl" | "en" = "pl"): OptimizationResult {
  const { votes, scores } = evaluateEnsemble(features);
  const FEATURE_LABELS = lang === "en" ? FEATURE_LABELS_EN : FEATURE_LABELS_PL;

  // Build ranked results
  const ranked: PathResult[] = PATH_IDS.map((pid) => {
    const rawScore = scores[pid] / N_VOTERS;
    return {
      path: PATHS[pid],
      score: Math.round(Math.min(rawScore, 100)),
      votes: votes[pid],
      confidence: votes[pid] / N_VOTERS,
      featureContributions: {},
    };
  }).sort((a, b) => b.votes - a.votes || b.score - a.score);

  const topPath = ranked[0];
  const topPathId = topPath.path.id;
  const originalSupport = votes[topPathId] / N_VOTERS;
  const originalScore = scores[topPathId] / N_VOTERS;
  const featureKeys = Object.keys(FEATURE_LABELS) as Array<keyof ProcurementFeatures>;
  const rawSensitivity = featureKeys.map((feature) => {
    const comparisonFeatures = {
      ...features,
      [feature]: REFERENCE_FEATURES[feature],
    } as ProcurementFeatures;
    const comparison = evaluateEnsemble(comparisonFeatures);
    const supportChange = Math.abs(originalSupport - comparison.votes[topPathId] / N_VOTERS);
    const scoreChange = Math.abs(originalScore - comparison.scores[topPathId] / N_VOTERS) / 100;
    return { feature, value: supportChange + scoreChange };
  });
  const maxSensitivity = Math.max(...rawSensitivity.map(({ value }) => value));
  const featureImportance: FeatureImportance[] = rawSensitivity
    .map(({ feature, value }) => ({
      feature,
      label: FEATURE_LABELS[feature],
      importance: maxSensitivity > 0 ? value / maxSensitivity : 0,
    }))
    .sort((a, b) => b.importance - a.importance);

  // PZP policy note
  const policyNote = generatePolicyNote(features, lang);
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
    case "spendType":
      return `${pl ? "rodzaj wydatku" : "spend type"}: ${v === "direct" ? "Direct" : "Indirect"}`;
    case "processPhase":
      return `${pl ? "faza procesu" : "process phase"}: ${v === "upstream" ? "Upstream" : "Downstream"}`;
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
  const top = featureImportance.filter(({ importance }) => importance > 0).slice(0, 2);
  if (top.length === 0) {
    return lang === "en"
      ? `The heuristic ensemble recommends "${pathName}" in ${votes}/30 scoring variants (agreement: ${pct}%). Local neutralization of individual inputs did not change its support.`
      : `Heurystyczny ensemble rekomenduje „${pathName}” w ${votes}/30 wariantach scoringu (zgodność: ${pct}%). Lokalna neutralizacja pojedynczych parametrów nie zmieniła poparcia dla tej ścieżki.`;
  }
  const f1 = describeFeatureValue(top[0]?.feature as keyof ProcurementFeatures, features, lang);
  const f2 = top[1] ? describeFeatureValue(top[1].feature as keyof ProcurementFeatures, features, lang) : null;

  if (lang === "en") {
    return `The heuristic ensemble recommends "${pathName}" primarily because of: ${f1}${f2 ? ` and ${f2}` : ""}. The path won ${votes}/30 scoring variants (agreement: ${pct}%).`;
  }
  return `Heurystyczny ensemble rekomenduje „${pathName}” przede wszystkim ze względu na: ${f1}${f2 ? ` oraz ${f2}` : ""}. Ścieżka wygrała w ${votes}/30 wariantach scoringu (zgodność: ${pct}%).`;
}

function generatePolicyNote(f: ProcurementFeatures, lang: "pl" | "en" = "pl"): string {
  if (lang === "en") {
    if (!f.isPublicSector) {
      return "Private sector: PZP thresholds generally do not apply, but internal policy and sector-specific rules may constrain the route. This heuristic is not legal advice.";
    }
    if (f.contractValue < PZP_APPLICATION_THRESHOLD_PLN) {
      return "Below the 170,000 PLN net threshold effective from 1 January 2026: PZP generally does not apply. Internal rules still apply; verify exceptions.";
    }
    if (f.contractValue < EU_CENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN) {
      return "Between 170,000 and 603,400 PLN net: below the lowest standard EU threshold for classic supplies/services in 2026–2027. National PZP rules apply; verify the lawful procedure and procurement category.";
    }
    if (f.contractValue < EU_SUBCENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN) {
      return "603,400–930,960 PLN net: the EU threshold applies to central-government authorities, while the standard sub-central supplies/services threshold is 930,960 PLN for 2026–2027. Verify authority and contract type.";
    }
    return "At or above 930,960 PLN net: above the 2026–2027 standard EU threshold for classic supplies/services for sub-central authorities. Exact rules depend on authority and contract type. This heuristic does not verify legal compliance.";
  }

  if (!f.isPublicSector) {
    return "Sektor prywatny: progi PZP co do zasady nie obowiązują, ale ścieżkę mogą ograniczać polityka wewnętrzna i regulacje sektorowe. Ta heurystyka nie jest poradą prawną.";
  }
  if (f.contractValue < PZP_APPLICATION_THRESHOLD_PLN) {
    return "Poniżej progu 170 000 PLN netto obowiązującego od 1 stycznia 2026 r.: PZP co do zasady nie ma zastosowania. Nadal obowiązują reguły wewnętrzne; sprawdź wyjątki.";
  }
  if (f.contractValue < EU_CENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN) {
    return "170 000–603 400 PLN netto: poniżej najniższego standardowego progu unijnego dla klasycznych dostaw i usług w latach 2026–2027. Stosuje się reguły krajowe PZP; zweryfikuj właściwy tryb i kategorię zamówienia.";
  }
  if (f.contractValue < EU_SUBCENTRAL_SUPPLIES_SERVICES_THRESHOLD_PLN) {
    return "603 400–930 960 PLN netto: próg unijny obowiązuje centralne instytucje rządowe, a standardowy próg dla dostaw/usług zamawiających poniżej szczebla centralnego wynosi 930 960 PLN w latach 2026–2027. Zweryfikuj typ zamawiającego i zamówienia.";
  }
  return "Od 930 960 PLN netto: powyżej standardowego progu unijnego 2026–2027 dla klasycznych dostaw/usług zamawiających poniżej szczebla centralnego. Właściwe reguły zależą od typu zamawiającego i zamówienia. Heurystyka nie weryfikuje zgodności prawnej.";
}
