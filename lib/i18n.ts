import { LEGACY_MODEL_VERSION, MODEL_VERSION } from "./version";
import type { DecisionMapRowId } from "./decision-map";
import { MODEL_V2_METADATA } from "./model-v2/domain";

export type Lang = "pl" | "en";

const ogPl = {
  supportLine:
    "Dwa zgodne projekty przebiegu procesu. Jeden jawny rachunek kosztu.",
} as const;

type OgShape = LangShape<typeof ogPl>;

const ogEn = {
  supportLine:
    "Two compliant workflow designs. One transparent cost record.",
} satisfies OgShape;

export const ogT = { pl: ogPl, en: ogEn } as const;

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
    "Realna roczna stopa dyskontowa dla przepływów cyklu życia (aneksy, TCO). Model sprowadza je do wartości bieżącej na moment udzielenia zamówienia. To jedyna baza czasowa całego rachunku. Domyślne 4% to realna finansowa stopa dyskontowa z wytycznych MFiPR 2021–2027 (stopa społeczna w tych samych wytycznych to 3%, właściwa dla oceny projektów publicznych). Jawne założenie, nie oszacowanie. Wpisanie 0 wyłącza dyskontowanie.",
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
    "Real annual discount rate for lifecycle flows (amendments, TCO). The model brings them to present value at award. This is the single time base for the whole calculation. The 4% default is the real financial discount rate from the Polish MFiPR 2021–2027 appraisal guidelines (the social rate in the same guidelines is 3%, appropriate for public-appraisal use). A declared assumption, not an estimate. Entering 0 disables discounting.",
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

const migrationRolesPl: Record<string, string> = {
  requestor: "Wnioskodawca biznesowy",
  buyer: "Kupiec",
  lawyer: "Prawnik",
  finance: "Finanse",
  manager: "Kierownik",
  executive: "Zarząd",
};

const migrationRolesEn: Record<string, string> = {
  requestor: "Business requestor",
  buyer: "Buyer",
  lawyer: "Lawyer",
  finance: "Finance",
  manager: "Manager",
  executive: "Executive",
};

function migrationFieldLabel(
  field: string,
  lang: Lang
): string {
  const labels =
    lang === "pl"
      ? {
          scenarioId: "Scenariusz bazowy",
          governanceBoundaryId: "Ramy prawne i ład zakupowy",
          procedureFamilyId: "Rodzina procedury",
          purchaseArchetypeId: "Archetyp zakupu",
          executionChannelId: "Kanał realizacji zakupu",
          systemSupportId: "Wsparcie systemowe",
          workflowDesignFormalId: "Bazowy przebieg ścieżki formalnej",
          workflowDesignAdaptiveId: "Bazowy przebieg ścieżki adaptacyjnej",
          contractDesignFormalId: "Konstrukcja umowy ścieżki formalnej",
          contractDesignAdaptiveId: "Konstrukcja umowy ścieżki adaptacyjnej",
          "retainedProcessMap.formalSequential":
            "Mapa procesu ścieżki formalnej",
          "retainedProcessMap.adaptiveCompliant":
            "Mapa procesu ścieżki adaptacyjnej",
          "retainedRoleEffort.formalSequential":
            "Nakład pracy ról w ścieżce formalnej",
          "retainedRoleEffort.adaptiveCompliant":
            "Nakład pracy ról w ścieżce adaptacyjnej",
          "retainedNonLabourCost.formalSequential":
            "Koszt pozapracowniczy ścieżki formalnej",
          "retainedNonLabourCost.adaptiveCompliant":
            "Koszt pozapracowniczy ścieżki adaptacyjnej",
          "retainedLegacyInputs.contractValue": "Wartość kontraktu",
          "retainedLegacyInputs.tcoHorizonYears": "Horyzont TCO",
          "retainedLegacyInputs.contractDurationYears": "Czas trwania kontraktu",
          "retainedLegacyInputs.dailyCostOfInaction":
            "Dzienny koszt zwłoki",
          "retainedLegacyInputs.renegotiationCost": "Koszt renegocjacji",
          "retainedLegacyInputs.bypassAuditExposure":
            "Ekspozycja audytowa zakupu poza procesem",
          "retainedLegacyInputs.discountRatePct": "Stopa dyskontowa",
          "retainedLegacyInputs.spendType": "Typ wydatku",
          "retainedLegacyInputs.processPhase": "Faza procesu",
          workflowDesign: "Projekt przebiegu procesu",
          contractDesign: "Konstrukcja umowy",
          economicAssumptions: "Założenia ekonomiczne",
        }
      : {
          scenarioId: "Base scenario",
          governanceBoundaryId: "Legal and governance boundary",
          procedureFamilyId: "Procedure family",
          purchaseArchetypeId: "Purchase archetype",
          executionChannelId: "Purchase execution channel",
          systemSupportId: "System support",
          workflowDesignFormalId: "Formal alternative base workflow",
          workflowDesignAdaptiveId: "Adaptive alternative base workflow",
          contractDesignFormalId: "Formal alternative contract design",
          contractDesignAdaptiveId: "Adaptive alternative contract design",
          "retainedProcessMap.formalSequential":
            "Formal alternative process map",
          "retainedProcessMap.adaptiveCompliant":
            "Adaptive alternative process map",
          "retainedRoleEffort.formalSequential":
            "Formal alternative role effort",
          "retainedRoleEffort.adaptiveCompliant":
            "Adaptive alternative role effort",
          "retainedNonLabourCost.formalSequential":
            "Formal alternative non-labour cost",
          "retainedNonLabourCost.adaptiveCompliant":
            "Adaptive alternative non-labour cost",
          "retainedLegacyInputs.contractValue": "Contract value",
          "retainedLegacyInputs.tcoHorizonYears": "TCO horizon",
          "retainedLegacyInputs.contractDurationYears": "Contract duration",
          "retainedLegacyInputs.dailyCostOfInaction": "Daily cost of delay",
          "retainedLegacyInputs.renegotiationCost": "Renegotiation cost",
          "retainedLegacyInputs.bypassAuditExposure":
            "Off-process audit exposure",
          "retainedLegacyInputs.discountRatePct": "Discount rate",
          "retainedLegacyInputs.spendType": "Spend type",
          "retainedLegacyInputs.processPhase": "Process phase",
          workflowDesign: "Procurement workflow design",
          contractDesign: "Contract design",
          economicAssumptions: "Economic assumptions",
        };
  if (field in labels) return labels[field as keyof typeof labels];

  const stakeholder = /^retainedLegacyInputs\.stakeholders\.([^.]+)\.(count|dailyRate)$/.exec(
    field
  );
  if (stakeholder) {
    const roles = lang === "pl" ? migrationRolesPl : migrationRolesEn;
    const role = roles[stakeholder[1]] ??
      (lang === "pl" ? "Inna rola" : "Other role");
    const measure =
      stakeholder[2] === "count"
        ? lang === "pl"
          ? "liczba osób"
          : "participant count"
        : lang === "pl"
          ? "stawka dzienna"
          : "daily rate";
    return `${role}: ${measure}`;
  }
  return lang === "pl" ? "Inne przeniesione pole" : "Other migrated field";
}

const calculatorV2Pl = {
  alternatives: {
    formalSequential: "Formalna ścieżka sekwencyjna",
    adaptiveCompliant: "Adaptacyjna ścieżka zgodna z ramami",
  },
  journey: {
    eyebrow: "Porównanie kosztów zakupu",
    title: "Porównaj dwa sposoby przeprowadzenia zakupu",
    introduction:
      "Wybierz podobny zakup, dostosuj dwa przebiegi i podaj koszty. Otrzymasz porównanie z zapisanymi założeniami.",
    navigation: "Etapy porównania",
    stages: {
      case: {
        label: "Przypadek",
        description: "Wybierz punkt wyjścia i sprawdź wspólne ramy.",
      },
      workflows: {
        label: "Przebiegi",
        description: "Nazwij warianty i przejrzyj mapy pracy.",
      },
      costs: {
        label: "Koszty",
        description: "Uzupełnij kluczowe wartości i założenia.",
      },
      record: {
        label: "Zapis",
        description: "Odczytaj wynik, zakres i ograniczenia.",
      },
    },
    next: "Dalej",
    back: "Wstecz",
    stepOf: (current: number, total: number) => `Etap ${current} z ${total}`,
    namesTitle: "Nazwij porównywane przebiegi",
    namesDescription:
      "Nadaj wariantom krótkie nazwy. Obok każdej pozostanie widoczny typ przebiegu.",
    nameLabel: "Nazwa wariantu",
    defaultNames: {
      formalSequential: "Obecny przebieg",
      adaptiveCompliant: "Wariant alternatywny",
    },
    canonicalType: "Typ przebiegu",
    caseSupport: "Nie wiesz, który przypadek wybrać?",
    suitabilityAction: "Sprawdź warunki zastosowania",
    workflowSupport: "Potrzebujesz opisać sposób pracy przed edycją map?",
    assessmentAction: "Otwórz profil procesu",
    opensInNewTab: "Otwiera nową kartę. Porównanie pozostaje w tej karcie.",
    advancedEconomics: "Stawki pracy i pozostałe założenia",
    advancedEconomicsDescription:
      "Sprawdź stawki godzinowe, różnice w dostępie dostawców i czynniki nieobjęte wyceną.",
    readinessTitle: "Sprawdź warunki wdrożenia osobno",
    readinessBody:
      "Samoopis gotowości otworzy się osobno i nie zmieni kosztu ani zapisu modelu.",
    readinessAction: "Otwórz gotowość w nowej karcie",
  },
  localDraft: {
    title: "Szkic na tym urządzeniu",
    disclosure:
      "Po włączeniu pełny szkic formularza będzie zapisywany tylko w tej przeglądarce. Nie trafia na serwer.",
    enable: "Zapisuj szkic na tym urządzeniu",
    resumeTitle: "Znaleziono lokalny szkic",
    resumeBody: "Możesz wznowić zapisany szkic albo zacząć od nowa.",
    resume: "Wznów szkic",
    startFresh: "Zacznij od nowa",
    incompatible:
      "Lokalny szkic pochodzi z innej wersji modelu i nie może zostać wczytany.",
    invalid: "Lokalny szkic jest uszkodzony i nie może zostać wczytany.",
    remove: "Usuń lokalny szkic",
    saveFailed: "Nie udało się zapisać szkicu w tej przeglądarce.",
  },
  rail: {
    boundary: "Wspólna granica prawna i ładu",
    addStep: "Dodaj krok",
    start: "Początek",
    outcome: "Rezultat",
    criticalPath: "Ścieżka krytyczna",
    parallelBranch: "Gałąź równoległa",
    lockedLegalWait: "Zablokowany termin prawny",
    needsCorrection: "Wymaga korekty",
    selected: "Wybrano",
    split: "Rozdzielenie",
    merge: "Scalenie",
    predecessors: "Poprzednicy",
    noPredecessor: "brak",
    unknownPredecessor: "nieznany krok",
    unnamedStep: "Krok bez nazwy",
    graphRegion: (alternative: string) =>
      `Schemat zależności: ${alternative}`,
    timingSummary: (active: string, queue: string, elapsed: string) =>
      `${active} pracy + ${queue} oczekiwania = ${elapsed} dni`,
    accessibleNode: (
      alternative: string,
      position: number,
      label: string,
      status: string,
      active: string,
      queue: string,
      predecessors: string
    ) =>
      `${alternative}, krok ${position}, ${label}${status ? `, ${status}` : ""}, ${active} dni pracy aktywnej, ${queue} dni oczekiwania, poprzednicy: ${predecessors}.`,
    accessibleNodeWithoutTiming: (
      alternative: string,
      position: number,
      label: string,
      status: string,
      predecessors: string
    ) =>
      `${alternative}, krok ${position}, ${label}${status ? `, ${status}` : ""}, poprzednicy: ${predecessors}.`,
  },
  inspector: {
    title: "Edytuj krok",
    selectStep: "Wybierz krok na mapie, aby zobaczyć jego szczegóły.",
    identity: "Tożsamość",
    stepLabel: "Nazwa kroku",
    stepLabelHint:
      "Własna nazwa zastępuje nazwę projektu bazowego tylko w tym porównaniu.",
    kind: "Rodzaj kroku",
    kinds: {
      activity: "Czynność",
      approval: "Zatwierdzenie",
      milestone: "Kamień milowy",
    },
    activeWork: "Praca aktywna",
    queue: "Oczekiwanie i kolejka",
    predecessors: "Poprzednicy",
    requiredLegalSequence:
      "Wymagane następstwo po obowiązkowym terminie prawnym",
    roleHours: "Godziny pracy ról",
    nonLabourCost: "Koszt pozapracowniczy",
    rangeEvidence: "Zakres i nota dowodowa",
    low: "Niska",
    central: "Centralna",
    high: "Wysoka",
    daysUnit: "dni",
    hoursUnit: "h",
    currencyUnit: "PLN",
    evidenceClass: "Klasa dowodowa",
    evidenceIds: "Identyfikatory źródeł",
    noEvidenceIds: "brak",
    evidenceClasses: {
      empirical_anchor: "Kotwica empiryczna",
      official_case: "Przypadek urzędowy",
      practitioner_observation: "Obserwacja praktyka",
      illustrative_scenario: "Scenariusz ilustracyjny",
      research_hypothesis: "Hipoteza badawcza",
      retained_legacy_assumption: "Przeniesione założenie",
      user_input: "Dane użytkownika",
      legal_rule: "Reguła prawna",
    },
    roles: {
      requestor: "Wnioskodawca biznesowy",
      buyer: "Kupiec",
      lawyer: "Prawnik",
      finance: "Finanse",
      manager: "Kierownik",
      executive: "Zarząd",
      unknown: "Inna rola",
    },
    appliesImmediately:
      "Zmiany są od razu uwzględniane w tym porównaniu.",
    removeStep: "Usuń krok",
    lockedHeading: "Zablokowany termin prawny",
    lockedDescription:
      "Ten krok wynika z wybranego zbioru reguł prawnych i nie można go edytować ani usunąć.",
    legalRuleset: "Zbiór reguł prawnych",
    ruleId: "Identyfikator reguły",
    provision: "Podstawa prawna",
    initiatedOn: "Data wszczęcia",
    lockedActive: "Zablokowana praca aktywna",
    lockedQueue: "Zablokowany termin oczekiwania",
  },
  workspace: {
    title: "Porównanie kosztów procesu zakupowego",
    loadingUrl: "Wczytywanie stanu kalkulatora.",
    urlBootstrapFailed:
      "Nie udało się bezpiecznie wczytać stanu kalkulatora z odnośnika. Odśwież stronę albo usuń parametry z adresu.",
    introduction:
      "Model porównuje dwie dopuszczalne alternatywy w tych samych ramach prawnych i ładu. Nie zakłada preferowanego wyniku.",
    modelLabel: "Model",
    calibrationLabel: "Kalibracja",
    rulesetLabel: "Zbiór reguł prawnych",
    stageContext: "1. Zdefiniuj kontekst zakupu",
    stageWorkflows: "2. Porównaj przebieg alternatyw",
    stageEconomics: "3. Uzupełnij założenia ekonomiczne",
    scenario: "Scenariusz bazowy",
    scenarioDescription: "Opis scenariusza",
    scenarioEvidence: "Klasa źródła scenariusza",
    retainedAssumption: "Przeniesione założenie modelu 2.2.2",
    registeredContextNote:
      "Granica prawna, procedura, archetyp, kanał realizacji, wsparcie systemowe i kwalifikatory PZP są ładowane razem z zarejestrowanymi projektami obu wariantów. Aby je zmienić, wybierz inny scenariusz bazowy.",
    legalConstraints: "Rozstrzygnięte obowiązkowe ograniczenia prawne",
    noLegalWaits: "W tym kontekście model nie wyznacza obowiązkowych terminów prawnych.",
    waitDuration: (days: string) => `${days} dni oczekiwania`,
    baseDesignProvenance: "Pochodzenie projektów bazowych",
    designNarrowing:
      "Identyfikatory wskazują zgodne projekty bazowe. Mapy obu alternatyw można edytować niezależnie.",
    workflowDesign: "Projekt przebiegu procesu zakupowego",
    contractDesign: "Konstrukcja umowy",
    locallyEdited: "Lokalnie zmieniono względem projektu bazowego",
    unchangedFromBase: "Niezmieniony projekt bazowy",
    mapsValid: "2 mapy poprawne · obowiązkowe oczekiwania zablokowane",
    mapNeedsCorrection: "Mapa wymaga korekty",
    calculationNeedsCorrection: "Dane do obliczenia wymagają korekty",
    focusIssue: "Przejdź do kroku",
    undo: "Cofnij",
    undoAvailable: "Możesz cofnąć ostatnią zmianę mapy.",
    calculate: "Oblicz i utwórz zapis porównania",
    calculationBlocked:
      "Obliczenie jest zablokowane do czasu usunięcia wymienionych problemów.",
    preCalculation:
      "Zapis porównania pojawi się tutaj po sprawdzeniu obu map i wykonaniu obliczenia.",
    recordBoundaryTitle: "Utworzono zapis porównania",
    shareCopied: "Skopiowano link do scenariusza bazowego.",
    shareFailed: "Nie udało się skopiować linku. Skopiuj adres z paska przeglądarki.",
    stepAdded: "Dodano krok. Uzupełnij wymagane pola.",
    discardUrlState:
      "Odrzuć stan wczytany z linku i użyj tego scenariusza bazowego",
  },
  economics: {
    introduction:
      "Wartości niska, centralna i wysoka opisują jawny zakres założeń. Koszt i stawki są wyrażone w PLN.",
    contractValue: "Wartość kontraktu",
    dailyCostOfDelay: "Dzienny koszt zwłoki",
    competitionTransfer: "Zakres transferu konkurencji cenowej",
    competitionDisadvantagedAlternative:
      "Wariant z ograniczonym dostępem dostawców",
    noDeclaredCompetitionDifference: "Brak zadeklarowanej różnicy",
    competitionDisadvantagedDisclosure:
      "Zakres transferu jest doliczany wyłącznie do wskazanego wariantu. To jawne założenie kontrfaktyczne, a nie cecha etykiety procesu.",
    roleRates: "Stawki godzinowe ról",
    fixedDimensions: "Stała granica neutralności modelu",
    fixedNeutral: "W modelu 2.3 te składniki pozostają zerowe. Ich wycena wymaga odrębnej metody.",
    amendmentDifferential: "Różnica kosztu aneksów",
    tcoDifferential: "Różnica alokacji TCO",
    bypass: "Zakup poza zatwierdzonym procesem",
    notMonetized: "Raportowany, ale niemonetyzowany",
    low: "Niska",
    central: "Centralna",
    high: "Wysoka",
    hourlyUnit: "PLN/h",
    currencyUnit: "PLN",
    rateUnit: "udział 0–1",
  },
  migration: {
    title: "Potwierdź przeniesione dane wejściowe",
    description:
      "Stary odnośnik zawiera wartości wymagające jawnego potwierdzenia przed przeliczeniem.",
    fields: "Pola wymagające potwierdzenia",
    retainedValues: "przeniesione wartości starego modelu",
    confirmation:
      "Potwierdzam użycie przeniesionych danych wejściowych w modelu 2.3.0.",
    recalculation:
      "Poprzedni wynik nie jest odtwarzany. Dane zostaną ponownie obliczone w modelu 2.3.0.",
    fieldLabel: (field: string): string => migrationFieldLabel(field, "pl"),
  },
  share: {
    action: "Kopiuj link do scenariusza bazowego",
    disclosure:
      "Link odtwarza wyłącznie wybrany scenariusz bazowy. Zmiany map procesu, własne nazwy kroków, data wszczęcia i założenia ekonomiczne nie trafiają do linku. Pozostają w bieżącej sesji, chyba że włączysz lokalny zapis szkicu.",
  },
  validation: {
    lockedStep:
      "Ten krok wynika z wybranego zbioru reguł prawnych i nie można go edytować ani usunąć.",
    requiredLegalAncestor:
      "Ta zmiana usunęłaby wymagane następstwo po obowiązkowym terminie prawnym.",
    unknownStep: "Wybrany krok nie istnieje już w tej mapie procesu.",
    unknownRole: "Wybrana rola nie istnieje w zestawie stawek tego scenariusza.",
    invalidCalibratedRange:
      "Zakres musi zawierać nieujemne wartości w kolejności niska, centralna, wysoka.",
    competitionTransferOutOfBounds:
      "Zakres transferu konkurencji cenowej musi mieścić się od 0 do 1.",
    competitionDisadvantagedAlternativeRequired:
      "Przed obliczeniem wskaż wariant z ograniczonym dostępem dostawców.",
    competitionDisadvantagedAlternativeNotApplicable:
      "Wariant z ograniczonym dostępem dostawców musi pozostać pusty, gdy nie zadeklarowano różnicy między ścieżkami.",
    invalidStepKind:
      "Krok użytkownika może być czynnością, zatwierdzeniem albo kamieniem milowym.",
    illegalContext:
      "Wybrany kontekst jest niedopuszczalny albo wykracza poza zakres zbioru reguł prawnych.",
    registeredDesignRequired:
      "Zmiana zarejestrowanego kontekstu wymaga innego kompletnego projektu procesu. Wybierz zgodny scenariusz bazowy.",
    incompatibleLockedWaitShape:
      "Ta zmiana wymaga innego układu obowiązkowych terminów. Wybierz zgodny scenariusz bazowy.",
    contextReconciliationFailed:
      "Nie można uzgodnić obu map z tym samym zestawem obowiązkowych terminów.",
    blankCustomLabel: "Uzupełnij nazwę dodanego kroku przed obliczeniem.",
    incompatibleWorkflowDesign:
      "Projekt przebiegu procesu nie należy do tej ścieżki i scenariusza bazowego.",
    incompatibleContractDesign:
      "Konstrukcja umowy nie należy do tej ścieżki i scenariusza bazowego.",
    calculationRejected:
      "Stan porównania nie spełnia kontraktu obliczeniowego modelu 2.3.",
    incoherentWorkspaceSource:
      "Źródło stanu kalkulatora jest niespójne. Otwórz ponownie pierwotny link albo wybierz scenariusz bazowy.",
    processMap: {
      duplicate_step:
        "Dwa kroki mają ten sam identyfikator. Nadaj każdemu krokowi odrębną tożsamość.",
      unknown_predecessor:
        "Krok wskazuje poprzednika, którego nie ma na tej mapie. Usuń albo popraw to powiązanie.",
      cycle:
        "Zależności tworzą cykl. Usuń poprzednika, który prowadzi z powrotem do tego kroku.",
      invalid_value:
        "Krok zawiera nieprawidłowy zakres. Popraw wartości niską, centralną i wysoką.",
      invalid_required_legal_dependency_contract:
        "Mapa nie zachowuje pełnego zarejestrowanego kontraktu zależności prawnych. Wczytaj ponownie zgodny scenariusz bazowy.",
      missing_required_legal_ancestor:
        "Krok nie następuje już po wymaganym terminie prawnym. Przywróć zależność prowadzącą od zablokowanego terminu.",
      invalid_locked_legal_wait:
        "Obowiązkowy termin został zmieniony. Przywróć wartości i pochodzenie ze zbioru reguł prawnych.",
      missing_locked_legal_wait:
        "Na mapie brakuje obowiązkowego terminu. Wybierz zgodny scenariusz bazowy.",
      unexpected_locked_legal_wait:
        "Mapa zawiera termin prawny spoza bieżącego kontekstu. Wybierz zgodny scenariusz bazowy.",
    },
  },
} as const;

type CalculatorV2Shape = LangShape<typeof calculatorV2Pl>;

const calculatorV2En = {
  alternatives: {
    formalSequential: "Formal sequential alternative",
    adaptiveCompliant: "Adaptive compliant alternative",
  },
  journey: {
    eyebrow: "Procurement cost comparison",
    title: "Compare two ways to run a procurement",
    introduction:
      "Choose a similar purchase, adjust two workflows and enter your costs. Get a comparison with the assumptions recorded.",
    navigation: "Comparison stages",
    stages: {
      case: {
        label: "Case",
        description: "Choose a starting point and check the shared boundary.",
      },
      workflows: {
        label: "Workflows",
        description: "Name the alternatives and review the maps of work.",
      },
      costs: {
        label: "Costs",
        description: "Enter the essential values and assumptions.",
      },
      record: {
        label: "Record",
        description: "Read the result, range and limitations.",
      },
    },
    next: "Continue",
    back: "Back",
    stepOf: (current: number, total: number) => `Stage ${current} of ${total}`,
    namesTitle: "Name the compared workflows",
    namesDescription:
      "Give each alternative a short name. Its workflow type remains visible alongside it.",
    nameLabel: "Alternative name",
    defaultNames: {
      formalSequential: "Current workflow",
      adaptiveCompliant: "Alternative workflow",
    },
    canonicalType: "Workflow type",
    caseSupport: "Not sure which case to choose?",
    suitabilityAction: "Check the conditions for use",
    workflowSupport: "Need to describe the way of working before editing the maps?",
    assessmentAction: "Open the process profile",
    opensInNewTab: "Opens a new tab. Your comparison stays in this tab.",
    advancedEconomics: "Staff rates and other assumptions",
    advancedEconomicsDescription:
      "Review hourly rates, differences in supplier access and factors outside the cost calculation.",
    readinessTitle: "Check implementation conditions separately",
    readinessBody:
      "The readiness self-description opens separately and does not change cost or the model record.",
    readinessAction: "Open readiness in a new tab",
  },
  localDraft: {
    title: "Draft on this device",
    disclosure:
      "When enabled, the full form draft is saved only in this browser. It is not sent to a server.",
    enable: "Save the draft on this device",
    resumeTitle: "A local draft was found",
    resumeBody: "You can resume the saved draft or start again.",
    resume: "Resume draft",
    startFresh: "Start again",
    incompatible:
      "The local draft belongs to another model version and cannot be loaded.",
    invalid: "The local draft is damaged and cannot be loaded.",
    remove: "Remove local draft",
    saveFailed: "The draft could not be saved in this browser.",
  },
  rail: {
    boundary: "Shared legal and governance boundary",
    addStep: "Add step",
    start: "Start",
    outcome: "Outcome",
    criticalPath: "Critical path",
    parallelBranch: "Parallel branch",
    lockedLegalWait: "Locked legal wait",
    needsCorrection: "Needs correction",
    selected: "Selected",
    split: "Split",
    merge: "Merge",
    predecessors: "Predecessors",
    noPredecessor: "none",
    unknownPredecessor: "unknown step",
    unnamedStep: "Unnamed step",
    graphRegion: (alternative: string) =>
      `Dependency diagram: ${alternative}`,
    timingSummary: (active: string, queue: string, elapsed: string) =>
      `${active} active + ${queue} queue = ${elapsed} days`,
    accessibleNode: (
      alternative: string,
      position: number,
      label: string,
      status: string,
      active: string,
      queue: string,
      predecessors: string
    ) =>
      `${alternative}, step ${position}, ${label}${status ? `, ${status}` : ""}, ${active} active days, ${queue} queue days, predecessors: ${predecessors}.`,
    accessibleNodeWithoutTiming: (
      alternative: string,
      position: number,
      label: string,
      status: string,
      predecessors: string
    ) =>
      `${alternative}, step ${position}, ${label}${status ? `, ${status}` : ""}, predecessors: ${predecessors}.`,
  },
  inspector: {
    title: "Edit step",
    selectStep: "Select a step on the map to inspect its details.",
    identity: "Identity",
    stepLabel: "Step name",
    stepLabelHint:
      "A custom name replaces the base-design name only in this comparison.",
    kind: "Step kind",
    kinds: {
      activity: "Activity",
      approval: "Approval",
      milestone: "Milestone",
    },
    activeWork: "Active work",
    queue: "Waiting and queue",
    predecessors: "Predecessors",
    requiredLegalSequence: "Required sequence after a mandatory legal wait",
    roleHours: "Role hours",
    nonLabourCost: "Non-labour cost",
    rangeEvidence: "Range and evidence note",
    low: "Low",
    central: "Central",
    high: "High",
    daysUnit: "days",
    hoursUnit: "h",
    currencyUnit: "PLN",
    evidenceClass: "Evidence class",
    evidenceIds: "Evidence identifiers",
    noEvidenceIds: "none",
    evidenceClasses: {
      empirical_anchor: "Empirical anchor",
      official_case: "Official case",
      practitioner_observation: "Practitioner observation",
      illustrative_scenario: "Illustrative scenario",
      research_hypothesis: "Research hypothesis",
      retained_legacy_assumption: "Retained legacy assumption",
      user_input: "User input",
      legal_rule: "Legal rule",
    },
    roles: {
      requestor: "Business requestor",
      buyer: "Buyer",
      lawyer: "Lawyer",
      finance: "Finance",
      manager: "Manager",
      executive: "Executive",
      unknown: "Other role",
    },
    appliesImmediately: "Changes apply to this comparison immediately.",
    removeStep: "Remove step",
    lockedHeading: "Locked legal wait",
    lockedDescription:
      "This step is fixed by the selected legal ruleset and cannot be edited or removed.",
    legalRuleset: "Legal ruleset",
    ruleId: "Rule identifier",
    provision: "Legal provision",
    initiatedOn: "Initiated on",
    lockedActive: "Locked active work",
    lockedQueue: "Locked waiting period",
  },
  workspace: {
    title: "Procurement process cost comparison",
    loadingUrl: "Loading the calculator state.",
    urlBootstrapFailed:
      "The calculator state could not be loaded safely from this link. Refresh the page or remove the address parameters.",
    introduction:
      "The model compares two lawful alternatives within the same legal and governance boundary. It does not prefer either outcome.",
    modelLabel: "Model",
    calibrationLabel: "Calibration",
    rulesetLabel: "Legal ruleset",
    stageContext: "1. Define the purchasing context",
    stageWorkflows: "2. Compare the alternative workflows",
    stageEconomics: "3. Set the economic assumptions",
    scenario: "Base scenario",
    scenarioDescription: "Scenario description",
    scenarioEvidence: "Scenario source class",
    retainedAssumption: "Retained model 2.2.2 assumption",
    registeredContextNote:
      "The legal boundary, procedure, archetype, execution channel, system support and PZP qualifiers are loaded with the registered designs for both alternatives. Select another base scenario to change them.",
    legalConstraints: "Resolved mandatory legal constraints",
    noLegalWaits: "The model resolves no mandatory legal waits for this context.",
    waitDuration: (days: string) => `${days} days waiting`,
    baseDesignProvenance: "Base-design provenance",
    designNarrowing:
      "The identifiers name compatible base designs. Each alternative's workflow map remains independently editable.",
    workflowDesign: "Procurement workflow design",
    contractDesign: "Contract design",
    locallyEdited: "Locally edited from base design",
    unchangedFromBase: "Unchanged base design",
    mapsValid: "2 valid maps · mandatory waits locked",
    mapNeedsCorrection: "The map needs correction",
    calculationNeedsCorrection: "Calculation inputs need correction",
    focusIssue: "Go to step",
    undo: "Undo",
    undoAvailable: "You can undo the latest map change.",
    calculate: "Calculate and create decision record",
    calculationBlocked:
      "Calculation is blocked until the listed issues are corrected.",
    preCalculation:
      "A decision record will appear here after both maps are valid and the comparison is calculated.",
    recordBoundaryTitle: "Decision record created",
    shareCopied: "Base-scenario link copied.",
    shareFailed: "The link could not be copied. Copy the address from the browser bar.",
    stepAdded: "Step added. Complete the required fields.",
    discardUrlState: "Discard imported link state and use this base scenario",
  },
  economics: {
    introduction:
      "Low, central and high values declare an explicit assumption range. Costs and rates are expressed in PLN.",
    contractValue: "Contract value",
    dailyCostOfDelay: "Daily cost of delay",
    competitionTransfer: "Price-competition transfer range",
    competitionDisadvantagedAlternative:
      "Alternative with restricted supplier access",
    noDeclaredCompetitionDifference: "No declared difference",
    competitionDisadvantagedDisclosure:
      "The declared transfer range is applied only to the selected alternative. This is an explicit counterfactual assumption, not a property of either workflow label.",
    roleRates: "Role hourly rates",
    fixedDimensions: "Fixed model-neutrality boundary",
    fixedNeutral: "These dimensions remain zero in model 2.3. They require a separate method before they can be priced.",
    amendmentDifferential: "Contract-amendment differential",
    tcoDifferential: "TCO allocation differential",
    bypass: "Off-process purchasing",
    notMonetized: "Reported but not monetised",
    low: "Low",
    central: "Central",
    high: "High",
    hourlyUnit: "PLN/h",
    currencyUnit: "PLN",
    rateUnit: "ratio 0–1",
  },
  migration: {
    title: "Confirm migrated inputs",
    description:
      "The legacy link contains values that require explicit confirmation before recalculation.",
    fields: "Fields requiring confirmation",
    retainedValues: "retained legacy values",
    confirmation:
      "I confirm the use of the retained inputs under model 2.3.0.",
    recalculation:
      "The former result is not being reproduced. The inputs will be recalculated under model 2.3.0.",
    fieldLabel: (field: string) => migrationFieldLabel(field, "en"),
  },
  share: {
    action: "Copy base-scenario link",
    disclosure:
      "The link restores only the selected base scenario. Process-map edits, custom step labels, the initiated-on date and economic assumptions are not included in the link. They remain in the current session unless you enable local draft saving.",
  },
  validation: {
    lockedStep:
      "This step is fixed by the selected legal ruleset and cannot be edited or removed.",
    requiredLegalAncestor:
      "This change would remove a required sequence after a mandatory legal wait.",
    unknownStep: "The selected step is no longer present in this process map.",
    unknownRole: "The selected role is not present in this scenario's rate set.",
    invalidCalibratedRange:
      "The range must contain non-negative values ordered low, central and high.",
    competitionTransferOutOfBounds:
      "The price-competition transfer range must stay between 0 and 1.",
    competitionDisadvantagedAlternativeRequired:
      "Select the alternative with restricted supplier access before calculation.",
    competitionDisadvantagedAlternativeNotApplicable:
      "The alternative with restricted supplier access must remain empty when no path difference is declared.",
    invalidStepKind:
      "A user step may be an activity, approval or milestone.",
    illegalContext:
      "The selected context is unlawful or outside the coverage of the legal ruleset.",
    registeredDesignRequired:
      "Changing the registered context requires another complete workflow design. Select a compatible base scenario.",
    incompatibleLockedWaitShape:
      "This change requires a different mandatory-wait structure. Select a compatible base scenario.",
    contextReconciliationFailed:
      "Both maps could not be reconciled against the same mandatory-wait set.",
    blankCustomLabel: "Enter a name for the added step before calculation.",
    incompatibleWorkflowDesign:
      "The procurement workflow design does not belong to this alternative and base scenario.",
    incompatibleContractDesign:
      "The contract design does not belong to this alternative and base scenario.",
    calculationRejected:
      "The comparison state does not satisfy the model 2.3 calculation contract.",
    incoherentWorkspaceSource:
      "The calculator source state is inconsistent. Reopen the original link or select a base scenario.",
    processMap: {
      duplicate_step:
        "Two steps use the same identifier. Give each step a distinct identity.",
      unknown_predecessor:
        "The step names a predecessor that is not in this map. Remove or correct that relationship.",
      cycle:
        "The dependencies form a cycle. Remove the predecessor that leads back to this step.",
      invalid_value:
        "The step contains an invalid range. Correct its low, central and high values.",
      invalid_required_legal_dependency_contract:
        "The map does not retain its complete registered legal-dependency contract. Reload a compatible base scenario.",
      missing_required_legal_ancestor:
        "The step no longer follows its required legal wait. Restore a dependency path from the locked wait.",
      invalid_locked_legal_wait:
        "A mandatory wait has been changed. Restore the values and provenance from the legal ruleset.",
      missing_locked_legal_wait:
        "The map is missing a mandatory wait. Select a compatible base scenario.",
      unexpected_locked_legal_wait:
        "The map contains a legal wait outside the current context. Select a compatible base scenario.",
    },
  },
} satisfies CalculatorV2Shape;

export const calculatorV2T = {
  pl: calculatorV2Pl,
  en: calculatorV2En,
} as const;

// Canonical ∂Φ boundary set (CLAUDE_DESIGN.md), single source of truth; use verbatim everywhere.
export const PHI_SET = {
  pl: "∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}",
  en: "∂Φ = {auth, competition, ethics, docs}",
} as const;

const homePl = {
  hero: {
    eyebrow: "Model decyzji zakupowych",
    title: "Porównaj koszt dwóch dopuszczalnych projektów procesu zakupowego.",
    tagline: "Tunel ma ściany. Pole ma horyzont.",
    description:
      "Ustaw wspólne ramy, osobno zaprojektuj przebieg procesu i umowę dla obu alternatyw, a następnie odczytaj wynik w zakresie niskim, centralnym i wysokim.",
    primaryAction: "Porównaj koszty",
    secondaryAction: "Zobacz mechanizmy i źródła",
  },
  neutrality:
    "Model dopuszcza oba kierunki różnicy. Znak wyniku nie jest założony.",
  boundary: {
    eyebrow: "Wspólna granica decyzji",
    title: "Jedna granica. Dwa projekty przebiegu.",
    tunnelLabel: "Formalna ścieżka sekwencyjna",
    tunnelDescription: "Bramy prowadzą przez ustaloną kolejność.",
    boundaryLabel: "Ramy prawne i ład zakupowy",
    notation: PHI_SET.pl,
    fieldLabel: "Adaptacyjna ścieżka zgodna z ramami",
    fieldDescription: "Rozgałęzienia pozwalają iterować i ponownie scalać pracę.",
    note:
      "Schemat pokazuje konstrukcję pracy, nie wynik ani oszacowanie czasu lub kosztu.",
    caption:
      "Obie ścieżki pozostają w tych samych ramach uprawnień, konkurencji, etyki i dokumentacji.",
    action: "Otwórz edytowalne porównanie procesów",
  },
  modelContract: {
    eyebrow: "Kontrakt modelu",
    title: "Co wynik mówi, a czego nie rozstrzyga",
    modelVersionLabel: "Wersja modelu",
    modelVersion: MODEL_VERSION,
    modelVersionDisplay: `Model ${MODEL_VERSION}`,
    uncertaintyLabel: "Deklarowany zakres scenariusza",
    uncertaintyValue: "niski · centralny · wysoki",
    winnerLabel: "Kierunek różnicy",
    winnerValue: "Nie jest założony",
    note:
      "Wynik centralny jest jednym punktem. Zakres propaguje jawnie zadeklarowane wartości niskie i wysokie danych wejściowych; nie jest przedziałem ufności ani mnożnikiem jakości dowodów. Może objąć oba znaki. Różnica dni pomnożona przez koszt dnia podany przez użytkownika jest tożsamością rachunkową, nie efektem empirycznym.",
  },
  jobs: {
    eyebrow: "Narzędzia do decyzji zakupowej",
    title: "Zacznij od decyzji, którą masz podjąć",
    items: [
      {
        label: "Porównaj koszt",
        body: "Zaprojektuj dwie dopuszczalne alternatywy i odczytaj różnicę w zakresie niskim, centralnym i wysokim.",
        action: "Otwórz porównanie kosztów",
      },
      {
        label: "Porównaj dopasowanie",
        body: "Zestaw warunki dopasowania dopuszczalnych ścieżek bez punktacji ani rekomendacji.",
        action: "Otwórz porównanie dopasowania",
      },
      {
        label: "Opisz profil projektu procesu",
        body: "Opisz dziesięć wymiarów przebiegu bez punktacji, poziomu dojrzałości ani zalecanej ścieżki.",
        action: "Otwórz profil procesu",
      },
    ],
    compare: {
      label: "Porównaj koszty",
      body: "Policz ten sam zakup dla ścieżki formalnej i adaptacyjnej. Sprawdź koszty pracy, oczekiwania i organizacji procesu.",
      action: "Otwórz kalkulator",
    },
    choose: {
      label: "Porównaj dopasowanie",
      body: "Zestaw warunki dopasowania dopuszczalnych ścieżek bez punktacji ani rekomendacji.",
      action: "Otwórz porównanie dopasowania",
    },
    assess: {
      label: "Oceń proces",
      body: "Opisz sposób pracy organizacji. Samoocena jest opisowa i nie stanowi audytu ani walidacji.",
      action: "Przejdź do samooceny",
    },
  },
  evidenceRegister: {
    eyebrow: "Mechanizmy i źródła",
    title: "Cztery oficjalne rekordy do interpretacji mechanizmów",
    description:
      "Każdy rekord oddziela to, co źródło wspiera, od tego, czego nie rozstrzyga. Rejestr nie przypisuje organizacji wyniku modelu.",
    allAction: "Otwórz pełny rejestr mechanizmów i źródeł",
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
      body: "Kontrakt obliczeniowy, pokrycie monetyzacji i granice interpretacji.",
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
  implementation: {
    eyebrow: "Od modelu do wdrożenia",
    title: "Rachunek kosztu i samoopis gotowości to odrębne analizy",
    body:
      "Porównanie kosztów nie potwierdza właścicielstwa, jakości wymagań, danych ani adopcji. Samoopis porządkuje deklarowane warunki, a materiał Procurement&Beyond pokazuje ich praktyczny kontekst.",
    readinessAction: "Otwórz samoopis gotowości do wdrożenia",
    practiceAction: "Przejdź do materiału Procurement&Beyond",
  },
  finalAction: {
    eyebrow: "Twój przypadek",
    title: "Porównaj dwa projekty przebiegu własnego zakupu.",
    body: "Ustal wspólną granicę, zaprojektuj obie mapy i zadeklaruj założenia kosztowe. Rekord pokaże wynik centralny, zakres scenariusza i granice monetyzacji.",
    action: "Otwórz kalkulator",
  },
} as const;

type HomeShape = LangShape<typeof homePl>;

const homeEn = {
  hero: {
    eyebrow: "Procurement decision model",
    title: "Compare the cost of two lawful procurement workflow designs.",
    tagline: "A tunnel has walls. A field has a horizon.",
    description:
      "Set the shared boundary, design the workflow and contract for each alternative separately, then read the result under low, central, and high assumptions.",
    primaryAction: "Compare costs",
    secondaryAction: "View mechanisms and evidence",
  },
  neutrality:
    "The model permits either direction of difference. The sign is not assumed.",
  boundary: {
    eyebrow: "Shared decision boundary",
    title: "One boundary. Two workflow designs.",
    tunnelLabel: "Formal sequential alternative",
    tunnelDescription: "Gates carry the work through an established sequence.",
    boundaryLabel: "Legal and governance boundary",
    notation: PHI_SET.en,
    fieldLabel: "Adaptive compliant alternative",
    fieldDescription: "Branches allow work to iterate and rejoin.",
    note:
      "The diagram shows how work is structured, not an outcome or an estimate of time or cost.",
    caption:
      "Both paths remain within the same boundaries of authority, competition, ethics and documentation.",
    action: "Open the editable process comparison",
  },
  modelContract: {
    eyebrow: "Model contract",
    title: "What the result says and what it does not settle",
    modelVersionLabel: "Model version",
    modelVersion: MODEL_VERSION,
    modelVersionDisplay: `Model ${MODEL_VERSION}`,
    uncertaintyLabel: "Declared scenario range",
    uncertaintyValue: "low · central · high",
    winnerLabel: "Direction of difference",
    winnerValue: "Not assumed",
    note:
      "The central result is one point. The range propagates explicitly declared low and high input values; it is neither a confidence interval nor an evidence-quality multiplier. It may span both signs. The day difference multiplied by the user-supplied daily cost is an accounting identity, not an empirical effect.",
  },
  jobs: {
    eyebrow: "Procurement decision tools",
    title: "Start with the decision you need to make",
    items: [
      {
        label: "Compare cost",
        body: "Design two lawful alternatives and read the difference under low, central, and high assumptions.",
        action: "Open the cost comparison",
      },
      {
        label: "Compare suitability",
        body: "Compare the suitability conditions of lawful routes without scoring or a recommendation.",
        action: "Open the suitability comparison",
      },
      {
        label: "Describe the process design profile",
        body: "Describe ten workflow dimensions without a score, maturity level or prescribed route.",
        action: "Open the process profile",
      },
    ],
    compare: {
      label: "Compare costs",
      body: "Calculate the same purchase for formal and adaptive paths. Inspect staff, waiting and process costs.",
      action: "Open calculator",
    },
    choose: {
      label: "Compare suitability",
      body: "Compare the suitability conditions of lawful routes without scoring or a recommendation.",
      action: "Open the suitability comparison",
    },
    assess: {
      label: "Assess a process",
      body: "Describe how the organisation works. The self-assessment is descriptive, not an audit or validation.",
      action: "Open self-assessment",
    },
  },
  evidenceRegister: {
    eyebrow: "Mechanisms and evidence",
    title: "Four official records for interpreting mechanisms",
    description:
      "Each record separates what the source supports from what it does not establish. The register assigns no model outcome to an organisation.",
    allAction: "Open the full mechanisms and evidence register",
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
      body: "Calculation contract, monetisation coverage and interpretation limits.",
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
  implementation: {
    eyebrow: "From model to implementation",
    title: "Cost analysis and readiness self-description are separate exercises",
    body:
      "A cost comparison does not establish ownership, requirement quality, data readiness or adoption. The self-description structures declared conditions, while Procurement&Beyond material provides practitioner context.",
    readinessAction: "Open the implementation-readiness self-description",
    practiceAction: "Open the Procurement&Beyond material",
  },
  finalAction: {
    eyebrow: "Your case",
    title: "Compare two workflow designs for your purchase.",
    body: "Set the shared boundary, design both maps and declare cost assumptions. The record reports the central result, scenario range and monetisation boundary.",
    action: "Open the calculator",
  },
} satisfies HomeShape;

export const homeT = { pl: homePl, en: homeEn } as const;

const homeExperiencePl = {
  hero: {
    eyebrow: "Decyzja zakupowa / model 2.3",
    title: "Porównaj dwa zgodne z prawem sposoby przeprowadzenia zakupu.",
    description:
      "Zobacz, skąd bierze się różnica czasu i kosztu. Zachowaj jawny zapis założeń, wyniku i ograniczeń.",
    primaryAction: "Zacznij porównanie",
    secondaryAction: "Sprawdź model i źródła",
  },
  paths: {
    eyebrow: "Wybierz cel",
    title: "Porównaj zakup albo sprawdź metodę obliczeń",
    practical: {
      eyebrow: "Mam konkretny zakup",
      title: "Utwórz porównanie",
      body: "Przejdź przez przypadek, dwa przebiegi, koszty i zapis wyniku.",
      action: "Rozpocznij porównanie",
    },
    research: {
      eyebrow: "Weryfikuję model",
      title: "Otwórz centrum badawcze",
      body: "Sprawdź wzory, założenia, źródła danych i sposób odtworzenia wyników.",
      action: "Przejdź do badań",
    },
  },
  record: {
    eyebrow: "Co zawiera wynik",
    title: "Wynik, który można sprawdzić i odtworzyć",
    description:
      "Otrzymasz zestawienie kosztów obu wariantów, przyjęte założenia i listę czynników, których model nie wycenia.",
    fields: [
      "Nazwy wariantów i rodzaj przebiegu",
      "Wynik centralny",
      "Deklarowany zakres scenariusza",
      "Główne czynniki kosztu",
      "Założenia i ograniczenia",
    ],
  },
  journey: {
    eyebrow: "Ścieżka praktyczna",
    title: "Od przypadku do zapisu w czterech krokach",
    intro:
      "Wybierz podobny zakup, dostosuj czynności i wpisz własne koszty. Na końcu pobierz wynik wraz z założeniami.",
    steps: [
      {
        title: "Przypadek",
        body: "Wybierz punkt wyjścia i sprawdź wspólne ramy prawne.",
      },
      {
        title: "Przebiegi",
        body: "Nazwij warianty i przejrzyj dwie połączone mapy pracy.",
      },
      {
        title: "Koszty",
        body: "Podaj kluczowe wartości, a szczegóły rozwiń tylko wtedy, gdy są potrzebne.",
      },
      {
        title: "Zapis",
        body: "Odczytaj różnicę, zakres, czynniki i granice wyniku.",
      },
    ],
  },
  trust: {
    eyebrow: "Jak działa porównanie",
    items: [
      {
        title: "Neutralny wynik",
        body: "Model dopuszcza oba kierunki różnicy i nie zakłada tańszego wariantu.",
      },
      {
        title: "Dane pod kontrolą użytkownika",
        body: "Szkic lokalny działa wyłącznie po zgodzie i nie trafia na serwer.",
      },
      {
        title: "Wspólna granica prawna",
        body: "Obowiązkowe terminy i reguły pozostają zablokowane po obu stronach.",
      },
    ],
  },
  finalAction: {
    title: "Masz zakup do porównania?",
    body: "Zacznij od najbliższego scenariusza. W każdej chwili możesz wrócić i poprawić założenia.",
    action: "Utwórz zapis porównania",
  },
} as const;

type HomeExperienceShape = LangShape<typeof homeExperiencePl>;

const homeExperienceEn = {
  hero: {
    eyebrow: "Procurement decision / model 2.3",
    title: "Compare two lawful ways to run a procurement.",
    description:
      "See what drives the difference in time and cost. Keep an explicit record of assumptions, results and limitations.",
    primaryAction: "Start a comparison",
    secondaryAction: "Check the model and evidence",
  },
  paths: {
    eyebrow: "Choose your goal",
    title: "Compare a purchase or review the calculation method",
    practical: {
      eyebrow: "I have a procurement case",
      title: "Create a comparison",
      body: "Move through the case, two workflows, costs and the result record.",
      action: "Start the comparison",
    },
    research: {
      eyebrow: "I am reviewing the model",
      title: "Open the research centre",
      body: "Review the formulas, assumptions, data sources and steps to reproduce the results.",
      action: "Go to research",
    },
  },
  record: {
    eyebrow: "What the result contains",
    title: "A result that can be checked and reproduced",
    description:
      "The record contains the costs of both alternatives, the assumptions used and the factors the model leaves unpriced.",
    fields: [
      "Alternative names and workflow types",
      "Central result",
      "Declared scenario range",
      "Main cost drivers",
      "Assumptions and limitations",
    ],
  },
  journey: {
    eyebrow: "Practitioner path",
    title: "From case to record in four steps",
    intro:
      "Choose a similar purchase, adjust the activities and enter your costs. Then download the result with its assumptions.",
    steps: [
      {
        title: "Case",
        body: "Choose a starting point and check the shared legal boundary.",
      },
      {
        title: "Workflows",
        body: "Name the alternatives and review two connected maps of work.",
      },
      {
        title: "Costs",
        body: "Enter the essential values and open detail only when it is needed.",
      },
      {
        title: "Record",
        body: "Read the difference, range, drivers and result boundary.",
      },
    ],
  },
  trust: {
    eyebrow: "How the comparison works",
    items: [
      {
        title: "Neutral result",
        body: "The model permits either direction of difference and assumes no cheaper alternative.",
      },
      {
        title: "User-controlled data",
        body: "A local draft works only with consent and is never sent to a server.",
      },
      {
        title: "Shared legal boundary",
        body: "Mandatory periods and rules remain locked on both sides.",
      },
    ],
  },
  finalAction: {
    title: "Do you have a procurement to compare?",
    body: "Start from the closest scenario. You can return and revise the assumptions at any point.",
    action: "Create a comparison record",
  },
} satisfies HomeExperienceShape;

export const homeExperienceT = {
  pl: homeExperiencePl,
  en: homeExperienceEn,
} as const;

const mechanismsEvidencePl = {
  eyebrow: "Rejestr dowodowy",
  title: "Mechanizmy i źródła",
  introduction:
    "Rejestr porządkuje źródła używane do opisu mechanizmów i założeń. Nie przypisuje opisanym instytucjom wyniku obliczonego przez ProcuraCost.",
  registerTitle: "Zakres wsparcia i granice interpretacji",
  registerDescription:
    "Najpierw znajdują się cztery oficjalne rekordy, a następnie empiryczny punkt odniesienia dotyczący transferu konkurencji na cenę.",
  scopeNote:
    "Każdy rekord oddziela mechanizm wspierany przez źródło od wniosku, którego źródło nie pozwala wyprowadzić.",
} as const;

type MechanismsEvidenceShape = LangShape<typeof mechanismsEvidencePl>;

const mechanismsEvidenceEn = {
  eyebrow: "Evidence register",
  title: "Mechanisms and evidence",
  introduction:
    "The register organises sources used to describe mechanisms and assumptions. It assigns no ProcuraCost calculation outcome to the institutions described.",
  registerTitle: "Support and interpretation limits",
  registerDescription:
    "Four official records appear first, followed by the empirical anchor for the transfer from competition to price.",
  scopeNote:
    "Each record separates the mechanism supported by the source from the conclusion that the source does not establish.",
} satisfies MechanismsEvidenceShape;

export const mechanismsEvidenceT = {
  pl: mechanismsEvidencePl,
  en: mechanismsEvidenceEn,
} as const;

const researchPaperEn = {
  metadata: {
    title: `Working paper: ProcuraCost model ${MODEL_V2_METADATA.modelVersion}`,
    description:
      "Working paper on the deterministic comparison of formal sequential and adaptive compliant procurement workflow designs.",
  },
  eyebrow: `Working paper / model ${MODEL_V2_METADATA.modelVersion}`,
  provenance: `Native specification / ${MODEL_V2_METADATA.calibrationId} / ${MODEL_V2_METADATA.legalRulesetId}`,
  printAction: "Print or save as PDF",
  title:
    "Procurement workflow design under a shared legal and governance boundary",
  abstractTitle: "Abstract",
  abstract: [
    "ProcuraCost compares the declared cost of two lawful procurement workflow designs: formal sequential and adaptive compliant. Both alternatives retain the same legal and governance boundary, procedure family, initiation date and mandatory legal waits. The model therefore tests workflow and contract design without treating compliance as a variable to be relaxed.",
    "The calculation is deterministic. Scenario values are starting assumptions with explicit provenance, not measured organisational effects or probability estimates. The model records the direction and range of the cost difference but does not select a procedure, infer implementation readiness or prescribe an outcome.",
  ],
  modelContract: {
    title: "Calculation contract",
    items: [
      "Each alternative has its own directed process map with activities, dependencies, role effort, waiting time and non-labour cost.",
      "Mandatory PZP periods come from the versioned legal ruleset. They remain locked and identical in both alternatives.",
      "Total cost comprises role effort, non-labour cost, delay cost and explicitly monetised contract-design dimensions.",
      "Informal process bypass is not monetised in model 2.3.",
      "Every decision record exposes the assumptions, calculation anchors, evidence class, legal provenance and dimensions outside monetisation.",
    ],
  },
  resultBoundary: {
    title: "Result and range",
    formula:
      "Delta C = total cost of the formal sequential alternative - total cost of the adaptive compliant alternative",
    body:
      "A positive value means that the formal sequential alternative has the higher declared cost. A negative value means that the adaptive compliant alternative has the higher declared cost. Low, central and high values form a scenario stress range, not a confidence interval. The outer range combines opposite endpoints of the two alternatives. Crossing zero does not by itself prove a sign reversal under shared assumptions.",
  },
  coverage: {
    title: "Monetisation coverage",
    body:
      "The native record separates role cost, non-labour cost, delay cost, competition transfer, contract amendments and TCO. Contract-amendment and TCO differentials remain zero in model 2.3, including edited scenarios. Informal bypass is reported as a non-monetised dimension.",
  },
  evidenceBoundary: {
    title: "Evidence and transfer limits",
    body:
      "The evidence register distinguishes empirical anchors, official examples, retained scenario assumptions, internal illustrative allocations, practitioner observations and research hypotheses. Source relevance does not by itself justify numerical transfer.",
    items: [
      "Szucs provides the bounded empirical anchor for a competition-to-price channel in Hungarian procurement below the studied threshold. The 2, 6 and 9 per cent range is an explicit stress transfer, not an estimate for Poland.",
      "Official material from UZP, the European Commission, OECD and California describes mechanisms such as market consultation, problem definition and modular contracting. It does not calibrate ProcuraCost cost effects.",
      "Economic values, hourly rates, aggregate day totals, system-support multipliers and coordination or tool-cost profiles retained from model 2.2.2 remain labelled historical assumptions. For the five mechanism scenarios, step order, day allocation and role-hour allocation are illustrative model 2.3 inputs; external cases support constructs only, not duration, effort or cost.",
    ],
  },
  practitionerTitle: "Practitioner-material boundary",
  practitionerBoundary:
    "Procurement&Beyond episode 8 informs questions about process friction, internal ownership, requirements, TCO and responsible automation. It supports question design and hypothesis generation only. It does not calibrate thresholds, weights, ranges or expected implementation effects.",
  scope: {
    title: "Scope and limitations",
    items: [
      "The legal ruleset covers the stated classic procurement contexts initiated in 2026 or 2027. Sectoral, defence and security contexts fail closed.",
      "Procedure-family suitability is compared separately and without scoring. Special procedures still require a competent legal assessment of their statutory grounds.",
      "The output is an auditable cost record for scenario analysis. It is neither legal advice nor statistical validation of an organisational outcome.",
    ],
  },
  referencesTitle: "Selected references",
  references: [
    {
      label:
        "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. Journal of the European Economic Association, 22(1), 117-160.",
      href: "https://doi.org/10.1093/jeea/jvad017",
    },
    {
      label:
        "Beuve, J., Moszoro, M. W., and Spiller, P. T. (2023). Doing It by the Book: Political Contestability and Public Contract Renegotiations. Journal of Law, Economics, and Organization, 39(1), 281-308.",
      href: "https://doi.org/10.1093/jleo/ewab039",
    },
    {
      label: "Public Procurement Office: Preliminary market consultation",
      href: "https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe",
    },
    {
      label: "European Commission: Guidance on Innovation Procurement",
      href: "https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement",
    },
    {
      label: "OECD: Public Procurement in Lithuania, problem definition case",
      href: "https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html",
    },
    {
      label: "California Department of Technology: Modular IT procurement",
      href: "https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/",
    },
    {
      label:
        "Procurement&Beyond, episode 8: Even the best tool cannot rescue a poor implementation",
      href: "https://www.youtube.com/watch?v=5KYUdTLlvvg",
    },
  ],
  repositoryNote:
    "The model register, deterministic replication artefacts and parameter documentation are maintained in the project repository.",
} as const;

export const researchPaperT = { en: researchPaperEn } as const;

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
    "ProcuraCost jest przejrzystym modelem porównania kosztów, a nie oszacowanym efektem organizacyjnym. Program empiryczny zaczyna się od oddzielnego pomiaru przebiegu pracy, konkurencji i konstrukcji kontraktu. Narzędzia badawcze wymagają przeglądu przed rozpoczęciem zbierania danych.",
  prioritiesTitle: "Priorytety pomiaru",
  priorities: [
    "Przebieg pracy: znaczniki czasu, praca równoległa i godziny pracy według ról.",
    "Konkurencja: udział oferentów, kwalifikacja i benchmarki cenowe.",
    "Konstrukcja kontraktu: adaptowalność na poziomie klauzul i aneksy.",
    "Wyniki: opóźnienie, efekty w cyklu życia, obejścia i ustalenia audytowe.",
  ],
  identificationTitle: "Reguła identyfikacji",
  identificationRule:
    "Oszacuj wyniki składowe oddzielnie przed ich monetyzacją. Porównuj zgodne z prawem projekty procesu we wspólnych ramach prawnych i ładu zakupowego, uwzględniaj złożoność zakupu i zachowuj możliwość odwrócenia znaku. Nie dobieraj danych tak, aby odtwarzały tezę Tunel-Pole.",
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
  appliedMultipliersNote: `Model ${LEGACY_MODEL_VERSION} stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.`,
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
  appliedMultipliersNote: `Model ${LEGACY_MODEL_VERSION} applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.`,
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

const researchExportV2Pl = {
  title: "Rekord decyzji zakupowej",
  sections: {
    metadata: "Metadane",
    context: "Wspólny kontekst",
    designs: "Projekty alternatyw",
    workflowSteps: "Etapy przebiegu procesu",
    results: "Wyniki",
    drivers: "Analiza czynników kosztowych",
    coverage: "Zakres monetyzacji",
    nonMonetized: "Wymiary niemonetyzowane",
    assumptions: "Założenia",
    calculationAnchors: "Kotwice obliczeniowe",
    internalEvidence: "Wewnętrzne pochodzenie map przebiegu",
    externalEvidence: "Dowody zewnętrzne",
    retainedAssumptions: "Przeniesione założenia modelu 2.2.2",
    legalProvenance: "Pochodzenie reguł prawnych",
    migration: "Migracja danych wejściowych",
    migrationAudit: "Audyt przeniesionych danych wejściowych",
    postMigrationEdits: "Edycje po migracji",
  },
  fields: {
    schemaVersion: "Wersja schematu",
    modelVersion: "Wersja modelu",
    calibrationId: "Identyfikator kalibracji",
    legalRulesetId: "Identyfikator zbioru reguł prawnych",
    scenarioId: "Identyfikator scenariusza",
    scenario: "Scenariusz",
    currency: "Waluta",
    locale: "Język eksportu",
    exportedAt: "Data eksportu",
    workflowDesign: "Projekt przebiegu procesu zakupowego",
    contractDesign: "Konstrukcja umowy",
    activeDays: "Dni pracy aktywnej",
    queueDays: "Dni oczekiwania",
    elapsedDays: "Czas trwania",
    roleCost: "Koszt pracy ról",
    nonLabourCost: "Koszt pozapłacowy",
    delayCost: "Koszt zwłoki",
    contractCost: "Koszt konstrukcji umowy",
    totalCost: "Koszt całkowity",
    deltaCost: "Różnica kosztu",
    outerEnvelope: "Zewnętrzny zakres różnicy",
    evidenceStatus: "Status dowodu",
    supportedClaim: "Zakres wspierany przez źródło",
    unsupportedClaim: "Czego źródło nie wspiera",
    population: "Jurysdykcja lub populacja",
    source: "Źródło",
    provision: "Podstawa prawna",
    occurrences: "Wystąpienia w mapach",
    status: "Status",
    sourceSchemaVersion: "Wersja schematu źródłowego",
    legacyScenarioId: "Identyfikator starego scenariusza",
    fieldsRequiringConfirmation: "Pola wymagające potwierdzenia",
    confirmed: "Potwierdzono",
    field: "Pole",
    value: "Wartość",
    alternative: "Alternatywa",
    driver: "Czynnik",
    assumption: "Założenie",
    path: "Ścieżka danych",
    evidenceIds: "Identyfikatory dowodów",
    constructs: "Konstrukty",
    predecessorIds: "Identyfikatory poprzedników",
    criticalPathCases: "Warianty ścieżki krytycznej",
    stepKind: "Rodzaj kroku",
    disposition: "Dyspozycja migracyjna",
    retainedValue: "Przeniesiona wartość",
    changedFromLegacyScenario: "Zmieniono względem starego scenariusza",
    materializedPaths: "Ścieżki materializacji",
    sourceClass: "Klasa źródła",
    sourceField: "Pole źródłowe",
    role: "Rola",
    roleHourlyRates: "Stawki godzinowe ról",
    hourlyRate: "Stawka godzinowa",
    beforeEdit: "Przed edycją",
    afterEdit: "Po edycji",
    before: "Przed",
    after: "Po",
    beforeEvidence: "Dowód przed edycją",
    afterEvidence: "Dowód po edycji",
    provenance: "Pochodzenie",
    originalDisposition: "Pierwotna dyspozycja migracyjna",
  },
  axes: {
    legalGovernanceBoundary: "Ramy prawne i ład zakupowy",
    procedureFamily: "Rodzina procedury",
    purchaseArchetype: "Archetyp zakupu",
    executionChannel: "Kanał realizacji zakupu",
    systemSupport: "Wsparcie systemowe",
    initiatedOn: "Data wszczęcia",
  },
  axisValues: {
    private_policy: "Polityka zakupowa sektora prywatnego",
    public_internal_rules: "Wewnętrzne zasady zakupowe sektora publicznego",
    pzp_classic_national: "PZP: zamówienia klasyczne poniżej progów unijnych",
    pzp_classic_eu: "PZP: zamówienia klasyczne od progów unijnych",
    private_competitive: "Konkurencyjna procedura prywatna",
    private_negotiated: "Negocjowana procedura prywatna",
    public_internal_competitive:
      "Wewnętrzna procedura konkurencyjna sektora publicznego",
    pzp_basic: "Tryb podstawowy",
    pzp_open: "Przetarg nieograniczony",
    pzp_restricted: "Przetarg ograniczony",
    framework_calloff: "Zamówienie wykonawcze z umowy ramowej",
    custom_lawful: "Inna dopuszczalna procedura",
    standardized_recurring: "Zakup standaryzowany i powtarzalny",
    incomplete_requirement: "Zakup z niepełnym wymaganiem",
    complex_service: "Złożona usługa",
    continuity_critical: "Zakup krytyczny dla ciągłości działania",
    capital_investment: "Inwestycja kapitałowa",
    sourcing_event: "Postępowanie sourcingowe",
    catalog_calloff: "Zamówienie z katalogu",
    mrp_release: "Zlecenie zakupu z MRP",
    custom: "Inny kanał realizacji",
    manual: "Obsługa ręczna",
    sourcing_platform: "Platforma sourcingowa",
    transactional_erp: "Transakcyjny moduł ERP/P2P",
    integrated_source_to_pay: "Zintegrowane Source-to-Pay",
  },
  alternatives: {
    formalSequential: "Formalna ścieżka sekwencyjna",
    adaptiveCompliant: "Adaptacyjna ścieżka zgodna z ramami",
  },
  range: {
    low: "Niski",
    central: "Centralny",
    high: "Wysoki",
  },
  drivers: {
    role_cost: "Koszt pracy ról",
    non_labour_cost: "Koszt pozapłacowy",
    delay_cost: "Koszt zwłoki",
    competition_transfer: "Transfer konkurencji cenowej",
    contract_amendment: "Aneksy do umowy",
    tco: "Alokacja TCO",
    informal_bypass: "Zakup poza zatwierdzonym procesem",
  },
  assumptions: {
    contractValue: "Wartość kontraktu",
    dailyCostOfInaction: "Dzienny koszt zwłoki",
    pathCompetitionDiffers: "Czy konkurencja między ścieżkami się różni",
    competitionDisadvantagedAlternative:
      "Wariant z ograniczonym dostępem dostawców",
    competitionTransferRate: "Zakres transferu konkurencji",
    amendmentDifferential: "Różnica kosztu aneksów",
    tcoDifferential: "Różnica alokacji TCO",
    bypass: "Zakup poza zatwierdzonym procesem",
  },
  roles: {
    requestor: "Wnioskodawca biznesowy",
    buyer: "Kupiec",
    lawyer: "Prawnik",
    finance: "Finanse",
    manager: "Kierownik",
    executive: "Zarząd",
    unknown: "Inna rola",
  },
  migration: {
    native: "Natywny rekord modelu 2.3",
    exact: "Dokładnie przeniesiony stary odnośnik",
    partial: "Częściowo przeniesiony odnośnik po jawnym potwierdzeniu",
  },
  migrationDispositions: {
    materialised: "Zmaterializowano",
    retained_only: "Zachowano wyłącznie w audycie",
    blocked: "Zablokowano",
  },
  migrationSourceClasses: {
    post_migration_user_edit: "Edycja użytkownika po migracji",
  },
  evidenceClasses: {
    empirical_anchor: "Kotwica empiryczna",
    official_case: "Przypadek urzędowy",
    practitioner_observation: "Obserwacja praktyka",
    illustrative_scenario: "Scenariusz ilustracyjny",
    research_hypothesis: "Hipoteza badawcza",
    retained_legacy_assumption: "Przeniesione założenie modelu 2.2.2",
    user_input: "Dane podane przez użytkownika",
    legal_rule: "Reguła prawna",
  },
  words: {
    yes: "tak",
    no: "nie",
    included: "ujęty",
    notMonetized: "niemonetyzowany",
    noEvidenceIds: "brak identyfikatorów dowodów",
    notApplicable: "nie dotyczy",
    noPostMigrationEdits: "Brak edycji po migracji",
  },
  sign: {
    positive: (amount: string) =>
      `Formalna ścieżka sekwencyjna kosztuje o ${amount} więcej.`,
    negative: (amount: string) =>
      `Formalna ścieżka sekwencyjna kosztuje o ${amount} mniej.`,
    zero:
      "Obie alternatywy mają taki sam centralny koszt całkowity.",
    crossingZero:
      "Zewnętrzny zakres obejmuje zero i oba znaki. Samo to nie dowodzi zmiany znaku przy wspólnych założeniach dla obu wariantów.",
  },
  date: (day: number, month: string, year: number) =>
    `${day} ${month} ${year}`,
  months: {
    "01": "stycznia",
    "02": "lutego",
    "03": "marca",
    "04": "kwietnia",
    "05": "maja",
    "06": "czerwca",
    "07": "lipca",
    "08": "sierpnia",
    "09": "września",
    "10": "października",
    "11": "listopada",
    "12": "grudnia",
  },
} as const;

type ResearchExportV2Shape = LangShape<typeof researchExportV2Pl>;

const researchExportV2En = {
  title: "Procurement decision record",
  sections: {
    metadata: "Metadata",
    context: "Shared context",
    designs: "Alternative designs",
    workflowSteps: "Procurement workflow steps",
    results: "Results",
    drivers: "Cost-driver analysis",
    coverage: "Monetisation coverage",
    nonMonetized: "Non-monetised dimensions",
    assumptions: "Assumptions",
    calculationAnchors: "Calculation anchors",
    internalEvidence: "Internal workflow provenance",
    externalEvidence: "External evidence",
    retainedAssumptions: "Retained model 2.2.2 assumptions",
    legalProvenance: "Legal provenance",
    migration: "Input migration",
    migrationAudit: "Retained legacy input audit",
    postMigrationEdits: "Post-migration edits",
  },
  fields: {
    schemaVersion: "Schema version",
    modelVersion: "Model version",
    calibrationId: "Calibration identifier",
    legalRulesetId: "Legal ruleset identifier",
    scenarioId: "Scenario identifier",
    scenario: "Scenario",
    currency: "Currency",
    locale: "Export language",
    exportedAt: "Exported on",
    workflowDesign: "Procurement workflow design",
    contractDesign: "Contract design",
    activeDays: "Active work days",
    queueDays: "Waiting days",
    elapsedDays: "Elapsed duration",
    roleCost: "Role cost",
    nonLabourCost: "Non-labour cost",
    delayCost: "Delay cost",
    contractCost: "Contract-design cost",
    totalCost: "Total cost",
    deltaCost: "Cost difference",
    outerEnvelope: "Outer difference range",
    evidenceStatus: "Evidence status",
    supportedClaim: "Claim supported by the source",
    unsupportedClaim: "What the source does not support",
    population: "Jurisdiction or population",
    source: "Source",
    provision: "Legal provision",
    occurrences: "Workflow occurrences",
    status: "Status",
    sourceSchemaVersion: "Source schema version",
    legacyScenarioId: "Legacy scenario identifier",
    fieldsRequiringConfirmation: "Fields requiring confirmation",
    confirmed: "Confirmed",
    field: "Field",
    value: "Value",
    alternative: "Alternative",
    driver: "Driver",
    assumption: "Assumption",
    path: "Data path",
    evidenceIds: "Evidence identifiers",
    constructs: "Constructs",
    predecessorIds: "Predecessor identifiers",
    criticalPathCases: "Critical-path cases",
    stepKind: "Step kind",
    disposition: "Migration disposition",
    retainedValue: "Retained value",
    changedFromLegacyScenario: "Changed from legacy scenario",
    materializedPaths: "Materialised paths",
    sourceClass: "Source class",
    sourceField: "Source field",
    role: "Role",
    roleHourlyRates: "Role hourly rates",
    hourlyRate: "Hourly rate",
    beforeEdit: "Before edit",
    afterEdit: "After edit",
    before: "Before",
    after: "After",
    beforeEvidence: "Before evidence",
    afterEvidence: "After evidence",
    provenance: "Provenance",
    originalDisposition: "Original migration disposition",
  },
  axes: {
    legalGovernanceBoundary: "Legal and governance boundary",
    procedureFamily: "Procedure family",
    purchaseArchetype: "Purchase archetype",
    executionChannel: "Purchase execution channel",
    systemSupport: "System support",
    initiatedOn: "Initiated on",
  },
  axisValues: {
    private_policy: "Private-sector procurement policy",
    public_internal_rules: "Public-sector internal procurement rules",
    pzp_classic_national: "PZP: classic procurement below EU thresholds",
    pzp_classic_eu: "PZP: classic procurement at or above EU thresholds",
    private_competitive: "Private competitive procedure",
    private_negotiated: "Private negotiated procedure",
    public_internal_competitive:
      "Public-sector internal competitive procedure",
    pzp_basic: "Basic procedure",
    pzp_open: "Open procedure",
    pzp_restricted: "Restricted procedure",
    framework_calloff: "Framework call-off",
    custom_lawful: "Other lawful procedure",
    standardized_recurring: "Standardised recurring purchase",
    incomplete_requirement: "Purchase with an incomplete requirement",
    complex_service: "Complex service",
    continuity_critical: "Continuity-critical purchase",
    capital_investment: "Capital investment",
    sourcing_event: "Sourcing event",
    catalog_calloff: "Catalogue call-off",
    mrp_release: "MRP purchase release",
    custom: "Other execution channel",
    manual: "Manual processing",
    sourcing_platform: "Sourcing platform",
    transactional_erp: "Transactional ERP/P2P",
    integrated_source_to_pay: "Integrated source-to-pay",
  },
  alternatives: {
    formalSequential: "Formal sequential alternative",
    adaptiveCompliant: "Adaptive compliant alternative",
  },
  range: {
    low: "Low",
    central: "Central",
    high: "High",
  },
  drivers: {
    role_cost: "Role cost",
    non_labour_cost: "Non-labour cost",
    delay_cost: "Delay cost",
    competition_transfer: "Competition-price transfer",
    contract_amendment: "Contract amendments",
    tco: "TCO allocation",
    informal_bypass: "Off-process purchasing",
  },
  assumptions: {
    contractValue: "Contract value",
    dailyCostOfInaction: "Daily cost of delay",
    pathCompetitionDiffers: "Whether competition differs between alternatives",
    competitionDisadvantagedAlternative:
      "Alternative with restricted supplier access",
    competitionTransferRate: "Competition-transfer range",
    amendmentDifferential: "Contract-amendment cost difference",
    tcoDifferential: "TCO-allocation difference",
    bypass: "Off-process purchasing",
  },
  roles: {
    requestor: "Business requestor",
    buyer: "Buyer",
    lawyer: "Lawyer",
    finance: "Finance",
    manager: "Manager",
    executive: "Executive",
    unknown: "Other role",
  },
  migration: {
    native: "Native model 2.3 record",
    exact: "Exactly migrated legacy link",
    partial: "Partially migrated link after explicit confirmation",
  },
  migrationDispositions: {
    materialised: "Materialised",
    retained_only: "Retained in the audit only",
    blocked: "Blocked",
  },
  migrationSourceClasses: {
    post_migration_user_edit: "User edit after migration",
  },
  evidenceClasses: {
    empirical_anchor: "Empirical anchor",
    official_case: "Official case",
    practitioner_observation: "Practitioner observation",
    illustrative_scenario: "Illustrative scenario",
    research_hypothesis: "Research hypothesis",
    retained_legacy_assumption: "Retained model 2.2.2 assumption",
    user_input: "User-supplied input",
    legal_rule: "Legal rule",
  },
  words: {
    yes: "yes",
    no: "no",
    included: "included",
    notMonetized: "not monetised",
    noEvidenceIds: "no evidence identifiers",
    notApplicable: "not applicable",
    noPostMigrationEdits: "No post-migration edits",
  },
  sign: {
    positive: (amount: string) =>
      `The formal sequential alternative costs ${amount} more.`,
    negative: (amount: string) =>
      `The formal sequential alternative costs ${amount} less.`,
    zero: "Both alternatives have the same central total cost.",
    crossingZero:
      "The outer range crosses zero. This alone does not prove a sign reversal under shared assumptions.",
  },
  date: (day: number, month: string, year: number) =>
    `${day} ${month} ${year}`,
  months: {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  },
} satisfies ResearchExportV2Shape;

export const researchExportV2T = {
  pl: researchExportV2Pl,
  en: researchExportV2En,
} as const;

const replicationPackageV2Pl = {
  title: "Pakiet replikacyjny ProcuraCost 2.3",
  rangeNote: "Deklarowane zakresy nie są przedziałami ufności.",
  evidenceNote: "Wyniki deterministyczne nie są estymatami empirycznymi.",
  sections: {
    comparison: "Porównanie kosztów",
    coverageAnchors: "Kotwice zakresu monetyzacji",
    nonMonetizedDimensions: "Wymiary niemonetyzowane",
    migrationStatus: "Status migracji",
    legalProvenance: "Pochodzenie reguł prawnych",
  },
  fields: {
    deltaOperation: "Operacja różnicy",
    centralDifference: "Centralna różnica kosztu",
    outerEnvelope: "Zewnętrzny zakres różnicy",
  },
  none: "Brak",
} as const;

type ReplicationPackageV2Shape = LangShape<typeof replicationPackageV2Pl>;

const replicationPackageV2En = {
  title: "ProcuraCost 2.3 replication package",
  rangeNote: "Declared ranges are not confidence intervals.",
  evidenceNote: "Deterministic outputs are not empirical estimates.",
  sections: {
    comparison: "Cost comparison",
    coverageAnchors: "Coverage anchors",
    nonMonetizedDimensions: "Non-monetised dimensions",
    migrationStatus: "Migration status",
    legalProvenance: "Legal provenance",
  },
  fields: {
    deltaOperation: "Difference operation",
    centralDifference: "Central cost difference",
    outerEnvelope: "Outer difference range",
  },
  none: "None",
} satisfies ReplicationPackageV2Shape;

export const replicationPackageV2T = {
  pl: replicationPackageV2Pl,
  en: replicationPackageV2En,
} as const;

const siteMetadataPl = {
  root: {
    title: "ProcuraCost: porównanie projektów procesu zakupowego",
    description: `Porównaj dwa dopuszczalne projekty przebiegu procesu na deklarowanych założeniach modelu ${MODEL_V2_METADATA.modelVersion}.`,
  },
  home: {
    title: "ProcuraCost | Porównanie kosztów procesu zakupowego",
    description:
      "Porównaj czas i koszt dwóch sposobów przeprowadzenia zakupu. Dostosuj czynności, stawki pracy i koszt zwłoki. Pobierz wynik z założeniami.",
  },
  calculator: {
    title: "Kalkulator procesu zakupowego | ProcuraCost",
    description:
      "Oblicz koszty pracy, oczekiwania i organizacji zakupu dla dwóch przebiegów. Edytuj założenia i pobierz porównanie w PDF, CSV lub JSON.",
  },
  mechanismsEvidence: {
    title: "Mechanizmy i źródła | ProcuraCost",
    description:
      "Rejestr mechanizmów zakupowych z jawnym rozdzieleniem materiału źródłowego, założeń i wyników modelu.",
  },
  processDesignProfile: {
    title: `Profil projektu procesu zakupowego | ProcuraCost ${MODEL_V2_METADATA.modelVersion}`,
    description:
      "Opisowy profil sekwencyjności i adaptacyjności projektu procesu; nie jest audytem ani walidowanym testem.",
  },
} as const;

type SiteMetadataShape = LangShape<typeof siteMetadataPl>;

const siteMetadataEn = {
  root: {
    title: "ProcuraCost: procurement workflow design comparison",
    description: `Compare two lawful workflow designs under the declared assumptions of model ${MODEL_V2_METADATA.modelVersion}.`,
  },
  home: {
    title: "ProcuraCost | Procurement workflow cost comparison",
    description:
      "Compare the time and cost of two procurement workflows. Adjust activities, staff rates and delay costs. Download the result with its assumptions.",
  },
  calculator: {
    title: "Procurement workflow calculator | ProcuraCost",
    description:
      "Calculate staff, waiting and process costs for two procurement workflows. Edit the assumptions and download a PDF, CSV or JSON comparison.",
  },
  mechanismsEvidence: {
    title: "Mechanisms and evidence | ProcuraCost",
    description:
      "A procurement-mechanism register that separates source material, assumptions and model outputs.",
  },
  processDesignProfile: {
    title: `Procurement process design profile | ProcuraCost ${MODEL_V2_METADATA.modelVersion}`,
    description:
      "A descriptive profile of sequencing and adaptability in workflow design; not an audit or validated test.",
  },
} satisfies SiteMetadataShape;

export const siteMetadataT = {
  pl: siteMetadataPl,
  en: siteMetadataEn,
} as const;

const modelOverviewPl = {
  metadata: {
    title: "Centrum badawcze | ProcuraCost",
    description:
      "Kontrakt obliczeniowy, zakres dowodowy i ograniczenia modelu ProcuraCost 2.3.",
  },
  eyebrow: `Model ${MODEL_V2_METADATA.modelVersion}`,
  title: "Centrum badawcze",
  intro:
    "Tu można prześledzić kontrakt obliczeniowy, źródła, ograniczenia i materiały potrzebne do odtworzenia modelu 2.3. ProcuraCost nie wybiera procedury za użytkownika i nie zakłada kierunku różnicy kosztu.",
  groups: {
    contract: {
      eyebrow: "Kontrakt modelu",
      title: "Co model liczy i na jakich warunkach",
      items: {
        assumptions: {
          title: "Założenia",
          body: "Wersjonowane parametry, zakresy i status dowodowy każdej wartości.",
        },
        methodology: {
          title: "Metoda obliczeń",
          body: "Jak dane wejściowe są sprawdzane, przeliczane i zapisywane w wyniku.",
        },
        evidence: {
          title: "Mechanizmy i źródła",
          body: "Jawne rozdzielenie twierdzeń źródłowych, założeń i wyników modelu.",
        },
      },
    },
    reproducibility: {
      eyebrow: "Badanie i replikacja",
      title: "Od hipotezy do odtworzonego wyniku",
      items: {
        paper: {
          title: "Agenda i artykuł badawczy",
          body: "Pytania, hipotezy i granice wnioskowania empirycznego.",
        },
        repository: {
          title: "Kod i pakiet replikacyjny",
          body: "Publiczna implementacja, testy oraz deterministyczne artefakty modelu 2.3.",
        },
      },
    },
    context: {
      eyebrow: "Kontekst zastosowania",
      title: "Materiały poza rachunkiem kosztu",
      items: {
        practice: {
          title: "Materiał praktyczny",
          body: "Pytania o tarcie procesu, wymagania, odpowiedzialność i adopcję.",
        },
        team: {
          title: "Zespół",
          body: "Role i kompetencje osób rozwijających projekt.",
        },
      },
    },
  },
  sections: {
    legalBoundary: {
      label: "01 / wspólna granica",
      title: "Ramy prawne i ład zakupowy",
      body:
        "Obie alternatywy korzystają z tej samej rodziny procedury, daty wszczęcia i reguł prawnych. Obowiązkowe terminy PZP są zablokowane, udokumentowane i identyczne po obu stronach porównania.",
    },
    workflowDesign: {
      label: "02 / dwa projekty",
      title: "Przebieg procesu i konstrukcja umowy",
      body:
        "Każda alternatywa ma własną mapę czynności i zależności oraz zakresy czasu pracy, oczekiwania i kosztów nieosobowych. Konstrukcja umowy pozostaje osobnym wymiarem i nie jest zastępowana etykietą technologii.",
    },
    costRecord: {
      label: "03 / jawny rachunek",
      title: "Rekord kosztu i pokrycia",
      body:
        "Silnik sumuje koszt pracy ról, koszt nieosobowy, koszt zwłoki oraz wyłącznie jawnie monetyzowane wymiary kontraktowe. Rekord pokazuje też czynniki nieobjęte wyceną i źródło każdego założenia.",
    },
    evidenceBoundary: {
      label: "04 / granica wnioskowania",
      title: "Założenia, źródła i obserwacje praktyczne",
      body:
        "Dowody zewnętrzne, założenia przeniesione i obserwacje praktyczne mają odrębne statusy. Materiał Procurement&Beyond pomaga projektować pytania o wdrożenie, ale nie ustala parametrów ani zakresów modelu kosztowego.",
    },
  },
  rangeTitle: "Jak czytać wynik",
  rangeDisclosure:
    "Delta oznacza koszt alternatywy formalnej i sekwencyjnej pomniejszony o koszt alternatywy adaptacyjnej i zgodnej. Zakres niski, centralny i wysoki jest deklarowanym stresem scenariuszowym, a nie oszacowaniem prawdopodobieństwa. Zewnętrzny zakres łączy przeciwne krańce kosztów obu wariantów. Przecięcie zera nie dowodzi zmiany znaku przy wspólnych założeniach.",
  actionsTitle: "Materiały do decyzji",
  actions: {
    assumptions: "Rejestr założeń",
    methodology: "Metoda obliczeń",
    evidence: "Mechanizmy i źródła",
    practice: "Procurement&Beyond, odcinek 8",
  },
} as const;

type ModelOverviewShape = LangShape<typeof modelOverviewPl>;

const modelOverviewEn = {
  metadata: {
    title: "Research centre | ProcuraCost",
    description:
      "Calculation contract, evidence boundary and limitations of ProcuraCost model 2.3.",
  },
  eyebrow: `Model ${MODEL_V2_METADATA.modelVersion}`,
  title: "Research centre",
  intro:
    "Trace the calculation contract, evidence, limitations and materials needed to reproduce model 2.3. ProcuraCost does not select a procedure for the user or assume the direction of the cost difference.",
  groups: {
    contract: {
      eyebrow: "Model contract",
      title: "What the model calculates and under which conditions",
      items: {
        assumptions: {
          title: "Assumptions",
          body: "Versioned parameters, ranges and the evidence status of each value.",
        },
        methodology: {
          title: "Calculation method",
          body: "How the inputs are checked, calculated and recorded with the result.",
        },
        evidence: {
          title: "Mechanisms and evidence",
          body: "An explicit separation of source claims, assumptions and model outputs.",
        },
      },
    },
    reproducibility: {
      eyebrow: "Research and replication",
      title: "From hypothesis to reproduced result",
      items: {
        paper: {
          title: "Research agenda and paper",
          body: "Questions, hypotheses and the limits of empirical inference.",
        },
        repository: {
          title: "Code and replication package",
          body: "The public implementation, tests and deterministic model 2.3 artefacts.",
        },
      },
    },
    context: {
      eyebrow: "Application context",
      title: "Materials outside the cost calculation",
      items: {
        practice: {
          title: "Practitioner material",
          body: "Questions about process friction, requirements, accountability and adoption.",
        },
        team: {
          title: "Team",
          body: "The roles and competencies of the people developing the project.",
        },
      },
    },
  },
  sections: {
    legalBoundary: {
      label: "01 / shared boundary",
      title: "Legal and governance boundary",
      body:
        "Both alternatives use the same procedure family, initiation date and legal rules. Mandatory PZP periods are locked, documented and identical on both sides of the comparison.",
    },
    workflowDesign: {
      label: "02 / two designs",
      title: "Workflow and contract design",
      body:
        "Each alternative has its own map of activities, dependencies, effort, waiting and non-labour cost. Contract design remains a separate dimension and is not replaced by a technology label.",
    },
    costRecord: {
      label: "03 / explicit calculation",
      title: "Cost and coverage record",
      body:
        "The engine adds role effort, non-labour cost, delay cost and only explicitly monetised contract dimensions. The record also identifies factors outside monetisation and the source of each assumption.",
    },
    evidenceBoundary: {
      label: "04 / inference boundary",
      title: "Assumptions, sources and practitioner observations",
      body:
        "External evidence, retained assumptions and practitioner observations have separate statuses. Procurement&Beyond material informs implementation questions but does not set cost-model parameters or ranges.",
    },
  },
  rangeTitle: "How to read the result",
  rangeDisclosure:
    "Delta is the cost of the formal sequential alternative minus the cost of the adaptive compliant alternative. Low, central and high values form a declared scenario stress range, not a probability estimate. The outer range combines opposite endpoints of the two alternatives. Crossing zero alone does not establish a sign reversal under shared assumptions.",
  actionsTitle: "Decision materials",
  actions: {
    assumptions: "Assumptions register",
    methodology: "Calculation method",
    evidence: "Mechanisms and evidence",
    practice: "Procurement&Beyond episode 8",
  },
} satisfies ModelOverviewShape;

export const modelOverviewT = {
  pl: modelOverviewPl,
  en: modelOverviewEn,
} as const;

const methodologyOverviewPl = {
  metadata: {
    title: "Metodologia modelu 2.3 | ProcuraCost",
    description:
      "Deterministyczne porównanie dwóch dopuszczalnych projektów procesu zakupowego.",
  },
  eyebrow: `Metodologia / model ${MODEL_V2_METADATA.modelVersion}`,
  title: "Metoda porównania bez zaszytego kierunku wyniku",
  intro:
    "Model rozdziela zgodność prawną, projekt przebiegu procesu, konstrukcję umowy, kanał realizacji i wsparcie systemowe. Każda z tych decyzji pozostaje widoczna w rekordzie.",
  steps: [
    {
      title: "Ustal wspólną granicę",
      body: "Wybierz ramy prawne i ład zakupowy, rodzinę procedury oraz datę wszczęcia. Kontekst spoza obsługiwanego zakresu jest odrzucany, a nie uzupełniany domysłem.",
    },
    {
      title: "Zaprojektuj obie mapy",
      body: "Dla każdej alternatywy zdefiniuj czynności, poprzedniki, pracę aktywną, oczekiwanie, role i koszt nieosobowy. Czas wynika z najdłuższej ścieżki w grafie zależności.",
    },
    {
      title: "Zablokuj reguły prawne",
      body: "Wymagane terminy są rozwiązywane z wersjonowanego zbioru reguł, mają jawne pochodzenie i nie podlegają skróceniu przez wsparcie systemowe.",
    },
    {
      title: "Oblicz każdą alternatywę",
      body: "Koszt całkowity obejmuje pracę ról, koszt nieosobowy, iloczyn czasu i dziennego kosztu zwłoki oraz jawnie wycenione elementy konstrukcji umowy.",
    },
    {
      title: "Zapisz granice wyniku",
      body: "Rekord decyzji zachowuje osie, oba projekty, pokrycie monetyzacji, wymiary niemonetyzowane, założenia, źródła, pochodzenie prawne i historię migracji.",
    },
  ],
  examplesTitle: "Kiedy adaptacja wnosi wartość, a kiedy nie jest potrzebna",
  examplesIntro:
    "Scenariusze są przykładami mechanizmów, nie rekomendacjami ani dowodem wyniku. Pokazują warunki, które należy sprawdzić przed zaprojektowaniem przebiegu zakupu.",
  exampleGroups: {
    adaptiveUse: {
      title: "Warunki uzasadniające pracę adaptacyjną",
      items: [
        {
          scenarioId: "erp_transformation_discovery",
          title: "Transformacja ERP z niepełnym wymaganiem",
          body: "Iteracyjne rozpoznanie integracji i potrzeb użytkowników ma sens, gdy rozwiązania docelowego nie da się rzetelnie opisać przed kontaktem z rynkiem.",
        },
        {
          scenarioId: "logistics_service_redesign",
          title: "Przeprojektowanie usługi logistycznej",
          body: "Adaptacja pomaga, gdy model operacyjny, SLA i podział odpowiedzialności wymagają wspólnej weryfikacji. Sam scenariusz nie przesądza o niższym koszcie.",
        },
        {
          scenarioId: "public_it_open_with_market_consultation",
          title: "Publiczne IT z wstępnymi konsultacjami rynkowymi",
          body: "Konsultacje mogą doprecyzować potrzebę przed przetargiem nieograniczonym. Ustawowe terminy składania ofert i obowiązkowe terminy przed zawarciem umowy pozostają jednakowe dla obu alternatyw.",
        },
        {
          scenarioId: "discovery_solution_codesign",
          title: "Współprojektowanie rozwiązania",
          body: "Uczenie się z rynkiem może celowo zwiększyć czas i nakład pracy. Jest uzasadnione tylko wtedy, gdy wartość informacji przewyższa koszt tej dodatkowej pracy.",
        },
      ],
    },
    stableUse: {
      title: "Warunki, w których dodatkowa adaptacja nie rozwiązuje problemu",
      items: [
        {
          scenarioId: "stable_private_standard_service",
          title: "Stabilna usługa standardowa",
          body: "Przy znanym wymaganiu i powtarzalnym rynku najpierw należy uprościć przebieg i kontrolę, zamiast dodawać etap rozpoznania bez wskazanego ryzyka.",
        },
        {
          scenarioId: "stable_capex_replacement",
          title: "Odtworzeniowa inwestycja CAPEX",
          body: "Znana specyfikacja i istotne bramki inwestycyjne mogą uzasadniać sekwencyjne decyzje. Wsparcie systemowe nie usuwa wartości kontroli właścicielskiej.",
        },
        {
          scenarioId: "catalog_calloff_control / mrp_release_control",
          title: "Realizacja z katalogu albo MRP",
          body: "Dostawca, cena i warunki są już zakontraktowane. Właściwym problemem jest sprawna realizacja transakcji i obsługa wyjątków, nie ponowne projektowanie postępowania zakupowego.",
        },
      ],
    },
  },
  deltaTitle: "Tożsamość porównania",
  deltaIdentity:
    "ΔC = koszt alternatywy formalnej i sekwencyjnej − koszt alternatywy adaptacyjnej i zgodnej",
  deltaExplanation:
    "Zamiana alternatyw odwraca znak delty i jej zewnętrzny zakres. Test nie narzuca liczby przypadków po żadnej stronie zera.",
  rangeBoundary:
    "Zakres niski, centralny i wysoki jest deklarowanym zakresem scenariusza, nie przedziałem ufności ani prognozą prawdopodobieństwa.",
  legalTitle: "Granica prawna",
  legalBoundary:
    "Model obsługuje wskazane zakupy klasyczne. Konteksty sektorowe oraz obronności i bezpieczeństwa są celowo odrzucane. Dobór procedury szczególnej nadal wymaga oceny przesłanek przez właściwą osobę.",
  practitionerTitle: "Granica materiału praktycznego",
  practitionerBoundary:
    "Obserwacje z Procurement&Beyond, odcinek 8, wspierają pytania o tarcie procesu, właścicielstwo, wymagania, TCO i odpowiedzialną automatyzację. Nie są dowodem skuteczności wdrożeń i nie kalibrują modelu kosztowego.",
  actions: {
    model: "Model i założenia",
    calculator: "Kalkulator",
    practice: "Materiał praktyczny",
    research: "Artykuł badawczy i bibliografia",
  },
} as const;

type MethodologyOverviewShape = LangShape<typeof methodologyOverviewPl>;

const methodologyOverviewEn = {
  metadata: {
    title: "Model 2.3 methodology | ProcuraCost",
    description:
      "Deterministic comparison of two lawful procurement workflow designs.",
  },
  eyebrow: `Methodology / model ${MODEL_V2_METADATA.modelVersion}`,
  title: "A comparison method without a built-in result direction",
  intro:
    "The model separates legal compliance, procurement workflow design, contract design, execution channel and system support. Each decision remains visible in the record.",
  steps: [
    {
      title: "Set the shared boundary",
      body: "Select the legal and governance boundary, procedure family and initiation date. Context outside the supported scope is rejected rather than completed by assumption.",
    },
    {
      title: "Design both maps",
      body: "For each alternative, define activities, predecessors, active work, waiting, roles and non-labour cost. Duration follows the longest path through the dependency graph.",
    },
    {
      title: "Lock legal rules",
      body: "Required periods are resolved from a versioned ruleset, retain explicit provenance and cannot be shortened by system support.",
    },
    {
      title: "Calculate each alternative",
      body: "Total cost comprises role effort, non-labour cost, elapsed time multiplied by the declared daily cost of inaction, and explicitly priced contract-design elements.",
    },
    {
      title: "Record the result boundary",
      body: "The decision record preserves axes, both designs, monetisation coverage, non-monetised dimensions, assumptions, sources, legal provenance and migration history.",
    },
  ],
  examplesTitle: "When adaptation adds value and when it is unnecessary",
  examplesIntro:
    "The scenarios illustrate mechanisms rather than recommendations or observed outcomes. They show conditions to test before designing the procurement workflow.",
  exampleGroups: {
    adaptiveUse: {
      title: "Conditions that justify adaptive work",
      items: [
        {
          scenarioId: "erp_transformation_discovery",
          title: "ERP transformation with an incomplete requirement",
          body: "Iterative discovery of integrations and user needs is relevant when the target solution cannot be specified responsibly before market engagement.",
        },
        {
          scenarioId: "logistics_service_redesign",
          title: "Logistics service redesign",
          body: "Adaptation helps when the operating model, service levels and allocation of responsibility need joint validation. The scenario does not establish lower cost.",
        },
        {
          scenarioId: "public_it_open_with_market_consultation",
          title: "Public IT with preliminary market consultation",
          body: "Consultation can clarify the need before an open procedure. Statutory submission and standstill periods remain identical for both alternatives.",
        },
        {
          scenarioId: "discovery_solution_codesign",
          title: "Solution co-design",
          body: "Learning with the market can deliberately add time and effort. It is justified only when the value of information exceeds the cost of that additional work.",
        },
      ],
    },
    stableUse: {
      title: "Conditions where more adaptation does not address the problem",
      items: [
        {
          scenarioId: "stable_private_standard_service",
          title: "Stable standard service",
          body: "With a known requirement and repeatable market, simplify workflow and controls before adding discovery without a defined risk.",
        },
        {
          scenarioId: "stable_capex_replacement",
          title: "Replacement capital investment",
          body: "A known specification and material investment gates may justify sequential decisions. System support does not remove the value of accountable control.",
        },
        {
          scenarioId: "catalog_calloff_control / mrp_release_control",
          title: "Catalogue or MRP execution",
          body: "Supplier, price and terms are already contracted. The relevant problem is efficient transaction execution and exception handling, not redesigning sourcing.",
        },
      ],
    },
  },
  deltaTitle: "Comparison identity",
  deltaIdentity:
    "ΔC = cost of the formal sequential alternative − cost of the adaptive compliant alternative",
  deltaExplanation:
    "Swapping the alternatives reverses the delta and its outer range. The test imposes no quota on either side of zero.",
  rangeBoundary:
    "Low, central and high values form a declared scenario range, not a confidence interval or probability forecast.",
  legalTitle: "Legal boundary",
  legalBoundary:
    "The model supports the stated classic procurement contexts. Sectoral, defence and security contexts fail closed. Selecting a special procedure still requires assessment of its legal grounds by an authorised person.",
  practitionerTitle: "Practitioner-material boundary",
  practitionerBoundary:
    "Observations from Procurement&Beyond episode 8 inform questions about process friction, ownership, requirements, TCO and responsible automation. They are not evidence of implementation effectiveness and do not calibrate the cost model.",
  actions: {
    model: "Model and assumptions",
    calculator: "Calculator",
    practice: "Practitioner material",
    research: "Working paper and references",
  },
} satisfies MethodologyOverviewShape;

export const methodologyOverviewT = {
  pl: methodologyOverviewPl,
  en: methodologyOverviewEn,
} as const;

const pdfExportV2Pl = {
  title: "Rekord decyzji modelu ProcuraCost 2.3",
  pageLabel: (page: number, total: number) => `Strona ${page} z ${total}`,
  sections: {
    metadata: "Metadane rekordu",
    context: "Wspólny kontekst",
    alternatives: "Porównywane alternatywy",
    results: "Wyniki i zakres",
    drivers: "Czynniki kosztowe",
    coverage: "Zakres monetyzacji",
    nonMonetized: "Wymiary niemonetyzowane",
    assumptions: "Założenia",
    calculationAnchors: "Kotwice obliczeniowe",
    internalEvidence: "Wewnętrzne pochodzenie map przebiegu",
    evidence: "Dowody zewnętrzne",
    retainedAssumptions: "Przeniesione założenia",
    legalProvenance: "Pochodzenie reguł prawnych",
    migration: "Migracja danych wejściowych",
    postMigrationEdits: "Edycje po migracji",
  },
  renderer: {
    range: {
      low: "Niski",
      central: "Centralny",
      high: "Wysoki",
    },
    rangeKinds: {
      fixed: "Stała wartość",
      calibrated: "Skalibrowany",
      stress: "Zakres skrajny",
    },
    alternatives: {
      formalSequential: "Formalna ścieżka sekwencyjna",
      adaptiveCompliant: "Adaptacyjna ścieżka zgodna z ramami",
    },
    fields: {
      id: "Identyfikator",
      labelKey: "Klucz etykiety",
      userLabel: "Nazwa użytkownika",
      value: "Wartość",
      workflowDesign: "Projekt przebiegu procesu zakupowego",
      contractDesign: "Konstrukcja umowy",
      activeDays: "Dni pracy aktywnej",
      queueDays: "Dni oczekiwania",
      elapsedDays: "Czas trwania",
      totalCost: "Koszt całkowity",
      roleHours: "Godziny pracy ról",
      roleHourlyRates: "Stawki godzinowe ról",
      hourlyRate: "Stawka godzinowa",
      postMigrationEdits: "Edycje po migracji",
      beforeEdit: "Przed edycją",
      afterEdit: "Po edycji",
      originalDisposition: "Pierwotna dyspozycja migracyjna",
      nonLabourCost: "Koszt pozapłacowy",
      predecessorIds: "Identyfikatory poprzedników",
      stepKind: "Rodzaj kroku",
      criticalPathCases: "Warianty ścieżki krytycznej",
      lockedLegalWait: "Zablokowany termin prawny",
      contribution: "Wkład w różnicę kosztu",
      status: "Status",
      reasons: "Powody",
      evidenceStatus: "Status dowodu",
      evidenceClass: "Klasa dowodowa",
      evidenceIds: "Identyfikatory dowodów",
      supportedClaim: "Zakres wspierany przez źródło",
      unsupportedClaim: "Czego źródło nie wspiera",
      population: "Jurysdykcja lub populacja",
      constructs: "Konstrukty",
      assumptionKeys: "Klucze założeń",
      source: "Źródło",
      path: "Ścieżka danych",
      detail: "Szczegóły",
      legalRulesetId: "Identyfikator zbioru reguł prawnych",
      ruleId: "Identyfikator reguły",
      provision: "Podstawa prawna",
      initiatedOn: "Data wszczęcia",
      lockedActiveDays: "Zablokowane dni pracy aktywnej",
      lockedQueueDays: "Zablokowane dni oczekiwania",
      occurrences: "Wystąpienia w mapach",
      sourceSchemaVersion: "Wersja schematu źródłowego",
      legacyScenarioId: "Identyfikator starego scenariusza",
      field: "Pole",
      sourceField: "Pole źródłowe",
      disposition: "Dyspozycja migracyjna",
      retainedValue: "Przeniesiona wartość",
      changedFromLegacyScenario: "Zmieniono względem starego scenariusza",
      materializedPaths: "Ścieżki materializacji",
      sourceClass: "Klasa źródła",
      rangeKind: "Rodzaj zakresu",
    },
    values: {
      yes: "tak",
      no: "nie",
      notApplicable: "nie dotyczy",
      none: "brak",
      included: "ujęty",
      notMonetized: "niemonetyzowany",
      locked: "zablokowany",
      noPostMigrationEdits: "Brak edycji po migracji",
    },
    stepKinds: {
      activity: "Czynność",
      approval: "Zatwierdzenie",
      legal_wait: "Obowiązkowe oczekiwanie",
      milestone: "Kamień milowy",
    },
    constructs: {
      workflow_duration: "czas przebiegu procesu",
      role_effort: "nakład pracy ról",
      problem_definition: "zdefiniowanie problemu",
      market_consultation: "konsultacje rynkowe",
      modular_contracting: "modułowa konstrukcja umowy",
      supplier_access: "dostęp dostawców",
      competition_transfer: "transfer konkurencji cenowej",
      contract_adaptability: "zdolność dostosowania umowy",
      contract_amendment: "aneksowanie umowy",
      tco: "całkowity koszt posiadania",
      informal_bypass: "zakup poza zatwierdzonym procesem",
      innovation_procurement: "zamówienia innowacyjne",
    },
    roles: {
      requestor: "Wnioskodawca biznesowy",
      buyer: "Kupiec",
      lawyer: "Prawnik",
      finance: "Finanse",
      manager: "Kierownik",
      executive: "Zarząd",
      unknown: "Inna rola",
    },
    migrationDispositions: {
      materialised: "Zmaterializowano",
      retained_only: "Zachowano wyłącznie w audycie",
      blocked: "Zablokowano",
    },
    migrationSourceClasses: {
      post_migration_user_edit: "Edycja użytkownika po migracji",
    },
  },
  exportedAt: "Data eksportu",
  evidenceIds: "Identyfikatory dowodów",
  lowCentralHigh: "Niski / centralny / wysoki",
} as const;

type PdfExportV2Shape = LangShape<typeof pdfExportV2Pl>;

const pdfExportV2En = {
  title: "ProcuraCost model 2.3 decision record",
  pageLabel: (page: number, total: number) => `Page ${page} of ${total}`,
  sections: {
    metadata: "Record metadata",
    context: "Shared context",
    alternatives: "Compared alternatives",
    results: "Results and range",
    drivers: "Cost drivers",
    coverage: "Monetisation coverage",
    nonMonetized: "Non-monetised dimensions",
    assumptions: "Assumptions",
    calculationAnchors: "Calculation anchors",
    internalEvidence: "Internal workflow provenance",
    evidence: "External evidence",
    retainedAssumptions: "Retained assumptions",
    legalProvenance: "Legal provenance",
    migration: "Input migration",
    postMigrationEdits: "Post-migration edits",
  },
  renderer: {
    range: {
      low: "Low",
      central: "Central",
      high: "High",
    },
    rangeKinds: {
      fixed: "Fixed value",
      calibrated: "Calibrated",
      stress: "Stress range",
    },
    alternatives: {
      formalSequential: "Formal sequential alternative",
      adaptiveCompliant: "Adaptive compliant alternative",
    },
    fields: {
      id: "Identifier",
      labelKey: "Label key",
      userLabel: "User label",
      value: "Value",
      workflowDesign: "Procurement workflow design",
      contractDesign: "Contract design",
      activeDays: "Active work days",
      queueDays: "Waiting days",
      elapsedDays: "Elapsed duration",
      totalCost: "Total cost",
      roleHours: "Role hours",
      roleHourlyRates: "Role hourly rates",
      hourlyRate: "Hourly rate",
      postMigrationEdits: "Post-migration edits",
      beforeEdit: "Before edit",
      afterEdit: "After edit",
      originalDisposition: "Original migration disposition",
      nonLabourCost: "Non-labour cost",
      predecessorIds: "Predecessor identifiers",
      stepKind: "Step kind",
      criticalPathCases: "Critical-path cases",
      lockedLegalWait: "Locked legal wait",
      contribution: "Contribution to cost difference",
      status: "Status",
      reasons: "Reasons",
      evidenceStatus: "Evidence status",
      evidenceClass: "Evidence class",
      evidenceIds: "Evidence identifiers",
      supportedClaim: "Claim supported by the source",
      unsupportedClaim: "What the source does not support",
      population: "Jurisdiction or population",
      constructs: "Constructs",
      assumptionKeys: "Assumption keys",
      source: "Source",
      path: "Data path",
      detail: "Detail",
      legalRulesetId: "Legal ruleset identifier",
      ruleId: "Rule identifier",
      provision: "Legal provision",
      initiatedOn: "Initiated on",
      lockedActiveDays: "Locked active-work days",
      lockedQueueDays: "Locked waiting days",
      occurrences: "Workflow occurrences",
      sourceSchemaVersion: "Source schema version",
      legacyScenarioId: "Legacy scenario identifier",
      field: "Field",
      sourceField: "Source field",
      disposition: "Migration disposition",
      retainedValue: "Retained value",
      changedFromLegacyScenario: "Changed from legacy scenario",
      materializedPaths: "Materialised paths",
      sourceClass: "Source class",
      rangeKind: "Range kind",
    },
    values: {
      yes: "yes",
      no: "no",
      notApplicable: "not applicable",
      none: "none",
      included: "included",
      notMonetized: "not monetised",
      locked: "locked",
      noPostMigrationEdits: "No post-migration edits",
    },
    stepKinds: {
      activity: "Activity",
      approval: "Approval",
      legal_wait: "Mandatory wait",
      milestone: "Milestone",
    },
    constructs: {
      workflow_duration: "workflow duration",
      role_effort: "role effort",
      problem_definition: "problem definition",
      market_consultation: "market consultation",
      modular_contracting: "modular contracting",
      supplier_access: "supplier access",
      competition_transfer: "price-competition transfer",
      contract_adaptability: "contract adaptability",
      contract_amendment: "contract amendment",
      tco: "total cost of ownership",
      informal_bypass: "off-process purchasing",
      innovation_procurement: "innovation procurement",
    },
    roles: {
      requestor: "Business requestor",
      buyer: "Buyer",
      lawyer: "Lawyer",
      finance: "Finance",
      manager: "Manager",
      executive: "Executive",
      unknown: "Other role",
    },
    migrationDispositions: {
      materialised: "Materialised",
      retained_only: "Retained in the audit only",
      blocked: "Blocked",
    },
    migrationSourceClasses: {
      post_migration_user_edit: "User edit after migration",
    },
  },
  exportedAt: "Exported on",
  evidenceIds: "Evidence identifiers",
  lowCentralHigh: "Low / central / high",
} satisfies PdfExportV2Shape;

export const pdfExportV2T = { pl: pdfExportV2Pl, en: pdfExportV2En } as const;

const decisionRecordPl = {
  eyebrow: "Zapis porównania",
  sections: {
    summary: "Różnica kosztu i zakres",
    alternatives: "Porównywane alternatywy",
    drivers: "Analiza czynników kosztowych",
    coverage: "Zakres monetyzacji",
    assumptions: "Założenia rekordu",
    evidence: "Pochodzenie i dowody",
    internalEvidence: "Wewnętrzne pochodzenie map przebiegu",
    externalEvidence: "Dowody zewnętrzne",
    reference: "Porównanie ze scenariuszem referencyjnym",
    actions: "Eksport i nota metodologiczna",
  },
  delta: {
    identity:
      "Koszt formalnej ścieżki sekwencyjnej minus koszt adaptacyjnej ścieżki zgodnej z ramami",
    centralLabel: "Centralna różnica kosztu",
    outerRangeLabel: "Zewnętrzny zakres różnicy",
    positive:
      "Formalna ścieżka sekwencyjna ma wyższy centralny koszt całkowity.",
    negative:
      "Adaptacyjna ścieżka zgodna z ramami ma wyższy centralny koszt całkowity.",
    zero: "Centralne koszty całkowite są równe.",
    crossing:
      "Zewnętrzny zakres obejmuje wartości ujemne i dodatnie. To konserwatywna granica różnicy, a nie dowód zmiany znaku przy wspólnych założeniach dla obu wariantów.",
    touching: "Zewnętrzny zakres dochodzi do zera. Dopuszcza równość kosztów, ale nie obejmuje obu znaków.",
    stable:
      "Znak jest stabilny w podanych zakresach. Nie jest to dowód statystyczny.",
  },
  alternatives: {
    total: "Koszt całkowity",
    duration: "Czas ścieżki krytycznej",
    days: "dni",
    stepCount: "Liczba kroków procesu",
    lockCount: "Zablokowane obowiązkowe oczekiwania",
    steps: "Kroki przebiegu procesu",
    userLabel: "Nazwa nadana przez użytkownika",
    baseLabel: "Nazwa projektu bazowego",
  },
  drivers: {
    formal: "Formalna ścieżka sekwencyjna",
    adaptive: "Adaptacyjna ścieżka zgodna z ramami",
    contribution: "Wkład w różnicę kosztu",
    directionFormal:
      "Ten czynnik zwiększa centralną różnicę po stronie formalnej ścieżki sekwencyjnej.",
    directionAdaptive:
      "Ten czynnik zwiększa centralną różnicę po stronie adaptacyjnej ścieżki zgodnej z ramami.",
    directionEqual:
      "Ten czynnik nie zmienia centralnej różnicy między alternatywami.",
  },
  coverage: {
    included: "Ujęte w sumie pieniężnej",
    nonMonetized: "Raportowane bez monetyzacji",
    contributionRange: "Zakres wkładu w różnicę kosztu",
    evidenceClasses: "Klasy źródeł",
    evidenceIdentifiers: "Identyfikatory dowodów",
    noEvidenceIdentifiers: "Brak identyfikatorów dowodów",
  },
  assumptions: {
    summary: (retained: number, userSupplied: number) =>
      `Przeniesione założenia: ${retained}. Wartości podane przez użytkownika: ${userSupplied}.`,
    context: "Wspólny kontekst zakupu",
    economics: "Założenia ekonomiczne",
    designs: "Projekty alternatyw",
    roleRates: "Stawki godzinowe ról",
    evidenceClass: "Klasa źródła",
    pathCompetitionDiffers:
      "Czy konkurencja cenowa różni się między alternatywami",
    competitionTransferNotApplicable:
      "Zakres transferu konkurencji nie ma zastosowania",
    yes: "tak",
    no: "nie",
  },
  evidence: {
    supported: "Zakres wspierany przez źródło",
    unsupported: "Czego źródło nie wspiera",
    population: "Jurysdykcja lub populacja",
    source: "Źródło",
    publisher: "Wydawca",
    constructs: "Konstrukty użyte w tym rekordzie",
    openSource: "Otwórz źródło w nowej karcie",
    externalLink: (title: string) => `${title}. Otwiera się w nowej karcie.`,
    constructsById: {
      workflow_duration: "czas przebiegu procesu",
      role_effort: "nakład pracy ról",
      problem_definition: "zdefiniowanie problemu",
      market_consultation: "konsultacje rynkowe",
      modular_contracting: "modułowa konstrukcja umowy",
      supplier_access: "dostęp dostawców",
      competition_transfer: "transfer konkurencji cenowej",
      contract_adaptability: "zdolność dostosowania umowy",
      contract_amendment: "aneksowanie umowy",
      tco: "całkowity koszt posiadania",
      informal_bypass: "zakup poza zatwierdzonym procesem",
      innovation_procurement: "zamówienia innowacyjne",
    },
  },
  reference: {
    subtitle: (denominator: string, unit: string) =>
      `Wszystkie przedziały używają jednej skali symetrycznej względem zera. Jej granica wynosi ${denominator} ${unit}.`,
    low: "Niski",
    central: "Centralny",
    high: "Wysoki",
    active: "Aktywny scenariusz",
    other: "Scenariusz referencyjny",
    accessibleRange: (
      scenario: string,
      low: string,
      central: string,
      high: string,
      unit: string
    ) =>
      `${scenario}. Niski: ${low} ${unit}. Centralny: ${central} ${unit}. Wysoki: ${high} ${unit}.`,
  },
  actions: {
    researchLabel: "Pliki rekordu do analizy",
    downloadPdf: "Pobierz PDF",
    downloadJson: "Pobierz JSON",
    downloadCsv: "Pobierz CSV",
    downloadMarkdown: "Pobierz Markdown",
    generatingPdf: "Tworzenie PDF",
    pdfError:
      "Nie udało się utworzyć PDF. Sprawdź połączenie i spróbuj ponownie.",
    methodology:
      "Rekord przedstawia deterministyczne wyniki i zadeklarowane zakresy modelu 2.3. Nie stanowi rekomendacji ani dowodu statystycznego.",
  },
  resultBar: {
    regionLabel: "Ostatnie obliczenie",
    currentLabel: "Wynik bieżących założeń",
    staleLabel: "Wynik poprzednich założeń",
    deltaLabel: "Różnica centralna",
    rangeLabel: "Zewnętrzny zakres różnicy",
    elapsedLabel: "Czas trwania",
    daysUnit: "dni",
    staleNote:
      "Założenia zmieniły się od tego obliczenia. Przelicz, aby zaktualizować zapis porównania.",
    recalculate: "Przelicz",
    openRecord: "Otwórz pełny zapis porównania",
  },
} as const;

type DecisionRecordShape = LangShape<typeof decisionRecordPl>;

const decisionRecordEn = {
  eyebrow: "Decision record",
  sections: {
    summary: "Cost difference and range",
    alternatives: "Compared alternatives",
    drivers: "Cost-driver analysis",
    coverage: "Monetisation coverage",
    assumptions: "Record assumptions",
    evidence: "Provenance and evidence",
    internalEvidence: "Internal workflow provenance",
    externalEvidence: "External evidence",
    reference: "Reference scenario comparison",
    actions: "Exports and methodology note",
  },
  delta: {
    identity:
      "Formal sequential total minus adaptive compliant total",
    centralLabel: "Central cost difference",
    outerRangeLabel: "Outer difference range",
    positive:
      "The formal sequential total is higher at the central assumptions.",
    negative:
      "The adaptive compliant total is higher at the central assumptions.",
    zero: "The central totals are equal.",
    crossing:
      "The outer range crosses zero. This conservative bound does not prove that the sign reverses when both alternatives use the same shared assumptions.",
    touching: "The outer range reaches zero. It permits equal costs but does not contain both signs.",
    stable:
      "The sign is stable within the declared ranges; this is not statistical evidence.",
  },
  alternatives: {
    total: "Total cost",
    duration: "Critical-path duration",
    days: "days",
    stepCount: "Process step count",
    lockCount: "Locked mandatory waits",
    steps: "Procurement workflow steps",
    userLabel: "User-supplied name",
    baseLabel: "Base-design name",
  },
  drivers: {
    formal: "Formal sequential alternative",
    adaptive: "Adaptive compliant alternative",
    contribution: "Contribution to the cost difference",
    directionFormal:
      "This driver increases the central difference on the formal sequential side.",
    directionAdaptive:
      "This driver increases the central difference on the adaptive compliant side.",
    directionEqual:
      "This driver does not change the central difference between the alternatives.",
  },
  coverage: {
    included: "Included in the monetary total",
    nonMonetized: "Reported but not monetised",
    contributionRange: "Contribution range for the cost difference",
    evidenceClasses: "Source classes",
    evidenceIdentifiers: "Evidence identifiers",
    noEvidenceIdentifiers: "No evidence identifiers",
  },
  assumptions: {
    summary: (retained: number, userSupplied: number) =>
      `Retained assumptions: ${retained}. User-supplied values: ${userSupplied}.`,
    context: "Shared purchasing context",
    economics: "Economic assumptions",
    designs: "Alternative designs",
    roleRates: "Role hourly rates",
    evidenceClass: "Source class",
    pathCompetitionDiffers:
      "Whether price competition differs between alternatives",
    competitionTransferNotApplicable:
      "The competition-transfer range is not applicable",
    yes: "yes",
    no: "no",
  },
  evidence: {
    supported: "Claim supported by the source",
    unsupported: "What the source does not support",
    population: "Jurisdiction or population",
    source: "Source",
    publisher: "Publisher",
    constructs: "Constructs used in this record",
    openSource: "Open source in a new tab",
    externalLink: (title: string) => `${title}. Opens in a new tab.`,
    constructsById: {
      workflow_duration: "workflow duration",
      role_effort: "role effort",
      problem_definition: "problem definition",
      market_consultation: "market consultation",
      modular_contracting: "modular contracting",
      supplier_access: "supplier access",
      competition_transfer: "price-competition transfer",
      contract_adaptability: "contract adaptability",
      contract_amendment: "contract amendment",
      tco: "total cost of ownership",
      informal_bypass: "off-process purchasing",
      innovation_procurement: "innovation procurement",
    },
  },
  reference: {
    subtitle: (denominator: string, unit: string) =>
      `Every interval uses one zero-centred scale with a ${denominator} ${unit} outer bound.`,
    low: "Low",
    central: "Central",
    high: "High",
    active: "Active scenario",
    other: "Reference scenario",
    accessibleRange: (
      scenario: string,
      low: string,
      central: string,
      high: string,
      unit: string
    ) =>
      `${scenario}. Low: ${low} ${unit}. Central: ${central} ${unit}. High: ${high} ${unit}.`,
  },
  actions: {
    researchLabel: "Record files for analysis",
    downloadPdf: "Download PDF",
    downloadJson: "Download JSON",
    downloadCsv: "Download CSV",
    downloadMarkdown: "Download Markdown",
    generatingPdf: "Generating PDF",
    pdfError:
      "The PDF could not be created. Check the connection and try again.",
    methodology:
      "The record reports deterministic results and declared model 2.3 ranges. It is neither a recommendation nor statistical evidence.",
  },
  resultBar: {
    regionLabel: "Last calculation",
    currentLabel: "Result for the current assumptions",
    staleLabel: "Result for the previous assumptions",
    deltaLabel: "Central difference",
    rangeLabel: "Outer difference range",
    elapsedLabel: "Elapsed time",
    daysUnit: "days",
    staleNote:
      "The assumptions have changed since this calculation. Recalculate to update the decision record.",
    recalculate: "Recalculate",
    openRecord: "Open the full decision record",
  },
} satisfies DecisionRecordShape;

export const decisionRecordT = {
  pl: decisionRecordPl,
  en: decisionRecordEn,
} as const;

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

const suitabilityPl = {
  badge: "Porównanie warunków",
  title: "Warunki zastosowania procedur zakupowych",
  metadataTitle: "Warunki zastosowania procedur zakupowych: ProcuraCost",
  metadataDescription:
    "Równorzędne rodziny procedur, obowiązkowe terminy prawne i warunki do potwierdzenia dla zadeklarowanego kontekstu zakupu.",
  intro:
    "Wskaż granicę prawną i kontekst procesu. Narzędzie pokaże równorzędny zbiór rodzin procedur objętych modelem oraz warunki, które trzeba potwierdzić przed wyborem.",
  neutralityNote:
    "Kolejność na liście ma wyłącznie znaczenie techniczne. Każda rodzina ma ten sam status, a wynik nie zastępuje analizy prawnej.",
  visualSteps: ["Deklaracja", "Granica prawna", "Równy status"],
  formTitle: "Deklarowany kontekst zakupu",
  fields: {
    boundary: "Ramy prawne i ład zakupowy",
    archetype: "Archetyp zakupu",
    channel: "Kanał realizacji zakupu",
    support: "Wsparcie systemowe",
    initiatedOn: "Data wszczęcia",
    buyerRegime: "Rodzaj zamawiającego",
    procurementObject: "Przedmiot zamówienia",
    communicationMethod: "Sposób komunikacji",
  },
  options: {
    boundary: {
      private_policy: "Polityka zakupowa sektora prywatnego",
      public_internal_rules: "Wewnętrzne zasady zakupowe sektora publicznego",
      pzp_classic_national: "PZP: zamówienia klasyczne poniżej progów unijnych",
      pzp_classic_eu: "PZP: zamówienia klasyczne od progów unijnych",
    },
    archetype: {
      standardized_recurring: "Zakup standaryzowany i powtarzalny",
      incomplete_requirement: "Zakup z niepełnym wymaganiem",
      complex_service: "Złożona usługa",
      continuity_critical: "Zakup krytyczny dla ciągłości działania",
      capital_investment: "Inwestycja kapitałowa",
    },
    channel: {
      sourcing_event: "Postępowanie sourcingowe",
      catalog_calloff: "Zamówienie z katalogu",
      mrp_release: "Zlecenie zakupu z MRP",
      custom: "Inny kanał realizacji",
    },
    support: {
      manual: "Obsługa ręczna",
      sourcing_platform: "Platforma sourcingowa",
      transactional_erp: "Transakcyjny moduł ERP/P2P",
      integrated_source_to_pay: "Zintegrowane Source-to-Pay",
    },
    buyerRegime: {
      classic: "Zamawiający klasyczny",
      sectoral: "Zamawiający sektorowy",
      defence_security: "Obronność i bezpieczeństwo",
    },
    procurementObject: {
      supplies_services: "Dostawy lub usługi",
      works: "Roboty budowlane",
    },
    communicationMethod: {
      electronic: "Komunikacja elektroniczna",
      other: "Inny sposób komunikacji",
    },
  },
  submit: "Porównaj warunki zastosowania",
  resultsTitle: "Równorzędny zbiór procedur objętych modelem",
  resultsIntro:
    "Każdy wiersz ma ten sam status. Różnice dotyczą warunków zastosowania i obowiązkowych terminów.",
  equalStatus: "Równorzędny kandydat",
  candidateCount: (count: number) => `Liczba rodzin procedur: ${count}`,
  criteriaTitle: "Warunki oceny",
  conditionsTitle: "Do potwierdzenia w organizacji",
  limitationsTitle: "Ograniczenia",
  legalWaitsTitle: "Obowiązkowe terminy prawne objęte regułami modelu",
  noLegalWaits:
    "Model nie przypisuje tej rodzinie obowiązkowego terminu ustawowego.",
  waitDays: (days: number) => `${days} dni kalendarzowych`,
  waitLabels: {
    "model.legal.pzpBasic.bidSubmission": "Minimalny termin składania ofert",
    "model.legal.pzpBasic.standstill": "Okres przed zawarciem umowy",
    "model.legal.pzpOpen.bidSubmission": "Minimalny termin składania ofert",
    "model.legal.pzpOpen.standstill": "Okres przed zawarciem umowy",
    "model.legal.pzpRestricted.requestToParticipate": "Minimalny termin składania wniosków",
    "model.legal.pzpRestricted.bidSubmission": "Minimalny termin składania ofert",
    "model.legal.pzpRestricted.standstill": "Okres przed zawarciem umowy",
  } as Record<string, string>,
  withheldTitle: "Procedury wymagające odrębnej oceny przesłanek",
  withheldIntro:
    "Nie są kandydatami w tym porównaniu, ponieważ formularz nie zbiera przesłanek szczególnych wymaganych do ich zastosowania.",
  methodTitle: "Granice metody",
  outOfScopeTitle: "Porównanie wstrzymane",
  outOfScopeIntro:
    "Dla tej deklaracji model nie tworzy zbioru procedur. Sprawdź zakres reguł i kompletność danych.",
  liveReady: (count: number) =>
    `Porównanie gotowe. Liczba rodzin procedur: ${count}.`,
  liveOutOfScope: "Porównanie wstrzymane dla zadeklarowanego profilu.",
  unavailableText: "Opis niedostępny w tej wersji językowej.",
  states: {
    condition_present: "Warunek zadeklarowany",
    condition_to_verify: "Warunek do weryfikacji",
    not_assessed: "Poza oceną",
  },
  criterionLabels: {
    legal_boundary: "Granica prawna",
    requirement_definition: "Definicja potrzeby",
    competition_access: "Dostęp do konkurencji",
    execution_channel: "Kanał realizacji",
    workflow_learning: "Uczenie w przebiegu procesu",
    system_support: "Wsparcie systemowe",
  },
  procedures: {
    private_competitive: "Konkurencyjna procedura prywatna",
    private_negotiated: "Negocjowana procedura prywatna",
    public_internal_competitive: "Wewnętrzna procedura konkurencyjna sektora publicznego",
    pzp_basic: "Tryb podstawowy",
    pzp_open: "Przetarg nieograniczony",
    pzp_restricted: "Przetarg ograniczony",
    framework_calloff: "Zamówienie wykonawcze z umowy ramowej",
    custom_lawful: "Inna dopuszczalna procedura",
  },
  keyText: {
    "suitability.limitations.equalStatus": "Wszystkie wykazane rodziny procedur mają równy status w granicy modelu.",
    "suitability.limitations.notLegalAdvice": "Wynik nie zastępuje analizy prawnej, regulaminu ani udokumentowanego uzasadnienia.",
    "suitability.limitations.noReadinessInference": "Deklarowane wsparcie systemowe nie potwierdza gotowości organizacyjnej do wdrożenia.",
    "suitability.limitations.customGroundsNotEvaluated": "Model nie ocenia przesłanek prawnych ani organizacyjnych dla konstrukcji niestandardowej.",
    "suitability.conditions.frameworkApplicable": "Istnieje właściwa umowa ramowa, katalog lub kontrakt z dostawcą, z którego można wykonać zamówienie.",
    "suitability.conditions.learningMayAddWork": "Kontrolowane rozpoznanie potrzeby może zwiększyć czas i nakład pracy; jego wartość trzeba uzasadnić redukcją niepewności.",
    "suitability.reasons.invalidInput": "Dane wejściowe nie mają oczekiwanej struktury.",
    "suitability.reasons.invalidOrUnsupportedProfile": "Profil zawiera nieobsługiwaną wartość, wersję reguł albo datę poza zakresem 2026–2027.",
    "suitability.reasons.unsupportedBuyerRegime": "Zamówienia sektorowe oraz obronne i bezpieczeństwa pozostają poza zakresem tej wersji.",
    "suitability.reasons.missingPzpDeclaration": "Dla granicy PZP trzeba wskazać rodzaj zamawiającego, przedmiot zamówienia i sposób komunikacji.",
    "suitability.reasons.incompatibleDeclaration": "Deklaracje PZP nie są zgodne z wybraną granicą prawną.",
    "suitability.reasons.legalResolutionFailed": "Nie można potwierdzić zgodności rodziny procedur z zadeklarowaną granicą.",
    "suitability.withheld.competitive_dialogue": "Dialog konkurencyjny",
    "suitability.withheld.negotiation_with_notice": "Negocjacje z ogłoszeniem",
    "suitability.withheld.innovation_partnership": "Partnerstwo innowacyjne",
    "suitability.withheld.negotiation_without_notice": "Negocjacje bez ogłoszenia",
    "suitability.withheld.direct_award": "Zamówienie z wolnej ręki",
  } as Record<string, string>,
  criterionDetail: {
    legal_boundary: "Granica została zadeklarowana przez użytkownika; model nie potwierdza statusu prawnego podmiotu.",
    requirement_definition: {
      standardized_recurring: "Potrzeba jest opisana jako powtarzalna i ustabilizowana. Dodatkowe rozpoznanie może nie wnosić wartości.",
      incomplete_requirement: "Potrzeba wymaga kontrolowanego doprecyzowania przed zamknięciem rozwiązania i warunków umowy.",
      complex_service: "Zakres usługi wymaga uzgodnienia zależności, rezultatów i odpowiedzialności stron.",
      continuity_critical: "Projekt procesu powinien zabezpieczać dostępność, alternatywne źródła i warunki reakcji na zakłócenie.",
      capital_investment: "Porównanie powinno obejmować koszt cyklu życia, wymagania techniczne i ryzyka uruchomienia.",
    },
    competition_access: {
      private_competitive: "Rodzina zakłada udokumentowane porównanie konkurencyjnych ofert.",
      private_negotiated: "Trzeba potwierdzić dostęp do porównywalnych ofert lub udokumentować ograniczenie konkurencji.",
      public_internal_competitive: "Rodzina zakłada konkurencję zgodną z regulaminem wewnętrznym.",
      pzp_basic: "Rodzina obejmuje konkurencyjne postępowanie krajowe w granicy klasycznej PZP.",
      pzp_open: "Rodzina zapewnia otwarty dostęp wykonawców w postępowaniu unijnym.",
      pzp_restricted: "Rodzina obejmuje kwalifikację wykonawców, a następnie etap składania ofert.",
      framework_calloff: "Konkurencję oceniono przy ustanawianiu właściwej umowy lub trzeba ją przeprowadzić zgodnie z jej zasadami.",
      custom_lawful: "Model nie ocenia sposobu zapewnienia konkurencji dla konstrukcji niestandardowej.",
    },
    execution_channel: {
      sourcing_event: "Kanał służy przeprowadzeniu udokumentowanego postępowania sourcingowego.",
      catalog_calloff: "Kanał służy zamówieniu z istniejącego katalogu, umowy ramowej lub kontraktu. Nie zastępuje nowego sourcingu.",
      mrp_release: "Kanał służy zwolnieniu zapotrzebowania do istniejącego, zatwierdzonego dostawcy. Nie zastępuje nowego sourcingu.",
      custom: "Niestandardowy kanał wymaga opisania kontroli, autoryzacji i śladu decyzyjnego.",
    },
    workflow_learning: {
      verify: "Iteracyjne rozpoznanie może zwiększyć czas i nakład pracy. Należy wskazać decyzje, które mają zostać wsparte nową informacją.",
      notAssessed: "Model nie zakłada wartości dodatkowego uczenia dla tego archetypu.",
    },
    system_support: "Narzędzie może wspierać czynności, ale samo nie potwierdza właściciela procesu, jakości danych ani adopcji.",
  },
  conditionText: {
    boundary: "Potwierdź właściwość zadeklarowanej granicy prawnej i regulaminu.",
    archetype: "Potwierdź opis potrzeby i ryzyka właściwe dla wybranego archetypu.",
    channel: {
      sourcing_event: "Potwierdź zakres, role i ślad decyzyjny postępowania sourcingowego.",
      catalog_calloff: "Potwierdź podstawę zamówienia w istniejącym katalogu, umowie ramowej lub kontrakcie.",
      mrp_release: "Potwierdź zatwierdzone źródło dostawy, parametry MRP i kontrolę wyjątku.",
      custom: "Udokumentuj właściciela, kontrolę i autoryzację niestandardowego kanału.",
    },
    support: "Zweryfikuj dane, konfigurację, odpowiedzialność i faktyczne użycie deklarowanego systemu.",
  },
} as const;

type SuitabilityShape = LangShape<typeof suitabilityPl>;

const suitabilityEn = {
  ...suitabilityPl,
  badge: "Condition-based comparison",
  title: "Procurement procedure suitability conditions",
  metadataTitle: "Procurement procedure suitability conditions: ProcuraCost",
  metadataDescription: "Equal-status procedure families, mandatory legal periods and conditions to confirm for the declared procurement context.",
  intro: "Declare the legal boundary and process context. The tool will show an equal-status set of procedure families covered by the model and the conditions that need confirmation before selection.",
  neutralityNote: "List order is technical only. Every family has the same status, and the result does not replace legal analysis.",
  visualSteps: ["Declaration", "Legal boundary", "Equal status"],
  formTitle: "Declared procurement context",
  fields: {
    boundary: "Legal and governance boundary",
    archetype: "Purchase archetype",
    channel: "Purchase execution channel",
    support: "System support",
    initiatedOn: "Initiated on",
    buyerRegime: "Contracting authority regime",
    procurementObject: "Procurement object",
    communicationMethod: "Communication method",
  },
  options: {
    boundary: {
      private_policy: "Private-sector procurement policy",
      public_internal_rules: "Public-sector internal procurement rules",
      pzp_classic_national: "PZP: classic procurement below EU thresholds",
      pzp_classic_eu: "PZP: classic procurement at or above EU thresholds",
    },
    archetype: {
      standardized_recurring: "Standardised recurring purchase",
      incomplete_requirement: "Purchase with an incomplete requirement",
      complex_service: "Complex service",
      continuity_critical: "Continuity-critical purchase",
      capital_investment: "Capital investment",
    },
    channel: {
      sourcing_event: "Sourcing event",
      catalog_calloff: "Catalogue call-off",
      mrp_release: "MRP purchase release",
      custom: "Other execution channel",
    },
    support: {
      manual: "Manual processing",
      sourcing_platform: "Sourcing platform",
      transactional_erp: "Transactional ERP/P2P",
      integrated_source_to_pay: "Integrated source-to-pay",
    },
    buyerRegime: {
      classic: "Classic contracting authority",
      sectoral: "Utilities contracting entity",
      defence_security: "Defence and security",
    },
    procurementObject: {
      supplies_services: "Supplies or services",
      works: "Works",
    },
    communicationMethod: {
      electronic: "Electronic communication",
      other: "Other communication method",
    },
  },
  submit: "Compare suitability conditions",
  resultsTitle: "Equal-status procedure set covered by the model",
  resultsIntro: "Every row has the same status. Differences concern conditions of use and mandatory periods.",
  equalStatus: "Equal-status candidate",
  candidateCount: (count: number) => `Procedure families: ${count}`,
  criteriaTitle: "Assessment conditions",
  conditionsTitle: "To confirm within the organisation",
  limitationsTitle: "Limitations",
  legalWaitsTitle: "Mandatory legal periods covered by the ruleset",
  noLegalWaits: "The model assigns no statutory mandatory period to this family.",
  waitDays: (days: number) => `${days} calendar days`,
  waitLabels: {
    "model.legal.pzpBasic.bidSubmission": "Minimum tender submission period",
    "model.legal.pzpBasic.standstill": "Standstill period",
    "model.legal.pzpOpen.bidSubmission": "Minimum tender submission period",
    "model.legal.pzpOpen.standstill": "Standstill period",
    "model.legal.pzpRestricted.requestToParticipate": "Minimum participation-request period",
    "model.legal.pzpRestricted.bidSubmission": "Minimum tender submission period",
    "model.legal.pzpRestricted.standstill": "Standstill period",
  } as Record<string, string>,
  withheldTitle: "Procedures requiring a separate assessment of statutory grounds",
  withheldIntro: "They are not candidates in this comparison because the form does not collect the special grounds required for their use.",
  methodTitle: "Method boundary",
  outOfScopeTitle: "Comparison withheld",
  outOfScopeIntro: "The model does not create a procedure set for this declaration. Check the ruleset coverage and data completeness.",
  liveReady: (count: number) =>
    `Comparison ready. Procedure families: ${count}.`,
  liveOutOfScope: "Comparison withheld for the declared profile.",
  unavailableText: "Description unavailable in this language version.",
  states: {
    condition_present: "Condition declared",
    condition_to_verify: "Condition to verify",
    not_assessed: "Not assessed",
  },
  criterionLabels: {
    legal_boundary: "Legal boundary",
    requirement_definition: "Requirement definition",
    competition_access: "Access to competition",
    execution_channel: "Execution channel",
    workflow_learning: "Workflow learning",
    system_support: "System support",
  },
  procedures: {
    private_competitive: "Private competitive procedure",
    private_negotiated: "Private negotiated procedure",
    public_internal_competitive: "Public-sector internal competitive procedure",
    pzp_basic: "Basic procedure",
    pzp_open: "Open procedure",
    pzp_restricted: "Restricted procedure",
    framework_calloff: "Framework call-off",
    custom_lawful: "Other lawful procedure",
  },
  keyText: {
    "suitability.limitations.equalStatus": "All procedure families shown have equal status within the model boundary.",
    "suitability.limitations.notLegalAdvice": "The result does not replace legal analysis, internal rules or a documented justification.",
    "suitability.limitations.noReadinessInference": "Declared system support does not establish organisational implementation readiness.",
    "suitability.limitations.customGroundsNotEvaluated": "The model does not assess the legal or organisational grounds for a custom design.",
    "suitability.conditions.frameworkApplicable": "An applicable framework, catalogue or supplier contract exists and permits the call-off.",
    "suitability.conditions.learningMayAddWork": "Controlled requirement discovery may add time and labour; its value needs justification through reduced uncertainty.",
    "suitability.reasons.invalidInput": "The input does not have the expected structure.",
    "suitability.reasons.invalidOrUnsupportedProfile": "The profile contains an unsupported value, ruleset version or date outside 2026–2027 coverage.",
    "suitability.reasons.unsupportedBuyerRegime": "Utilities, defence and security procurement remain outside this version's scope.",
    "suitability.reasons.missingPzpDeclaration": "A PZP boundary requires the authority regime, procurement object and communication method.",
    "suitability.reasons.incompatibleDeclaration": "The PZP declarations are incompatible with the selected legal boundary.",
    "suitability.reasons.legalResolutionFailed": "The procedure family cannot be resolved against the declared boundary.",
    "suitability.withheld.competitive_dialogue": "Competitive dialogue",
    "suitability.withheld.negotiation_with_notice": "Negotiated procedure with prior publication",
    "suitability.withheld.innovation_partnership": "Innovation partnership",
    "suitability.withheld.negotiation_without_notice": "Negotiated procedure without prior publication",
    "suitability.withheld.direct_award": "Direct award",
  } as Record<string, string>,
  criterionDetail: {
    legal_boundary: "The user declared the boundary; the model does not establish the entity's legal status.",
    requirement_definition: {
      standardized_recurring: "The need is described as recurring and stable. Additional discovery may add no value.",
      incomplete_requirement: "The need requires controlled definition before the solution and contract terms are fixed.",
      complex_service: "The service scope requires agreement on dependencies, outcomes and party responsibilities.",
      continuity_critical: "The workflow should address availability, alternative sources and disruption response terms.",
      capital_investment: "The comparison should cover lifecycle cost, technical requirements and commissioning risk.",
    },
    competition_access: {
      private_competitive: "The family assumes a documented comparison of competitive offers.",
      private_negotiated: "Confirm access to comparable offers or document the constraint on competition.",
      public_internal_competitive: "The family assumes competition under the entity's internal rules.",
      pzp_basic: "The family covers a national competitive procedure within the classic PZP boundary.",
      pzp_open: "The family provides open supplier access in an EU-threshold procedure.",
      pzp_restricted: "The family includes supplier qualification followed by tender submission.",
      framework_calloff: "Competition was addressed when the applicable agreement was established or must follow its call-off rules.",
      custom_lawful: "The model does not assess access to competition for a custom design.",
    },
    execution_channel: {
      sourcing_event: "The channel supports a documented sourcing event.",
      catalog_calloff: "The channel places an order under an existing catalogue, framework or contract. It is not new sourcing.",
      mrp_release: "The channel releases a requirement to an existing approved supplier. It is not new sourcing.",
      custom: "A custom channel requires documented controls, authorisation and a decision trail.",
    },
    workflow_learning: {
      verify: "Iterative discovery may add time and labour. Identify the decisions that new information is intended to support.",
      notAssessed: "The model assumes no value from additional learning for this archetype.",
    },
    system_support: "A tool may support activities, but it does not establish process ownership, data quality or adoption.",
  },
  conditionText: {
    boundary: "Confirm the selected legal boundary and applicable internal rules.",
    archetype: "Confirm the need and risk description for the selected archetype.",
    channel: {
      sourcing_event: "Confirm the scope, roles and decision trail for the sourcing event.",
      catalog_calloff: "Confirm the ordering basis in an existing catalogue, framework or contract.",
      mrp_release: "Confirm the approved source, MRP parameters and exception control.",
      custom: "Document ownership, control and authorisation for the custom channel.",
    },
    support: "Verify data, configuration, accountability and actual use of the declared system.",
  },
} satisfies SuitabilityShape;

export const suitabilityT = { pl: suitabilityPl, en: suitabilityEn } as const;


const processProfilePl = {
  badge: "Opis projektu procesu",
  title: "Profil projektu procesu zakupowego",
  subtitle:
    "Opisz dziesięć wymiarów przebiegu. Orientacje sekwencyjna, mieszana i adaptacyjna nie są skalą od gorszego do lepszego.",
  orientations: {
    sequential: "Sekwencyjna",
    mixed: "Mieszana",
    adaptive: "Adaptacyjna",
  },
  selectedOrientation: (orientation: string) =>
    `Wybrana orientacja: ${orientation}`,
  selected: "Wybrano",
  unanswered: "Nie wybrano orientacji",
  answeredCount: (answered: number, total: number) =>
    `Opisano ${answered} z ${total} wymiarów`,
  questions: [
    {
      dimension: "Logika prowadzenia i kolejność",
      prompt: "Jak zaprojektowano zależności między krokami procesu?",
      answers: [
        "Zatwierdzona mapa prowadzi przez jedną sekwencję z pełnym śladem wykonania.",
        "Zatwierdzona mapa łączy sekwencje i równoległe odcinki w stałych punktach scalenia.",
        "Reguły zależności pozwalają dobrać kolejność, a decyzja o przebiegu jest zapisywana.",
      ],
    },
    {
      dimension: "Źródło kontroli",
      prompt: "Skąd wynikają obowiązujące ograniczenia procesu?",
      answers: [
        "Wymogi prawa i polityki są przełożone na zatwierdzoną sekwencję kontroli.",
        "Wymogi prawa pozostają stałe, a polityka wskazuje skonfigurowane warianty między nimi.",
        "Wymogi prawa i polityki są zapisane jako granice oraz reguły wyboru przebiegu.",
      ],
    },
    {
      dimension: "Niepełne wymagania",
      prompt: "Jak proces obsługuje wymaganie, którego nie da się opisać w całości na początku?",
      answers: [
        "Dedykowany etap definicji kończy się zatwierdzonym opisem przed uruchomieniem dalszej sekwencji.",
        "Etapy rozpoznania i definicji mają osobne bramki, po których następuje stały przebieg.",
        "Wymaganie jest doprecyzowywane iteracyjnie między udokumentowanymi bramkami decyzji.",
      ],
    },
    {
      dimension: "Rozpoznanie rynku",
      prompt: "Jak zaplanowano kontakt z rynkiem przed wyborem rozwiązania?",
      answers: [
        "Analiza rynku jest zamykana w określonym etapie przed zatwierdzeniem opisu.",
        "Konsultacja odbywa się w określonej bramce, po której opis zostaje ustalony.",
        "Kilka kontrolowanych etapów kontaktu z rynkiem zasila kolejne decyzje projektowe.",
      ],
    },
    {
      dimension: "Topologia zatwierdzeń",
      prompt: "Jak przebiegają zatwierdzenia biznesowe, zakupowe i kontrolne?",
      answers: [
        "Zatwierdzenia następują kolejno według zatwierdzonej macierzy uprawnień.",
        "Stałe grupy zatwierdzeń przebiegają równolegle i spotykają się w zapisanej bramce.",
        "Reguły ryzyka dobierają konfigurację zatwierdzeń, a wybrana konfiguracja pozostaje w śladzie decyzji.",
      ],
    },
    {
      dimension: "Projekt zmiany umowy",
      prompt: "Jak umowa reguluje przegląd i kontrolowaną zmianę?",
      answers: [
        "Stały zakres jest chroniony formalną procedurą zmiany i rejestrem zatwierdzeń.",
        "Zdefiniowane elementy mają zaplanowane terminy przeglądu, a pozostałe używają formalnej procedury zmiany.",
        "Moduły umowy mają opisane opcje, limity oraz procedury zatwierdzania kontrolowanej zmiany.",
      ],
    },
    {
      dimension: "Wyjątki i eskalacja",
      prompt: "Jak proces obsługuje odchylenia od zaplanowanego przebiegu?",
      answers: [
        "Odchylenie uruchamia jedną formalną procedurę wyjątku przed wznowieniem sekwencji.",
        "Każda kategoria wyjątku ma skonfigurowaną ścieżkę eskalacji i powrotu.",
        "Brama decyzyjna wybiera udokumentowany wariant, właściciela i warunki powrotu.",
      ],
    },
    {
      dimension: "Routing strategiczny i operacyjny",
      prompt: "Jak rozdzielono zakupy strategiczne od zamówień operacyjnych?",
      answers: [
        "Każdy kanał ma odrębną, zatwierdzoną sekwencję strategiczną albo operacyjną.",
        "Wspólne bramki ładu prowadzą do skonfigurowanych wariantów dla kanałów realizacji.",
        "Archetyp zakupu i kanał realizacji wybierają mapę zależności oraz wymagany ślad decyzji.",
      ],
    },
    {
      dimension: "Kontrole systemowe i wybór przebiegu",
      prompt: "Jaką rolę pełni system zakupowy w projekcie procesu?",
      answers: [
        "System egzekwuje jedną sekwencję, uprawnienia, walidacje danych i ślad audytowy.",
        "System egzekwuje uprawnienia i walidacje w kilku skonfigurowanych wariantach.",
        "System egzekwuje granice i dane oraz zapisuje uzasadnienie przebiegu wybranego przez uprawniony zespół.",
      ],
    },
    {
      dimension: "Pomiar i pochodzenie danych",
      prompt: "Jak dokumentowane są założenia, decyzje i wyniki procesu?",
      answers: [
        "Rejestr bazowy łączy każdy krok stałej sekwencji z wykonawcą, datą i podstawą.",
        "Rejestr wariantów łączy wybraną konfigurację z krokami, decyzjami i źródłami.",
        "Rejestr decyzji o zmianie łączy przebieg z przesłanką, właścicielem i skutkiem.",
      ],
    },
  ],
  result: {
    eyebrow: "Opis przebiegu",
    title: "Rozkład orientacji projektu procesu",
    countsTitle: "Liczba wymiarów według orientacji",
    selectionsTitle: "Opis dziesięciu wymiarów",
    description:
      "Profil pokazuje, gdzie projekt procesu jest sekwencyjny, mieszany lub adaptacyjny. Nie mierzy dojrzałości organizacji i nie wyznacza zalecanej ścieżki.",
    validationCaveat:
      "Profil ma charakter opisowy i nie jest zwalidowanym narzędziem oceny.",
  },
  actions: {
    calculator: "Porównaj koszt dwóch projektów procesu",
    restart: "Wyczyść profil i zacznij od nowa",
  },
} as const;

type ProcessProfileCopyShape = LangShape<typeof processProfilePl>;

const processProfileEn = {
  badge: "Workflow design description",
  title: "Procurement process design profile",
  subtitle:
    "Describe ten workflow dimensions. Sequential, mixed and adaptive orientations are descriptive categories, not a better-to-worse scale.",
  orientations: {
    sequential: "Sequential",
    mixed: "Mixed",
    adaptive: "Adaptive",
  },
  selectedOrientation: (orientation: string) =>
    `Selected orientation: ${orientation}`,
  selected: "Selected",
  unanswered: "No orientation selected",
  answeredCount: (answered: number, total: number) =>
    `${answered} of ${total} dimensions described`,
  questions: [
    {
      dimension: "Routing logic and sequence",
      prompt: "How are dependencies between workflow steps designed?",
      answers: [
        "An approved map follows one sequence with a complete execution trail.",
        "An approved map combines sequences and parallel sections at fixed merge gates.",
        "Dependency rules permit route selection and record the resulting workflow decision.",
      ],
    },
    {
      dimension: "Source of controls",
      prompt: "Where do the workflow constraints come from?",
      answers: [
        "Legal and policy requirements are translated into an approved control sequence.",
        "Legal requirements remain fixed while policy identifies configured variants between them.",
        "Legal and policy requirements are expressed as boundaries and workflow-selection rules.",
      ],
    },
    {
      dimension: "Incomplete requirements",
      prompt: "How does the workflow handle a requirement that cannot be fully specified at the outset?",
      answers: [
        "A dedicated definition stage ends with an approved specification before the remaining sequence starts.",
        "Discovery and definition have separate gates followed by a fixed workflow.",
        "The requirement is refined iteratively between documented decision gates.",
      ],
    },
    {
      dimension: "Market engagement",
      prompt: "How is market contact planned before a solution is selected?",
      answers: [
        "Market analysis closes at a defined stage before the specification is approved.",
        "Consultation occurs at a defined gate after which the specification is fixed.",
        "Several controlled market-engagement stages inform successive design decisions.",
      ],
    },
    {
      dimension: "Approval topology",
      prompt: "How do business, procurement and control approvals proceed?",
      answers: [
        "Approvals follow an approved sequence under the delegation-of-authority matrix.",
        "Fixed approval groups run in parallel and meet at a recorded gate.",
        "Risk rules select an approval configuration and the selected configuration remains in the decision trail.",
      ],
    },
    {
      dimension: "Contract-change design",
      prompt: "How does the contract govern review and controlled change?",
      answers: [
        "Fixed scope is protected by a formal change procedure and approval register.",
        "Defined elements have scheduled reviews while the remainder uses the formal change procedure.",
        "Contract modules have stated options, limits and approval procedures for controlled change.",
      ],
    },
    {
      dimension: "Exceptions and escalation",
      prompt: "How does the workflow handle departures from the planned route?",
      answers: [
        "A departure invokes one formal exception procedure before the sequence resumes.",
        "Each exception category has a configured escalation and return route.",
        "A decision gate selects a documented variant, owner and return conditions.",
      ],
    },
    {
      dimension: "Strategic and operational routing",
      prompt: "How are strategic purchases separated from operational orders?",
      answers: [
        "Each channel has its own approved strategic or operational sequence.",
        "Shared governance gates lead to configured variants for each execution channel.",
        "The purchase archetype and execution channel select a dependency map and required decision trail.",
      ],
    },
    {
      dimension: "System controls and workflow choice",
      prompt: "What role does the procurement system play in workflow design?",
      answers: [
        "The system enforces one sequence, authorisations, data validation and an audit trail.",
        "The system enforces authorisations and data validation across configured workflow variants.",
        "The system enforces boundaries and data and records why an authorised team selected the workflow.",
      ],
    },
    {
      dimension: "Measurement and provenance",
      prompt: "How are workflow assumptions, decisions and outcomes documented?",
      answers: [
        "A baseline ledger links every fixed-sequence step to its actor, date and basis.",
        "A variant ledger links the selected configuration to steps, decisions and sources.",
        "A change-decision ledger links the workflow to its reason, owner and effect.",
      ],
    },
  ],
  result: {
    eyebrow: "Workflow description",
    title: "Distribution of workflow orientations",
    countsTitle: "Dimensions by orientation",
    selectionsTitle: "Selected design by dimension",
    description:
      "The profile shows where the workflow design is sequential, mixed, or adaptive. It does not measure organisational maturity or prescribe a route.",
    validationCaveat:
      "The profile is descriptive and has not been validated as an assessment instrument.",
  },
  actions: {
    calculator: "Compare the cost of two workflow designs",
    restart: "Clear the profile and start again",
  },
} satisfies ProcessProfileCopyShape;

export const assessmentT = {
  pl: processProfilePl,
  en: processProfileEn,
} as const;

const shortcastsPl = {
  metadataTitle: (version: string) => `Noty metodologiczne modelu ${version} | ProcuraCost`,
  metadataDescription: (version: string) =>
    `Planowana seria źródłowa o założeniach, granicach wnioskowania i interpretacji wyników modelu ProcuraCost ${version}.`,
  badge: (version: string) => `Model ${version} / plan redakcyjny`,
  title: "Noty metodologiczne ProcuraCost",
  intro:
    "Planowana seria oddziela ustalenia wynikające ze źródeł od założeń scenariuszowych. Wyniki ProcuraCost nie są przedstawiane jako zmierzone efekty organizacyjne ani rekomendacje proceduralne.",
  publishedMaterials: "Opublikowane materiały",
  plannedTopics: "Planowane tematy",
  focusLabel: "Temat",
  practiceNoteLabel: "Znaczenie dla praktyki zakupowej",
  detail: {
    metadataTitle: (number: number, title: string, version: string) =>
      `Odcinek ${number}: ${title} | ProcuraCost ${version}`,
    back: (version: string) => `Noty metodologiczne ProcuraCost ${version}`,
    episodeLabel: (number: number, dimension: string) =>
      `Odcinek ${number} / ${dimension}`,
    focusLabel: "Zakres",
    thesisLabel: "Zakres ustalenia",
    practiceNoteLabel: "Znaczenie dla praktyki zakupowej",
    calculatorTitle: "Sprawdź wpływ założeń",
    calculatorBody:
      "Porównaj oba projekty procesu i sprawdź, które założenia zmieniają kierunek różnicy kosztów.",
    calculatorCta: "Otwórz kalkulator ProcuraCost",
    previous: "Poprzedni",
    next: "Następny",
    spotify: "Spotify",
    applePodcasts: "Apple Podcasts",
  },
} as const;

type ShortcastsShape = LangShape<typeof shortcastsPl>;

const shortcastsEn = {
  metadataTitle: (version: string) => `Model ${version} methodology notes | ProcuraCost`,
  metadataDescription: (version: string) =>
    `A planned source-bounded series on assumptions, inference limits and interpretation of ProcuraCost model ${version}.`,
  badge: (version: string) => `Model ${version} / editorial plan`,
  title: "ProcuraCost methodology notes",
  intro:
    "The planned series separates source findings from scenario assumptions. ProcuraCost outputs are not presented as measured organisational effects or procedure recommendations.",
  publishedMaterials: "Published materials",
  plannedTopics: "Planned topics",
  focusLabel: "Focus",
  practiceNoteLabel: "Procurement practice implication",
  detail: {
    metadataTitle: (number: number, title: string, version: string) =>
      `Episode ${number}: ${title} | ProcuraCost ${version}`,
    back: (version: string) => `ProcuraCost ${version} methodology notes`,
    episodeLabel: (number: number, dimension: string) =>
      `Episode ${number} / ${dimension}`,
    focusLabel: "Scope",
    thesisLabel: "Finding boundary",
    practiceNoteLabel: "Procurement practice implication",
    calculatorTitle: "Test the assumptions",
    calculatorBody:
      "Compare both workflow designs and identify which assumptions change the direction of the cost difference.",
    calculatorCta: "Open the ProcuraCost calculator",
    previous: "Previous",
    next: "Next",
    spotify: "Spotify",
    applePodcasts: "Apple Podcasts",
  },
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
  implementation: {
    eyebrow: "Praktyka wdrożeniowa",
    title: "Odpowiedzialność za model i odpowiedzialność za wdrożenie",
    body:
      "Model wspiera uporządkowanie porównania. Właściciel procesu nadal odpowiada za cel, wymagania, dane, decyzje, adopcję i mierzenie wartości.",
    practiceAction: "Rozmowa Procurement&Beyond",
  },
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
      description: "Strategie pozyskania dostawców, zarządzanie kategoriami i negocjacje.",
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
  implementation: {
    eyebrow: "Implementation practice",
    title: "Accountability for the model and accountability for implementation",
    body:
      "The model structures a comparison. The process owner remains accountable for purpose, requirements, data, decisions, adoption and value measurement.",
    practiceAction: "Procurement&Beyond conversation",
  },
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
  modelNote:
    "Deterministyczny model na jawnych założeniach; wyniki nie są estymatami empirycznymi",
  resourceNavigation: "Materiały ProcuraCost",
  methodology: "Źródła i metodologia",
  localDraftNote:
    "Szkic może zostać zapisany wyłącznie w tej przeglądarce.",
  team: "Zespół",
  evidence: "Mechanizmy i źródła",
} as const;

type FooterShape = LangShape<typeof footerPl>;

const footerEn = {
  modelNote:
    "Deterministic model under declared assumptions; outputs are not empirical estimates",
  resourceNavigation: "ProcuraCost resources",
  methodology: "Sources and methodology",
  localDraftNote: "A draft can be saved only in this browser.",
  team: "Team",
  evidence: "Mechanisms and evidence",
} satisfies FooterShape;

export const footerT = { pl: footerPl, en: footerEn } as const;

const contextualToolPl = {
  case: {
    label: "Narzędzie pomocnicze · etap 1",
    body:
      "Sprawdź warunki zastosowania procedur. Jeśli przyszedłeś z porównania, wróć do jego karty, aby zachować wprowadzone dane.",
    action: "Otwórz nowe porównanie",
  },
  workflows: {
    label: "Narzędzie pomocnicze · etap 2",
    body:
      "Opisz sposób pracy nad zakupem. Jeśli przyszedłeś z porównania, wróć do jego karty, aby zachować wprowadzone dane.",
    action: "Otwórz nowe porównanie przebiegów",
  },
  record: {
    label: "Oddzielny samoopis wdrożenia",
    body:
      "To narzędzie nie zapisuje ani nie odtwarza wyniku porównania. Jeśli otworzyłeś je z zapisu, zapis pozostaje w poprzedniej karcie.",
    action: "Wróć do poprzedniej karty z zapisem",
  },
} as const;

type ContextualToolShape = LangShape<typeof contextualToolPl>;

const contextualToolEn = {
  case: {
    label: "Supporting tool · stage 1",
    body:
      "Review the conditions for using each procedure. If you came from a comparison, return to its tab to keep your entered data.",
    action: "Open a new comparison",
  },
  workflows: {
    label: "Supporting tool · stage 2",
    body:
      "Describe how the procurement work is organised. If you came from a comparison, return to its tab to keep your entered data.",
    action: "Open a new workflow comparison",
  },
  record: {
    label: "Separate implementation self-description",
    body:
      "This tool neither saves nor restores a comparison result. If you opened it from a record, that record remains in the previous tab.",
    action: "Return to the previous tab with the record",
  },
} satisfies ContextualToolShape;

export const contextualToolT = {
  pl: contextualToolPl,
  en: contextualToolEn,
} as const;
export type ContextualToolStage = keyof typeof contextualToolPl;

const navigationPl = {
  calculator: "Porównanie",
  optimizer: "Warunki zastosowania",
  caseStudies: "Scenariusze",
  assessment: "Profil procesu",
  team: "Zespół",
  research: "Artykuł naukowy",
  researchAgenda: "Agenda badawcza",
  methodology: "Metodologia",
  model: "Badania",
  languageSwitch: "EN",
  primaryNavigation: "Nawigacja główna",
  openMenu: "Otwórz menu",
  closeMenu: "Zamknij menu",
  skipToContent: "Przejdź do treści",
} as const;

type NavigationShape = LangShape<typeof navigationPl>;

const navigationEn = {
  calculator: "Comparison",
  optimizer: "Suitability comparison",
  caseStudies: "Scenarios",
  assessment: "Process profile",
  team: "Team",
  research: "Research paper",
  researchAgenda: "Agenda",
  methodology: "Methodology",
  model: "Research",
  languageSwitch: "PL",
  primaryNavigation: "Primary navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  skipToContent: "Skip to content",
} satisfies NavigationShape;

export const navigationT = { pl: navigationPl, en: navigationEn } as const;
export type NavigationLabelKey = keyof typeof navigationPl;

const modelV2Pl = {
  scenarios: {
    sourcePublisher: "Rejestr modelu ProcuraCost",
    fleet_tco_reframing: {
      name: "Flota: przeformułowanie TCO",
      description:
        "Zakup floty, w którym warsztat kosztu cyklu życia jest widoczny w mapie procesu, bez monetyzowanej różnicy TCO między wariantami.",
      sourceTitle: "Scenariusz 2.2.2: zakup floty pojazdów",
      assumptionLabel: "Przeniesione założenia scenariusza floty",
      assumptionDetail:
        "Wartości ekonomiczne, surowe sumy 44/24 dni oraz profil wsparcia systemowego i kosztów koordynacji lub narzędzi zachowują centra modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy, nie czasy, nakład pracy ani koszty.",
    },
    erp_transformation_discovery: {
      name: "Transformacja ERP: etap odkrywania",
      description:
        "Zakup systemu ERP, w którym definicja potrzeb i kontakt z rynkiem są widocznymi elementami procesu.",
      sourceTitle: "Scenariusz 2.2.2: kontrakt IT i ERP",
      assumptionLabel: "Przeniesione założenia scenariusza ERP",
      assumptionDetail:
        "Wartości ekonomiczne, surowe sumy 44/24 dni oraz profil wsparcia systemowego i kosztów koordynacji lub narzędzi zachowują centra modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy, nie czasy, nakład pracy ani koszty.",
    },
    logistics_service_redesign: {
      name: "Przeprojektowanie usługi logistycznej",
      description:
        "Złożona usługa logistyczna porównana przy oddzielnych projektach przebiegu i umowy.",
      sourceTitle: "Scenariusz 2.2.2: usługi logistyczne",
      assumptionLabel: "Przeniesione założenia scenariusza logistycznego",
      assumptionDetail:
        "Wartości ekonomiczne, surowe sumy 44/24 dni oraz profil wsparcia systemowego i kosztów koordynacji lub narzędzi zachowują centra modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy, nie czasy, nakład pracy ani koszty.",
    },
    critical_material_continuity: {
      name: "Ciągłość dostaw materiału krytycznego",
      description:
        "Zakup materiału, w którym koszt dnia opisuje ryzyko przerwania ciągłości, a nie premię cenową.",
      sourceTitle: "Scenariusz 2.2.2: materiały produkcyjne",
      assumptionLabel: "Przeniesione założenia ciągłości dostaw",
      assumptionDetail:
        "Wartości ekonomiczne, surowe sumy 44/24 dni oraz profil wsparcia systemowego i kosztów koordynacji lub narzędzi zachowują centra modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy, nie czasy, nakład pracy ani koszty.",
    },
    public_it_open_with_market_consultation: {
      name: "Publiczne IT: przetarg nieograniczony z konsultacjami",
      description:
        "Dwa zgodne z PZP projekty procesu dla tego samego zakupu IT, z identycznymi obowiązkowymi terminami.",
      sourceTitle: "Scenariusz 2.2.2: publiczny zakup IT",
      assumptionLabel: "Przeniesione założenia publicznego zakupu IT",
      assumptionDetail:
        "Wartości ekonomiczne, surowe sumy 42/26 dni bez terminów prawnych oraz profil wsparcia systemowego i kosztów koordynacji lub narzędzi zachowują centra modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3. Terminy PZP pochodzą z wersjonowanego zbioru reguł prawnych. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy, nie czasy, nakład pracy ani koszty.",
    },
    stable_private_standard_service: {
      name: "Stabilna standardowa usługa prywatna",
      description:
        "Kontrola topologii pracy dla standaryzowanego zakupu: mapy są identyczne, lecz wynik nie jest neutralny, ponieważ scenariusz jawnie porównuje otwartą konkurencję z ograniczonym dostępem dostawców.",
      sourceTitle: "Scenariusz 2.2.2: kontrola mapy stabilnego zakupu",
      assumptionLabel: "Przeniesione założenia stabilnego zakupu",
      assumptionDetail:
        "Jawny stres transferu cenowego oparty na badaniu Szucsa porównuje otwartą konkurencję według kryteriów polityki z ograniczoną listą dostawców lub pozostaniem przy dotychczasowym dostawcy po rozpoznaniu rynku. Nie jest właściwością adaptacyjnego projektu procesu ani oszacowanym efektem dla tego scenariusza.",
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
    mechanismWorkflow: {
      sourceTitle: "Alokacje mechanizmowych map przebiegu w modelu 2.3",
      publisher: "Rejestr modelu ProcuraCost",
      supported:
        "Zapis dokumentuje ilustracyjną kolejność kroków, podział dni i rozkład godzin ról w modelu 2.3. Surowe sumy pozostają na poziomie 44/24 dni, a dla publicznego IT 42/26 dni. Zachowane mnożniki wsparcia systemowego oraz profile kosztów koordynacji i narzędzi przenoszą centra modelu 2.2.2.",
      unsupported:
        "Nie jest dowodem empirycznym czasu, nakładu pracy, kosztu ani wpływu któregokolwiek projektu przebiegu. Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy.",
      population:
        "Pięć ilustracyjnych scenariuszy map przebiegu modelu ProcuraCost 2.3",
      assumption:
        "Kolejność kroków, podział dni i rozkład godzin ról są ilustracyjnymi założeniami modelu 2.3. Oddzielny zapis przeniesiony ze scenariusza obejmuje wartości ekonomiczne, stawki godzinowe, mnożnik wsparcia oraz profil kosztów koordynacji i narzędzi.",
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
      fleet_operating_baseline: "Stan bazowy wykorzystania floty",
      fleet_lifecycle_cost_workshop:
        "Warsztat kosztu cyklu życia floty",
      fleet_use_case_requirements:
        "Wymagania według przypadków użycia",
      fleet_market_sounding: "Rozpoznanie rynku flotowego",
      fleet_offer_evaluation: "Ocena ofert i wariantów floty",
      fleet_contract_award: "Uzgodnienie i zawarcie umowy flotowej",
      erp_current_state_baseline: "Stan obecny procesów i systemów",
      erp_problem_framing: "Definicja problemu transformacji ERP",
      erp_supplier_discovery: "Rozpoznanie dostawców i rozwiązań ERP",
      erp_modular_scope: "Modułowy zakres wdrożenia",
      erp_offer_evaluation: "Ocena ofert i negocjacje ERP",
      erp_contract_award: "Uzgodnienie i zawarcie umowy ERP",
      logistics_service_baseline: "Stan bazowy usługi logistycznej",
      logistics_market_engagement: "Dialog z rynkiem usług logistycznych",
      logistics_sla_interfaces: "Projekt SLA i interfejsów operacyjnych",
      logistics_service_requirements: "Wymagania dla modelu usługi",
      logistics_offer_evaluation: "Ocena ofert logistycznych",
      logistics_contract_award:
        "Uzgodnienie i zawarcie umowy logistycznej",
      critical_continuity_risk: "Ocena ryzyka ciągłości",
      critical_supply_mapping: "Mapa rynku i źródeł dostaw",
      critical_contingency_design: "Plan zabezpieczenia ciągłości",
      critical_sourcing_strategy:
        "Strategia pozyskania materiału krytycznego",
      critical_supplier_selection: "Ocena i wybór dostawców",
      critical_contract_award: "Uzgodnienie i zawarcie umowy dostaw",
      public_it_needs_definition: "Zdefiniowanie potrzeb dla zamówienia IT",
      public_it_preliminary_market_consultation:
        "Wstępne konsultacje rynkowe dla IT",
      public_it_consultation_synthesis:
        "Synteza ustaleń z konsultacji",
      public_it_procurement_documents:
        "Przygotowanie dokumentów zamówienia IT",
      public_it_bid_evaluation: "Ocena ofert w zamówieniu IT",
      public_it_clarifications: "Wyjaśnienia treści ofert IT",
      public_it_award_committee: "Komisja przetargowa i wybór oferty",
      public_it_contract_signing: "Zawarcie umowy publicznego IT",
      userDefined: "Krok użytkownika",
    },
    legal: {
      pzpBasic: {
        bidSubmission: "Obowiązkowy termin składania ofert",
        standstill: "Obowiązkowy termin przed zawarciem umowy",
      },
      pzpOpen: {
        bidSubmission: "Obowiązkowy termin składania ofert",
        standstill: "Obowiązkowy termin przed zawarciem umowy",
      },
      pzpRestricted: {
        requestToParticipate: "Obowiązkowy termin składania wniosków",
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
    legacyUnrepresentableChangedField:
      "Zmienione pole starego modelu nie ma zgodnej reprezentacji w modelu 2.3.",
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
        "Fleet procurement with a lifecycle-cost workshop visible in the workflow, without a monetised TCO difference between alternatives.",
      sourceTitle: "Model 2.2.2 scenario: vehicle fleet procurement",
      assumptionLabel: "Retained fleet scenario assumptions",
      assumptionDetail:
        "Economic values, the raw 44/24-day totals, and the system-support and coordination or tool-cost profile preserve model 2.2.2 centres. Step order, day allocation and role-hour allocations are illustrative model 2.3 assumptions. External case studies support only the named mechanisms, not duration, effort or cost.",
    },
    erp_transformation_discovery: {
      name: "ERP transformation discovery",
      description:
        "ERP procurement in which problem definition and market engagement are explicit parts of the workflow.",
      sourceTitle: "Model 2.2.2 scenario: IT and ERP contract",
      assumptionLabel: "Retained ERP scenario assumptions",
      assumptionDetail:
        "Economic values, the raw 44/24-day totals, and the system-support and coordination or tool-cost profile preserve model 2.2.2 centres. Step order, day allocation and role-hour allocations are illustrative model 2.3 assumptions. External case studies support only the named mechanisms, not duration, effort or cost.",
    },
    logistics_service_redesign: {
      name: "Logistics service redesign",
      description:
        "A complex logistics service compared with separate workflow and contract designs.",
      sourceTitle: "Model 2.2.2 scenario: logistics services",
      assumptionLabel: "Retained logistics scenario assumptions",
      assumptionDetail:
        "Economic values, the raw 44/24-day totals, and the system-support and coordination or tool-cost profile preserve model 2.2.2 centres. Step order, day allocation and role-hour allocations are illustrative model 2.3 assumptions. External case studies support only the named mechanisms, not duration, effort or cost.",
    },
    critical_material_continuity: {
      name: "Critical material continuity",
      description:
        "A material purchase in which the daily cost represents continuity risk rather than a price premium.",
      sourceTitle: "Model 2.2.2 scenario: production materials",
      assumptionLabel: "Retained supply-continuity assumptions",
      assumptionDetail:
        "Economic values, the raw 44/24-day totals, and the system-support and coordination or tool-cost profile preserve model 2.2.2 centres. Step order, day allocation and role-hour allocations are illustrative model 2.3 assumptions. External case studies support only the named mechanisms, not duration, effort or cost.",
    },
    public_it_open_with_market_consultation: {
      name: "Public IT: open procedure with market consultation",
      description:
        "Two PZP-compliant workflow designs for the same IT purchase with identical mandatory periods.",
      sourceTitle: "Model 2.2.2 scenario: public IT procurement",
      assumptionLabel: "Retained public IT procurement assumptions",
      assumptionDetail:
        "Economic values, the raw 42/26-day totals excluding legal periods, and the system-support and coordination or tool-cost profile preserve model 2.2.2 centres. Step order, day allocation and role-hour allocations are illustrative model 2.3 assumptions. PZP periods come from the versioned legal ruleset. External case studies support only the named mechanisms, not duration, effort or cost.",
    },
    stable_private_standard_service: {
      name: "Stable private standard service",
      description:
        "A workflow-topology control for a standardised purchase: the maps are identical, but the result is not neutral because the scenario explicitly compares open competition with restricted supplier access.",
      sourceTitle: "Model 2.2.2 scenario: stable-purchase map control",
      assumptionLabel: "Retained stable-purchase assumptions",
      assumptionDetail:
        "The declared price-transfer stress based on Szucs compares open competition under the procurement policy criteria with a restricted supplier shortlist or incumbent continuation after market discovery. It is not a property of adaptive workflow design or an estimated effect for this scenario.",
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
      name: "Catalogue call-off control",
      description:
        "Framework execution with identical maps and no competition difference between the alternatives.",
      sourceTitle: "Model 2.2.2 scenario: catalogue order",
      assumptionLabel: "Retained catalogue-order assumptions",
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
    mechanismWorkflow: {
      sourceTitle: "Model 2.3 mechanism-workflow allocations",
      publisher: "ProcuraCost model registry",
      supported:
        "The record documents illustrative model 2.3 step ordering, day allocation and role-hour distribution. Raw totals remain 44/24 days, or 42/26 days for public IT. Retained system-support multipliers and coordination and tool-cost profiles carry forward model 2.2.2 centres.",
      unsupported:
        "It is not empirical evidence of duration, effort, cost or the effect of either workflow design. External case studies support only the named mechanisms.",
      population:
        "Five illustrative ProcuraCost model 2.3 workflow scenarios",
      assumption:
        "Step order, day allocation and role-hour distribution are illustrative model 2.3 assumptions. A separate retained scenario record covers economic values, hourly rates, the support multiplier, and coordination and tool-cost profiles.",
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
      catalog_selection: "Catalogue selection",
      po_approval: "Purchase-order approval",
      mrp_trigger: "MRP trigger",
      po_generation: "Purchase-order generation and verification",
      goods_receipt: "Goods receipt confirmation",
      fleet_operating_baseline: "Fleet operating baseline",
      fleet_lifecycle_cost_workshop: "Fleet lifecycle-cost workshop",
      fleet_use_case_requirements: "Use-case-based requirements",
      fleet_market_sounding: "Fleet market sounding",
      fleet_offer_evaluation: "Fleet options and tender evaluation",
      fleet_contract_award: "Fleet contract alignment and award",
      erp_current_state_baseline: "Current-state process and systems baseline",
      erp_problem_framing: "ERP transformation problem framing",
      erp_supplier_discovery: "ERP supplier and solution discovery",
      erp_modular_scope: "Modular implementation scope",
      erp_offer_evaluation: "ERP tender evaluation and negotiation",
      erp_contract_award: "ERP contract alignment and award",
      logistics_service_baseline: "Logistics service baseline",
      logistics_market_engagement: "Logistics market engagement",
      logistics_sla_interfaces: "SLA and operating-interface design",
      logistics_service_requirements: "Service-model requirements",
      logistics_offer_evaluation: "Logistics tender evaluation",
      logistics_contract_award: "Logistics contract alignment and award",
      critical_continuity_risk: "Continuity-risk assessment",
      critical_supply_mapping: "Supply-market and source mapping",
      critical_contingency_design: "Continuity contingency design",
      critical_sourcing_strategy: "Critical-material sourcing strategy",
      critical_supplier_selection: "Supplier assessment and selection",
      critical_contract_award: "Supply contract alignment and award",
      public_it_needs_definition: "Public IT needs definition",
      public_it_preliminary_market_consultation:
        "Preliminary market consultation for IT",
      public_it_consultation_synthesis: "Market-consultation synthesis",
      public_it_procurement_documents: "Public IT procurement documents",
      public_it_bid_evaluation: "Public IT tender evaluation",
      public_it_clarifications: "Public IT tender clarifications",
      public_it_award_committee: "Award committee and tender selection",
      public_it_contract_signing: "Public IT contract conclusion",
      userDefined: "User-defined step",
    },
    legal: {
      pzpBasic: {
        bidSubmission: "Mandatory tender-submission period",
        standstill: "Mandatory standstill before contract conclusion",
      },
      pzpOpen: {
        bidSubmission: "Mandatory tender-submission period",
        standstill: "Mandatory standstill before contract conclusion",
      },
      pzpRestricted: {
        requestToParticipate: "Mandatory request-to-participate period",
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
    legacyUnrepresentableChangedField:
      "The changed legacy field has no compatible representation in model 2.3.",
  },
};

export const modelV2T = { pl: modelV2Pl, en: modelV2En } as const;

const modelAssumptionsPl = {
  metadata: {
    title: `Rejestr założeń modelu ${MODEL_V2_METADATA.modelVersion} | ProcuraCost`,
    description: `Kontekst, zakresy ekonomiczne i pochodzenie danych modelu ProcuraCost ${MODEL_V2_METADATA.modelVersion}; kalibracja ${MODEL_V2_METADATA.calibrationId}.`,
  },
  productName: "ProcuraCost",
  eyebrow: `Dokumentacja modelu ${MODEL_V2_METADATA.modelVersion}`,
  title: "Rejestr założeń modelu zakupowego",
  lead:
    "Rejestr pokazuje dane wejściowe dziesięciu scenariuszy, klasy ich źródeł oraz granice interpretacji. Obie ścieżki są liczone w tym samym kontekście prawnym i operacyjnym.",
  scopeNote:
    "Zakresy stresowe służą do sprawdzania skutków jawnych założeń skrajnych. Nie opisują prawdopodobieństwa ani błędu statystycznego.",
  metadataLabels: {
    schemaVersion: "Wersja schematu",
    modelVersion: "Wersja modelu",
    calibrationId: "Identyfikator kalibracji",
    legalRulesetId: "Zbiór reguł prawnych",
  },
  sections: {
    scenariosTitle: "Scenariusze i zakresy wejściowe",
    scenariosIntro:
      "Pozycje zachowują kolejność rejestru modelu. Każda ujawnia sześć osi kontekstu oraz pełne metadane zakresów ekonomicznych.",
    provenanceTitle: "Rejestr pochodzenia",
    provenanceIntro:
      "Cztery zbiory pełnią odrębne funkcje: zachowują założenia wejściowe, ujawniają ilustracyjne alokacje map 2.3, opisują źródła zewnętrzne albo blokują terminy wynikające z reguł prawnych.",
    retainedTitle: "Przeniesione założenia",
    retainedIntro:
      "Wartości ekonomiczne, stawki godzinowe, sumy dni, mnożniki wsparcia systemowego oraz profile kosztów koordynacji i narzędzi zachowano z modelu 2.2.2. Kolejność kroków, podział dni i alokacje godzin ról w pięciu mapach mechanizmowych należą do oddzielnego zapisu ilustracyjnego 2.3.",
    internalTitle: "Wewnętrzne pochodzenie map przebiegu",
    internalIntro:
      "Zapis ujawnia ilustracyjną kolejność kroków, podział dni i alokacje godzin ról w pięciu mapach. Nie jest źródłem empirycznym; zewnętrzne studia przypadków wspierają tylko nazwane mechanizmy.",
    externalTitle: "Dowody zewnętrzne",
    externalIntro:
      "Źródła opisują mechanizmy, przypadki i granice transferu. Identyfikatory źródeł urzędowych nie służą do kalibracji wartości ekonomicznych.",
    legalTitle: "Zablokowane pochodzenie prawne",
    legalIntro:
      "Terminy w tej części pochodzą z wersjonowanego zbioru reguł. Są przypisane do daty wszczęcia i nie podlegają swobodnej zmianie w mapie procesu.",
    neutralTitle: "Kontrola neutralna",
    neutralIntro:
      "Kontrola zamówienia katalogowego wykorzystuje identyczne mapy procesu dla obu alternatyw. Równe koszty centralne i różnica równa zero potwierdzają neutralne zachowanie rachunku.",
    neutralStress:
      "Zakres stresowy kontroli pokazuje zewnętrzną obwiednię przy jawnych wartościach niskich i wysokich.",
    methodTitle: "Dalsza dokumentacja",
    methodIntro:
      "Równania, zasady monetyzacji i ograniczenia stosowania opisuje metodologia modelu.",
  },
  fields: {
    scenarioId: "Identyfikator scenariusza",
    context: "Kontekst zakupowy",
    economicAssumptions: "Założenia ekonomiczne",
    pathCompetitionDiffers: "Różnica ekspozycji konkurencyjnej",
    competitionDisadvantagedAlternative:
      "Wariant z ograniczonym dostępem dostawców",
    low: "Niski",
    central: "Centralny",
    high: "Wysoki",
    rangeKind: "Rodzaj zakresu",
    evidenceClass: "Klasa źródła",
    evidenceIds: "Identyfikatory źródeł",
    bypass: "Zakup poza zatwierdzonym procesem nie jest monetyzowany",
    reason: "Uzasadnienie",
    source: "Źródło",
    sourceModelVersion: "Wersja modelu źródłowego",
    sourceClass: "Klasa źródła",
    constructs: "Obszary opisywane przez źródło",
    supportedClaim: "Zakres wspierany przez źródło",
    unsupportedClaim: "Czego źródło nie wspiera",
    population: "Jurysdykcja lub populacja",
    publicationKind: "Rodzaj publikacji",
    publishedOn: "Data publikacji",
    provision: "Podstawa prawna",
    ruleId: "Identyfikator reguły",
    initiatedOn: "Data wszczęcia",
    lockedActiveDays: "Zablokowane dni pracy aktywnej",
    lockedQueueDays: "Zablokowane dni oczekiwania",
    occurrences: "Wystąpienia w mapach procesu",
    mapsIdentical: "Mapy procesu są identyczne",
    formalCentralTotal: "Centralny koszt ścieżki formalnej",
    adaptiveCentralTotal: "Centralny koszt ścieżki adaptacyjnej",
    delta: "Centralna różnica kosztu",
    outerStressRange: "Zakres stresowy",
  },
  values: {
    yes: "tak",
    no: "nie",
    applies: "uwzględniona",
    notApplicable: "niewystępująca",
    none: "brak",
  },
  assumptions: {
    contractValue: "Wartość kontraktu",
    dailyCostOfInaction: "Dzienny koszt zwłoki",
    competitionTransferRate: "Transfer konkurencji cenowej",
    amendmentDifferential: "Różnica kosztu aneksów",
    tcoDifferential: "Różnica kosztu TCO",
  },
  units: {
    pln: "PLN",
    plnPerDay: "PLN/dzień",
    percentage: "%",
  },
  rangeKinds: {
    fixed: "wartość stała",
    calibrated: "zakres kalibracyjny",
    stress: "zakres stresowy",
  },
  evidenceTypes: {
    empirical_anchor: "kotwica empiryczna",
    official_case: "materiał urzędowy",
    practitioner_observation: "obserwacja praktyka",
    illustrative_scenario: "scenariusz ilustracyjny",
    research_hypothesis: "hipoteza badawcza",
  },
  publicationKinds: {
    official_webpage: "strona urzędowa",
    official_report: "raport instytucjonalny",
    peer_reviewed_article: "artykuł recenzowany naukowo",
    practitioner_report: "materiał praktyka",
    internal_model_record: "wewnętrzny zapis modelu 2.3",
    legacy_model_registry: "rejestr poprzedniej wersji modelu",
  },
  constructs: {
    workflow_duration: "czas przebiegu procesu",
    role_effort: "nakład pracy ról",
    problem_definition: "definicja problemu zakupowego",
    market_consultation: "konsultacje rynkowe",
    modular_contracting: "modułowa konstrukcja kontraktu",
    supplier_access: "dostęp dostawców",
    competition_transfer: "transfer konkurencji",
    contract_adaptability: "adaptowalność kontraktu",
    contract_amendment: "aneksy do umowy",
    tco: "całkowity koszt posiadania",
    informal_bypass: "zakup poza procesem",
    innovation_procurement: "zamówienia innowacyjne",
  },
  scenarioPosition: (current: number, total: number) =>
    `Pozycja ${String(current).padStart(2, "0")} z ${String(total).padStart(2, "0")}`,
  occurrenceLabel: (scenario: string, alternative: string) =>
    `${scenario}; ${alternative}`,
  showScenarioDetails: "Pokaż zakresy",
  hideScenarioDetails: "Ukryj zakresy",
  sourceLink: "Otwórz źródło",
  sourceLinkLabel: (title: string) => `Otwórz źródło: ${title}`,
  methodologyLink: "Przejdź do metodologii",
  scenarios: modelV2Pl.scenarios,
  evidence: modelV2Pl.evidence,
  axes: researchExportV2Pl.axes,
  axisValues: researchExportV2Pl.axisValues,
  alternatives: researchExportV2Pl.alternatives,
  evidenceClasses: researchExportV2Pl.evidenceClasses,
  bypassReason: modelV2Pl.reasons.bypassNotMonetized,
} as const;

export type ModelAssumptionsCopy = LangShape<typeof modelAssumptionsPl>;

const modelAssumptionsEn = {
  metadata: {
    title: `Model ${MODEL_V2_METADATA.modelVersion} assumptions register | ProcuraCost`,
    description: `ProcuraCost ${MODEL_V2_METADATA.modelVersion} context, economic ranges, and provenance; calibration ${MODEL_V2_METADATA.calibrationId}.`,
  },
  productName: "ProcuraCost",
  eyebrow: `Model ${MODEL_V2_METADATA.modelVersion} documentation`,
  title: "Procurement model assumptions register",
  lead:
    "The register discloses the inputs for ten scenarios, their source classes, and the limits of interpretation. Both paths are calculated within the same legal and operational context.",
  scopeNote:
    "Stress ranges test the consequences of explicit outer assumptions. They do not describe probability or statistical error.",
  metadataLabels: {
    schemaVersion: "Schema version",
    modelVersion: "Model version",
    calibrationId: "Calibration identifier",
    legalRulesetId: "Legal ruleset",
  },
  sections: {
    scenariosTitle: "Scenarios and input ranges",
    scenariosIntro:
      "Entries retain the model registry order. Each discloses six context axes and the complete metadata for its economic ranges.",
    provenanceTitle: "Provenance register",
    provenanceIntro:
      "Four collections serve separate purposes: retaining input assumptions, disclosing illustrative model 2.3 workflow allocations, documenting external sources, or locking periods derived from legal rules.",
    retainedTitle: "Retained assumptions",
    retainedIntro:
      "Economic values, hourly rates, aggregate day totals, system-support multipliers, and coordination and tool-cost profiles are retained from model 2.2.2. Step order, day allocation and role-hour allocation in the five mechanism maps belong to a separate illustrative model 2.3 record.",
    internalTitle: "Internal workflow provenance",
    internalIntro:
      "The record discloses illustrative step ordering, day allocation and role-hour allocation for five maps. It is not an empirical source; external case studies support only the named mechanisms.",
    externalTitle: "External evidence",
    externalIntro:
      "Sources describe mechanisms, cases, and transfer limits. Official source identifiers are not used to calibrate economic values.",
    legalTitle: "Locked legal provenance",
    legalIntro:
      "Periods in this collection come from the versioned ruleset. They are tied to the initiation date and cannot be freely changed in the process map.",
    neutralTitle: "Neutral control",
    neutralIntro:
      "The catalogue call-off control uses identical process maps for both alternatives. Equal central costs and a zero difference confirm neutral calculation behaviour.",
    neutralStress:
      "The control stress range reports the outer envelope under the explicit low and high values.",
    methodTitle: "Further documentation",
    methodIntro:
      "The model methodology documents the equations, monetisation rules, and limits of use.",
  },
  fields: {
    scenarioId: "Scenario identifier",
    context: "Procurement context",
    economicAssumptions: "Economic assumptions",
    pathCompetitionDiffers: "Difference in competition exposure",
    competitionDisadvantagedAlternative:
      "Alternative with restricted supplier access",
    low: "Low",
    central: "Central",
    high: "High",
    rangeKind: "Range type",
    evidenceClass: "Source class",
    evidenceIds: "Source identifiers",
    bypass: "Off-process purchasing is not monetised",
    reason: "Rationale",
    source: "Source",
    sourceModelVersion: "Source model version",
    sourceClass: "Source class",
    constructs: "Areas described by the source",
    supportedClaim: "What the source supports",
    unsupportedClaim: "What the source does not support",
    population: "Jurisdiction or population",
    publicationKind: "Publication type",
    publishedOn: "Published on",
    provision: "Legal provision",
    ruleId: "Rule identifier",
    initiatedOn: "Initiated on",
    lockedActiveDays: "Locked active work days",
    lockedQueueDays: "Locked waiting days",
    occurrences: "Occurrences in process maps",
    mapsIdentical: "Process maps are identical",
    formalCentralTotal: "Formal path central cost",
    adaptiveCentralTotal: "Adaptive path central cost",
    delta: "Central cost difference",
    outerStressRange: "Stress range",
  },
  values: {
    yes: "yes",
    no: "no",
    applies: "included",
    notApplicable: "not applicable",
    none: "none",
  },
  assumptions: {
    contractValue: "Contract value",
    dailyCostOfInaction: "Daily cost of delay",
    competitionTransferRate: "Competition price transfer",
    amendmentDifferential: "Contract amendment cost difference",
    tcoDifferential: "TCO cost difference",
  },
  units: {
    pln: "PLN",
    plnPerDay: "PLN/day",
    percentage: "%",
  },
  rangeKinds: {
    fixed: "fixed value",
    calibrated: "calibration range",
    stress: "stress range",
  },
  evidenceTypes: {
    empirical_anchor: "empirical anchor",
    official_case: "official material",
    practitioner_observation: "practitioner observation",
    illustrative_scenario: "illustrative scenario",
    research_hypothesis: "research hypothesis",
  },
  publicationKinds: {
    official_webpage: "official webpage",
    official_report: "institutional report",
    peer_reviewed_article: "peer-reviewed article",
    practitioner_report: "practitioner material",
    internal_model_record: "internal model 2.3 record",
    legacy_model_registry: "previous model registry",
  },
  constructs: {
    workflow_duration: "process duration",
    role_effort: "role effort",
    problem_definition: "procurement problem definition",
    market_consultation: "market consultation",
    modular_contracting: "modular contracting",
    supplier_access: "supplier access",
    competition_transfer: "competition transfer",
    contract_adaptability: "contract adaptability",
    contract_amendment: "contract amendments",
    tco: "total cost of ownership",
    informal_bypass: "off-process purchasing",
    innovation_procurement: "innovation procurement",
  },
  scenarioPosition: (current: number, total: number) =>
    `Entry ${String(current).padStart(2, "0")} of ${String(total).padStart(2, "0")}`,
  occurrenceLabel: (scenario: string, alternative: string) =>
    `${scenario}; ${alternative}`,
  showScenarioDetails: "Show ranges",
  hideScenarioDetails: "Hide ranges",
  sourceLink: "Open source",
  sourceLinkLabel: (title: string) => `Open source: ${title}`,
  methodologyLink: "Open the methodology",
  scenarios: modelV2En.scenarios,
  evidence: modelV2En.evidence,
  axes: researchExportV2En.axes,
  axisValues: researchExportV2En.axisValues,
  alternatives: researchExportV2En.alternatives,
  evidenceClasses: researchExportV2En.evidenceClasses,
  bypassReason: modelV2En.reasons.bypassNotMonetized,
} satisfies ModelAssumptionsCopy;

export const modelAssumptionsT = {
  pl: modelAssumptionsPl,
  en: modelAssumptionsEn,
} as const;

const readinessPl = {
  metadata: {
    title: "Gotowość organizacyjna do wdrożenia | ProcuraCost",
    description:
      "Osiem jakościowych obszarów samoopisu organizacji przed wyborem i konfiguracją systemu zakupowego, bez oceny zbiorczej.",
  },
  eyebrow: "Samoopis warunków wdrożenia",
  title: "Gotowość organizacyjna do wdrożenia",
  subtitle:
    "Osiem obszarów do samoopisu przed wyborem systemu i rozpoczęciem konfiguracji. Zestawienie nie jest audytem dojrzałości i nie zmienia modelu kosztowego ProcuraCost.",
  duration: "Odpowiedzi pozostają wyłącznie w tej karcie przeglądarki.",
  progress: (current: number, total: number) => `Domena ${current} z ${total}`,
  previous: "Wstecz",
  next: "Dalej",
  showSummary: "Pokaż zestawienie",
  returnToSummary: "Wróć do zestawienia",
  editDomain: "Edytuj domenę",
  startOver: "Zacznij od nowa",
  domainSummary: "Deklaracje według obszaru",
  nextStep: "Możliwy kolejny krok",
  calculatorCta: "Otwórz kalkulator bez wstępnych danych",
  practiceCta: "Zobacz materiał Procurement&Beyond #8",
  sourceNote:
    "Lista kontrolna została opracowana przez autora jako zbiór hipotez operacyjnych do samoopisu i rozmowy wewnętrznej. Rozmowa branżowa Procurement&Beyond #8 z Pawłem Mamcarzem stanowi wyłącznie kontekst tematyczny; jej fragmenty nie są dowodem dla poszczególnych kryteriów. Automatyczny transkrypt YouTube nie został zweryfikowany przez człowieka. Materiał nie wyznacza progów, wag ani parametrów modelu ProcuraCost.",
  responseLabels: {
    not_met: "Niespełnione",
    to_complete: "Do uzupełnienia",
    confirmed: "Potwierdzone",
  },
  summary: {
    eyebrow: "Samoopis warunków",
    title: "Zestawienie deklaracji",
    body:
      "Zestawienie odtwarza wyłącznie deklaracje użytkownika. Jest samoopisem, nie jest walidacją organizacji ani prognozą powodzenia i nie stanowi rekomendacji rozpoczęcia, kontynuowania lub wstrzymania wdrożenia.",
  },
  domains: {
    purpose: {
      label: "Cel biznesowy i nieefektywność procesu",
      toCompleteAction: "Uzupełnić zwięzłą definicję problemu oraz wartości bazowe i docelowe mierników.",
      notMetAction:
        "Opisać najistotniejsze źródła nieefektywności i potwierdzić ich koszt lub wpływ operacyjny przed rozstrzygnięciem wyboru systemu.",
    },
    ownership: {
      label: "Właściciel biznesowy i mandat",
      toCompleteAction:
        "Uzgodnić zakres odpowiedzialności obejmujący mandat, dostępność, decyzje, zastępstwo i czas eskalacji.",
      notMetAction:
        "Wyznaczyć właściciela biznesowego i sponsora przed wyborem lub konfiguracją systemu.",
    },
    process: {
      label: "Pełny zakres procesu zakupowego",
      toCompleteAction:
        "Uzupełnić mapę o zakupy operacyjne, wyjątki i odpowiedzialności. Rozstrzygnąć decyzje procesowe przed konfiguracją.",
      notMetAction:
        "Przeprowadzić warsztat mapowania stanu obecnego i projektowania procesu docelowego. Konfiguracja systemu nie może zastępować projektowania procesu.",
    },
    requirements: {
      label: "Wymagania i kontrolowane rozpoznanie potrzeb",
      toCompleteAction:
        "Uzupełnić powiązanie wymaganie–problem–właściciel–kryterium odbioru oraz zaplanować kontrolowane rozpoznanie potrzeb.",
      notMetAction:
        "Rozpoznać potrzebę i kryteria wartości z użytkownikami oraz rynkiem przed zamknięciem specyfikacji.",
    },
    data_automation: {
      label: "Dane, integracje i odpowiedzialna automatyzacja",
      toCompleteAction:
        "Wykonać próbę jakości danych i opisać zasady integracji. Dla AI zdefiniować test, właściciela, pochodzenie danych i procedurę postępowania awaryjnego.",
      notMetAction:
        "Oddzielić nieokreślone obietnice AI od uzgodnionego zakresu i opisać zależności od danych przed ich konfiguracją.",
    },
    governance: {
      label: "Polityka zakupowa, zgodność i zatwierdzenia",
      toCompleteAction:
        "Oznaczyć źródło każdej kontroli i przeprowadzić test matrycy na zakupach o różnej wartości, ryzyku i trybie.",
      notMetAction:
        "Przeprojektować zasady nadzoru przed konfiguracją. Zachować wymogi zgodności, ale usunąć kroki bez właściciela i uzasadnienia.",
    },
    adoption: {
      label: "Adopcja i zdolność do zmiany",
      toCompleteAction:
        "Przydzielić czas użytkownikom oraz ustalić plan testów akceptacyjnych i właścicieli komunikacji, szkoleń i wsparcia.",
      notMetAction:
        "Zapewnić reprezentację użytkowników, test procesu i sposób pomiaru obejść przed uruchomieniem produkcyjnym.",
    },
    value_rollout: {
      label: "TCO, uzasadnienie biznesowe i plan wdrożenia",
      toCompleteAction:
        "Uzupełnić TCO o pominięte koszty i scenariusze. Nadać każdej fali mierzalne kryteria wejścia, wyjścia i zatrzymania.",
      notMetAction:
        "Przygotować weryfikowalne uzasadnienie biznesowe i zaplanować ograniczony pilotaż, który pozwoli rozstrzygnąć najważniejsze niewiadome.",
    },
  },
  questions: {
    "purpose.friction": {
      prompt: "Czy projekt rozwiązuje konkretną nieefektywność w określonym fragmencie procesu zakupowego?",
      answers: {
        not_met: "Nie. Projekt zaczyna się od wybranego systemu albo ogólnego hasła „digitalizacja”.",
        to_complete: "Problem jest opisany ogólnie, ale brakuje stanu bazowego, właściciela albo wpływu biznesowego.",
        confirmed: "Tak. Wskazano etap procesu, właściciela, stan bazowy i mierzalny wpływ biznesowy.",
      },
    },
    "purpose.success": {
      prompt: "Czy przed startem uzgodniono mierzalne kryteria powodzenia?",
      answers: {
        not_met: "Nie. Jedynym kryterium sukcesu jest uruchomienie systemu.",
        to_complete: "Mierniki są wymienione, ale nie mają wartości bazowej, celu albo właściciela pomiaru.",
        confirmed: "Tak. Uzgodnione mierniki mają wartość bazową, cel, termin i właściciela pomiaru.",
      },
    },
    "ownership.business_owner": {
      prompt:
        "Czy projekt ma nazwanego właściciela biznesowego, który rozumie proces zakupowy i może podejmować decyzje?",
      answers: {
        not_met: "Nie. Właścicielem faktycznie jest dostawca, integrator albo IT.",
        to_complete: "Osoba jest wskazana, ale nie ma wystarczającego mandatu, czasu albo wiedzy procesowej.",
        confirmed: "Tak. Właściciel ma mandat, przydzielony czas, wiedzę procesową i odpowiada za wynik biznesowy.",
      },
    },
    "ownership.sponsorship": {
      prompt: "Czy zapewniono ciągłość sponsorowania i jasną ścieżkę eskalacji?",
      answers: {
        not_met: "Nie ma aktywnego sponsora ani osoby, która przejmie rolę w razie zmiany personalnej.",
        to_complete: "Sponsor wspiera projekt nieformalnie, ale brak zastępstwa lub zasad podejmowania decyzji.",
        confirmed: "Sponsor, zastępstwo, zakres decyzji i oczekiwany czas eskalacji są uzgodnione.",
      },
    },
    "process.current_state": {
      prompt: "Czy zmapowano pełny przebieg obecnego procesu, wraz z wyjątkami i zakupami operacyjnymi?",
      answers: {
        not_met: "Nie ma uzgodnionej i zweryfikowanej mapy procesu.",
        to_complete: "Zmapowano główną ścieżkę lub wybór dostawcy, ale pominięto wyjątki, zamówienia, odbiór albo faktury.",
        confirmed: "Mapa obejmuje proces od identyfikacji potrzeby do rozliczenia zakupu, a także role, systemy, dane, wyjątki i ręczne obejścia.",
      },
    },
    "process.target_state": {
      prompt: "Czy proces docelowy uproszczono przed konfiguracją systemu?",
      answers: {
        not_met: "Nie. System ma odtworzyć dotychczasową procedurę krok po kroku.",
        to_complete: "Uproszczenia są planowane, ale nie rozstrzygnięto właścicieli, wyjątków lub kroków operacyjnych.",
        confirmed: "Zatwierdzono proces docelowy, rozdzielono wymogi prawne od wewnętrznych i wskazano kroki możliwe do równoległego wykonania.",
      },
    },
    "requirements.traceability": {
      prompt: "Czy każde wymaganie krytyczne jest powiązane z problemem biznesowym i sposobem odbioru?",
      answers: {
        not_met: "Nie. Istnieje płaska lista funkcji oparta głównie na demo, nazwach modułów lub wyjątkowych wariantach.",
        to_complete: "Wymagania są priorytetyzowane, ale część nie ma właściciela, uzasadnienia albo kryterium odbioru.",
        confirmed: "Tak. Każde wymaganie krytyczne ma właściciela, uzasadnienie, priorytet i sprawdzalne kryterium odbioru.",
      },
    },
    "requirements.discovery": {
      prompt: "Czy wymagania są wystarczająco znane albo mają zaplanowaną ścieżkę ich odkrycia?",
      answers: {
        not_met: "Potrzeba nie jest zrozumiana, ale oczekuje się od dostawcy konfiguracji rozwiązania docelowego.",
        to_complete: "Niepewność jest znana, ale nie przewidziano czasu, prototypu ani kryteriów zakończenia prac rozpoznawczych.",
        confirmed: "Wymaganie jest potwierdzone jako stabilne albo ma zaplanowane badanie użytkowników, dialog z rynkiem lub prototyp z kryteriami decyzji.",
      },
    },
    "data_automation.data": {
      prompt: "Czy znane są źródła danych, ich właściciele, jakość i docelowe integracje?",
      answers: {
        not_met: "Nie wiadomo, skąd pochodzą kluczowe dane albo kto odpowiada za ich jakość.",
        to_complete: "Systemy i interfejsy są znane, ale jakość danych, właściciele lub obsługa wyjątków nie zostały sprawdzone.",
        confirmed: "Istnieje inwentaryzacja źródeł, właścicieli i interfejsów oraz wynik próby jakości na reprezentatywnej próbce.",
      },
    },
    "data_automation.ai": {
      prompt: "Czy każde zastosowanie AI lub automatyzacji ma określone zadanie, sposób walidacji i bezpieczną procedurę awaryjną?",
      answers: {
        not_met: "AI ma zastąpić brakujące wymagania, dane lub odpowiedzialność za decyzję.",
        to_complete: "Jest ogólny pomysł „użycia AI”, ale bez testu jakości, właściciela i procedury awaryjnej.",
        confirmed: "AI nie jest objęte zakresem albo każde zastosowanie ma określone dane wejściowe, wynik, próg akceptacji, właściciela po stronie organizacji i procedurę awaryjną.",
      },
    },
    "governance.boundary": {
      prompt: "Czy polityka zakupowa definiuje granice kontroli, a każdy wymóg ma wskazane źródło?",
      answers: {
        not_met: "Nie ma właściciela zgodności albo wszystkie historyczne kroki są traktowane jako obowiązkowe.",
        to_complete: "Polityka istnieje, ale nie rozdziela wymogów prawa, uprawnień, ryzyka i lokalnego zwyczaju.",
        confirmed: "Każda kontrola ma źródło, właściciela i uzasadnienie; granica obejmuje uprawnienia, konkurencję, etykę i dokumentację.",
      },
    },
    "governance.approvals": {
      prompt: "Czy matryca zatwierdzeń jest proporcjonalna do wartości i ryzyka oraz przetestowana na realnych scenariuszach?",
      answers: {
        not_met: "System musi bez zmian odtworzyć historyczną sekwencję albo brakuje ważnych uprawnień decyzyjnych.",
        to_complete: "Matryca istnieje, ale ma wiele poziomów, niejasne wyjątki albo nie została przetestowana w pełnym przebiegu procesu.",
        confirmed: "Liczba akceptacji jest minimalna i proporcjonalna, wyjątki są kontrolowane, a reprezentatywne scenariusze przeszły test.",
      },
    },
    "adoption.users": {
      prompt: "Czy kluczowi użytkownicy mają realny udział w projektowaniu i testach oraz przydzielony na to czas?",
      answers: {
        not_met: "Nie. Użytkownicy zobaczą rozwiązanie dopiero podczas szkolenia przed uruchomieniem produkcyjnym.",
        to_complete: "Użytkownicy są konsultowani, ale późno, nieregularnie albo bez przydzielonego czasu.",
        confirmed: "Reprezentanci wszystkich głównych ról uczestniczą w projektowaniu, testach i akceptacji procesu.",
      },
    },
    "adoption.plan": {
      prompt: "Czy istnieje plan adopcji obejmujący komunikację, szkolenie, wsparcie i pomiar użycia?",
      answers: {
        not_met: "Nie. Miarą sukcesu jest wyłącznie uruchomienie produkcyjne, a obejścia mailowe i arkuszowe nie będą mierzone.",
        to_complete: "Plan zmiany istnieje, ale brakuje właścicieli, wsparcia po starcie albo mierników adopcji.",
        confirmed: "Plan ma właścicieli, harmonogram, wsparcie po starcie i mierniki, takie jak udział transakcji w systemie, wyjątki i czas cyklu.",
      },
    },
    "value_rollout.business_case": {
      prompt: "Czy uzasadnienie biznesowe obejmuje pełny koszt i niepewność, a nie tylko cenę licencji?",
      answers: {
        not_met: "Nie ma uzasadnienia biznesowego albo oszczędności zadeklarowano bez danych i wskazania mechanizmu ich osiągnięcia.",
        to_complete: "Ujęto główne koszty, ale pominięto integracje, zmianę organizacyjną, utrzymanie albo scenariusze niepewności.",
        confirmed: "Uzasadnienie biznesowe obejmuje licencje, wdrożenie, integracje, zmianę organizacyjną, utrzymanie, ryzyko i mierzalną wartość w kilku scenariuszach.",
      },
    },
    "value_rollout.rollout": {
      prompt: "Czy plan wdrożenia określa ograniczony pierwszy zakres, kryteria wyjścia i sposób zapewnienia ciągłości operacyjnej?",
      answers: {
        not_met: "Plan zakłada nieodwracalne, jednorazowe uruchomienie w pełnym zakresie mimo nieuzupełnionych warunków dotyczących procesu, danych lub adopcji.",
        to_complete: "Są etapy, ale bez mierzalnych kryteriów decyzyjnych, zasad zatrzymania albo planu powrotu.",
        confirmed: "Pilotaż lub pierwsza fala ma ograniczony zakres, kryteria wejścia i wyjścia, właścicieli oraz plan ciągłości i powrotu.",
      },
    },
  },
} as const;

type ReadinessShape = LangShape<typeof readinessPl>;

const readinessEn = {
  metadata: {
    title: "Organisational implementation readiness | ProcuraCost",
    description:
      "Eight qualitative areas for organisational self-description before procurement-system selection and configuration, without an overall assessment.",
  },
  eyebrow: "Implementation-conditions self-description",
  title: "Organisational implementation readiness",
  subtitle:
    "Eight areas for organisational self-description before system selection and configuration. The summary is not a maturity audit and does not change the ProcuraCost cost model.",
  duration: "Answers remain only in this browser tab.",
  progress: (current: number, total: number) => `Domain ${current} of ${total}`,
  previous: "Back",
  next: "Continue",
  showSummary: "Show summary",
  returnToSummary: "Return to summary",
  editDomain: "Edit domain",
  startOver: "Start over",
  domainSummary: "Responses by area",
  nextStep: "Possible next step",
  calculatorCta: "Open the calculator without pre-filled data",
  practiceCta: "View Procurement&Beyond episode 8 material",
  sourceNote:
    "The checklist was authored as a set of operational hypotheses for self-description and internal discussion. Segments from the Procurement&Beyond episode 8 practitioner interview with Paweł Mamcarz provide thematic context only; they are not evidence for individual criteria. The automatic YouTube transcript has not been human verified. The material does not set thresholds, weights or ProcuraCost model parameters.",
  responseLabels: {
    not_met: "Not met",
    to_complete: "Needs completion",
    confirmed: "Confirmed",
  },
  summary: {
    eyebrow: "Self-description of conditions",
    title: "Summary of responses",
    body:
      "This summary reproduces the user's declarations only. It is a self-description, not a validation of the organisation or a forecast of success, and it does not recommend starting, continuing or stopping implementation.",
  },
  domains: {
    purpose: {
      label: "Business objective and process inefficiency",
      toCompleteAction:
        "Complete the problem statement and establish baseline and target values for the agreed measures.",
      notMetAction:
        "Identify the most material process inefficiencies and establish their cost or operational impact before system selection is concluded.",
    },
    ownership: {
      label: "Business ownership and mandate",
      toCompleteAction:
        "Agree an ownership charter covering authority, capacity, decisions, succession and escalation time.",
      notMetAction:
        "Appoint a business owner and executive sponsor before selecting or configuring the system.",
    },
    process: {
      label: "Complete procurement process scope",
      toCompleteAction:
        "Extend the map to cover operational purchasing, exceptions and accountabilities. Resolve process decisions before configuration.",
      notMetAction:
        "Run a current-state mapping and target-process design workshop. System configuration must not replace process design.",
    },
    requirements: {
      label: "Requirements and controlled clarification",
      toCompleteAction:
        "Complete requirement-to-problem-to-owner-to-acceptance traceability and plan controlled clarification work.",
      notMetAction:
        "Clarify the need and value criteria with users and the market before finalising the specification.",
    },
    data_automation: {
      label: "Data, integrations and responsible automation",
      toCompleteAction:
        "Run a data-quality sample and document integration contracts. For AI, define the test, owner, provenance and contingency procedure.",
      notMetAction:
        "Separate undefined AI promises from the agreed scope and document data dependencies before configuring them.",
    },
    governance: {
      label: "Policy, compliance and approvals",
      toCompleteAction:
        "Document the source of every control and test the approval matrix across purchases with different values, risks and routes.",
      notMetAction:
        "Redesign governance before configuration. Preserve compliance boundaries while removing steps without an owner or rationale.",
    },
    adoption: {
      label: "Adoption and change capacity",
      toCompleteAction:
        "Allocate user capacity and assign owners for user acceptance testing, communication, training and support.",
      notMetAction:
        "Provide user representation, process testing and a method for measuring workarounds before production launch.",
    },
    value_rollout: {
      label: "TCO, business justification and implementation plan",
      toCompleteAction:
        "Complete TCO with omitted costs and scenarios. Give every wave measurable entry, exit and stop criteria.",
      notMetAction:
        "Prepare a verifiable business justification and plan a limited pilot to resolve the most material unknowns.",
    },
  },
  questions: {
    "purpose.friction": {
      prompt:
        "Does the project address a specific inefficiency in a defined part of the procurement process?",
      answers: {
        not_met:
          "No. The project starts with a selected tool or a general “digital transformation” objective.",
        to_complete:
          "The problem is broadly described, but its baseline, owner or business impact is incomplete.",
        confirmed:
          "Yes. The process stage, owner, baseline and measurable business impact are documented.",
      },
    },
    "purpose.success": {
      prompt: "Have measurable success criteria been agreed before the project starts?",
      answers: {
        not_met: "No. Production launch is the only definition of success.",
        to_complete:
          "KPIs are listed, but their baseline, target or measurement owner is missing.",
        confirmed:
          "Yes. The agreed measures have a baseline, target, measurement date and accountable owner.",
      },
    },
    "ownership.business_owner": {
      prompt:
        "Is there a named business owner who understands the procurement process and can make decisions?",
      answers: {
        not_met:
          "No. The vendor, implementation partner or IT function is effectively acting as the owner.",
        to_complete:
          "A person is named, but lacks sufficient authority, capacity or process knowledge.",
        confirmed:
          "Yes. The owner has authority, allocated capacity, process knowledge and accountability for the business outcome.",
      },
    },
    "ownership.sponsorship": {
      prompt: "Are executive sponsorship continuity and a clear escalation path in place?",
      answers: {
        not_met:
          "There is no active sponsor and no succession arrangement if the current owner leaves.",
        to_complete:
          "The sponsor supports the project informally, but there is no deputy or decision protocol.",
        confirmed:
          "The sponsor, deputy, decision rights and expected escalation time are agreed.",
      },
    },
    "process.current_state": {
      prompt:
        "Has the complete current process been mapped, including exceptions and operational purchasing?",
      answers: {
        not_met: "There is no agreed and verified current-state process map.",
        to_complete:
          "The main path or supplier selection is mapped, but exceptions, orders, receipt or invoicing are omitted.",
        confirmed:
          "The map covers the process from need identification through purchase settlement, together with roles, systems, data, exceptions and manual workarounds.",
      },
    },
    "process.target_state": {
      prompt: "Has the target process been simplified before system configuration?",
      answers: {
        not_met:
          "No. The system is expected to reproduce the current procedure step by step.",
        to_complete:
          "Simplification is planned, but ownership, exceptions or operational steps remain unresolved.",
        confirmed:
          "The target process is approved, legal requirements are separated from internal controls, and parallelisable steps are identified.",
      },
    },
    "requirements.traceability": {
      prompt:
        "Is every critical requirement tied to a business problem and acceptance evidence?",
      answers: {
        not_met:
          "No. There is a flat feature list driven mainly by demos, module names or exceptional variants.",
        to_complete:
          "Requirements are prioritised, but some lack an owner, rationale or acceptance criterion.",
        confirmed:
          "Yes. Every critical requirement has an owner, rationale, priority and testable acceptance criterion.",
      },
    },
    "requirements.discovery": {
      prompt:
        "Are requirements sufficiently defined, or is there a controlled plan to clarify them?",
      answers: {
        not_met:
          "The need is not understood, yet the vendor is expected to configure the final solution.",
        to_complete:
          "Uncertainty is recognised, but no time, prototype or criteria for ending the clarification work are defined.",
        confirmed:
          "The requirement is confirmed as stable, or user research, market engagement or a prototype is planned with decision criteria.",
      },
    },
    "data_automation.data": {
      prompt: "Are the data sources, owners, quality and target integrations known?",
      answers: {
        not_met:
          "The source of critical data or accountability for its quality is unknown.",
        to_complete:
          "Systems and interfaces are known, but data quality, ownership or exception handling has not been verified.",
        confirmed:
          "A source, owner and interface inventory exists, supported by a quality check on a representative sample.",
      },
    },
    "data_automation.ai": {
      prompt:
        "Does every AI or automation use case have a defined task, validation method and safe contingency procedure?",
      answers: {
        not_met:
          "AI is expected to replace missing requirements, missing data or human accountability for the decision.",
        to_complete:
          "There is a general intention to “use AI”, but no quality test, owner or contingency procedure.",
        confirmed:
          "AI is out of scope, or every use case has defined inputs, outputs, acceptance criteria, a human owner and contingency procedure.",
      },
    },
    "governance.boundary": {
      prompt:
        "Does procurement policy define the control boundary, with a documented source for every constraint?",
      answers: {
        not_met:
          "There is no compliance owner, or every historical step is treated as mandatory.",
        to_complete:
          "A policy exists, but it does not distinguish law, authority, risk and local convention.",
        confirmed:
          "Every control has a source, owner and rationale; the boundary covers authority, competition, ethics and documentation.",
      },
    },
    "governance.approvals": {
      prompt:
        "Is the approval matrix proportionate to value and risk and tested on real scenarios?",
      answers: {
        not_met:
          "The system must reproduce the historical sequence unchanged, or essential decision authority is missing.",
        to_complete:
          "The matrix exists, but has excessive levels, unclear exceptions or has not been tested across the complete process.",
        confirmed:
          "Approvals are minimal and proportionate, exceptions are controlled, and representative scenarios have been tested.",
      },
    },
    "adoption.users": {
      prompt:
        "Do key users have meaningful participation in design and testing, with allocated time?",
      answers: {
        not_met:
          "No. Users will first see the solution during training immediately before production launch.",
        to_complete:
          "Users are consulted, but late, irregularly or without allocated capacity.",
        confirmed:
          "Representatives of all key roles participate in process design, testing and acceptance.",
      },
    },
    "adoption.plan": {
      prompt:
        "Is there an adoption plan covering communication, training, support and usage measurement?",
      answers: {
        not_met:
          "No. Success ends at production launch, and email or spreadsheet workarounds will not be measured.",
        to_complete:
          "A change plan exists, but ownership, post-launch support or adoption metrics are missing.",
        confirmed:
          "The plan has owners, timing, post-launch support and metrics such as system transaction share, exceptions and cycle time.",
      },
    },
    "value_rollout.business_case": {
      prompt:
        "Does the business justification cover full cost and uncertainty rather than licence price alone?",
      answers: {
        not_met:
          "There is no business justification, or savings are asserted without data and a defined mechanism.",
        to_complete:
          "Major costs are included, but integration, organisational change, ongoing operation or uncertainty scenarios are omitted.",
        confirmed:
          "The business justification covers licences, implementation, integration, organisational change, operation, risk and measurable value across multiple scenarios.",
      },
    },
    "value_rollout.rollout": {
      prompt:
        "Does the implementation plan define a limited initial scope, exit criteria and arrangements for operational continuity?",
      answers: {
        not_met:
          "The plan assumes an irreversible, single full-scale launch despite unresolved conditions concerning process, data or adoption.",
        to_complete:
          "Phases exist, but there are no measurable decision gates, stop rules or rollback plan.",
        confirmed:
          "The pilot or first wave has a limited scope, entry and exit criteria, owners, and continuity and rollback arrangements.",
      },
    },
  },
} satisfies ReadinessShape;

export const readinessT = { pl: readinessPl, en: readinessEn } as const;

const practicePl = {
  metadata: {
    title: "Procurement&Beyond #8: wdrożenie systemu zakupowego | ProcuraCost",
    description:
      "Materiał praktyczny o nieefektywności procesu, odpowiedzialności biznesowej, wymaganiach, TCO i odpowiedzialnej automatyzacji.",
  },
  eyebrow: "Materiał praktyczny",
  title: "Nawet najlepsze narzędzie nie uratuje złego wdrożenia",
  subtitle:
    "Uporządkowany przegląd obserwacji z ósmego odcinka Procurement&Beyond oraz zasad ich wykorzystania w samoopisie warunków wdrożenia.",
  recordingLanguageNotice:
    "Nagranie jest w języku polskim. Odnośniki czasowe prowadzą do konkretnych fragmentów rozmowy.",
  embedTitle:
    "Procurement&Beyond, odcinek 8: Nawet najlepsze narzędzie nie uratuje złego wdrożenia",
  publishedLabel: "Data publikacji",
  durationLabel: "Czas nagrania",
  transcriptLabel: "Transkrypt",
  transcriptValue: "Automatyczne napisy YouTube w języku polskim, bez weryfikacji człowieka",
  originalVideo: "Otwórz nagranie w YouTube",
  sectionsTitle: "Indeks obserwacji z odnośnikami czasowymi",
  timestampLabel: "Fragment nagrania",
  sections: {
    professionalisation: {
      title: "Standaryzacja pracy i osąd ekspercki",
      body:
        "Rozmowa rozróżnia pracę nadającą się do standaryzacji od sytuacji wymagających osądu eksperta.",
    },
    friction_mapping: {
      title: "Nieefektywność procesu przed wyborem systemu",
      body:
        "Punktem wyjścia jest rozpoznanie konkretnej nieefektywności procesu, a nie deklaracja wdrożenia wybranego systemu.",
    },
    marginal_requirements: {
      title: "Wymagania marginalne",
      body:
        "Fragment pokazuje ryzyko rozbudowy specyfikacji o szczegóły aukcyjne o niewielkim znaczeniu dla głównego problemu.",
    },
    operational_purchasing: {
      title: "Zakupy operacyjne w pełnym przebiegu procesu",
      body:
        "Wybór dostawcy nie wyczerpuje procesu zakupowego. Zamówienia, odbiór, faktury i wyjątki muszą być jednoznacznie ujęte w zakresie.",
    },
    requirements_blind_spots: {
      title: "Luki w specyfikacji",
      body:
        "Rozmowa wskazuje możliwość pominięcia ważnych obszarów mimo szczegółowej listy funkcji.",
    },
    internal_challenger: {
      title: "Wewnętrzny właściciel decyzji",
      body:
        "Projekt potrzebuje osoby po stronie organizacji, która rozumie zakup i potrafi kwestionować założenia.",
    },
    internal_ambassador: {
      title: "Mandat i komunikacja",
      body:
        "Wewnętrzny ambasador łączy wizję biznesową, mandat decyzyjny i komunikację z użytkownikami.",
    },
    champion_continuity: {
      title: "Ciągłość właścicielstwa",
      body:
        "Odejście osoby napędzającej projekt może spowolnić pracę, jeśli nie przygotowano zastępstwa i ścieżki decyzji.",
    },
    legacy_procedure: {
      title: "System nie powinien kopiować archaicznej sekwencji",
      body:
        "Konfiguracja utrwalająca historyczne kroki bez ponownego uzasadnienia może cyfryzować nieefektywność zamiast ją usuwać.",
    },
    policy_boundary: {
      title: "Polityka jako granica kontroli",
      body:
        "Polityka może wyznaczać szerszą granicę zgodności niż jedna stała sekwencja kroków.",
    },
    tco: {
      title: "Pełny koszt zamiast ceny zakupu",
      body:
        "Uzasadnienie biznesowe powinno odróżniać cenę zakupu od kosztów wdrożenia, integracji, utrzymania i zmiany organizacyjnej.",
    },
    bielik: {
      title: "Bielik i strukturyzowanie danych rynkowych",
      body:
        "Fragment opisuje użycie modelu językowego do pracy z danymi rynkowymi z jawnym kompromisem czasu i kosztu.",
    },
    category_transfer: {
      title: "Przeniesienie konstrukcji TCO do innych kategorii",
      body:
        "Rozmowa omawia koncepcyjne przenoszenie sposobu analizy TCO i NPV między kategoriami, bez ustanawiania uniwersalnych parametrów.",
    },
    data_math_separation: {
      title: "Oddzielenie danych, matematyki i wsparcia ML",
      body:
        "Przygotowanie danych, deterministyczne obliczenie i wsparcie modelu językowego pełnią odrębne role.",
    },
  },
  boundary: {
    title: "Granica wykorzystania materiału",
    supportsTitle: "Co materiał wspiera",
    supports: [
      "Projektowanie pytań o nieefektywność procesu, odpowiedzialność biznesową, wymagania, dane, adopcję i TCO.",
      "Formułowanie hipotez do późniejszego sprawdzenia na danych organizacji.",
      "Planowanie warsztatów rozpoznania potrzeb, mapowania procesu i ograniczonego pilotażu.",
    ],
    doesNotSupportTitle: "Czego materiał nie wspiera",
    doesNotSupport: [
      "Kalibracji parametrów, zakresów lub progów modelu kosztowego ProcuraCost.",
      "Twierdzeń o prawdopodobieństwie sukcesu lub porażki wdrożenia.",
      "Założenia, że Bielik albo inny model językowy wykonuje obliczenia TCO.",
    ],
  },
  bielikTcoBoundary:
    "Bielik może wspierać strukturyzowanie danych rynkowych. Obliczenia TCO wykonuje przejrzysty, deterministyczny model. Model językowy nie oblicza wyniku.",
  sourceNote:
    "Lista kontrolna ProcuraCost została opracowana przez autora jako zbiór hipotez operacyjnych; rozmowa branżowa Procurement&Beyond #8 z Pawłem Mamcarzem stanowi wyłącznie kontekst tematyczny dla projektowania pytań. Jej fragmenty nie dowodzą spełnienia poszczególnych kryteriów. Automatyczny transkrypt YouTube nie został zweryfikowany przez człowieka. Materiał nie wyznacza progów, wag ani parametrów modelu ProcuraCost.",
  calculatorCta: "Otwórz kalkulator",
} as const;

type PracticeShape = LangShape<typeof practicePl>;

const practiceEn = {
  metadata: {
    title: "Procurement&Beyond episode 8: procurement system implementation | ProcuraCost",
    description:
      "Practitioner material on process inefficiency, business ownership, requirements, TCO and responsible automation.",
  },
  eyebrow: "Practitioner material",
  title: "Even the best tool cannot rescue a poor implementation",
  subtitle:
    "A structured review of observations from Procurement&Beyond episode 8 and the conditions for using them in the implementation-conditions self-description.",
  recordingLanguageNotice:
    "The recording is in Polish. Timestamp links open the relevant parts of the conversation.",
  embedTitle:
    "Procurement&Beyond episode 8: Even the best tool cannot rescue a poor implementation",
  publishedLabel: "Published",
  durationLabel: "Duration",
  transcriptLabel: "Transcript",
  transcriptValue: "Automatic Polish YouTube captions, not human verified",
  originalVideo: "Open the recording on YouTube",
  sectionsTitle: "Observation index with timestamp links",
  timestampLabel: "Recording segment",
  sections: {
    professionalisation: {
      title: "Standardised work and expert judgement",
      body:
        "The conversation distinguishes work suited to standardisation from situations that require expert judgement.",
    },
    friction_mapping: {
      title: "Process inefficiency before system selection",
      body:
        "The starting point is a specific process inefficiency, not a declaration that a chosen system will be implemented.",
    },
    marginal_requirements: {
      title: "Marginal requirements",
      body:
        "This segment illustrates the risk of expanding a specification with auction details that have limited relevance to the main problem.",
    },
    operational_purchasing: {
      title: "Operational purchasing in the complete process",
      body:
        "Supplier selection is not the whole procurement process. Orders, receipt, invoices and exceptions need an explicit place in scope.",
    },
    requirements_blind_spots: {
      title: "Specification blind spots",
      body:
        "The conversation notes that important areas may be omitted despite a detailed feature list.",
    },
    internal_challenger: {
      title: "Internal decision owner",
      body:
        "The project needs someone inside the organisation who understands the purchase and can challenge assumptions.",
    },
    internal_ambassador: {
      title: "Mandate and communication",
      body:
        "An internal ambassador connects business intent, decision authority and communication with users.",
    },
    champion_continuity: {
      title: "Continuity of ownership",
      body:
        "A project may slow when its champion leaves if no deputy and decision path have been prepared.",
    },
    legacy_procedure: {
      title: "A system should not copy an archaic sequence",
      body:
        "Configuration that preserves historical steps without renewed justification may digitise inefficiency instead of removing it.",
    },
    policy_boundary: {
      title: "Policy as a control boundary",
      body:
        "Policy can define a wider compliance boundary than one fixed sequence of steps.",
    },
    tco: {
      title: "Full cost rather than purchase price",
      body:
        "A business justification should distinguish purchase price from implementation, integration, operating and organisational-change costs.",
    },
    bielik: {
      title: "Bielik and market-data structuring",
      body:
        "This segment describes using a language model to work with market data, with an explicit time and cost trade-off.",
    },
    category_transfer: {
      title: "Transferring the TCO construct across categories",
      body:
        "The conversation considers conceptual transfer of TCO and NPV analysis across categories without establishing universal parameters.",
    },
    data_math_separation: {
      title: "Separating data, mathematics and ML support",
      body:
        "Data preparation, deterministic calculation and language-model support have separate roles.",
    },
  },
  boundary: {
    title: "Boundary for using this material",
    supportsTitle: "What the material supports",
    supports: [
      "Designing questions about process inefficiency, business ownership, requirements, data, adoption and TCO.",
      "Forming hypotheses for later testing with organisational data.",
      "Planning requirements-clarification workshops, process mapping and a limited pilot.",
    ],
    doesNotSupportTitle: "What the material does not support",
    doesNotSupport: [
      "Calibration of ProcuraCost cost-model parameters, ranges or thresholds.",
      "Claims about the probability of implementation success or failure.",
      "An assumption that Bielik or another language model performs TCO calculations.",
    ],
  },
  bielikTcoBoundary:
    "Bielik may support market-data structuring. The transparent deterministic model performs the TCO calculation. The language model does not calculate the result.",
  sourceNote:
    "The ProcuraCost checklist was authored as a set of operational hypotheses. The Procurement&Beyond episode 8 practitioner interview with Paweł Mamcarz provides thematic context only for question design; its segments do not evidence whether individual criteria are met. The automatic YouTube transcript has not been human verified. The material does not set thresholds, weights or ProcuraCost model parameters.",
  calculatorCta: "Open the calculator",
} satisfies PracticeShape;

export const practiceT = { pl: practicePl, en: practiceEn } as const;


const systemPagePl = {
  notFoundTitle: "Nie znaleziono strony",
  notFoundBody: "Ten adres nie prowadzi do dostępnej strony. Wróć na stronę główną lub rozpocznij porównanie.",
  home: "Strona główna",
  calculator: "Otwórz porównanie",
  errorTitle: "Nie udało się wyświetlić strony",
  errorBody: "Spróbuj ponownie. Jeśli błąd się powtarza, wróć na stronę główną. Szkic zapisany w przeglądarce można przywrócić w kalkulatorze.",
  retry: "Spróbuj ponownie",
} as const;

const systemPageEn = {
  notFoundTitle: "Page not found",
  notFoundBody: "This address does not lead to an available page. Return to the homepage or start a comparison.",
  home: "Homepage",
  calculator: "Open comparison",
  errorTitle: "The page could not be displayed",
  errorBody: "Try again. If the error persists, return to the homepage. You can restore a draft saved in this browser from the calculator.",
  retry: "Try again",
} satisfies LangShape<typeof systemPagePl>;

export const systemPageT = { pl: systemPagePl, en: systemPageEn } as const;
