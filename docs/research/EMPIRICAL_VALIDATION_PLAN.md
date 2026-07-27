# Plan walidacji empirycznej ProcuraCost

**Wersja:** 1.1 dla modelu 2.2.2 · 27 lipca 2026
**Status:** projekt do oceny promotora. **Nie zawiera wyników — żadne dane nie zostały zebrane.**
**Zastępuje:** materiały z `docs/archive/model-1.x/planning/`, napisane pod model 1.x i nieprzenośne.

---

## 0. Po co ten dokument

Model 2.2.2 jest rachunkiem warunkowym. Mówi, co wynika z założeń, a nie co dzieje się
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
| **A. Pomiar** | Czy preskryptywność projektu procesu da się rzetelnie zmierzyć *ex ante* z dokumentów organizacyjnych? | tak, i to jest warunek wstępny reszty |
| **B. Asocjacja** | Czy bardziej preskryptywny projekt procesu wiąże się z dłuższym cyklem i większym nakładem pracy, przy kontroli złożoności? | tak |
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

Indeks opisuje wyłącznie projekt workflow. Nie zawiera konkurencji, sztywności
klauzul ani wykorzystania technologii. Pięć składowych jest raportowanych także
osobno; równe wagi zostają zamrożone przed analizą, a alternatywne ważenie ma
status eksploracyjny.

**Świadomie wykluczam z ekspozycji:** udział czasu oczekiwania i długość ścieżki krytycznej.
Obie dzielą jednostki z wynikiem głównym i mechanicznie go ograniczają — wejście ich do
ekspozycji byłoby regresją czasu na czas. Poprzedni szkic protokołu je zawierał.

### 2.3 Reguły antywyciekowe

1. Koder ekspozycji nie widzi żadnego wyniku (czasu, ceny, liczby ofert, aneksów).
2. Kodowanie ekspozycji odbywa się z dokumentów datowanych **przed** `exposure_reference_at`.
3. Podręcznik kodowania jest zamrożony i wersjonowany przed pierwszym kodowaniem.
4. Co najmniej dwóch koderów, niezależnie; zgodność raportowana jako **Krippendorff α**,
   prerejestrowany próg akceptacji **α ≥ 0,80** dla pozycji uznaniowych. Poniżej progu pozycja jest
   przeprojektowana albo usunięta, nie uśredniona. Próg 0,80 jest konserwatywną
   decyzją projektową, a nie uniwersalnym prawem dla każdego rodzaju kodowania.

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

W H2 ekspozycją są cechy dostępu do rynku ustalone przed złożeniem ofert, np.
zakres publikacji, planowana liczba zaproszeń i restrykcyjność warunków udziału.
Wynikami są liczba ważnych ofert i cena względem wcześniej ustalonego benchmarku.
Liczba ofert nie może wystąpić jednocześnie jako miara „skutecznej konkurencji"
i wynik tego samego modelu.

H3 i H5 zawierają twierdzenia o braku samodzielnego efektu liczby bram oraz
samego posiadania systemu. `p > 0,05` nie potwierdza takiego braku. Po pilotażu,
ale przed estymacją zależności w badaniu właściwym, trzeba zamrozić praktyczne
granice równoważności na podstawie znaczenia merytorycznego, nie zaobserwowanego
efektu, i sprawdzić, czy cały przedział ufności mieści się w tych granicach. Dla
H5 osobno raportowana jest interakcja z faktycznie zalogowanym użyciem kontroli.

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

**Cel rekrutacyjny dla pomiaru i asocjacji:** 4–6 organizacji, po ≥ 60 zdarzeń każda,
z historią wersji polityki. To nie jest wystarczająca z góry liczba klastrów do analizy
przyczynowej. Rozszerzenie DiD wymaga dodatkowo jednorazowej, porównywalnej interwencji,
zróżnicowanych terminów wdrożenia oraz grup jeszcze nieobjętych zmianą; wymaganą liczbę
organizacji wyznaczy symulacja po pilotażu.

---

## 5. Identyfikacja — trzy warianty o różnym statusie

### Wariant A — dopasowane zdarzenia wewnątrz organizacji *(bazowy)*

Porównanie podobnych zakupów w tej samej organizacji i kategorii, z efektami stałymi
zamawiającego i kategorii CPV.

`log(dni) = β·prescriptiveness + γ'X + α_zamawiający + δ_CPV + θ_rok + ε`

Błędy standardowe klastrowane na poziomie zamawiającego. Przy < 30 klastrach —
*wild cluster bootstrap*. Przy zaledwie 4–6 klastrach także ta korekta nie daje
pewnej inferencji: wyniki pozostają eksploracyjne i wymagają analizy
*leave-one-organization-out*.

**Co identyfikuje:** asocjację warunkową. **Czego nie:** przyczynowości — wybór ścieżki jest
endogeniczny, trudniejsze zakupy mogą trafiać na ścieżkę bardziej formalną.
To jest poziom B, nie C.

### Wariant B — jednorazowa zmiana procesu *(warunkowe rozszerzenie przyczynowe)*

Wykorzystuje moment, w którym organizacje wdrażają tę samą, jasno zdefiniowaną zmianę,
np. uruchomienie modułu workflow z ustalonym zakresem albo jednokierunkowe uproszczenie
macierzy akceptacji. Interwencja musi być stanem pochłaniającym: po wdrożeniu organizacja
nie wraca w oknie badania do wcześniejszego projektu procesu.

Przy zróżnicowanych terminach i grupach jeszcze nieobjętych zmianą można zastosować
*staggered DiD* z estymatorem odpornym na heterogeniczne efekty w czasie
(Callaway–Sant'Anna albo Sun–Abraham; **nie** naiwną regresję z dwukierunkowymi efektami
stałymi, która przy niejednoczesnym wejściu może tworzyć obciążone porównania).
Estymandem jest wtedy grupowo-czasowy ATT interwencji dla `log(dni)`, a nie
automatycznie współczynnik na jedno odchylenie indeksu prescriptiveness.

Wymagania: ocena trendów przed zmianą, brak antycypacji (okno wyłączenia ustalone przed
analizą), brak równoległej transformacji wpływającej na wynik i wiarygodne grupy
porównawcze. Brak różnic w trendach przed zmianą nie dowodzi założenia trendów
równoległych. Wywiad z właścicielem procesu może ujawnić endogeniczną reakcję na wyniki,
ale nie może sam potwierdzić egzogeniczności.

Zwykłe aktualizacje polityki, które mogą zwiększać i zmniejszać preskryptywność, nie
spełniają założenia stanu pochłaniającego. Są analizowane w wariancie A. Artykuł 3 opiera
się na pomiarze i asocjacji; wariant B staje się osią przyczynową tylko wtedy, gdy dane
spełnią powyższe warunki i symulacja wykaże wystarczającą moc.

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

Poprzednie wersje deklarowały liczebność z uproszczonego wzoru. Poniżej reguła
projektowa do oceny przed pilotażem.

### 6.1 Minimalny istotny efekt (MSI)

Ustalam **MSI = 10% wydłużenia czasu cyklu** na jedno odchylenie standardowe
indeksu prescriptiveness, czyli `β_MSI = ln(1,10) ≈ 0,095` w modelu logarytmicznym.

Uzasadnienie: przy medianie cyklu ok. 60 dni to 6 dni. To próg istotności praktycznej,
nie granica odróżniająca efekt od szumu statystycznego. Próg jest deklarowany **przed**
zebraniem danych i wymaga akceptacji jako decyzja zarządczo-badawcza; nie pochodzi
z zewnętrznego benchmarku.

Nakład pracy jest odrębnym wynikiem i wymaga własnego MSI, w jego własnej skali.
Próg dla godzin zostanie ustalony po pilotażu, lecz przed estymacją zależności w
badaniu właściwym i na podstawie znaczenia merytorycznego; `β_MSI` dla czasu nie
może być mechanicznie użyty dla wysiłku.

Dla warunkowego wariantu B należy osobno prerejestrować minimalny istotny ATT
interwencji. Nie wolno przeliczać go na `β_MSI` bez udokumentowania, o ile
interwencja rzeczywiście zmieniła indeks prescriptiveness.

### 6.2 Moc: najpierw pilotaż, potem symulacja

Nie deklaruję zamkniętego `n` ani MDE przed pilotażem. Prosty wzór dla niezależnych
obserwacji byłby tu fałszywie precyzyjny: nie uwzględnia korelacji ekspozycji z kontrolami,
efektów stałych, nierównych klastrów, autokorelacji ani harmonogramu wdrożeń. Mnożenie go
przez klasyczny *design effect* także nie odwzorowuje estymatora panelowego lub DiD.

Pilotaż oszacuje `sd(log dni)`, ICC, rozkład ekspozycji, liczbę zdarzeń w okresach oraz
korelację szeregową. Następnie prerejestrowana symulacja Monte Carlo odtworzy planowany
estymator, układ klastrów, terminy interwencji, braki danych i efekt `β_MSI`. Raport poda
moc dla kilku liczb organizacji i minimalny wykrywalny efekt przy α = 0,05.

**Wniosek znany już teraz:** moc wiąże przede wszystkim liczba organizacji i niezależnych
terminów zmiany, nie liczba zdarzeń. Przy 4–6 organizacjach analiza przyczynowa jest
eksploracyjna; nie ma podstaw do obiecywania wykrywalnego efektu 12–15% przed symulacją.

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

## 8. Test modelu 2.2.2 na danych

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

`dailyCostOfInaction` — parametr stojący za kubełkiem zwłoki, który w stałych
scenariuszach referencyjnych o różnych czasach ścieżek niesie 68,3–99,6% `|ΔC|`
(po audycie kalibracji 2.2.2) — **nie jest odzyskiwalny
z żadnej z dwóch warstw danych.** Żadna z siedmiu kategorii kodowania go nie mierzy.

To jest najpoważniejsze ograniczenie całego projektu i wymaga osobnego rozwiązania:
ustrukturyzowanego wywiadu z właścicielem biznesowym, prowadzonego **przed** poznaniem czasu
cyklu, z jawnym rozliczeniem (utracona marża, przestój, koszt rozwiązania zastępczego).
Do czasu jego opracowania kanał opóźnienia pozostaje parametryzowany przez użytkownika i musi
być raportowany osobno — tak jak robi to model 2.2.2.

---

## 9. Warunki falsyfikacji

Teza słabnie, jeżeli — przy kontroli złożoności:

- prescriptiveness nie ma materialnego dodatniego związku z czasem cyklu ani
  nakładem pracy (dla każdego wyniku górna granica przedziału ufności jest
  poniżej jego własnego prerejestrowanego MSI);
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
| 7 | Test modelu 2.2.2; artykuł 3 |

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
