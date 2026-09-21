# Jak porównać koszty dwóch przebiegów zakupu? Model ProcuraCost 2.3

**Artykuł 2 cyklu doktorskiego | ekonomia i finanse | szkic metodologiczny**

## Streszczenie

ProcuraCost 2.3 porównuje koszt dwóch sposobów przeprowadzenia tego samego
zakupu w tych samych ramach prawnych i przy tych samych zasadach ładu
zakupowego. Dla każdego wariantu wykorzystuje osobną mapę zależności,
oblicza ścieżkę krytyczną i rozdziela koszt pracy według ról, koszt niepracowniczy, koszt
zwłoki oraz objęte monetyzacją elementy konstrukcji umowy. Obowiązkowe terminy
prawne są stałe i wspólne dla obu wariantów. Wynik ma znak dodatni, ujemny albo
zerowy zależnie od jawnych danych wejściowych. Zakresy niski, centralny i wysoki
są scenariuszami, nie przedziałami ufności. Obliczenie jest deterministyczne;
nie szacuje efektu przyczynowego ani nie wskazuje procedury do wyboru.
Gotowość organizacyjna jest opisywana oddzielnie.

## 1. Obiekt porównania

Porównywane są:

- `formalSequential`, czyli formalny i sekwencyjny projekt przebiegu;
- `adaptiveCompliant`, czyli adaptacyjny i zgodny projekt przebiegu.

Oba warianty dotyczą tego samego zakupu oraz zadeklarowanych ram prawnych i ładu
zakupowego. W postępowaniu objętym PZP adaptacja oznacza wybór i sekwencjonowanie
dopuszczalnej pracy wewnątrz właściwej procedury. Nie oznacza odstępstwa od
ustawy.

Opis zakupu rozdziela następujące obszary:

1. ramy prawne i ład zakupowy;
2. rodzina procedury;
3. archetyp zakupu;
4. kanał realizacji zakupu;
5. wsparcie systemowe;
6. projekt przebiegu procesu zakupowego dla każdego wariantu;
7. konstrukcja umowy dla każdego wariantu;
8. data wszczęcia, według której moduł prawny ustala obowiązkowe terminy.

Gotowość organizacyjna do wdrożenia jest badana osobno. Nie jest ani wejściem,
ani wynikiem modelu kosztowego.

## 2. Wersje modelu, danych i reguł

Rekord modelu 2.3 zawiera:

- `schemaVersion: 2`;
- `modelVersion: 2.3.0`;
- `calibrationId: source-scenario-2026-08-28`;
- `legalRulesetId: pl-pzp-2026-2027`.

Ten zestaw identyfikuje strukturę danych, wersję obliczeń, rejestr założeń oraz
reguły prawne. Wersja serwisu nie zastępuje wersji modelu.

Starsze linki przechodzą przez jawny adapter migracji. Migracja dokładna lub
częściowa pozostawia ślad w rekordzie decyzji. Migracja niejednoznaczna blokuje
obliczenie do czasu potwierdzenia brakujących pól.

## 3. Reprezentacja przebiegu procesu

Każdy wariant jest skierowanym grafem acyklicznym. Krok zawiera:

- identyfikator i etykietę;
- listę poprzedników;
- aktywny czas pracy;
- czas oczekiwania;
- nakład godzin według roli;
- koszt niepracowniczy;
- rodzaj kroku;
- pochodzenie blokady prawnej, jeżeli krok wynika z reguły prawnej.

Dla wariantu wartości `r` (niskiego, centralnego lub wysokiego) czas zakończenia kroku `s` wynosi:

`finish_r(s) = max(finish_r(p)) + activeDays_r(s) + queueDays_r(s)`

Dla kroku bez poprzednika część `max` wynosi zero. Czas całego wariantu jest
najpóźniejszym czasem zakończenia, czyli długością ścieżki krytycznej.

Rozdzielenie czasu aktywnego, kolejki i zależności pozwala opisać sekwencje,
pracę równoległą oraz ponowne połączenie gałęzi. Koszt ról i koszt
niepracowniczy obejmują wszystkie kroki, nie tylko ścieżkę krytyczną.

Zaplanowane powtórzenie pracy wymaga osobnego kroku z własnym czasem i nakładem.
Graf acykliczny nie symuluje nieograniczonej pętli poprawek ani nie przewiduje
liczby iteracji potrzebnych w rzeczywistym projekcie.

Silnik odrzuca cykle, nieznanych poprzedników, zduplikowane identyfikatory i
zmiany w obowiązkowych terminach prawnych.

## 4. Ustalanie obowiązkowych terminów prawnych

Reguły `pl-pzp-2026-2027` obejmują daty wszczęcia od 1 stycznia 2026 do
31 grudnia 2027. Konteksty sektorowy oraz obronności i bezpieczeństwa są poza
zakresem tego modułu; ich wybór blokuje obliczenie i zwraca komunikat błędu.

Dla obsługiwanych klasycznych procedur PZP moduł tworzy kroki na podstawie
art. 283, art. 308 ust. 2, art. 138 ust. 1, art. 144 ust. 1,
art. 151 ust. 1 i art. 264 ust. 1 PZP. Dokładne wartości zależne od procedury,
przedmiotu i sposobu komunikacji opisuje rejestr parametrów.

Każda blokada prawna ma stałą wartość niską, centralną i wysoką, zero aktywnych
dni oraz identyczny czas oczekiwania w obu wariantach. Wsparcie systemowe nie
skraca tych kroków.

Moduł nie ocenia, czy w konkretnym postępowaniu zachodzi podstawa skrócenia,
wyjątku albo innego reżimu. Taka ocena należy do Zamawiającego i jego doradców.

## 5. Funkcje kosztu

Dla wariantu procesu `j` i wariantu wartości `r`:

`roleCost_j,r = sum(roleHours_j,r x roleHourlyRate_r)`

`nonLabourCost_j,r = sum(stepNonLabourCost_j,r)`

`delayCost_j,r = elapsedDays_j,r x dailyCostOfInaction_r`

`contractCost_j,r = sum(monetisedContractDimension_j,r)`

`total_j,r = roleCost_j,r + nonLabourCost_j,r + delayCost_j,r + contractCost_j,r`

Różnica centralna jest zdefiniowana jako:

`deltaCost = total_formalSequential,central - total_adaptiveCompliant,central`

Zakres zewnętrzny wynosi:

`low = total_formalSequential,low - total_adaptiveCompliant,high`

`high = total_formalSequential,high - total_adaptiveCompliant,low`

Przeciwne końce zakresów mogą łączyć różne wartości wejść wspólnych dla obu
wariantów. Przecięcie zera przez tę obwiednię nie dowodzi odwrócenia znaku przy
jednym dopuszczalnym zestawie wspólnych założeń. Wymaga to osobnej analizy,
w której wspólne wejścia zmienia się jednocześnie w obu wariantach.

Dodatnia wartość oznacza wyższy koszt wariantu
`formalSequential` przy zadeklarowanych wejściach. Ujemna oznacza wyższy koszt
`adaptiveCompliant`. Zero jest prawidłowym wynikiem.

Zamiana wariantów musi zamienić ich wyniki, odwrócić znak delty i odwrócić
zakres zewnętrzny. Model nie zawiera warunku, który wymusza preferowany znak.

## 6. Zakresy i status dowodowy

Każde wejście zawiera wartość niską, centralną i wysoką, rodzaj zakresu,
klasę dowodu oraz identyfikatory źródeł. Obowiązuje porządek
`low <= central <= high`.

Te trzy wartości opisują deklarowane scenariusze. Nie są kwantylami,
rozkładami prawdopodobieństwa ani przedziałami ufności. Obliczenie wykorzystuje
osobno zestawy wartości niskich, centralnych i wysokich, a następnie tworzy zewnętrzną
obwiednię różnicy.

Rejestr rozróżnia:

- kotwice empiryczne;
- przypadki oficjalne;
- obserwacje praktyków;
- scenariusze ilustracyjne;
- hipotezy badawcze;
- założenia przeniesione z poprzedniej wersji;
- dane użytkownika;
- reguły prawne.

Ta klasyfikacja nie ocenia jakości całego źródła. Określa, do jakiego twierdzenia
wolno go użyć.

## 7. Kanały konstrukcji umowy

### 7.1 Transfer konkurencji

Test warunkowy z wartościami 2, 6 i 9 procent jest stosowany tylko wtedy, gdy porównanie jawnie
zakłada różnicę dostępu do konkurencji. Spośród scenariuszy startowych tylko
`stable_private_standard_service` deklaruje taką różnicę i przypisuje koszt
wariantowi adaptacyjnemu. W kalkulatorze użytkownik może wskazać dowolny
wariant z ograniczonym dostępem dostawców albo wyłączyć ten kanał:

`competitionTransfer = contractValue x {0,02; 0,06; 0,09}`

Jeżeli dostęp do konkurencji nie różni się, oba warianty otrzymują zero.

Szucs (2024) dostarcza kotwicy dla kanału cenowego dyskrecji w węgierskich
zamówieniach poniżej właściwego progu. Nie identyfikuje skutku projektu
przebiegu procesu w Polsce. Przyjęcie tych wartości w ProcuraCost jest
założeniem scenariuszowym, a nie polską estymatą.

### 7.2 Zmiany umowy i TCO

Natywne scenariusze 2.3 mają zerową różnicę kosztu aneksów i TCO. Literatura o
niepełnych kontraktach oraz aneksach uzasadnia pytania badawcze, ale nie
dostarcza konwencji określającej znak i przypisanie kosztu do dwóch map procesu.

Analiza TCO może być przygotowana jako odrębny rachunek dla zakupu. Narzędzie
językowe, w tym Bielik, może porządkować dane rynkowe do weryfikacji przez
człowieka. Jawny model deterministyczny wykonuje obliczenie.

### 7.3 Nieformalne obejście procesu

Obejście procesu jest ujawnione jako wymiar nieobjęty monetyzacją. Model nie
wnioskuje prawdopodobieństwa obejścia z nazwy wariantu, posiadania systemu ani
odpowiedzi w samoopisie gotowości. Do monetyzacji potrzebna byłaby obserwowana częstość,
ekspozycja ekonomiczna i odrębna metoda.

## 8. Pochodzenie założeń i wartości kroków

Wartości ekonomiczne, agregaty bazowych dni, stawki ról, profile wsparcia i
centralne koszty zwłoki zostały przeniesione z rejestru 2.2.2 jako
`retained_legacy_assumption`. W pięciu mapach referencyjnych model 2.3
wprowadza przykładową kolejność kroków i przypisuje im dni oraz godziny pracy
poszczególnych ról. Zapis pochodzenia pozwala odtworzyć te założenia.
Wartości nie są estymatami z danych organizacyjnych.

Domyślny zakres dziennego kosztu zwłoki wynosi 0,25, 1 i 4 razy wartość
centralną. Model nie potrafi zweryfikować tego wejścia. W zastosowaniu
organizacyjnym należy je wyprowadzić z jawnego mechanizmu, na przykład
utraconej marży, przestoju albo kosztu rozwiązania zastępczego.

Profile wsparcia systemowego modyfikują czasy aktywne, nakład ról oraz
zadeklarowane koszty koordynacji i narzędzia. Są założeniami startowymi, a nie
szacunkiem efektu wdrożenia. W pięciu mapach referencyjnych są stosowane do
nowych wartości przypisanych krokom; rekord decyzji ujawnia oba źródła założeń.
Nie przekładają się na gotowość organizacyjną.

## 9. Scenariusze i warunki zastosowania

Rejestr zawiera dziesięć scenariuszy. Służą do demonstracji mechanizmów,
testowania neutralności oraz zapisu pochodzenia założeń.

### 9.1 Zmiany czynności i zależności

- Transformacja ERP przy niepełnym wymaganiu może wykorzystywać definiowanie
  problemu i modularne podejście.
- Przeprojektowanie usługi logistycznej może wykorzystywać kontakt z rynkiem do
  sprawdzenia poziomów usług, interfejsów i podziału ryzyka.
- Publiczny zakup IT może korzystać ze wstępnych konsultacji rynkowych przed
  postępowaniem otwartym, bez zmiany obowiązkowych terminów.
- Odkrywanie i współprojektowanie może zwiększać czas i nakład pracy, jeżeli
  uczenie się oraz ponowne określenie zakresu są rzeczywistymi czynnościami.

### 9.2 Porównania o identycznym przebiegu

Stabilna standardowa usługa może wymagać tej samej pracy w obu wariantach.
Jej scenariusz startowy osobno deklaruje jednak różnicę konkurencji, więc nie
jest neutralną kontrolą kosztu całkowitego. Zamówienie katalogowe i zwolnienie
zlecenia MRP mają identyczne mapy i brak różnicy konkurencji. Są neutralnymi
kontrolami. Ich centralna delta wynosi zero.

Przykłady opisują warunki, nie zalecenia. Oficjalne przypadki z Kalifornii,
OECD, UZP i Komisji Europejskiej wspierają mechanizmy jakościowe, lecz nie
wyznaczają czasów ani kosztów scenariuszy. Aneks B raportu OECD (2024)
opisuje niemal rok definiowania problemu RVUL i uruchomienie konsultacji
20 września 2023 r.; nie dokumentuje zakończonego wdrożenia ani oszczędności.

## 10. Rekord decyzji i zakres rachunku

Rekord decyzji ujawnia:

1. pełny zestaw metadanych i status migracji;
2. osie kontekstu;
3. obie mapy przebiegu i konstrukcje umowy;
4. wynik każdego wariantu i deltę;
5. udział poszczególnych kanałów w różnicy;
6. zakres monetyzacji i dokładne ścieżki założeń;
7. wymiary nieobjęte monetyzacją;
8. pochodzenie wartości przypisanych krokom, założenia przeniesione,
   dowody zewnętrzne i pochodzenie prawne.

Interpretacja sumy wymaga sprawdzenia jej składników oraz listy skutków
pozostawionych poza rachunkiem.

## 11. Diagnostyka i replikacja

Diagnostyka dla wszystkich dziesięciu scenariuszy sprawdza:

- zgodność metadanych;
- uporządkowanie zakresów;
- tożsamość delty;
- neutralność scenariuszy kontrolnych;
- wspólne i zablokowane terminy prawne;
- symetrię po zamianie wariantów.

Pakiet replikacyjny generuje deterministyczne JSON, CSV i Markdown z tego samego
rejestru i silnika, których używa aplikacja. Stała kolejność scenariuszy i brak
znacznika czasu pozwalają sprawdzić, czy ponowne uruchomienie daje te same pliki.

Replikacja potwierdza zgodność ścieżki obliczeniowej. Nie potwierdza
empirycznej trafności wejść ani prawidłowości wyboru procedury dla konkretnego
zakupu.

## 12. Walidacja empiryczna

Walidacja powinna objąć:

- możliwość odtworzenia map z wersjonowanych dokumentów i logów;
- zgodność przewidywanego czasu z obserwowanym czasem;
- zgodność nakładu ról z ewidencją;
- dostęp do konkurencji i liczbę ważnych ofert;
- konstrukcję klauzul oraz aneksy;
- zaobserwowane użycie kontroli systemowych.

Pełna walidacja delty wymaga wiarygodnego kontrfaktycznego wyniku dla drugiego
wariantu i niezależnie uzasadnionego dziennego kosztu zwłoki. Pojedynczy rekord
zakupu nie dostarcza obu elementów.

Ocena na próbie testowej powinna raportować błąd składnika, pokrycie przez
zakres, szerokość zakresu i porównanie z prostą metodą odniesienia. Nie wolno poszerzać zakresu
wyłącznie w celu zwiększenia pokrycia.

## 13. Wkład i ograniczenia

Artykuł opisuje sposób obliczania i zapisu porównania dwóch map procesu.
Przy każdym wyniku można odtworzyć użyte założenia, zakres monetyzacji i test
symetrii. Model rozdziela składniki policzonej różnicy oraz skutki, których
wartości nie wyznacza.

Model nie szacuje pełnego dobrobytu społecznego, jakości trudnej do
monetyzacji, wszystkich sankcji ani ryzyka prawnego. Nie obejmuje procedur
sektorowych oraz obronności i bezpieczeństwa. Nie jest opinią prawną,
benchmarkiem organizacji ani rekomendacją procedury.

## 14. Obserwacje praktyków

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) wskazuje pytania o właściciela
wdrożenia, tarcie procesu, wymagania, zakupy operacyjne, uproszczenie polityki,
TCO i ograniczone zastosowanie AI. Do opracowania tej rozmowy wykorzystano
automatyczne napisy w języku polskim, niezweryfikowane przez człowieka.

Może służyć do projektowania pytań i hipotez. Nie może ustalać wartości,
zakresów, odpowiedzi w samoopisie gotowości ani progu decyzyjnego.

## Bibliografia

Bajari, P., Houghton, S., i Tadelis, S. (2014). Bidding for Incomplete
Contracts: An Empirical Analysis of Adaptation Costs. *American Economic Review,
104*(4), 1288-1319. https://doi.org/10.1257/aer.104.4.1288

California Department of Technology. (2022, 3 sierpnia). California Redefines State
Technology Procurement.
https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/

European Commission. (2021). *Guidance on Innovation Procurement*.
Niewiążące wytyczne; strona katalogowa z 21 czerwca 2021 r.
https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement

OECD. (2024). *Public Procurement in Lithuania: Increasing Efficiency through
Centralisation and Professionalisation*. OECD Public Governance Reviews,
OECD Publishing. Aneks B, przykład pilotażu RVUL.
https://doi.org/10.1787/aa1b196c-en
https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117-160.
https://doi.org/10.1093/jeea/jvad017

Urząd Zamówień Publicznych. (b.d.). *Wstępne konsultacje rynkowe*.
https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe

## Źródła prawne

Ustawa z dnia 11 września 2019 r. Prawo zamówień publicznych,
Dz.U. 2019 poz. 2019, z późn. zm. Lokalizatory terminów omawianych w sekcji 4:
art. 283, art. 308 ust. 2, art. 138 ust. 1, art. 144 ust. 1, art. 151 ust. 1
i art. 264 ust. 1; konsultacje rynkowe: art. 84–85.
https://eli.gov.pl/eli/DU/2019/2019/ogl

Ustawa z dnia 25 lipca 2025 r. o zmianie ustawy Prawo zamówień publicznych
oraz niektórych innych ustaw, Dz.U. 2025 poz. 1173, art. 1 pkt 1,
art. 7–8 i art. 11. Zmiana progu na 170 000 zł obowiązuje od 1 stycznia
2026 r. w określonym ustawą zakresie, z zachowaniem przepisów przejściowych.
https://eli.gov.pl/eli/DU/2025/1173/ogl

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r.
w sprawie aktualnych progów unijnych określonych w dyrektywach Parlamentu
Europejskiego i Rady 2014/24/UE, 2014/25/UE i 2009/81/WE na lata 2026–2027,
ich równowartości w złotych, równowartości w złotych kwot wyrażonych w euro
oraz średniego kursu złotego w stosunku do euro stanowiącego podstawę
przeliczania wartości zamówień publicznych lub konkursów, M.P. 2025 poz. 1247,
pkt 1–2 i załącznik.
https://eli.gov.pl/eli/MP/2025/1247/ogl

Metryki i przepisy o zmianie progów sprawdzono 21 września 2026 r.
Uzupełnienie bibliografii nie stanowi ponownego audytu wszystkich terminów
ustawowych ani ich implementacji. W zastosowaniu należy ustalić brzmienie
przepisów właściwe dla daty wszczęcia postępowania.
