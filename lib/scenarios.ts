import { ProcurementInputs } from "./calculations";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  inputs: ProcurementInputs;
  caseStudy?: {
    title: string;
    source: string;
    insight: string;
  };
}

export const SCENARIOS: Scenario[] = [
  {
    id: "fleet",
    name: "Zakup floty pojazdów",
    description: "50 samochodów służbowych, kontrakt 2-letni",
    inputs: {
      contractValue: 5_000_000,
      procurementDays: { rigid: 180, flexible: 45 },
      buyerCount: 3,
      dailyBuyerRate: 800,
      adminCostFixed: { rigid: 80_000, flexible: 20_000 },
      dailyProjectRevenue: 5_000,
      renegotiationCost: 150_000,
      tcoHorizonYears: 2,
      flexibilityIndex: 0.7,
      bypassAuditExposure: 500_000,
    },
    caseStudy: {
      title: "Ryanair Fleet Procurement",
      source: "IJRAR (2019). Ryanair Strategic Positioning and Fleet Management",
      insight:
        "Ryanair zamawia masowo Boeing 737 po kryzysach (post-9/11: 100 samolotów), osiągając ceny poniżej rynkowych dzięki elastyczności negocjacyjnej — bez sztywnych procedur przetargowych.",
    },
  },
  {
    id: "erp",
    name: "Kontrakt IT/ERP",
    description: "Wdrożenie systemu ERP, 6 miesięcy",
    inputs: {
      contractValue: 3_000_000,
      procurementDays: { rigid: 120, flexible: 28 },
      buyerCount: 4,
      dailyBuyerRate: 1_200,
      adminCostFixed: { rigid: 60_000, flexible: 15_000 },
      dailyProjectRevenue: 15_000,
      renegotiationCost: 300_000,
      tcoHorizonYears: 3,
      flexibilityIndex: 0.8,
      bypassAuditExposure: 300_000,
    },
    caseStudy: {
      title: "Swiss Casinos ERP — Agile Procurement",
      source: "Skylight Digital. Agile Procurement Playbook — Case Studies",
      insight:
        "Swiss Casinos wdrożyło system ERP w 4 tygodnie dzięki agile procurement, zamiast standardowych 4–6 miesięcy procedur przetargowych. Oszczędność czasu: ~75%.",
    },
  },
  {
    id: "logistics",
    name: "Usługi logistyczne",
    description: "Kontrakt ramowy z operatorem logistycznym, 3 lata",
    inputs: {
      contractValue: 8_000_000,
      procurementDays: { rigid: 210, flexible: 60 },
      buyerCount: 2,
      dailyBuyerRate: 900,
      adminCostFixed: { rigid: 100_000, flexible: 25_000 },
      dailyProjectRevenue: 20_000,
      renegotiationCost: 400_000,
      tcoHorizonYears: 3,
      flexibilityIndex: 0.75,
      bypassAuditExposure: 800_000,
    },
    caseStudy: {
      title: "Air France KLM Martinair Cargo — Lean Agile Procurement",
      source: "EY Switzerland. Integrating Agile Practices into Procurement",
      insight:
        "Air France KLM zastosowało Lean Agile Procurement dla modernizacji cargo door-to-door w ścisłym oknie 6 miesięcy — niemożliwym do dotrzymania przy standardowych przetargach.",
    },
  },
  {
    id: "production",
    name: "Materiały produkcyjne",
    description: "Kategoria A — kluczowe surowce, kontrakt 12 miesięcy",
    inputs: {
      contractValue: 12_000_000,
      procurementDays: { rigid: 90, flexible: 30 },
      buyerCount: 2,
      dailyBuyerRate: 700,
      adminCostFixed: { rigid: 40_000, flexible: 10_000 },
      dailyProjectRevenue: 50_000,
      renegotiationCost: 500_000,
      tcoHorizonYears: 1,
      flexibilityIndex: 0.65,
      bypassAuditExposure: 1_200_000,
    },
    caseStudy: {
      title: "Zara — Digital & Agile Procurement",
      source: "Tradogram. Agile Procurement Practices (2024)",
      insight:
        "Zara wdrożyła AI-driven procurement dla szybkiej reakcji na trendy. Tradycyjne procedury przetargowe były zbyt wolne dla 2-tygodniowego cyklu kolekcji.",
    },
  },
  {
    id: "custom",
    name: "Własny scenariusz",
    description: "Wprowadź własne parametry zakupu",
    inputs: {
      contractValue: 1_000_000,
      procurementDays: { rigid: 90, flexible: 30 },
      buyerCount: 2,
      dailyBuyerRate: 800,
      adminCostFixed: { rigid: 30_000, flexible: 10_000 },
      dailyProjectRevenue: 10_000,
      renegotiationCost: 100_000,
      tcoHorizonYears: 2,
      flexibilityIndex: 0.7,
      bypassAuditExposure: 100_000,
    },
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
