# Plan walidacji empirycznej ProcuraCost

**Wersja dokumentu:** 2.0 dla modelu 2.3.0, 29 sierpnia 2026
**Status:** projekt do oceny promotora. Nie zawiera wyników i nie opisuje
zebranych danych.
**Zastępuje:** aktywny plan dla modelu 2.2.2. Materiały modelu 1.x pozostają
wyłącznie w archiwum.

## 0. Cel i granica planu

ProcuraCost 2.3 jest deterministycznym rachunkiem warunkowym. Pokazuje, co
wynika z dwóch zadeklarowanych map przebiegu procesu, kosztu czasu, stawek,
kosztów niepracowniczych i objętych monetyzacją elementów konstrukcji umowy.
Nie pokazuje, co przeciętnie dzieje się w polskich zakupach i nie identyfikuje
skutku przyczynowego.

Plan rozdziela cztery zadania:

| Poziom | Pytanie | Status |
|---|---|---|
| A. Pomiar | Czy projekt przebiegu procesu można rzetelnie odtworzyć ex ante z dokumentów i logów? | warunek wstępny |
| B. Mechanizmy | Czy cechy projektu procesu wiążą się z czasem, nakładem pracy, dostępem do rynku i zmianami umowy? | główny zakres badania |
| C. Przyczynowość | Czy określona zmiana projektu procesu powoduje zmianę wyniku? | wyłącznie przy spełnieniu warunków identyfikacji |
| D. Walidacja instrumentu | Czy komponenty rekordu decyzji przewidują odpowiadające im obserwowane komponenty lepiej niż prosta baza? | wyłącznie na próbie odłożonej |

Kalibracja nie jest walidacją. Odtworzenie wyniku z kodu potwierdza spójność
obliczeń, nie trafność założeń.

## 1. Jednostka analizy i obiekt porównania

Podstawową jednostką analizy jest zdarzenie zakupowe od autoryzacji potrzeby do
zawarcia umowy albo innego jasno zdefiniowanego zakończenia.

Model 2.3 rozdziela:

- ramy prawne i ład zakupowy;
- rodzinę procedury;
- archetyp zakupu;
- kanał realizacji zakupu;
- wsparcie systemowe;
- projekt przebiegu procesu zakupowego;
- konstrukcję umowy;
- gotowość organizacyjną do wdrożenia.

Badanie nie może zastąpić tych konstrukcji jedną etykietą procesu. Obowiązkowe
terminy prawne należy identyfikować osobno i nie traktować ich jako przejawu
preskryptywności organizacyjnej.

## 2. Ekspozycja badawcza

### 2.1 Indeks preskryptywności ex ante

Na potrzeby badania proponowany jest indeks preskryptywności projektu przebiegu
procesu obowiązującego w chwili autoryzacji potrzeby. Indeks jest ekspozycją
badawczą. Nie jest parametrem modelu 2.3, wynikiem profilu w serwisie,
miernikiem dojrzałości ani rekomendacją przebiegu.

Źródłem są wersje polityki zakupowej, macierzy uprawnień i skonfigurowanego
obiegu zakupowego obowiązujące w dacie `exposure_reference_at`. Ta data musi być
ustalona przed analizą wyników.

### 2.2 Proponowane składowe

| Składowa | Operacjonalizacja | Źródło |
|---|---|---|
| Bramy decyzyjne | liczba wymaganych zatwierdzeń przed wszczęciem | macierz uprawnień |
| Wymuszona sekwencja | liczba zależności, których nie wolno realizować równolegle | polityka i konfiguracja obiegu zakupowego |
| Głębokość eskalacji | liczba poziomów uprawnień dla danej klasy wartości | macierz uprawnień |
| Wymagane artefakty | liczba obowiązkowych dokumentów bez dopuszczonego wariantu uproszczonego | polityka |
| Autonomia zespołu | odwrócona możliwość zmiany zakresu bez ponownego zatwierdzenia | polityka i log zmian |

Pozycje są standaryzowane i sumowane z równymi wagami wyłącznie po pozytywnym
pilotażu pomiaru. Składowe należy również raportować osobno. Alternatywne wagi
mają status eksploracyjny.

Z ekspozycji wyklucza się długość ścieżki krytycznej i udział czasu
oczekiwania. Obie wielkości współtworzą wynik czasu, więc ich włączenie
powodowałoby mechaniczne powiązanie ekspozycji z wynikiem.

### 2.3 Reguły przeciwdziałające wyciekowi informacji

1. Koder ekspozycji nie widzi czasu, ceny, liczby ofert, aneksów ani wyniku
   dostawy.
2. Kodowanie wykorzystuje wyłącznie dokumenty obowiązujące nie później niż
   `exposure_reference_at`.
3. Podręcznik kodowania zostaje zamrożony przed pierwszym kodowaniem badania
   właściwego.
4. Co najmniej dwóch koderów pracuje niezależnie.
5. Zgodność pozycji uznaniowych jest raportowana współczynnikiem Krippendorffa.
   Próg `alpha >= 0,80` jest prerejestrowaną decyzją projektową. Pozycja poniżej
   progu jest przeprojektowana albo usunięta, a nie uśredniona.

## 3. Hipotezy i dopasowanie do komponentów

- **H1a:** większa preskryptywność ex ante wiąże się z większą liczbą dni od
  zatwierdzenia potrzeby do podpisania umowy, warunkowo względem złożoności,
  granicy prawnej, rodziny procedury i liczby właściwych obowiązkowych dni
  oczekiwania. **H1b:** przy tych samych kontrolach wiąże się z większą liczbą
  godzin koordynacji kupca, prawnika i kierownika.
- **H2:** szerszy dostęp do rynku określony ex ante wiąże się z większą liczbą
  ważnych ofert i niższą ceną wyboru względem prerejestrowanego, niezależnego
  benchmarku.
- **H3:** większa sztywność klauzul zmiany określona ex ante wiąże się z większą
  liczbą formalnych aneksów na rok kontraktu. Po uwzględnieniu konstrukcji
  klauzul związek z liczbą bram procesu powinien mieścić się w prerejestrowanej
  granicy równoważności.
- **H4:** dla potrzeb sklasyfikowanych przed wyborem procesu jako niekompletne
  adaptacyjne odkrywanie wiąże się z większym nakładem ról przed wszczęciem,
  lecz z mniejszą liczbą dni wyjaśnień i ponownej pracy po rozpoczęciu
  konkurencji niż projekt sekwencyjny. Obie interakcje powinny być nieobecne
  albo mieścić się w prerejestrowanych granicach równoważności dla potrzeb
  sklasyfikowanych jako stabilne.
- **H5:** wyższy odsetek wymaganych kontroli faktycznie zarejestrowanych w
  systemie wiąże się z mniejszą liczbą akceptacji lub zamówień poza systemem
  oraz mniejszą liczbą braków w śladzie audytowym. Samo posiadanie systemu i
  odpowiedzi o gotowości nie zastępują obserwacji użycia.

Każda hipoteza wymaga odrębnego modelu i miar odpowiadających konkretnej
konstrukcji. Nie wolno używać jednej miary jako ekspozycji i wyniku w tej samej
specyfikacji.

## 4. Przypadki ukierunkowujące pomiar

Scenariusze 2.3 służą do formułowania pytań i testów, nie jako obserwacje.

### 4.1 Warunki z mechanizmem pracy adaptacyjnej

- Transformacja ERP może wymagać wczesnego zdefiniowania problemu i modularnego
  podejścia, gdy wymagania są niepełne.
- Przeprojektowanie usługi logistycznej może wymagać kontaktu z rynkiem w celu
  sprawdzenia poziomów usług, interfejsów danych i podziału ryzyka.
- Publiczny zakup IT może korzystać ze wstępnych konsultacji rynkowych przed
  postępowaniem otwartym, przy niezmiennych terminach ustawowych.
- Odkrywanie i współprojektowanie rozwiązania może zwiększać czas i nakład pracy,
  ponieważ uczenie się i ponowne określenie zakresu są odrębnymi czynnościami.

### 4.2 Warunki bez odrębnego mechanizmu pracy

- Stabilna, standardowa usługa może wymagać tych samych czynności w obu
  projektach przebiegu.
- Zamówienie katalogowe może mieć identyczną mapę po ustanowieniu umowy ramowej
  i katalogu.
- Zwolnienie zlecenia MRP może mieć identyczną mapę, gdy korzysta z obowiązującej
  umowy i zatwierdzonych danych materiałowych.

Scenariusz stabilnej usługi osobno deklaruje różnicę konkurencji i nie jest
neutralną kontrolą kosztu całkowitego. Scenariusze katalogowy i MRP są
neutralnymi kontrolami instrumentu. Równe mapy i brak różnicy konkurencji
powinny dawać równy wynik.

## 5. Wyniki

### 5.1 Wynik główny

`log(dni cyklu zakupowego)` od autoryzacji potrzeby do podpisania umowy, na
podstawie audytowalnych znaczników czasu.

Obowiązkowe terminy prawne pozostają częścią wyniku głównego. Zmienna
`applicable_mandatory_wait_days` jest wyznaczana według stanu prawnego na dzień
wszczęcia, granicy, rodziny procedury, przedmiotu zamówienia i sposobu
komunikacji. Wchodzi do specyfikacji głównej jako jawna kontrola. Obserwacja bez
danych pozwalających ją rozstrzygnąć nie trafia do estymacji H1. Analiza
wrażliwości może odjąć wyłącznie te zidentyfikowane terminy; nie odejmuje
pozostałych kolejek organizacyjnych.

Transformacja logarytmiczna jest przyjętą decyzją modelową do oceny po
pilotażu. Jeżeli dane nie spełnią jej przesłanek, zmiana musi zostać
udokumentowana przed badaniem właściwym.

### 5.2 Wyniki wtórne

Modelowane osobno:

- nakład pracy według roli;
- liczba ważnych ofert;
- cena względem benchmarku ustalonego ex ante;
- liczba i typ aneksów;
- udokumentowane odstępstwa od procesu;
- ustalenia kontroli lub audytu;
- miary wykonania dostawy.

### 5.3 Zmienne kontrolne

| Dozwolone przed ekspozycją | Niedozwolone jako kontrole po ekspozycji |
|---|---|
| wartość szacunkowa, kategoria CPV, złożoność techniczna, pilność zadeklarowana przed wszczęciem, rok, efekty stałe organizacji | liczba ofert, cena względem benchmarku, aneksy, wykonanie dostawy |

Liczba ofert jest wynikiem w modelu konkurencji. Nie może równocześnie pełnić
roli kontroli w modelu czasu, jeżeli projekt procesu mógł wpłynąć na dostęp do
rynku lub pracochłonność oceny.

Twierdzenia o braku samodzielnego efektu wymagają testu równoważności z
prerejestrowanymi granicami praktycznymi. Wartość `p > 0,05` nie potwierdza
braku efektu.

## 6. Warstwy danych

### 6.1 Warstwa rejestrowa

BZP, TED i e-Zamówienia mogą dostarczyć identyfikatory, CPV, wartość, tryb, daty
ogłoszenia i udzielenia, liczbę ofert, kryteria oraz opublikowane zmiany umowy.

Warstwa rejestrowa nie dostarcza pełnego projektu wewnętrznego, roboczogodzin,
dziennych kosztów zwłoki, pełnego TCO ani obserwacji nieformalnych obejść. Służy
do opisu populacji, doboru próby, oceny reprezentatywności i badań rozkładu
wokół progów.

### 6.2 Warstwa organizacyjna

Wymagane, zależnie od hipotezy:

- logi obiegu zakupowego lub ERP ze znacznikami czasu;
- wersjonowana macierz uprawnień;
- wersjonowana polityka zakupowa;
- konfiguracja systemowych bram i wyjątków;
- ewidencja czasu pracy, jeżeli istnieje;
- rejestr aneksów i odstępstw;
- dokumenty zamówienia i dane wykonania.

Cel rekrutacyjny dla pomiaru i asocjacji to 4 do 6 organizacji oraz co najmniej
60 zdarzeń w każdej. Jest to cel wykonalności, nie dowód wystarczającej mocy.
Wariant przyczynowy wymaga większej liczby niezależnych klastrów i porównywalnych
interwencji. Ich liczbę określi symulacja po pilotażu.

## 7. Strategie identyfikacji

### 7.1 Wariant A: dopasowane zdarzenia wewnątrz organizacji

Podstawowa specyfikacja:

`log(dni) = beta x prescriptiveness + gamma'X + alpha_organizacja + delta_CPV + theta_rok + epsilon`

Zdarzenia są porównywane wewnątrz organizacji i kategorii. Błędy standardowe są
klastrowane na poziomie organizacji. Przy mniej niż 30 klastrach planowany jest
wild cluster bootstrap. Przy 4 do 6 klastrach także ta korekta nie zapewnia
pewnej inferencji, dlatego wyniki pozostają eksploracyjne i wymagają analizy
leave-one-organisation-out.

Wariant identyfikuje asocjację warunkową. Nie rozwiązuje endogenicznego
kierowania trudniejszych zakupów do bardziej preskryptywnego przebiegu.

### 7.2 Wariant B: jednorazowa zmiana projektu procesu

Warunkowe rozszerzenie przyczynowe wymaga jasno zdefiniowanej, porównywalnej
zmiany oraz grup jeszcze nieobjętych zmianą. Przy zróżnicowanych terminach
można rozważyć estymator staggered DiD odporny na heterogeniczne efekty w
czasie, na przykład Callaway-Sant'Anna lub Sun-Abraham. Naiwna regresja z
dwukierunkowymi efektami stałymi nie jest specyfikacją domyślną.

Wymagane są:

- ocena trendów przed zmianą;
- prerejestrowane okno antycypacji;
- brak równoległej transformacji wpływającej na wynik;
- wiarygodne grupy porównawcze;
- udokumentowanie, jak interwencja zmieniła ekspozycję.

Brak widocznych różnic trendów przed zmianą nie dowodzi trendów równoległych.
Wariant B staje się podstawą wnioskowania przyczynowego tylko wtedy, gdy dane
spełnią warunki i symulacja wykaże użyteczną moc.

### 7.3 Wariant C: próg ustawowy

Zmiana progu stosowania PZP ze 130 000 do 170 000 zł od 1 stycznia 2026,
wskazana w dotychczasowym planie jako Dz.U. 2025 poz. 1173, może tworzyć
nieciągłość. Przed wykorzystaniem należy ponownie zweryfikować podstawę prawną
i brak innych zmian w tym samym czasie.

Analiza jest dopuszczalna wyłącznie po testach gęstości, ciągłości kowariat
przed ekspozycją i ocenie sortowania wokół progu. Szucs (2024) pokazuje ryzyko
manipulacji wartością przy progach w podobnej klasie danych. Usunięcie
obserwacji najbliżej progu nie przywraca identyfikacji automatycznie. Wariant C
nie stanowi podstawy planu głównego.

## 8. Wielkość próby i moc

### 8.1 Minimalny istotny efekt

Dla wyniku czasu proponuje się MSI równy 10 procent na jedno odchylenie
standardowe indeksu badawczego:

`beta_MSI = ln(1,10) ~= 0,095`

To decyzja projektowa do akceptacji przed zebraniem danych, a nie wartość
pochodząca z benchmarku. Nakład pracy i każdy inny wynik wymagają własnego MSI
w swojej skali. Wariant B wymaga odrębnego minimalnego istotnego ATT.

### 8.2 Pilotaż i symulacja

Pilotaż obejmuje planistycznie 2 organizacje po 25 zdarzeń. Służy wyłącznie do:

- oceny wykonalności kodowania;
- oszacowania `sd(log dni)` i ICC;
- oceny kompletności logów;
- rozpoznania rozkładu ekspozycji i struktury klastrów.

Po pilotażu prerejestrowana symulacja Monte Carlo ma odtworzyć planowany
estymator, liczbę i wielkość klastrów, terminy interwencji, braki danych i MSI.
Raport powinien podać moc oraz minimalny wykrywalny efekt dla kilku wykonalnych
wariantów liczby organizacji.

## 9. Prerejestracja

Przed estymacją badania właściwego należy zamrozić w OSF:

- okno czasowe i populację;
- skład ekspozycji;
- wyniki i kontrole przed ekspozycją;
- estymator i poziom klastrowania;
- reguły wyłączeń i braków danych;
- MSI i granice równoważności;
- plan testów wielokrotnych;
- kryteria przejścia z wariantu A do B;
- reguły aktualizacji parametrów i próbę odłożoną.

Analizy nieprzewidziane są oznaczane jako eksploracyjne. Dziennik odstępstw od
planu jest publikowany także wtedy, gdy nie odnotowano odstępstw.

## 10. Walidacja komponentów modelu 2.3

### 10.1 Kolejność

1. **Rekonstrukcja:** czy z dokumentów można odtworzyć mapę kroków,
   poprzedników, aktywnej pracy, kolejek i legalnych blokad?
2. **Komponenty:** czy przewidywany czas i nakład pracy odpowiadają obserwowanym
   komponentom na danych odłożonych?
3. **Kalibracja zakresu:** jak często obserwacja mieści się w zadeklarowanym
   zakresie oraz jak szeroki jest zakres względem rozrzutu obserwowanego?
4. **Wartość dodana:** czy predykcja komponentu przewyższa prostą bazę, na
   przykład medianę kategorii?
5. **Błędy:** które elementy zawodzą, z rozbiciem na czas, role, koszty
   niepracownicze i objęte monetyzacją elementy konstrukcji umowy?

Parametry można aktualizować na próbie treningowej. Ocena końcowa wymaga próby
odłożonej albo późniejszego okresu. Zakresów nie wolno poszerzać wyłącznie po
to, aby poprawić odsetek pokrycia.

### 10.2 Granica walidacji delty

Pełna walidacja `deltaCost` wymaga wiarygodnego kontrfaktycznego porównania obu
projektów procesu oraz niezależnie uzasadnionego dziennego kosztu zwłoki.
Zwykły rejestr pojedynczego zdarzenia nie dostarcza żadnego z tych elementów.

Dziennego kosztu zwłoki nie można odzyskać bezpośrednio z BZP, TED ani typowych
logów obiegu zakupowego. Wymaga osobnego protokołu z właścicielem wyniku biznesowego,
prowadzonego przed poznaniem czasu badanego cyklu, z jawnym mechanizmem takim
jak utracona marża, przestój lub koszt rozwiązania zastępczego. Do tego czasu
kanał opóźnienia pozostaje wejściem użytkownika i jest raportowany oddzielnie.

Koszt aneksów i TCO ma w natywnych scenariuszach różnicę równą zero.
Nie wolno oceniać tych kanałów jako skalibrowanych prognoz. Nieformalne
obejście procesu jest nieobjęte monetyzacją.

## 11. Warunki osłabienia hipotez

Hipotezy słabną, jeżeli po uwzględnieniu złożoności i zgodnie z
prerejestracją:

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
- model komponentowy nie przewyższa prerejestrowanej prostej bazy.

Heterogeniczność nie jest automatycznie potwierdzeniem tezy. Musi odpowiadać
prerejestrowanemu mechanizmowi i wystąpić na danych nieużytych do dopasowania.
Wynik zerowy lub przeciwny pozostaje wynikiem badania.

## 12. Materiał praktyczny jako źródło pytań

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) wskazuje pytania o wewnętrznego
właściciela wdrożenia, tarcie procesowe, dyscyplinę wymagań, zakupy operacyjne,
uproszczenie polityki zakupowej, TCO i ograniczone zastosowanie AI. Materiał ma
charakter wywiadu praktycznego, a transkrypcja pochodzi z automatycznych napisów
w języku polskim.

Materiał może służyć do projektowania pytań wywiadu i hipotez. Nie jest źródłem
efektu, parametru, progu, odpowiedzi w samoopisie gotowości ani dowodu przyczynowego. Bielik może
porządkować dane rynkowe do weryfikacji, ale rachunek wykonuje jawny model
deterministyczny.

## 13. Harmonogram decyzyjny

| Okres | Rezultat |
|---|---|
| Miesiąc 1 | zamrożony podręcznik kodowania i test na dokumentach publicznych |
| Miesiące 1 do 2 | rekrutacja, umowy dostępu, ocena etyczna i prawna |
| Miesiąc 2 | pilotaż 2 razy 25 zdarzeń, zgodność koderów i kompletność danych |
| Miesiąc 3 | symulacja mocy i prerejestracja |
| Miesiące 3 do 5 | kodowanie danych organizacyjnych i przygotowanie warstwy rejestrowej |
| Miesiąc 6 | estymacja komponentów i testy odporności |
| Miesiąc 7 | walidacja na próbie odłożonej i przygotowanie artykułu 3 |

Największym ryzykiem wykonalności jest dostęp do wersjonowanych danych
organizacyjnych z kilku niezależnych organizacji. Jeżeli rekrutacja nie zapewni
wystarczającej liczby klastrów, zakres należy ograniczyć do walidacji pomiaru,
asocjacji i studium wykonalności.

## 14. Etyka, bezpieczeństwo i replikacja

Dane organizacyjne mogą zawierać dane osobowe, tajemnice przedsiębiorstwa i
sygnały nieprawidłowości. Przed pozyskaniem wymagane są odpowiednia podstawa
prawna, minimalizacja, ograniczenie dostępu, plan retencji i ocena etyczna.
Publikacja powinna wykorzystywać agregaty i kontrolę ryzyka identyfikacji
zamawiającego, wnioskodawcy biznesowego i wykonawcy.

Pakiet badawczy obejmuje słownik danych, kod pobrania i czyszczenia, manifest
wersji źródeł, prerejestrację, skrypty tabel i dziennik odstępstw. Chronione dane
surowe nie muszą być publiczne. Syntetyczny zestaw testowy powinien umożliwiać
audyt kodu bez ujawniania danych organizacyjnych.

Tabele wynikowe generuje kod ze wskazanego, zamrożonego zbioru analitycznego.
Nie należy wpisywać ich ręcznie.
