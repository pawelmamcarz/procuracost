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
  requestor: { count: 1, dailyRate: 900 },
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
      spendType: "direct",
      processPhase: "upstream",
      processType: "private_formal",
      techLevel: "partial_erp",
      stakeholders: {
        requestor: { count: 1, dailyRate: 900 },
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
      title: "Strategiczny zakup floty",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczny zakup floty testuje wpływ wysokiej wartości, długiego horyzontu TCO, timingu i zaangażowania kadry zarządzającej.",
      insightEn:
        "This synthetic fleet acquisition tests high value, a long TCO horizon, timing, and senior-management involvement.",
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
      spendType: "indirect",
      processPhase: "upstream",
      processType: "private_formal",
      techLevel: "sourcing_tool",
      stakeholders: {
        requestor: { count: 2, dailyRate: 1200 },
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
      title: "Strategiczny zakup systemu ERP",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczny zakup ERP testuje wpływ kosztu opóźnienia wdrożenia, horyzontu TCO i obciążenia ról w fazie Upstream.",
      insightEn:
        "This synthetic ERP acquisition tests implementation delay, TCO horizon, and Upstream role-loading assumptions.",
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
      spendType: "indirect",
      processPhase: "upstream",
      processType: "private_formal",
      techLevel: "partial_erp",
      stakeholders: {
        requestor: { count: 1, dailyRate: 900 },
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
      title: "Strategiczny kontrakt logistyczny",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczny kontrakt logistyczny testuje koszt okna operacyjnego oraz przyjęte mnożniki opóźnienia i obejścia procesu.",
      insightEn:
        "This synthetic logistics contract tests an operational window plus the assumed delay and bypass multipliers.",
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
      spendType: "direct",
      processPhase: "upstream",
      processType: "private_formal",
      techLevel: "manual",
      stakeholders: {
        requestor: { count: 2, dailyRate: 800 },
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
      title: "Zakup krytycznych materiałów produkcyjnych",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczny scenariusz produkcyjny łączy wysoką wartość, koszt przestoju i mnożniki Direct+Upstream; skrajny wynik wymaga testów wrażliwości.",
      insightEn:
        "This synthetic production scenario combines high value, inaction cost, and Direct+Upstream multipliers; its extreme output requires sensitivity testing.",
    },
  },
  {
    id: "pipe_vs_field",
    name: "Tunel vs Pole",
    nameEn: "Tunnel vs Field",
    description: "Ten sam kontrakt: pełny przetarg PZP-EU (tunel) vs elastyczna polityka zakupowa (pole). Maksymalny kontrast.",
    descriptionEn: "Same contract: full EU-threshold public tender (tunnel) vs flexible procurement policy (field). Maximum contrast.",
    inputs: {
      contractValue: 5_000_000,
      tcoHorizonYears: 3,
      spendType: "direct",
      processPhase: "upstream",
      processType: "pzp_eu",
      techLevel: "partial_erp",
      stakeholders: {
        requestor: { count: 1, dailyRate: 900 },
        buyer:     { count: 2, dailyRate: 900 },
        lawyer:    { count: 1, dailyRate: 1300 },
        finance:   { count: 1, dailyRate: 900 },
        manager:   { count: 1, dailyRate: 1500 },
        executive: { count: 1, dailyRate: 2500 },
      },
      dailyCostOfInaction: 10_000,
      renegotiationCost: 200_000,
      bypassAuditExposure: 600_000,
    },
    caseStudy: {
      title: "Tunel vs Pole — ten sam zakup, dwa światy",
      source: "Szucs (JEEA 2024); Beuve et al. (NBER 2021); Lipsky (1980)",
      insight:
        "Procedura PZP-EU to tunel: jeden zamknięty tor, kupiec jako executor. Polityka zakupowa to pole: granice uprawnień aktywne wszędzie, kupiec jako navigator. Ten sam kontrakt — wielokrotnie wyższy koszt utracony po stronie tunelu.",
      insightEn:
        "An EU-threshold public tender is a tunnel: one locked path, buyer as step-executor. A procurement policy is a field: authorisation boundaries active everywhere, buyer as value navigator. Same contract — drastically higher opportunity cost on the tunnel side.",
    },
  },
  {
    id: "catalog",
    name: "Zamówienie z katalogu",
    nameEn: "Catalog Order",
    description: "Materiały biurowe / MRO z katalogu dostawcy — system egzekwuje cenę",
    descriptionEn: "Office supplies / MRO from supplier catalog — system enforces price",
    inputs: {
      contractValue: 50_000,
      tcoHorizonYears: 1,
      spendType: "indirect",
      processPhase: "downstream",
      processType: "catalog_order",
      techLevel: "end_to_end",
      stakeholders: {
        requestor: { count: 2, dailyRate: 800 },
        buyer:     { count: 1, dailyRate: 800 },
        lawyer:    { count: 0, dailyRate: 1200 },
        finance:   { count: 0, dailyRate: 900 },
        manager:   { count: 1, dailyRate: 1500 },
        executive: { count: 0, dailyRate: 2500 },
      },
      dailyCostOfInaction: 500,
      renegotiationCost: 0,
      bypassAuditExposure: 10_000,
    },
    caseStudy: {
      title: "Coupa Catalog — Amazon-like UX for B2B",
      source: "Coupa. State of Business Spend (2023)",
      insight:
        "Firmy z katalogiem end-to-end redukują maverick spend o 60–80% i skracają czas zamówienia z dni do minut. Kupiec staje się kuratorem katalogu, nie procesorem faktur.",
      insightEn:
        "Companies with end-to-end catalogs reduce maverick spend by 60–80% and cut order time from days to minutes. The buyer becomes a catalog curator, not an invoice processor.",
    },
  },
  {
    id: "mrp",
    name: "Zlecenie MRP",
    nameEn: "MRP Order",
    description: "Surowce produkcyjne — zlecenia generowane automatycznie przez ERP",
    descriptionEn: "Production raw materials — orders auto-generated by ERP",
    inputs: {
      contractValue: 500_000,
      tcoHorizonYears: 1,
      spendType: "direct",
      processPhase: "downstream",
      processType: "mrp_order",
      techLevel: "end_to_end",
      stakeholders: {
        requestor: { count: 1, dailyRate: 800 },
        buyer:     { count: 1, dailyRate: 800 },
        lawyer:    { count: 0, dailyRate: 1200 },
        finance:   { count: 0, dailyRate: 900 },
        manager:   { count: 0, dailyRate: 1500 },
        executive: { count: 0, dailyRate: 2500 },
      },
      dailyCostOfInaction: 8_000,
      renegotiationCost: 20_000,
      bypassAuditExposure: 50_000,
    },
    caseStudy: {
      title: "Automatyczne zlecenie MRP",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczny scenariusz testuje rutynowe zamówienie materiałowe generowane przez system MRP w kontekście Direct+Downstream.",
      insightEn:
        "This synthetic scenario tests a routine material order generated by an MRP system in a Direct+Downstream context.",
    },
  },
  {
    id: "capex_investment",
    name: "Inwestycja CAPEX",
    nameEn: "CAPEX Investment",
    description: "Linia produkcyjna — procedura CAPEX jest tu uzasadniona",
    descriptionEn: "Production line — CAPEX governance is justified here",
    inputs: {
      contractValue: 15_000_000,
      tcoHorizonYears: 10,
      spendType: "direct",
      processPhase: "upstream",
      processType: "capex",
      techLevel: "partial_erp",
      stakeholders: {
        requestor: { count: 2, dailyRate: 1000 },
        buyer:     { count: 2, dailyRate: 900 },
        lawyer:    { count: 1, dailyRate: 1500 },
        finance:   { count: 2, dailyRate: 1000 },
        manager:   { count: 2, dailyRate: 1600 },
        executive: { count: 1, dailyRate: 3000 },
      },
      dailyCostOfInaction: 30_000,
      renegotiationCost: 800_000,
      bypassAuditExposure: 2_000_000,
    },
    caseStudy: {
      title: "Strategiczna inwestycja CAPEX",
      source: "Ilustracyjny scenariusz ProcuraCost; założenia w lib/scenarios.ts",
      insight:
        "Syntetyczna inwestycja w linię produkcyjną testuje długi horyzont, wysoki koszt renegocjacji i rozbudowany nadzór CAPEX.",
      insightEn:
        "This synthetic production-line investment tests a long horizon, high renegotiation cost, and extensive CAPEX governance.",
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
      spendType: "indirect",
      processPhase: "upstream",
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
