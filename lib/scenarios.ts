import { ProcurementInputs } from "./calculations";

export interface Scenario {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  inputs: ProcurementInputs;
  caseStudy?: {
    title: string;
    source: string;
    insight: string;
    insightEn: string;
  };
}

const DEFAULT_STAKEHOLDERS: ProcurementInputs["stakeholders"] = {
  buyer:     { count: 1, dailyRate: 800 },
  lawyer:    { count: 1, dailyRate: 1200 },
  finance:   { count: 1, dailyRate: 900 },
  manager:   { count: 1, dailyRate: 1500 },
  executive: { count: 1, dailyRate: 2500 },
};

export const SCENARIOS: Scenario[] = [
  {
    id: "fleet",
    name: "Zakup floty pojazdów",
    nameEn: "Vehicle Fleet Procurement",
    description: "50 samochodów służbowych, kontrakt 2-letni",
    descriptionEn: "50 company cars, 2-year contract",
    inputs: {
      contractValue: 5_000_000,
      tcoHorizonYears: 2,
      processType: "pzp_krajowy",
      techLevel: "partial_erp",
      stakeholders: {
        buyer:     { count: 3, dailyRate: 800 },
        lawyer:    { count: 1, dailyRate: 1200 },
        finance:   { count: 1, dailyRate: 900 },
        manager:   { count: 1, dailyRate: 1500 },
        executive: { count: 1, dailyRate: 2500 },
      },
      dailyCostOfInaction: 5_000,
      renegotiationCost: 150_000,
      bypassAuditExposure: 500_000,
    },
    caseStudy: {
      title: "Ryanair Fleet Procurement",
      source: "IJRAR (2019). Ryanair Strategic Positioning and Fleet Management",
      insight:
        "Ryanair zamawia masowo Boeing 737 po kryzysach (post-9/11: 100 samolotów), osiągając ceny poniżej rynkowych dzięki elastyczności negocjacyjnej — bez sztywnych procedur przetargowych.",
      insightEn:
        "Ryanair bulk-ordered Boeing 737s during crises (post-9/11: 100 aircraft), achieving below-market prices through negotiation flexibility — without rigid tender procedures.",
    },
  },
  {
    id: "erp",
    name: "Kontrakt IT/ERP",
    nameEn: "IT/ERP Contract",
    description: "Wdrożenie systemu ERP, 6 miesięcy",
    descriptionEn: "ERP system implementation, 6 months",
    inputs: {
      contractValue: 3_000_000,
      tcoHorizonYears: 3,
      processType: "private_formal",
      techLevel: "sourcing_tool",
      stakeholders: {
        buyer:     { count: 2, dailyRate: 1200 },
        lawyer:    { count: 1, dailyRate: 1500 },
        finance:   { count: 1, dailyRate: 1000 },
        manager:   { count: 2, dailyRate: 1800 },
        executive: { count: 1, dailyRate: 3000 },
      },
      dailyCostOfInaction: 15_000,
      renegotiationCost: 300_000,
      bypassAuditExposure: 300_000,
    },
    caseStudy: {
      title: "Swiss Casinos ERP — Agile Procurement",
      source: "Skylight Digital. Agile Procurement Playbook — Case Studies",
      insight:
        "Swiss Casinos wdrożyło system ERP w 4 tygodnie dzięki agile procurement, zamiast standardowych 4–6 miesięcy procedur przetargowych. Oszczędność czasu: ~75%.",
      insightEn:
        "Swiss Casinos implemented an ERP system in 4 weeks through agile procurement, instead of the standard 4–6 months of tender procedures. Time savings: ~75%.",
    },
  },
  {
    id: "logistics",
    name: "Usługi logistyczne",
    nameEn: "Logistics Services",
    description: "Kontrakt ramowy z operatorem logistycznym, 3 lata",
    descriptionEn: "Framework contract with logistics operator, 3 years",
    inputs: {
      contractValue: 8_000_000,
      tcoHorizonYears: 3,
      processType: "pzp_eu",
      techLevel: "partial_erp",
      stakeholders: {
        buyer:     { count: 2, dailyRate: 900 },
        lawyer:    { count: 1, dailyRate: 1300 },
        finance:   { count: 1, dailyRate: 1000 },
        manager:   { count: 1, dailyRate: 1600 },
        executive: { count: 1, dailyRate: 2800 },
      },
      dailyCostOfInaction: 20_000,
      renegotiationCost: 400_000,
      bypassAuditExposure: 800_000,
    },
    caseStudy: {
      title: "Air France KLM Martinair Cargo — Lean Agile Procurement",
      source: "EY Switzerland. Integrating Agile Practices into Procurement",
      insight:
        "Air France KLM zastosowało Lean Agile Procurement dla modernizacji cargo door-to-door w ścisłym oknie 6 miesięcy — niemożliwym do dotrzymania przy standardowych przetargach.",
      insightEn:
        "Air France KLM applied Lean Agile Procurement for cargo door-to-door modernisation within a strict 6-month window — impossible to meet with standard tender procedures.",
    },
  },
  {
    id: "production",
    name: "Materiały produkcyjne",
    nameEn: "Production Materials",
    description: "Kategoria A — kluczowe surowce, kontrakt 12 miesięcy",
    descriptionEn: "Category A — critical raw materials, 12-month contract",
    inputs: {
      contractValue: 12_000_000,
      tcoHorizonYears: 1,
      processType: "pzp_eu",
      techLevel: "manual",
      stakeholders: {
        buyer:     { count: 2, dailyRate: 700 },
        lawyer:    { count: 1, dailyRate: 1200 },
        finance:   { count: 1, dailyRate: 800 },
        manager:   { count: 1, dailyRate: 1400 },
        executive: { count: 1, dailyRate: 2500 },
      },
      dailyCostOfInaction: 50_000,
      renegotiationCost: 500_000,
      bypassAuditExposure: 1_200_000,
    },
    caseStudy: {
      title: "Zara — Digital & Agile Procurement",
      source: "Tradogram. Agile Procurement Practices (2024)",
      insight:
        "Zara wdrożyła AI-driven procurement dla szybkiej reakcji na trendy. Tradycyjne procedury przetargowe były zbyt wolne dla 2-tygodniowego cyklu kolekcji.",
      insightEn:
        "Zara implemented AI-driven procurement for rapid trend response. Traditional tender procedures were too slow for their 2-week collection cycle.",
    },
  },
  {
    id: "custom",
    name: "Własny scenariusz",
    nameEn: "Custom Scenario",
    description: "Wprowadź własne parametry zakupu",
    descriptionEn: "Enter your own procurement parameters",
    inputs: {
      contractValue: 1_000_000,
      tcoHorizonYears: 2,
      processType: "private_formal",
      techLevel: "partial_erp",
      stakeholders: { ...DEFAULT_STAKEHOLDERS },
      dailyCostOfInaction: 10_000,
      renegotiationCost: 100_000,
      bypassAuditExposure: 100_000,
    },
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
