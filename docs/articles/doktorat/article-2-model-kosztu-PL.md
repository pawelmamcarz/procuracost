# Ile kosztuje sztywność? Symetryczny, wielowymiarowy model kosztu proceduralnego w zamówieniach

**Paweł Mamcarz**
Uczelnia Łazarskiego w Warszawie

*Artykuł 2 z trzyczęściowego cyklu doktorskiego (art. 187 ust. 3 ustawy z dnia 20 lipca 2018 r., Prawo o szkolnictwie wyższym i nauce). Cykl realizowany interdyscyplinarnie w dziedzinach* ekonomia i finanse *oraz* nauki o polityce i administracji. *Artykuł niniejszy jest kotwicą dyscypliny* ekonomia i finanse *w cyklu: wyprowadza zamkniętą postać siedmiowymiarowego modelu kosztu, taksonomię proweniencji parametrów (klasy A/B/C), deterministyczne przeliczenie dziewięciu scenariuszy i analizę wrażliwości, a następnie wiąże ten obiekt ekonomiczny ze strukturą prawno-proceduralną* Prawa zamówień publicznych. *Wspólną notację, model Tunel/Pole, dekompozycję pojęciową ΔC_total i teorię błędu egzekwowania wprowadza, jako konceptualny szew cyklu, Artykuł 1 (Mamcarz, w przygotowaniu-a); artykuł niniejszy na nich buduje, lecz kwantyfikację modelu przedstawia jako własny wkład.*

---

## Streszczenie

Literatura ekonomii zamówień publicznych dostarcza precyzyjnych, lecz fragmentarycznych estymat pojedynczych kosztów sztywnej procedury: premii cenowej dyskrecji (Szucs, 2024), prawdopodobieństwa renegocjacji rosnącego ze sztywnością kontraktu (Beuve, Moszoro i Spiller, 2023), kosztów adaptacji kontraktu niekompletnego (Bajari, Houghton i Tadelis, 2014), erozji oszczędności cenowych ex post (Decarolis, 2014) oraz wpływu wymogów jawności na opóźnienia (Coviello i Mariniello, 2014). Żadna z tych prac nie integruje wymiarów w jeden, replikowalny rachunek różnicy kosztów. Artykuł proponuje taki model: siedmiowymiarowy, zamknięty rachunek różnicowy ΔC_total = Σ ΔC_i, kontrastujący ścieżkę sztywną (tunel) ze ścieżką ograniczoną wyłącznie polityką (pole) w obrębie tej samej granicy dopuszczalności ∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}. Każdy wymiar opatrzono jawną taksonomią proweniencji parametrów (klasy A/B/C); około 35–40% parametrów wywodzi się z prac recenzowanych, pozostałe są założeniami kalibracyjnymi. Najważniejszy wynik metodologiczny jest negatywny i podany uczciwie: choć model jest *kierunkowo symetryczny* (premia faworytyzmu subsydiuje ścieżkę sztywną), to w kalibracji bazowej znak ΔC_total nie zmienia się w żadnym z dziewięciu scenariuszy referencyjnych (przeliczenie na realnym kodzie). Człon sprzyjający sztywności jest strukturalnie ograniczony (|ΔC_fav| = CV·0,06·κ·(ρ_R − ρ_F) ≤ 0,048·CV, ≈ 4,8% wartości kontraktu) i pozostaje o rząd wielkości mniejszy od kar TCO (do 30% wartości) oraz kosztu utraconych korzyści. Symetria jest zatem *możliwością strukturalną*, nie zaobserwowanym ustaleniem netto. Analiza wrażliwości pokazuje, że odwrócenie znaku wymagałoby premii dyskrecji rzędu 51%, około 8,5-krotności estymaty empirycznej.

**Słowa kluczowe:** koszt alternatywny zamówień; sztywność proceduralna; dyskrecja i faworytyzm; model wielowymiarowy; analiza wrażliwości; niekompletność kontraktu; Prawo zamówień publicznych.

**Klasyfikacja JEL:** D73; H57; L51; D86; H11.

---

## 1. Wstęp

Organizacje, a najdotkliwiej polskie zamawiające jednostki sektora finansów publicznych działające pod reżimem ustawy *Prawo zamówień publicznych* (dalej: PZP), systematycznie mylą **politykę** zamówieniową z **procedurą** zamówieniową. Polityka to zbiór wiążących ograniczeń, który każde nabycie musi spełnić; w notacji kanonicznej cyklu jest to granica zbioru dopuszczalnego, **∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}**. Procedura to natomiast *jedna* uporządkowana ścieżka działań **A = (a₁, …, aₖ)**, która tę granicę przekracza. Dla każdej polityki **P = {r₁, …, rₙ}** istnieje na ogół cała rodzina dopuszczalnych procedur {A₁, …, Aₘ}, lecz organizacja, traktując jedną zinstytucjonalizowaną procedurę Aᵢ tak, jakby *była ona* polityką, redukuje przestrzeń optymalizacyjną do jednego zablokowanego korytarza. Tę konflację, wraz z dwiema jej sprzężonymi konsekwencjami, ekonomiczną (mierzalna luka kosztu alternatywnego) oraz zarządczą (*teatr zgodności*), cykl trzech artykułów formalizuje, kwantyfikuje i poddaje próbie. Artykuł 1 cyklu (Mamcarz, w przygotowaniu-a), konceptualny szew cyklu, wprowadza wspólną notację, dowodzi ekonomicznej istoty konflacji i przedstawia jej dekompozycję pojęciową (ΔC_total jako rama siedmiu wymiarów) wraz z teorią błędu egzekwowania, lecz świadomie nie kwantyfikuje modelu. Niniejszy artykuł, **kotwica dyscypliny *ekonomia i finanse***, podejmuje zadanie komplementarne: na tej dekompozycji **wyprowadza zamkniętą postać siedmiowymiarowego modelu oraz taksonomię proweniencji parametrów jako własny wkład**, a dalej: **wyprowadza analityczny warunek zmiany znaku różnicy kosztów, wykonuje deterministyczne przeliczenie dziewięciu scenariuszy na realnym kodzie, przeprowadza analizę wrażliwości, wiąże ścieżki modelu ze strukturą trybów PZP i, co najważniejsze, uczciwie ujawnia, że w kalibracji bazowej warunek zmiany znaku nie jest spełniony.**

Metafora porządkująca cały cykl brzmi: **„Tunel ma ściany. Pole ma horyzont."** Tunel to zablokowana procedura sekwencyjna, w której człowiek jest *wykonawcą kroków*, a zgodność ma charakter binarny (kolejny krok albo wyjście z tunelu, czyli *obejście*). Pole to swoboda ograniczona wyłącznie polityką, w której człowiek jest *nawigatorem* maksymalizującym wartość pod warunkiem pozostania wewnątrz ∂Φ. Pytanie tytułowe (*ile kosztuje sztywność?*) jest jednak postawione przewrotnie. Najsilniejszy, oryginalny wynik ekonomii zamówień publicznych ostatniej dekady przeczy intuicji, że to *formalizm* jest źródłem kosztu. To **dyskrecja**, a nie formalność, podnosi ceny (o około 6% w estymacie strukturalnej) i selekcjonuje istotnie mniej produktywnych wykonawców (Szucs, 2024); konkurencyjny przetarg jest właśnie tym, co premię faworytyzmu *zażegnuje*. Problem jest zatem **symetryczny i warunkowy**, a nie ideologiczną sprawą przeciw procedurze. Sztywność niesie realne koszty (zwłoka, utracone oszczędności w całkowitym koszcie posiadania, ekspozycja na renegocjacje, ryzyko obejścia), lecz dyskrecja niesie własne; dopiero ich łączny bilans rozstrzyga, która ścieżka jest tańsza w danym kontekście.

Wkład niniejszego artykułu, jako kotwicy dyscypliny *ekonomia i finanse*, jest trojaki i ma charakter *modelowo-obliczeniowy*. Po pierwsze, **specyfikacja i operacjonalizacja modelu**: artykuł, budując na dekompozycji pojęciowej i notacji z Artykułu 1, przedstawia zamkniętą postać siedmiowymiarowego rachunku oraz taksonomię proweniencji parametrów (agregację rozłącznych literatur, aukcje, koncesje infrastrukturalne, roboty drogowe, koszty proceduralne UE, w jeden rachunek różnicowy oraz klasy A/B/C parametrów, z deklaracją, że jedynie ~35–40% z nich ma rodowód recenzowany) i poddaje je deterministycznemu przeliczeniu na realnym kodzie dla dziewięciu scenariuszy referencyjnych, *przy zachowaniu zastrzeżeń identyfikacyjnych każdego importu*. Po drugie, **powiązanie prawno-ekonomiczne**: wiąże obiekt ekonomiczny ΔC_total ze strukturą trybów i ustawowych granic PZP, pokazując, że liczba kosztu i struktura proceduralna są dwoma odczytami tej samej konflacji. Po trzecie, i to jest sedno, **uczciwość co do symetrii**: model jest *zaprojektowany* tak, by mógł orzec, że ścieżka sztywna bywa tańsza, lecz przeliczenie na realnym kodzie pokazuje, że w żadnym z dziewięciu scenariuszy referencyjnych znak ΔC_total się nie odwraca. Ujawniamy to jako *strukturalną bezczynność symetrii*, nie ukrywając jej i nie sprzedając jej jako wyłaniającego się ustalenia.

Wszystkie wyniki ilościowe są **estymacjami modelowymi** przy udokumentowanych założeniach, nie zmierzonymi faktami o polskich (ani jakichkolwiek) zamówieniach. Nagłówkowa wielkość, którą model potrafi wygenerować (ścieżka sztywna o 100–400% droższa od ścieżki opartej wyłącznie na polityce), jest **estymacją z przedziałami wrażliwości**, a nie ustaleniem empirycznym. Tę dyscyplinę interpretacyjną utrzymujemy w całym tekście; domyka ją obowiązkowa ramka „Zakres twierdzeń" przed bibliografią.

Reszta artykułu jest zorganizowana następująco. Rozdział 2 dokonuje przeglądu fragmentarycznych estymat i wykazuje brak zintegrowanego modelu. Rozdział 3 specyfikuje siedem wymiarów w postaci zamkniętej i wprowadza taksonomię proweniencji A/B/C. Rozdział 4 wyprowadza analityczny warunek zmiany znaku i ujawnia jego niespełnienie w bazie. Rozdział 5 przedstawia jednokierunkową analizę wrażliwości dla parametrów wysokiej dźwigni. Rozdział 6 opisuje pakiet replikacyjny i prezentuje deterministyczne przeliczenie dziewięciu scenariuszy. Rozdział 7 dyskutuje, dlaczego członami dominującymi są dyskrecja i niekompletność kontraktu, a nie formalizm. Rozdział 8 zbiera ograniczenia. Całość zamyka ramka twierdzeń i bibliografia w standardzie APA.

---

## 2. Przegląd literatury: precyzyjne fragmenty bez zintegrowanego rachunku

Ekonomia zamówień publicznych jest bogata w przyczynowo zidentyfikowane estymaty *pojedynczych* kanałów kosztowych. Jej cechą charakterystyczną, i luką, którą wypełnia model, jest to, że każda z tych estymat pochodzi z innej populacji, innego planu identyfikacyjnego i innej jednostki analizy, przez co nie składają się one samoistnie w jeden rachunek różnicy kosztów porównywalnego nabycia. Poniżej omawiamy sześć filarów empirycznych oraz zestaw teoretyczny, za każdym razem podając zastrzeżenie identyfikacyjne i zewnętrznej trafności, którego artykuł nie porzuca przy imporcie liczby.

### 2.1 Dyskrecja i faworytyzm: premia cenowa i jakość selekcji (Szucs, 2024)

Najważniejszym pojedynczym wynikiem dla architektury modelu jest praca Szucsa (2024) opublikowana w *Journal of the European Economic Association*. Wykorzystując nieciągłość regresyjną wokół progu reformy 25 mln HUF w węgierskich zamówieniach publicznych oraz strukturalną korektę selekcji, autor szacuje, że **dyskrecja podnosi znormalizowaną cenę o około 6% (estymata strukturalna przyczynowa; postać zredukowana ~8%; surowa nieciągłość ~9%) i prowadzi do wyboru wykonawców o około 10% mniej produktywnych**. Kluczowa dla uczciwości modelu jest dekompozycja: **około 2/3 nieciągłości to sortowanie/selekcja firm**, nie czysty efekt traktowania dyskrecją. Współczynnik 0,06 należy więc czytać jako *górne*, obciążone endogenicznością oszacowanie (zastrzeżenie o manipulacji wartością i bunchingu wokół progu). Wniosek, który model importuje wbrew własnej tezie nagłówkowej, brzmi: **konkurencyjny przetarg zażegnuje premię faworytyzmu**. Trafność zewnętrzna: dane węgierskiego sektora publicznego → kontekst polski/prywatny jest *transferem*, nie zmierzoną wartością polską.

### 2.2 Sztywność kontraktowa i renegocjacje (Beuve, Moszoro i Spiller, 2023; Guasch, 2004)

Drugim filarem jest praca Beuve'a, Moszoro i Spillera (2023, opublikowana w *Journal of Law, Economics, and Organization*; wcześniej NBER WP 28491, 2021). Autorzy szacują, że **wzrost sztywności kontraktowej o jedno odchylenie standardowe podnosi prawdopodobieństwo renegocjacji o 7,7–10,5 punktu procentowego, względem bezwarunkowej bazy 22%**. Identyfikacja jest **2SLS/IV** (sztywność instrumentowana kontestowalnością polityczną; restrykcja wyłączenia jest nośna), *nie* czysto obserwacyjna. Trafność zewnętrzna: sektor francuskich parkingów, pojedyncze otoczenie koncesyjne, próba estymacyjna n ≈ 279, dawka na jedno odchylenie standardowe. Model przyjmuje dolny kraniec premii (0,077) i skaluje go indeksem sztywności ρ. Wynik koroboruje Guasch (2004): **około 30% koncesji w Ameryce Łacińskiej i na Karaibach było renegocjowanych, a wskaźnik rośnie do ≈41,5% po wyłączeniu telekomunikacji** (41,5% to stopa *bez telekomunikacji*, nie stopa łączna). To obserwacja na koncesjach infrastrukturalnych LAC; służy wyłącznie jako koroboracja bazy 22%.

### 2.3 Niekompletność kontraktu i koszty adaptacji (Bajari, Houghton i Tadelis, 2014; Bajari i Tadelis, 2001)

Bajari, Houghton i Tadelis (2014, *American Economic Review*) szacują, że **koszty adaptacji stanowią 7,5–14% wartości kontraktu** (wersja opublikowana; PDF autorski 8–14%; wersje roboczej ~10%) na danych kalifornijskiego Caltrans (roboty drogowe). Mechanizm endogeniczności formy kontraktu, forma wybierana łącznie ze złożonością, pochodzi z Bajari i Tadelis (2001, *RAND Journal of Economics*). Praca ta jest *istotna teoretycznie* dla uzasadnienia wymiaru TCO, ale **nie jest używana jako podstawa liczbowa wymiaru TCO**, ponieważ podwajałaby liczenie z wymiarem renegocjacji (zastrzeżenie podwójnego liczenia). Trafność zewnętrzna: amerykańskie roboty drogowe → kontekst ogólny/UE/PL.

### 2.4 Erozja oszczędności ex post (Decarolis, 2014)

Decarolis (2014, *American Economic Journal: Applied Economics*, „Awarding Price, Contract Performance, and Bids Screening: Evidence from Procurement Auctions") wykazuje, że **co najmniej połowa (≥50%) oszczędności wynikających z niższych cen ofertowych zostaje utracona wskutek renegocjacji ex post**, a screening ofert redukuje początkowe oszczędności o około jedną trzecią. To jest *przesłanka teoretyczna* wymiaru TCO (oszczędność cenowa nie jest oszczędnością realizowaną), zakotwiczona w pracy recenzowanej, w odróżnieniu od *magnitudy* tego wymiaru, która pozostaje założeniem kalibracyjnym. Identyfikacja quasi-eksperymentalna (rozłożone w czasie wprowadzanie aukcji pierwszej ceny; zastrzeżenie o momencie adopcji). Populacja: włoskie roboty publiczne, oferty niewiążące.

### 2.5 Jawność, konkurencja a opóźnienia (Coviello i Mariniello, 2014)

Częstym argumentem przeciw konkurencji jest rzekome wydłużenie czasu. Coviello i Mariniello (2014, *Journal of Public Economics*) pokazują, na ostrym/rozmytym RDD przy progu jawności 500 tys. euro, że **wymogi jawności/konkurencji nie zwiększają (a wręcz redukują o ~7,8 p.p.) prawdopodobieństwa opóźnienia** i nie zwiększają podwykonawstwa; mechanizmem jest *selekcja*, nie konkurencja per se. Model przyjmuje tu postawę konserwatywną: nie importuje ujemnego efektu opóźnienia, lecz traktuje konkurencję jako neutralną czasowo, co czyni jego oszacowanie kosztu zwłoki *zaniżonym* względem tego wyniku. Populacja: niskowartościowe (200–800 tys. euro) włoskie roboty publiczne.

### 2.6 Koszt proceduralny jako odsetek wartości (Komisja Europejska, 2011)

Wreszcie, benchmark instytucjonalny (nie recenzowany, oznaczony jako taki): ewaluacja przygotowana przez PwC, London Economics i Ecorys dla Komisji Europejskiej (2011) szacuje **średni koszt procedury na ~28 tys. euro (75% po stronie dostawców), 5,4 oferenta, 38 dni, 5,26 mld euro agregatu, poniżej 1,3% wartości**. Zastrzeżenie nośne: 28 tys. euro to *całkowity* koszt procedury, nie premia za sztywność, jedynie ~0,4% wartości (~1,68 mld euro) jest przyrostowe względem dyrektywy. Benchmark ten kalibruje rząd wielkości kosztów administracyjnych, nie wymiar sztywności.

### 2.7 Zestaw teoretyczny i benchmark praktyczny TCO

Architekturę zachowań i wag uzupełnia zestaw teoretyczny: wieloproblemowa teoria agencji (Holmström i Milgrom, 1991), w której egzekwowanie zadań mierzalnych wypiera niemierzalne; biurokracja poziomu ulicy (Lipsky, 1980); normalizacja dewiacji (Vaughan, 1996); prawo Goodharta (Goodhart, 1975; Strathern, 1997); legibilność wysokiego modernizmu (Scott, 1998); projektowanie a obejścia użytkownika (Norman, 1988); izomorfizm instytucjonalny (DiMaggio i Powell, 1983); oraz segmentacja Kraljica (1983). Te prace dostarczają *kierunku*, nie liczb. Górne ograniczenie wymiaru TCO (30% w horyzoncie wieloletnim) pochodzi z benchmarku praktycznego Institute for Supply Management (b.d.), pułapu *najlepszego przypadku* bez kontrfaktu, używanego wyłącznie jako górny pułap kumulacyjny κ_TCO = 0,30, *nie* jako płaska stopa empiryczna.

### 2.8 Luka: brak zintegrowanego rachunku różnicowego

Przegląd ujawnia spójny obraz. Każdy z sześciu filarów empirycznych jest precyzyjny we własnej populacji i planie identyfikacyjnym, lecz **żaden nie agreguje wymiarów w jeden rachunek różnicy kosztów** dla porównywalnej decyzji „tunel czy pole". Premia faworytyzmu Szucsa dotyczy ceny zakupu; premia renegocjacyjna Beuve'a, prawdopodobieństwa zdarzenia; koszty adaptacji Bajariego, wykonania kontraktu; erozja Decarolisa, trwałości oszczędności; efekt Coviella–Mariniella, czasu; benchmark KE, kosztu administracyjnego. Tabela 0 zestawia tę fragmentaryczność na czterech osiach, które decydują o (nie)składalności estymat: jednostce analizy, populacji, planie identyfikacyjnym i wymiarze modelu, który dany fragment zasila.

**Tabela 0. Fragmentaryczność literatury: cztery osie nieskładalności.**

| Praca | Jednostka analizy | Populacja | Identyfikacja | Zasila wymiar |
|---|---|---|---|---|
| Szucs (2024) | cena znormalizowana | węgierski sektor publiczny | RDD + korekta selekcji strukturalnej | faworytyzm (δ) |
| Beuve i in. (2023) | zdarzenie renegocjacji | francuskie parkingi | 2SLS/IV (kontestowalność polit.) | renegocjacja (Δp) |
| Guasch (2004) | częstość renegocjacji | koncesje LAC | obserwacyjna (probit) | renegocjacja (baza) |
| BHT (2014) | koszt adaptacji | US Caltrans (drogi) | strukturalna + IV inżyniera | przesłanka TCO |
| Decarolis (2014) | erozja oszczędności | włoskie roboty publ. | quasi-eksperyment (adopcja) | przesłanka TCO |
| Coviello-Mariniello (2014) | opóźnienie | włoskie roboty niskowart. | RDD ostre/rozmyte (€500k) | koszt utr. korzyści |
| KE / PwC (2011) | koszt procedury | UE powyżej progu (EEA-30) | rachunkowość obserwacyjna | administracja |

Cztery różne jednostki analizy, sześć różnych populacji i pięć różnych planów identyfikacyjnych oznaczają, że *nie istnieje* pojedyncza próba, na której można by zmierzyć ΔC_total łącznie. Składanie ich w jeden rachunek wymaga zatem *jawnej* architektury agregacyjnej, która (i) nie podwaja liczenia (stąd reguła: BHT zasila *przesłankę*, nie *magnitudę* TCO, by uniknąć kolizji z wymiarem renegocjacji), (ii) zachowuje zastrzeżenia transferu każdego importu i (iii) jest replikowalna z deterministycznego kodu. Taka agregacja jest z konieczności *modelem*, nie *pomiarem*, i właśnie dlatego jej wyniki muszą być etykietowane jako estymacje. Rozdział 3 dostarcza tej architektury.

---

## 3. Specyfikacja modelu

Specyfikacja w tym rozdziale **przywołuje** model wyprowadzony w Artykule 1 (Mamcarz, w przygotowaniu-a), zamkniętą postać siedmiu wymiarów oraz taksonomię proweniencji parametrów, i czyni to wyłącznie po to, by niniejszy artykuł był samodzielny w lekturze oraz by zakotwiczyć warunek zmiany znaku (rozdział 4) i analizę wrażliwości (rozdział 5). Oryginalny wkład artykułu zaczyna się w rozdziale 4; rozdział 3 nie rości sobie pierwszeństwa wyprowadzenia.

### 3.1 Obiekt porównania i konwencja znaku

Model porównuje dwie ścieżki realizujące tę samą politykę P (tę samą granicę ∂Φ) dla tego samego nabycia:

- **ścieżkę sztywną (tunel) R**: zinstytucjonalizowaną procedurę o wysokim indeksie sztywności ρ_R = ρ_base właściwym typowi procesu;
- **ścieżkę elastyczną (pole) F**: ograniczoną wyłącznie polityką, działającą na poziomie sztywności *policy-level*, lecz nigdy nie sztywniejszą niż proces bazowy: ρ_F = min(ρ_base, ρ_policy), gdzie ρ_policy = 0,15.

Dla każdego wymiaru i definiujemy różnicę **ΔCᵢ = cost_i(R) − cost_i(F)**, a całkowitą różnicę jako sumę:

> **ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_fav + ΔC_reneg + ΔC_TCO + ΔC_bypass = Σᵢ ΔCᵢ.**

Konwencja: **ΔC_total > 0 oznacza, że ścieżka sztywna kosztuje więcej.** Ponieważ wymiary faworytyzmu i obejścia mogą działać *przeciw* ścieżce elastycznej, ΔC_total jest *strukturalnie zdolna* przyjąć wartość ujemną, to właśnie ta zdolność czyni model symetrycznym. Czy zdolność ta realizuje się liczbowo, rozstrzyga rozdział 4.

Wszystkie formuły poniżej odtwarzają warstwę `lib/calculations.ts` (funkcja `calculateCosts`) i `lib/process-templates.ts`. Pełna notacja jest wspólna z Artykułem 1 (Mamcarz, w przygotowaniu-a).

### 3.1a Warstwa danych: szablony kroków, granica ∂Φ i wyprowadzenie dni

Zanim przejdziemy do siedmiu wymiarów, warto opisać warstwę danych, z której rachunek czerpie liczbę dni i obsadę. Każdy z siedmiu typów procesu (`ProcessType`) ma przypisany szablon kroków `ProcessStep[]` rozróżniający dni *sztywne* (z flagami obowiązkowego oczekiwania) od dni *elastycznych* oraz macierz uczestnictwa sześciu ról (`StakeholderRole`) w godzinach na krok. Funkcje wyprowadzające `deriveRigidDays` i `deriveFlexibleDays` przekładają te szablony na czasy trwania ścieżek, mnożąc je przez `timeMultiplier` poziomu technologii oraz kontekstowe mnożniki wymiarowe. Istotne dla uczciwości modelu jest to, że dni *sztywne obowiązkowe* (np. 35-dniowy minimalny okres publikacji w procedurze unijnej, art. 138 ust. 1 PZP) są częścią **granicy polityki ∂Φ**, a nie swobodnym wyborem procedury, pole nie może ich „skrócić", może jedynie nie dokładać dni *ponad* granicę. Stąd ścieżka elastyczna nigdy nie narusza ∂Φ; redukuje wyłącznie nadmiar proceduralny, którego polityka nie wymaga.

Zgodność w modelu pola jest **ciągła**: oceniana w każdym punkcie ruchu wewnątrz Φ ⊂ ℝⁿ, a nie jako momentalny stan w punkcie kontrolnym. To rozróżnienie ma konsekwencję rachunkową: w tunelu zgodność jest binarna (kolejny krok albo wyjście, obejście), więc presja czasowa generuje ryzyko obejścia (wymiar 7); w polu, gdy liczba ścieżek zgodnych rośnie, bodziec do obejścia maleje, bo nie ma czego obchodzić. Indeks sztywności ρ ∈ [0, 1] (`PROCESS_RIGIDITY`) jest skalarną kompresją tej struktury: pzp_eu = 0,95, pzp_krajowy = 0,80, capex = 0,72, private_formal = 0,60, custom = 0,50, catalog_order = 0,20, policy_only = 0,15, mrp_order = 0,12. Ścieżka elastyczna działa zawsze na poziomie ρ_F = min(ρ_base, 0,15), co, przez konstrukcję `Math.min`, gwarantuje, że pole nigdy nie wypada jako *sztywniejsze* niż proces bazowy (naprawia to inwersję typów operacyjnych, w których ρ_base < 0,15).

### 3.2 Wymiar 1, Czas (C_time)

Koszt czasu to wartość pracy zespołu zamówieniowego pochłoniętej przez wykonanie ścieżki. W postaci uproszczonej (fundament cyklu):

> **ΔC_time = (d_R − d_F) · n_buyers · rate_daily,**

gdzie d to liczba dni roboczych ścieżki, n_buyers, liczba zaangażowanych nabywców, rate_daily, w pełni obciążona dzienna stawka. W warstwie kodu czas jest jednak liczony precyzyjniej, z macierzy uczestnictwa ról w krokach: `S = deriveStaffCost(steps, mode, stakeholders) · m_staff`, gdzie m_staff to mnożnik intensywności kadrowej z wymiarów Direct/Indirect × Upstream/Downstream. Zatem **ΔC_time = (S_R − S_F)·m_staff**. W scenariuszach referencyjnych człon ten jest zwykle bliski zeru (uczestnictwo ról w trybie sztywnym i elastycznym różni się umiarkowanie), z wyjątkiem przypadku pzp_eu (≈14 tys. PLN).

### 3.3 Wymiar 2, Administracja (C_admin)

Stały narzut infrastruktury zgodności: koordynacja (łańcuchy e-mail, telefon, ręczne śledzenie) plus zamortyzowana licencja narzędziowa:

> **C_admin = c_coord · d · m_coord + c_tool · u,**

gdzie c_coord = `coordCostPerDay` (zależne od poziomu technologii), m_coord, mnożnik intensywności koordynacji, c_tool = `toolCostPerProcess`, u, stopień wykorzystania narzędzia (u = 1 dla ścieżki sztywnej, u = u_F = 0,3 dla elastycznej, gdyż pole wykorzystuje tylko część platformy). Stąd:

> **ΔC_admin = c_coord · m_coord · (d_R − d_F) + c_tool · (1 − u_F).**

Człon ten jest mały i zawsze dodatni.

### 3.4 Wymiar 3, Koszt utraconych korzyści (C_opp)

Koszt zwłoki wdrożeniowej, *obciążany obu ścieżkom* po ich własnym czasie trwania (brak bazy zerowego tarcia):

> **C_opp = d · κ_inaction · m_delay,**   **ΔC_opp = (d_R − d_F) · κ_inaction · m_delay,**

gdzie κ_inaction = `dailyCostOfInaction` (dzienny koszt niewdrożenia), m_delay, mnożnik opóźnienia. Raportowanie jako różnicy dwóch niezerowych wielkości jest celowe i uczciwe: model nie udaje, że pole jest natychmiastowe. Człon ten jest dominujący w 3 z 7 wartościowo istotnych scenariuszy (erp, production, custom).

### 3.5 Wymiar 4, Faworytyzm / jakość selekcji (C_fav)

To jest **wymiar czyniący model symetrycznym** (w kodzie pole nazwane `productivityCost` wyłącznie dla kompatybilności wykresów). Oczekiwana strata wartości z **dyskrecji** w selekcji, skalowana ryzykiem korupcji kontekstu:

> **C_fav = CV · δ · (1 − ρ) · κ · m_prod,**

gdzie CV, wartość kontraktu, δ = `DISCRETION_FAVORITISM_PREMIUM` = 0,06 (Szucs, 2024), ρ, indeks sztywności procesu, κ = `CORRUPTION_RISK_CONTEXT` (mnożnik ryzyka korupcji kontekstu, pzp_eu = 1,0 … mrp_order = 0,15), m_prod, mnożnik jakości selekcji. Ponieważ dyskrecja to (1 − ρ), **to ścieżka elastyczna (bardziej dyskrecjonalna) ponosi więcej tego kosztu**. Różnica:

> **ΔC_fav = CV · δ · κ · m_prod · [(1 − ρ_R) − (1 − ρ_F)] = CV · δ · κ · m_prod · (ρ_F − ρ_R).**

Ponieważ ρ_F = min(ρ_base, 0,15) ≤ ρ_R = ρ_base, wyrażenie (ρ_F − ρ_R) ≤ 0, więc **ΔC_fav ≤ 0**: faworytyzm subsydiuje ścieżkę sztywną. To jest człon, który, gdyby był dostatecznie duży, mógłby odwrócić znak ΔC_total. Jego ograniczenie strukturalne jest osią rozdziału 4.

### 3.6 Wymiar 5, Renegocjacja (C_reneg)

Oczekiwany koszt renegocjacji *związany ze* sztywnością (import 2SLS/IV, nie czysty transfer przyczynowy):

> **C_reneg = P · K_reneg,**

gdzie K_reneg = `renegotiationCost` (koszt zdarzenia renegocjacji, wejście niezależne od CV), a prawdopodobieństwa:

> **P_R = clamp(0,22 + 0,077 · ρ_R · m_reneg, 0, 1),**   **P_F = 0,22 · 0,7 = 0,154.**

Baza 0,22 i premia 0,077 pochodzą z Beuve'a i in. (2023); czynnik elastyczny 0,7 jest założeniem klasy C. Różnica:

> **ΔC_reneg = K_reneg · (P_R − P_F) = K_reneg · (0,066 + 0,077 · ρ_R · m_reneg).**

Człon dodatni, umiarkowanej wielkości.

### 3.7 Wymiar 6, Całkowity koszt posiadania (C_TCO)

Utracone oszczędności TCO, **zdyskontowane** (d = 0,05) i **ograniczone pułapem 30%** wartości kontraktu:

> **C_TCO = CV · min(γ · A(T, d) · ρ · m_tco, κ_TCO),**

gdzie γ = `TCO_SAVINGS_RATE_PER_YEAR` = 0,10/rok, A(T, d) = Σ_{y=1}^{T} (1 + d)^{−y} to czynnik renty zdyskontowanej dla horyzontu T lat, κ_TCO = 0,30. Przesłanka pochodzi z Decarolisa (2014) i BHT (2014), pułap z ISM (b.d.). Różnica:

> **ΔC_TCO = CV · [min(γ · A(T,d) · ρ_R · m_tco, 0,30) − min(γ · A(T,d) · ρ_F · m_tco, 0,30)].**

Ponieważ ρ_F jest małe (≤ 0,15), człon elastyczny jest nieduży, a człon sztywny dla wysokiego ρ i długiego horyzontu uderza w pułap 0,30. **To jest dominujący człon karzący sztywność** (dominuje w 4 z 7 wartościowo istotnych scenariuszy: fleet, logistics, pipe_vs_field, capex) i, jak pokazuje rozdział 4, strukturalnie o rząd wielkości większy od subsydium faworytyzmu.

### 3.8 Wymiar 7, Obejście (C_bypass)

Oczekiwany koszt audytowo-sankcyjny nieformalnego obejścia tunelu, jako sigmoida ograniczona pułapem:

> **C_bypass = p_bypass · E_audit,**   gdzie   **σ(x) = 1 / (1 + e^{−k(x − x₀)}),  k = 6, x₀ = 0,9.**

Prawdopodobieństwo ścieżki sztywnej: **p_R = clamp(σ(ρ_R · m_bypass) · m_tech, 0, 0,95)**, gdzie m_tech = `bypassProbMultiplier` poziomu technologii, pułap = `BYPASS_PROBABILITY_CEILING` = 0,95. Prawdopodobieństwo ścieżki elastycznej: **p_F = ι_policy · 0,1**, gdzie ι_policy = `policyRigidityIndex`. E_audit = `bypassAuditExposure`. Różnica **ΔC_bypass = E_audit · (p_R − p_F)**, zwykle dodatnia (rzadkie wyjątki ujemne dla procesów end-to-end o bardzo niskiej sztywności). Zastrzeżenie kalibracyjne: zrealizowane p_R ≈ 86% dla maksymalnie sztywnego procesu manualnego przekracza empiryczne pasmo off-contract (~1,8–50%) 2–3-krotnie; parametry formy są założeniami modelowymi (tylko kierunek), wymagającymi pierwotnego audytu obejść przed jakimkolwiek twierdzeniem o magnitudzie.

### 3.9 Taksonomia proweniencji parametrów (klasy A/B/C)

Taksonomia proweniencji jest wyprowadzona w Artykule 1 (Mamcarz, w przygotowaniu-a); przywołujemy ją tu w skrócie, ponieważ jest niezbędna do interpretacji analizy wrażliwości z rozdziału 5. Jawność proweniencji jest warunkiem uczciwości modelu. Każdy parametr przypisujemy do jednej z trzech klas:

- **Klasa A, recenzowana estymata punktowa importowana wprost.**
- **Klasa B, triangulacja do opublikowanych przedziałów lub twardych danych rynkowych.**
- **Klasa C, kalibracyjne założenie modelowe wyrażone liczbą kardynalną (kierunek uzasadniony, magnituda konstruowana).**

Tabela 1 zestawia kluczowe parametry.

**Tabela 1. Taksonomia proweniencji parametrów modelu.**

| Parametr (symbol) | Wartość | Klasa | Źródło / zakotwiczenie | Wrażliwość |
|---|---|:--:|---|:--:|
| Bazowe prawdop. renegocjacji (P_base) | 0,22 | **A** | Beuve i in. (2023), bezwarunkowa średnia | Średnia |
| Premia renegocjacyjna sztywności (Δp) | 0,077 | **A** | Beuve i in. (2023), dolny kraniec 7,7–10,5 p.p. | Średnia |
| Premia faworytyzmu dyskrecji (δ) | 0,06 | **A** (transfer-laden) | Szucs (2024), estymata strukturalna ~6% | Wysoka |
| Przesłanka TCO (≥50% erozji; 7,5–14% adaptacji) | n/d | **A** | Decarolis (2014); BHT (2014) | n/d |
| Stopa dyskontowa (d) | 0,05 | **B** | EU CBA 2014–2020 (5% realnie, Spójność) | Niska |
| Stawki dzienne ról | 800–2500 PLN | **B** | Sedlak & Sedlak / GUS / Hays 2024 | Niska |
| Mnożnik czasu poziomu tech. (timeMultiplier) | 0,70–1,40 | **B** | APQC / Hackett | Niska |
| Roczna stopa oszczędności TCO (γ) | 0,10 | **C** | ISM (pułap), schemat płaski | **Wysoka** |
| Pułap kumulacyjny TCO (κ_TCO) | 0,30 | **C** | ISM (b.d.), „do 30% w wiele lat" | **Wysoka** |
| Gradient ryzyka korupcji (κ) | 1,0 … 0,15 | **C** | Szucs (1,0); OECD/Fazekas-Kocsis (porządek) | **Wysoka** |
| Indeks sztywności kardynalny (ρ) | 0,95 … 0,12 | **C** | Fazekas-Kocsis; porządek triangulowany | Średnia |
| Czynnik renegocjacji elastycznej | 0,7 | **C** | brak punktu; założenie | Średnia |
| Sigmoida obejścia (k, x₀, pułap) | 6; 0,9; 0,95 | **C** | Holmström-Milgrom (kierunek) | Średnia |
| Mnożniki wymiarowe (Direct/Indirect × Up/Down) | 0,85–1,4 | **C** | Kraljic (kierunek) | Niska (znak) |
| Mnożniki rolo-godzin kroków | 0,5–1,85 | **C** | Kraljic/CIPS/APQC (kierunek) | Niska |
| Koszty koord./narzędzi poziomu tech. | kardynalne | **C** | wycena vendorów (niejawna) | Niska |

**Bilans:** spośród nośnych parametrów modelu **około 35–40% ma rodowód recenzowany (klasa A) lub jest twardo triangulowanych (klasa B)**; pozostałe to założenia kalibracyjne klasy C wyrażone jako liczby kardynalne. Dwa parametry klasy C o **wysokiej** wrażliwości, γ (stopa TCO) oraz gradient κ, potrafią istotnie poruszyć (a w teorii odwrócić) lukę i są przedmiotem osobnej analizy wrażliwości w rozdziale 5. Premia δ = 0,06, choć zakotwiczona w pracy recenzowanej, jest **obciążona transferem** (węgierski sektor publiczny → kontekst ogólny) i ~2/3-selekcyjna, więc traktujemy ją jako górne, ostrożne oszacowanie.

---

## 4. Warunek zmiany znaku: analiza analityczna i uczciwe ujawnienie

### 4.1 Dekompozycja na człon karzący i subsydiujący sztywność

Sześć z siedmiu wymiarów (czas, administracja, koszt utraconych korzyści, renegocjacja, TCO, obejście) działa, w typowej kalibracji, *przeciw* ścieżce sztywnej (ΔCᵢ ≥ 0). Jedynie wymiar faworytyzmu działa na jej korzyść (ΔC_fav ≤ 0). Zdefiniujmy zatem:

> **Π = ΔC_time + ΔC_admin + ΔC_opp + ΔC_reneg + ΔC_TCO + ΔC_bypass ≥ 0**   (łączna kara sztywności),
> **Φ_fav = |ΔC_fav| = CV · δ · κ · m_prod · (ρ_R − ρ_F) ≥ 0**   (subsydium faworytyzmu).

Wówczas:

> **ΔC_total = Π − Φ_fav.**

**Warunek zmiany znaku (ścieżka sztywna netto tańsza) jest spełniony wtedy i tylko wtedy, gdy:**

> **Φ_fav > Π,   tj.   CV · δ · κ · m_prod · (ρ_R − ρ_F) > Π.**

To jest analityczny warunek symetrii. Pytanie metodologiczne brzmi: czy w kalibracji bazowej da się go spełnić?

### 4.2 Górne ograniczenie subsydium faworytyzmu

Subsydium Φ_fav jest **strukturalnie ograniczone**. Maksymalna różnica sztywności wynosi ρ_R − ρ_F = 0,95 − 0,15 = 0,80 (pzp_eu), maksymalne κ = 1,0 (pzp_eu), δ = 0,06, a w scenariuszach referencyjnych m_prod = 1,0 (mnożniki wymiarowe uśpione). Stąd:

> **Φ_fav ≤ CV · 0,06 · 1,0 · 0,80 = 0,048 · CV ≈ 4,8% wartości kontraktu.**

Subsydium faworytyzmu **nie może** zatem, przy bazowej kalibracji, przekroczyć ~4,8% wartości kontraktu, i to tylko w skrajnym przypadku pzp_eu o maksymalnym ryzyku korupcji.

### 4.3 Dolne ograniczenie kary sztywności

Tymczasem sama kara TCO dla wysokiego ρ i wieloletniego horyzontu uderza w pułap. Dla pzp_eu (ρ_R = 0,95, ρ_F = 0,15), horyzontu T = 5 lat i d = 0,05 czynnik renty wynosi A(5; 0,05) = 4,3295, więc:

> człon sztywny: γ·A·ρ_R = 0,10 · 4,3295 · 0,95 = 0,4113 → **ograniczony do 0,30**;
> człon elastyczny: γ·A·ρ_F = 0,10 · 4,3295 · 0,15 = 0,0649;
> **ΔC_TCO/CV = 0,30 − 0,0649 ≈ 0,235 (23,5% wartości kontraktu).**

Już **sama** kara TCO (~23,5% CV) jest blisko *pięciokrotnie* większa od maksymalnego subsydium faworytyzmu (~4,8% CV). Dodajmy do tego koszt utraconych korzyści (dla scenariusza pzp_eu rzędu 730 tys. PLN na 5 mln, tj. ~14,6% CV) oraz mniejsze człony renegocjacji, administracji i obejścia, a łączna kara Π przekracza 40% CV. Warunek Φ_fav > Π jest niemożliwy do spełnienia o cały rząd wielkości.

### 4.4 Uczciwe ujawnienie: znak ΔC nie zmienia się w bazie

Deterministyczne przeliczenie wszystkich dziewięciu scenariuszy referencyjnych (rozdział 6) potwierdza wynik analityczny: **ΔC_total > 0 w 9/9 scenariuszy**: ścieżka elastyczna jest netto tańsza wszędzie, *włącznie* z maksymalnie sztywnym przypadkiem pzp_eu, który okazuje się wręcz **najszerszą luką** jako odsetek wartości kontraktu (+36,19%). Wymiar faworytyzmu *istotnie* sprzyja ścieżce sztywnej w 8/9 scenariuszy (ΔC_fav od −11 tys. do −308 tys. PLN; w przypadku mrp dokładnie 0, bo ρ = 0,12 ≤ próg 0,15), więc wartość zarządcza jest kredytowana **per-wymiar**: lecz **nigdy nie wygrywa netto**.

**To jest sedno uczciwego ujawnienia.** Centralna teza honorowa modelu, że jest symetryczny, więc „ścieżka sztywna bywa tańsza dla wysokowartościowych, wysokokorupcyjnych, konkurencyjnych kontekstów", **obowiązuje wyłącznie jako gest per-wymiar i jest obalona na poziomie netto ΔC.** Symetria jest **kierunkowo zaimplementowana, lecz liczbowo bezczynna**. Należy ją ujawniać jako *możliwość strukturalną*, której realizacja netto zależy od wrażliwości, nigdy jako zaobserwowane czy wyłaniające się ustalenie.

### 4.5 Ile potrzeba, by znak się odwrócił?

Warunek z §4.1 pozwala policzyć, jak duża musiałaby być premia dyskrecji δ, by odwrócić znak w najkorzystniejszym dla sztywności scenariuszu (pzp_eu, „pipe_vs_field"). W bazie ΔC_total = +36,19% CV, przy czym faworytyzm wnosi już −4,8% CV (−240 tys. na 5 mln). Skalując δ liniowo i przyrównując ΔC_total do zera:

> 36,19% + (−4,8%)·(δ′/0,06 − 1) = 0   ⟹   δ′/0,06 = (36,19% + 4,8%) / 4,8% = 8,54   ⟹   **δ′ ≈ 0,51 (51%).**

Odwrócenie znaku wymagałoby premii dyskrecji rzędu **51%, około 8,5-krotności estymaty empirycznej Szucsa (6%)**, co jest wartością nieobronioną przez jakąkolwiek literaturę. Trzy, i tylko trzy, dźwignie mogłyby w zasadzie odwrócić znak: (i) podniesienie δ daleko poza estymatę empiryczną, (ii) dopuszczenie κ > 1,0 (poza zakresem kodu), lub (iii) skurczenie kar TCO/opportunity. Żadna nie jest uzasadniona w kalibracji bazowej. **Symetria jest możliwa strukturalnie, lecz nieosiągalna empirycznie w bazie.**

---

## 5. Analiza wrażliwości

Rozdział 4 dowiódł niespełnienia warunku zmiany znaku w punkcie bazowym. Rozdział 5 bada, jak wynik reaguje na perturbacje czterech parametrów wysokiej i średniej dźwigni, wskazanych w raporcie weryfikacyjnym jako wymagające testu (jednokierunkowe sweepy; pozostałe parametry trzymane na wartościach bazowych).

### 5.1 Stopa oszczędności TCO: 6 / 8 / 12% w roku 1 oraz schemat malejący

Parametr γ (płaska stopa 10%/rok) jest pojedynczym najbardziej wpływowym założeniem klasy C. Dla przypadku pzp_eu (ρ_R = 0,95, T = 5, d = 0,05, A = 4,3295) człon sztywny γ·A·ρ_R wynosi:

| γ (rok 1) | γ·A·ρ_R | Udział TCO sztywny (po pułapie 0,30) |
|---:|---:|---:|
| 6% | 0,2468 | 0,2468 (poniżej pułapu) |
| 8% | 0,3290 | **0,30** (pułap wiąże) |
| 10% (baza) | 0,4113 | **0,30** (pułap wiąże) |
| 12% | 0,4936 | **0,30** (pułap wiąże) |

Wniosek: dla wysokosztywnych, wieloletnich przypadków pułap 0,30 wiąże już przy γ ≥ 8%, więc sweep 8/10/12% **nie zmienia** udziału TCO w przypadku pzp_eu; dopiero γ = 6% obniża go do ~24,7% CV. Nawet wtedy ΔC_TCO ≈ 24,7% − (0,06·4,3295·0,15) ≈ 24,7% − 3,9% ≈ 20,8% CV, wciąż czterokrotnie powyżej subsydium faworytyzmu. **Schemat malejący** (np. 15% w roku 1 spadające do 3%) obniża wartość bieżącą strumienia względem płaskiego 10% w długich horyzontach, redukując karę TCO o kilka–kilkanaście procent, lecz **nie odwraca znaku** w żadnym scenariuszu. Efekt sweepu γ koncentruje się więc na przypadkach niskosztywnych lub krótkohoryzontowych (gdzie pułap nie wiąże), nie zmieniając jakościowego wniosku o symetrii.

### 5.2 Gradient ryzyka korupcji (κ)

κ skaluje *wyłącznie* wymiar faworytyzmu (jedyny człon sprzyjający sztywności). Podniesienie całego gradientu κ zwiększa Φ_fav liniowo, lecz nawet przy maksymalnym κ = 1,0 (pzp_eu) subsydium pozostaje ograniczone do 4,8% CV (§4.2). Odwrócenie znaku wymagałoby **κ > 1,0**, co wykracza poza zakres kodu (κ ∈ [0,15; 1,0]). To czyni gradient κ parametrem o wysokiej wrażliwości *na magnitudę subsydium per-wymiar*, lecz **niezdolnym samodzielnie odwrócić znaku netto** bez przekroczenia własnego górnego zakresu. Obniżenie gradientu (np. ku porządkowo defensywnym 0,3–0,4 w segmentach prywatnych) jeszcze bardziej kurczy subsydium, umacniając dodatni znak ΔC_total.

### 5.3 Indeks sztywności pzp_eu = 0,95

ρ_R wpływa na trzy wymiary jednocześnie: zwiększa karę TCO (γ·A·ρ_R), zwiększa karę renegocjacji (0,077·ρ_R), ale *również* zwiększa subsydium faworytyzmu (przez większą różnicę ρ_R − ρ_F). Obniżanie ρ_R od 0,95 ku 0,15 (poziom policy) kurczy *wszystkie trzy* człony; ponieważ kara TCO maleje szybciej (jest większa i uderza w pułap), luka ΔC_total **zwęża się, lecz pozostaje dodatnia**. Przy ρ_R = ρ_F = 0,15 (graniczny przypadek, w którym tunel jest tak elastyczny jak pole) faworytyzm i TCO niemal się zerują, a różnica jest napędzana resztkowymi członami czasu, administracji i kosztu utraconych korzyści, wciąż dodatnimi, choć małymi. Test potwierdza, że kardynalna wartość 0,95 nie jest „dźwignią ratunkową" dla symetrii: jej obniżenie *nie* odwraca znaku, lecz jedynie zmniejsza magnitudę luki.

### 5.4 Czynnik renegocjacji elastycznej 0,6–0,85

Czynnik f (P_F = 0,22·f) jest założeniem klasy C. Sweep:

| f | P_F = 0,22·f | Kierunek wpływu na ΔC_reneg |
|---:|---:|---|
| 0,60 | 0,132 | większa luka renegocjacji (na korzyść tezy) |
| 0,70 (baza) | 0,154 | baza |
| 0,85 | 0,187 | mniejsza luka renegocjacji |

Ponieważ ΔC_reneg = K_reneg·(P_R − P_F), wyższe f zmniejsza człon renegocjacji. Wymiar ten jest jednak małym składnikiem sumy (renegocjacja dominuje tylko w 1/9 scenariuszy, mrp, gdzie cała luka wynosi +0,54% CV), więc sweep f **przesuwa ΔC_total o ułamek punktu procentowego** i nie zbliża się do odwrócenia znaku w żadnym wartościowo istotnym przypadku.

### 5.5 Podsumowanie wrażliwości

Żaden z czterech sweepów, pojedynczo ani w realistycznej kombinacji, **nie odwraca znaku ΔC_total** w kalibracji bazowej. Wynik analityczny z rozdziału 4 jest zatem robustny: symetria pozostaje strukturalną możliwością, nie liczbową realizacją. Jest to wniosek *metodologicznie cenny*, pokazuje, że dodatni znak luki nie jest artefaktem jednego krzywego parametru, lecz strukturalną konsekwencją tego, że jedyny człon sprzyjający sztywności jest ograniczony do ~4,8% CV, podczas gdy człony karzące sięgają 20–36% CV.

---

## 6. Pakiet replikacyjny i przeliczenie dziewięciu scenariuszy

### 6.1 Pakiet replikacyjny

Przeliczenie wykonano na **realnym kodzie**, nie na reimplementacji: harness w Node v26 z natywnym usuwaniem typów TypeScript importuje *rzeczywiste* funkcje `calculateCosts` oraz zbiór `SCENARIOS` z dosłownych kopii warstwy `lib/` (`calculations.ts`, `process-templates.ts`, `scenarios.ts`). Artefakty: `scratchpad/harness.ts`, kopie `lib/`, `harness-output.json`, `report.txt`. Wszystkie dziewięć scenariuszy referencyjnych pozostawia pola `spendType`/`processPhase` nieustawione, więc mnożniki wymiarowe Direct/Indirect × Upstream/Downstream są uśpione (= 1,0) dla wszystkich wysłanych przypadków. Determinizm jest cechą konstrukcyjną, brak losowości w inferencji. Stan zamrożony na commicie `a1063f9`, data ważności prawnej 2026-06-28.

### 6.2 Przeliczenie per-wymiar (rigid − flexible), PLN

Tabela 2 odtwarza wynik §7 raportu weryfikacyjnego i §5 fundamentu cyklu *verbatim*. Δ > 0 oznacza, że ścieżka sztywna kosztuje więcej.

**Tabela 2. Deterministyczne przeliczenie dziewięciu scenariuszy referencyjnych (różnice per-wymiar, PLN).**

| scenariusz (typ / technologia) | CV | czas | admin | opp | faworyt. | reneg | tco | bypass | RAZEM sztywny | RAZEM elast. | **ΔC** | **% CV** | dominujący |
|--|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--|
| fleet (private_formal/partial_erp) | 5,0M | 0 | 3k | 120k | −54k | 17k | 418k | 32k | 940k | 404k | **+536k** | +10,72% | tco |
| erp (private_formal/sourcing_tool) | 3,0M | 0 | 6k | 420k | −32k | 34k | 368k | 27k | 1,44M | 621k | **+823k** | +27,42% | opp |
| logistics (private_formal/partial_erp) | 8,0M | 0 | 3k | 480k | −86k | 45k | 980k | 50k | 2,46M | 992k | **+1,47M** | +18,41% | tco |
| production (private_formal/manual) | 12,0M | 0 | 16k | 1,65M | −130k | 56k | 514k | 213k | 4,34M | 2,02M | **+2,32M** | +19,34% | opp |
| pipe_vs_field (pzp_eu/partial_erp) | 5,0M | 14k | 8k | 730k | −240k | 28k | 1,09M | 181k | 2,48M | 672k | **+1,81M** | +36,19% | tco |
| catalog (catalog_order/end_to_end) | 50k | 0 | 1k | 0 | −30 | 0 | 238 | −35 | 5k | 3k | **+1,6k** | +3,15% | admin |
| mrp (mrp_order/end_to_end) | 500k | 0 | 1k | 0 | 0 | 2k | 0 | −204 | 25k | 22k | **+2,7k** | +0,54% | reneg |
| capex_investment (capex/partial_erp) | 15,0M | 0 | 3k | 720k | −308k | 97k | 2,76M | 249k | 7,02M | 3,50M | **+3,52M** | +23,49% | tco |
| custom (private_formal/partial_erp) | 1,0M | 0 | 3k | 240k | −11k | 11k | 84k | 6k | 618k | 284k | **+334k** | +33,36% | opp |

### 6.3 Test symetrii: czy ΔC kiedykolwiek zmienia znak?

**Nie. 0 z 9 scenariuszy.** ΔC jest ściśle dodatnia w każdym wysłanym przypadku, ścieżka elastyczna jest netto tańsza wszędzie, włącznie z maksymalnie sztywnym pzp_eu (κ = 1,0, ρ = 0,95), który jest *najszerszą* luką jako odsetek CV (+36,19%). Wymiar faworytyzmu sprzyja ścieżce sztywnej w 8/9 scenariuszy (ΔC_fav od −11 tys. do −308 tys. PLN; mrp = 0, bo ρ = 0,12 ≤ próg policy 0,15), więc wartość zarządcza jest kredytowana per-wymiar, lecz nigdy nie wygrywa netto. Luka jest napędzana przez `tcoCost` (4 z 7) lub `opportunityCost` (3 z 7) we wszystkich siedmiu wartościowo istotnych przypadkach (tco: fleet, logistics, pipe_vs_field, capex; opp: erp, production, custom); dwa przypadki podprogowe, catalog (dominanta admin) oraz mrp (dominanta reneg), to mikro-luki poniżej progu istotności (odpowiednio +3,15% i +0,54% CV).

**Werdykt (wiążący w całym cyklu):** symetria modelu obowiązuje wyłącznie jako gest per-wymiar i jest obalona na poziomie netto ΔC. Jedyny człon sprzyjający sztywności jest strukturalnie ograniczony (|ΔC_fav| = CV·0,06·κ·(ρ_R − ρ_F) ≤ 0,048·CV, tj. ~4,8% CV, nawet przy pzp_eu/κ = 1,0), podczas gdy człony karzące, TCO (do pułapu 30%) i koszt utraconych korzyści (długie czasy trwania tunelu), są 4–10-krotnie większe (20–36% CV). Żaden scenariusz nie odwraca się na ujemny i żaden realistycznie nie mógłby bez podniesienia δ, dopuszczenia κ > 1,0 lub skurczenia kar TCO/opportunity. **Symetria jest możliwością strukturalną, kierunkowo zaimplementowaną, lecz liczbowo bezczynną, należy ją ujawniać, nigdy nie prezentować jako zaobserwowanego ustalenia netto.**

---

## 7. Dyskusja: dominują dyskrecja i niekompletność kontraktu, nie formalizm

### 7.1 Co naprawdę napędza lukę

Przeliczenie z rozdziału 6 dostarcza wyniku, który warto sformułować precyzyjnie, bo łatwo go przeczytać opacznie. Powierzchownie „ścieżka elastyczna wygrywa zawsze" brzmi jak ideologiczne potępienie procedury. Tak **nie jest**. Człony, które napędzają lukę, to **TCO** (utracone oszczędności w całkowitym koszcie posiadania, ufundowane na niekompletności kontraktu i erozji oszczędności ex post, Decarolis, 2014; BHT, 2014) oraz **koszt utraconych korzyści** (zwłoka wdrożeniowa). Oba są kosztami *braku elastyczności adaptacyjnej*, nie kosztami *formalności jako takiej*. Tymczasem jedyny człon, który dyscyplinuje ścieżkę elastyczną, **faworytyzm**: działa dokładnie w kierunku, który ostrzega przed naiwnym deregulowaniem: dyskrecja podnosi ceny i pogarsza selekcję (Szucs, 2024). Model jest więc **honestnym importerem ustalenia, które cięło przeciw jego własnej tezie nagłówkowej**: gdyby dyskrecja była darmowa, ścieżka elastyczna wygrywałaby z jeszcze większą przewagą; to właśnie premia faworytyzmu trzyma tę przewagę w ryzach.

### 7.2 Dlaczego to jest argument za polityką, nie przeciw konkurencji

Połączenie obu obserwacji daje wniosek normatywny cyklu: właściwą reformą **nie** jest zniesienie konkurencyjnej walidacji (to uwolniłoby premię faworytyzmu z §3.5), lecz **oddzielenie wymogu konkurencji od nakazu jednego sztywnego *formatu* konkurencji**. Granica ∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja} pozostaje wiążąca; zmienia się jedynie liczba dopuszczalnych procedur {A₁, …, Aₘ} przekraczających tę granicę. Pole zachowuje dyscyplinę cenową konkurencji (utrzymując niskie ΔC_fav), odzyskując zarazem elastyczność metody (redukując ΔC_TCO i ΔC_opp). To jest dokładnie ta synteza, której pojedyncze fragmenty literatury z rozdziału 2 nie potrafią wyrazić, bo żaden z nich nie trzyma obu kanałów, faworytyzmu i niekompletności, w jednym rachunku.

### 7.3 Implikacja dla struktury proceduralnej PZP (powiązanie prawno-ekonomiczne)

Jako kotwica dyscypliny *ekonomia i finanse*, niniejsza praca wiąże obiekt ekonomiczny (ΔC_total) ze strukturą prawno-proceduralną PZP. Ścieżki modelu mapują się na tryby ustawowe: przetarg nieograniczony (art. 132), przetarg ograniczony (art. 140), dialog konkurencyjny (art. 169), negocjacje z ogłoszeniem, przesłanki (art. 153), zamówienie z wolnej ręki (art. 214 ust. 1), tryb podstawowy (art. 275). Ustawowe okresy oczekiwania (35-dniowy minimalny okres publikacji w procedurze unijnej, art. 138 ust. 1; standstill 10/15 dni, art. 264 ust. 1; minimalny termin składania ofert w trybie podstawowym 7/14 dni, art. 283) są *granicami polityki*, nie *całą procedurą*. Kluczowa obserwacja prawna jest taka, że **PZP definiuje ∂Φ, granicę, a nie nakazuje pojedynczego korytarza A**. Wymóg konkurencyjnej walidacji powyżej progów unijnych jest twardy i model go respektuje (filtr legalności dopuszcza powyżej progu wyłącznie tryby konkurencyjne), lecz w paśmie 130 tys. PLN – próg unijny dopuszczalnym trybem jest tryb podstawowy (art. 275), wiele dopuszczalnych procedur dla jednej polityki. Konflacja polega na traktowaniu jednego trybu jak gdyby był on samą ustawą.

### 7.4 Asymetria pochodzenia: gdzie kończy się pomiar, a zaczyna kalibracja

Wynik z rozdziału 4 należy czytać przez pryzmat taksonomii proweniencji z §3.9. Człon, który *wygrywa* (TCO), opiera magnitudę na parametrze klasy C (γ = 0,10, pułap 0,30 z benchmarku ISM), choć jego *przesłanka* jest recenzowana (Decarolis, 2014; BHT, 2014). Człon, który *przegrywa* (faworytyzm), opiera magnitudę na parametrze klasy A obciążonym transferem (δ = 0,06 z Szucsa). Innymi słowy: dodatni znak luki jest w dużej mierze napędzany **najsłabiej zakotwiczonym** wymiarem, podczas gdy człon przeciwny ma rodowód recenzowany. Ta asymetria pochodzenia jest powodem, dla którego rozdział 5 koncentruje sweep wrażliwości właśnie na γ i pułapie TCO, i powodem, dla którego *nawet* przy γ = 6% (poniżej pułapu) znak się nie odwraca. Uczciwa lektura modelu brzmi więc: „luka jest dodatnia robustnie, lecz jej *magnituda* zależy krytycznie od jednego parametru klasy C, którego pierwotna walidacja pozostaje do wykonania". To rozróżnienie, znak vs magnituda, proweniencja A vs C, jest właśnie tym, co odróżnia jawny model od retorycznej wokandy.

### 7.5 Wartość metodologiczna negatywnego wyniku

Wynik „symetria liczbowo bezczynna" jest, paradoksalnie, **najmocniejszym** wkładem metodologicznym artykułu. Model, który *mógłby* potwierdzić wygodną dla autora tezę (ścieżka sztywna bywa tańsza), lecz po deterministycznym przeliczeniu jej *nie* potwierdza i to ujawnia, demonstruje dyscyplinę falsyfikowalności rzadką w literaturze kosztu proceduralnego. Strukturalne ograniczenie subsydium faworytyzmu (≤4,8% CV) względem kar TCO/opportunity (20–36% CV) jest *wynikiem*, nie wadą, pokazuje, *dlaczego* i *o ile* dyscyplina cenowa konkurencji nie wystarcza, by sztywny format był netto tańszy, oraz *jak duża* musiałaby być premia dyskrecji (51%, ~8,5× empiria), by to zmienić. Dla cyklu doktorskiego ten negatywny wynik pełni funkcję spajającą: Artykuł 1 (Mamcarz, w przygotowaniu-a) dostarcza pojęciowej i formalnej ramy oraz teorii błędu egzekwowania, jest konceptualnym szwem cyklu; **niniejszy artykuł produkuje i poddaje próbie liczbę kosztu jako obiekt *ekonomii i finansów***; Artykuł 3 (Mamcarz, w przygotowaniu-c) produkuje patologię zarządczą („teatr zgodności") jako obiekt *nauk o polityce i administracji*. Biorąc deterministyczną ΔC_total, poddając ją testowi i wiążąc ją ze strukturą prawno-proceduralną PZP, niniejszy artykuł czyni ujawnienie bezczynności symetrii **zawiasem łączącym te trzy odczyty tej samej konflacji**.

---

## 8. Ograniczenia

1. **Parametry klasy C.** Około 60–65% nośnych parametrów to założenia kalibracyjne wyrażone liczbami kardynalnymi (γ, gradient κ, kardynalne ρ, parametry sigmoidy obejścia, czynnik renegocjacji elastycznej, mnożniki wymiarowe i rolo-godzin, koszty koord./narzędzi). Ich *kierunki* są triangulowane, lecz *magnitudy* są konstruowane. Każda nagłówkowa wielkość jest estymacją z przedziałami wrażliwości, nie pomiarem.

2. **Transfer zewnętrzny.** Wszystkie importowane efekty niosą zastrzeżenia zewnętrznej trafności: Szucs (węgierski sektor publiczny, RDD, ~2/3 selekcji), Beuve i in. (francuskie parkingi, 2SLS/IV, n ≈ 279), Guasch (LAC bez telekomunikacji), BHT (US Caltrans), Decarolis i Coviello-Mariniello (włoskie roboty). Transfery na kontekst polski są benchmarkami, nie zmierzonymi wartościami polskimi.

3. **Uśpione mnożniki wymiarowe.** Wszystkie dziewięć scenariuszy referencyjnych pozostawia `spendType`/`processPhase` nieustawione, więc mnożniki Direct/Indirect × Upstream/Downstream (potrafiące skumulować się do ~1,62× na TCO) są nieaktywne. Hipotezy H2 (Direct > Indirect) i H3 (Upstream > Downstream) pozostają *kierunkowymi twierdzeniami do przetestowania*, nie wynikami.

4. **Realizowany pułap obejścia.** Zrealizowane p_bypass ≈ 86% dla maksymalnie sztywnego procesu manualnego przekracza empiryczne pasmo off-contract (~1,8–50%) 2–3-krotnie; parametry sigmoidy są założeniami kierunkowymi wymagającymi pierwotnego audytu obejść.

5. **Pułap TCO jako wiązanie.** Pułap κ_TCO = 0,30 wiąże dla wysokowartościowych, długohoryzontowych, wysokosztywnych przypadków, co czyni go *de facto* parametrem dominującym lukę w 4 z 7 wartościowo istotnych scenariuszy. Jego pochodzenie (benchmark praktyczny ISM „najlepszego przypadku") jest słabsze niż przesłanka wymiaru (Decarolis 2014, recenzowana).

6. **Brak walidacji na danych pierwotnych.** Model nie był walidowany na rzeczywistych wynikach polskich zamówień; program empiryczny (zmienność wewnątrz-firmowa + efekty stałe kategorii, skale wieloitemowe, analiza forensyczna PO vs komunikacja, dopasowanie skłonnościowe) pozostaje zaplanowany, nie wykonany.

7. **Optymalizator nie jest uczeniem maszynowym.** Towarzyszący ścieżkom optymalizator to *ważona funkcja scoringowa oparta na regułach z 30-przebiegowym testem wrażliwości*, nie jest uczeniem maszynowym, nie jest lasem losowym i nie jest walidowany na rzeczywistych wynikach zamówień.

---

> ## Zakres twierdzeń (Claims and Non-Claims)
>
> **Co artykuł twierdzi.** Artykuł specyfikuje siedmiowymiarowy, zamknięty rachunek różnicy kosztów ΔC_total = Σ ΔCᵢ między ścieżką sztywną a ścieżką ograniczoną wyłącznie polityką, klasyfikuje proweniencję każdego parametru (A/B/C) i wyprowadza analityczny warunek zmiany znaku, dowodząc analitycznie oraz przez deterministyczne przeliczenie, że w kalibracji bazowej warunek ten nie jest spełniony. Wszystkie wyniki ilościowe są **estymacjami modelowymi** wygenerowanymi przy założeniach udokumentowanych w `docs/MODEL_PARAMETERS.md`, nie są zmierzonymi faktami empirycznymi o polskich (ani żadnych innych) zamówieniach.
>
> **Czego artykuł NIE twierdzi.**
> 1. Nagłówkowa wielkość (np. ścieżka sztywna 100–400% powyżej ścieżki policy-only) jest **estymacją z przedziałami wrażliwości**, nigdy ustaleniem (finding).
> 2. **Symetria jest liczbowo bezczynna na poziomie netto.** Przeliczenie na realnym kodzie wszystkich 9 scenariuszy referencyjnych daje ΔC_total > 0 w **9/9** (ściśle dodatnie wszędzie); teza „ścieżka sztywna bywa tańsza netto" obowiązuje **wyłącznie per-wymiar** (faworytyzm subsydiuje ścieżkę sztywną w 8/9 przypadków) i **nigdy netto**, ponieważ człon sprzyjający sztywności jest strukturalnie ograniczony o rząd wielkości poniżej kar TCO i kosztu utraconych korzyści. Symetria to *możliwość strukturalna*, nie zaobserwowane ustalenie netto.
> 3. Optymalizator ścieżki to **ważona funkcja scoringowa oparta na regułach z 30-przebiegowym testem wrażliwości**: to **NIE** uczenie maszynowe, **NIE** Random Forest i **NIE** jest walidowany na rzeczywistych wynikach zamówień.
> 4. Przypadki sektora prywatnego (Ryanair, Swiss Casinos, Air France, Zara) są **wyłącznie ilustracyjną motywacją**; nie są dowodem w sprawie prawa zamówień publicznych.
> 5. Około **35–40% parametrów modelu jest recenzowanych (peer-reviewed)**; pozostałe to **założenia kalibrowane lub modelowe klasy C** wyrażone jako liczby kardynalne.
> 6. Wszystkie zaimportowane efekty niosą swoje **zastrzeżenia identyfikacyjne i zewnętrznej trafności** (Szucs: węgierski RDD sektora publicznego, ~2/3 selekcja; Beuve: francuskie parkingi, 2SLS/IV; Guasch: Ameryka Łac. bez telekomunikacji; Bajari-Houghton-Tadelis: US Caltrans; Decarolis/Coviello-Mariniello: włoskie roboty budowlane). Transfery na kontekst polski są benchmarkami, nie pomiarami.

---

## Bibliografia

Bajari, P., Houghton, S., i Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Bajari, P., i Tadelis, S. (2001). Incentives versus transaction costs: A theory of procurement contracts. *RAND Journal of Economics, 32*(3), 387–407. https://doi.org/10.2307/2696361

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2021). *Contractual rigidity and political contestability: Revisiting public contract renegotiations* (NBER Working Paper No. 28491). National Bureau of Economic Research. https://doi.org/10.3386/w28491

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Contractual rigidity and political contestability: Revisiting public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab022

Chartered Institute of Procurement & Supply. (2024). *Procurement policies & procedures explained*. CIPS Intelligence Hub.

Coviello, D., i Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

Decarolis, F. (2014). Awarding price, contract performance, and bids screening: Evidence from procurement auctions. *American Economic Journal: Applied Economics, 6*(1), 108–132. https://doi.org/10.1257/app.6.1.108

DiMaggio, P. J., i Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review, 48*(2), 147–160. https://doi.org/10.2307/2095101

Dyrektywa Parlamentu Europejskiego i Rady 2014/24/UE z dnia 26 lutego 2014 r. w sprawie zamówień publicznych, uchylająca dyrektywę 2004/18/WE (Dz. Urz. UE L 94 z 28.03.2014).

European Commission. (2011). *Evaluation report: Impact and effectiveness of EU public procurement legislation* [Przygotowane przez PwC, London Economics i Ecorys]. European Commission.

Fazekas, M., i Blum, J. R. (2021). *Improving public procurement outcomes: Review of tools and the state of the evidence base* (Policy Research Working Paper No. 9690). World Bank Group.

Fazekas, M., i Kocsis, G. (2020). Uncovering high-level corruption: Cross-national objective corruption risk indicators using public procurement data. *British Journal of Political Science, 50*(1), 155–164. https://doi.org/10.1017/S0007123417000461

Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics, 1*. Reserve Bank of Australia.

Guasch, J. L. (2004). *Granting and renegotiating infrastructure concessions: Doing it right*. World Bank. https://doi.org/10.1596/0-8213-5792-1

Holmström, B., i Milgrom, P. (1991). Multitask principal–agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24

Institute for Supply Management. (b.d.). *Understanding total cost of ownership in procurement*. Pobrano z https://www.ism.ws/supply-chain/ownership-in-procurement/

Kelman, S. (1990). *Procurement and public management: The fear of discretion and the quality of government performance*. AEI Press.

Kraljic, P. (1983). Purchasing must become supply management. *Harvard Business Review, 61*(5), 109–117.

Lipsky, M. (1980). *Street-level bureaucracy: Dilemmas of the individual in public services*. Russell Sage Foundation.

Mamcarz, P. (w przygotowaniu-a). *Tunnel or Field: Policy versus Procedure as the Hidden Architecture of Procurement Governance* [Tunel czy pole: polityka a procedura jako ukryta architektura zarządzania zamówieniami; Artykuł 1 cyklu doktorskiego ProcuraCost]. Uczelnia Łazarskiego.

Norman, D. A. (1988). *The design of everyday things*. Basic Books.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w sprawie aktualnych progów unijnych, ich równowartości w złotych, równowartości w złotych kwot wyrażonych w euro oraz średniego kursu złotego w stosunku do euro stanowiącego podstawę przeliczania wartości zamówień publicznych lub konkursów (M.P. 2025 poz. 1247).

Scott, J. C. (1998). *Seeing like a state: How certain schemes to improve the human condition have failed*. Yale University Press.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review, 5*(3), 305–321.

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Ustawa z dnia 11 września 2019 r., Prawo zamówień publicznych (tekst jednolity Dz.U. 2026 poz. 793).

Ustawa z dnia 20 lipca 2018 r., Prawo o szkolnictwie wyższym i nauce (Dz.U. 2018 poz. 1668, z późn. zm.).

Vaughan, D. (1996). *The Challenger launch decision: Risky technology, culture, and deviance at NASA*. University of Chicago Press.
