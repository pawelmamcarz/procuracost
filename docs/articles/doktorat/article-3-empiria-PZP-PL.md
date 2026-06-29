# Gdzie sztywność naprawdę kosztuje? Zastosowanie modelu kosztu proceduralnego do polskich zamówień publicznych (UZP/BZP/TED)

**Paweł Mamcarz**
Uczelnia Łazarskiego w Warszawie

**Artykuł 3 cyklu doktorskiego ProcuraCost / Tunel-vs-Pole.** Uczelnia Łazarskiego, rozprawa interdyscyplinarna w dziedzinach *ekonomia i finanse* oraz *nauki o polityce i administracji* (cykl trzech powiązanych tematycznie artykułów, art. 187 ust. 3 PSWiN). Artykuł kotwiczy dyscyplinę *nauki o polityce i administracji* i ma charakter aplikacyjno-empiryczny.

**Status metodologiczny:** projekt badawczy w stylu *registered report*. Artykuł przedstawia (i) preregistrowalny plan badania na danych wtórnych, (ii) operacjonalizację konstruktów teoretycznych na obserwowalne wskaźniki oraz (iii) statystyki opisowe pobrane z opublikowanych źródeł zagregowanych (Sprawozdanie Prezesa UZP za 2023 r., Single Market and Competitiveness Scoreboard, opentender.eu/DIGIWHIST). Te statystyki są **oficjalnymi danymi raportowanymi** przez wskazane źródła i podlegają niezależnej re-weryfikacji na etapie pozyskania mikrodanych transakcyjnych. **Pełne oszacowania inferencyjne (regresje, efekty przyczynowe) NIE są w tym artykule raportowane** i następują dopiero po pozyskaniu mikrodanych transakcyjnych; wszystkie zależności hipotezowane są formułowane jako **asocjacje** z przewidywanymi znakami, a nie jako zmierzone efekty.

---

## Streszczenie

Polskie instytucje zamawiające działające pod rządami ustawy *Prawo zamówień publicznych* (PZP) systematycznie utożsamiają **politykę zakupową** — zbiór wiążących ograniczeń, które każde udzielenie zamówienia musi spełnić, granicę `∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}` — z **procedurą zakupową**, jedną uporządkowaną ścieżką `A = (a₁, …, aₖ)` przecinającą tę granicę. Artykuły 1 i 2 cyklu sformalizowały tę konflację ekonomicznie (siedmiowymiarowy model kosztu utraconych korzyści `ΔC_total = Σᵢ ΔCᵢ`) i związały ją z prawno-proceduralną strukturą PZP. Niniejszy artykuł przekłada tę ramę na **rejestrowalny projekt badawczy** dla polskiego rynku zamówień publicznych. Formułujemy cztery hipotezy kierunkowe (H1–H4), operacjonalizujemy konstrukty modelu na obserwowalne proxy dostępne w TED, Biuletynie Zamówień Publicznych (BZP), platformie e-Zamówienia, opentender.eu/DIGIWHIST oraz sprawozdaniach Prezesa UZP, i precyzujemy granicę poznawczą danych wtórnych: spośród siedmiu wymiarów kosztu **cztery są testowalne** na danych wtórnych (czas, koszt utraconych korzyści w części „czasowej", faworytyzm/jakość selekcji, renegocjacje), natomiast **całkowity koszt posiadania (TCO) i obejścia (bypass) pozostają poza zakresem** danych transakcyjnych i wymagają etapu pierwotnego (ankieta + studia przypadku). Przedstawiamy strategię identyfikacji opartą na regresji nieciągłości (RDD) przy progu krajowym 130 000 zł i progach unijnych — z testem gęstości McCrary'ego/Cattaneo jako **wynikiem**, a nie jedynie kontrolą (kupkowanie/*bunching* tuż poniżej progów jako obserwowalna sygnatura jednej z form obejścia) — uzupełnioną o donut-RDD, wysokowymiarowe efekty stałe (CPV × zamawiający × rok) oraz dwa quasi-eksperymenty różnicy w różnicach (DiD): reformę PZP z 2021 r. i wyłączenia covidowe. Sekcja opisowa, oparta na opublikowanych statystykach, dokumentuje **kontekst empiryczny**: w 2023 r. polski rynek zamówień objętych PZP osiągnął 279,8 mld zł (≈8,2% PKB), a efektywna konkurencja była niska — średnio 2,12 oferty w postępowaniach powyżej progów unijnych i jednoofertowość na poziomie 54% tych postępowań (38,5% poniżej progów), przy czym wskaźnik jednego oferenta dla Polski (56%) należy do najwyższych w UE (średnia 28%). Wszystkie wyniki modelu pozostają **estymacjami przy udokumentowanych założeniach, nie zmierzonymi faktami**; symetria modelu (możliwość, że ścieżka sztywna/konkurencyjna bywa tańsza) jest ujawniana uczciwie jako **możliwość strukturalna, liczbowo bezczynna netto** w przeliczeniu na realnym kodzie, której realizacja netto staje się falsyfikowalna dopiero na mikrodanych.

**Słowa kluczowe:** zamówienia publiczne; Prawo zamówień publicznych; konkurencyjność postępowań; jednoofertowość; dyskrecja i faworytyzm; regresja nieciągłości; polityka publiczna; koszt proceduralny.

**Abstract.** Polish contracting authorities under the Public Procurement Law (PZP) systematically conflate procurement *policy* — the binding boundary `∂Φ = {authorization, competition, ethics, documentation}` — with a single *procedure* `A = (a₁, …, aₖ)`. Articles 1 and 2 of this cycle formalised that conflation economically (a seven-dimension opportunity-cost model `ΔC_total = Σᵢ ΔCᵢ`) and bound it to the PZP legal structure. This article translates the framework into a **registered-report-style research design** for the Polish public-procurement market. We state four directional hypotheses (H1–H4), operationalise the model's constructs onto observable proxies in TED, the Public Procurement Bulletin (BZP), the e-Zamówienia platform, opentender.eu/DIGIWHIST and the UZP President's annual reports, and delimit what secondary data can and cannot test: of the seven cost dimensions, **four are testable** on secondary data (time; the delay component of opportunity cost; favoritism/selection-quality; renegotiation), while **total cost of ownership and bypass are out of scope** and deferred to a primary stage. The identification strategy uses regression discontinuity at the 130,000-PLN national threshold and the EU thresholds — with the McCrary/Cattaneo density test as a **result** (bunching below thresholds as the observable signature of one bypass form) — plus donut-RDD, high-dimensional fixed effects (CPV × buyer × year) and two difference-in-differences designs (the 2021 PZP reform; COVID-era exemptions). A descriptive section grounded in published aggregates documents the empirical context. All model outputs remain **estimates under documented assumptions, not measured facts**; the model's symmetry is disclosed honestly as a *structural possibility that is numerically inert at net*, falsifiable only on microdata. No inferential results are reported here.

**Keywords:** public procurement; Polish Public Procurement Law; tender competitiveness; single bidding; discretion and favoritism; regression discontinuity; public policy; procedural cost.

---

## 1. Wstęp

### 1.1 Problem i czerwona nić cyklu

Wspólnym przedmiotem trzyartykułowego cyklu jest teza, że organizacje — najdotkliwiej polskie instytucje zamawiające pod rządami PZP — **systematycznie mylą politykę zakupową z procedurą zakupową**. Polityka jest *granicą*: zbiorem ograniczeń, które każde udzielenie zamówienia musi spełnić, zapisanym w samej ustawie i w dyrektywie 2014/24/UE. Procedura jest *jedną* uporządkowaną ścieżką przez tę granicę. Dla danej polityki `P` istnieje na ogół cała rodzina `{A₁, …, Aₘ}` dopuszczalnych procedur, lecz traktowanie jednej dopuszczalnej procedury `Aᵢ` tak, jakby *była* polityką, zwija przestrzeń optymalizacji do jednej zamkniętej ścieżki — *tunelu*. Cykl dowodzi, że ta konflacja wytwarza dwa sprzężone skutki: (i) **mierzalny koszt ekonomiczny** (siedmiowymiarowa luka utraconych korzyści `ΔC_total`) oraz (ii) **patologię zarządczą** — *teatr zgodności*, w którym proceduralna konformność staje się osobistą tarczą ryzyka wypierającą poszukiwanie wartości.

Kluczowa, oryginalna **inwersja** dyscyplinująca cały cykl pochodzi z ekonomii zamówień publicznych: to **dyskrecja, nie formalność, jest motorem kosztu cenowo-selekcyjnego**. Dyskrecja podnosi ceny (efekt strukturalny rzędu ~6%) i prowadzi do wyboru istotnie mniej produktywnych wykonawców (Szucs, 2024); to właśnie konkurencyjne udzielanie zamówień *zapobiega* premii faworytyzmu. Problem jest zatem **symetryczny i warunkowy**, a nie ideologicznym sprzeciwem wobec procedury. Sztywność niesie realne koszty (zwłoka, utracone oszczędności TCO, ekspozycja na renegocjacje, ryzyko obejścia), lecz dyskrecja niesie własne — toteż właściwa reforma brzmi: „wymagaj konkurencyjnej walidacji, nie nakazując jednego sztywnego *formatu* konkurencji".

### 1.2 Po co etap empiryczny i dlaczego dane wtórne najpierw

Artykuł 1 cyklu (konceptualno-formalna podstawa i szew interdyscyplinarny; Mamcarz, w przygotowaniu-a) sformalizował notację `P / A / ∂Φ`, model Tunel/Pole oraz pojęciową dekompozycję `ΔC_total = Σᵢ ΔCᵢ` wraz z teorią błędu egzekwowania. Artykuł 2 cyklu (kotwica dyscypliny *ekonomia i finanse*; Mamcarz, w przygotowaniu-b) wyprowadził zamkniętą postać modelu i taksonomię proweniencji parametrów (klasy A/B/C), wykonał deterministyczne przeliczenie na realnym kodzie dla dziewięciu scenariuszy referencyjnych, przeprowadził analizę wrażliwości i powiązał ścieżki z artykułami PZP, ujawniając, że **symetria modelu jest kierunkowo zaimplementowana, lecz liczbowo bezczynna netto** (znak `ΔC_total` jest ściśle dodatni w 9/9 scenariuszy). Obydwa artykuły zamykają się rozpoznaniem, że *headline'owe* wielkości (np. ścieżka sztywna 100–400% powyżej ścieżki policy-only) są **estymacjami modelowymi z przedziałami wrażliwości, nie ustaleniami empirycznymi**.

Niniejszy, trzeci artykuł odpowiada na pytanie pozostawione przez tamten wynik: **gdzie sztywność naprawdę kosztuje — i czy w realnych danych polskiego rynku ujawnia się symetria, której zamknięty model (z ograniczonym strukturalnie członem faworytyzmu) ujawnić nie potrafi?** To pytanie ma podwójną wagę dla *nauk o polityce i administracji*: dotyka projektowania instytucji (jak ustawa rozkłada nacisk między formę a konkurencyjność), zachowania urzędnika pierwszej linii (Lipsky, 1980) oraz mechanizmów izomorfizmu instytucjonalnego, które utrwalają jeden tryb jako „bezpieczny domyślny" (DiMaggio i Powell, 1983).

Świadomie zaczynamy od **danych wtórnych** z trzech powodów. Po pierwsze, polski rynek zamówień publicznych jest jednym z najlepiej udokumentowanych administracyjnie w UE: TED, BZP i platforma e-Zamówienia rejestrują ogłoszenia o zamówieniu i o jego wyniku, wartości szacunkowe, liczbę ofert, tryb, kody CPV oraz kryteria oceny. Po drugie, infrastruktura DIGIWHIST/opentender.eu udostępnia ustandaryzowane, oczyszczone dane oraz rodzinę wskaźników ryzyka integralności (Fazekas i Kocsis, 2020). Po trzecie — i najważniejsze metodologicznie — dane wtórne pozwalają **preregistrować** projekt: zadeklarować hipotezy, proxy, specyfikacje i przewidywane znaki *zanim* zobaczymy oszacowania, co dyscyplinuje wnioskowanie i chroni przed konfirmacjonizmem, na który narażony jest projekt z silną tezą wyjściową.

### 1.3 Wkład i ostrzeżenie o zakresie

Wkład artykułu jest trojaki: (1) przekłada teoretyczne konstrukty cyklu na **przejrzysty crosswalk konstrukt → proxy** osadzony w polskich rejestrach zamówieniowych; (2) precyzuje **granicę testowalności** danych wtórnych (4 z 7 wymiarów), jawnie wyłączając TCO i obejścia oraz wskazując, które wymiary domyka dopiero etap pierwotny; (3) projektuje **strategię identyfikacji opartą na nieciągłościach progowych i reformach**, w której test gęstości McCrary'ego/Cattaneo staje się *substantywnym wynikiem* (sygnaturą obejścia przez sztuczny podział zamówienia), a nie tylko diagnostyką.

Ostrzeżenie o zakresie jest wiążące i powtórzone w ramce „Zakres twierdzeń" na końcu. **Nie raportujemy żadnych wyników regresji ani efektów przyczynowych.** Statystyki opisowe pochodzą z opublikowanych źródeł zagregowanych i są cytowane jako takie. Estymacje modelu (Artykuły 1–2) pozostają estymacjami. Symetria jest ujawniana, nie sprzedawana jako ustalenie.

---

## 2. Rama teoretyczna i hipotezy

### 2.1 Notacja kanoniczna (za Artykułami 1–2)

Przyjmujemy notację kanoniczną cyklu bez zmian.

**Polityka (granica):** `P = {r₁, …, rₙ}` — zbiór reguł definiujących progi uprawnień, wymogi konkurencyjne, standardy dokumentacji i ograniczenia etyczne, które każde działanie zakupowe musi spełnić.

**Procedura (jedna ścieżka):** `A = (a₁, …, aₖ)` — konkretna *uporządkowana* sekwencja działań stanowiąca jedną wystarczającą metodę spełnienia polityki `P`. Dla danej `P` istnieje na ogół rodzina `{A₁, …, Aₘ}` ważnych procedur.

**Zbiór graniczny (kanonicznie):** `∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}`. Φ ⊂ ℝⁿ jest ograniczoną przestrzenią działań dopuszczalnych przez politykę; ∂Φ jest jej granicą. Zgodność w modelu pola jest **ciągła** (oceniana w każdym punkcie ruchu), a nie momentalnym stanem checkpointu.

**Metafora tunelu i pola.** W *tunelu* człowiek jest *wykonawcą kroków*, a zgodność jest binarna; pod presją aktor staje przed wyborem „wepchnąć rzeczywistość w tunel albo z niego wyjść", a wyjście jest *obejściem* (*bypass*). W *polu* człowiek jest *nawigatorem* maksymalizującym wartość pod warunkiem pozostania wewnątrz ∂Φ; gdy liczba zgodnych ścieżek → ∞, bodziec do obejścia → 0, bo nie ma czego obchodzić. Hasło kanoniczne: **„Tunel ma ściany. Pole ma horyzont."**

**Siedem wymiarów kosztu** (ścieżka sztywna R vs. ścieżka elastyczna/policy F; każde `ΔCᵢ = koszt(R) − koszt(F)`):

1. **Czas** (`C_time`) — czas personelu zakupowego pochłonięty przez wykonanie.
2. **Administracja** (`C_admin`) — stały narzut infrastruktury zgodności.
3. **Koszt utraconych korzyści** (`C_opp`) — koszt zwłoki we wdrożeniu, obciążający **obie** ścieżki przez ich własny czas trwania.
4. **Faworytyzm / jakość selekcji** (`C_fav`) — oczekiwana utrata wartości z **dyskrecji** w wyborze, ponoszona głównie przez ścieżkę elastyczną. `C_fav = V × δ × (1 − ρ) × κ`, gdzie δ = 0,06 (premia faworytyzmu z dyskrecji), ρ = indeks sztywności procesu, κ = kontekstowe ryzyko korupcyjne. **To wymiar, który czyni model symetrycznym.**
5. **Renegocjacje** (`C_reneg`) — oczekiwany koszt renegocjacji *kojarzony ze* sztywnością; `P_R = P_base + Δp_rigidity × ρ_R`, `P_base ≈ 0,22`, `Δp_rigidity ∈ [0,077; 0,105]` (model używa dolnej granicy skalowanej przez ρ).
6. **TCO** (`C_TCO`) — utracone oszczędności całkowitego kosztu posiadania, **zdyskontowane** (d = 0,05) i **ograniczone** do 30% wartości kontraktu.
7. **Obejście** (`C_bypass`) — oczekiwany koszt audytu/kary za nieformalne obejście; sigmoida z pułapem.

**Różniczka całkowita:** `ΔC_total = Σᵢ ΔCᵢ`. `ΔC_total > 0` oznacza, że ścieżka sztywna kosztuje więcej. Wymiary faworytyzmu i obejścia mogą biec *przeciw* ścieżce elastycznej, więc `ΔC_total` jest *strukturalnie zdolna* do bycia ujemną — ale (Artykuł 2) w przeliczeniu modelu nigdy netto nie jest.

### 2.2 Od modelu do PZP: dwie osie, nie jedna

Przeniesienie modelu na grunt PZP wymaga jednego doprecyzowania, które organizuje cały projekt empiryczny. W modelu „sztywność" jest pojedynczym indeksem ρ. W realiach PZP rozszczepia się ona na **dwie odrębne osie**, które dane wtórne pozwalają zmierzyć osobno:

- **Oś A — sztywność proceduralna (forma).** Długość i przymusowość sekwencji: tryb i pasmo progowe. Przetarg nieograniczony powyżej progów unijnych (art. 132 PZP) z 35-dniowym minimum publikacji (art. 138 ust. 1) i okresem standstill 10/15 dni (art. 264 ust. 1) leży na sztywnym końcu; tryb podstawowy poniżej progów (art. 275) z minimum składania ofert 7/14 dni (art. 283) — pośrodku; zamówienie z wolnej ręki (art. 214 ust. 1) — na końcu dyskrecjonalnym. Oś A napędza koszty *czasu, utraconych korzyści i renegocjacji*.
- **Oś B — efektywna konkurencja (wynik).** Liczba złożonych ofert; jednoofertowość; wskaźniki ryzyka integralności. To **dyskrecja w wyniku** — formalnie konkurencyjny przetarg, który przyciąga jedną ofertę, jest „dyskrecjonalny w skutkach". Oś B napędza wymiar *faworytyzmu/jakości selekcji* (premia cenowa Szucsa).

Rozszczepienie to jest jednocześnie mechanizmem symetrii. Formalnie sztywny przetarg nieograniczony, który przyciąga realną konkurencję, **odwraca** premię faworytyzmu (oszczędza na cenie i selekcji), płacąc za to czasem; dyskrecjonalne udzielenie z wolnej ręki oszczędza czas, lecz wystawia na premię cenową. Pytanie, **który efekt dominuje netto i w jakim kontekście (κ, wartość, kategoria CPV)**, jest właśnie pytaniem o symetrię — i jest empiryczne. Co istotne, etap empiryczny **mierzy** premię cenową bezpośrednio (proxy cena/wartość szacunkowa), zamiast importować ją jako strukturalnie ograniczony człon modelu; dlatego symetria, liczbowo bezczynna w zamkniętym modelu (Artykuł 2), staje się tu po raz pierwszy **falsyfikowalna**.

### 2.3 Hipotezy H1–H4

Hipotezy przyjmujemy w wiążącym brzmieniu cyklu. Są to **twierdzenia kierunkowe do przetestowania**, a nie założone wyniki; projekt musi umieć wykryć przypadek, w którym luka zanika lub się odwraca.

- **H1 (warunkowa luka kosztowa).** W kontekstach wysokowartościowych, o wysokim ryzyku korupcyjnym, strategicznych (**Direct × Upstream**), organizacje stosujące bardziej sztywne procedury doświadczają istotnie wyższych całkowitych kosztów utraconych korzyści (`ΔC_total`) niż podejścia elastyczne (policy) w porównywalnych kontekstach. Ilustracyjny zakres modelu **100–400%** jest *wielkością do przetestowania*, nie potwierdzonym efektem; **H1 jawnie dopuszcza zanik lub odwrócenie luki w kontekstach operacyjnych o niskim ryzyku korupcyjnym.**
- **H2 (Direct > Indirect).** Luka kosztowa jest istotnie większa dla wydatków **Direct** (bezpośrednich/produkcyjnych) niż **Indirect** (pośrednich).
- **H3 (Upstream > Downstream).** Sztywność w działaniach **Upstream** (strategicznych, wczesnych) generuje wyższe ryzyko obejścia i utraconą wartość strategiczną niż równoważna sztywność w wykonaniu **Downstream**.
- **H4 (obejście jako mediator).** Istotna część kosztu utraconych korzyści wynika z nieformalnego **obejścia**, a nie z bezpośrednich kosztów zgodności (obejście pośredniczy w relacji sztywność → koszt).

---

### 2.4 Patologia zarządcza: dlaczego niska konkurencja przeżywa formalną zgodność

Artykuł kotwiczy dyscyplinę *nauki o polityce i administracji*, dlatego rama hipotez wymaga osadzenia w teorii zachowania administracji, a nie wyłącznie w ekonomii. Pełną syntezę teoretyczną *teatru zgodności* i *błędu egzekwowania* — łączącą biurokrację pierwszej linii (Lipsky, 1980), normalizację dewiacji (Vaughan, 1996), prawo Goodharta (Goodhart, 1975; Strathern, 1997), agencję wielozadaniową (Holmström i Milgrom, 1991), wysokomodernistyczną legibilność (Scott, 1998), izomorfizm instytucjonalny (DiMaggio i Powell, 1983) oraz lęk przed dyskrecją (Kelman, 1990) w jedną tezę, że „uszczelnianie tunelu" jest analitycznie autodestrukcyjne — przeprowadza Artykuł 1 cyklu (Mamcarz, w przygotowaniu-a). Niniejszy artykuł tej syntezy **nie powtarza**; jego oryginalnym, nieredundantnym wkładem jest jej **operacjonalizacja na gruncie PZP**: rozszczepienie sztywności na oś A (forma proceduralna) i oś B (efektywna konkurencja, §2.2) oraz uczynienie obserwowalnym paradoksu „ponad 90% trybów formalnie konkurencyjnych przy 54% jednoofertowości". Statystyki opisowe sekcji 7 ujawniają ten paradoks: rynek niemal całkowicie zdominowany przez *formalnie konkurencyjne* tryby (ponad 90% przetargu nieograniczonego powyżej progów i trybu podstawowego poniżej) współistnieje z *efektywnie monopolistycznym* wynikiem (54% jednoofertowości powyżej progów). Cztery mechanizmy z syntezy Artykułu 1 — zastosowane poniżej do reżimu PZP — wyjaśniają, dlaczego taki stan jest trwały i dlaczego „uszczelnienie tunelu" (więcej formy) go nie usuwa.

Po pierwsze, **biurokracja pierwszej linii** (Lipsky, 1980): urzędnik zamawiający działa pod presją czasu, ryzyka osobistego i niejednoznacznych celów, więc racjonalnie wybiera ścieżkę minimalizującą *zarzucalność proceduralną*, nie ścieżkę maksymalizującą wartość. Wybór trybu o najniższym ryzyku zakwestionowania (sprawdzony przetarg nieograniczony, choćby z jedną realną ofertą) jest adaptacją do reguł, nie ich naruszeniem. Po drugie, **normalizacja dewiacji** (Vaughan, 1996): powtarzalna jednoofertowość, początkowo sygnał alarmowy, z czasem staje się „normalnym" tłem, którego nikt nie problematyzuje — ryzyko kumuluje się niewidocznie. Po trzecie, **prawo Goodharta** (Goodhart, 1975; Strathern, 1997): gdy *wskaźnik zgodności proceduralnej* staje się celem nadzoru (kontrole UZP, audyty środków UE), przestaje być dobrą miarą wartości — instytucje optymalizują pod audytowalną formę, nie pod konkurencyjny wynik. Po czwarte, **izomorfizm instytucjonalny** (DiMaggio i Powell, 1983): zamawiający upodabniają się, przyjmując ten sam „bezpieczny domyślny" tryb dla legitymizacji, nie dla optymalności — co tłumaczy skrajną koncentrację trybów (Tab. 4).

Łącznie mechanizmy te przewidują dokładnie to, co teoria konflacji polityki i procedury (Mamcarz, w przygotowaniu-a) nazywa *teatrem zgodności*: spełnienie formy granicy ∂Φ (procedura konkurencyjna istnieje) bez domknięcia jej treści (realna konkurencja zachodzi). Tę abstrakcyjną diagnozę — rozwiniętą wyczerpująco w Artykule 1 — niniejszy artykuł przekłada na falsyfikowalny program PZP: oś B (efektywna konkurencja) jest obserwowalnym testem, czy formalna zgodność (oś A) przekłada się na treść ∂Φ, czy jedynie ją inscenizuje. To przełożenie, a nie ponowne wyprowadzenie teorii, stanowi właściwy wkład tej sekcji.

## 3. Dane

### 3.1 Źródła

Projekt opiera się na pięciu warstwach danych, w kolejności od najbardziej granularnych do zagregowanych.

**(a) TED (Tenders Electronic Daily).** Pełne, otwarte zrzuty CSV/XML ogłoszeń powyżej progów unijnych dla wszystkich państw członkowskich, w tym Polski (w 2023 r. polscy zamawiający opublikowali 34 485 ogłoszeń o zamówieniu i konkursach w Dz. Urz. UE; UZP, 2024). TED zawiera tryb, wartość, liczbę ofert, kraj wykonawcy, kody CPV i kryteria udzielenia, a od wdrożenia e-formularzy (eForms) — ustrukturyzowane pola wyników.

**(b) BZP (Biuletyn Zamówień Publicznych) i platforma e-Zamówienia.** Ogłoszenia poniżej progów unijnych (w 2023 r. opublikowano 129 808 ogłoszeń o zamówieniach i konkursach oraz 125 670 ogłoszeń o wyniku; UZP, 2024). API platformy e-Zamówienia udostępnia dane postępowań i — od 2021 r., na mocy art. 81 PZP — informacje o liczbie złożonych wniosków i ofert przekazywane Prezesowi UZP, co jest kluczowe dla osi B.

**(c) opentender.eu / DIGIWHIST.** Zharmonizowana, oczyszczona baza zamówień europejskich z rodziną jedenastu wskaźników ryzyka integralności i zagregowanym wskaźnikiem (Fazekas i Kocsis, 2020). Dostarcza gotowych proxy dla κ (kontekstowego ryzyka korupcyjnego), w szczególności jednoofertowości, oraz crosswalku CPV.

**(d) Sprawozdania Prezesa UZP.** Roczne, zagregowane statystyki rynku — wartość, liczba, struktura trybów, konkurencyjność, kryteria, czas trwania, kontrole, odwołania do KIO (UZP, 2024). Stanowią one warstwę walidacyjną i źródło statystyk opisowych w sekcji 7.

**(e) GUS.** Dane makroekonomiczne (PKB) do normalizacji i do osadzenia rynku w gospodarce (szacunek PKB 2023: 3 410,1 mld zł; UZP, 2024, za GUS).

Jednostką analizy w warstwie inferencyjnej jest **postępowanie** (a tam, gdzie dopuszczono oferty częściowe — *część zamówienia*), połączone z rekordem wykonawcy i, jeśli dostępne, z późniejszymi ogłoszeniami o zmianie umowy.

Jakość i łączliwość danych są same w sobie wyzwaniem badawczym. Przejście TED na ustrukturyzowane e-formularze (eForms) poprawiło kompletność pól wyniku, lecz wprowadziło nieciągłość szeregów czasowych względem starszych formularzy standardowych — co należy modelować efektami rocznymi i kontrolami formatu. Wartość szacunkowa bywa raportowana niespójnie (brakująca, zaokrąglona lub zrównana z ceną wygrywającą), co ogranicza moc proxy cena/wartość. Powiązanie ogłoszenia o udzieleniu z późniejszym ogłoszeniem o zmianie umowy (aneksem) nie jest natywnie kluczowane wspólnym identyfikatorem we wszystkich okresach, więc warstwa renegocjacyjna wymaga probabilistycznego dopasowania rekordów (po zamawiającym, wykonawcy, CPV i datach), z jawnym raportowaniem stopy dopasowania. Infrastruktura DIGIWHIST/opentender.eu częściowo te problemy adresuje przez harmonizację i deduplikację, lecz jej pokrycie i reguły czyszczenia są kolejnym założeniem do udokumentowania w preanalizie (Fazekas i Kocsis, 2020). Te ograniczenia nie unieważniają projektu — czynią z *budowy i walidacji połączonego zbioru* odrębny, raportowalny produkt pośredni.

### 3.2 Co dane wtórne mogą, a czego nie mogą testować (4 z 7 wymiarów)

Jest to najważniejsza deklaracja zakresu artykułu. Siedmiowymiarowy model nie jest w całości obserwowalny w rejestrach zamówieniowych; rejestry mierzą *postępowanie i jego wynik*, nie *cykl życia kontraktu ani zachowania nieformalne*. Tabela 1 rozkłada to jawnie.

**Tabela 1. Testowalność siedmiu wymiarów na danych wtórnych.**

| # | Wymiar | Status na danych wtórnych | Obserwowalne proxy / powód wyłączenia |
|---|---|---|---|
| 1 | Czas (`C_time`) | **Testowalny** | Czas trwania postępowania w dniach (BZP/TED); proxy nakładu czasowego. |
| 2 | Administracja (`C_admin`) | **Poza zakresem / częściowo** | Brak pól kosztu narzutu zgodności w rejestrach; możliwe jedynie zgrubne proxy instytucjonalne (np. centralizacja). → etap pierwotny. |
| 3 | Koszt utraconych korzyści (`C_opp`) | **Częściowo testowalny** | *Driver* zwłoki (dni) jest obserwowalny; mnożnik „dziennej wartości bezczynności" nie jest rejestrowany → testujemy wyłącznie driver, nie kwotę. |
| 4 | Faworytyzm / jakość selekcji (`C_fav`) | **Testowalny** | Jednoofertowość, liczba ofert, wskaźnik ryzyka integralności (CRI), iloraz cena/wartość szacunkowa. Najmocniej testowalny wymiar. |
| 5 | Renegocjacje (`C_reneg`) | **Testowalny (warunkowo)** | Ogłoszenia o zmianie umowy / aneksy publikowane w BZP/TED, gdy dają się powiązać z pierwotnym ogłoszeniem. |
| 6 | TCO (`C_TCO`) | **POZA ZAKRESEM** | Brak danych o koszcie cyklu życia / kosztach eksploatacji w rekordach przetargowych. → etap pierwotny. |
| 7 | Obejście (`C_bypass`) | **POZA ZAKRESEM** | Obejście jest z natury nieformalne i niewidoczne w rejestrach; obserwowalna jest *jedynie* pośrednia sygnatura jednej formy — kupkowanie poniżej progów (sekcja 5). Pełny pomiar → etap pierwotny. |

Cztery wymiary testowalne na danych wtórnych to zatem **czas, koszt utraconych korzyści (driver czasowy), faworytyzm/jakość selekcji oraz renegocjacje**. TCO i obejścia są **jawnie poza zakresem** i przekazane do etapu pierwotnego (ankieta z walidowanymi skalami + studia przypadku z forensyczną analizą zamówień vs. komunikacji). To wyłączenie nie jest słabością projektu, lecz warunkiem jego uczciwości: pomiar TCO i obejść wymaga danych, których administracyjny ślad zamówieniowy nie zawiera, a ich „doszacowanie" z rejestrów byłoby fabrykacją.

---

## 4. Operacjonalizacja: od konstruktu do proxy

Tabela 2 jest rdzeniem aplikacyjnym artykułu: wiąże każdy konstrukt teoretyczny cyklu z konkretnym, obserwowalnym wskaźnikiem w polskich rejestrach oraz wskazuje jego oś (A — forma; B — konkurencja).

**Tabela 2. Crosswalk konstrukt → proxy.**

| Konstrukt (model) | Oś | Proxy obserwowalne | Źródło | Uwagi pomiarowe |
|---|---|---|---|---|
| Sztywność proceduralna (ρ) | A | Tryb (przetarg nieograniczony / ograniczony / dialog / tryb podstawowy / wolna ręka) oraz pasmo progowe (poniżej 130 tys.; 130 tys.–próg UE; ≥ próg UE) | TED, BZP, UZP | Tryb i pasmo progowe są wzajemnie powiązane; pasmo wchwytamy progami z M.P. 2025 poz. 1247. |
| Konkurencja (∂Φ: konkurencja) | B | Liczba złożonych ofert; wskaźnik jednoofertowości (1 oferta = 1/0) | BZP, TED, e-Zamówienia (art. 81 PZP) | Wyłączyć tryby bez ofert (wolna ręka) z liczników ofert, ujmując je osobno jako stan dyskrecji. |
| Faworytyzm / κ | B | Wskaźnik ryzyka integralności (CRI) i jego komponenty; jednoofertowość jako najmocniejszy pojedynczy sygnał | opentender.eu/DIGIWHIST (Fazekas i Kocsis, 2020) | CRI używamy do *kategoryzacji kontekstu* (wysokie/niskie κ), nie jako zmiennej wynikowej. |
| Premia cenowa dyskrecji (δ) | B | Iloraz: cena oferty wygrywającej / wartość szacunkowa zamówienia | BZP/TED (pola wartości) | Wymaga ostrożności: wartość szacunkowa bywa zaokrąglana/manipulowana (zob. RDD, sekcja 5). |
| Zwłoka / driver kosztu utraconych korzyści | A | Czas trwania postępowania (dni od ogłoszenia do udzielenia) | BZP/TED, UZP | Driver, nie kwota; nie obejmuje czasu realizacji kontraktu. |
| Renegocjacja | A | Wystąpienie i wartość ogłoszenia o zmianie umowy (aneks) | BZP/TED | Powiązanie aneks→pierwotne ogłoszenie jest warunkiem wykonalności; pokrycie niepełne. |
| Direct / Indirect | — | Crosswalk CPV → kategoria spend (np. roboty budowlane i specjalistyczne dostawy produkcyjne = Direct; usługi biurowe/administracyjne = Indirect) | CPV (TED/BZP) | Mapowanie wzorowane na segmentacji Kraljica (1983); rejestrowane w preanalizie. |
| Upstream / Downstream | — | Crosswalk CPV → faza (projektowanie/specyfikacja/inwestycja = Upstream; powtarzalne dostawy/zakupy katalogowe = Downstream) | CPV (TED/BZP) | Mapowanie heurystyczne; do walidacji ekspercką klasyfikacją. |
| Obejście (sygnatura) | — | Nadmiarowa masa rozkładu wartości szacunkowej tuż poniżej progów (130 tys./UE) | BZP/TED | Tylko jedna forma obejścia (sztuczny podział); zob. test gęstości w sekcji 5. |

Mapowania CPV (Direct/Indirect, Upstream/Downstream) są **wstępnie rejestrowane** jako załącznik kodowy przed estymacją; ich konstrukcja, oparta kierunkowo na segmentacji Kraljica (1983), jest *założeniem operacyjnym*, nie pomiarem, i podlega walidacji w drugiej, ekspercko-kodowanej rundzie. Iloraz cena/wartość szacunkowa wymaga szczególnej ostrożności: ponieważ wartość szacunkowa wyznacza pasmo proceduralne, jest ona endogeniczna względem strategii unikania progu (sekcja 5), co czyni RDD nie tylko strategią identyfikacji, lecz i diagnostyką samego proxy.

---

## 5. Strategia identyfikacji

Cała sekcja formułuje **asocjacje** możliwe do oszacowania na danych wtórnych. Żaden z opisanych projektów nie jest tu wykonany; opisujemy *plan* wraz z założeniami identyfikacyjnymi i ich znanymi słabościami. Wnioskowanie przyczynowe pozostaje warunkowe wobec spełnienia tych założeń i wobec pozyskania mikrodanych.

### 5.1 Regresja nieciągłości przy progach (RDD)

PZP tworzy ostre, instytucjonalnie narzucone **progi**, które zmieniają wymagany reżim proceduralny: próg krajowy **130 000 zł** (art. 2 ust. 1 pkt 1) oraz progi unijne na lata 2026–2027 (M.P. 2025 poz. 1247; 1 EUR = 4,31 zł): dostawy/usługi samorządowe **930 960 zł** (216 000 EUR), dostawy/usługi centralne **603 400 zł**, roboty budowlane **23 291 240 zł** (5 404 000 EUR). Wokół tych progów reżim formy (oś A) zmienia się skokowo, podczas gdy „prawdziwe" cechy zamówienia zmieniają się gładko. To klasyczna konfiguracja **sharp RDD**: porównujemy postępowania tuż poniżej i tuż powyżej progu, traktując pasmo proceduralne jako quasi-losowo przypisane w wąskim oknie wartości szacunkowej.

Specyfikacja bazowa (przykładowo dla progu krajowego `c = 130 000`):

```
Y_i = α + τ · D_i + f(V_i − c) + D_i · g(V_i − c) + Xᵢ′β + εᵢ,
gdzie D_i = 1[V_i ≥ c],
```

`Y_i` — wynik (liczba ofert, jednoofertowość, czas trwania, iloraz cena/wartość); `V_i` — wartość szacunkowa; `f, g` — wielomiany lokalne (preferowana estymacja lokalnie-liniowa z optymalną szerokością pasma); `Xᵢ` — kontrole (CPV, typ zamawiającego, rok). `τ` jest **lokalnym efektem przy progu**, interpretowanym jako asocjacja przypisywana zmianie reżimu, nie jako globalny efekt sztywności.

### 5.2 Test gęstości jako wynik (McCrary / Cattaneo), donut-RDD

Standardowo test gęstości McCrary'ego (2008) lub estymator gęstości Cattaneo, Jansson i Ma (2020) służy jako **diagnostyka** ważności RDD (brak manipulacji zmienną przypisującą). W tym projekcie odwracamy jego rolę: **nieciągłość gęstości tuż poniżej progu jest substantywnym wynikiem** — obserwowalną sygnaturą *kupkowania* (*bunching*), tj. sztucznego ustalania wartości szacunkowej poniżej 130 tys. (lub progu UE), by uniknąć surowszego reżimu. Taka nadmiarowa masa jest jedną z form obejścia w sensie modelu (wyjście z tunelu przez zaniżenie/dzielenie zamówienia, sprzeczne z zakazem dzielenia w celu uniknięcia stosowania ustawy) i bezpośrednio zasila częściowy test H4 (sekcja 6.4).

Ponieważ kupkowanie *psuje* zwykłe RDD (zmienna przypisująca jest manipulowana), stosujemy **donut-RDD**: usuwamy wąskie okno wokół progu (np. ±2–5%), gdzie koncentruje się manipulacja, i estymujemy `τ` na danych „obwarzankowych", raportując wrażliwość na promień obwarzanka. Tym samym ten sam zjawisko — kupkowanie — jest *wynikiem* (H4) w teście gęstości i *zagrożeniem* (kontrolowanym przez donut) w teście efektu reżimu (H1).

### 5.3 Wysokowymiarowe efekty stałe

Dla pytań nieprogowych (porównania trybów i kategorii w całej dystrybucji wartości) stosujemy model z **wysokowymiarowymi efektami stałymi**:

```
Y_{i} = γ · RIGID_{i} + θ · (RIGID_{i} × κ_{c}) + μ_{CPV} + ν_{zamawiający} + λ_{rok} + Xᵢ′β + εᵢ,
```

gdzie `RIGID` jest proxy osi A, `κ_c` — kontekst ryzyka (z CRI), a `μ × ν × λ` — efekty stałe **CPV × zamawiający × rok**. Identyfikacja opiera się tu na *wewnątrzzamawiającej, wewnątrzkategorialnej* zmienności w czasie, co absorbuje stałe różnice między urzędami i kategoriami. Pozostaje endogeniczność wyboru trybu (gorsze procesy w gorszych organizacjach), którą sygnalizujemy jako ograniczenie i kandydujący instrument (ograniczenia systemów legacy) — do zbadania na etapie pierwotnym.

### 5.4 Różnica w różnicach: reforma PZP 2021 i wyłączenia covidowe

Dwa quasi-eksperymenty oferują zmienność reżimu w czasie:

- **Reforma PZP 2021.** Wejście w życie nowej ustawy *Prawo zamówień publicznych* z 11 września 2019 r. z dniem 1 stycznia 2021 r. wprowadziło m.in. tryb podstawowy (art. 275) poniżej progów i obowiązek stosowania kryteriów pozacenowych przez jednostki sektora finansów publicznych. DiD porównuje kategorie/zamawiających silniej vs. słabiej dotkniętych reformą, przed i po, na wynikach konkurencyjności i czasu.
- **Wyłączenia covidowe.** Ustawa z 2 marca 2020 r. (specustawa COVID-19) czasowo *wyłączyła* stosowanie PZP dla określonych zakupów związanych z pandemią — egzogeniczna relaksacja procedury. DiD porównuje kategorie objęte vs. nieobjęte wyłączeniem, dostarczając rzadkiego naturalnego eksperymentu „mniej procedury", w którym można obserwować, czy poluzowanie formy przełożyło się na szybsze udzielanie kosztem konkurencyjności (premia dyskrecji).

Założenie równoległych trendów jest tu **load-bearing** i jawnie deklarowane jako do przetestowania (trendy przedreformowe, testy placebo). Wszystkie szacunki DiD interpretujemy jako **asocjacje warunkowe**, ze świadomością, że pandemia zmieniła równocześnie popyt, podaż i ceny — co osłabia wykluczalność.

---

## 6. Specyfikacje pod H1–H4 z przewidywanymi znakami

Poniżej deklarujemy **przewidywane znaki** zgodnie z ramą cyklu *przed* estymacją (preregistracja kierunku). Tabela 3 zestawia je w jednym miejscu; tekst poniżej dookreśla konstrukcję i test symetrii.

**Tabela 3. Przewidywane znaki (kierunek, nie wielkość).**

| Hipoteza | Wynik (proxy) | Kluczowy regresor | Przewidywany znak | Uzasadnienie z literatury |
|---|---|---|---|---|
| H1a | Czas trwania (dni) | Sztywność proceduralna (oś A, ≥próg UE) | **+** | Dłuższe minima ustawowe (art. 138, 264) → dłuższe postępowania. |
| H1b | Iloraz cena/wartość szacunkowa | Dyskrecja/niska konkurencja (oś B: jednoofertowość, wolna ręka) | **+** | Dyskrecja podnosi cenę ~6% (Szucs, 2024). |
| H1c (netto) | Złożony koszt (proxy) w Direct×Upstream, wysokie κ | Sztywna-konkurencyjna vs. elastyczna-dyskrecjonalna | **niejednoznaczny / symetria** | Konkurencja zapobiega premii faworytyzmu (Szucs, 2024); sztywność dokłada czas/renegocjacje (Beuve i in., 2023). |
| H2 | Wrażliwość wyniku na konkurencję | Direct (vs. Indirect; crosswalk CPV) | **większa dla Direct** | Wyższa stawka wartości i specyfiki w Direct (Kraljic, 1983). |
| H3 | Sygnatura obejścia + utracona wartość | Upstream (vs. Downstream) | **większa dla Upstream** | Sztywność wczesna ma wyższy koszt opcji niż wykonanie. |
| H4 | Nadmiarowa masa poniżej progów (gęstość) | Bliskość progu 130 tys./UE | **+** (skok gęstości) | Kupkowanie jako sygnatura unikania reżimu. |

### 6.1 H1 — warunkowa luka i test symetrii

H1 rozkładamy na trzy estymowalne komponenty. **H1a** (oś A → czas): bardziej sztywny reżim wydłuża postępowanie; przewidywany znak dodatni jest spójny z ustawowymi minimami (35 dni publikacji, art. 138; standstill 10/15 dni, art. 264) i z opisowymi 90 vs. 40 dniami (sekcja 7). **H1b** (oś B → cena): niższa efektywna konkurencja (jednoofertowość, wolna ręka) podnosi iloraz cena/wartość; znak dodatni operacjonalizuje premię dyskrecji Szucsa (2024).

**H1c jest właściwym testem symetrii.** Pytanie nie brzmi „czy sztywność jest zła", lecz: *czy w kontekstach wysokiego κ, wysokiej wartości i strategicznych (Direct × Upstream) ścieżka sztywna-ale-konkurencyjna (przetarg nieograniczony przyciągający wiele ofert) wygrywa netto* — bo oszczędność cenowo-selekcyjna z uniknięcia faworytyzmu przeważa nad dopłatą czasową — *a w kategoriach operacyjnych o niskim κ wygrywa ścieżka elastyczna*, bo dominuje szybkość. Przewidywany znak H1c jest **celowo niejednoznaczny**: projekt jest skonstruowany tak, by *wykryć przecięcie*, a nie potwierdzić monotoniczną przewagę elastyczności. Jest to istotne odejście od zamkniętego modelu (Artykuł 2), gdzie człon faworytyzmu jest strukturalnie ograniczony (jego magnituda `|ΔC_fav| = CV · 0,06 · κ · (ρ_R − ρ_F) ≤ ~4,8% CV` nawet przy pzp_eu i κ = 1,0) i nie potrafi przeważyć kar TCO/utraconych korzyści, przez co `ΔC_total > 0` w 9/9 scenariuszy. Na mikrodanych premia cenowa jest **mierzona bezpośrednio**, nie ograniczana z góry — dlatego dopiero tu symetria może się ujawnić (lub nie) jako efekt netto. Uczciwie deklarujemy obie możliwości jako dopuszczalne wyniki.

### 6.2 H2 — Direct > Indirect

Specyfikacja interakcyjna: `Y = … + θ₁ · KONKURENCJA + θ₂ · (KONKURENCJA × DIRECT) + …`, z efektami stałymi jak w 5.3. Przewidywanie: `θ₂` istotnie zwiększa wrażliwość wyniku (cena, jakość selekcji) na konkurencję w kategoriach Direct względem Indirect, ponieważ stawka wartości i specyfika techniczna są wyższe (segmentacja Kraljica, 1983). Mapowanie Direct/Indirect z CPV jest rejestrowane wstępnie.

### 6.3 H3 — Upstream > Downstream

Analogiczna interakcja z `UPSTREAM`. Przewidywanie: sztywność w fazach Upstream (projektowanie, specyfikacja, inwestycja kapitałowa) wiąże się z silniejszą sygnaturą obejścia i większą utraconą wartością niż w Downstream (powtarzalne dostawy, zakupy katalogowe), gdzie standaryzacja czyni sztywność tańszą. To bezpośrednie przełożenie segmentacji upstream/downstream cyklu na obserwowalne kategorie CPV.

### 6.4 H4 — obejście: tylko sygnatura, pełna mediacja → etap pierwotny

Na danych wtórnych H4 jest testowalna **jedynie częściowo**. Obserwowalna jest sygnatura jednej formy obejścia — kupkowanie poniżej progów (test gęstości, 5.2) — i jej zależność od kontekstu (większa w Upstream/Direct, H3). Natomiast **pełny test mediacyjny** („jaka część kosztu utraconych korzyści przechodzi przez obejście") wymaga pomiaru obejścia nieformalnego (np. zakupów de facto dokonanych poza procedurą, maverick spend), niewidocznego w rejestrach. Dlatego H4 jest jawnie **przeniesiona do etapu pierwotnego** (forensyczna analiza zamówień vs. komunikacji; walidowane skale), a tutaj raportujemy wyłącznie sygnaturę progową jako wynik cząstkowy.

---

## 7. Statystyki opisowe i oczekiwania

Sekcja prezentuje **opublikowane statystyki zagregowane** ustanawiające kontekst empiryczny. Liczby pochodzą ze Sprawozdania Prezesa UZP za 2023 r. (UZP, 2024), Single Market and Competitiveness Scoreboard (Komisja Europejska, 2024) oraz literatury opartej na opentender.eu/DIGIWHIST (Fazekas i Kocsis, 2020). **Nie są to wyniki modelu ani efekty przyczynowe** — to deskryptywne tło, które motywuje hipotezy i kalibruje oczekiwania co do znaków. Wszystkie przytoczone agregaty zweryfikowano bezpośrednio względem dokumentów pierwotnych — części „Najważniejsze dane" oraz tablic szczegółowych Sprawozdania UZP za 2023 r. (Tab. 9–18) i karty Polski w Scoreboard (czerwiec 2026) — a odsyłacze do konkretnych tablic podano przy poszczególnych liczbach; żadnej liczby nie przytoczono bez potwierdzenia w źródle pierwotnym.

### 7.1 Skala i struktura rynku

W 2023 r. wartość zamówień udzielonych zgodnie z PZP wyniosła **279,8 mld zł** (2022: 274,8 mld zł), tj. ok. **8,20% PKB**; udzielono ok. **157 500 zamówień** (2022: ~143 800). Wartość całego rynku zamówień publicznych — z procedurami PZP i z wyłączeniami ustawowymi — wyniosła ok. **579,7 mld zł** (UZP, 2024). W paśmie od progu krajowego 130 tys. zł do progów unijnych udzielono zamówień o wartości ok. **73,6 mld zł**, a powyżej progów unijnych ok. **206,2 mld zł**. Struktura przedmiotowa: roboty budowlane 33%, dostawy 39%, usługi 28% wartości (UZP, 2024).

**Tabela 4. Struktura trybów (udział postępowań, 2023).**

| Pasmo | Tryb dominujący | Udział | Tryb dyskrecjonalny | Udział |
|---|---|---|---|---|
| Poniżej progów UE | Tryb podstawowy (art. 275) | ponad 90% | Zamówienie z wolnej ręki (art. 214) | nieco ponad 9% |
| Równe/powyżej progów UE | Przetarg nieograniczony (art. 132) | ponad 90% | Zamówienie z wolnej ręki (art. 214) | nieco ponad 8% |

*Źródło: UZP (2024).* Polski rynek jest zatem zdominowany przez **formalnie konkurencyjne** tryby (oś A: sztywna forma), przy marginalnym — choć nietrywialnym wartościowo — udziale wolnej ręki.

### 7.2 Efektywna konkurencja: rdzeń problemu

Mimo dominacji formalnie konkurencyjnych trybów, **efektywna konkurencja (oś B) jest niska**. Średnia liczba ofert wyniosła **2,64** poniżej progów unijnych i **2,12** powyżej (UZP, 2024, Tab. 13–17). Co istotniejsze, odsetek postępowań z **jedną ofertą** wyniósł **38,5%** poniżej progów i **54,0%** powyżej progów unijnych (Tab. 5). W przekroju przedmiotowym jednoofertowość była najwyższa w dostawach (46,9% poniżej / 56,5% powyżej), a najniższa w robotach budowlanych (17,9% / 16,0%) (UZP, 2024, Tab. 15 i 18).

**Tabela 5. Odsetek postępowań według liczby ofert, 2023 (UZP, 2024, Tab. 15 — poniżej progów; Tab. 18 — powyżej progów).**

| Liczba ofert | Poniżej progów UE (ogółem) | Powyżej progów UE (ogółem) |
|---|---|---|
| 1 | 38,50% | 54,03% |
| 2 | 23,43% | 20,09% |
| 3 | 14,94% | 11,54% |
| 4 | 8,92% | 6,50% |
| 5 i więcej | 14,21% | 7,84% |

Obraz ten potwierdzają źródła porównawcze. Według Single Market and Competitiveness Scoreboard wskaźnik jednego oferenta dla Polski wynosi **56%** wobec średniej UE **28%** (Komisja Europejska, 2024) — jeden z najwyższych w Unii. Analizy oparte na opentender.eu lokują Polskę w grupie najwyższego ryzyka, obok Rumunii i Słowenii, gdzie udzielanie bez efektywnej konkurencji bywa raczej normą niż wyjątkiem (Fazekas i Kocsis, 2020). To **centralny fakt opisowy** uzasadniający projekt: sztywno-formalna procedura **nie gwarantuje** konkurencji, a wymiar faworytyzmu/jakości selekcji (oś B) jest w Polsce empirycznie wysoki.

### 7.3 Kryteria, czas, kontrola

Cena jako **jedyne kryterium** wyboru wystąpiła w **23%** postępowań poniżej progów i **42%** powyżej progów unijnych (2022: odpowiednio 20% i 39%; UZP, 2024, Tab. 11), przy średniej wadze kryterium ceny ok. **62%**. Wzrost udziału ceny-jedynego-kryterium powyżej progów (z 39% do 42% r/r) jest sygnałem ostrzegawczym dla jakości selekcji. Przeciętny czas trwania postępowania wyniósł **40 dni** poniżej progów i **90 dni** powyżej (UZP, 2024, Tab. 9–10) — bezpośrednie tło dla H1a (oś A → czas). Scoreboard raportuje dla Polski szybkość decyzji 54 dni (UE: 74), udzielenie najtańszej ofercie 56% (UE: 54) oraz podział na części 47% (UE: 32) (Komisja Europejska, 2024). W 2023 r. wniesiono **3 963 odwołania** do KIO (47% rozstrzygnięto merytorycznie), a Prezes UZP przeprowadził 259 kontroli (UZP, 2024) — wskaźniki sporności i nadzoru, istotne dla *nauk o polityce i administracji*.

### 7.4 Oczekiwania (a nie wyniki)

Powyższe tło prowadzi do następujących **oczekiwań** co do przyszłych oszacowań (formułowanych jako kierunki do testu, nie wyniki): (i) silny dodatni związek sztywności proceduralnej z czasem trwania (H1a) — wyraźnie sugerowany przez 90 vs. 40 dni; (ii) dodatni związek jednoofertowości/wolnej ręki z ilorazem cena/wartość (H1b) — spójny z Szucsem (2024) i z wysoką polską jednoofertowością; (iii) **otwarty** wynik testu symetrii (H1c) — z możliwością przewagi ścieżki sztywno-konkurencyjnej w segmentach wysokiego κ i Direct×Upstream oraz przewagi elastyczności w operacyjnych Downstream; (iv) wykrywalna nadmiarowa masa poniżej progów (H4-sygnatura). Podkreślamy: są to *oczekiwania kierunkowe*, a wielkości (w tym jakiekolwiek odniesienie do ilustracyjnego pasma 100–400% modelu) pozostają **do zmierzenia**, nie potwierdzone.

---

## 8. Most do etapu pierwotnego i ograniczenia

### 8.1 Co domyka etap pierwotny

Trzy z czterech wymiarów wyłączonych lub częściowych na danych wtórnych domyka etap pierwotny, zaprojektowany jako uzupełnienie (Design A i B w `EMPIRICAL_VALIDATION_PLAN.md`):

- **TCO** — strukturalne warsztaty dekompozycji kosztu cyklu życia z zespołami finansów i zakupów (6–10 organizacji), pozwalające oszacować utracone oszczędności TCO, których rejestry nie zawierają.
- **Obejścia (pełna mediacja, H4)** — forensyczna analiza zamówień vs. rzeczywistej komunikacji oraz poufne wywiady, mierzące maverick spend i nieformalne wyjścia z tunelu; walidowane wieloitemowe skale „sztywności proceduralnej" i „częstości obejścia".
- **Administracja i mnożnik kosztu utraconych korzyści** — ankieta alokacji czasu (per rola, per krok) oraz dane finansowe pozwalające ucielśnić „dzienną wartość bezczynności".

Most metodologiczny jest dwukierunkowy: dane wtórne *dostarczają ram doboru* dla studiów przypadku (np. dobór organizacji wysokiej i niskiej jednoofertowości w tej samej kategorii CPV, by zbliżyć się do porównania *ceteris paribus*), a etap pierwotny *kalibruje proxy* danych wtórnych (np. walidując mapowanie CPV → Direct/Indirect kodowaniem eksperckim).

### 8.2 Ograniczenia

**Identyfikacja.** Wszystkie projekty z sekcji 5 dają **asocjacje**, nie efekty przyczynowe, dopóki nie spełnione są ich założenia (brak manipulacji poza oknem donut; równoległe trendy w DiD; egzogeniczność wyboru trybu po efektach stałych). Wybór trybu jest endogeniczny względem cech organizacji i zamówienia; instrument (ograniczenia systemów legacy) wymaga etapu pierwotnego.

**Pomiar.** Iloraz cena/wartość szacunkowa jest skażony endogenicznością wartości szacunkowej (ta wyznacza pasmo i bywa manipulowana). Powiązanie aneks→ogłoszenie pierwotne ma niepełne pokrycie, co zaniża mierzalność renegocjacji. Jednoofertowość jest proxy konkurencji *zaszumionym* (rynki naturalnie monopolistyczne dają jedną ofertę bez faworytyzmu).

**Zewnętrzna trafność importowanych efektów.** Parametry zaczerpnięte z literatury niosą swoje zastrzeżenia: Szucs (2024) — węgierski RDD sektora publicznego, ~2/3 nieciągłości to selekcja firm; Beuve i in. (2023) — francuskie parkingi, 2SLS/IV (sztywność instrumentowana kontestowalnością polityczną), n ≈ 279; Guasch (2004) — Ameryka Łacińska bez telekomunikacji ≈41,5%; Decarolis (2014) i Coviello i Mariniello (2014) — włoskie roboty budowlane. Transfery na kontekst polski są **benchmarkami, nie pomiarami**.

**Status modelu.** Wyniki modelu (Artykuły 1–2) są estymacjami przy ok. 35–40% parametrów recenzowanych; reszta to założenia kalibrowane/klasy C. Optymalizator ścieżki (Artykuł 2) jest ważoną funkcją scoringową opartą na regułach z 30-przebiegowym testem wrażliwości — **nie uczeniem maszynowym, nie Random Forest** i niewalidowanym na rzeczywistych wynikach. Symetria pozostaje *możliwością strukturalną, liczbowo bezczynną netto* w modelu; etap empiryczny ma ją uczynić falsyfikowalną, nie potwierdzić z góry.

**Prywatne kazusy.** Przykłady sektora prywatnego (Ryanair, Swiss Casinos, Air France, Zara) służyły w cyklu wyłącznie jako ilustracyjna motywacja i **nie są dowodem** w sprawie prawa zamówień publicznych.

### 8.3 Wkład dla nauk o polityce i administracji

Projekt, nawet przed estymacją, formułuje testowalny program dla pytania instytucjonalnego: *czy polski reżim PZP rozkłada nacisk między formę (oś A) a konkurencyjność (oś B) tak, by faktycznie chronić wartość publiczną?* Statystyki opisowe sugerują napięcie — formalna konkurencyjność wysoka, efektywna konkurencja niska — które jest dokładnie tym, co teoria konflacji polityki i procedury przewiduje: *teatr zgodności* spełnia formę ∂Φ (procedura konkurencyjna), nie domykając jej treści (realna konkurencja). Ostateczne rozstrzygnięcie pozostaje jednak warunkowe wobec mikrodanych i etapu pierwotnego.

---

## Zakres twierdzeń (Claims and Non-Claims)

> **Co artykuł twierdzi.** Artykuł przedstawia *rejestrowalny projekt badawczy* (w stylu registered report) przekładający siedmiowymiarowy model kosztu proceduralnego (Artykuły 1–2) na polski rynek zamówień publicznych: formułuje hipotezy H1–H4, operacjonalizuje konstrukty na obserwowalne proxy (TED/BZP/e-Zamówienia/opentender.eu/UZP), wytycza strategię identyfikacji (RDD przy progach 130 tys./UE z testem gęstości jako wynikiem, donut-RDD, wysokowymiarowe FE, DiD na reformie 2021 i wyłączeniach covidowych) oraz raportuje **statystyki opisowe** z opublikowanych źródeł. Wszystkie wyniki ilościowe modelu są **estymacjami modelowymi** wygenerowanymi przy założeniach udokumentowanych w `docs/MODEL_PARAMETERS.md` — nie są zmierzonymi faktami empirycznymi o polskich (ani żadnych innych) zamówieniach. **Żadne wyniki inferencyjne (regresje, efekty przyczynowe) nie są w tym artykule raportowane**; następują po pozyskaniu mikrodanych.
>
> **Czego artykuł NIE twierdzi.**
> 1. Nagłówkowa wielkość (np. ścieżka sztywna 100–400% powyżej ścieżki policy-only) jest **estymacją z przedziałami wrażliwości**, nigdy ustaleniem (finding). Statystyki opisowe sekcji 7 są opublikowanymi agregatami, nie wynikami modelu.
> 2. **Symetria jest liczbowo bezczynna na poziomie netto.** Przeliczenie na realnym kodzie wszystkich 9 scenariuszy referencyjnych (Artykuł 2) daje `ΔC_total > 0` w **9/9** (ściśle dodatnie wszędzie); teza „ścieżka sztywna bywa tańsza netto" obowiązuje **wyłącznie per-wymiar** (faworytyzm subsydiuje ścieżkę sztywną w 8/9 przypadków) i **nigdy netto**, ponieważ człon sprzyjający sztywności jest strukturalnie ograniczony o rząd wielkości poniżej kar TCO i kosztu utraconych korzyści. Symetria to *możliwość strukturalna*, nie zaobserwowane ustalenie netto; etap empiryczny ma uczynić ją falsyfikowalną na mikrodanych, nie potwierdzić.
> 3. Optymalizator ścieżki to **ważona funkcja scoringowa oparta na regułach z 30-przebiegowym testem wrażliwości** — to **NIE** uczenie maszynowe, **NIE** Random Forest i **NIE** jest walidowany na rzeczywistych wynikach zamówień.
> 4. Przypadki sektora prywatnego (Ryanair, Swiss Casinos, Air France, Zara) są **wyłącznie ilustracyjną motywacją**; nie są dowodem w sprawie prawa zamówień publicznych.
> 5. Około **35–40% parametrów modelu jest recenzowanych (peer-reviewed)**; pozostałe to **założenia kalibrowane lub modelowe klasy C** wyrażone jako liczby kardynalne.
> 6. Wszystkie zaimportowane efekty niosą swoje **zastrzeżenia identyfikacyjne i zewnętrznej trafności** (Szucs: węgierski RDD sektora publicznego, ~2/3 selekcja; Beuve: francuskie parkingi, 2SLS/IV; Guasch: Ameryka Łac. bez telekomunikacji; Bajari-Houghton-Tadelis: US Caltrans; Decarolis/Coviello-Mariniello: włoskie roboty budowlane). Transfery na kontekst polski są benchmarkami, nie pomiarami.
> 7. **Specyficzne dla tego artykułu.** Spośród siedmiu wymiarów modelu dane wtórne testują **cztery** (czas; czasowy driver kosztu utraconych korzyści; faworytyzm/jakość selekcji; renegocjacje); **TCO i obejścia są jawnie poza zakresem** danych transakcyjnych i przekazane do etapu pierwotnego. Wszystkie zależności hipotezowane są **asocjacjami z przewidywanymi znakami**, nie zmierzonymi efektami przyczynowymi.

---

## Bibliografia

Bajari, P., Houghton, S., i Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Bajari, P., i Tadelis, S. (2001). Incentives versus transaction costs: A theory of procurement contracts. *RAND Journal of Economics, 32*(3), 387–407. https://doi.org/10.2307/2696361

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Contractual rigidity and political contestability: Revisiting public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab022

Cattaneo, M. D., Jansson, M., i Ma, X. (2020). Simple local polynomial density estimators. *Journal of the American Statistical Association, 115*(531), 1449–1455. https://doi.org/10.1080/01621459.2019.1635480

Coviello, D., i Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

Decarolis, F. (2014). Awarding price, contract performance, and bids screening: Evidence from procurement auctions. *American Economic Journal: Applied Economics, 6*(1), 108–132. https://doi.org/10.1257/app.6.1.108

DiMaggio, P. J., i Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review, 48*(2), 147–160. https://doi.org/10.2307/2095101

Dyrektywa Parlamentu Europejskiego i Rady 2014/24/UE z dnia 26 lutego 2014 r. w sprawie zamówień publicznych, uchylająca dyrektywę 2004/18/WE (Dz. Urz. UE L 94 z 28.03.2014).

Fazekas, M., i Kocsis, G. (2020). Uncovering high-level corruption: Cross-national objective corruption risk indicators using public procurement data. *British Journal of Political Science, 50*(1), 155–164. https://doi.org/10.1017/S0007123417000461

Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics, 1*. Reserve Bank of Australia.

Guasch, J. L. (2004). *Granting and renegotiating infrastructure concessions: Doing it right*. World Bank. https://doi.org/10.1596/0-8213-5792-1

Holmström, B., i Milgrom, P. (1991). Multitask principal–agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24

Kelman, S. (1990). *Procurement and public management: The fear of discretion and the quality of government performance*. AEI Press.

Komisja Europejska. (2024). *Single Market and Competitiveness Scoreboard: Public procurement — Poland*. European Commission. https://single-market-scoreboard.ec.europa.eu/countries/poland_en

Kraljic, P. (1983). Purchasing must become supply management. *Harvard Business Review, 61*(5), 109–117.

Lipsky, M. (1980). *Street-level bureaucracy: Dilemmas of the individual in public services*. Russell Sage Foundation.

Mamcarz, P. (w przygotowaniu-a). *Tunnel or Field: Policy versus Procedure as the Hidden Architecture of Procurement Governance* [Tunel czy pole: polityka a procedura jako ukryta architektura zarządzania zamówieniami; Artykuł 1 cyklu doktorskiego ProcuraCost]. Uczelnia Łazarskiego.

Mamcarz, P. (w przygotowaniu-b). *Ile kosztuje sztywność? Symetryczny, wielowymiarowy model kosztu proceduralnego w zamówieniach* [Artykuł 2 cyklu doktorskiego ProcuraCost]. Uczelnia Łazarskiego.

McCrary, J. (2008). Manipulation of the running variable in the regression discontinuity design: A density test. *Journal of Econometrics, 142*(2), 698–714. https://doi.org/10.1016/j.jeconom.2007.05.005

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w sprawie aktualnych progów unijnych, ich równowartości w złotych, równowartości w złotych kwot wyrażonych w euro oraz średniego kursu złotego w stosunku do euro stanowiącego podstawę przeliczania wartości zamówień publicznych lub konkursów (M.P. 2025 poz. 1247).

Scott, J. C. (1998). *Seeing like a state: How certain schemes to improve the human condition have failed*. Yale University Press.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review, 5*(3), 305–321.

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Urząd Zamówień Publicznych. (2024). *Sprawozdanie Prezesa Urzędu Zamówień Publicznych z funkcjonowania systemu zamówień publicznych w 2023 r.* Urząd Zamówień Publicznych. https://www.gov.pl/web/uzp/sprawozdanie-prezesa-uzp-z-funkcjonowania-systemu-zamowien-publicznych-w-2023-roku

Ustawa z dnia 11 września 2019 r. — Prawo zamówień publicznych (t.j. Dz.U. 2026 poz. 793).

Ustawa z dnia 2 marca 2020 r. o szczególnych rozwiązaniach związanych z zapobieganiem, przeciwdziałaniem i zwalczaniem COVID-19, innych chorób zakaźnych oraz wywołanych nimi sytuacji kryzysowych (Dz.U. 2020 poz. 374, z późn. zm.).

Vaughan, D. (1996). *The Challenger launch decision: Risky technology, culture, and deviance at NASA*. University of Chicago Press.
