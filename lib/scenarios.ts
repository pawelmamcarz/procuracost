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
      title: "Ryanair Fleet Procurement (private-sector example)",
      source:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      insight:
        "Prywatny przewoźnik: Ryanair zamawiał masowo Boeing 737 po kryzysach (post-9/11), uzyskując znaczne upusty cenowe dzięki elastyczności negocjacyjnej. To efektywność zakupowa sektora prywatnego — nie dowód dotyczący prawa zamówień publicznych.",
      insightEn:
        "Private-sector case: Ryanair bulk-ordered Boeing 737s after crises (post-9/11), securing substantial price concessions through negotiation flexibility. This is private-sector purchasing efficiency — not evidence about public-procurement law.",
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
      title: "Swiss Casinos ERP — Agile Sourcing (private-sector example)",
      source: "LAP Alliance / World Procurement Awards 2020",
      insight:
        "Prywatna firma: Swiss Casinos wybrało dostawcę ERP / przeprowadziło sourcing (od selekcji dostawców do podpisanej umowy) w ~6 tygodni dzięki agile sourcing, zamiast standardowych miesięcy procedur. Dotyczy fazy sourcingu, nie pełnego wdrożenia systemu — i jest to efektywność sektora prywatnego, nie wniosek o prawie zamówień publicznych.",
      insightEn:
        "Private-sector case: Swiss Casinos sourced / selected its ERP supplier (from supplier selection to signed contract) in ~6 weeks through agile sourcing, instead of the usual months. This covers the sourcing phase, not full system implementation — and reflects private-sector efficiency, not a conclusion about public-procurement law.",
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
      title: "Air France KLM Martinair Cargo — Lean Agile Procurement (private-sector example)",
      source:
        "LAP Alliance / Agile Business Consortium (2021) — Air France KLM Martinair Cargo case study (practitioner example, illustrative)",
      insight:
        "Prywatny przewoźnik: Air France KLM zastosował Lean Agile Procurement dla modernizacji cargo door-to-door w ścisłym oknie czasowym. Przykład praktyczny ilustrujący efektywność sektora prywatnego — nie dowód empiryczny dotyczący prawa zamówień publicznych.",
      insightEn:
        "Private-sector case: Air France KLM applied Lean Agile Procurement for cargo door-to-door modernisation within a tight time window. A practitioner example illustrating private-sector efficiency — not empirical evidence about public-procurement law.",
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
      title: "Zara — Responsive Fast-Fashion Supply Chain (illustrative)",
      source:
        "Ferdows, Lewis & Machuca, HBR (2004) — Rapid-Fire Fulfillment (illustrative example)",
      insight:
        "Ilustracyjny przykład: model Zary opiera się na krótkich cyklach uzupełnień i szybkiej reakcji łańcucha dostaw na trendy. Przykład ilustruje wartość szybkości w zaopatrzeniu sektora prywatnego — nie udokumentowano tu zastąpienia przetargów zakupami opartymi na AI.",
      insightEn:
        "Illustrative example: Zara's model relies on short replenishment cycles and a supply chain that reacts quickly to trends. It illustrates the value of speed in private-sector sourcing — no documented replacement of tenders with AI-driven procurement is claimed here.",
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
      source:
        "Szucs (JEEA 2024); Beuve, Moszoro & Spiller (NBER w.p. 2021, obserwacyjne); Lipsky (1980)",
      insight:
        "Procedura PZP-EU to tunel: jeden zamknięty tor, kupiec jako executor. Polityka zakupowa to pole: granice uprawnień aktywne wszędzie, kupiec jako navigator. Renegocjacje w przetargach publicznych: Beuve, Moszoro & Spiller szacują efekt rzędu +7,7–10,5 pp (zakres z working paper, dane obserwacyjne). Ten sam kontrakt — wyższy koszt utracony po stronie tunelu.",
      insightEn:
        "An EU-threshold public tender is a tunnel: one locked path, buyer as step-executor. A procurement policy is a field: authorisation boundaries active everywhere, buyer as value navigator. On renegotiation in public tenders, Beuve, Moszoro & Spiller estimate an effect of roughly +7.7–10.5pp (a range from a working paper, observational data). Same contract — higher opportunity cost on the tunnel side.",
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
      source: "Coupa — State of Business Spend (2023) (vendor report, practitioner example)",
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
      title: "MRP-driven replenishment — short collection cycles (illustrative)",
      source:
        "Ferdows, Lewis & Machuca, HBR (2004) — Rapid-Fire Fulfillment (illustrative example)",
      insight:
        "Ilustracyjny przykład: w modelu szybkiej mody zlecenia uzupełnień surowców generowane są automatycznie przez system (MRP) na podstawie prognoz popytu, co skraca cykl reakcji. Przykład ilustruje wartość automatyzacji operacyjnej w sektorze prywatnym — nie udokumentowano tu zastąpienia przetargów zakupami opartymi na AI.",
      insightEn:
        "Illustrative example: in a fast-fashion model, raw-material replenishment orders are auto-generated by the system (MRP) from demand forecasts, shortening the reaction cycle. It illustrates the value of operational automation in the private sector — no documented replacement of tenders with AI-driven procurement is claimed here.",
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
      title: "Ryanair CAPEX — Boeing bulk order at crisis prices (private-sector example)",
      source:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      insight:
        "Prywatny przewoźnik: Ryanair stosuje pełny CAPEX governance dla zakupów floty, ale skraca proces dzięki pre-kwalifikacji Boeinga jako jedynego dostawcy. Governance ma wartość; marnotrawstwo tkwi w krokach, które można wyeliminować. To efektywność sektora prywatnego — nie wniosek o prawie zamówień publicznych.",
      insightEn:
        "Private-sector case: Ryanair applies full CAPEX governance for fleet purchases but shortens the process via Boeing pre-qualification as sole supplier. Governance has value; waste lies in steps that can be eliminated. This is private-sector efficiency — not a conclusion about public-procurement law.",
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
