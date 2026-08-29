# Jak sprawdzić koszt projektu procesu? Protokół empiryczny dla polskich zamówień publicznych

**Artykuł 3 cyklu doktorskiego | nauki o polityce i administracji | protokół badawczy**

## Streszczenie

Artykuł przekłada hipotezy związane z ProcuraCost 2.3 na falsyfikowalny plan
badania polskich zamówień publicznych. Nie przedstawia wyników, ponieważ dane
nie zostały zebrane. Rejestry BZP, TED i e-Zamówień mogą opisywać widoczne daty,
uczestnictwo, wynik i część zmian umowy. Nie mierzą pełnego projektu procesu
wewnętrznego, pracy według roli, dziennego kosztu zwłoki, TCO ani nieformalnych
obejść. Protokół łączy zatem warstwę rejestrową z wersjonowanymi dokumentami i
logami organizacyjnymi. Głównym wynikiem jest czas cyklu. Pozostałe mechanizmy
są badane osobno, bez tworzenia jednego obserwowanego miernika dojrzałości.

## 1. Pytanie i granica wnioskowania

Pytanie badawcze brzmi:

> Jak projekt przebiegu procesu obowiązujący przed rozpoczęciem zakupu wiąże się
> z czasem, nakładem pracy, dostępem do rynku i wynikami umowy, przy
> porównywalnym przedmiocie, wartości oraz warunkach rynku?

Rodzina procedury nie jest topologią pracy. Ten sam tryb może mieć sekwencyjne
albo częściowo równoległe przygotowanie. Projekt przebiegu nie jest również
konstrukcją umowy, wsparciem systemowym ani gotowością organizacyjną.

Nie wolno porównywać postępowania ustawowego z bezprawnym zakupem bez
konkurencji. Obowiązkowe terminy prawne powinny być identyfikowane i
kontrolowane osobno. Adaptacyjny wariant ProcuraCost pozostaje wewnątrz tej
samej granicy prawnej.

Od 1 stycznia 2026 r. dotychczasowy plan przyjmuje próg stosowania PZP równy
170 000 zł netto na podstawie Dz.U. 2025 poz. 1173. Właściwe progi unijne
zależą od przedmiotu i rodzaju Zamawiającego. Przed analizą należy zweryfikować
aktualny tekst prawa i stan na dzień każdego postępowania. Próg prawny nie jest
automatycznie prawidłowym instrumentem identyfikacji.

## 2. Hipotezy

- **H1a:** większa preskryptywność projektu przebiegu mierzona ex ante wiąże się
  z większą liczbą dni od zatwierdzenia potrzeby do zawarcia umowy, po
  uwzględnieniu złożoności, granicy prawnej, rodziny procedury i liczby
  właściwych obowiązkowych dni oczekiwania. **H1b:** przy tych samych kontrolach
  wiąże się z większą liczbą godzin koordynacji kupca, prawnika i kierownika.
- **H2:** szerszy dostęp do rynku mierzony ex ante wiąże się z większą liczbą
  ważnych ofert i niższą ceną wyboru względem prerejestrowanego, niezależnego
  benchmarku, niezależnie od topologii pracy.
- **H3:** większa sztywność klauzul zmiany określona ex ante wiąże się z większą
  liczbą formalnych aneksów na rok kontraktu. Po uwzględnieniu konstrukcji
  klauzul związek z liczbą akceptacji przed wszczęciem powinien mieścić się w
  prerejestrowanej granicy równoważności.
- **H4:** dla potrzeb sklasyfikowanych przed wyborem procesu jako niekompletne
  adaptacyjne odkrywanie wiąże się z większym nakładem ról przed wszczęciem,
  lecz z mniejszą liczbą dni wyjaśnień i ponownej pracy po rozpoczęciu
  konkurencji niż projekt sekwencyjny. Obie interakcje powinny być nieobecne
  albo mieścić się w prerejestrowanych granicach równoważności dla potrzeb
  sklasyfikowanych jako stabilne.
- **H5:** wyższy odsetek wymaganych kontroli faktycznie zarejestrowanych w
  systemie wiąże się z mniejszą liczbą akceptacji lub zamówień poza systemem
  oraz mniejszą liczbą braków w śladzie audytowym. Samo posiadanie systemu i
  odpowiedzi o gotowości nie są ekspozycją operacyjną.

Każda hipoteza dopuszcza wynik zerowy lub przeciwny. H3 i H5 nie są testowalne
przez sam kalkulator. W natywnych scenariuszach różnica kosztu aneksów wynosi
zero, nieformalne obejście procesu jest nieobjęte monetyzacją, a gotowość
pozostaje niezależna od rachunku.

## 3. Ekspozycja ex ante

### 3.1 Indeks badawczy

Ekspozycją główną jest preskryptywność projektu przebiegu obowiązującego w
chwili autoryzacji potrzeby. Źródłem są wersje polityki zakupowej, macierzy
uprawnień i konfiguracji obiegu zakupowego ważne w dacie
`exposure_reference_at`.

Indeks jest narzędziem badawczym. Nie jest polem modelu 2.3, wynikiem publicznego
profilu procesu, oceną dojrzałości ani rekomendacją.

Proponowane składowe:

1. liczba wymaganych bram decyzyjnych;
2. liczba zależności, których nie wolno prowadzić równolegle;
3. głębokość eskalacji;
4. liczba obowiązkowych artefaktów bez wariantu uproszczonego;
5. odwrócona autonomia zespołu w zmianie zakresu.

Pozycje są standaryzowane i sumowane z równymi wagami tylko po pozytywnym
pilotażu pomiaru. Należy raportować także każdy składnik osobno.

Z ekspozycji wyklucza się długość ścieżki krytycznej i udział oczekiwania. Obie
wielkości współtworzą wynik czasu, więc ich użycie w ekspozycji tworzyłoby
mechaniczne powiązanie.

### 3.2 Ochrona przed wyciekiem

- koder ekspozycji nie widzi wyników;
- dokumenty muszą być datowane nie później niż `exposure_reference_at`;
- podręcznik kodowania jest zamrożony przed badaniem właściwym;
- co najmniej dwóch koderów pracuje niezależnie;
- dla pozycji uznaniowych prerejestrowany próg Krippendorffa wynosi
  `alpha >= 0,80`;
- pozycja poniżej progu jest przeprojektowana albo usunięta.

## 4. Scenariusze jako źródło testów

Scenariusze 2.3 nie są obserwacjami. Pomagają określić, jaki mechanizm należy
zmierzyć.

### 4.1 Adaptacja z mechanizmem

- Transformacja ERP może wymagać definiowania problemu i modularnego podejścia,
  gdy wymagania są niepełne.
- Przeprojektowanie logistyki może wymagać kontaktu z rynkiem w celu sprawdzenia
  poziomów usług, interfejsów danych i alokacji ryzyka.
- Publiczny zakup IT może korzystać ze wstępnych konsultacji rynkowych przed
  postępowaniem otwartym, przy zachowaniu tych samych terminów ustawowych.
- Odkrywanie i współprojektowanie może zwiększać czas oraz nakład pracy, ponieważ
  uczenie się i ponowne określenie zakresu są pracą.

### 4.2 Brak odrębnego mechanizmu pracy

Stabilna standardowa usługa może wymagać tej samej pracy w obu projektach.
Scenariusz startowy tej usługi osobno deklaruje różnicę konkurencji, więc nie
jest neutralną kontrolą kosztu całkowitego.
Zamówienie katalogowe i zwolnienie zlecenia MRP mają identyczne mapy w
scenariuszach kontrolnych. Równe mapy powinny dawać równy wynik. Badanie powinno
sprawdzić mechanizm, a nie etykietę wariantu.

## 5. Warstwy danych

### 5.1 Warstwa rejestrowa

Rejestry publiczne mogą dostarczyć:

- identyfikatory Zamawiającego i wykonawcy;
- CPV, wartość i tryb;
- daty ogłoszenia i udzielenia;
- liczbę złożonych lub ważnych ofert, jeżeli definicja pola jest jednoznaczna;
- kryteria i wynik;
- część informacji o opublikowanych zmianach umowy.

Przed analizą należy zamrozić schemat danych, reguły deduplikacji, definicje pól
i obsługę braków. Każda liczba opisowa powinna być generowana kodem z
wersjonowanego wycinka.

Warstwa nie ujawnia pełnego przygotowania wewnętrznego, roboczogodzin,
dziennego kosztu zwłoki, pełnego TCO, wszystkich klauzul ani nieformalnego
obejścia. Brak rekordu obejścia nie oznacza braku zjawiska.

### 5.2 Warstwa organizacyjna

Jednostką analizy jest zdarzenie zakupowe. W zależności od hipotezy wymagane są:

1. znaczniki rozpoczęcia, przekazań, zatwierdzeń i zawarcia umowy;
2. aktywna praca i oczekiwanie według roli;
3. poprzednicy, równoległość i cofnięcia;
4. zaproszenia, oferty i powody wykluczeń;
5. klauzule zmiany, aneksy i koszty;
6. zaobserwowane odstępstwa oraz sposób ich wykrycia;
7. logi konfiguracji i użycia kontroli systemowych;
8. mierniki wykonania ustalone przed poznaniem przebiegu.

Wyniki finansowe powinny być oddzielone od kodowania procesu. Ogranicza to
dopasowanie oceny przebiegu do wyniku.

## 6. Wyniki i kontrole

### 6.1 Wynik główny

`log(dni cyklu zakupowego)` od autoryzacji potrzeby do zawarcia umowy, obliczony
z audytowalnych znaczników czasu.

Obowiązkowe terminy prawne pozostają częścią wyniku głównego. Zmienna
`applicable_mandatory_wait_days` jest wyznaczana według stanu prawnego na dzień
wszczęcia, granicy, rodziny procedury, przedmiotu zamówienia i sposobu
komunikacji. Wchodzi do specyfikacji głównej jako jawna kontrola. Obserwacja bez
danych pozwalających ją rozstrzygnąć nie trafia do estymacji H1. Analiza
wrażliwości może odjąć wyłącznie te zidentyfikowane terminy; nie odejmuje
pozostałych kolejek organizacyjnych.

### 6.2 Wyniki wtórne

- nakład pracy według roli;
- liczba ważnych ofert;
- cena względem benchmarku ustalonego ex ante;
- liczba i typ aneksów;
- udokumentowane odstępstwa;
- ustalenia audytowe;
- uzgodnione miary wykonania dostawy.

### 6.3 Kontrole

Dozwolone zmienne przed ekspozycją obejmują wartość szacunkową, CPV,
złożoność techniczną, pilność zadeklarowaną przed wszczęciem, rok i efekty stałe
organizacji.

Liczba ofert, cena, aneksy i wynik dostawy są zmiennymi po ekspozycji. Nie mogą
pełnić roli kontroli w modelu czasu, jeżeli projekt procesu mógł na nie wpłynąć.
Liczba ważnych ofert pozostaje wynikiem w modelu konkurencji.

Twierdzenie o braku efektu wymaga prerejestrowanego testu równoważności.
`p > 0,05` nie potwierdza równoważności.

## 7. Strategia analityczna

### 7.1 Wariant A: asocjacja wewnątrz organizacji

Specyfikacja bazowa:

`log(dni) = beta x prescriptiveness + gamma'X + alpha_organizacja + delta_CPV + theta_rok + epsilon`

Porównywane są zdarzenia w tej samej organizacji i kategorii. Błędy standardowe
są klastrowane na poziomie organizacji. Przy mniej niż 30 klastrach planowany
jest wild cluster bootstrap. Przy 4 do 6 organizacjach wyniki pozostają
eksploracyjne i wymagają analizy leave-one-organisation-out.

Wariant identyfikuje asocjację warunkową. Trudniejsze lub pilniejsze zakupy mogą
być kierowane do bardziej preskryptywnego przebiegu, więc nie jest to efekt
przyczynowy.

### 7.2 Wariant B: jednorazowa zmiana procesu

Rozszerzenie przyczynowe wymaga porównywalnej, jasno datowanej zmiany oraz grup
jeszcze nieobjętych interwencją. Przy zróżnicowanych terminach można rozważyć
staggered DiD z estymatorem Callaway-Sant'Anna albo Sun-Abraham.

Wymagane są ocena trendów przed zmianą, brak antycypacji w prerejestrowanym
oknie, brak równoległej transformacji, wiarygodne grupy porównawcze i
udokumentowanie wpływu interwencji na ekspozycję. Brak widocznych różnic przed
zmianą nie dowodzi trendów równoległych.

### 7.3 Wariant C: próg prawny

Projekt progowy wymaga potwierdzenia aktualnego stanu prawnego, testu gęstości,
ciągłości kowariat i oceny sortowania wartości. Szucs (2024) pokazuje, dlaczego
manipulacja przy progu może unieważnić prosty RDD w podobnej klasie danych.
Usunięcie obserwacji najbliżej progu nie naprawia automatycznie identyfikacji.
Wariant C nie jest podstawą planu głównego.

## 8. Wielkość próby i moc

Dla wyniku czasu proponowany MSI wynosi 10 procent na jedno odchylenie
standardowe indeksu:

`beta_MSI = ln(1,10) ~= 0,095`

Jest to kryterium istotności praktycznej do zatwierdzenia przed zebraniem
danych, nie benchmark zewnętrzny. Nakład pracy i inne wyniki wymagają odrębnych
MSI.

Pilotaż planistyczny obejmuje 2 organizacje po 25 zdarzeń. Jego celem jest ocena
wykonalności kodowania, wariancji, ICC, kompletności i struktury klastrów. Nie
służy testowaniu hipotez.

Ostateczną liczebność i minimalny wykrywalny efekt określi prerejestrowana
symulacja Monte Carlo odtwarzająca estymator, klastry, terminy interwencji i
braki danych. Liczba niezależnych organizacji jest ważniejsza dla inferencji niż
sama liczba zdarzeń.

## 9. Walidacja modelu 2.3

Walidacja zaczyna się od komponentów, a nie od pytania, który wariant wygrał.

1. Czy z dokumentów i logów można odtworzyć graf kroków, poprzedników, pracy,
   kolejek oraz blokad prawnych?
2. Czy przewidywany czas i nakład ról odpowiadają obserwowanym komponentom na
   próbie odłożonej?
3. Jak szeroki jest zadeklarowany zakres względem rozrzutu obserwowanego?
4. Czy komponent modelu przewyższa prostą bazę, na przykład medianę kategorii?
5. Który kanał generuje błąd?

Pełna walidacja `deltaCost` wymaga kontrfaktycznego wyniku drugiej mapy i
niezależnie uzasadnionego dziennego kosztu zwłoki. Pojedyncze zdarzenie nie
dostarcza tych danych. Dziennego kosztu zwłoki nie można wyprowadzić z samego
rejestru postępowania. Potrzebny jest protokół z właścicielem wyniku biznesowego
przeprowadzony przed poznaniem czasu badanego cyklu.

Koszt zmian umowy i TCO mają w scenariuszach startowych deltę równą zero.
Nieformalne obejście procesu pozostaje nieobjęte monetyzacją. Nie wolno przedstawiać tych kanałów jako
zwalidowanych prognoz.

## 10. Prerejestracja i falsyfikacja

Przed estymacją należy zamrozić populację, okno, ekspozycję, wyniki, kontrole,
estymator, poziom klastrowania, reguły wyłączeń, MSI, granice równoważności,
obsługę braków i plan testów wielokrotnych.

Hipotezy słabną, jeżeli:

- H1a lub H1b osobno nie osiąga prerejestrowanego dodatniego MSI albo ma znak
  przeciwny odpowiednio dla czasu i godzin koordynacji;
- szerszy dostęp ex ante wiąże się z materialnie mniejszą liczbą ważnych ofert
  albo wyższą ceną względem niezależnego benchmarku;
- sztywność klauzul nie wiąże się dodatnio z liczbą aneksów na rok kontraktu lub
  warunkowy efekt liczby bram wykracza poza granicę równoważności;
- dla potrzeb niekompletnych interakcja adaptacyjnego odkrywania nie jest
  dodatnia dla pracy przed wszczęciem i ujemna dla dni wyjaśnień oraz ponownej
  pracy po rozpoczęciu konkurencji albo dla potrzeb stabilnych wykracza poza
  granice równoważności;
- odsetek zarejestrowanych kontroli nie wiąże się z mniejszą liczbą działań poza
  systemem i braków śladu audytowego ponad informację o posiadaniu systemu;
- komponent modelu nie przewyższa prerejestrowanej prostej bazy.

Heterogeniczność jest wynikiem tylko wtedy, gdy odpowiada prerejestrowanemu
mechanizmowi i pojawia się poza próbą używaną do dopasowania. Wynik zerowy lub
przeciwny pozostaje wynikiem badania.

## 11. Materiał praktyczny i hipotezy

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) podnosi kwestie wewnętrznego
właściciela wdrożenia, tarcia procesowego, dyscypliny wymagań, zakupów
operacyjnych, uproszczenia polityki, TCO i ograniczonego wykorzystania AI.
Materiał ma charakter wywiadu praktycznego i korzysta z automatycznych napisów
w języku polskim.

Może informować pytania wywiadu i hipotezy. Nie jest źródłem parametru,
częstości, efektu, odpowiedzi w samoopisie gotowości ani dowodu przyczynowego. Bielik może
porządkować dane rynkowe do weryfikacji. Jawny model deterministyczny wykonuje
rachunek.

## 12. Etyka i pakiet replikacyjny

Dane organizacyjne mogą zawierać dane osobowe, informacje handlowe i sygnały
nieprawidłowości. Przed pozyskaniem wymagane są podstawa prawna, minimalizacja,
kontrola dostępu, plan retencji i ocena etyczna. Publikacja powinna używać
agregatów oraz ograniczać ryzyko identyfikacji Zamawiającego, wnioskodawcy
biznesowego i wykonawcy.

Pakiet badawczy powinien zawierać słownik danych, kod pobrania i czyszczenia,
manifest wersji źródeł, prerejestrację, skrypty tabel oraz dziennik odstępstw.
Chronione dane surowe nie muszą być publiczne. Syntetyczny zestaw powinien
umożliwiać audyt kodu bez ujawniania informacji organizacyjnych.

Tabele wynikowe generuje kod z zamrożonego zbioru analitycznego. Jeżeli
kluczowej zmiennej nie można odtworzyć, artykuł raportuje brak zamiast
zastępować ją niezweryfikowaną wartością.

## Bibliografia i źródła prawne

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Doing It by the Book:
Political Contestability and Public Contract Renegotiations. *Journal of Law,
Economics, and Organization, 39*(1), 281-308.
https://doi.org/10.1093/jleo/ewab039

Callaway, B., i Sant'Anna, P. H. C. (2021). Difference-in-Differences with
Multiple Time Periods. *Journal of Econometrics, 225*(2), 200-230.
https://doi.org/10.1016/j.jeconom.2020.12.001

Cattaneo, M. D., Jansson, M., i Ma, X. (2020). Simple Local Polynomial Density
Estimators. *Journal of the American Statistical Association, 115*(531),
1449-1455. https://doi.org/10.1080/01621459.2019.1635480

Coviello, D., i Mariniello, M. (2014). Publicity Requirements in Public
Procurement. *Journal of Public Economics, 109*, 76-100.
https://doi.org/10.1016/j.jpubeco.2013.10.008

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117-160.
https://doi.org/10.1093/jeea/jvad017

Sun, L., i Abraham, S. (2021). Estimating Dynamic Treatment Effects in Event
Studies with Heterogeneous Treatment Effects. *Journal of Econometrics, 225*(2),
175-199. https://doi.org/10.1016/j.jeconom.2020.09.006

Ustawa z dnia 11 września 2019 r. Prawo zamówień publicznych, z późniejszymi
zmianami.

Ustawa z dnia 25 lipca 2025 r. o zmianie ustawy Prawo zamówień publicznych oraz
niektórych innych ustaw, Dz.U. 2025 poz. 1173.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w
sprawie progów unijnych na lata 2026-2027, M.P. 2025 poz. 1247.
