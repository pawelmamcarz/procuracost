// Procurement process step templates and technology level definitions.
//
// Academic basis:
// - Mandatory wait times: PZP (Dz.U. 2019 poz. 2019) + EU Directive 2014/24/UE
// - Stakeholder hours: calibrated / illustrative (role-hour magnitudes are modeling assumptions)
// - Step effort and all technology multipliers/costs: illustrative model assumptions

export type ProcessType = "pzp_eu" | "pzp_krajowy" | "private_formal" | "policy_only" | "catalog_order" | "mrp_order" | "capex" | "custom";
export type TechLevelId = "manual" | "sourcing_tool" | "partial_erp" | "end_to_end";
export type StakeholderRole = "buyer" | "lawyer" | "finance" | "manager" | "executive" | "requestor";

export interface ProcessStep {
  id: string;
  name: string;
  nameEn: string;
  // Days in the formal/sequential path
  rigidDays: number;
  // Days in the adaptive/compliant path. null = a non-mandatory step is eliminated.
  // A mandatory wait is always retained at rigidDays, regardless of this field.
  flexibleDays: number | null;
  // Legally mandated minimum waiting period — cannot be shortened
  mandatoryWait: boolean;
  // TOTAL hours the role spends on this step, for the whole role, not per person.
  // Model 2.1 multiplied these by the role headcount, so declaring three buyers made
  // the identical workflow cost three times as much in buyer time. A fixed workload
  // does not grow because more people are available to share it; headcount is captured
  // as descriptive input only. An empty object means the step consumes elapsed calendar
  // time without consuming role effort (e.g. a statutory standstill).
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
  // PLN/day: non-labor administrative overhead excluded from stakeholder role hours
  coordCostPerDay: number;
  // PLN/process: amortised license/subscription cost of the tool
  toolCostPerProcess: number;
  // Multiplier on the assumed bypass rate.
  bypassProbMultiplier: number;
  // Legacy compatibility index; not used as a causal coefficient in model 2.1.
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
    descriptionEn: "Full procurement cycle in one system: sourcing, approvals, PO, invoice and settlement. Configured controls can support either path.",
    examples: "SAP Ariba, Coupa, Oracle Fusion Procurement",
    timeMultiplier: 0.70,
    coordCostPerDay: 20,
    toolCostPerProcess: 2000,
    bypassProbMultiplier: 0.10,
    policyRigidityIndex: 0.05,
  },
};

// ─── Process rigidity by type ───────────────────────────────────────────────────
// Legacy values retained for exports and backward compatibility. Model 2.1 does
// not use this scalar to calculate bypass, TCO, renegotiation or selection costs.

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
// How much favoritism, price dispersion and value loss a DISCRETIONARY award would risk
// in this context (0 = none, 1 = high public-money scrutiny). This is what competitive
// tendering averts — the basis of the governance value credited to formal procedures,
// and the only channel in the model that can favour the formal path.
//
// EVIDENTIAL STATUS (corrected in 2.2): this whole vector is a Grade-C ordinal calibration
// assumption with NO external warrant, on the same footing as PATH_PROFILES. Two claims
// were removed here because neither survived checking:
//
//   1. "the ordinal direction is taken from OECD" — no OECD publication was named anywhere
//      in the corpus. An organisation name attached to no title, year or table cannot be
//      checked, and this vector is live: it scales productivityCost.
//   2. "the pzp_eu = 1.0 anchor is tied to Szucs 2024" — Szucs identifies his effect on
//      Hungarian contracts BELOW a ~25m HUF (~90k USD) invitational threshold, i.e. the
//      small end of the value distribution. Anchoring the maximum risk value to the
//      largest, most heavily publicised EU-threshold procedures inverts his population.
//      Szucs supplies a price and a productivity effect within one threshold band; he
//      supplies no index of favoritism risk by procedure type, and no value of the form 1.0.
//
// Replace with observed favoritism-risk indicators (single-bid rates, price dispersion,
// audit findings) during calibration. Until then it is an assumption, and the sensitivity
// sweep should treat it as one.
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
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 24, lawyer: 16 },
    note: "Opracowanie pełnej dokumentacji przetargowej zgodnej z PZP. Zamawiający konsultuje wymagania techniczne.",
    noteEn: "Preparation of full tender documentation compliant with PZP. Requestor consults on technical requirements.",
  },
  {
    id: "publication",
    name: "Publikacja w TED (Dz.Urz. UE)",
    nameEn: "Publication in TED (OJ EU)",
    rigidDays: 35,
    flexibleDays: 35,
    mandatoryWait: true,
    participation: { buyer: 4 },
    note: "Modelowany standardowy termin składania ofert: 35 dni — art. 138 ust. 1 PZP. Powyżej progów unijnych ogłoszenie trafia do Dz.Urz. UE / TED; BZP jest kanałem dla postępowań krajowych (Dział III). Uwaga: art. 138 ust. 4 pozwala skrócić termin do 30 dni przy pełnej komunikacji elektronicznej, a art. 61 ust. 1 czyni ją ustawowym domyślnym trybem — skrócenie jest więc w praktyce dostępne w większości postępowań. Model zachowuje 35 dni jako wariant konserwatywny; 30 dni jest udokumentowanym przypadkiem wrażliwości.",
    noteEn: "Modeled standard bid-submission period: 35 days — Art. 138(1) PZP. Above the EU thresholds the notice goes to the OJ EU / TED; BZP is the channel for national (Dział III) procedures. Note that Art. 138(4) permits a reduction to 30 days for fully electronic submission and Art. 61(1) makes electronic communication the statutory default, so the reduction is in practice available in most procedures. The model keeps 35 days as the conservative variant; 30 days is a documented sensitivity case.",
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
    name: "Wyjaśnienia treści ofert",
    nameEn: "Bid clarifications",
    rigidDays: 7,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { buyer: 16, lawyer: 8 },
    note: "Wyjaśnienia dotyczące treści ofert; przetarg nieograniczony nie obejmuje negocjowania ofert.",
    noteEn: "Clarifications concerning bid content; an open procedure does not include bid negotiation.",
  },
  {
    id: "award_committee",
    name: "Komisja przetargowa",
    nameEn: "Award committee",
    rigidDays: 3,
    flexibleDays: 1,
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
    flexibleDays: 10,
    mandatoryWait: true,
    participation: {},
    note: "Modelowany standstill: 10 dni przy komunikacji elektronicznej (15 dni w inny sposób) — art. 264 ust. 1 PZP. Wyjątki z ust. 2 wymagają osobnego scenariusza.",
    noteEn: "Modeled standstill: 10 days for electronic communication (15 days otherwise) — Art. 264(1) PZP. Exceptions under paragraph 2 require a separate scenario.",
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
    flexibleDays: 4,
    mandatoryWait: false,
    participation: { requestor: 8, buyer: 16, lawyer: 8 },
    note: "Opracowanie dokumentacji — uproszczone względem progów UE",
    noteEn: "Documentation preparation — simplified vs EU thresholds",
  },
  {
    id: "publication",
    name: "Ogłoszenie BZP",
    nameEn: "Publication in BZP",
    rigidDays: 7,
    flexibleDays: 7,
    mandatoryWait: true,
    participation: { buyer: 3 },
    note: "Minimum dla dostaw/usług: 7 dni — art. 283 PZP. Roboty budowlane wymagają 14 dni i należy je modelować odrębnie.",
    noteEn: "Supplies/services minimum: 7 days — Art. 283 PZP. Construction works require 14 days and must be modeled separately.",
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
    name: "Zatwierdzenie wyboru",
    nameEn: "Award approval",
    rigidDays: 5,
    flexibleDays: 3,
    mandatoryWait: false,
    participation: { buyer: 8, lawyer: 6, executive: 3 },
    note: "Wewnętrzne zatwierdzenie wyboru i wysłanie zawiadomienia",
    noteEn: "Internal award approval and dispatch of the award notice",
  },
  {
    id: "standstill",
    name: "Standstill (art. 308 PZP)",
    nameEn: "Standstill period (Art. 308 PZP)",
    rigidDays: 5,
    flexibleDays: 5,
    mandatoryWait: true,
    participation: {},
    note: "Co najmniej 5 dni przy komunikacji elektronicznej / 10 dni w inny sposób — art. 308 ust. 2 PZP; ustawa przewiduje wyjątki.",
    noteEn: "At least 5 days for electronic communication / 10 days otherwise — Art. 308(2) PZP; statutory exceptions apply.",
  },
  {
    id: "contract_signing",
    name: "Podpisanie umowy",
    nameEn: "Contract signing",
    rigidDays: 2,
    flexibleDays: 2,
    mandatoryWait: false,
    participation: { buyer: 2, lawyer: 2, executive: 1 },
    note: "Końcowa kontrola i podpis po upływie właściwego standstill",
    noteEn: "Final control and signing after the applicable standstill period",
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
    name: "Strategiczne PZP — tryb podstawowy, dostawy/usługi (170k PLN – próg UE)",
    nameEn: "Strategic PZP — basic mode, supplies/services (170k PLN – EU threshold)",
    description: "Tryb podstawowy dla dostaw/usług: minimum 7 dni na oferty i 5 dni standstill przy komunikacji elektronicznej. Roboty budowlane mają dłuższy termin ofertowy.",
    descriptionEn: "Basic mode for supplies/services: at least 7 days for bids and a 5-day standstill with electronic communication. Construction works have a longer bid period.",
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
    name: "Strategiczny zakup — ścieżka adaptacyjna i zgodna",
    nameEn: "Strategic purchase — adaptive and compliant path",
    description: "Adaptacyjna sekwencja działań w tej samej granicy uprawnień, konkurencji, etyki i dokumentacji. Nie oznacza zwolnienia z PZP ani kontroli.",
    descriptionEn: "Adaptive sequencing within the same authorization, competition, ethics and documentation boundary. It is not an exemption from law or control.",
  },
  capex: {
    category: "strategic",
    name: "Strategiczna inwestycja CAPEX (uzasadnione zarządzanie)",
    nameEn: "Strategic CAPEX investment (justified governance)",
    description: "Zakup środków trwałych. Governance może tworzyć wartość; potencjał skrócenia zależy od kroków i danych wejściowych.",
    descriptionEn: "Fixed-asset procurement. Governance may create value; any time reduction depends on the modeled steps and inputs.",
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

// ─── Contextual derivation multipliers ──────────────────────────────────────────
// Direct/Indirect and Upstream/Downstream remain broad context descriptors. They
// adjust total role effort with three small, declared factors instead of inventing
// a detailed role mix. Calendar time is determined only by the process template and
// selected technology. These factors are calibration assumptions, not estimates.
const STAFF_UPSTREAM_MULTIPLIER = 1.15;
const STAFF_DOWNSTREAM_MULTIPLIER = 0.90;
const STAFF_DIRECT_MULTIPLIER = 1.10;

export function getStaffContextMultiplier(
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect",
): number {
  let multiplier = 1;
  if (processPhase === "upstream") multiplier *= STAFF_UPSTREAM_MULTIPLIER;
  if (processPhase === "downstream") multiplier *= STAFF_DOWNSTREAM_MULTIPLIER;
  if (spendType === "direct") multiplier *= STAFF_DIRECT_MULTIPLIER;
  return multiplier;
}

// Fully-loaded daily rates are per 8-hour working day; participation is captured in hours.
const WORK_HOURS_PER_DAY = 8;

export function getSteps(processType: ProcessType, customSteps?: ProcessStep[]): ProcessStep[] {
  if (processType === "custom") return customSteps ?? PROCESS_TEMPLATES.private_formal;
  return PROCESS_TEMPLATES[processType];
}

export interface StepTiming {
  step: ProcessStep;
  rigidDays: number;
  flexibleDays: number | null;
}

export interface ProcessTiming {
  steps: StepTiming[];
  // Elapsed calendar days, unrounded. Model 2.1 rounded here, before the figure was
  // multiplied by the daily cost of inaction — at 50,000 PLN/day a half-day of
  // rounding was worth 25,000 PLN of pure discretisation artifact. Rounding is now a
  // presentation concern only.
  rigidDays: number;
  flexibleDays: number;
  // Days on steps that actually consume role effort. Non-labour coordination overhead
  // accrues only over these: a statutory standstill has nobody working on the file, so
  // it cannot generate "per-day meeting and alignment effort".
  rigidActiveDays: number;
  flexibleActiveDays: number;
}

function stepConsumesEffort(step: ProcessStep): boolean {
  return Object.values(step.participation).some((hours) => nonNegativeFinite(hours) > 0);
}

function nonNegativeFinite(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * Canonical per-step timing trace used by calculations and the UI.
 * Mandatory legal waits are identical in both paths and are never compressed by
 * technology, context, or adaptive sequencing.
 */
export function deriveStepTimings(
  steps: ProcessStep[],
  techMultiplier: number,
  _processPhase?: "upstream" | "downstream",
  _spendType?: "direct" | "indirect",
): ProcessTiming {
  // Retained in the public signature for compatibility with existing callers.
  // Model 2.1 deliberately does not let context alter calendar duration.
  void _processPhase;
  void _spendType;
  const safeTechMultiplier = nonNegativeFinite(techMultiplier);

  const timingSteps = steps.map((step): StepTiming => {
    const rigidBaseDays = nonNegativeFinite(step.rigidDays);
    if (step.mandatoryWait) {
      return { step, rigidDays: rigidBaseDays, flexibleDays: rigidBaseDays };
    }

    const rigidDays = rigidBaseDays * safeTechMultiplier;
    const flexibleBaseDays =
      step.flexibleDays === null ? null : nonNegativeFinite(step.flexibleDays);
    const flexibleDays = flexibleBaseDays === null
      ? null
      : flexibleBaseDays * safeTechMultiplier;

    return { step, rigidDays, flexibleDays };
  });

  const active = timingSteps.filter((item) => stepConsumesEffort(item.step));

  return {
    steps: timingSteps,
    rigidDays: timingSteps.reduce((total, item) => total + item.rigidDays, 0),
    flexibleDays: timingSteps.reduce((total, item) => total + (item.flexibleDays ?? 0), 0),
    rigidActiveDays: active.reduce((total, item) => total + item.rigidDays, 0),
    flexibleActiveDays: active.reduce((total, item) => total + (item.flexibleDays ?? 0), 0),
  };
}

export function deriveActiveDays(
  steps: ProcessStep[],
  techMultiplier: number,
  flexible: boolean,
): number {
  const timing = deriveStepTimings(steps, techMultiplier);
  return flexible ? timing.flexibleActiveDays : timing.rigidActiveDays;
}

export function deriveRigidDays(
  steps: ProcessStep[],
  techMultiplier: number,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect"
): number {
  return deriveStepTimings(steps, techMultiplier, processPhase, spendType).rigidDays;
}

export function deriveFlexibleDays(
  steps: ProcessStep[], 
  techMultiplier: number,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect"
): number {
  return deriveStepTimings(steps, techMultiplier, processPhase, spendType).flexibleDays;
}

export function deriveStaffCost(
  steps: ProcessStep[],
  flexible: boolean,
  stakeholders: Record<StakeholderRole, { count: number; dailyRate: number }>,
  processPhase?: "upstream" | "downstream",
  spendType?: "direct" | "indirect",
  techMultiplier = 1,
): number {
  const staffContextMultiplier = getStaffContextMultiplier(processPhase, spendType);
  const safeTechMultiplier = nonNegativeFinite(techMultiplier);
  const activeSteps = flexible
    ? steps.filter((s) => s.mandatoryWait || s.flexibleDays !== null)
    : steps;

  return activeSteps.reduce((total, step) => {
    const stepCost = (Object.entries(step.participation) as [StakeholderRole, number][]).reduce(
      (stepTotal, [role, hours]) => {
        const rate = stakeholders[role];
        if (!rate) return stepTotal;

        let effectiveHours = nonNegativeFinite(hours);

        // Participation hours describe the rigid version of a step. Scale the
        // adaptive path's retained-step effort by its own duration ratio. Without
        // this, elapsed time fell while labour stayed identical in most scenarios.
        if (flexible && !step.mandatoryWait && step.flexibleDays !== null && step.rigidDays > 0) {
          effectiveHours *= Math.min(1, Math.max(0, step.flexibleDays / step.rigidDays));
        }

        // Technology scales effort on non-mandatory steps the same way it scales their
        // duration. Model 2.1 applied the multiplier to elapsed days only, so moving to
        // an end-to-end suite cut delay and overhead but left role hours untouched —
        // inconsistent with scaling adaptive effort by a duration ratio two lines above,
        // and with H5 ("technology changes execution costs when it is used"). A statutory
        // wait is exempt: no system shortens it and none removes the effort around it.
        if (!step.mandatoryWait) {
          effectiveHours *= safeTechMultiplier;
        }

        effectiveHours *= staffContextMultiplier;

        // rate.count is descriptive. See ProcessStep.participation: the hours are a
        // whole-role total, so spreading them over more people does not create more work.
        const dailyRate = nonNegativeFinite(rate.dailyRate);
        return stepTotal + (effectiveHours * dailyRate) / WORK_HOURS_PER_DAY;
      },
      0
    );
    return total + stepCost;
  }, 0);
}
