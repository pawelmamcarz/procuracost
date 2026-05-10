export type Episode = {
  number: number;
  slug: string;
  title: string;
  dimension: string;
  guest: string;
  thesis: string;
  recommendation: string;
  youtubeId?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  publishedAt?: string;
};

export const EPISODES: Episode[] = [
  {
    number: 1,
    slug: "ile-kosztuje-zgodnosc-z-procedura",
    title: `Ile kosztuje „zrobić to zgodnie z procedurą"?`,
    dimension: "Czas · Admin",
    guest: "CFO firmy produkcyjnej",
    thesis:
      `Proceduralna „zgodność" ma metkę. Przeliczamy godziny pracy na złotówki.`,
    recommendation:
      "Zmapujcie czas swoich kupców przez jeden tydzień, zanim zaczniecie zmieniać regulamin.",
  },
  {
    number: 2,
    slug: "paradoks-szucsa",
    title: "Paradoks Szucsa: 2% taniej w aukcji, 30% drożej w cyklu życia",
    dimension: "C_opp · C_TCO",
    guest: "Ekspert TCO z branży motoryzacyjnej",
    thesis:
      "Sztywny przetarg wygrywa bitwę o cenę zakupu i przegrywa wojnę o całkowity koszt.",
    recommendation:
      "Zmień kryterium wyboru oferty z ceny jednostkowej na koszt całkowity. W jednym pilotażu. Jutro.",
  },
  {
    number: 3,
    slug: "renegocjacja-dlaczego-sztywne-umowy-koncza-sie-w-sadzie",
    title: "Renegocjacja: Dlaczego sztywne umowy kończą się w sądzie?",
    dimension: "C_reneg",
    guest: "Prawnik kontraktowy",
    thesis:
      "Każdy punkt sztywności w umowie zwiększa ryzyko renegocjacji o 7–10 p.p. (Beuve et al. 2021).",
    recommendation:
      "Zastąp dwa najsztywniejsze zapisy w waszym wzorcu umowy klauzulami przeglądowymi.",
  },
  {
    number: 4,
    slug: "flota-jak-ryanair-i-lot-kupuja-bez-przetargu",
    title: "Flota: Jak Ryanair i LOT kupują bez przetargu?",
    dimension: "Archetyp: Flota",
    guest: "Ekspert rynku lotniczego",
    thesis:
      "Największe transakcje flotowe świata nie znoszą procedur. Robi się je zgodnie z polityką, nie z instrukcją.",
    recommendation:
      "Zidentyfikuj jeden zakup strategiczny w roku, gdzie timing znaczy więcej niż format zapytania.",
  },
  {
    number: 5,
    slug: "it-erp-4-tygodnie-zamiast-6-miesiecy",
    title: "IT/ERP: 4 tygodnie zamiast 6 miesięcy",
    dimension: "Archetyp: IT/ERP",
    guest: "Praktyk Lean Agile Procurement",
    thesis:
      "LAP pozwala zamknąć sourcing systemu ERP w 4 tygodnie, trzymając się polityki.",
    recommendation:
      "Następnego dużego dostawcę IT zaproś na warsztaty, zanim wyślesz zapytanie ofertowe.",
  },
  {
    number: 6,
    slug: "produkcja-dlaczego-zara-nie-robi-przetargow",
    title: "Produkcja: Dlaczego Zara nie robi przetargów?",
    dimension: "Archetyp: Produkcja",
    guest: "Menedżer łańcucha dostaw z FMCG",
    thesis:
      "Cykl 2-tygodniowy nie znosi tradycyjnego RFQ. Elastyczność to warunek konkurencyjności.",
    recommendation:
      "Jeśli twój rynek zmienia się szybciej niż proces zakupowy — procedura cię nie chroni, tylko zabija.",
  },
  {
    number: 7,
    slug: "logistyka-sourcing-w-oknie-czasowym",
    title: "Logistyka: Sourcing w oknie czasowym",
    dimension: "Archetyp: Logistyka",
    guest: "Ekspert logistyki kontraktowej",
    thesis:
      "Procedura trwała 12–18 miesięcy, okno biznesowe było 6-miesięczne. LAP zamknął sourcing w oknie.",
    recommendation:
      "Sprawdź, które kontrakty mają twarde okno czasowe — i zaplanuj je od celu, nie od procesu.",
  },
  {
    number: 8,
    slug: "technologia-jako-pole",
    title: "Technologia jako Pole: ERP, AI i audyt w tle",
    dimension: "Technologia",
    guest: "Architekt systemów zakupowych",
    thesis:
      "Procedury były pre-cyfrowym mechanizmem compliance. Dziś systemy IT pilnują granic polityki — lepiej i taniej.",
    recommendation:
      "Zainwestuj w system, który pilnuje polityki w tle. Pracownik ma myśleć o wartości, nie o checkboxach.",
  },
  {
    number: 9,
    slug: "normalizacja-dewiacji",
    title: `Normalizacja Dewiacji: Dlaczego „lepsza rura" zawsze prowadzi do katastrofy?`,
    dimension: "Psychologia organizacji",
    guest: "Psycholog organizacji / badacz bezpieczeństwa systemów",
    thesis:
      "Egzekwowanie procedur nie likwiduje obejść — czyni je niewidzialnymi, kumulując ryzyko.",
    recommendation:
      "Jeśli widzisz nieformalne ścieżki zakupowe — nie buduj ściany, tylko zapytaj, czego twój system nie ogarnia.",
  },
  {
    number: 10,
    slug: "jak-zaczac-pierwsze-3-kroki-do-pola",
    title: "Jak zacząć? Pierwsze 3 kroki do Pola",
    dimension: "Implementacja",
    guest: "Paweł Mamcarz (solo)",
    thesis:
      "Każda organizacja może przejść na model Pola w 3 krokach: rozróżnienie polityki od procedury, pomiar kosztów sztywności, pilotaż.",
    recommendation:
      "Nie czekaj na zgodę zarządu na rewolucję. Zrób jeden zakup w modelu Pola i porównaj wynik.",
  },
  {
    number: 11,
    slug: "pole-a-prawo-co-pzp-rzeczywiscie-nakazuje",
    title: "Pole a Prawo: Co PZP rzeczywiście nakazuje?",
    dimension: "Prawo zamówień publicznych",
    guest: "Prawnik specjalizujący się w PZP",
    thesis:
      "PZP specyfikuje *co*, nie *jak*. Większość sztywnych procedur to wybór organizacji, nie wymóg ustawy.",
    recommendation:
      "Przejrzyj regulamin udzielania zamówień — zaznacz na czerwono miejsca, które dodaliście ponad ustawę.",
  },
  {
    number: 12,
    slug: "tco-w-praktyce",
    title: "TCO w praktyce: Case study polskiej firmy",
    dimension: "C_TCO",
    guest: "CPO firmy produkcyjnej",
    thesis:
      "Przejście z kryterium ceny na TCO nie wymaga rewolucji — wymaga jednej decyzji i jednego pilotażu.",
    recommendation:
      "Wybierz jedną kategorię wydatków, gdzie serwis kosztuje więcej niż zakup — i zrób pilotaż TCO.",
  },
  {
    number: 13,
    slug: "agile-procurement-w-sektorze-publicznym",
    title: "Agile procurement w sektorze publicznym — czy to możliwe?",
    dimension: "Administracja publiczna",
    guest: "Praktyk innowacji w administracji",
    thesis:
      "Sektor publiczny też może być elastyczny. Przykłady z USA (Skylight Digital) i Europy.",
    recommendation:
      "Znajdź jedną procedurę w regulaminie, która jest dodana 'na wyrost' — i usuń ją w ramach pilotażu.",
  },
  {
    number: 14,
    slug: "psychologia-kupca-dlaczego-boimy-sie-elastycznosci",
    title: "Psychologia kupca: Dlaczego boimy się elastyczności?",
    dimension: "Behawioralne aspekty zakupów",
    guest: "Psycholog organizacji",
    thesis:
      "Strach przed kontrolą i audytem jest głównym hamulcowym zmiany — nawet jeśli kosztuje firmę miliony.",
    recommendation:
      `Przestań pytać „czy to jest zgodne z procedurą", zacznij pytać „czy to jest najlepsze dla organizacji".`,
  },
  {
    number: 15,
    slug: "rola-cpo-jak-przekonac-zarzad",
    title: "Rola CPO: Jak przekonać zarząd do modelu Pola?",
    dimension: "Leadership",
    guest: "CPO dużej organizacji",
    thesis:
      "Zmiana zaczyna się od języka, którym mówi CPO do CFO i CEO. Trzeba mówić liczbami, nie procesami.",
    recommendation:
      "Przygotuj jedną stronę A4 z wyliczeniem ProcuraCost dla waszej firmy i pokaż CFO na następnym spotkaniu.",
  },
  {
    number: 16,
    slug: "case-study-polska-firma-ktora-wyszla-z-rury",
    title: "Case study: Polska firma, która wyszła z rury",
    dimension: "Transformacja w praktyce",
    guest: "Szef zakupów lub CEO firmy",
    thesis:
      "Pokazujemy konkretny przypadek polskiej organizacji, która uprościła procedury, zachowując politykę.",
    recommendation:
      "Zróbcie audyt waszych 10 najdroższych procedur i wytnijcie jedną, która nie wynika z polityki.",
  },
  {
    number: 17,
    slug: "mierzenie-zakupow-poza-compliance-rate",
    title: "Mierzenie zakupów: Poza compliance rate",
    dimension: "Metryki · Goodhart",
    guest: "Ekspert controllingu zakupowego",
    thesis:
      "Gdy celem staje się wskaźnik zgodności, przestaje on mierzyć cokolwiek wartościowego.",
    recommendation:
      "Wprowadź jeden wskaźnik wartości do raportu zarządu — np. oszczędność TCO lub skrócenie czasu do podpisania umowy.",
  },
  {
    number: 18,
    slug: "odpornosc-lancucha-dostaw",
    title: "Odporność łańcucha dostaw: Sztywność vs. resilience",
    dimension: "Supply chain · Ryzyko",
    guest: "Menedżer ryzyka w łańcuchu dostaw",
    thesis:
      "Sztywne procedury zmniejszają zdolność adaptacji w kryzysie. Pole daje resilience.",
    recommendation:
      "Zróbcie przegląd kontraktów pod kątem klauzul awaryjnych — czy procedura pozwala działać szybko, czy blokuje?",
  },
  {
    number: 19,
    slug: "przyszlosc-ai-agentowe-zakupy",
    title: "Przyszłość: AI, agentowe zakupy i zero-touch compliance",
    dimension: "Technologia · Wizja",
    guest: "Strateg AI w zakupach",
    thesis:
      "Za 5 lat compliance będzie w pełni automatyczny, a człowiek zajmie się tylko decyzjami strategicznymi.",
    recommendation:
      "Zainwestuj godzinę w przetestowanie narzędzia AI do analizy wydatków — zobaczysz, co jest możliwe.",
  },
  {
    number: 20,
    slug: "pole-rozmowy-podsumowanie-sezonu",
    title: "Pole Rozmowy: Sezon 1 — Podsumowanie i społeczność",
    dimension: "Finał sezonu",
    guest: "Goście powracający + Paweł Mamcarz",
    thesis:
      "To nie koniec, to początek ruchu. Tworzymy społeczność praktyków Pola.",
    recommendation:
      "Dołącz do społeczności procuracost.com — nie po narzędzie, ale po sojuszników.",
  },
  {
    number: 21,
    slug: "obieg-zamowien-jak-po-przestaje-byc-formularzem",
    title: "Obieg zamówień: Jak PO przestaje być formularzem?",
    dimension: "Archetyp: Zamówienia operacyjne",
    guest: "Menedżer P2P w firmie produkcyjnej",
    thesis:
      "Obieg zamówień to nie procedura — to infrastruktura. Gdy każde PO wymaga 4 zatwierdzeń, firma płaci za własną nieefektywność.",
    recommendation:
      "Policz, ile zatwierdzeń mają wasze zamówienia poniżej 5 000 PLN. Jeśli więcej niż jedno — masz problem.",
  },
  {
    number: 22,
    slug: "katalog-zakupowy-amazon-dla-twojej-firmy",
    title: "Katalog zakupowy: Amazon dla Twojej firmy",
    dimension: "Archetyp: Katalogi · Zapotrzebowanie",
    guest: "Ekspert wdrożeń Coupa / Ariba",
    thesis:
      "Katalog to nie lista produktów — to system granic polityki w modelu pola. Zamawiający klika, system egzekwuje cenę, kupiec zajmuje się wyjątkami.",
    recommendation:
      "Zmierz maverick spend w jednej kategorii MRO. Jeśli przekracza 20% — wdrożenie katalogu zwróci się w 3 miesiące.",
  },
  {
    number: 23,
    slug: "mrp-kiedy-zakup-jest-decyzja-systemu-nie-kupca",
    title: "MRP: Kiedy zakup jest decyzją systemu, nie kupca",
    dimension: "Archetyp: MRP · Supply chain",
    guest: "Kierownik planowania produkcji",
    thesis:
      "Czyste pole operacyjne to MRP: system generuje zlecenie, kupiec reaguje tylko na wyjątki. Zero dyskrecji — i to jest zaleta, nie wada.",
    recommendation:
      "Sprawdź, jaki procent zleceń zakupu pochodzi z automatycznego MRP. Poniżej 60% oznacza, że planowanie nie jest zintegrowane z zakupami.",
  },
  {
    number: 24,
    slug: "faktura-koniec-p2p-gdzie-ginie-czas",
    title: "Faktura: Koniec P2P — gdzie ginie czas?",
    dimension: "Archetyp: Fakturowanie · P2P",
    guest: "Dyrektor finansowy i szef AP",
    thesis:
      "Faktura to lustro zakupów: jeśli masz 8% wyjątków na fakturach, masz 8% błędów w zamówieniach. Operacyjna doskonałość zaczyna się od PO, kończy na fakturze.",
    recommendation:
      "Zmierz match rate swoich faktur (2-way i 3-way match). Poniżej 90% automatic match — szukaj przyczyny w procesie zamówień, nie w AP.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((e) => e.slug === slug);
}
