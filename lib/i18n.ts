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
  calculate: "Porównaj koszty",
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
  calculate: "Compare costs",
  derivedNote: "Duration and administrative costs are derived from the process template and technology level.",
} satisfies CalculatorShape;

export const calculatorT = { pl: calculatorPl, en: calculatorEn } as const;

// Canonical ∂Φ boundary set (CLAUDE_DESIGN.md), single source of truth; use verbatim everywhere.
export const PHI_SET = {
  pl: "∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}",
  en: "∂Φ = {auth, competition, ethics, docs}",
} as const;

const homePl = {
  hero: {
    eyebrow: "Model decyzji zakupowych",
    title: "Porównaj koszt dwóch dopuszczalnych ścieżek zakupu.",
    tagline: "Tunel ma ściany. Pole ma horyzont.",
    description:
      "Wprowadź parametry realnego zakupu. Model zestawi ścieżkę formalną i adaptacyjną, pokaże składniki kosztu oraz pełny zakres niepewności.",
    primaryAction: "Policz własny scenariusz",
    secondaryAction: "Jak czytać wynik",
  },
  boundary: {
    eyebrow: "Granica decyzji",
    title: "Dwie ścieżki. Ta sama granica zgodności.",
    tunnelLabel: "Tunel",
    tunnelDescription: "Sekwencyjna procedura",
    boundaryLabel: "Granica dopuszczalności",
    notation: PHI_SET.pl,
    fieldLabel: "Pole dopuszczalne",
    fieldDescription: "Adaptacja w jawnych granicach",
    caption:
      "Pole nie oznacza dowolności. Obie ścieżki pozostają we wspólnej granicy uprawnień, konkurencji, etyki i dokumentacji.",
  },
  modelContract: {
    eyebrow: "Kontrakt modelu",
    title: "Co wynik mówi, a czego nie rozstrzyga",
    modelVersionLabel: "Wersja modelu",
    modelVersion: MODEL_VERSION,
    modelVersionDisplay: `Model ${MODEL_VERSION}`,
    uncertaintyLabel: "Zakres niepewności",
    uncertaintyValue: "Dowody × założenia strukturalne",
    winnerLabel: "Założony zwycięzca",
    winnerValue: "Brak",
    note:
      "Wynik centralny jest jednym punktem. Zakres łączy niepewność dowodową z kosztem dnia i czasami etapów. Może objąć oba znaki. Różnica dni pomnożona przez koszt dnia podany przez użytkownika jest tożsamością rachunkową, nie efektem empirycznym.",
  },
  jobs: {
    eyebrow: "Trzy zadania",
    title: "Zacznij od decyzji, którą masz podjąć",
    compare: {
      label: "Porównaj koszty",
      body: "Policz ten sam zakup dla ścieżki formalnej i adaptacyjnej. Zobacz składniki, zakres oraz próg zmiany wyniku.",
      action: "Otwórz kalkulator",
    },
    choose: {
      label: "Wybierz ścieżkę",
      body: "Sprawdź ilustracyjny, regułowy ranking legalnie dostępnych ścieżek i jego wrażliwość na wagi. Optymalizator nie był walidowany na danych wynikowych.",
      action: "Otwórz optymalizator",
    },
    assess: {
      label: "Oceń proces",
      body: "Opisz sposób pracy organizacji. Samoocena jest opisowa i nie stanowi audytu ani walidacji.",
      action: "Przejdź do samooceny",
    },
  },
  scenarios: {
    eyebrow: "Porównywalne rekordy",
    title: "Scenariusze referencyjne",
    description:
      "Każdy wiersz korzysta z jawnych danych wejściowych i tego samego modelu. Czasy oraz zakres są wynikami ilustracyjnymi, nie danymi z cytowanego źródła.",
    money: {
      locale: "pl-PL",
      currencyCode: "PLN",
      thousandSuffix: " tys.",
      millionSuffix: " mln",
    },
    columns: {
      scenario: "Scenariusz",
      contractValue: "Wartość zakupu",
      formalDays: "Formalna, dni",
      adaptiveDays: "Adaptacyjna, dni",
      uncertainty: "Zakres ΔC",
      source: "Źródło i status",
    },
    allAction: "Zobacz wszystkie scenariusze",
  },
  evidence: {
    eyebrow: "Łańcuch dowodowy",
    title: "Od założenia do odtworzenia wyniku",
    description:
      "Każdy poziom odsłania kolejną warstwę: parametry, metodę, argument naukowy i materiały do reprodukcji.",
    assumptions: {
      title: "Założenia",
      body: "Parametry, profile i status każdej wartości użytej w rachunku.",
      action: "Sprawdź założenia",
    },
    methodology: {
      title: "Metodologia",
      body: "Mechanizmy siedmiu wymiarów kosztu oraz granice interpretacji.",
      action: "Przeczytaj metodologię",
    },
    paper: {
      title: "Artykuł naukowy",
      body: "Formalny model, hipotezy i projekt empirycznej walidacji.",
      action: "Otwórz artykuł",
    },
    replication: {
      title: "Replikacja",
      body: "Kod, testy i generowane wyniki używane do audytu obliczeń.",
      action: "Otwórz pakiet replikacyjny",
    },
  },
  finalAction: {
    eyebrow: "Twój przypadek",
    title: "Porównaj zakup na własnych założeniach.",
    body: "Podaj wartość, typ procesu, koszt dnia, zespół i horyzont. Wynik pokaże punkt centralny oraz warunki, które mogą zmienić jego znak.",
    action: "Policz własny scenariusz",
  },
} as const;

type HomeShape = LangShape<typeof homePl>;

const homeEn = {
  hero: {
    eyebrow: "Procurement decision model",
    title: "Compare the cost of two admissible procurement paths.",
    tagline: "A tunnel has walls. A field has a horizon.",
    description:
      "Enter the parameters of a real purchase. The model compares formal and adaptive paths, shows each cost component, and reports the full uncertainty range.",
    primaryAction: "Calculate your scenario",
    secondaryAction: "How to read the result",
  },
  boundary: {
    eyebrow: "Decision boundary",
    title: "Two paths. The same compliance boundary.",
    tunnelLabel: "Tunnel",
    tunnelDescription: "Sequential procedure",
    boundaryLabel: "Admissibility boundary",
    notation: PHI_SET.en,
    fieldLabel: "Admissible field",
    fieldDescription: "Adaptation within explicit bounds",
    caption:
      "A field does not mean unrestricted choice. Both paths remain inside the same boundary of authority, competition, ethics, and documentation.",
  },
  modelContract: {
    eyebrow: "Model contract",
    title: "What the result says and what it does not settle",
    modelVersionLabel: "Model version",
    modelVersion: MODEL_VERSION,
    modelVersionDisplay: `Model ${MODEL_VERSION}`,
    uncertaintyLabel: "Uncertainty range",
    uncertaintyValue: "Evidence × structural assumptions",
    winnerLabel: "Assumed winner",
    winnerValue: "None",
    note:
      "The central result is one point. The range combines evidence uncertainty with the daily cost and step durations. It may span both signs. The day difference multiplied by the user-supplied daily cost is an accounting identity, not an empirical effect.",
  },
  jobs: {
    eyebrow: "Three jobs",
    title: "Start with the decision you need to make",
    compare: {
      label: "Compare costs",
      body: "Calculate the same purchase for formal and adaptive paths. Inspect the components, range, and result-switching threshold.",
      action: "Open calculator",
    },
    choose: {
      label: "Choose a path",
      body: "Review an illustrative, rule-based ranking of legally available paths and its sensitivity to weights. The optimizer has not been validated on outcome data.",
      action: "Open optimizer",
    },
    assess: {
      label: "Assess a process",
      body: "Describe how the organisation works. The self-assessment is descriptive, not an audit or validation.",
      action: "Open self-assessment",
    },
  },
  scenarios: {
    eyebrow: "Comparable records",
    title: "Reference scenarios",
    description:
      "Each row uses declared inputs and the same model. Durations and ranges are illustrative outputs, not observations from the cited source.",
    money: {
      locale: "en-GB",
      currencyCode: "PLN",
      thousandSuffix: "k",
      millionSuffix: "M",
    },
    columns: {
      scenario: "Scenario",
      contractValue: "Purchase value",
      formalDays: "Formal, days",
      adaptiveDays: "Adaptive, days",
      uncertainty: "ΔC range",
      source: "Source and status",
    },
    allAction: "View all scenarios",
  },
  evidence: {
    eyebrow: "Evidence chain",
    title: "From assumption to reproducible result",
    description:
      "Each level opens another layer: parameters, method, research argument, and reproduction materials.",
    assumptions: {
      title: "Assumptions",
      body: "Parameters, profiles, and the status of every value used in the calculation.",
      action: "Review assumptions",
    },
    methodology: {
      title: "Methodology",
      body: "Mechanisms behind the seven cost dimensions and limits on interpretation.",
      action: "Read the methodology",
    },
    paper: {
      title: "Research paper",
      body: "The formal model, hypotheses, and empirical validation design.",
      action: "Open the paper",
    },
    replication: {
      title: "Replication",
      body: "Code, tests, and generated outputs used to audit the calculations.",
      action: "Open replication package",
    },
  },
  finalAction: {
    eyebrow: "Your case",
    title: "Compare a purchase using your own assumptions.",
    body: "Enter value, process type, daily cost, team, and horizon. The result reports a central point and the conditions that can change its sign.",
    action: "Calculate your scenario",
  },
} satisfies HomeShape;

export const homeT = { pl: homePl, en: homeEn } as const;

type ResearchAgendaCopy = {
  metadataTitle: (version: string) => string;
  metadataDescription: (version: string) => string;
  eyebrow: (version: string) => string;
  title: string;
  intro: string;
  prioritiesTitle: string;
  priorities: readonly [string, string, string, string];
  identificationTitle: string;
  identificationRule: string;
  statusTitle: string;
  status: (version: string) => string;
  actions: {
    paper: string;
    methodology: string;
    scenarios: string;
  };
};

const researchAgendaPl = {
  metadataTitle: (version: string) => `Agenda badawcza ${version}: ProcuraCost`,
  metadataDescription: (version: string) =>
    `Agenda empirycznej walidacji neutralnego modelu ProcuraCost ${version}.`,
  eyebrow: (version: string) => `Agenda badawcza · Model ${version}`,
  title: "Waliduj mechanizmy przed ich wyceną",
  intro:
    "ProcuraCost jest przejrzystym modelem decyzyjnym, a nie zmierzonym efektem. Program empiryczny zaczyna się od oddzielnego pomiaru przebiegu pracy, konkurencji i konstrukcji kontraktu. Narzędzia badawcze wymagają przeglądu przed zbieraniem danych.",
  prioritiesTitle: "Priorytety pomiaru",
  priorities: [
    "Przebieg pracy: znaczniki czasu, praca równoległa i godziny pracy według ról.",
    "Konkurencja: udział oferentów, kwalifikacja i benchmarki cenowe.",
    "Konstrukcja kontraktu: adaptowalność na poziomie klauzul i aneksy.",
    "Wyniki: opóźnienie, efekty w cyklu życia, obejścia i ustalenia audytowe.",
  ],
  identificationTitle: "Reguła identyfikacji",
  identificationRule:
    "Oszacuj wyniki składowe oddzielnie przed przeliczeniem ich na pieniądze. Porównuj zgodne z prawem ścieżki w tych samych granicach ładu i kontroli, kontroluj wyniki ze względu na złożoność zakupu i zachowuj możliwość odwrócenia znaku. Nie kalibruj danych tak, aby odtwarzały tezę Tunel–Pole.",
  statusTitle: "Aktualny status",
  status: (version: string) =>
    `Nie zatwierdzono jeszcze ankiety dla modelu ${version}, prerejestracji ani protokołu konfirmacyjnego. Nowe narzędzia muszą wynikać z rozdzielonych konstruktów i przejść przegląd przed rekrutacją lub pozyskaniem danych.`,
  actions: {
    paper: "Artykuł naukowy",
    methodology: "Metodologia",
    scenarios: "Zakresy scenariuszy",
  },
} satisfies ResearchAgendaCopy;

export const researchAgendaT = { pl: researchAgendaPl } as const;

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
  matrixColorLegend: "Neutralna skala wielkości: szary oznacza niższą wartość liczbową, a niebieski wyższą. Wiersz podświetlony wskazuje aktualne ustawienie. Wartości uwzględniają efekty Spend Type × Process Phase.",
  appliedMultipliersTitle: "Zastosowane mnożniki kontekstu",
  appliedMultipliersNote: `Model ${MODEL_VERSION} stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.`,
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
  matrixColorLegend: "Neutral magnitude scale: gray indicates a lower numeric value and blue a higher one. The highlighted row marks the current selection. Values include Spend Type × Process Phase effects.",
  appliedMultipliersTitle: "Applied context multipliers",
  appliedMultipliersNote: `Model ${MODEL_VERSION} applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.`,
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

const teamPl = {
  metadataTitle: "Zespół | ProcuraCost",
  metadataDescription:
    "Zespół pracujący na styku zakupów, analityki, systemów, wdrożeń, negocjacji i badań.",
  eyebrow: "Zespół",
  title: "Kompetencje wokół zakupów i wdrożeń",
  description:
    "Łączymy perspektywy zakupów, analityki, systemów, wdrożeń, negocjacji i badań.",
  peopleTitle: "Osoby",
  competenciesTitle: "Obszary pracy",
  linkedinLabel: "Profil LinkedIn",
  collectiveLabel: "Zespół ProcuraCost",
  roles: {
    procurement: "zakupy",
    analytics: "analityka",
    systems: "systemy",
    implementation: "wdrożenia",
    negotiation: "negocjacje",
    research: "badania",
    sales: "sprzedaż",
  },
  competencies: {
    procurement: {
      label: "Zakupy",
      description: "Sourcing, kategorie zakupowe i negocjacje.",
    },
    analytics: {
      label: "Analityka",
      description: "Dane, modele i analiza decyzji.",
    },
    systems: {
      label: "Systemy",
      description: "Architektura procesów, integracje i automatyzacja.",
    },
    implementation: {
      label: "Wdrożenia",
      description: "Uruchamianie systemów i procesów.",
    },
    negotiation: {
      label: "Negocjacje",
      description: "Rozmowy handlowe i warunki współpracy.",
    },
    research: {
      label: "Badania",
      description: "Pytania badawcze i interpretacja źródeł.",
    },
  },
} as const;

type TeamShape = LangShape<typeof teamPl>;

const teamEn = {
  metadataTitle: "Team | ProcuraCost",
  metadataDescription:
    "A team working across procurement, analytics, systems, implementation, negotiation, and research.",
  eyebrow: "Team",
  title: "Capabilities across procurement and implementation",
  description:
    "We bring together perspectives from procurement, analytics, systems, implementation, negotiation, and research.",
  peopleTitle: "People",
  competenciesTitle: "Areas of work",
  linkedinLabel: "LinkedIn profile",
  collectiveLabel: "ProcuraCost team",
  roles: {
    procurement: "procurement",
    analytics: "analytics",
    systems: "systems",
    implementation: "implementation",
    negotiation: "negotiation",
    research: "research",
    sales: "sales",
  },
  competencies: {
    procurement: {
      label: "Procurement",
      description: "Sourcing, procurement categories, and negotiation.",
    },
    analytics: {
      label: "Analytics",
      description: "Data, models, and decision analysis.",
    },
    systems: {
      label: "Systems",
      description: "Process architecture, integrations, and automation.",
    },
    implementation: {
      label: "Implementation",
      description: "Bringing systems and processes into operation.",
    },
    negotiation: {
      label: "Negotiation",
      description: "Commercial discussions and terms of cooperation.",
    },
    research: {
      label: "Research",
      description: "Research questions and source interpretation.",
    },
  },
} satisfies TeamShape;

export const teamT = { pl: teamPl, en: teamEn } as const;
export type TeamRole = keyof typeof teamPl.roles;
export type TeamCompetency = keyof typeof teamPl.competencies;

const footerPl = {
  projectTitles: {
    silenceTax: "Kalkulator podatku od milczenia",
    carTco: "Kalkulator TCO samochodu",
    reminders: "Platforma przypomnień",
    aerobatics: "akrobacja.com",
    linkedin: "Profil zawodowy",
  },
} as const;

type FooterShape = LangShape<typeof footerPl>;

const footerEn = {
  projectTitles: {
    silenceTax: "Silence tax calculator",
    carTco: "Car TCO calculator",
    reminders: "Reminder platform",
    aerobatics: "akrobacja.com",
    linkedin: "Professional profile",
  },
} satisfies FooterShape;

export const footerT = { pl: footerPl, en: footerEn } as const;
export type FooterProjectKey = keyof typeof footerPl.projectTitles;

const navigationPl = {
  calculator: "Kalkulator",
  optimizer: "Optymalizator",
  caseStudies: "Scenariusze",
  assessment: "Ocena dojrzałości",
  team: "Zespół",
  research: "Artykuł naukowy",
  researchAgenda: "Agenda badawcza",
  methodology: "Metodologia",
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

const modelV2Pl = {
  scenarios: {
    sourcePublisher: "Rejestr modelu ProcuraCost",
    fleet_tco_reframing: {
      name: "Flota: przeformułowanie TCO",
      description:
        "Zakup floty z jawnym kosztem zwłoki i oddzielonym założeniem wartości cyklu życia.",
      sourceTitle: "Scenariusz 2.2.2: zakup floty pojazdów",
      assumptionLabel: "Przeniesione założenia scenariusza floty",
      assumptionDetail:
        "Wartość kontraktu, koszt dnia, stawki ról i przebieg procesu są zakresami założeń przeniesionymi z modelu 2.2.2. Nie są obserwacją empiryczną.",
    },
    erp_transformation_discovery: {
      name: "Transformacja ERP: etap odkrywania",
      description:
        "Zakup systemu ERP, w którym definicja potrzeb i kontakt z rynkiem są widocznymi elementami procesu.",
      sourceTitle: "Scenariusz 2.2.2: kontrakt IT i ERP",
      assumptionLabel: "Przeniesione założenia scenariusza ERP",
      assumptionDetail:
        "Wartość kontraktu, koszt dnia, stawki ról i czasy czynności zachowano jako jawne zakresy założeń modelu 2.2.2.",
    },
    logistics_service_redesign: {
      name: "Przeprojektowanie usługi logistycznej",
      description:
        "Złożona usługa logistyczna porównana przy oddzielnych projektach przebiegu i umowy.",
      sourceTitle: "Scenariusz 2.2.2: usługi logistyczne",
      assumptionLabel: "Przeniesione założenia scenariusza logistycznego",
      assumptionDetail:
        "Wartości ekonomiczne i czasy procesu pochodzą z rejestru scenariuszy 2.2.2 i pozostają założeniami do potwierdzenia.",
    },
    critical_material_continuity: {
      name: "Ciągłość dostaw materiału krytycznego",
      description:
        "Zakup materiału, w którym koszt dnia opisuje ryzyko przerwania ciągłości, a nie premię cenową.",
      sourceTitle: "Scenariusz 2.2.2: materiały produkcyjne",
      assumptionLabel: "Przeniesione założenia ciągłości dostaw",
      assumptionDetail:
        "Koszt dnia i pozostałe wartości są założeniami ekonomiki zakładu przeniesionymi z modelu 2.2.2, nie pomiarem przestoju.",
    },
    public_it_open_with_market_consultation: {
      name: "Publiczne IT: przetarg nieograniczony z konsultacjami",
      description:
        "Dwa zgodne z PZP projekty procesu dla tego samego zakupu IT, z identycznymi obowiązkowymi terminami.",
      sourceTitle: "Scenariusz 2.2.2: publiczny zakup IT",
      assumptionLabel: "Przeniesione założenia publicznego zakupu IT",
      assumptionDetail:
        "Wartości ekonomiczne i czasy pracy są założeniami scenariusza. Terminy PZP pochodzą oddzielnie z wersjonowanego zbioru reguł prawnych.",
    },
    stable_private_standard_service: {
      name: "Stabilna standardowa usługa prywatna",
      description:
        "Scenariusz kontrolny do sprawdzenia procesu na dojrzałym rynku przy zerowym centralnym koszcie zwłoki.",
      sourceTitle: "Scenariusz 2.2.2: stabilny zakup kontrolny",
      assumptionLabel: "Przeniesione założenia stabilnego zakupu",
      assumptionDetail:
        "Dojrzałość rynku, mapy procesu i wartości ekonomiczne są deklarowanymi założeniami kontrolnymi, nie wynikami badania.",
    },
    stable_capex_replacement: {
      name: "Stabilna inwestycja odtworzeniowa CAPEX",
      description:
        "Zakup środka trwałego z jawną mapą bramek inwestycyjnych i neutralnym zerowym centrum różnic TCO oraz aneksów.",
      sourceTitle: "Scenariusz 2.2.2: inwestycja CAPEX",
      assumptionLabel: "Przeniesione założenia inwestycji CAPEX",
      assumptionDetail:
        "Wartość kontraktu, koszt dnia, stawki i czasy są zakresami założeń przeniesionymi z modelu 2.2.2.",
    },
    discovery_solution_codesign: {
      name: "Odkrywanie i współprojektowanie rozwiązania",
      description:
        "Scenariusz, w którym wariant adaptacyjny kupuje uczenie się dłuższym i bardziej pracochłonnym procesem.",
      sourceTitle: "Scenariusz 2.2.2: zakup odkrywczy",
      assumptionLabel: "Przeniesione założenia zakupu odkrywczego",
      assumptionDetail:
        "Dłuższa mapa wariantu adaptacyjnego jest falsyfikowalnym założeniem scenariusza, a nie obserwowanym efektem metody.",
    },
    catalog_calloff_control: {
      name: "Kontrola zamówienia katalogowego",
      description:
        "Realizacja z umowy ramowej przy identycznych mapach i bez różnicy konkurencji między wariantami.",
      sourceTitle: "Scenariusz 2.2.2: zamówienie z katalogu",
      assumptionLabel: "Przeniesione założenia zamówienia katalogowego",
      assumptionDetail:
        "Wartości i identyczne mapy są jawnymi założeniami kontrolnymi. Nie reprezentują wpływu wdrożenia systemu.",
    },
    mrp_release_control: {
      name: "Kontrola zwolnienia zlecenia MRP",
      description:
        "Realizacja zakontraktowanego zapotrzebowania MRP przy identycznych mapach obu wariantów.",
      sourceTitle: "Scenariusz 2.2.2: zlecenie MRP",
      assumptionLabel: "Przeniesione założenia zlecenia MRP",
      assumptionDetail:
        "Wartości i identyczne mapy są założeniami kontrolnymi. Gotowość organizacyjna nie jest z nich wnioskowana.",
    },
  },
  evidence: {
    californiaModular: {
      sourceTitle: "California Redefines State Technology Procurement",
      publisher: "California Department of Technology",
      supported:
        "Źródło opisuje modułowe dzielenie dużych systemów, możliwość zmiany kursu oraz udział mniejszych dostawców.",
      unsupported:
        "Nie identyfikuje przyczynowego wpływu tej metody na koszt ani czas scenariusza ProcuraCost.",
      population: "Zamówienia technologiczne administracji stanu Kalifornia",
      assumption:
        "Przykład wspiera opis mechanizmu jakościowego. Nie wyznacza zakresu liczbowego.",
    },
    oecdRvul: {
      sourceTitle:
        "Lessons learnt from the implementation of the pilot projects of strategic procurement: Public Procurement in Lithuania",
      publisher: "OECD",
      supported:
        "Przykład RVUL opisuje prawie rok pracy nad zdefiniowaniem problemu i przygotowaniem konsultacji rynkowych.",
      unsupported:
        "Nie szacuje kosztu, oszczędności ani uniwersalnego czasu fazy odkrywania.",
      population:
        "Pilotaż zamówienia innowacyjnego w Republican Vilnius University Hospital w Litwie",
      assumption:
        "Czas konkretnego pilotażu nie jest przenoszony do map scenariuszy jako kalibracja.",
    },
    uzpConsultation: {
      sourceTitle: "Wstępne konsultacje rynkowe",
      publisher: "Urząd Zamówień Publicznych",
      supported:
        "Źródło opisuje konsultacje jako sposób poznania rozwiązań technicznych, ekonomicznych i organizacyjnych przed postępowaniem.",
      unsupported:
        "Nie podaje wpływu konsultacji na koszt, czas ani wynik konkretnego postępowania.",
      population: "Zamawiający i wykonawcy objęci polskim Prawem zamówień publicznych",
      assumption:
        "Źródło wyznacza dopuszczalny mechanizm jakościowy, nie wartość parametru ekonomicznego.",
    },
    ecInnovation: {
      sourceTitle: "Guidance on Innovation Procurement",
      publisher: "Komisja Europejska",
      supported:
        "Wytyczne opisują praktyczne narzędzia zamówień innowacyjnych, w tym konsultacje rynkowe i dostęp do rozwiązań oferowanych przez rynek.",
      unsupported:
        "Wytyczne nie są prawnie wiążącą wykładnią i nie kalibrują efektu kosztowego ProcuraCost.",
      population: "Nabywcy publiczni i dostawcy działający w Unii Europejskiej",
      assumption:
        "Przykłady jakościowe nie są podstawą zakresów liczbowych modelu.",
    },
    szucs: {
      sourceTitle: "Discretion and favoritism in public procurement",
      publisher: "Journal of the European Economic Association",
      supported:
        "Badanie identyfikuje kanał cenowy dyskrecji w węgierskich zamówieniach poniżej progu 25 mln HUF.",
      unsupported:
        "Nie identyfikuje wpływu projektu przebiegu procesu ani transferu do wszystkich jurysdykcji i progów.",
      population:
        "Węgierskie zamówienia publiczne poniżej progu procedury zaproszeniowej",
      assumption:
        "Zakres stresu 2, 6 i 9 procent jest jawnym transferem scenariuszowym, nie estymacją dla Polski.",
    },
  },
  workflow: {
    defineNeed: "Zdefiniowanie potrzeby",
    engageMarket: "Kontakt z rynkiem",
    evaluateAndAward: "Ocena i wybór",
    marketConsultation: "Wstępne konsultacje rynkowe",
    evaluateOffers: "Ocena ofert",
    award: "Zawarcie umowy",
    steps: {
      rfi: "Rozpoznanie rynku",
      rfq: "Zapytanie ofertowe i ocena ofert",
      internal_approval: "Wewnętrzne zatwierdzenie",
      negotiation: "Negocjacje umowy",
      legal_review: "Przegląd prawny",
      signing: "Podpisanie umowy",
      needs_analysis: "Analiza potrzeb i wstępne konsultacje rynkowe",
      procurement_documents: "Przygotowanie dokumentów zamówienia",
      bid_evaluation: "Ocena ofert",
      clarifications: "Wyjaśnienia treści ofert",
      award_committee: "Komisja przetargowa",
      contract_signing: "Podpisanie i rejestracja umowy",
      requirements: "Wymagania i rozpoznanie rynku",
      evaluation: "Ocena, negocjacje i wybór",
      approval: "Zatwierdzenie",
      contract: "Przygotowanie umowy",
      business_case: "Uzasadnienie biznesowe i budżet CAPEX",
      technical_spec: "Specyfikacja techniczna",
      capex_committee: "Komitet CAPEX",
      vendor_selection: "Wybór i ocena dostawcy",
      final_approval: "Ostateczne zatwierdzenie zarządu",
      problem_framing: "Zdefiniowanie problemu",
      market_codesign: "Współprojektowanie z rynkiem",
      rework_round: "Runda przeprojektowania",
      need_identification: "Identyfikacja potrzeby",
      catalog_selection: "Wybór z katalogu",
      po_approval: "Zatwierdzenie zamówienia",
      mrp_trigger: "Sygnał MRP",
      po_generation: "Generowanie i weryfikacja zamówienia",
      goods_receipt: "Potwierdzenie odbioru",
    },
    legal: {
      pzpOpen: {
        bidSubmission: "Obowiązkowy termin składania ofert",
        standstill: "Obowiązkowy termin przed zawarciem umowy",
      },
    },
  },
  reasons: {
    bypassNotMonetized:
      "Obejście nie jest monetyzowane bez zaobserwowanej lub podanej przez użytkownika częstości.",
  },
  validation: {
    missingField: "Brakuje wymaganego pola stanu kalkulatora.",
    invalidSchemaVersion: "Wersja schematu odnośnika nie jest obsługiwana.",
    invalidModelVersion: "Wersja modelu odnośnika nie jest obsługiwana.",
    invalidCalibrationId: "Identyfikator kalibracji odnośnika nie jest obsługiwany.",
    unknownScenario: "Identyfikator scenariusza nie istnieje w rejestrze modelu 2.3.",
    unknownBoundary: "Identyfikator ram prawnych i ładu zakupowego jest nieznany.",
    unknownProcedure: "Identyfikator rodziny procedury jest nieznany.",
    unknownArchetype: "Identyfikator archetypu zakupu jest nieznany.",
    unknownExecutionChannel: "Identyfikator kanału realizacji zakupu jest nieznany.",
    unknownSystemSupport: "Identyfikator wsparcia systemowego jest nieznany.",
    unknownWorkflowDesign: "Identyfikator projektu przebiegu procesu jest nieznany.",
    unknownContractDesign: "Identyfikator konstrukcji umowy jest nieznany.",
    axisMismatch: "Osie odnośnika nie odpowiadają wybranemu scenariuszowi.",
    legacyMissingScenario: "Stary odnośnik nie zawiera identyfikatora scenariusza.",
    legacyUnknownScenario: "Stary odnośnik wskazuje nieznany scenariusz.",
    legacyCustomScenario:
      "Własnego starego scenariusza nie można odtworzyć bez potwierdzonej mapy procesu.",
    legacyConfirmationRequired:
      "Część starego odnośnika wymaga jawnego potwierdzenia przed obliczeniem.",
    legacyInvalidValue:
      "Stary odnośnik zawiera wartość, której nie można jednoznacznie przenieść.",
  },
} as const;

type WidenModelV2Copy<T> = {
  [K in keyof T]: T[K] extends string ? string : WidenModelV2Copy<T[K]>;
};

const modelV2En: WidenModelV2Copy<typeof modelV2Pl> = {
  scenarios: {
    sourcePublisher: "ProcuraCost model registry",
    fleet_tco_reframing: {
      name: "Fleet TCO reframing",
      description:
        "Fleet procurement with an explicit delay cost and a separate lifecycle-value assumption.",
      sourceTitle: "Model 2.2.2 scenario: vehicle fleet procurement",
      assumptionLabel: "Retained fleet scenario assumptions",
      assumptionDetail:
        "Contract value, daily cost, role rates and workflow are assumption ranges retained from model 2.2.2. They are not empirical observations.",
    },
    erp_transformation_discovery: {
      name: "ERP transformation discovery",
      description:
        "ERP procurement in which problem definition and market engagement are explicit parts of the workflow.",
      sourceTitle: "Model 2.2.2 scenario: IT and ERP contract",
      assumptionLabel: "Retained ERP scenario assumptions",
      assumptionDetail:
        "Contract value, daily cost, role rates and activity times remain explicit assumption ranges retained from model 2.2.2.",
    },
    logistics_service_redesign: {
      name: "Logistics service redesign",
      description:
        "A complex logistics service compared with separate workflow and contract designs.",
      sourceTitle: "Model 2.2.2 scenario: logistics services",
      assumptionLabel: "Retained logistics scenario assumptions",
      assumptionDetail:
        "Economic values and process times come from the 2.2.2 scenario registry and remain assumptions requiring confirmation.",
    },
    critical_material_continuity: {
      name: "Critical material continuity",
      description:
        "A material purchase in which the daily cost represents continuity risk rather than a price premium.",
      sourceTitle: "Model 2.2.2 scenario: production materials",
      assumptionLabel: "Retained supply-continuity assumptions",
      assumptionDetail:
        "The daily cost and other values are plant-economics assumptions retained from model 2.2.2, not measured downtime.",
    },
    public_it_open_with_market_consultation: {
      name: "Public IT: open procedure with market consultation",
      description:
        "Two PZP-compliant workflow designs for the same IT purchase with identical mandatory periods.",
      sourceTitle: "Model 2.2.2 scenario: public IT procurement",
      assumptionLabel: "Retained public IT procurement assumptions",
      assumptionDetail:
        "Economic values and work times are scenario assumptions. PZP periods come separately from the versioned legal ruleset.",
    },
    stable_private_standard_service: {
      name: "Stable private standard service",
      description:
        "A control scenario for a mature market with a zero central delay cost.",
      sourceTitle: "Model 2.2.2 scenario: stable purchase control",
      assumptionLabel: "Retained stable-purchase assumptions",
      assumptionDetail:
        "Market maturity, workflow maps and economic values are declared control assumptions, not research findings.",
    },
    stable_capex_replacement: {
      name: "Stable CAPEX replacement",
      description:
        "A fixed-asset purchase with explicit investment gates and neutral zero central TCO and amendment differentials.",
      sourceTitle: "Model 2.2.2 scenario: CAPEX investment",
      assumptionLabel: "Retained CAPEX investment assumptions",
      assumptionDetail:
        "Contract value, daily cost, rates and activity times are assumption ranges retained from model 2.2.2.",
    },
    discovery_solution_codesign: {
      name: "Discovery and solution co-design",
      description:
        "A scenario in which the adaptive alternative buys learning through a longer, more labour-intensive process.",
      sourceTitle: "Model 2.2.2 scenario: discovery purchase",
      assumptionLabel: "Retained discovery-purchase assumptions",
      assumptionDetail:
        "The longer adaptive map is a falsifiable scenario assumption, not an observed effect of a method.",
    },
    catalog_calloff_control: {
      name: "Catalog call-off control",
      description:
        "Framework execution with identical maps and no competition difference between the alternatives.",
      sourceTitle: "Model 2.2.2 scenario: catalog order",
      assumptionLabel: "Retained catalog-order assumptions",
      assumptionDetail:
        "The values and identical maps are explicit control assumptions. They do not represent the effect of system implementation.",
    },
    mrp_release_control: {
      name: "MRP release control",
      description:
        "Execution of a contracted MRP requirement with identical maps for both alternatives.",
      sourceTitle: "Model 2.2.2 scenario: MRP order",
      assumptionLabel: "Retained MRP-order assumptions",
      assumptionDetail:
        "The values and identical maps are control assumptions. Organisational readiness is not inferred from them.",
    },
  },
  evidence: {
    californiaModular: {
      sourceTitle: "California Redefines State Technology Procurement",
      publisher: "California Department of Technology",
      supported:
        "The source describes breaking large systems into modules, the ability to change course and participation by smaller suppliers.",
      unsupported:
        "It does not identify a causal cost or duration effect for a ProcuraCost scenario.",
      population: "California state-government technology procurement",
      assumption:
        "The example supports a qualitative mechanism. It does not set a numerical range.",
    },
    oecdRvul: {
      sourceTitle:
        "Lessons learnt from the implementation of the pilot projects of strategic procurement: Public Procurement in Lithuania",
      publisher: "OECD",
      supported:
        "The RVUL example describes almost a year of work to define the problem and prepare a market consultation.",
      unsupported:
        "It does not estimate a cost, saving or universal duration for discovery work.",
      population:
        "An innovation-procurement pilot at Republican Vilnius University Hospital in Lithuania",
      assumption:
        "The duration of the specific pilot is not transferred to scenario maps as a calibration.",
    },
    uzpConsultation: {
      sourceTitle: "Preliminary market consultation",
      publisher: "Polish Public Procurement Office",
      supported:
        "The source describes consultation as a way to learn about technical, economic and organisational solutions before a procedure.",
      unsupported:
        "It does not report the effect of consultation on cost, duration or the outcome of a particular procedure.",
      population:
        "Contracting authorities and suppliers within Polish public procurement law",
      assumption:
        "The source establishes a qualitative mechanism, not an economic parameter value.",
    },
    ecInnovation: {
      sourceTitle: "Guidance on Innovation Procurement",
      publisher: "European Commission",
      supported:
        "The guidance describes practical innovation-procurement tools, including market consultation and access to solutions available from the market.",
      unsupported:
        "The guidance is not a legally binding interpretation and does not calibrate a ProcuraCost cost effect.",
      population: "Public buyers and suppliers operating in the European Union",
      assumption:
        "Qualitative examples are not used as the basis of numerical model ranges.",
    },
    szucs: {
      sourceTitle: "Discretion and favoritism in public procurement",
      publisher: "Journal of the European Economic Association",
      supported:
        "The study identifies a price channel of discretion in Hungarian procurement below the HUF 25 million threshold.",
      unsupported:
        "It does not identify the effect of workflow design or transfer to every jurisdiction and threshold.",
      population:
        "Hungarian public contracts below the invitational-procedure threshold",
      assumption:
        "The 2, 6 and 9 per cent stress range is an explicit scenario transfer, not an estimate for Poland.",
    },
  },
  workflow: {
    defineNeed: "Define the need",
    engageMarket: "Engage the market",
    evaluateAndAward: "Evaluate and select",
    marketConsultation: "Preliminary market consultation",
    evaluateOffers: "Evaluate tenders",
    award: "Conclude the contract",
    steps: {
      rfi: "Market sounding",
      rfq: "Request for quotation and tender evaluation",
      internal_approval: "Internal approval",
      negotiation: "Contract negotiation",
      legal_review: "Legal review",
      signing: "Contract signing",
      needs_analysis: "Needs analysis and preliminary market consultation",
      procurement_documents: "Prepare procurement documents",
      bid_evaluation: "Tender evaluation",
      clarifications: "Tender clarifications",
      award_committee: "Award committee",
      contract_signing: "Contract signing and registration",
      requirements: "Requirements and market sounding",
      evaluation: "Evaluation, negotiation and selection",
      approval: "Approval",
      contract: "Prepare the contract",
      business_case: "Business case and CAPEX budget",
      technical_spec: "Technical specification",
      capex_committee: "CAPEX committee",
      vendor_selection: "Supplier selection and evaluation",
      final_approval: "Final board approval",
      problem_framing: "Problem definition",
      market_codesign: "Co-design with the market",
      rework_round: "Re-scoping round",
      need_identification: "Identify the need",
      catalog_selection: "Catalog selection",
      po_approval: "Purchase-order approval",
      mrp_trigger: "MRP trigger",
      po_generation: "Purchase-order generation and verification",
      goods_receipt: "Goods receipt confirmation",
    },
    legal: {
      pzpOpen: {
        bidSubmission: "Mandatory tender-submission period",
        standstill: "Mandatory standstill before contract conclusion",
      },
    },
  },
  reasons: {
    bypassNotMonetized:
      "Bypass is not monetised without an observed or user-supplied rate.",
  },
  validation: {
    missingField: "A required calculator-state field is missing.",
    invalidSchemaVersion: "The link schema version is not supported.",
    invalidModelVersion: "The link model version is not supported.",
    invalidCalibrationId: "The link calibration identifier is not supported.",
    unknownScenario: "The scenario identifier is not in the model 2.3 registry.",
    unknownBoundary: "The legal and governance boundary identifier is unknown.",
    unknownProcedure: "The procedure-family identifier is unknown.",
    unknownArchetype: "The purchase-archetype identifier is unknown.",
    unknownExecutionChannel: "The purchase execution-channel identifier is unknown.",
    unknownSystemSupport: "The system-support identifier is unknown.",
    unknownWorkflowDesign: "The workflow-design identifier is unknown.",
    unknownContractDesign: "The contract-design identifier is unknown.",
    axisMismatch: "The link axes do not match the selected scenario.",
    legacyMissingScenario: "The legacy link has no scenario identifier.",
    legacyUnknownScenario: "The legacy link refers to an unknown scenario.",
    legacyCustomScenario:
      "A legacy custom scenario cannot be reconstructed without a confirmed process map.",
    legacyConfirmationRequired:
      "Part of the legacy link requires explicit confirmation before calculation.",
    legacyInvalidValue:
      "The legacy link contains a value that cannot be migrated unambiguously.",
  },
};

export const modelV2T = { pl: modelV2Pl, en: modelV2En } as const;
