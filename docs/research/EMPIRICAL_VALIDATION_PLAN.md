# Plan walidacji empirycznej ProcuraCost

**Wersja:** 1.0 dla modelu 2.2.1 · 26 lipca 2026
**Status:** projekt do oceny promotora. **Nie zawiera wyników — żadne dane nie zostały zebrane.**
**Zastępuje:** materiały z `docs/archive/model-1.x/planning/`, napisane pod model 1.x i nieprzenośne.

---

## 0. Po co ten dokument

Model 2.2 jest rachunkiem warunkowym. Mówi, co wynika z założeń, a nie co dzieje się
w polskich zamówieniach. Bez planu, który da się skrytykować przed zebraniem danych, cykl
doktorski nie ma warstwy empirycznej — a `PHD_ROADMAP.md` sam nazywa tę fazę „the part the
professor cares about most".

Dokument odpowiada na pięć pytań, które recenzent zada w tej kolejności:
co jest zmienną objaśniającą, jak ją mierzę, skąd wiem, że efekt jest przyczynowy,
ile obserwacji potrzebuję i co uznam za falsyfikację.

---

## 1. Czego dokładnie dotyczy walidacja

Model nie jest jednym twierdzeniem, więc nie ma jednej walidacji. Rozdzielam trzy poziomy,
bo mają różną trudność i różny status:

| Poziom | Pytanie | Wykonalne |
|---|---|---|
| **A. Pomiar** | Czy sekwencyjność przebiegu da się w ogóle zmierzyć rzetelnie z danych organizacyjnych? | tak, i to jest warunek wstępny reszty |
| **B. Asocjacja** | Czy bardziej sekwencyjny przebieg wiąże się z dłuższym cyklem i większym nakładem pracy, przy kontroli złożoności? | tak |
| **C. Przyczynowość** | Czy zmiana projektu procesu **powoduje** zmianę kosztu? | tylko warunkowo — patrz §5 |

**Deklaruję wprost: rozprawa celuje w A i B, a C traktuje jako warunkowe.** Poprzednie wersje
projektu sugerowały ambicję przyczynową bez planu identyfikacji. To był błąd i nie powtarzam go.

Osobno: **kalibracja modelu to nie to samo co jego walidacja.** Sprawdzenie, czy kalkulator
odtwarza własne założenia, nie jest testem niczego.

---

## 2. Zmienna objaśniająca: prescriptiveness ścieżki

Największa luka poprzednich wersji: „sekwencyjność" była nazwą, nie zmienną.

### 2.1 Definicja *ex ante*

Mierzę **prescriptiveness projektu procesu obowiązującego w chwili autoryzacji potrzeby**,
a nie to, jak postępowanie faktycznie przebiegło. To rozróżnienie jest krytyczne: przebieg
faktyczny jest współokreślony przez wynik, więc kodowanie go jako ekspozycji tworzy odwrotną
przyczynowość.

Źródłem jest **macierz akceptacji i wersja polityki zakupowej obowiązująca w dniu
`exposure_reference_at`** — dacie autoryzacji potrzeby, ustalanej przed obejrzeniem
jakiegokolwiek wyniku.

### 2.2 Składowe indeksu (5 pozycji, z-standaryzowane, sumowane)

| # | Składowa | Operacjonalizacja | Źródło |
|---|---|---|---|
| 1 | Liczba bram decyzyjnych | liczba wymaganych akceptacji przed wszczęciem | macierz akceptacji |
| 2 | Wymuszona sekwencja | liczba par etapów, których polityka zakazuje prowadzić równolegle | tekst polityki |
| 3 | Głębokość eskalacji | liczba poziomów hierarchii wymaganych dla tej klasy wartości | macierz akceptacji |
| 4 | Sztywność dokumentacji | liczba obowiązkowych artefaktów bez wariantu uproszczonego | tekst polityki |
| 5 | Autonomia zespołu | odwrócona: czy zespół może zmienić zakres bez ponownej akceptacji | tekst polityki |

**Świadomie wykluczam z ekspozycji:** udział czasu oczekiwania i długość ścieżki krytycznej.
Obie dzielą jednostki z wynikiem głównym i mechanicznie go ograniczają — wejście ich do
ekspozycji byłoby regresją czasu na czas. Poprzedni szkic protokołu je zawierał.

### 2.3 Reguły antywyciekowe

1. Koder ekspozycji nie widzi żadnego wyniku (czasu, ceny, liczby ofert, aneksów).
2. Kodowanie ekspozycji odbywa się z dokumentów datowanych **przed** `exposure_reference_at`.
3. Podręcznik kodowania jest zamrożony i wersjonowany przed pierwszym kodowaniem.
4. Co najmniej dwóch koderów, niezależnie; zgodność raportowana jako **Krippendorff α**,
   próg akceptacji **α ≥ 0,75** dla pozycji uznaniowych. Poniżej progu pozycja jest
   przeprojektowana albo usunięta, nie uśredniona.

---

## 3. Wynik główny i wyniki wtórne

**Wynik główny:** `log(dni cyklu zakupowego)` od autoryzacji potrzeby do podpisania umowy,
z audytowalnych znaczników czasu.

Logarytm, bo rozkład czasów cyklu jest prawoskośny, a interpretacja procentowa jest
naturalniejsza niż w dniach dla zakupów różnej wielkości.

**Wyniki wtórne, modelowane osobno, nigdy jako kontrole w modelu głównym:**
liczba ofert ważnych · nakład pracy w godzinach wg roli · liczba i typ aneksów ·
udokumentowane odstępstwa · ustalenia audytu · miary wykonania dostawy.

### 3.1 Kontrole i to, czego kontrolować nie wolno

| Dozwolone (przed-ekspozycyjne) | Zakazane (po-ekspozycyjne) |
|---|---|
| wartość szacunkowa, CPV, złożoność techniczna, pilność deklarowana przed wszczęciem, rok, efekty stałe zamawiającego | **liczba ofert**, cena względem benchmarku, liczba aneksów, wynik dostawy |

**To jest korekta względem poprzedniego szkicu**, który umieszczał liczbę ofert w modelu czasu
cyklu. Liczba ofert powstaje po publikacji, zależy od projektu procesu i mechanicznie wpływa
na czas oceny — jest zmienną pośredniczącą, a kontrolowanie jej obciąża współczynnik główny
(*post-treatment bias*). Liczba ofert jest zmienną zależną w modelu konkurencji (H2),
nie kontrolą w modelu czasu (H1).

---

## 4. Warstwy danych

### Warstwa 1 — rejestrowa (BZP / TED / e-Zamówienia)

Dostępna bez negocjacji. Daje: identyfikatory, CPV, wartość, tryb, daty ogłoszenia
i udzielenia, liczbę ofert, kryteria, opublikowane zmiany umowy.

**Czego z niej nie da się odzyskać:** roboczogodzin, kosztu dnia zwłoki, pełnego TCO,
jakości klauzul, obejść procesu i — co najważniejsze — **projektu procesu wewnętrznego**.
Rejestr widzi postępowanie od wszczęcia; ekspozycja z §2 żyje przed wszczęciem.

Rola warstwy 1: opis populacji, dobór próby, sprawdzenie reprezentatywności organizacji
z warstwy 2, testy gęstości przy progach.

### Warstwa 2 — organizacyjna (wymaga dostępu)

Jednostka analizy: **zdarzenie zakupowe**. Wymagane: logi workflow lub ERP ze znacznikami
czasu, macierz akceptacji z datą wersji, polityka zakupowa z historią wersji, ewidencja czasu
pracy (jeśli istnieje), rejestr aneksów, rejestr odstępstw.

**Realistyczne minimum:** 4–6 organizacji, po ≥ 60 zdarzeń każda, z co najmniej dwiema
zmianami wersji polityki w oknie obserwacji.

---

## 5. Identyfikacja — trzy warianty, z rekomendacją

### Wariant A — dopasowane zdarzenia wewnątrz organizacji *(bazowy)*

Porównanie podobnych zakupów w tej samej organizacji i kategorii, z efektami stałymi
zamawiającego i kategorii CPV.

`log(dni) = β·prescriptiveness + γ'X + α_zamawiający + δ_CPV + θ_rok + ε`

Błędy standardowe klastrowane na poziomie zamawiającego. Przy < 30 klastrach —
*wild cluster bootstrap*.

**Co identyfikuje:** asocjację warunkową. **Czego nie:** przyczynowości — wybór ścieżki jest
endogeniczny, trudniejsze zakupy mogą trafiać na ścieżkę bardziej formalną.
To jest poziom B, nie C.

### Wariant B — zmiana wersji polityki wewnętrznej *(rekomendowany dla warstwy przyczynowej)*

Wykorzystuje moment, w którym organizacja zmienia macierz akceptacji lub uruchamia moduł
workflow. Zdarzenia przed i po, przy niezmienionych progach ustawowych.

Staggered DiD z estymatorem odpornym na heterogeniczne efekty w czasie
(Callaway–Sant'Anna albo Sun–Abraham; **nie** dwukierunkowe efekty stałe, które przy
niejednoczesnym wejściu dają obciążenie „złych porównań").

Wymagania: test trendów równoległych na oknie przed-zmianą; brak antycypacji
(zdarzenia z okna −1 miesiąc wyłączone); zmiana polityki nie może być reakcją na wynik
(sprawdzenie w wywiadzie z właścicielem procesu i w uzasadnieniu zmiany).

**To jest najmocniejszy realistycznie dostępny wariant** i rekomenduję go jako oś artykułu 3.

### Wariant C — próg ustawowy *(warunkowy, prawdopodobnie odrzucony)*

Zmiana progu stosowania PZP ze 130 000 na 170 000 zł od 1 stycznia 2026
(Dz.U. 2025 poz. 1173) tworzy nieciągłość.

**Dopuszczalny wyłącznie po przejściu testów wstępnych:**
test gęstości McCrary/Cattaneo–Jansson–Ma na manipulację wartością szacunkową;
ciągłość kowariat przed-ekspozycyjnych przy progu; brak jednoczesnych zmian regulacyjnych.

Szucs (2024) jest tu **przestrogą, nie wzorem**: pokazał, że sortowanie przy progu unieważnia
prosty RDD w dokładnie tej klasie danych. „Donut" wokół progu nie przywraca identyfikacji
automatycznie. **Zakładam, że ten wariant nie przejdzie testów, i nie buduję na nim rozprawy.**

---

## 6. Wielkość próby i moc testu

Poprzednie wersje pytały o to promotora. Poniżej rachunek, który on ma ocenić.

### 6.1 Minimalny istotny efekt (MSI)

Ustalam **MSI = 10% skrócenia czasu cyklu** na jedną jednostkę odchylenia standardowego
indeksu prescriptiveness, czyli `|β| = 0,10` w modelu logarytmicznym.

Uzasadnienie: przy medianie cyklu ok. 60 dni to 6 dni. Poniżej tego progu efekt jest
nieodróżnialny od szumu kalendarzowego (święta, urlopy, terminy sesji komisji) i nie
uzasadnia przeprojektowania procesu. Próg jest deklarowany **przed** zebraniem danych.

### 6.2 Rachunek mocy

Założenia: α = 0,05 dwustronnie, moc 0,80, `sd(log dni) ≈ 0,55` (typowe dla prawoskośnych
czasów cyklu), ekspozycja z-standaryzowana (`sd = 1`), `R²` kontroli ≈ 0,30, korelacja
wewnątrzklastrowa ICC ≈ 0,15.

Dla regresji z jednym predyktorem ciągłym:

```
n ≈ (z_{1-α/2} + z_{1-β})² · sd²(y)·(1−R²) / β²
  = (1,96 + 0,84)² · 0,55²·0,70 / 0,10²
  ≈ 7,84 · 0,2118 / 0,01
  ≈ 166 zdarzeń
```

Korekta na klastrowanie (design effect przy średnio 60 zdarzeniach na organizację):

```
DE = 1 + (m−1)·ICC = 1 + 59·0,15 ≈ 9,85
n_efektywne ≈ 166 · 9,85 ≈ 1 635 zdarzeń
```

To jest nierealne przy 4–6 organizacjach. **Wniosek, który trzeba postawić uczciwie:**
przy tej strukturze danych moc wiąże **liczba organizacji, nie liczba zdarzeń**.

Dlatego:

- **Wariant A** (przekrojowy między organizacjami) wymagałby ~25–30 organizacji.
  Nierealne bez wsparcia instytucjonalnego.
- **Wariant B** (zmiana wewnątrz organizacji) opiera identyfikację na porównaniu
  wewnątrzklastrowym, gdzie ICC nie karze w ten sam sposób. Przy 6 organizacjach ×
  2 zmiany polityki × ≥ 60 zdarzeń, z efektami stałymi zamawiającego,
  wykrywalny efekt to ok. **12–15%** — nieco powyżej MSI, ale w zasięgu.

**To jest argument za wariantem B i przeciw wariantowi A jako osi rozprawy.** Ostateczne
`n` wyznaczy symulacja Monte Carlo na strukturze pilotażu, nie wzór zamknięty.

### 6.3 Pilotaż przed badaniem właściwym

2 organizacje × 25 zdarzeń. Cele: oszacować rzeczywiste `sd(log dni)` i ICC, sprawdzić
wykonalność kodowania ekspozycji (α), zmierzyć kompletność logów. Bez testowania hipotez.

---

## 7. Prerejestracja

Przed jakąkolwiek estymacją, w OSF, z zamrożonym: definicją okna czasowego, składem indeksu
ekspozycji, listą kontroli przed-ekspozycyjnych, estymatorem i poziomem klastrowania, regułą
wyłączeń, MSI oraz progiem `n`. Analizy nieprzewidziane są oznaczane jako eksploracyjne.

Dziennik odstępstw od planu jest publikowany razem z wynikami — również wtedy, gdy odstępstw
nie było.

---

## 8. Test modelu 2.2 na danych

Dopiero po estymacji składowych:

1. **Znak.** W ilu zdarzeniach model trafia w kierunek różnicy kosztu?
2. **Kalibracja.** Czy obserwowany wynik mieści się w zakresie niski–wysoki? Samo pokrycie
   nie wystarcza: dowolnie szeroki przedział zawsze pokrywa. Raportuję **szerokość** zakresu
   względem rozrzutu obserwowanego.
3. **Wartość dodana.** Porównanie z bazą naiwną — medianą kategorii. Model, który nie bije
   mediany kategorii, nie ma uzasadnienia.
4. **Które kanały zawodzą.** Osobno błąd dni, pracy, aneksów i wyniku netto.

Parametry można aktualizować na zbiorze treningowym; ocena końcowa wymaga próby odłożonej
albo późniejszego okresu.

### 8.1 Czego ten test nie rozstrzygnie

`dailyCostOfInaction` — parametr niosący 80,5–99,6% wyniku modelu — **nie jest odzyskiwalny
z żadnej z dwóch warstw danych.** Żadna z siedmiu kategorii kodowania go nie mierzy.

To jest najpoważniejsze ograniczenie całego projektu i wymaga osobnego rozwiązania:
ustrukturyzowanego wywiadu z właścicielem biznesowym, prowadzonego **przed** poznaniem czasu
cyklu, z jawnym rozliczeniem (utracona marża, przestój, koszt rozwiązania zastępczego).
Do czasu jego opracowania kanał opóźnienia pozostaje parametryzowany przez użytkownika i musi
być raportowany osobno — tak jak robi to model 2.2.

---

## 9. Warunki falsyfikacji

Teza słabnie, jeżeli — przy kontroli złożoności:

- prescriptiveness nie zwiększa czasu cyklu ani nakładu pracy (`|β| < MSI`, przedział
  ufności wykluczający MSI);
- adaptacyjny przebieg systematycznie obniża liczbę ważnych ofert;
- mechanizmy zmiany umowy nie poprawiają wykonania;
- model nie bije mediany kategorii.

Teza pozostaje sensowna przy efektach heterogenicznych: adaptacja pomaga tam, gdzie zwłoka
jest kosztowna i zakres niepewny; formalność tam, gdzie ryzyko dyskrecji jest wysokie
a wymagania stabilne.

**Wynik zerowy jest publikowalny i będzie opublikowany.**

---

## 10. Harmonogram

| Miesiąc | Kamień milowy |
|---|---|
| 1 | Podręcznik kodowania ekspozycji, zamrożony i przetestowany na dokumentach publicznych |
| 1–2 | Rekrutacja organizacji; umowy o dostęp do danych; zgoda komisji etycznej |
| 2 | Pilotaż (2 × 25 zdarzeń); oszacowanie `sd`, ICC i α |
| 3 | Symulacja mocy na strukturze pilotażu; prerejestracja |
| 3–5 | Kodowanie warstwy 2; równolegle pobranie i czyszczenie warstwy 1 |
| 6 | Estymacja składowych; testy odporności |
| 7 | Test modelu 2.2; artykuł 3 |

**Ryzyko krytyczne:** rekrutacja organizacji. Bez 4–6 partnerów plan nie jest wykonalny
w żadnym wariancie i trzeba zawęzić rozprawę do warstwy A (pomiar) plus studium wykonalności.
To jest pytanie, na które potrzebuję odpowiedzi od promotora najwcześniej.

---

## 11. Etyka i dane

Dane organizacyjne zawierają informacje osobowe, handlowe i potencjalne sygnały
nieprawidłowości. Wymagana podstawa prawna, minimalizacja, kontrola dostępu i ocena etyczna
**przed** pozyskaniem. Publikacja wyłącznie w agregatach, z procedurą ochrony przed
identyfikacją zamawiającego i wykonawcy.

Pakiet replikacyjny: słownik danych, kod pobrania i czyszczenia, manifest wersji źródeł,
prerejestracja, skrypty tabel, dziennik odstępstw. Surowe dane chronione nie muszą być
publiczne, ale **syntetyczny zestaw testowy musi umożliwiać audyt kodu** —
zob. `replication/synthetic_data/`.

Żadna tabela wynikowa nie jest wpisywana ręcznie: publikację generuje kod z zamrożonego
zbioru analitycznego.
