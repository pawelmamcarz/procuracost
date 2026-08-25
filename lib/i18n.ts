import { MODEL_VERSION } from "./version";
import type { DecisionMapRowId } from "./decision-map";

export type Lang = "pl" | "en";

// Enforces that a translation object for one language has exactly the same
// key structure (and function signatures) as the other, a key added to
// only one language surfaces as a compile error instead of a silent
// `undefined` at runtime.
type LangShape<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends object
  ? { [K in keyof T]: LangShape<T[K]> }
  : string;

const calculatorPl = {
  scenarioLabel: "Scenariusz zakupowy",
  contractValue: "Bazowa wartość zakupu (PLN)",
  dailyCostOfInaction: "Dzienny koszt zaniechania (PLN/dzień)",
  dailyCostOfInactionTooltip:
    "Wartość tracona każdego dnia bez podpisanego kontraktu: zatrzymana produkcja, nieosiągalny przychód, koszt alternatywny.",
  renegotiationCost: "Koszt jednego formalnego aneksu (PLN)",
  contractDuration: "Czas trwania kontraktu (lata)",
  discountRate: "Stopa dyskontowa (% rocznie)",
  discountRateTooltip:
    "Realna roczna stopa dyskontowa dla przepływów cyklu życia (aneksy, TCO). Model sprowadza je do wartości bieżącej na moment udzielenia zamówienia. To jedyna baza czasowa całego rachunku. Domyślne 4% to realna finansowa stopa dyskontowa z wytycznych MFiPR 2021–2027 (stopa społeczna w tych samych wytycznych to 3%, właściwa dla oceny projektów publicznych). Jawne założenie, nie oszacowanie. Wpisanie 0 odtwarza niedyskontowany model 2.1.",
  bypassExposure: "Ryzyko audytowe przy obejściu (PLN)",
  bypassTooltip:
    "Szacowany koszt audytu, kary regulacyjne lub reputacyjne jeśli nieformalne obejście procedury zostanie odkryte. Wartość podaje użytkownik. Lipsky (1980) i Vaughan (1996) uzasadniają sam mechanizm obejścia, ale nie dostarczają ani jego kosztu, ani częstości.",
  tcoHorizon: "Horyzont TCO (lata)",
  tcoHorizonTooltip:
    "Jawny stres-test skaluje pulę TCO liniowo do 3 lat i nie zwiększa jej powyżej tego horyzontu. W scenariuszu centralnym pula TCO wynosi 0%.",
  // Process type section
  processTypeLabel: "Typ procesu zakupowego",
  processCategoryLabels: {
    strategic: "Zakupy strategiczne: dobór dostawcy, negocjacje, CAPEX",
    operational: "Zakupy operacyjne: realizacja na bazie kontraktu",
    strategic_pzp: "Zakupy strategiczne PZP: tryby ustawowe",
  },
  operationalCategoryNote: "Zakupy operacyjne działają na pre-negocjowanych kontraktach (dostawca i cena są już ustalone). Model kosztów porównuje tu ręczną realizację z automatyzacją ERP/Ariba Guided Buying, nie wybór procedury przetargowej.",
  strategicPzpCategoryNote: "Strategiczne PZP pokazujemy osobno, bo wybór ścieżki ograniczają progi, terminy i przesłanki ustawowe. Porównanie obejmuje wyłącznie dopuszczalne warianty w tej samej granicy prawa.",
  processTypes: {
    pzp_eu: "Strategiczne PZP: przetarg UE",
    pzp_krajowy: "Strategiczne PZP: postępowanie krajowe",
    private_formal: "Strategiczny przetarg prywatny (RFQ/RFP)",
    policy_only: "Strategiczna ścieżka adaptacyjna i zgodna",
    discovery: "Strategiczny zakup odkrywczy (wymaganie nieznane)",
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
  contractValue: "Baseline purchase value (PLN)",
  dailyCostOfInaction: "Daily cost of inaction (PLN/day)",
  dailyCostOfInactionTooltip:
    "Value lost every day without a signed contract: halted production, unrealised revenue, opportunity cost.",
  renegotiationCost: "Cost per formal amendment (PLN)",
  contractDuration: "Contract duration (years)",
  discountRate: "Discount rate (% per year)",
  discountRateTooltip:
    "Real annual discount rate for lifecycle flows (amendments, TCO). The model brings them to present value at award. This is the single time base for the whole calculation. The 4% default is the real financial discount rate from the Polish MFiPR 2021–2027 appraisal guidelines (the social rate in the same guidelines is 3%, appropriate for public-appraisal use). A declared assumption, not an estimate. Entering 0 reproduces the undiscounted 2.1 model.",
  bypassExposure: "Audit exposure on bypass (PLN)",
  bypassTooltip:
    "Estimated audit cost, regulatory or reputational penalties if an informal procedure bypass is discovered. User-supplied. Lipsky (1980) and Vaughan (1996) motivate the bypass mechanism; neither supplies its cost or its rate.",
  tcoHorizon: "TCO horizon (years)",
  tcoHorizonTooltip:
    "The declared stress test scales the TCO pool linearly up to 3 years and does not increase it beyond that horizon. The central TCO pool is 0%.",
  processTypeLabel: "Procurement process type",
  processCategoryLabels: {
    strategic: "Strategic procurement: supplier selection, negotiation, CAPEX",
    operational: "Operational procurement: execution against contract",
    strategic_pzp: "Strategic PZP procurement: statutory procedures",
  },
  operationalCategoryNote: "Operational procurement runs against pre-negotiated contracts (supplier and price are already set). The cost model compares manual execution against ERP/Ariba Guided Buying automation, not competing tender approaches.",
  strategicPzpCategoryNote: "Strategic PZP is shown separately because path choice is constrained by statutory thresholds, timelines and grounds. Comparisons include only variants inside the same legal boundary.",
  processTypes: {
    pzp_eu: "Strategic PZP: EU open tender",
    pzp_krajowy: "Strategic PZP: national procedure",
    private_formal: "Strategic private tender (RFQ/RFP)",
    policy_only: "Strategic adaptive and compliant path",
    discovery: "Strategic discovery purchase (requirement unknown)",
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

// Canonical ∂Φ boundary set (CLAUDE_DESIGN.md), single source of truth; use verbatim everywhere.
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
    renegotiationCost: "Formalne aneksy",
    tcoCost: "Utracone oszczędności TCO",
    bypassCost: "Ekspozycja na obejścia",
  },
  deltaHeadline: "Różnica kosztów: formalny − adaptacyjny",
  higherThan: "więcej dla ścieżki formalnej niż adaptacyjnej",
  lowerThan: "mniej dla ścieżki formalnej niż adaptacyjnej",
  modelAdjustContext: "model dostosowany do kontekstu",
  modelAdjustTitle: "Zastosowane korekty modelu:",
  modelAdjustDirectTco: "Szeroka korekta nakładu pracy Direct: ×1,10 (założenie)",
  modelAdjustUpstreamBypass: "Nakład pracy i koordynacja Upstream: ×1,15 (założenie)",
  modelAdjustDownstreamProd: "Nakład pracy ×0,90 i koordynacja Downstream ×0,85 (założenie)",
  modelAdjustStrongest: "Łączna korekta pracy Direct × Upstream: ×1,265",
  axisEvidence: "Oś dowodowa (5 skalarów z literatury)",
  axisStructural: "Oś strukturalna (koszt dnia ×0,25…×4, czasy etapów ×0,7…×1,3)",
  axisNoteStructural:
    "Szerokość przedziału niesie oś strukturalna, nie dowodowa. To znaczy, że o wyniku decydują Twoje założenia o koszcie dnia i o czasach etapów, a nie parametry z badań. Terminy ustawowe PZP pozostają nienaruszone w obu osiach.",
  axisNoteEvidence:
    "Szerokość przedziału niesie oś dowodowa. Terminy ustawowe PZP pozostają nienaruszone w obu osiach.",
  decompositionTitle: "Z czego składa się ta różnica",
  decompositionProcess: "Proces (praca, administracja, selekcja, obejścia)",
  decompositionDelay: "Opóźnienie (dni × Twój koszt dnia)",
  decompositionLifecycle: "Cykl życia (aneksy, TCO)",
  decompositionNote:
    "Kubełek opóźnienia to iloczyn różnicy dni z szablonu i ceny dnia, którą podałeś. To tożsamość rachunkowa, nie wynik modelowania. Czytaj go osobno od pozostałych dwóch.",
  breakEvenLabel: "Próg kosztu dnia bezczynności",
  breakEvenAboveZero:
    "Powyżej tego dziennego kosztu bezczynności niższy modelowany koszt ma ścieżka adaptacyjna.",
  breakEvenAboveZeroFormalFaster:
    "Powyżej tego dziennego kosztu bezczynności niższy modelowany koszt ma ścieżka formalna, ponieważ w tym profilu jest szybsza.",
  breakEvenGeneral:
    "Próg równowagi pokazuje dzienny koszt bezczynności, przy którym zmienia się wynik centralny. Powyżej progu niższy modelowany koszt ma ścieżka szybsza w wybranym profilu, nie zawsze adaptacyjna.",
  breakEvenFormalLoses:
    "ścieżka formalna kosztuje więcej już przy zerowym koszcie zwłoki. Kanał opóźnienia nie jest potrzebny do tego wyniku.",
  breakEvenAdaptiveLoses:
    "ścieżka adaptacyjna kosztuje więcej już przy zerowym koszcie zwłoki.",
  breakEvenNoDayDifference:
    "obie ścieżki trwają tyle samo, więc próg nie istnieje. O wyniku decydują wyłącznie koszty procesu i cyklu życia.",
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
  stepsTitle: "Kroki procesu: skąd wynika czas?",
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
  matrixContextDetail: "jawne, szerokie korekty nakładu pracy i koordynacji; czas kroków i dzienny koszt bezczynności nie mają ukrytej korekty kontekstowej.",
  matrixNoContextNote: "Macierz pokazuje wszystkie kombinacje technologii × trybu procesu dla wybranego typu zakupu.",
  matrixColorLegend: "Gradient kolorów: zielony = najniższy koszt, czerwony = najwyższy. Wiersz podświetlony = aktualne ustawienie. Wartości uwzględniają efekty Spend Type × Process Phase.",
  appliedMultipliersTitle: "Zastosowane mnożniki kontekstu",
  appliedMultipliersNote: "Model 2.1 stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.",
  // Sub-breakdown
  staffCost: "Kadra (godziny × stawki)",
  coordCost: "Narzut administracyjny (bez pracy ról)",
  toolCost: "Licencja narzędzia",
  pipeFieldTitle: "Dlaczego ta różnica istnieje? Model tunelu i pola.",
  pipeLabel: "Ścieżka formalna = topologia tunelu",
  pipeDesc:
    "Ścieżka formalna porządkuje konkurencję i ogranicza dyskrecję, ale może też sekwencjonować pracę: a₁ → a₂ → ... → aₙ. Obejście jest możliwym ryzykiem do zmierzenia, nie automatycznym skutkiem procedury.",
  fieldLabel: "Ścieżka adaptacyjna = topologia pola",
  fieldDesc:
    "Ścieżka adaptacyjna działa w tej samej granicy uprawnień, konkurencji, etyki i dokumentacji. Może przyspieszać iteracje, lecz słaba konkurencja lub kontrola może odwrócić jej przewagę.",
  pipeFieldSource: "Źródło modelu: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger; Holmström & Milgrom (1991) Multitask Principal-Agent",
  radarTitle: "Profil kosztów: 6 wymiarów (znormalizowane)",
  radarSubtitle: "Każda oś pokazuje koszt w danym wymiarze jako % wartości wyższej (100 = max). Mniejsza powierzchnia = niższy koszt.",
  sensitivityTitle: "Wrażliwość: koszty vs. wartość kontraktu",
  sensitivitySubtitle: "Jak zmieniają się koszty całkowite przy zmianie wartości kontraktu. Pozostałe parametry stałe.",
  sensitivityCostGapLabel: "Różnica",
  sensitivityFooterNote: "Niebieska przerywana = różnica kosztów (formalny − adaptacyjny). Aktualny scenariusz przy 100% (wartość kontraktu 1×).",
  benchmarkTitle: "Twój scenariusz na tle przypadków referencyjnych",
  benchmarkSubtitle: "Różnica formalny − adaptacyjny (% kosztu ścieżki adaptacyjnej)",
  benchmarkYours: "Twój scenariusz",
  benchmarkSummary: (pct: number, rank: number, total: number) =>
    `Różnica w Twoim scenariuszu wynosi ${pct}%. Jest wyższa niż w ${rank} z ${total} przypadków referencyjnych.`,
} as const;

type ComparisonShape = LangShape<typeof comparisonPl>;

const comparisonEn = {
  costLabels: {
    timeCost: "Time cost (staff)",
    adminCost: "Admin overhead (coordination + tool)",
    opportunityCost: "Opportunity cost",
    productivityCost: "Selection-quality cost (discretion)",
    renegotiationCost: "Formal amendments",
    tcoCost: "Foregone TCO savings",
    bypassCost: "Bypass exposure",
  },
  deltaHeadline: "Cost difference: formal − adaptive",
  higherThan: "more for the formal path than the adaptive path",
  lowerThan: "less for the formal path than the adaptive path",
  modelAdjustContext: "model adjusted for context",
  modelAdjustTitle: "Model adjustments applied:",
  modelAdjustDirectTco: "Broad Direct staff-effort factor: ×1.10 (assumption)",
  modelAdjustUpstreamBypass: "Upstream staff effort and coordination: ×1.15 (assumption)",
  modelAdjustDownstreamProd: "Downstream staff effort ×0.90 and coordination ×0.85 (assumption)",
  modelAdjustStrongest: "Combined Direct × Upstream staff factor: ×1.265",
  axisEvidence: "Evidence axis (5 literature scalars)",
  axisStructural: "Structural axis (daily cost ×0.25…×4, step durations ×0.7…×1.3)",
  axisNoteStructural:
    "The width comes from the structural axis, not the evidence one. Your assumptions about the cost of a day and about step durations decide this result, not the parameters taken from research. Statutory PZP waits are invariant under both axes.",
  axisNoteEvidence:
    "The width comes from the evidence axis. Statutory PZP waits are invariant under both axes.",
  decompositionTitle: "What this difference is made of",
  decompositionProcess: "Process (staff, admin, selection, bypass)",
  decompositionDelay: "Delay (days × your daily cost)",
  decompositionLifecycle: "Lifecycle (amendments, TCO)",
  decompositionNote:
    "The delay bucket is the template day difference multiplied by the daily cost you supplied. It is an accounting identity, not a modeled result. Read it separately from the other two.",
  breakEvenLabel: "Break-even daily cost of inaction",
  breakEvenAboveZero:
    "Above this daily inaction cost, the adaptive path has the lower modeled total.",
  breakEvenAboveZeroFormalFaster:
    "Above this daily inaction cost, the formal path has the lower modeled total because it is faster in this profile.",
  breakEvenGeneral:
    "The break-even threshold is the daily inaction cost at which the central result changes sign. Above it, the faster path in the selected profile has the lower modeled total, and that path is not always adaptive.",
  breakEvenFormalLoses:
    "the formal path already costs more at zero delay cost. The delay channel is not needed for this result.",
  breakEvenAdaptiveLoses:
    "the adaptive path already costs more at zero delay cost.",
  breakEvenNoDayDifference:
    "both paths take the same time, so no threshold exists. Process and lifecycle costs decide the result on their own.",
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
  stepsTitle: "Process steps: why does it take this long?",
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
  matrixContextDetail: "explicit broad staff-effort and coordination factors; step timing and daily inaction cost have no hidden context adjustment.",
  matrixNoContextNote: "Matrix shows all technology × process mode combinations for the selected procurement type.",
  matrixColorLegend: "Color gradient: green = lowest cost, red = highest. Row highlighted = current selection. Numbers already incorporate Spend Type × Process Phase effects.",
  appliedMultipliersTitle: "Applied context multipliers",
  appliedMultipliersNote: "Model 2.1 applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.",
  staffCost: "Staff (hours × rates)",
  coordCost: "Administrative overhead (excluding role labor)",
  toolCost: "Tool license",
  pipeFieldTitle: "Why does this gap exist? The Tunnel and Field model.",
  pipeLabel: "Formal path = tunnel topology",
  pipeDesc:
    "The formal path structures competition and limits discretion, but may sequence work as a₁ → a₂ → ... → aₙ. Bypass is a risk to measure, not an automatic consequence of procedure.",
  fieldLabel: "Adaptive path = field topology",
  fieldDesc:
    "The adaptive path operates within the same authorisation, competition, ethics and documentation boundary. It can speed iteration, but weak competition or control can reverse its advantage.",
  pipeFieldSource: "Model sources: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger; Holmström & Milgrom (1991) Multitask Principal-Agent",
  radarTitle: "Cost profile: 6 dimensions (normalized)",
  radarSubtitle: "Each axis shows the cost in that dimension as a % of the higher value (100 = maximum). Smaller area = lower cost.",
  sensitivityTitle: "Sensitivity: cost vs. contract value",
  sensitivitySubtitle: "How total costs change as contract value varies. All other parameters fixed.",
  sensitivityCostGapLabel: "Cost gap",
  sensitivityFooterNote: "Blue dashed line = cost difference (formal − adaptive). Current scenario marked at 100% (contract value 1×).",
  benchmarkTitle: "Your scenario vs reference cases",
  benchmarkSubtitle: "Formal − adaptive cost difference (% of adaptive-path cost)",
  benchmarkYours: "Your scenario",
  benchmarkSummary: (pct: number, rank: number, total: number) =>
    `Your scenario difference is ${pct}%, higher than ${rank} of ${total} reference cases.`,
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
  modelConfidence: "Stabilność wag",
  treeVotes: "Zgodne przebiegi (z 30)",
  singleCandidateLabel: "Zbiór wyboru",
  singleCandidateValue: "Jedyny tryb bez dodatkowych przesłanek",
  outsidePzpLabel: "Ścieżka organizacyjna: poza reżimem PZP",
  outOfScopeTitle: "Poza zakresem narzędzia",
  withheldTitle: "Tryby pominięte przez filtr",
  withheldBody:
    "Filtr ogranicza się do trybów dostępnych bez odrębnej oceny przesłanek ustawowych. Poniższe tryby mogą być w Twojej sprawie zgodne z prawem, ale wymagają oceny przesłanek, których ten formularz nie zbiera. Brak trybu na liście rekomendacji nie oznacza, że jest niedopuszczalny.",
  typicalTime: "Typowy czas",
  pzpNote: "Nota PZP",
  rankingTitle: "Ranking ścieżek (wspólne kryteria, 30 przebiegów wrażliwości wag)",
  importanceTitle: "Ważność kryteriów: co zmienia ranking",
  importanceNote:
    "Zmiana marginesu lidera nad najlepszą alternatywą po ustawieniu kryterium na wartość neutralną (ablacja deterministyczna).",
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
    "Model: każda ścieżka jest oceniana na tych samych kryteriach i wspólnym mianowniku. NIE jest to ML ani prognoza wyniku zamówienia. 30 przebiegów zmienia wszystkie wagi o ±25% i pokazuje lokalną stabilność rankingu. Wagi i profile dopasowania są jawnymi założeniami, nie parametrami uczonymi. Narzędzie ilustracyjne, niewalidowane na realnych danych; rekomendacje publiczne są twardo filtrowane do dopuszczalnych trybów PZP.",
  importanceUnit: "%",
  importance: "Ważność",
  explanationTitle: "Dlaczego ta rekomendacja?",
  scoringContextLabel: "Kontekst scoringu:",
  contextUpstreamLabel: "Upstream (strategiczny)",
  contextDownstreamLabel: "Downstream (operacyjny)",
  scoringContextDirectUpstream: "Profil Direct × Upstream zwiększa dopasowanie ścieżek przeznaczonych dla złożonych i strategicznych zakupów; nadal konkurują one na tych samych kryteriach.",
  scoringContextIndirectDownstream: "Profil Indirect × Downstream zwiększa dopasowanie prostszych ścieżek wykonawczych, jeśli pozwalają na to sektor i progi prawne.",
  scoringContextOther: "Rodzaj wydatku i faza procesu są dwoma z jedenastu wspólnych kryteriów dopasowania.",
  scoringContextWeightsNote: "Każde kryterium ma tę samą wagę bazową; analiza wrażliwości zmienia wszystkie wagi o ±25%. Profile dopasowania są ręcznie zdefiniowane i niewalidowane empirycznie.",
  theoryNote: "Kryteria ryzyka dostaw i znaczenia strategicznego nawiązują koncepcyjnie do macierzy portfelowej Kraljica (1983, Harvard Business Review 61(5), 109–117). Wagi i profile są autorskimi założeniami, nie wynikiem estymacji.",
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
  modelConfidence: "Weight stability",
  treeVotes: "Agreeing runs (of 30)",
  singleCandidateLabel: "Choice set",
  singleCandidateValue: "Only procedure available without additional grounds",
  outsidePzpLabel: "Organisational path: outside the PZP regime",
  outOfScopeTitle: "Outside this tool's scope",
  withheldTitle: "Procedures withheld by the filter",
  withheldBody:
    "The filter is limited to procedures available without a separate assessment of statutory grounds. The procedures below may well be lawful in your case, but they require grounds this form does not collect. Absence from the ranking does not mean a procedure is unavailable to you.",
  typicalTime: "Typical time",
  pzpNote: "PZP note",
  rankingTitle: "All paths ranked (common criteria, 30 weight-sensitivity runs)",
  importanceTitle: "Criterion importance: what changes the ranking",
  importanceNote:
    "Change in the leader's margin over the best alternative when a criterion is set to its neutral value (deterministic ablation).",
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
    "Model: every path is evaluated on the same criteria and denominator. This is NOT ML or an outcome prediction. The 30 runs vary all weights by ±25% and show local ranking stability. Weights and suitability profiles are explicit assumptions, not learned parameters. The tool is illustrative and unvalidated on real procurement data; public recommendations are hard-filtered to lawful PZP procedures.",
  importanceUnit: "%",
  importance: "Importance",
  explanationTitle: "Why this recommendation?",
  scoringContextLabel: "Scoring context:",
  contextUpstreamLabel: "Upstream (strategic)",
  contextDownstreamLabel: "Downstream (operational)",
  scoringContextDirectUpstream: "Direct × Upstream increases the fit of paths designed for complex strategic purchases; they still compete on the same criteria.",
  scoringContextIndirectDownstream: "Indirect × Downstream increases the fit of simpler execution paths where sector and legal thresholds allow them.",
  scoringContextOther: "Spend type and process phase are two of eleven common suitability criteria.",
  scoringContextWeightsNote: "Every criterion has the same baseline weight; sensitivity runs vary all weights by ±25%. Suitability profiles are hand-authored and empirically unvalidated.",
  theoryNote: "The supply-risk and strategic-importance criteria refer conceptually to Kraljic's portfolio matrix (1983, Harvard Business Review 61(5), 109–117). The weights and profiles are authored assumptions, not estimated parameters.",
} satisfies OptimizerShape;

export const optimizerT = { pl: optimizerPl, en: optimizerEn } as const;

const assessmentPl = {
  title: "Profil projektowania zakupów",
  subtitle: "10 pytań o sekwencyjność, kontrolę i adaptację. To samoocena, nie walidowany audyt.",
  badge: `Samoocena ${MODEL_VERSION}`,
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
      answers: ["Nigdy: tylko zatwierdzona procedura", "Tak, z dodatkowym approvalem", "Tak, jeśli spełnia kryteria polityki"],
    },
    {
      q: "Czy organizacja rozróżnia ustawowe okresy oczekiwania od własnych terminów i kolejek akceptacyjnych?",
      dim: "Źródło ograniczeń czasu",
      answers: ["Nie: wszystkie traktujemy jako obowiązkowe", "Częściowo", "Tak: każde ograniczenie ma wskazane źródło"],
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
      answers: ["Nie: używamy jednego sztywnego wzorca", "Tylko w wybranych kategoriach", "Tak: mechanizmy wynikają z ryzyka i przedmiotu"],
    },
    {
      q: "Dostawcy skarżą się na złożoność procesu zakupowego?",
      dim: "Doświadczenie dostawcy",
      answers: ["Tak, regularnie", "Sporadycznie", "Rzadko: uważają nasz proces za sprawny"],
    },
    {
      q: "Kupiec może zamawiać standardowe pozycje z katalogu lub przez e-auction bez pełnej procedury?",
      dim: "Ścieżki operacyjne (downstream)",
      answers: ["Nie: każdy zakup przez tę samą procedurę", "Tylko poniżej określonego progu wartości", "Tak: mamy dedykowane ścieżki dla katalogów i MRP"],
    },
    {
      q: "System IT pokrywa cały cykl zakupowy (P2P)?",
      dim: "Poziom technologiczny",
      answers: ["Głównie Excel i email", "Częściowy ERP: sourcing lub PO, nie całość", "End-to-end: od zapotrzebowania do faktury w jednym systemie"],
    },
    {
      q: "Polityka zakupowa określa granice (co i dlaczego), nie kroki (jak i w jakiej kolejności)?",
      dim: "Model polityki vs procedury",
      answers: ["Nie: mamy procedurę krok po kroku", "Częściowo: polityka istnieje, ale procedury dominują", "Tak: polityka wyznacza granice, kupiec decyduje o ścieżce"],
    },
  ],
} as const;

type AssessmentShape = LangShape<typeof assessmentPl>;

const assessmentEn = {
  title: "Procurement Design Profile",
  subtitle: "10 questions about sequencing, control and adaptability. This is a self-assessment, not a validated audit.",
  badge: `Model ${MODEL_VERSION} self-assessment`,
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
      answers: ["Never: only the approved procedure", "Yes, with additional approval", "Yes, if it meets policy criteria"],
    },
    {
      q: "Does the organization distinguish statutory waiting periods from internal timelines and approval queues?",
      dim: "Source of timing constraints",
      answers: ["No: all are treated as mandatory", "Partly", "Yes: every constraint has a documented source"],
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
      answers: ["No: one rigid template is used", "Only in selected categories", "Yes: mechanisms follow risk and subject matter"],
    },
    {
      q: "Do suppliers complain about the complexity of your procurement process?",
      dim: "Supplier experience",
      answers: ["Yes, regularly", "Occasionally", "Rarely: they find our process efficient"],
    },
    {
      q: "Can the buyer order standard items from a catalog or via e-auction without a full procedure?",
      dim: "Operational paths (downstream)",
      answers: ["No: every purchase goes through the same procedure", "Only below a certain value threshold", "Yes: we have dedicated paths for catalogs and MRP"],
    },
    {
      q: "Does the IT system cover the full procurement cycle (P2P)?",
      dim: "Technology level",
      answers: ["Mainly Excel and email", "Partial ERP: sourcing or PO, not both", "End-to-end: from requisition to invoice in one system"],
    },
    {
      q: "Does the procurement policy define boundaries (what & why), not steps (how & in what order)?",
      dim: "Policy vs procedure model",
      answers: ["No: we have a step-by-step procedure", "Partially: policy exists but procedures dominate", "Yes: policy sets boundaries, buyer decides the path"],
    },
  ],
} satisfies AssessmentShape;

export const assessmentT = { pl: assessmentPl, en: assessmentEn } as const;

const shortcastsPl = {
  metadataTitle: (version: string) => `ProcuraCost ${version}: krótkie materiały metodologiczne`,
  metadataDescription: (version: string) =>
    `Planowana, ograniczona źródłowo seria o założeniach i niepewności modelu ProcuraCost ${version}.`,
  badge: (version: string) => `Model ${version} · plan redakcyjny`,
  title: "ProcuraCost: źródła i założenia",
  intro:
    "Planowana seria redakcyjna oddziela ustalenia źródłowe od kalibracji modelowej. Nie przedstawia wyników ProcuraCost jako zmierzonych efektów organizacyjnych.",
  publishedMaterials: "Opublikowane materiały",
  plannedTopics: "Planowane tematy",
  focusLabel: "Temat",
} as const;

type ShortcastsShape = LangShape<typeof shortcastsPl>;

const shortcastsEn = {
  metadataTitle: (version: string) => `ProcuraCost ${version}: methodology shorts`,
  metadataDescription: (version: string) =>
    `A planned, source-bounded editorial series about assumptions and uncertainty in the ProcuraCost ${version} model.`,
  badge: (version: string) => `Model ${version} · editorial plan`,
  title: "ProcuraCost: evidence and assumptions",
  intro:
    "This planned editorial series separates source evidence from model calibration. It does not present ProcuraCost outputs as measured organizational effects.",
  publishedMaterials: "Published materials",
  plannedTopics: "Planned topics",
  focusLabel: "Focus",
} satisfies ShortcastsShape;

export const shortcastsT = { pl: shortcastsPl, en: shortcastsEn } as const;

const decisionMapPl = {
  eyebrow: "Kiedy tunel, kiedy pole: mapa progów",
  description:
    "Oś pozioma pokazuje podany koszt dnia bezczynności. Każdy pas wskazuje, czy pełny zakres niepewności daje odporny wynik, czy o wyborze ścieżki decydują założenia.",
  legend: {
    formal: "formalna wygrywa odpornie",
    undecided: "decydują założenia",
    adaptive: "adaptacyjna wygrywa odpornie",
    central: "próg centralny",
  },
  ariaLabel: "Mapa progów decyzyjnych według kategorii zakupu",
  axisLabel: "PLN / dzień bezczynności →",
  contractValue: (value: string) => `CV ${value}`,
  dayDifference: (value: number) =>
    `Δ ${value > 0 ? "+" : ""}${value.toFixed(0)} ${Math.abs(value) === 1 ? "dzień" : "dni"}`,
  rows: {
    pzpEu: "PZP: przetarg UE",
    pzpEuLarge: "PZP: przetarg UE (duży)",
    pzpNational: "PZP: tryb podstawowy",
    privateFormal: "Przetarg prywatny (RFP)",
    capex: "Inwestycja CAPEX",
    discovery: "Zakup odkrywczy",
    policyOnly: "Ścieżka adaptacyjna",
    catalog: "Zamówienie z katalogu",
    mrp: "Zlecenie MRP",
  } satisfies Record<DecisionMapRowId, string>,
  note:
    "Wejścia porównawcze: technologia partial ERP, kontrakt dwuletni, koszt aneksu 4% CV i ekspozycja 10% CV. Pas „decydują założenia” łączy niepewność dowodową i założenia strukturalne, w tym koszt dnia bezczynności oraz czasy etapów. Nie jest przedziałem ufności.",
} as const;

type DecisionMapShape = LangShape<typeof decisionMapPl>;

const decisionMapEn = {
  eyebrow: "When tunnel, when field: threshold map",
  description:
    "The horizontal axis shows the supplied daily cost of inaction. Each band indicates whether the full uncertainty range gives a robust result or assumptions determine the path choice.",
  legend: {
    formal: "formal wins robustly",
    undecided: "assumptions decide",
    adaptive: "adaptive wins robustly",
    central: "central threshold",
  },
  ariaLabel: "Decision-threshold map by purchase category",
  axisLabel: "PLN / day of inaction →",
  contractValue: (value: string) => `CV ${value}`,
  dayDifference: (value: number) =>
    `Δ ${value > 0 ? "+" : ""}${value.toFixed(0)} ${Math.abs(value) === 1 ? "day" : "days"}`,
  rows: {
    pzpEu: "PZP: EU tender",
    pzpEuLarge: "PZP: EU tender (large)",
    pzpNational: "PZP: national basic mode",
    privateFormal: "Private tender (RFP)",
    capex: "CAPEX investment",
    discovery: "Discovery purchase",
    policyOnly: "Adaptive path",
    catalog: "Catalog order",
    mrp: "MRP order",
  } satisfies Record<DecisionMapRowId, string>,
  note:
    "Comparator inputs: partial-ERP technology, a two-year contract, amendment cost at 4% of CV, and exposure at 10% of CV. The “assumptions decide” band combines evidence uncertainty with structural assumptions, including the daily cost of inaction and step durations. It is not a confidence interval.",
} satisfies DecisionMapShape;

export const decisionMapT = { pl: decisionMapPl, en: decisionMapEn } as const;

const dimensionMultiplierLabelsPl = {
  staff: "Nakład pracy ról",
  tco: "Dźwignia TCO",
  delay: "Koszt opóźnienia",
  productivity: "Wpływ na jakość wyboru dostawcy",
  bypass: "Ryzyko obejścia",
  renegotiation: "Częstość formalnych aneksów",
  coordination: "Intensywność koordynacji",
} as const;

type DimensionMultiplierLabelsShape = LangShape<typeof dimensionMultiplierLabelsPl>;

const dimensionMultiplierLabelsEn = {
  staff: "Role effort",
  tco: "TCO leverage",
  delay: "Delay penalty",
  productivity: "Supplier selection-quality impact",
  bypass: "Bypass risk",
  renegotiation: "Formal-amendment frequency",
  coordination: "Coordination overhead",
} satisfies DimensionMultiplierLabelsShape;

export const dimensionMultiplierLabelsT = {
  pl: dimensionMultiplierLabelsPl,
  en: dimensionMultiplierLabelsEn,
} as const;

const navigationPl = {
  calculator: "Kalkulator",
  optimizer: "Optymalizator",
  caseStudies: "Scenariusze",
  assessment: "Ocena dojrzałości",
  team: "Zespół",
  research: "Research paper",
  researchAgenda: "Agenda",
  methodology: "Methodology",
  model: "Model",
  languageSwitch: "EN",
  primaryNavigation: "Nawigacja główna",
  openMenu: "Otwórz menu",
  closeMenu: "Zamknij menu",
} as const;

type NavigationShape = LangShape<typeof navigationPl>;

const navigationEn = {
  calculator: "Calculator",
  optimizer: "Optimizer",
  caseStudies: "Scenarios",
  assessment: "Maturity Assessment",
  team: "Team",
  research: "Research paper",
  researchAgenda: "Agenda",
  methodology: "Methodology",
  model: "Model",
  languageSwitch: "PL",
  primaryNavigation: "Primary navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
} satisfies NavigationShape;

export const navigationT = { pl: navigationPl, en: navigationEn } as const;
export type NavigationLabelKey = keyof typeof navigationPl;
