import { ProcurementInputs } from "./calculations";
import { MODEL_VERSION } from "./version";

export interface Scenario {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  inputs: ProcurementInputs;
  caseStudy?: {
    title: string;
    titleEn: string;
    source: string;
    sourceEn: string;
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
      contractDurationYears: 2,
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
      // 50 aut x ~100 PLN/auto/dzien premii wynajmu krotkoterminowego wobec stawki
      // kontraktowej FSL (kontrakt = 5M/730 = 6 849 PLN/dzien; spot rental biega
      // ~1.5-2x stawki dlugoterminowej). Zalozenie scenariuszowe z jawnym rachunkiem.
      dailyCostOfInaction: 5_000,
      // 3.0% CV za aneks; kotwica rzedu wielkosci: Bajari, Houghton & Tadelis (2014),
      // AER 104(4) - koszty adaptacji 7.5-14% wartosci kontraktu w calym cyklu zycia.
      renegotiationCost: 150_000,
      // ~10% CV; kotwica: decyzja KE C(2019) 3452 - korekty finansowe 5/10/25/100%
      // wartosci kontraktu za naruszenia zamowien.
      bypassAuditExposure: 500_000,
    },
    caseStudy: {
      title: "Zakup floty Ryanair (przykład z sektora prywatnego)",
      titleEn: "Ryanair Fleet Procurement (private-sector example)",
      source:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      sourceEn:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      insight:
        "Raport roczny dokumentuje duże zamówienie Boeingów 737 i ustępstwa cenowe producenta. Nie opisuje jednak porównywalnego procesu zakupowego ani nie identyfikuje skutku elastyczności; liczby scenariusza są niezależnymi założeniami modelu.",
      insightEn:
        "The annual report documents a large Boeing 737 order and manufacturer price concessions. It does not describe a comparable procurement workflow or identify an effect of flexibility; the scenario values are independent model assumptions.",
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
      contractDurationYears: 0.5,
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
      // Odroczona korzysc wdrozenia przy ambitnym 12-mies. paybacku ex ante:
      // 3M / 365 = 8 219 PLN/dzien. Realized payback wg Panorama Consulting to
      // 18-36 mies. (4 100-5 500/dzien); 2.1 uzywal 15 000 = payback 6.6 mies.,
      // ktorego zaden benchmark nie wspiera.
      dailyCostOfInaction: 8_200,
      renegotiationCost: 300_000,
      bypassAuditExposure: 300_000,
    },
    caseStudy: {
      title: "Swiss Casinos ERP: zwinny wybór dostawcy (przykład z sektora prywatnego)",
      titleEn: "Swiss Casinos ERP: Agile Sourcing (private-sector example)",
      source: "Agile Business Consortium: Case Study: Swiss Casinos (practitioner report)",
      sourceEn: "Agile Business Consortium: Case Study: Swiss Casinos (practitioner report)",
      insight:
        "Raport praktyczny Agile Business Consortium podaje, że Swiss Casinos przeprowadziło sourcing ERP w cztery tygodnie. To deklaracja opisana przez organizację promującą metodę, nie niezależne badanie ani czas pełnego wdrożenia.",
      insightEn:
        "An Agile Business Consortium practitioner report states that Swiss Casinos sourced its ERP in four weeks. This is a claim reported by an organisation promoting the method, not an independent study or the full implementation time.",
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
      contractDurationYears: 3,
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
      // Bez umowy ramowej fracht jedzie po stawkach spot: premia spot vs kontrakt
      // 25-35% (DAT Freight & Analytics). 25% x (8M / 1095 dni) = ~1 825 PLN/dzien.
      // 2.1 uzywal 20 000 = premia ~270%, niespotykana w zadnym cytowalnym zrodle.
      dailyCostOfInaction: 1_800,
      renegotiationCost: 400_000,
      bypassAuditExposure: 800_000,
    },
    caseStudy: {
      title: "Air France KLM Martinair Cargo: zakupy Lean Agile (przykład z sektora prywatnego)",
      titleEn: "Air France KLM Martinair Cargo: Lean Agile Procurement (private-sector example)",
      source:
        "LAP Alliance / Agile Business Consortium (2021): Air France KLM Martinair Cargo case study (practitioner example, illustrative)",
      sourceEn:
        "LAP Alliance / Agile Business Consortium (2021): Air France KLM Martinair Cargo case study (practitioner example, illustrative)",
      insight:
        "Prywatny przewoźnik: Air France KLM zastosował Lean Agile Procurement dla modernizacji cargo door-to-door w ścisłym oknie czasowym. Przykład praktyczny ilustrujący efektywność sektora prywatnego, nie dowód empiryczny dotyczący prawa zamówień publicznych.",
      insightEn:
        "Private-sector case: Air France KLM applied Lean Agile Procurement for cargo door-to-door modernisation within a tight time window. A practitioner example illustrating private-sector efficiency, not empirical evidence about public-procurement law.",
    },
  },
  {
    id: "production",
    name: "Materiały produkcyjne",
    nameEn: "Production Materials",
    description: "Kategoria A: kluczowe surowce, kontrakt 12 miesięcy",
    descriptionEn: "Category A: critical raw materials, 12-month contract",
    inputs: {
      contractValue: 12_000_000,
      tcoHorizonYears: 1,
      contractDurationYears: 1,
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
      // Mechanizm: JEDYNY kwalifikowany dostawca surowcow klasy A - brak kontraktu
      // grozi zatrzymaniem produkcji, nie zakupem spot. Utracona marza brutto
      // ~50k/dzien odpowiada zakladowi o przychodzie ~40M PLN/rok i marzy ~45%.
      // To zalozenie o ekonomice zakladu, nie premia cenowa; przy dostepnym rynku
      // spot wlasciwa rama to 10-20% premii x 48k/dzien = 5-10k/dzien.
      dailyCostOfInaction: 50_000,
      renegotiationCost: 500_000,
      bypassAuditExposure: 1_200_000,
    },
    caseStudy: {
      title: "Zara: responsywny łańcuch dostaw szybkiej mody (przykład ilustracyjny)",
      titleEn: "Zara: Responsive Fast-Fashion Supply Chain (illustrative)",
      source:
        "Ferdows, Lewis & Machuca, HBR (2004): Rapid-Fire Fulfillment (illustrative example)",
      sourceEn:
        "Ferdows, Lewis & Machuca, HBR (2004): Rapid-Fire Fulfillment (illustrative example)",
      insight:
        "Ferdows, Lewis i Machuca opisują responsywną sieć dostaw Zary. To materiał o operacjach i łańcuchu dostaw, nie dowód na konkretną metodę zakupową ani zastąpienie przetargów przez AI.",
      insightEn:
        "Ferdows, Lewis and Machuca describe Zara's responsive supply network. This is an operations and supply-chain case, not evidence for a procurement method or for replacing tenders with AI.",
    },
  },
  {
    id: "pipe_vs_field",
    name: "Tunel vs Pole",
    nameEn: "Tunnel vs Field",
    description: "Ten sam kontrakt publiczny: sekwencyjny i adaptacyjny wariant zgodny z PZP.",
    descriptionEn: "Same public contract: sequential and adaptive designs, both compliant with PZP.",
    inputs: {
      contractValue: 5_000_000,
      tcoHorizonYears: 3,
      contractDurationYears: 3,
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
      // Projekt publiczny: odroczona korzysc spoleczna przy BCR ~2.2 (10k x 365 /
      // zannualizowany koszt 1.67M/rok), wewnatrz typowego pasma BCR 1-4 z ocen
      // projektow inwestycyjnych (EC Guide to CBA 2014).
      dailyCostOfInaction: 10_000,
      renegotiationCost: 200_000,
      bypassAuditExposure: 600_000,
    },
    caseStudy: {
      title: "Tunel vs Pole: ten sam zakup, dwa światy",
      titleEn: "Tunnel vs Field: the same purchase, two designs",
      source:
        `Konstrukcja modelu ${MODEL_VERSION}: scenariusz ilustracyjny bez źródła zewnętrznego. Wartości wejściowe są założeniami, a nie danymi z żadnego badania.`,
      sourceEn:
        `ProcuraCost ${MODEL_VERSION} model construction: an illustrative scenario without an external source. Input values are assumptions, not observations from a study.`,
      insight:
        "Porównanie dwóch legalnych projektów tego samego postępowania: bardziej sekwencyjnego i bardziej adaptacyjnego. Wynik zależy od kosztu zwłoki, konkurencji i konstrukcji kontraktu; nie zakłada obejścia PZP.",
      insightEn:
        "Two lawful designs for the same procedure: more sequential and more adaptive. The result depends on delay cost, competition, and contract design; it does not assume an exemption from PZP.",
    },
  },
  {
    id: "catalog",
    name: "Zamówienie z katalogu",
    nameEn: "Catalog Order",
    description: "Materiały biurowe / MRO z katalogu dostawcy: system egzekwuje cenę",
    descriptionEn: "Office supplies / MRO from supplier catalog: system enforces price",
    inputs: {
      contractValue: 50_000,
      tcoHorizonYears: 1,
      contractDurationYears: 1,
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
      // Tarcie transakcyjne, nie premia cenowa: koszt recznej obslugi zamowien
      // poza katalogiem (Levvel/PayStream: reczna faktura $10-15 vs $2-3
      // automatyczna) plus drobna premia detaliczna. Delta dni = 0, wiec wartosc
      // nie wplywa na roznice miedzy sciezkami.
      dailyCostOfInaction: 500,
      renegotiationCost: 0,
      bypassAuditExposure: 10_000,
    },
  },
  {
    id: "mrp",
    name: "Zlecenie MRP",
    nameEn: "MRP Order",
    description: "Surowce produkcyjne: zlecenia generowane automatycznie przez ERP",
    descriptionEn: "Production raw materials: orders auto-generated by ERP",
    inputs: {
      contractValue: 500_000,
      tcoHorizonYears: 1,
      contractDurationYears: 1,
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
      // Mechanizm stockoutu: brak POJEDYNCZEGO zlecenia na surowiec moze zatrzymac
      // linie w ciagu dni - rama zatrzymania (utracona marza), nie premii spot.
      // Jako premia spot byloby to 5.8x rocznego wydatku, czyli nonsens; jako
      // koszt postoju liniowego jest w zakresie ekonomiki malego zakladu.
      // Delta dni = 0, wiec wartosc nie wplywa na roznice miedzy sciezkami.
      dailyCostOfInaction: 8_000,
      renegotiationCost: 20_000,
      bypassAuditExposure: 50_000,
    },
  },
  {
    id: "capex_investment",
    name: "Inwestycja CAPEX",
    nameEn: "CAPEX Investment",
    description: "Linia produkcyjna: procedura CAPEX jest tu uzasadniona",
    descriptionEn: "Production line: CAPEX governance is justified here",
    inputs: {
      contractValue: 15_000_000,
      tcoHorizonYears: 10,
      contractDurationYears: 10,
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
      // Odroczony cash flow linii przy kryterium 3-letniego paybacku (typowe dla
      // urzadzen produkcyjnych): 15M / 3 / 365 = 13 699 PLN/dzien. Annuitet przy
      // hurdle rate 15-25% (Jagannathan i in., JFE 2016) daje 8.2-11.5k/dzien.
      // 2.1 uzywal 30 000 = payback 1.4 roku, 2.2-3.7x ponad pasmo obronialne.
      dailyCostOfInaction: 13_700,
      renegotiationCost: 800_000,
      bypassAuditExposure: 2_000_000,
    },
    caseStudy: {
      title: "Ryanair CAPEX: duże zamówienie Boeingów po cenach kryzysowych (przykład z sektora prywatnego)",
      titleEn: "Ryanair CAPEX: Boeing bulk order at crisis prices (private-sector example)",
      source:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      sourceEn:
        "Ryanair 2002/2003 Annual Report / SEC Form 20-F (Boeing price concessions)",
      insight:
        "Raport dokumentuje duże zamówienie Boeingów i ustępstwa cenowe, ale nie opisuje wewnętrznych bramek CAPEX, prekwalifikacji ani czasu procesu. Scenariusz ilustruje rachunek kosztów i nie jest rekonstrukcją postępowania Ryanaira.",
      insightEn:
        "The report documents a large Boeing order and price concessions, but not Ryanair's internal CAPEX gates, pre-qualification, or procurement-cycle time. This scenario illustrates the cost calculation and is not a reconstruction of Ryanair's process.",
    },
  },
  {
    id: "governance_control",
    name: "Stabilny zakup: scenariusz kontrolny",
    nameEn: "Stable purchase: control scenario",
    description: "Dojrzały rynek, niski koszt zwłoki i zachowana przewaga konkurencji formalnej",
    descriptionEn: "Mature market, negligible delay cost, and a retained formal-competition advantage",
    inputs: {
      contractValue: 5_000_000,
      tcoHorizonYears: 0,
      contractDurationYears: 1,
      processType: "policy_only",
      techLevel: "end_to_end",
      stakeholders: { ...DEFAULT_STAKEHOLDERS },
      dailyCostOfInaction: 0,
      renegotiationCost: 25_000,
      bypassAuditExposure: 500_000,
      spendType: "indirect",
      processPhase: "downstream",
    },
    caseStudy: {
      title: "Scenariusz kontrolny: formalność może wygrać",
      titleEn: "Control scenario: formality can win",
      source: `Założenia scenariuszowe ProcuraCost ${MODEL_VERSION}: nie obserwacja empiryczna`,
      sourceEn: `ProcuraCost ${MODEL_VERSION} scenario assumptions: not an empirical observation`,
      insight:
        "Gdy koszt zwłoki jest pomijalny, rynek stabilny, a bardziej formalna ścieżka zachowuje przewagę konkurencyjną, centralny wynik może sprzyjać formalności. Szeroki stres-test nadal może zmienić znak.",
      insightEn:
        "When delay cost is negligible, the market is stable, and the formal path retains a competition advantage, the central result can favor formality. The broad stress test may still reverse the sign.",
    },
  },
  {
    id: "discovery_rd",
    name: "Zakup odkrywczy: wymaganie nieznane",
    nameEn: "Discovery purchase: requirement unknown",
    description: "Rozwiązanie projektowane wspólnie z dostawcami; adaptacja kupuje uczenie się kosztem czasu",
    descriptionEn: "Solution co-designed with suppliers; adaptation buys learning at the cost of time",
    inputs: {
      contractValue: 3_000_000,
      tcoHorizonYears: 3,
      contractDurationYears: 3,
      processType: "discovery",
      techLevel: "partial_erp",
      stakeholders: {
        requestor: { count: 1, dailyRate: 900 },
        buyer:     { count: 1, dailyRate: 900 },
        lawyer:    { count: 1, dailyRate: 1300 },
        finance:   { count: 1, dailyRate: 1000 },
        manager:   { count: 1, dailyRate: 1600 },
        executive: { count: 1, dailyRate: 2800 },
      },
      // Odroczona korzysc rozwiazania przy 18-mies. paybacku - konserwatywniejszym
      // niz ERP, bo korzysci zakupu odkrywczego sa z natury mniej pewne:
      // 3M / (1.5 x 365) = 5 479 PLN/dzien (pasmo Panorama 18-36 mies.).
      dailyCostOfInaction: 5_500,
      renegotiationCost: 200_000,
      bypassAuditExposure: 300_000,
    },
    caseStudy: {
      title: "Scenariusz kontrolny II: adaptacja bywa droższa",
      titleEn: "Control scenario II: adaptation can cost more",
      source:
        `Konstrukcja modelu ${MODEL_VERSION}: scenariusz ilustracyjny bez źródła zewnętrznego. Wartości wejściowe są założeniami, a nie danymi z badania.`,
      sourceEn:
        `ProcuraCost ${MODEL_VERSION} model construction: an illustrative scenario without an external source. Input values are assumptions, not observations from a study.`,
      insight:
        "Kiedy wymaganie powstaje w trakcie, ścieżka adaptacyjna kupuje uczenie się czasem: współprojektowanie i runda przeprojektowania wydłużają kalendarz i zwiększają pracę. Formalna zamraża wymaganie wcześnie i wychodzi szybciej, płacąc gorszym dopasowaniem i słabszym wychwyceniem wartości cyklu życia. Ten scenariusz istnieje po to, żeby teza modelu dała się obalić, a nie tylko potwierdzić.",
      insightEn:
        "When the requirement emerges in flight, the adaptive path buys learning with time: co-design and a re-scoping round lengthen the calendar and raise effort. The formal path freezes the requirement early and finishes sooner, paying with a worse fit and weaker lifecycle capture. This scenario exists so the model's thesis can be refuted, not only confirmed.",
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
      contractDurationYears: 2,
      processType: "private_formal",
      techLevel: "partial_erp",
      stakeholders: { ...DEFAULT_STAKEHOLDERS },
      // PLACEHOLDER bez uzasadnienia ekonomicznego - uzytkownik MUSI podac wlasna
      // wartosc. Seed = 0.05% CV/dzien (500 dla 1M), spojne z premia spot/odroczonymi
      // oszczednosciami 10-35% na zannualizowanym wydatku. Domyslne 10 000 z modelu
      // 2.1 zasiewalo delte 200k PLN (95% wyniku) implikujac BCR 7.3 na kontrakcie 1M.
      dailyCostOfInaction: 500,
      renegotiationCost: 100_000,
      bypassAuditExposure: 100_000,
    },
  },
];
