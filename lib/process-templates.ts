// Procurement process step templates and technology level definitions.
//
// Academic basis:
// - Mandatory wait times: PZP (Dz.U. 2019 poz. 2019) + EU Directive 2014/24/UE
// - Stakeholder hours: calibrated / illustrative (role-hour magnitudes are modeling assumptions)
// - Tech level impacts: timeMultiplier anchored to APQC/Hackett benchmarks; coordCostPerDay/toolCostPerProcess are modeling assumptions

export type ProcessType = "pzp_eu" | "pzp_krajowy" | "private_formal" | "policy_only" | "catalog_order" | "mrp_order" | "capex" | "custom";
export type TechLevelId = "manual" | "sourcing_tool" | "partial_erp" | "end_to_end";
export type StakeholderRole = "buyer" | "lawyer" | "finance" | "manager" | "executive" | "requestor";

export interface ProcessStep {
  id: string;
  name: string;
  nameEn: string;
  // Days in the rigid process path
  rigidDays: number;
  // Days in the flexible (policy_only) path. null = step eliminated.
  flexibleDays: number | null;
  // Legally mandated minimum waiting period — cannot be shortened
  mandatoryWait: boolean;
  // Hours each stakeholder role spends on this step
  participation: Partial<Record<StakeholderRole, number>>;
  // Explanation shown to the user
  note: string;
  noteEn: string;
}

export interface TechLevel {
  id: TechLevelId;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  examples: string;
  // Multiplier applied to base step duration (manual = slower coordination)
  timeMultiplier: number;
  // PLN/day: cost of coordination overhead (email chains, phone, manual tracking)
  coordCostPerDay: number;
  // PLN/process: amortised license/subscription cost of the tool
  toolCostPerProcess: number;
  // Multiplier on bypass probability. end_to_end makes bypass nearly impossible.
  bypassProbMultiplier: number;
  // Process rigidity when used with policy_only (lower = more field-like)
  policyRigidityIndex: number;
}

// ─── Technology level definitions ──────────────────────────────────────────────

export const TECH_LEVELS: Record<TechLevelId, TechLevel> = {
  manual: {
    id: "manual",
    name: "Manualny (Excel / email)",
    nameEn: "Manual (Excel / email)",
    description: "Wszystkie kroki ręcznie — Excel, email, telefon, papier. Zero wsparcia systemowego.",
    descriptionEn: "All steps manual — Excel, email, phone, paper. Zero system support.",
    examples: "Notatnik, Outlook, arkusze Excel",
    timeMultiplier: 1.40,
    coordCostPerDay: 500,
    toolCostPerProcess: 0,
    bypassProbMultiplier: 1.50,
    policyRigidityIndex: 0.35,
  },
  sourcing_tool: {
    id: "sourcing_tool",
    name: "Narzędzie sourcingowe",
    nameEn: "Sourcing tool",
    description: "Dedykowane narzędzie do sourcingu i przetargów. Reszta procesu (ERP, płatności) — manualnie lub oddzielnie.",
    descriptionEn: "Dedicated sourcing/tendering tool. Rest of the process (ERP, payments) — manual or separate.",
    examples: "SAP Sourcing, Ivalua, Jaggaer, Bonfire",
    timeMultiplier: 1.15,
    coordCostPerDay: 200,
    toolCostPerProcess: 800,
    bypassProbMultiplier: 0.80,
    policyRigidityIndex: 0.22,
  },
  partial_erp: {
    id: "partial_erp",
    name: "Częściowy ERP",
    nameEn: "Partial ERP",
    description: "ERP obsługuje zamówienia i płatności. Sourcing i zarządzanie dostawcami — poza systemem lub manualnie.",
    descriptionEn: "ERP handles purchase orders and payments. Sourcing and supplier management — outside the system or manual.",
    examples: "SAP MM + ręczne sourcing, Oracle P2P + Excel RFQ",
    timeMultiplier: 1.00,
    coordCostPerDay: 100,
    toolCostPerProcess: 1200,
    bypassProbMultiplier: 0.55,
    policyRigidityIndex: 0.15,
  },
  end_to_end: {
    id: "end_to_end",
    name: "End-to-end (Ariba / Coupa)",
    nameEn: "End-to-end (Ariba / Coupa)",
    description: "Pełny cykl zakupowy w jednym systemie: sourcing, zatwierdzenia, PO, faktura, rozliczenie automatyczne. Compliance egzekwowany przez system.",
    descriptionEn: "Full procurement cycle in one system: sourcing, approvals, PO, invoice, automatic settlement. Compliance enforced by the system — this is how the field model is implemented in technology.",
    examples: "SAP Ariba, Coupa, Oracle Fusion Procurement",
    timeMultiplier: 0.70,
    coordCostPerDay: 20,
    toolCostPerProcess: 2000,
    bypassProbMultiplier: 0.10,
    policyRigidityIndex: 0.05,
  },
};

// ─── Process rigidity by type ───────────────────────────────────────────────────
// Used for bypass probability and TCO calculations.
// The cardinal 0–1 values are a Grade-C modeling assumption: the ordinal ranking
// (pzp_eu > pzp_krajowy > capex > private_formal > … > mrp_order) is defensible, but
// there is no external 0–1 anchor for the exact magnitudes — they are internal calibration.

export const PROCESS_RIGIDITY: Record<ProcessType, number> = {
  pzp_eu: 0.95,
  pzp_krajowy: 0.80,
  private_formal: 0.60,
  policy_only: 0.15,
  catalog_order: 0.20,
  mrp_order: 0.12,
  capex: 0.72,
  custom: 0.50,
};

// ─── Corruption / favoritism-risk context by process type ───────────────────────
// A calibrated governance-risk index (Grade C) for how much favoritism, price-dispersion
// and value loss a DISCRETIONARY award would risk in this context (0 = none, 1 = high
// public-money scrutiny). This is what competitive (rigid) tendering averts — the basis
// of the governance value credited to formal procedures. The pzp_eu = 1.0 anchor is tied
// to Szucs 2024 (discretion raises prices and selects less-productive contractors); the
// ordinal direction is taken from OECD; the intermediate gradient between anchors is a
// modeling assumption — sensitivity-tested. Public procurement carries the highest stakes.
export const CORRUPTION_RISK_CONTEXT: Record<ProcessType, number> = {
  pzp_eu: 1.0,
  pzp_krajowy: 0.9,
  capex: 0.6,
  policy_only: 0.45,
  private_formal: 0.4,
  custom: 0.4,
  catalog_order: 0.2,
  mrp_order: 0.15,
};

// ─── Process step templates ─────────────────────────────────────────────────────

const PZP_EU_STEPS: ProcessStep[] = [
  {
    id: "needs_analysis",
    name: "Analiza potrzeb i budżet",
    nameEn: "Needs analysis and budget approval",
    rigidDays: 7,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { requestor: 16, buyer: 8, finance: 8, manager: 4 },
    note: "Określenie wymagań, zatwierdzenie budżetu, wstępna specyfikacja. Zamawiający (biznes) angażuje się najbardziej.",
    noteEn: "Requirements definition, budget approval, preliminary specification. Requestor (business unit) most involved.",
  },
  {
    id: "siwz_prep",
    name: "Opracowanie SIWZ/SWZ",
    nameEn: "Specification of terms (SIWZ/SWZ) preparation",
    rigidDays: 10,
    flexibleDays: null,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 24, lawyer: 16 },
    note: "Opracowanie pełnej dokumentacji przetargowej zgodnej z PZP. Zamawiający konsultuje wymagania techniczne.",
    noteEn: "Preparation of full tender documentation compliant with PZP. Requestor consults on technical requirements.",
  },
  {
    id: "publication",
    name: "Publikacja BZP/TED",
    nameEn: "Publication in BZP/TED",
    rigidDays: 35,
    flexibleDays: null,
    mandatoryWait: true,
    participation: { buyer: 4 },
    note: "Obowiązkowy termin składania ofert — min. 35 dni (Dyrektywa 2014/24/UE)",
    noteEn: "Mandatory offer submission period — min. 35 days (EU Directive 2014/24)",
  },
  {
    id: "bid_evaluation",
    name: "Ocena ofert",
    nameEn: "Bid evaluation",
    rigidDays: 10,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 24, lawyer: 8, finance: 8 },
    note: "Formalna weryfikacja i ocena punktowa wszystkich złożonych ofert. Zamawiający ocenia aspekty techniczne.",
    noteEn: "Formal verification and scoring of all submitted bids. Requestor assesses technical fit.",
  },
  {
    id: "clarifications",
    name: "Wyjaśnienia i negocjacje",
    nameEn: "Clarifications and negotiations",
    rigidDays: 7,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { buyer: 16, lawyer: 8 },
    note: "Pytania do wykonawców, ewentualne negocjacje (dialog/negocjacje z ogłoszeniem)",
    noteEn: "Queries to bidders, possible negotiations (competitive dialogue / negotiated procedure)",
  },
  {
    id: "award_committee",
    name: "Komisja przetargowa",
    nameEn: "Award committee",
    rigidDays: 3,
    flexibleDays: null,
    mandatoryWait: false,
    participation: { buyer: 8, lawyer: 4, executive: 4 },
    note: "Formalne posiedzenie komisji, wybór najkorzystniejszej oferty, decyzja zarządu",
    noteEn: "Formal committee meeting, selection of best offer, board decision",
  },
  {
    id: "standstill",
    name: "Standstill (art. 264 PZP)",
    nameEn: "Standstill period (art. 264 PZP)",
    rigidDays: 10,
    flexibleDays: null,
    mandatoryWait: true,
    participation: {},
    note: "Obowiązkowy okres zawieszenia przed podpisaniem umowy — min. 10 dni (komunikacja elektroniczna) / 15 dni (inny sposób) — art. 264 ust. 1 PZP",
    noteEn: "Mandatory suspension before signing — min. 10 days (electronic communication) / 15 days (other means) — art. 264(1) PZP",
  },
  {
    id: "contract_signing",
    name: "Podpisanie umowy",
    nameEn: "Contract signing",
    rigidDays: 5,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { buyer: 4, lawyer: 8, executive: 2 },
    note: "Przegląd prawny, ostateczna akceptacja, podpisanie kontraktu",
    noteEn: "Legal review, final approval, contract execution",
  },
];

const PZP_KRAJOWY_STEPS: ProcessStep[] = [
  {
    id: "needs_analysis",
    name: "Analiza potrzeb i budżet",
    nameEn: "Needs analysis and budget approval",
    rigidDays: 5,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { requestor: 12, buyer: 8, finance: 6, manager: 3 },
    note: "Określenie wymagań i zatwierdzenie budżetu. Zamawiający definiuje potrzebę.",
    noteEn: "Requirements definition and budget approval. Requestor defines the need.",
  },
  {
    id: "spec_prep",
    name: "Przygotowanie specyfikacji",
    nameEn: "Specification preparation",
    rigidDays: 7,
    flexibleDays: null,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 16, lawyer: 8 },
    note: "Opracowanie dokumentacji — uproszczone względem progów UE",
    noteEn: "Documentation preparation — simplified vs EU thresholds",
  },
  {
    id: "publication",
    name: "Ogłoszenie BZP",
    nameEn: "Publication in BZP",
    rigidDays: 21,
    flexibleDays: null,
    mandatoryWait: true,
    participation: { buyer: 3 },
    note: "Obowiązkowy termin składania ofert — min. 7 dni (dostawy/usługi) / 14 dni (roboty budowlane) — art. 283 PZP (21 dni to typowy, nie minimalny czas)",
    noteEn: "Mandatory offer submission period — min. 7 days (supplies/services) / 14 days (construction works) — art. 283 PZP (21 days is a typical, not minimum, duration)",
  },
  {
    id: "bid_evaluation",
    name: "Ocena ofert",
    nameEn: "Bid evaluation",
    rigidDays: 8,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { buyer: 16, lawyer: 6, finance: 6 },
    note: "Ocena punktowa i weryfikacja dokumentów",
    noteEn: "Scoring and document verification",
  },
  {
    id: "approval",
    name: "Zatwierdzenie i kontrakt",
    nameEn: "Approval and contract",
    rigidDays: 7,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { buyer: 8, lawyer: 6, executive: 3 },
    note: "Wewnętrzne zatwierdzenie, przegląd prawny, podpisanie",
    noteEn: "Internal approval, legal review, signing",
  },
];

const PRIVATE_FORMAL_STEPS: ProcessStep[] = [
  {
    id: "rfi",
    name: "RFI / Market sounding",
    nameEn: "RFI / Market sounding",
    rigidDays: 7,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 16, finance: 4 },
    note: "Rozpoznanie rynku, zebranie informacji od potencjalnych dostawców. Zamawiający potwierdza wymagania.",
    noteEn: "Market reconnaissance, gathering information from potential suppliers. Requestor confirms requirements.",
  },
  {
    id: "rfq",
    name: "RFQ i ocena ofert",
    nameEn: "RFQ and bid evaluation",
    rigidDays: 10,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { buyer: 24, finance: 8 },
    note: "Formalne zapytanie ofertowe i ocena punktowa odpowiedzi",
    noteEn: "Formal request for quotation and scoring of responses",
  },
  {
    id: "internal_approval",
    name: "Approval komitetu",
    nameEn: "Committee approval",
    rigidDays: 7,
    flexibleDays: 2,
    mandatoryWait: false,
    participation: { manager: 4, finance: 4, executive: 3 },
    note: "Wewnętrzny komitet zakupowy lub approval finansowy — typowy w korporacjach",
    noteEn: "Internal procurement committee or financial approval — typical in corporations",
  },
  {
    id: "negotiation",
    name: "Negocjacje kontraktu",
    nameEn: "Contract negotiation",
    rigidDays: 10,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { buyer: 24, lawyer: 16 },
    note: "Negocjacje warunków handlowych i prawnych",
    noteEn: "Negotiation of commercial and legal terms",
  },
  {
    id: "legal_review",
    name: "Przegląd prawny",
    nameEn: "Legal review",
    rigidDays: 7,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { lawyer: 16, finance: 4 },
    note: "Przegląd umowy przez dział prawny i finanse",
    noteEn: "Contract review by legal and finance departments",
  },
  {
    id: "signing",
    name: "Podpisanie",
    nameEn: "Signing",
    rigidDays: 3,
    flexibleDays: 2,
    mandatoryWait: false,
    participation: { buyer: 2, executive: 2 },
    note: "Finalne podpisanie i archiwizacja",
    noteEn: "Final signing and archiving",
  },
];

const POLICY_ONLY_STEPS: ProcessStep[] = [
  {
    id: "requirements",
    name: "Wymagania i sounding",
    nameEn: "Requirements and market sounding",
    rigidDays: 5,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 12, manager: 2 },
    note: "Szybkie rozpoznanie rynku, 2–3 dostawców. Zamawiający kluczowy na starcie.",
    noteEn: "Quick market sounding, 2–3 suppliers. Requestor critical at the start.",
  },
  {
    id: "evaluation",
    name: "Ocena, negocjacja i wybór",
    nameEn: "Evaluation, negotiation and selection",
    rigidDays: 7,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { requestor: 4, buyer: 16, finance: 4 },
    note: "Ocena ofert, negocjacja warunków handlowych i wybór dostawcy — wszystko w ramach polityki zakupowej. Zamawiający potwierdza dopasowanie.",
    noteEn: "Offer evaluation, commercial negotiation and supplier selection — all within the procurement policy framework. Requestor confirms fit.",
  },
  {
    id: "approval",
    name: "Approval",
    nameEn: "Approval",
    rigidDays: 3,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { manager: 2, finance: 2 },
    note: "Zatwierdzenie zgodnie z matrycą uprawnień",
    noteEn: "Approval per authorization matrix",
  },
  {
    id: "contract",
    name: "Kontrakt",
    nameEn: "Contract",
    rigidDays: 5,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { buyer: 4, lawyer: 4 },
    note: "Uproszczona umowa lub order w systemie",
    noteEn: "Simplified agreement or system order",
  },
];

const CATALOG_ORDER_STEPS: ProcessStep[] = [
  {
    id: "need_identification",
    name: "Identyfikacja potrzeby",
    nameEn: "Need identification",
    rigidDays: 1,
    flexibleDays: 1,
    mandatoryWait: false,
    participation: { requestor: 1 },
    note: "Zamawiający identyfikuje potrzebę i wyszukuje pozycję w katalogu dostawcy",
    noteEn: "Requestor identifies need and searches for item in supplier catalog",
  },
  {
    id: "catalog_selection",
    name: "Wybór z katalogu",
    nameEn: "Catalog selection",
    rigidDays: 1,
    flexibleDays: 1,
    mandatoryWait: false,
    participation: { requestor: 1, buyer: 0.5 },
    note: "Selekcja pre-negocjowanej pozycji — cena i dostępność egzekwowane przez system",
    noteEn: "Selection of pre-negotiated item — price and availability enforced by system",
  },
  {
    id: "po_approval",
    name: "Zatwierdzenie PO",
    nameEn: "PO approval",
    rigidDays: 1,
    flexibleDays: 1,
    mandatoryWait: false,
    participation: { manager: 0.5 },
    note: "Automatyczne lub jednokrokowe zatwierdzenie zgodnie z matrycą uprawnień",
    noteEn: "Automatic or single-step approval per authorization matrix",
  },
];

const MRP_ORDER_STEPS: ProcessStep[] = [
  {
    id: "mrp_trigger",
    name: "Sygnał MRP",
    nameEn: "MRP trigger",
    rigidDays: 0,
    flexibleDays: 0,
    mandatoryWait: false,
    participation: {},
    note: "System MRP/ERP generuje zlecenie zakupu automatycznie na podstawie planu produkcji — zero czasu ludzkiego",
    noteEn: "MRP/ERP system automatically generates purchase order based on production plan — zero human time",
  },
  {
    id: "po_generation",
    name: "Generowanie i weryfikacja PO",
    nameEn: "PO generation and verification",
    rigidDays: 1,
    flexibleDays: 1,
    mandatoryWait: false,
    participation: { buyer: 1 },
    note: "Automatyczne generowanie — buyer tylko weryfikuje wyjątki (monopol, nowy dostawca)",
    noteEn: "Automatic generation — buyer only handles exceptions (monopoly, new supplier)",
  },
  {
    id: "goods_receipt",
    name: "Odbiór towaru (GR)",
    nameEn: "Goods receipt (GR)",
    rigidDays: 1,
    flexibleDays: 1,
    mandatoryWait: false,
    participation: { requestor: 1 },
    note: "Potwierdzenie odbioru w systemie — zamknięcie pętli P2P",
    noteEn: "Goods receipt confirmation in system — closing the P2P loop",
  },
];

const CAPEX_STEPS: ProcessStep[] = [
  {
    id: "business_case",
    name: "Business case i budżet CAPEX",
    nameEn: "Business case and CAPEX budget",
    rigidDays: 14,
    flexibleDays: 10,
    mandatoryWait: false,
    participation: { requestor: 24, finance: 16, manager: 8, executive: 4 },
    note: "Uzasadnienie inwestycji, analiza NPV/IRR, zatwierdzenie budżetu kapitałowego — governance ma tu wartość",
    noteEn: "Investment justification, NPV/IRR analysis, capital budget approval — governance has value here",
  },
  {
    id: "technical_spec",
    name: "Specyfikacja techniczna",
    nameEn: "Technical specification",
    rigidDays: 10,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { requestor: 32, buyer: 16, lawyer: 8 },
    note: "Pełna specyfikacja techniczna i wymagania eksploatacyjne środka trwałego",
    noteEn: "Full technical specification and operational requirements for fixed asset",
  },
  {
    id: "capex_committee",
    name: "Komitet CAPEX",
    nameEn: "CAPEX committee",
    rigidDays: 7,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { finance: 8, manager: 6, executive: 4 },
    note: "Zatwierdzenie przez komitet CAPEX — formalne ale uzasadnione przy dużych inwestycjach",
    noteEn: "CAPEX committee approval — formal but justified for large investments",
  },
  {
    id: "vendor_selection",
    name: "Selekcja i ocena dostawcy",
    nameEn: "Vendor selection and evaluation",
    rigidDays: 14,
    flexibleDays: 10,
    mandatoryWait: false,
    participation: { requestor: 16, buyer: 32, finance: 8, manager: 8 },
    note: "RFP/RFQ lub negocjacje bezpośrednie z kwalifikowanymi dostawcami",
    noteEn: "RFP/RFQ or direct negotiations with qualified vendors",
  },
  {
    id: "legal_review",
    name: "Przegląd prawny kontraktu",
    nameEn: "Contract legal review",
    rigidDays: 7,
    flexibleDays: 5,
    mandatoryWait: false,
    participation: { lawyer: 24, finance: 8 },
    note: "Przegląd umowy inwestycyjnej, gwarancji, SLA, warunków serwisowych",
    noteEn: "Review of investment contract, warranties, SLAs, service conditions",
  },
  {
    id: "final_approval",
    name: "Finalna akceptacja zarządu",
    nameEn: "Final board approval",
    rigidDays: 5,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { executive: 4, finance: 4 },
    note: "Finalne zatwierdzenie inwestycji przed podpisaniem — konieczne przy dużej wartości",
    noteEn: "Final investment approval before signing — necessary for high-value assets",
  },
  {
    id: "contract_signing",
    name: "Podpisanie i rejestracja",
    nameEn: "Signing and asset registration",
    rigidDays: 3,
    flexibleDays: 2,
    mandatoryWait: false,
    participation: { buyer: 4, lawyer: 8, executive: 2 },
    note: "Podpisanie umowy inwestycyjnej i rejestracja środka trwałego w systemie",
    noteEn: "Investment contract signing and fixed asset registration in system",
  },
];

export const PROCESS_TEMPLATES: Record<Exclude<ProcessType, "custom">, ProcessStep[]> = {
  pzp_eu: PZP_EU_STEPS,
  pzp_krajowy: PZP_KRAJOWY_STEPS,
  private_formal: PRIVATE_FORMAL_STEPS,
  policy_only: POLICY_ONLY_STEPS,
  catalog_order: CATALOG_ORDER_STEPS,
  mrp_order: MRP_ORDER_STEPS,
  capex: CAPEX_STEPS,
};

export type ProcessCategory = "strategic" | "strategic_pzp" | "operational";

/**
 * Distinction requested for academic and practical clarity (per reviewer feedback):
 * - Direct: Spend that becomes part of the organization's product/service offering (production inputs, components, etc.)
 * - Indirect: All other spend that supports operations but does not go into the final deliverable.
 */
export type SpendType = "direct" | "indirect";

/**
 * Phase of the procurement value chain:
 * - Upstream: Strategic activities (sourcing, contracting, risk management, supplier relationship management)
 * - Downstream: Operational/transactional activities (requisition to payment, goods receipt, invoicing, supplier performance evaluation)
 */
export type ProcessPhase = "upstream" | "downstream";

export const PROCESS_TYPE_META: Record<Exclude<ProcessType, "custom">, { category: ProcessCategory; name: string; nameEn: string; description: string; descriptionEn: string }> = {
  pzp_eu: {
    category: "strategic_pzp",
    name: "Strategiczne PZP — przetarg nieograniczony (powyżej progów UE)",
    nameEn: "Strategic PZP — open tender (above EU thresholds)",
    description: "Pełne postępowanie przetargowe z obowiązkowymi okresami oczekiwania. Dotyczy zamówień powyżej progów UE: ok. 600 tys.–930 tys. PLN dla dostaw/usług oraz ok. 23,3 mln PLN dla robót budowlanych (progi 2026, wg kursu UZP).",
    descriptionEn: "Full tender procedure with mandatory waiting periods. Applies to contracts above the EU thresholds: ~PLN 600k–930k for supplies/services and ~PLN 23.3M for construction works (2026 thresholds, UZP conversion).",
  },
  pzp_krajowy: {
    category: "strategic_pzp",
    name: "Strategiczne PZP — postępowanie krajowe (130k PLN – próg UE)",
    nameEn: "Strategic PZP — national procedure (130k PLN – EU threshold)",
    description: "Uproszczone postępowanie krajowe. Shorter mandatory waiting periods than EU threshold.",
    descriptionEn: "Simplified national procedure. Shorter mandatory waiting periods than EU threshold.",
  },
  private_formal: {
    category: "strategic",
    name: "Strategiczny zakup prywatny — formalny przetarg (RFQ/RFP)",
    nameEn: "Strategic private purchase — formal tender (RFQ/RFP)",
    description: "Sektor prywatny — wewnętrzny komitet, formalny RFQ/RFP, przegląd prawny. Bez mandatory waits PZP, ale z korporacyjnymi procedurami approval.",
    descriptionEn: "Private sector — internal committee, formal RFQ/RFP, legal review. No mandatory PZP waits, but with corporate approval procedures.",
  },
  policy_only: {
    category: "strategic",
    name: "Strategiczny zakup elastyczny — polityka zakupowa (ścieżka elastyczna)",
    nameEn: "Strategic flexible purchase — procurement policy",
    description: "Zakup prowadzony wyłącznie w ramach polityki zakupowej — bez mandatory procedur. Czas i metoda wybierane przez kupca zgodnie z matrycą uprawnień.",
    descriptionEn: "Purchase conducted solely within the procurement policy framework — no mandatory procedures. Time and method chosen by the buyer per authorization matrix.",
  },
  capex: {
    category: "strategic",
    name: "Strategiczna inwestycja CAPEX (uzasadnione zarządzanie)",
    nameEn: "Strategic CAPEX investment (justified governance)",
    description: "Zakup środków trwałych. Procedury CAPEX są uzasadnione — wysoka wartość, długi horyzont, governance to tu wartość, nie koszt. Jednak nawet tu można skrócić o 30%.",
    descriptionEn: "Fixed asset procurement. CAPEX procedures are justified — high value, long horizon, governance is value here, not overhead. Yet even here 30% reduction is achievable.",
  },
  catalog_order: {
    category: "operational",
    name: "Operacyjne zamówienie z katalogu (guided buying)",
    nameEn: "Operational catalog order (guided buying)",
    description: "Realizacja pre-negocjowanego kontraktu przez katalog dostawcy. Dostawca i cena są już ustalone — kupiec wybiera, nie negocjuje. System egzekwuje compliance. Porównanie: ręczne PO vs. guided buying w ERP/Ariba.",
    descriptionEn: "Execution against a pre-negotiated contract via supplier catalog. Supplier and price are already set — buyer selects, does not negotiate. System enforces compliance. Comparison: manual PO vs. guided buying in ERP/Ariba.",
  },
  mrp_order: {
    category: "operational",
    name: "Operacyjne zlecenie MRP/cykl produkcyjny (automatyczny)",
    nameEn: "Operational MRP order / production cycle (automated)",
    description: "Automatyczna realizacja na bazie planu produkcji. Zakontraktowany dostawca, zakontraktowana cena — ERP/MRP generuje PO bez interwencji kupca. Porównanie: systemy papierowe vs. w pełni zautomatyzowane.",
    descriptionEn: "Automated execution based on production plan. Contracted supplier, contracted price — ERP/MRP generates POs without buyer intervention. Comparison: paper-based vs. fully automated systems.",
  },
};

// ─── Helper functions ───────────────────────────────────────────────────────────

/** Additional time compression applied to the flexible (policy-only) path.
 * This factor represents the assumption that, even at the same technology level,
 * a policy-based approach allows for meaningfully faster execution (~15% on average)
 * due to elimination of mandatory formal steps, reduced coordination overhead,
 * and greater buyer discretion in sequencing work.
 *
 * Source: internal modeling assumption based on OECD procurement performance data
 * and practical benchmarks from end-to-end digital procurement implementations.
 */
const FLEXIBLE_PATH_TIME_COMPRESSION = 0.85;

/**
 * Context-aware flexible path compression.
 * We assume that policy-based (flexible) approaches save relatively more time
 * in Upstream/strategic work than in standardized Downstream execution.
 */
function getFlexibleTimeCompression(
  processPhase?: "upstream" | "downstream"
): number {
  if (processPhase === "upstream") return 0.78; // bigger time saving in strategic work
  if (processPhase === "downstream") return 0.90; // smaller relative gain in operational work
  return FLEXIBLE_PATH_TIME_COMPRESSION;
}

export function getSteps(processType: ProcessType, customSteps?: ProcessStep[]): ProcessStep[] {
  if (processType === "custom") return customSteps ?? PROCESS_TEMPLATES.private_formal;
  return PROCESS_TEMPLATES[processType];
}

export function deriveRigidDays(
  steps: ProcessStep[], 
  techMultiplier: number,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect"
): number {
  // Deepened per-step contextual adjustment (pogłębienie modelu)
  // In Upstream + Direct the most strategic/risky steps require materially more calendar time:
  // more alignment rounds, legal reviews, board-level prep, risk workshops, supplier iterations.
  const stepDayBoost = (stepId: string): number => {
    if (processPhase !== "upstream") return 1.0;
    if (spendType !== "direct") return 1.0;

    // Highest governance load steps in strategic direct sourcing
    if (["siwz_prep", "spec_prep", "clarifications", "bid_evaluation", "award_committee", "contract_signing", "needs_analysis"].includes(stepId)) {
      return 1.22; // +22% calendar days — extra negotiation/alignment cycles
    }
    if (["publication", "standstill"].includes(stepId)) {
      return 1.08; // modest extension (mandatory periods + extra internal sign-off)
    }
    return 1.0;
  };

  // Mandatory legal waiting periods (publication, standstill) are fixed by statute and
  // must NOT be compressed by the technology multiplier — they stay at their legal floor.
  let mandatoryDays = 0;
  let adjustedCompressible = 0;
  for (const s of steps) {
    if (s.mandatoryWait) {
      mandatoryDays += s.rigidDays;
    } else {
      adjustedCompressible += s.rigidDays * stepDayBoost(s.id);
    }
  }

  // Global strategic premium (kept for calibration stability) — compressible work only
  if (processPhase === "upstream" && spendType === "direct") {
    adjustedCompressible *= 1.06;
  }

  return Math.round(adjustedCompressible * techMultiplier + mandatoryDays);
}

export function deriveFlexibleDays(
  steps: ProcessStep[], 
  techMultiplier: number,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect"
): number {
  const compression = getFlexibleTimeCompression(processPhase);

  // Deepened: in flexible path, Upstream+Direct benefits from the largest time compression
  // because the eliminated formal steps (publication, standstill, formal committees) are exactly
  // the ones that are heaviest in strategic direct sourcing.
  const stepCompressionBonus = (stepId: string): number => {
    if (processPhase !== "upstream" || spendType !== "direct") return 1.0;
    // Steps that disappear or shrink dramatically under policy in high-stakes direct work
    if (["siwz_prep", "spec_prep", "publication", "standstill", "award_committee"].includes(stepId)) {
      return 0.82; // extra 18% compression on the heaviest formal overhead
    }
    if (["clarifications", "bid_evaluation", "contract_signing"].includes(stepId)) {
      return 0.90;
    }
    return 1.0;
  };

  let adjustedBase = 0;
  for (const s of steps) {
    if (s.flexibleDays == null) continue;
    adjustedBase += s.flexibleDays * stepCompressionBonus(s.id);
  }

  if (processPhase === "upstream" && spendType === "direct") {
    adjustedBase *= 0.91;
  } else if (processPhase === "upstream") {
    adjustedBase *= 0.95;
  }

  return Math.round(adjustedBase * techMultiplier * compression);
}

export function deriveStaffCost(
  steps: ProcessStep[],
  flexible: boolean,
  stakeholders: Record<StakeholderRole, { count: number; dailyRate: number }>,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect"
): number {
  const activeSteps = flexible ? steps.filter((s) => s.flexibleDays !== null) : steps;

  return activeSteps.reduce((total, step) => {
    const stepCost = (Object.entries(step.participation) as [StakeholderRole, number][]).reduce(
      (stepTotal, [role, hours]) => {
        const rate = stakeholders[role];
        if (!rate) return stepTotal;

        let effectiveHours = hours;

        // === Deepened contextual adjustments (Direct/Indirect + Upstream/Downstream) ===
        // Academic justification (for paper):
        // These multipliers are a modeling assumption: their direction is triangulated from
        // Kraljic/CIPS/APQC (in Upstream + Direct contexts, C-level and legal spend dramatically
        // more time due to risk, governance, and strategic importance; in Downstream + Indirect
        // the work is much more transactional and buyer-driven), but the magnitudes are internal
        // and are to be validated by a time-allocation survey.

        // Upstream = strategic work: heavy involvement of seniors, legal, risk management
        if (processPhase === "upstream") {
          if (role === "executive") effectiveHours *= 1.85;   // board-level decisions
          if (role === "manager") effectiveHours *= 1.65;
          if (role === "lawyer") effectiveHours *= 1.55;
          if (role === "finance") effectiveHours *= 1.4;
          if (role === "buyer") effectiveHours *= 0.75; // buyer role is less dominant in pure strategic work
        }

        // Downstream = operational execution: more hands-on buyer and requestor work
        if (processPhase === "downstream") {
          if (role === "buyer") effectiveHours *= 1.5;
          if (role === "requestor") effectiveHours *= 1.35;
          if (role === "manager") effectiveHours *= 0.65;
          if (role === "executive") effectiveHours *= 0.5;
        }

        // Direct spend = production-related: requires more senior oversight, risk, and finance involvement
        if (spendType === "direct") {
          if (role === "executive") effectiveHours *= 1.3;
          if (role === "manager") effectiveHours *= 1.25;
          if (role === "finance") effectiveHours *= 1.35;
          if (role === "lawyer") effectiveHours *= 1.2;
        }

        // Indirect + Upstream still strategic but less board-level attention
        if (spendType === "indirect" && processPhase === "upstream") {
          if (role === "executive") effectiveHours *= 0.75;
        }

        // Strongest operational profile: Indirect + Downstream (least senior involvement).
        // Deepens only the SENIOR reduction — the buyer/requestor shift toward hands-on
        // work is already encoded once in the downstream block above (one channel per
        // mechanism; a second buyer/requestor boost here double-counted it and pushed the
        // staff dimension's total context uplift to ×2.15, past the ×1.5 invariant).
        if (spendType === "indirect" && processPhase === "downstream") {
          if (["executive", "manager"].includes(role)) effectiveHours *= 0.75;
        }

        return stepTotal + (effectiveHours * rate.count * rate.dailyRate) / 8;
      },
      0
    );
    return total + stepCost;
  }, 0);
}
