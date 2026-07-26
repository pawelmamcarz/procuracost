# Syntetyczny zestaw testowy

**Wersja:** 1.0 dla modelu 2.2.1 · 26 lipca 2026

## Czym to jest

Wymyślony zbiór zdarzeń zakupowych o strukturze opisanej w
`docs/research/EMPIRICAL_VALIDATION_PLAN.md`. Istnieje po to, żeby **kod analityczny dało się
uruchomić i zrecenzować, zanim jakiekolwiek rzeczywiste dane zostaną pozyskane** —
wymaganie postawione w `docs/articles/doktorat/article-3-empiria-PZP-PL.md` §8.

## Czym to nie jest

- **Nie są to dane.** Żadna liczba tutaj nie pochodzi z obserwacji żadnej organizacji.
- **Nie jest to symulacja kalibracyjna.** Wartości dobrano tak, żeby pokryć przypadki
  brzegowe kodu, a nie żeby odtworzyć rozkłady występujące w polskich zamówieniach.
- **Nie wolno z tego liczyć żadnego efektu i go raportować.** Efekt wbudowany w generator
  jest znany z góry (§4) i służy wyłącznie sprawdzeniu, czy kod go odzyskuje.

Każda tabela wynikowa policzona na tym zbiorze musi nosić etykietę „dane syntetyczne".

## Schemat (`events.csv`)

| Kolumna | Typ | Opis |
|---|---|---|
| `event_id` | string | identyfikator zdarzenia zakupowego |
| `org_id` | string | organizacja (klaster dla błędów standardowych) |
| `exposure_reference_at` | data | dzień autoryzacji potrzeby — moment odczytu ekspozycji |
| `policy_version` | string | wersja polityki zakupowej obowiązująca w tym dniu |
| `gates` | int | składowa 1: liczba bram decyzyjnych przed wszczęciem |
| `forced_sequence_pairs` | int | składowa 2: pary etapów, których nie wolno zrównoleglić |
| `escalation_depth` | int | składowa 3: poziomy hierarchii wymagane dla tej klasy wartości |
| `mandatory_artifacts` | int | składowa 4: obowiązkowe artefakty bez wariantu uproszczonego |
| `team_autonomy` | int | składowa 5 (odwrócona): 0 = brak autonomii, 2 = pełna |
| `cpv_division` | string | dwucyfrowy dział CPV |
| `estimated_value_pln` | int | wartość szacunkowa |
| `complexity` | int | 1–5, kodowane przed ekspozycją |
| `urgency_declared_days` | int | pilność deklarowana przed wszczęciem |
| `year` | int | rok autoryzacji |
| `cycle_days` | int | **wynik główny** — dni od autoryzacji do podpisania umowy |
| `effort_hours` | int | wynik wtórny — łączny nakład pracy |
| `valid_bids` | int | wynik wtórny — **nigdy kontrola w modelu czasu** |
| `amendments` | int | wynik wtórny |

`prescriptiveness` **nie jest kolumną** — jest sumą z-standaryzowanych składowych 1–5,
liczoną przez kod analityczny. Umyślnie: jeżeli indeks byłby wpisany, nie dałoby się
sprawdzić, czy kod go poprawnie konstruuje.

## Co jest wbudowane, żeby kod dało się sprawdzić

1. **Znany efekt.** `cycle_days` generowano z `log(dni) = 3,9 + 0,12 · z(prescriptiveness) + szum`.
   Poprawna specyfikacja powinna odzyskać β ≈ 0,12. Kod, który zwraca coś innego, ma błąd —
   albo w konstrukcji indeksu, albo w kontrolach.
2. **Zmiana polityki dla wariantu B.** `ORG-A` przechodzi z `v1` na `v2` w połowie okna
   (mniej bram, mniejsza głębokość eskalacji). `ORG-B` nie zmienia polityki i służy jako
   grupa porównawcza. Pozwala to uruchomić staggered DiD na strukturze, w której efekt jest znany.
3. **Pułapka post-treatment.** `valid_bids` skorelowano zarówno z ekspozycją, jak i z `cycle_days`.
   Wprowadzenie jej jako kontroli do modelu czasu **musi** obciążyć β w dół — to test
   regresyjny na błąd specyfikacji opisany w planie §3.1.
4. **Braki danych.** Część `effort_hours` jest pusta i braki korelują z `org_id`, żeby kod
   raportowania kompletności miał co pokazać.
5. **Przypadki brzegowe.** Jedno zdarzenie o zerowej liczbie ofert, jedno o wartości poniżej
   progu 170 000 zł, jedno z `cycle_days` skrajnie długim.

## Reprodukcja

Zbiór jest wpisany ręcznie i wersjonowany — nie ma generatora losowego, bo losowość
utrudniałaby recenzję. Zmiana zbioru wymaga zmiany tego pliku i podbicia wersji.
