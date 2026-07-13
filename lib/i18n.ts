export type Lang = "pl" | "en";

// Enforces that a translation object for one language has exactly the same
// key structure (and function signatures) as the other — a key added to
// only one language surfaces as a compile error instead of a silent
// `undefined` at runtime.
type LangShape<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends object
  ? { [K in keyof T]: LangShape<T[K]> }
  : string;

const calculatorPl = {
  scenarioLabel: "Scenariusz zakupowy",
  contractValue: "Wartość kontraktu (PLN)",
  dailyCostOfInaction: "Dzienny koszt zaniechania (PLN/dzień)",
  dailyCostOfInactionTooltip:
    "Wartość tracona każdego dnia bez podpisanego kontraktu — zatrzymana produkcja, nieosiągalny przychód, koszt alternatywny.",
  renegotiationCost: "Koszt renegocjacji (PLN)",
  bypassExposure: "Ryzyko audytowe przy obejściu (PLN)",
  bypassTooltip:
    "Szacowany koszt audytu, kary regulacyjne lub reputacyjne jeśli nieformalne obejście procedury zostanie odkryte. Źródło: Lipsky (1980), Vaughan (1996)",
  tcoHorizon: "Horyzont TCO (lata)",
  // Process type section
  processTypeLabel: "Typ procesu zakupowego",
  processCategoryLabels: {
    strategic: "Zakupy strategiczne — dobór dostawcy, negocjacje, CAPEX",
    operational: "Zakupy operacyjne — realizacja na bazie kontraktu",
    strategic_pzp: "Zakupy strategiczne PZP — tryby ustawowe",
  },
  operationalCategoryNote: "Zakupy operacyjne działają na pre-negocjowanych kontraktach (dostawca i cena są już ustalone). Model kosztów porównuje tu ręczną realizację z automatyzacją ERP/Ariba Guided Buying, nie wybór procedury przetargowej.",
  strategicPzpCategoryNote: "Strategiczne PZP pokazujemy osobno, bo wybór ścieżki ograniczają progi, terminy i przesłanki ustawowe. Porównanie obejmuje wyłącznie dopuszczalne warianty w tej samej granicy prawa.",
  processTypes: {
    pzp_eu: "Strategiczne PZP — przetarg UE",
    pzp_krajowy: "Strategiczne PZP — postępowanie krajowe",
    private_formal: "Strategiczny przetarg prywatny (RFQ/RFP)",
    policy_only: "Strategiczna ścieżka adaptacyjna i zgodna",
    catalog_order: "Operacyjne zamówienie z katalogu",
    mrp_order: "Operacyjne zlecenie MRP / cykl produkcyjny",
    capex: "Strategiczna inwestycja CAPEX",
    custom: "Własny",
  },
  // Tech level section
  techLevelLabel: "Poziom technologiczny",
  techLevels: {
    manual: "Manualny (Excel / email)",
    sourcing_tool: "Narzędzie sourcingowe",
    partial_erp: "Częściowy ERP",
    end_to_end: "End-to-end (Ariba / Coupa)",
  },
  // Stakeholders section
  stakeholdersTitle: "Uczestnicy procesu",
  stakeholderRoles: {
    requestor: "Zamawiający (biznes)",
    buyer: "Kupiec",
    lawyer: "Prawnik",
    finance: "Finanse",
    manager: "Kierownik",
    executive: "Zarząd",
  },
  colCount: "Liczba",
  colDailyRate: "Stawka / dzień (PLN)",
  // Financial
  financialTitle: "Parametry finansowe",
  rigidProcedure: "Procedura sztywna",
  flexiblePolicy: "Polityka zakupowa (elastyczna)",
  durationDays: "Czas trwania (dni)",
  adminCosts: "Koszty administracyjne (PLN)",
  calculate: "Oblicz koszty utracone",
  derivedNote: "Czas i koszty administracyjne wynikają z szablonu procesu i poziomu narzędzia.",
} as const;

type CalculatorShape = LangShape<typeof calculatorPl>;

const calculatorEn = {
  scenarioLabel: "Procurement scenario",
  contractValue: "Contract value (PLN)",
  dailyCostOfInaction: "Daily cost of inaction (PLN/day)",
  dailyCostOfInactionTooltip:
    "Value lost every day without a signed contract — halted production, unrealised revenue, opportunity cost.",
  renegotiationCost: "Renegotiation cost (PLN)",
  bypassExposure: "Audit exposure on bypass (PLN)",
  bypassTooltip:
    "Estimated audit cost, regulatory or reputational penalties if an informal procedure bypass is discovered. Source: Lipsky (1980), Vaughan (1996)",
  tcoHorizon: "TCO horizon (years)",
  processTypeLabel: "Procurement process type",
  processCategoryLabels: {
    strategic: "Strategic procurement — supplier selection, negotiation, CAPEX",
    operational: "Operational procurement — execution against contract",
    strategic_pzp: "Strategic PZP procurement — statutory procedures",
  },
  operationalCategoryNote: "Operational procurement runs against pre-negotiated contracts (supplier and price are already set). The cost model compares manual execution against ERP/Ariba Guided Buying automation, not competing tender approaches.",
  strategicPzpCategoryNote: "Strategic PZP is shown separately because path choice is constrained by statutory thresholds, timelines and grounds. Comparisons include only variants inside the same legal boundary.",
  processTypes: {
    pzp_eu: "Strategic PZP — EU open tender",
    pzp_krajowy: "Strategic PZP — national procedure",
    private_formal: "Strategic private tender (RFQ/RFP)",
    policy_only: "Strategic adaptive and compliant path",
    catalog_order: "Operational catalog order",
    mrp_order: "Operational MRP / production cycle",
    capex: "Strategic CAPEX investment",
    custom: "Custom",
  },
  techLevelLabel: "Technology level",
  techLevels: {
    manual: "Manual (Excel / email)",
    sourcing_tool: "Sourcing tool",
    partial_erp: "Partial ERP",
    end_to_end: "End-to-end (Ariba / Coupa)",
  },
  stakeholdersTitle: "Process participants",
  stakeholderRoles: {
    requestor: "Requestor (business)",
    buyer: "Buyer",
    lawyer: "Lawyer",
    finance: "Finance",
    manager: "Manager",
    executive: "Executive",
  },
  colCount: "Count",
  colDailyRate: "Daily rate (PLN)",
  financialTitle: "Financial parameters",
  rigidProcedure: "Rigid procedure",
  flexiblePolicy: "Procurement policy (flexible)",
  durationDays: "Duration (days)",
  adminCosts: "Administrative costs (PLN)",
  calculate: "Calculate opportunity costs",
  derivedNote: "Duration and administrative costs are derived from the process template and technology level.",
} satisfies CalculatorShape;

export const calculatorT = { pl: calculatorPl, en: calculatorEn } as const;

// Canonical ∂Φ boundary set (CLAUDE_DESIGN.md) — single source of truth; use verbatim everywhere.
export const PHI_SET = {
  pl: "∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}",
  en: "∂Φ = {auth, competition, ethics, docs}",
} as const;

const comparisonPl = {
  costLabels: {
    timeCost: "Koszt czasu (kadra)",
    adminCost: "Koszty admin. (koordynacja + narzędzie)",
    opportunityCost: "Utracone okazje",
    productivityCost: "Koszt jakości wyboru (dyskrecja/faworytyzm)",
    renegotiationCost: "Renegocjacje",
    tcoCost: "Utracone oszczędności TCO",
    bypassCost: "Ekspozycja na obejścia",
  },
  deltaHeadline: "Różnica kosztów: formalny − adaptacyjny",
  higherThan: "więcej dla ścieżki formalnej niż adaptacyjnej",
  lowerThan: "mniej dla ścieżki formalnej niż adaptacyjnej",
  modelAdjustContext: "model dostosowany do kontekstu",
  modelAdjustTitle: "Zastosowane korekty modelu:",
  modelAdjustDirectTco: "Korekta obsady ról dla wydatku Direct (założenie)",
  modelAdjustUpstreamBypass: "Korekta czasu i koordynacji Upstream (założenie)",
  modelAdjustDownstreamProd: "Niższy koszt opóźnienia i koordynacji Downstream (założenie)",
  modelAdjustStrongest: "Łączna korekta czasu i obsady dla Direct × Upstream",
  bypassLabel: "Centralna scenariuszowa stopa obejść",
  bypassNote:
    "Założenie modelowe skalowane przez kontrolę systemową; teoria nie dostarcza prawdopodobieństwa",
  rigidLabel: "Ścieżka formalna",
  flexibleLabel: "Ścieżka adaptacyjna",
  chartTitle: "Porównanie wg wymiaru kosztów",
  tableTitle: "Szczegółowe zestawienie",
  colCostDim: "Wymiar kosztów",
  colDiff: "Różnica",
  sourcesTitle: "Źródła naukowe modelu",
  importance: "Ważność",
  // Step breakdown section
  stepsTitle: "Kroki procesu — skąd wynika czas?",
  stepsRigidDays: "Dni (formalny)",
  stepsFlexDays: "Dni (adaptacyjny)",
  stepsMandatory: "Wymagany prawnie",
  stepsParticipants: "Uczestnicy (h)",
  stepsEliminated: "eliminowany",
  // Matrix section
  matrixTitle: "Macierz 2D: proces × technologia",
  matrixRigid: "Ścieżka formalna",
  matrixFlexible: "Ścieżka adaptacyjna",
  matrixTechLabel: "Poziom narzędzia",
  matrixTotalCost: "Koszt całkowity",
  matrixDays: "Dni",
  matrixContextLabel: "Macierz uwzględnia bieżący kontekst:",
  matrixContextDirect: "Wydatki Direct",
  matrixContextIndirect: "Wydatki Indirect",
  matrixContextUpstream: "Upstream (strategiczny)",
  matrixContextDownstream: "Downstream (operacyjny)",
  matrixContextDetail: "jawne korekty czasu, obsady ról, opóźnienia i koordynacji; TCO, kontrakt i obejścia mają osobne profile scenariuszowe.",
  matrixNoContextNote: "Macierz pokazuje wszystkie kombinacje technologii × trybu procesu dla wybranego typu zakupu.",
  matrixColorLegend: "Gradient kolorów: zielony = najniższy koszt, czerwony = najwyższy. Wiersz podświetlony = aktualne ustawienie. Wartości uwzględniają efekty Spend Type × Process Phase.",
  appliedMultipliersTitle: "Zastosowane mnożniki kontekstu",
  appliedMultipliersNote: "Model 2.0 stosuje mnożniki kontekstu do czasu, opóźnienia i koordynacji. Pozostałe mechanizmy mają odrębne profile ścieżek i zakresy scenariuszowe; wartość 1,00 oznacza brak korekty kontekstowej.",
  // Sub-breakdown
  staffCost: "Kadra (godziny × stawki)",
  coordCost: "Koordynacja (email/telefon)",
  toolCost: "Licencja narzędzia",
  pipeFieldTitle: "Dlaczego ta różnica istnieje? Model tunelu i pola.",
  pipeLabel: "Ścieżka formalna = topologia tunelu",
  pipeDesc:
    "Ścieżka formalna porządkuje konkurencję i ogranicza dyskrecję, ale może też sekwencjonować pracę: a₁ → a₂ → ... → aₙ. Obejście jest możliwym ryzykiem do zmierzenia, nie automatycznym skutkiem procedury.",
  fieldLabel: "Ścieżka adaptacyjna = topologia pola",
  fieldDesc:
    "Ścieżka adaptacyjna działa w tej samej granicy uprawnień, konkurencji, etyki i dokumentacji. Może przyspieszać iteracje, lecz słaba konkurencja lub kontrola może odwrócić jej przewagę.",
  pipeFieldSource: "Źródło modelu: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger; Holmström & Milgrom (1991) Multitask Principal-Agent",
  radarTitle: "Profil kosztów — 6 wymiarów (znormalizowane)",
  radarSubtitle: "Każda oś pokazuje koszt w danym wymiarze jako % wartości wyższej (100 = max). Mniejsza powierzchnia = niższy koszt.",
  sensitivityTitle: "Wrażliwość: koszty vs. wartość kontraktu",
  sensitivitySubtitle: "Jak zmieniają się koszty całkowite przy zmianie wartości kontraktu. Pozostałe parametry stałe.",
  sensitivityCostGapLabel: "Różnica",
  sensitivityFooterNote: "Niebieska przerywana = różnica kosztów (formalny − adaptacyjny). Aktualny scenariusz przy 100% (wartość kontraktu 1×).",
  benchmarkTitle: "Twój scenariusz na tle przypadków referencyjnych",
  benchmarkSubtitle: "Różnica formalny − adaptacyjny (% kosztu ścieżki adaptacyjnej)",
  benchmarkYours: "Twój scenariusz",
  benchmarkSummary: (pct: number, rank: number, total: number) =>
    `Różnica w Twoim scenariuszu wynosi ${pct}% — jest wyższa niż w ${rank} z ${total} przypadków referencyjnych.`,
} as const;

type ComparisonShape = LangShape<typeof comparisonPl>;

const comparisonEn = {
  costLabels: {
    timeCost: "Time cost (staff)",
    adminCost: "Admin overhead (coordination + tool)",
    opportunityCost: "Opportunity cost",
    productivityCost: "Selection-quality cost (discretion)",
    renegotiationCost: "Renegotiation",
    tcoCost: "Foregone TCO savings",
    bypassCost: "Bypass exposure",
  },
  deltaHeadline: "Cost difference: formal − adaptive",
  higherThan: "more for the formal path than the adaptive path",
  lowerThan: "less for the formal path than the adaptive path",
  modelAdjustContext: "model adjusted for context",
  modelAdjustTitle: "Model adjustments applied:",
  modelAdjustDirectTco: "Role-mix adjustment for Direct spend (assumption)",
  modelAdjustUpstreamBypass: "Upstream timing and coordination adjustment (assumption)",
  modelAdjustDownstreamProd: "Lower Downstream delay and coordination costs (assumption)",
  modelAdjustStrongest: "Combined timing and role-mix adjustment for Direct × Upstream",
  bypassLabel: "Central scenario bypass rate",
  bypassNote:
    "Model assumption scaled by system controls; the cited theory does not provide a probability",
  rigidLabel: "Formal path",
  flexibleLabel: "Adaptive path",
  chartTitle: "Cost comparison by dimension",
  tableTitle: "Detailed breakdown",
  colCostDim: "Cost dimension",
  colDiff: "Difference",
  sourcesTitle: "Academic sources",
  importance: "Importance",
  stepsTitle: "Process steps — why does it take this long?",
  stepsRigidDays: "Days (formal)",
  stepsFlexDays: "Days (adaptive)",
  stepsMandatory: "Legally required",
  stepsParticipants: "Participants (h)",
  stepsEliminated: "eliminated",
  matrixTitle: "2D matrix: process × technology",
  matrixRigid: "Formal path",
  matrixFlexible: "Adaptive path",
  matrixTechLabel: "Technology level",
  matrixTotalCost: "Total cost",
  matrixDays: "Days",
  matrixContextLabel: "Matrix reflects current context:",
  matrixContextDirect: "Direct spend",
  matrixContextIndirect: "Indirect spend",
  matrixContextUpstream: "Upstream (strategic)",
  matrixContextDownstream: "Downstream (operational)",
  matrixContextDetail: "explicit timing, role-mix, delay and coordination adjustments; TCO, contract and bypass use separate scenario profiles.",
  matrixNoContextNote: "Matrix shows all technology × process mode combinations for the selected procurement type.",
  matrixColorLegend: "Color gradient: green = lowest cost, red = highest. Row highlighted = current selection. Numbers already incorporate Spend Type × Process Phase effects.",
  appliedMultipliersTitle: "Applied context multipliers",
  appliedMultipliersNote: "Model 2.0 applies context multipliers to timing, delay and coordination. Other mechanisms use separate path profiles and scenario ranges; 1.00 means no contextual adjustment.",
  staffCost: "Staff (hours × rates)",
  coordCost: "Coordination (email/phone)",
  toolCost: "Tool license",
  pipeFieldTitle: "Why does this gap exist? The Tunnel and Field model.",
  pipeLabel: "Formal path = tunnel topology",
  pipeDesc:
    "The formal path structures competition and limits discretion, but may sequence work as a₁ → a₂ → ... → aₙ. Bypass is a risk to measure, not an automatic consequence of procedure.",
  fieldLabel: "Adaptive path = field topology",
  fieldDesc:
    "The adaptive path operates within the same authorisation, competition, ethics and documentation boundary. It can speed iteration, but weak competition or control can reverse its advantage.",
  pipeFieldSource: "Model sources: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger; Holmström & Milgrom (1991) Multitask Principal-Agent",
  radarTitle: "Cost profile — 6 dimensions (normalized)",
  radarSubtitle: "Each axis shows the cost in that dimension as a % of the higher value (100 = maximum). Smaller area = lower cost.",
  sensitivityTitle: "Sensitivity: cost vs. contract value",
  sensitivitySubtitle: "How total costs change as contract value varies. All other parameters fixed.",
  sensitivityCostGapLabel: "Cost gap",
  sensitivityFooterNote: "Blue dashed line = cost difference (formal − adaptive). Current scenario marked at 100% (contract value 1×).",
  benchmarkTitle: "Your scenario vs reference cases",
  benchmarkSubtitle: "Formal − adaptive cost difference (% of adaptive-path cost)",
  benchmarkYours: "Your scenario",
  benchmarkSummary: (pct: number, rank: number, total: number) =>
    `Your scenario difference is ${pct}% — higher than ${rank} of ${total} reference cases.`,
} satisfies ComparisonShape;

export const comparisonT = { pl: comparisonPl, en: comparisonEn } as const;

const researchExportPl = {
  forPaper: "Do artykułu / replikacji:",
  exportJson: "Eksport JSON",
  exportCsv: "Eksport CSV",
  exportMarkdown: "Eksport Markdown",
  liveTraceNote: "Używa aktywnych mnożników + pełnego śladu obliczeń",
  jsonTitle: "Pobierz pełne wejścia, mnożniki, ślad obliczeń i wyniki jako JSON",
  csvTitle: "Pobierz wymiary kosztów i mnożniki jako CSV",
  markdownTitle: "Pobierz tabelę wyników i ślad jako Markdown",
  jsonNote: "Pełny eksport wyników z CostComparison. Używaj razem z model_specification_draft.md.",
  assumptionsExportJson: "Eksport badawczy (JSON: mnożniki + scenariusz)",
  assumptionsJsonTitle: "Eksportuj bieżące mnożniki (bazowe + efektywne), szczegóły i pełny wyliczony scenariusz do pakietu replikacyjnego lub tabel w artykule",
  assumptionsCopyCsv: "Kopiuj mnożniki (CSV)",
  assumptionsCsvTitle: "Skopiuj mnożniki i wartości symulatora jako CSV do wklejenia w artykule lub arkuszu",
  assumptionsJsonNote: "Aktywne mnożniki z getDimensionMultipliers + getDimensionMultiplierDetails. Pełny wynik używa calculateCosts z wyświetlanym kontekstem.",
} as const;

type ResearchExportShape = LangShape<typeof researchExportPl>;

const researchExportEn = {
  forPaper: "For the paper / replication:",
  exportJson: "Export JSON",
  exportCsv: "Export CSV",
  exportMarkdown: "Export Markdown",
  liveTraceNote: "Uses live multipliers + full result trace",
  jsonTitle: "Download full inputs, multipliers, calculation trace and results as JSON",
  csvTitle: "Download cost dimensions and multipliers as CSV",
  markdownTitle: "Download the results table and trace as Markdown",
  jsonNote: "Full result export from CostComparison. Use with model_specification_draft.md.",
  assumptionsExportJson: "Export for Research (JSON: multipliers + scenario)",
  assumptionsJsonTitle: "Export current multipliers (base + effective), details, and a full computed scenario for the replication package or paper tables",
  assumptionsCopyCsv: "Copy multipliers CSV",
  assumptionsCsvTitle: "Copy multipliers and simulator values as CSV for easy pasting into paper or spreadsheet",
  assumptionsJsonNote: "Live multipliers from getDimensionMultipliers + getDimensionMultiplierDetails. Full result uses calculateCosts with the displayed context.",
} satisfies ResearchExportShape;

export const researchExportT = { pl: researchExportPl, en: researchExportEn } as const;

const optimizerPl = {
  parametersTitle: "Parametry zakupu",
  contractValue: "Wartość kontraktu:",
  supplierCount: "Liczba kwalifikowanych dostawców:",
  timeAvailable: "Czas dostępny:",
  days: "dni",
  monopoly: "1 (monopol)",
  supplierMax: "20+",
  urgent: "7 dni (pilne)",
  daysMax: "365 dni",
  complexity: "Złożoność zakupu",
  supplyRisk: "Ryzyko podaży",
  strategicImportance: "Ważność strategiczna",
  marketMaturity: "Dojrzałość rynku (1=nowy, 5=towar)",
  publicSector: "Sektor publiczny (PZP)",
  innovationRequired: "Wymagana innowacyjność",
  findPath: "Znajdź optymalną ścieżkę →",
  recommended: "Rekomendowana ścieżka zakupowa",
  modelConfidence: "Zgodność modelu",
  treeVotes: "Zgodne przebiegi (z 30)",
  typicalTime: "Typowy czas",
  pzpNote: "Nota PZP",
  rankingTitle: "Ranking ścieżek (średni wynik, 30 przebiegów wrażliwości)",
  importanceTitle: "Ważność cech — co decyduje (ablacja)",
  importanceNote:
    "Zmiana wyniku rekomendowanej ścieżki po wyzerowaniu danej cechy (ablacja, deterministyczna — bez losowości).",
  whenToUse: "Kiedy stosować",
  risks: "Ryzyka",
  sliderLevels: {
    1: "Bardzo niski",
    2: "Niski",
    3: "Średni",
    4: "Wysoki",
    5: "Bardzo wysoki",
  } as Record<number, string>,
  modelNote:
    "Model: ważona funkcja oceny (jedna formuła na ścieżkę) — NIE jest to trenowana sieć ML ani prawdziwy las losowy. 30 „przebiegów” to analiza wrażliwości (te same reguły z przeważonymi współczynnikami) pokazująca stabilność rekomendacji, a nie niezależne klasyfikatory. Wagi to założenia modelowe, nie parametry dopasowane do rzeczywistych wyników zamówień. Narzędzie ilustracyjne — niewalidowane na realnych danych zakupowych. Rekomendacje dla sektora publicznego są twardo filtrowane do dopuszczalnych trybów PZP.",
  importanceUnit: "%",
  importance: "Ważność",
  explanationTitle: "Dlaczego ta rekomendacja?",
  scoringContextLabel: "Kontekst scoringu:",
  contextUpstreamLabel: "Upstream (strategiczny)",
  contextDownstreamLabel: "Downstream (operacyjny)",
  scoringContextDirectUpstream: "Bardzo silna preferencja dla elastycznych ścieżek strategicznych (dialog konkurencyjny / negocjacje) — wysoka dźwignia TCO, intensywność relacji i alokacja ryzyka.",
  scoringContextIndirectDownstream: "Wyższa tolerancja dla prostych, transakcyjnych ścieżek wykonawczych — mniejsze narzuty koordynacyjne i ograniczona wartość strategiczna złożonych procedur.",
  scoringContextOther: "Kontekst zmienia względną atrakcyjność ścieżek negocjacyjnych vs. wykonawczych oraz wagę czasu kadry wyższej.",
  scoringContextWeightsNote: "W scoringu: ścieżki negocjacyjne i dialog są preferowane dla Direct+Upstream, a bezpośredni wybór i proste ścieżki wykonawcze są obniżone. To ręcznie ustawione wagi modelowe, nie parametry uczone z danych.",
  theoryNote: "Logika ścieżek opiera się koncepcyjnie na teorii zakupów: Williamson (1985) TCE, Kraljic (1983) portfolio.",
} as const;

type OptimizerShape = LangShape<typeof optimizerPl>;

const optimizerEn = {
  parametersTitle: "Purchase parameters",
  contractValue: "Contract value:",
  supplierCount: "Qualified suppliers count:",
  timeAvailable: "Time available:",
  days: "days",
  monopoly: "1 (monopoly)",
  supplierMax: "20+",
  urgent: "7 days (urgent)",
  daysMax: "365 days",
  complexity: "Purchase complexity",
  supplyRisk: "Supply risk",
  strategicImportance: "Strategic importance",
  marketMaturity: "Market maturity (1=new, 5=commodity)",
  publicSector: "Public sector (Public Procurement Law / PZP)",
  innovationRequired: "Innovation required",
  findPath: "Find optimal path →",
  recommended: "Recommended procurement path",
  modelConfidence: "Ensemble agreement",
  treeVotes: "Agreeing runs (of 30)",
  typicalTime: "Typical time",
  pzpNote: "PZP note",
  rankingTitle: "All paths ranked (mean score, 30 sensitivity runs)",
  importanceTitle: "Feature importance — what decides (ablation)",
  importanceNote:
    "Change in the recommended path's score when each feature is neutralized (deterministic ablation — no randomness).",
  whenToUse: "When to use",
  risks: "Risks",
  sliderLevels: {
    1: "Very low",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Very high",
  } as Record<number, string>,
  modelNote:
    "Model: a weighted scoring function (one formula per path) — NOT a trained ML model or a real random forest. The 30 \"runs\" are a sensitivity sweep (the same rules with reweighted coefficients) that shows how stable the recommendation is, not independent learners. The weights are modeling assumptions, not parameters fitted to real procurement outcomes. Illustrative tool — not validated against real procurement data. Public-sector recommendations are hard-filtered to the lawful PZP procedures.",
  importanceUnit: "%",
  importance: "Importance",
  explanationTitle: "Why this recommendation?",
  scoringContextLabel: "Scoring context:",
  contextUpstreamLabel: "Upstream (strategic)",
  contextDownstreamLabel: "Downstream (operational)",
  scoringContextDirectUpstream: "Strong preference for flexible strategic paths (competitive dialogue / negotiations) due to high TCO leverage, relationship intensity and risk allocation needs.",
  scoringContextIndirectDownstream: "Higher tolerance for simple, transactional execution paths — lower coordination overhead and limited strategic upside from complex procedures.",
  scoringContextOther: "Context shifts the relative attractiveness of negotiation-heavy vs. execution-heavy paths and the weight of senior stakeholder time.",
  scoringContextWeightsNote: "In scoring: negotiation and dialogue paths are favoured for Direct+Upstream, while direct award and simple execution paths are down-weighted. These are hand-set modeling weights, not learned parameters.",
  theoryNote: "Path logic is grounded conceptually in procurement theory: Williamson (1985) TCE, Kraljic (1983) portfolio.",
} satisfies OptimizerShape;

export const optimizerT = { pl: optimizerPl, en: optimizerEn } as const;

const assessmentPl = {
  title: "Profil projektowania zakupów",
  subtitle: "10 pytań o sekwencyjność, kontrolę i adaptację. To samoocena, nie walidowany audyt.",
  badge: "Samoocena 2.0",
  questionOf: (n: number, total: number) => `Pytanie ${n} z ${total}`,
  never: "Nigdy",
  sometimes: "Zależy / czasem",
  always: "Tak / zawsze",
  showResult: "Pokaż wynik →",
  restart: "Zacznij od nowa",
  yourScore: "Twój wynik",
  outOf: "/ 20 pkt",
  levels: {
    pipe: {
      label: "Profil formalny",
      color: "red",
      headline: "Proces jest głównie formalny i sekwencyjny.",
      desc: "Taki profil może chronić konkurencję i audytowalność; osobno zmierz czas, wysiłek i faktyczne obejścia.",
    },
    transition: {
      label: "Profil mieszany",
      color: "amber",
      headline: "Organizacja łączy ścieżki sekwencyjne i adaptacyjne.",
      desc: "Porównuj wyniki w podobnych kategoriach i nie zakładaj, że jeden format jest zawsze lepszy.",
    },
    field: {
      label: "Profil adaptacyjny",
      color: "green",
      headline: "Proces dopuszcza dużą zdolność adaptacji.",
      desc: "Sprawdź, czy elastyczności towarzyszą skuteczna konkurencja, dokumentacja i kontrola konfliktów interesów.",
    },
  },
  ctaCalculator: "Oblicz koszty w kalkulatorze →",
  ctaResearch: "Przeczytaj artykuł naukowy →",
  questions: [
    {
      q: "Gdy dostawca proponuje szybszą metodę zakupu, kupiec może ją zaakceptować?",
      dim: "Elastyczność procesu",
      answers: ["Nigdy — tylko zatwierdzona procedura", "Tak, z dodatkowym approvalem", "Tak, jeśli spełnia kryteria polityki"],
    },
    {
      q: "Czy organizacja rozróżnia ustawowe okresy oczekiwania od własnych terminów i kolejek akceptacyjnych?",
      dim: "Źródło ograniczeń czasu",
      answers: ["Nie — wszystkie traktujemy jako obowiązkowe", "Częściowo", "Tak — każde ograniczenie ma wskazane źródło"],
    },
    {
      q: "Pod presją czasu kupcy najczęściej:",
      dim: "Zachowanie pod presją",
      answers: ["Obchodzą proces poza kontrolą (mail/telefon/Excel)", "Eskalują do przełożonego", "Wybierają udokumentowaną alternatywną ścieżkę w tej samej granicy kontroli"],
    },
    {
      q: "Jak zatwierdzane są zakupy powyżej progu uprawnień?",
      dim: "Mechanizm zatwierdzania",
      answers: ["Papierowe podpisy zbierane po kolei", "Email do kolejnych osób", "Automatyczny workflow w systemie ERP/P2P"],
    },
    {
      q: "Za co przede wszystkim oceniany jest kupiec?",
      dim: "KPI kupca",
      answers: ["Zgodność z procedurą i dokumentacją", "Oba kryteria równie ważne", "Wynik: oszczędności, czas, jakość kontraktu"],
    },
    {
      q: "Czy kontrakty mają proporcjonalne do ryzyka mechanizmy przeglądu i kontrolowanej zmiany?",
      dim: "Adaptacyjność kontraktu",
      answers: ["Nie — używamy jednego sztywnego wzorca", "Tylko w wybranych kategoriach", "Tak — mechanizmy wynikają z ryzyka i przedmiotu"],
    },
    {
      q: "Dostawcy skarżą się na złożoność procesu zakupowego?",
      dim: "Doświadczenie dostawcy",
      answers: ["Tak, regularnie", "Sporadycznie", "Rzadko — uważają nasz proces za sprawny"],
    },
    {
      q: "Kupiec może zamawiać standardowe pozycje z katalogu lub przez e-auction bez pełnej procedury?",
      dim: "Ścieżki operacyjne (downstream)",
      answers: ["Nie — każdy zakup przez tę samą procedurę", "Tylko poniżej określonego progu wartości", "Tak — mamy dedykowane ścieżki dla katalogów i MRP"],
    },
    {
      q: "System IT pokrywa cały cykl zakupowy (P2P)?",
      dim: "Poziom technologiczny",
      answers: ["Głównie Excel i email", "Częściowy ERP — sourcing lub PO, nie całość", "End-to-end: od zapotrzebowania do faktury w jednym systemie"],
    },
    {
      q: "Polityka zakupowa określa granice (co i dlaczego), nie kroki (jak i w jakiej kolejności)?",
      dim: "Model polityki vs procedury",
      answers: ["Nie — mamy procedurę krok po kroku", "Częściowo — polityka istnieje, ale procedury dominują", "Tak — polityka wyznacza granice, kupiec decyduje o ścieżce"],
    },
  ],
} as const;

type AssessmentShape = LangShape<typeof assessmentPl>;

const assessmentEn = {
  title: "Procurement Design Profile",
  subtitle: "10 questions about sequencing, control and adaptability. This is a self-assessment, not a validated audit.",
  badge: "Model 2.0 self-assessment",
  questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
  never: "Never",
  sometimes: "Sometimes / depends",
  always: "Yes / always",
  showResult: "Show result →",
  restart: "Start over",
  yourScore: "Your score",
  outOf: "/ 20 pts",
  levels: {
    pipe: {
      label: "Formal profile",
      color: "red",
      headline: "Your process is mainly formal and sequential.",
      desc: "This can protect competition and auditability; measure timing, effort and actual bypass separately.",
    },
    transition: {
      label: "Mixed profile",
      color: "amber",
      headline: "The organization combines sequential and adaptive paths.",
      desc: "Compare outcomes in similar categories and do not assume one format is always superior.",
    },
    field: {
      label: "Adaptive profile",
      color: "green",
      headline: "Your process allows substantial adaptation.",
      desc: "Verify that adaptability is paired with effective competition, documentation and conflict controls.",
    },
  },
  ctaCalculator: "Calculate costs in the calculator →",
  ctaResearch: "Read the academic paper →",
  questions: [
    {
      q: "When a supplier proposes a faster procurement method, can the buyer accept it?",
      dim: "Process flexibility",
      answers: ["Never — only the approved procedure", "Yes, with additional approval", "Yes, if it meets policy criteria"],
    },
    {
      q: "Does the organization distinguish statutory waiting periods from internal timelines and approval queues?",
      dim: "Source of timing constraints",
      answers: ["No — all are treated as mandatory", "Partly", "Yes — every constraint has a documented source"],
    },
    {
      q: "Under time pressure, buyers typically:",
      dim: "Behaviour under pressure",
      answers: ["Work outside controls (email/phone/Excel)", "Escalate to a manager", "Choose a documented alternative path within the same control boundary"],
    },
    {
      q: "How are purchases above the authorisation threshold approved?",
      dim: "Approval mechanism",
      answers: ["Paper signatures collected sequentially", "Email chain to successive approvers", "Automated ERP/P2P workflow"],
    },
    {
      q: "What is the buyer primarily evaluated on?",
      dim: "Buyer KPIs",
      answers: ["Procedural compliance and documentation", "Both criteria equally", "Outcomes: savings, lead time, contract quality"],
    },
    {
      q: "Do contracts include risk-proportionate review and controlled-change mechanisms?",
      dim: "Contract adaptability",
      answers: ["No — one rigid template is used", "Only in selected categories", "Yes — mechanisms follow risk and subject matter"],
    },
    {
      q: "Do suppliers complain about the complexity of your procurement process?",
      dim: "Supplier experience",
      answers: ["Yes, regularly", "Occasionally", "Rarely — they find our process efficient"],
    },
    {
      q: "Can the buyer order standard items from a catalog or via e-auction without a full procedure?",
      dim: "Operational paths (downstream)",
      answers: ["No — every purchase goes through the same procedure", "Only below a certain value threshold", "Yes — we have dedicated paths for catalogs and MRP"],
    },
    {
      q: "Does the IT system cover the full procurement cycle (P2P)?",
      dim: "Technology level",
      answers: ["Mainly Excel and email", "Partial ERP — sourcing or PO, not both", "End-to-end: from requisition to invoice in one system"],
    },
    {
      q: "Does the procurement policy define boundaries (what & why), not steps (how & in what order)?",
      dim: "Policy vs procedure model",
      answers: ["No — we have a step-by-step procedure", "Partially — policy exists but procedures dominate", "Yes — policy sets boundaries, buyer decides the path"],
    },
  ],
} satisfies AssessmentShape;

export const assessmentT = { pl: assessmentPl, en: assessmentEn } as const;

const dimensionMultiplierLabelsPl = {
  tco: "Dźwignia TCO",
  delay: "Koszt opóźnienia",
  productivity: "Wpływ na jakość wyboru dostawcy",
  bypass: "Ryzyko obejścia",
  renegotiation: "Ryzyko renegocjacji",
  coordination: "Intensywność koordynacji",
} as const;

type DimensionMultiplierLabelsShape = LangShape<typeof dimensionMultiplierLabelsPl>;

const dimensionMultiplierLabelsEn = {
  tco: "TCO leverage",
  delay: "Delay penalty",
  productivity: "Supplier selection-quality impact",
  bypass: "Bypass risk",
  renegotiation: "Renegotiation exposure",
  coordination: "Coordination overhead",
} satisfies DimensionMultiplierLabelsShape;

export const dimensionMultiplierLabelsT = {
  pl: dimensionMultiplierLabelsPl,
  en: dimensionMultiplierLabelsEn,
} as const;
