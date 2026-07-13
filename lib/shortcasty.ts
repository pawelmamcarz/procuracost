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
    title: "Paradoks Szucsa: elastyczność potrzebuje granic",
    dimension: "C_opp · C_TCO",
    guest: "Ekspert TCO z branży motoryzacyjnej",
    thesis:
      "Dyskrecja bez kontroli może podnosić ceny; pytanie brzmi, jak zachować elastyczność i audytowalne granice.",
    recommendation:
      "Zaprojektuj pilotaż TCO z udokumentowanymi kryteriami, danymi i kontrolą zgodności.",
  },
  {
    number: 3,
    slug: "renegocjacja-dlaczego-sztywne-umowy-koncza-sie-w-sadzie",
    title: "Renegocjacja: jak sztywność umowy wiąże się z ryzykiem?",
    dimension: "C_reneg",
    guest: "Prawnik kontraktowy",
    thesis:
      "Beuve et al. (2021) wiążą wzrost sztywności umowy o jedno odchylenie standardowe ze wzrostem prawdopodobieństwa renegocjacji o 7,7–10,5 p.p.",
    recommendation:
      "Przejrzyj z prawnikiem zapisy o największym koszcie adaptacji i oceń, czy wymagają klauzul przeglądowych.",
  },
  {
    number: 4,
    slug: "flota-jak-ryanair-i-lot-kupuja-bez-przetargu",
    title: "Flota: kiedy timing zmienia strategię zakupu?",
    dimension: "Archetyp: Flota",
    guest: "Ekspert rynku lotniczego",
    thesis:
      "Zakup floty pozwala zbadać, kiedy koszt okna rynkowego uzasadnia wybór innej legalnej ścieżki.",
    recommendation:
      "Zidentyfikuj zakup, w którym timing ma znaczenie, i porównaj dostępne legalne ścieżki oraz ich zabezpieczenia.",
  },
  {
    number: 5,
    slug: "it-erp-4-tygodnie-zamiast-6-miesiecy",
    title: "IT/ERP: jak zmierzyć koszt opóźnienia wdrożenia?",
    dimension: "Archetyp: IT/ERP",
    guest: "Praktyk Lean Agile Procurement",
    thesis:
      "Iteracyjne podejście może skrócić sourcing IT, ale skalę efektu trzeba mierzyć na danych projektowych.",
    recommendation:
      "Sprawdź, czy prawo i polityka dopuszczają dialog lub warsztaty rynkowe, a następnie udokumentuj zasady równego dostępu.",
  },
  {
    number: 6,
    slug: "produkcja-dlaczego-zara-nie-robi-przetargow",
    title: "Produkcja: gdy cykl rynkowy jest krótszy niż sourcing",
    dimension: "Archetyp: Produkcja",
    guest: "Menedżer łańcucha dostaw z FMCG",
    thesis:
      "Krótki cykl popytu może zwiększać koszt opóźnienia, ale nie usuwa wymogów konkurencji i kontroli.",
    recommendation:
      "Porównaj czas cyklu rynkowego z czasem procesu i sprawdź, które bramki są prawnie lub kontrolnie konieczne.",
  },
  {
    number: 7,
    slug: "logistyka-sourcing-w-oknie-czasowym",
    title: "Logistyka: Sourcing w oknie czasowym",
    dimension: "Archetyp: Logistyka",
    guest: "Ekspert logistyki kontraktowej",
    thesis:
      "Kontrakty z twardym oknem operacyjnym pozwalają testować, jak czas procesu przekłada się na koszt opóźnienia.",
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
      "Systemy IT mogą automatyzować wybrane kontrole, ale ich skuteczność i koszt zależą od konfiguracji, danych i użycia.",
    recommendation:
      "Zmierz pokrycie kontroli, wyjątki i pracę ręczną przed decyzją o inwestycji w system.",
  },
  {
    number: 9,
    slug: "normalizacja-dewiacji",
    title: `Normalizacja dewiacji: kiedy mocniejsza kontrola ukrywa problem?`,
    dimension: "Psychologia organizacji",
    guest: "Psycholog organizacji / badacz bezpieczeństwa systemów",
    thesis:
      "Silniejsze egzekwowanie może ograniczyć obejścia albo przesunąć je poza system; kierunek efektu trzeba obserwować.",
    recommendation:
      "Klasyfikuj nieformalne ścieżki: błąd projektu, luka kontroli, brak kompetencji czy nadużycie wymagają innych reakcji.",
  },
  {
    number: 10,
    slug: "jak-zaczac-pierwsze-3-kroki-do-pola",
    title: "Jak zacząć? Pierwsze 3 kroki do Pola",
    dimension: "Implementacja",
    guest: "Paweł Mamcarz (solo)",
    thesis:
      "Trzy kroki tworzą plan testu: rozróżnienie wymagań, pomiar stanu bazowego i kontrolowany pilotaż.",
    recommendation:
      "Uzgodnij właściciela ryzyka, kryteria sukcesu i zgodę na jeden kontrolowany pilotaż.",
  },
  {
    number: 11,
    slug: "pole-a-prawo-co-pzp-rzeczywiscie-nakazuje",
    title: "Pole a prawo: jak oddzielić ustawę od regulaminu?",
    dimension: "Prawo zamówień publicznych",
    guest: "Prawnik specjalizujący się w PZP",
    thesis:
      "PZP przewiduje różne tryby i warunki ich użycia; rozdzielenie ustawy, kontroli i reguł wewnętrznych wymaga analizy prawnej.",
    recommendation:
      "Przejrzyj regulamin z prawnikiem i właścicielem kontroli, oznaczając źródło oraz cel każdego wymagania.",
  },
  {
    number: 12,
    slug: "tco-w-praktyce",
    title: "TCO w praktyce: jak zaprojektować pilotaż?",
    dimension: "C_TCO",
    guest: "CPO firmy produkcyjnej",
    thesis:
      "Pilotaż TCO wymaga definicji horyzontu, danych kosztowych, reguł porównania i kontroli jakości pomiaru.",
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
      "Zakres elastyczności w sektorze publicznym zależy od podstawy prawnej, wartości, przedmiotu i warunków konkretnego postępowania.",
    recommendation:
      "Zidentyfikuj wymaganie wewnętrzne do przeglądu i oceń z prawnikiem oraz audytem, czy można je bezpiecznie zmienić.",
  },
  {
    number: 14,
    slug: "psychologia-kupca-dlaczego-boimy-sie-elastycznosci",
    title: "Psychologia kupca: Dlaczego boimy się elastyczności?",
    dimension: "Behawioralne aspekty zakupów",
    guest: "Psycholog organizacji",
    thesis:
      "Postrzegane ryzyko audytu może wpływać na wybór ścieżki; siłę tego mechanizmu trzeba zbadać.",
    recommendation:
      `Pytaj równolegle: „czy to jest legalne i kontrolowane?" oraz „jaki wynik tworzy dla organizacji?".`,
  },
  {
    number: 15,
    slug: "rola-cpo-jak-przekonac-zarzad",
    title: "Rola CPO: Jak przekonać zarząd do modelu Pola?",
    dimension: "Leadership",
    guest: "CPO dużej organizacji",
    thesis:
      "Rozmowa CPO z CFO powinna łączyć wynik, ryzyko, proces i jawne założenia pomiaru.",
    recommendation:
      "Przygotuj stronę z wynikiem ProcuraCost, zakresem niepewności i listą danych potrzebnych do kalibracji.",
  },
  {
    number: 16,
    slug: "case-study-polska-firma-ktora-wyszla-z-rury",
    title: "Pilotaż: jak polska firma może przetestować model?",
    dimension: "Transformacja w praktyce",
    guest: "Szef zakupów lub CEO firmy",
    thesis:
      "Odcinek powinien powstać dopiero po udokumentowanym pilotażu z zatwierdzonym sposobem anonimizacji i interpretacji wyników.",
    recommendation:
      "Zmapujcie wymagania i koszty dziesięciu procesów, a zmianę wybierzcie po ocenie prawa, kontroli i ryzyka.",
  },
  {
    number: 17,
    slug: "mierzenie-zakupow-poza-compliance-rate",
    title: "Mierzenie zakupów: Poza compliance rate",
    dimension: "Metryki · Goodhart",
    guest: "Ekspert controllingu zakupowego",
    thesis:
      "Gdy wskaźnik zgodności staje się celem, może tracić wartość informacyjną i wymagać równoważenia metrykami wyniku.",
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
      "Proceduralna sztywność może ograniczać adaptację, ale elastyczność bez kontroli może zwiększać inne ryzyka.",
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
      "Automatyzacja może przejąć część kontroli, lecz tempo adopcji i zakres odpowiedzialności człowieka pozostają niepewne.",
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
      "Liczba zatwierdzeń może zwiększać koszt obsługi, ale jej zasadność zależy od wartości, ryzyka i jakości kontroli.",
    recommendation:
      "Porównaj liczbę zatwierdzeń, czas cyklu i częstość wyjątków według wartości oraz ryzyka zamówienia.",
  },
  {
    number: 22,
    slug: "katalog-zakupowy-amazon-dla-twojej-firmy",
    title: "Katalog zakupowy: Amazon dla Twojej firmy",
    dimension: "Archetyp: Katalogi · Zapotrzebowanie",
    guest: "Ekspert wdrożeń Coupa / Ariba",
    thesis:
      "Katalog może automatyzować wybrane granice polityki, jeśli dane, ceny i uprawnienia są aktualne.",
    recommendation:
      "Zmierz maverick spend, koszt obsługi i jakość danych w jednej kategorii MRO przed oszacowaniem zwrotu z katalogu.",
  },
  {
    number: 23,
    slug: "mrp-kiedy-zakup-jest-decyzja-systemu-nie-kupca",
    title: "MRP: Kiedy zakup jest decyzją systemu, nie kupca",
    dimension: "Archetyp: MRP · Supply chain",
    guest: "Kierownik planowania produkcji",
    thesis:
      "MRP może automatyzować rutynowe zlecenia, pozostawiając człowiekowi wyjątki; jakość zależy od danych i reguł planowania.",
    recommendation:
      "Sprawdź udział zleceń z MRP oraz przyczyny wyjątków, bez przyjmowania arbitralnego progu dojrzałości.",
  },
  {
    number: 24,
    slug: "faktura-koniec-p2p-gdzie-ginie-czas",
    title: "Faktura: Koniec P2P — gdzie ginie czas?",
    dimension: "Archetyp: Fakturowanie · P2P",
    guest: "Dyrektor finansowy i szef AP",
    thesis:
      "Wyjątki fakturowe mogą wskazywać problemy w zamówieniach, odbiorze, danych lub fakturze; wymagają analizy przyczyn.",
    recommendation:
      "Zmierz 2-way i 3-way match oraz zakoduj przyczyny wyjątków przed przypisaniem odpowiedzialności do zakupów lub AP.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((e) => e.slug === slug);
}
