// Procurement process step templates and technology level definitions.
//
// Academic basis:
// - Mandatory wait times: PZP (Dz.U. 2019 poz. 2019) + EU Directive 2014/24/UE
// - Stakeholder hours: benchmarked from OECD (2023) procurement function surveys
// - Tech level impacts: derived from EY / Deloitte sourcing transformation studies

export type ProcessType = "pzp_eu" | "pzp_krajowy" | "private_formal" | "policy_only" | "custom";
export type TechLevelId = "manual" | "sourcing_tool" | "partial_erp" | "end_to_end";
export type StakeholderRole = "buyer" | "lawyer" | "finance" | "manager" | "executive";

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
    descriptionEn: "Full procurement cycle in one system: sourcing, approvals, PO, invoice, automatic settlement. Compliance enforced by the system — the Field model.",
    examples: "SAP Ariba, Coupa, Oracle Fusion Procurement",
    timeMultiplier: 0.70,
    coordCostPerDay: 20,
    toolCostPerProcess: 2000,
    bypassProbMultiplier: 0.10,
    policyRigidityIndex: 0.05,
  },
};

// ─── Process rigidity by type ───────────────────────────────────────────────────
// Used for bypass probability and TCO calculations

export const PROCESS_RIGIDITY: Record<ProcessType, number> = {
  pzp_eu: 0.95,
  pzp_krajowy: 0.80,
  private_formal: 0.60,
  policy_only: 0.15,
  custom: 0.50, // placeholder; overridden by user
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
    participation: { buyer: 16, finance: 8, manager: 4 },
    note: "Określenie wymagań, zatwierdzenie budżetu, wstępna specyfikacja",
    noteEn: "Requirements definition, budget approval, preliminary specification",
  },
  {
    id: "siwz_prep",
    name: "Opracowanie SIWZ/SWZ",
    nameEn: "Specification of terms (SIWZ/SWZ) preparation",
    rigidDays: 10,
    flexibleDays: null,
    mandatoryWait: false,
    participation: { buyer: 24, lawyer: 16 },
    note: "Opracowanie pełnej dokumentacji przetargowej zgodnej z PZP",
    noteEn: "Preparation of full tender documentation compliant with PZP",
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
    participation: { buyer: 24, lawyer: 8, finance: 8 },
    note: "Formalna weryfikacja i ocena punktowa wszystkich złożonych ofert",
    noteEn: "Formal verification and scoring of all submitted bids",
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
    rigidDays: 11,
    flexibleDays: null,
    mandatoryWait: true,
    participation: {},
    note: "Obowiązkowy okres zawieszenia przed podpisaniem umowy — min. 11 dni (przepisy EU)",
    noteEn: "Mandatory suspension before signing — min. 11 days (EU regulations)",
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
    participation: { buyer: 12, finance: 6, manager: 3 },
    note: "Określenie wymagań i zatwierdzenie budżetu",
    noteEn: "Requirements definition and budget approval",
  },
  {
    id: "spec_prep",
    name: "Przygotowanie specyfikacji",
    nameEn: "Specification preparation",
    rigidDays: 7,
    flexibleDays: null,
    mandatoryWait: false,
    participation: { buyer: 16, lawyer: 8 },
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
    note: "Obowiązkowy termin składania ofert — min. 21 dni (tryby krajowe PZP)",
    noteEn: "Mandatory offer submission period — min. 21 days (national PZP procedures)",
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
    participation: { buyer: 16, finance: 4 },
    note: "Rozpoznanie rynku, zebranie informacji od potencjalnych dostawców",
    noteEn: "Market reconnaissance, gathering information from potential suppliers",
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
    participation: { buyer: 12, manager: 2 },
    note: "Szybkie rozpoznanie rynku, 2–3 dostawców",
    noteEn: "Quick market sounding, 2–3 suppliers",
  },
  {
    id: "evaluation",
    name: "Ocena i wybór",
    nameEn: "Evaluation and selection",
    rigidDays: 7,
    flexibleDays: 7,
    mandatoryWait: false,
    participation: { buyer: 16, finance: 4 },
    note: "Ocena ofert według polityki zakupowej",
    noteEn: "Offer evaluation according to procurement policy",
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

export const PROCESS_TEMPLATES: Record<Exclude<ProcessType, "custom">, ProcessStep[]> = {
  pzp_eu: PZP_EU_STEPS,
  pzp_krajowy: PZP_KRAJOWY_STEPS,
  private_formal: PRIVATE_FORMAL_STEPS,
  policy_only: POLICY_ONLY_STEPS,
};

export const PROCESS_TYPE_META: Record<Exclude<ProcessType, "custom">, { name: string; nameEn: string; description: string; descriptionEn: string }> = {
  pzp_eu: {
    name: "Przetarg nieograniczony PZP (powyżej progów UE)",
    nameEn: "Open Tender PZP (above EU thresholds)",
    description: "Pełne postępowanie przetargowe z mandatory waiting periods. Dotyczy zamówień powyżej 5 382 000 PLN (usługi/dostawy) lub 139 117 000 PLN (roboty budowlane).",
    descriptionEn: "Full tender procedure with mandatory waiting periods. Applies to contracts above EU thresholds.",
  },
  pzp_krajowy: {
    name: "Postępowanie krajowe PZP (130k – 5,38M PLN)",
    nameEn: "National PZP procedure (130k – 5.38M PLN)",
    description: "Uproszczone postępowanie krajowe. Shorter mandatory waiting periods than EU threshold.",
    descriptionEn: "Simplified national procedure. Shorter mandatory waiting periods than EU threshold.",
  },
  private_formal: {
    name: "Formalny przetarg prywatny (RFQ/RFP)",
    nameEn: "Formal private tender (RFQ/RFP)",
    description: "Sektor prywatny — wewnętrzny komitet, formalny RFQ/RFP, przegląd prawny. Bez mandatory waits PZP, ale z korporacyjnymi procedurami approval.",
    descriptionEn: "Private sector — internal committee, formal RFQ/RFP, legal review. No mandatory PZP waits, but with corporate approval procedures.",
  },
  policy_only: {
    name: "Polityka zakupowa (ścieżka elastyczna)",
    nameEn: "Procurement policy (flexible path)",
    description: "Zakup prowadzony wyłącznie w ramach polityki zakupowej — bez mandatory procedur. Czas i metoda wybierane przez kupca zgodnie z matrycą uprawnień.",
    descriptionEn: "Purchase conducted solely within the procurement policy framework — no mandatory procedures. Time and method chosen by the buyer per authorization matrix.",
  },
};

// ─── Helper functions ───────────────────────────────────────────────────────────

export function getSteps(processType: ProcessType, customSteps?: ProcessStep[]): ProcessStep[] {
  if (processType === "custom") return customSteps ?? PROCESS_TEMPLATES.private_formal;
  return PROCESS_TEMPLATES[processType];
}

export function deriveRigidDays(steps: ProcessStep[], techMultiplier: number): number {
  return Math.round(steps.reduce((sum, s) => sum + s.rigidDays, 0) * techMultiplier);
}

export function deriveFlexibleDays(steps: ProcessStep[], techMultiplier: number): number {
  const base = steps
    .filter((s) => s.flexibleDays !== null)
    .reduce((sum, s) => sum + (s.flexibleDays ?? 0), 0);
  return Math.round(base * techMultiplier * 0.85);
}

export function deriveStaffCost(
  steps: ProcessStep[],
  flexible: boolean,
  stakeholders: Record<StakeholderRole, { count: number; dailyRate: number }>
): number {
  const activeSteps = flexible ? steps.filter((s) => s.flexibleDays !== null) : steps;
  return activeSteps.reduce((total, step) => {
    const stepCost = (Object.entries(step.participation) as [StakeholderRole, number][]).reduce(
      (stepTotal, [role, hours]) => {
        const rate = stakeholders[role];
        if (!rate) return stepTotal;
        return stepTotal + (hours * rate.count * rate.dailyRate) / 8;
      },
      0
    );
    return total + stepCost;
  }, 0);
}
