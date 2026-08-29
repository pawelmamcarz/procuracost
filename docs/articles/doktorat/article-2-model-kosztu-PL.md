# Ile kosztuje projekt przebiegu procesu zakupowego? Model porównawczy ProcuraCost 2.3

**Artykuł 2 cyklu doktorskiego | ekonomia i finanse | szkic metodologiczny**

## Streszczenie

Artykuł przedstawia deterministyczny model porównujący dwa zgodne projekty
przebiegu procesu zakupowego dla tego samego zakupu i tych samych ram prawnych
oraz ładu zakupowego. Model 2.3 wykorzystuje dwie niezależne mapy zależności,
oblicza ścieżkę krytyczną i rozdziela koszt ról, koszt niepracowniczy, koszt
zwłoki oraz objęte monetyzacją elementy konstrukcji umowy. Obowiązkowe terminy
prawne są stałe i wspólne dla obu wariantów. Wynik ma znak dodatni, ujemny albo
zerowy zależnie od jawnych danych wejściowych. Zakresy niski, centralny i wysoki
są scenariuszami, nie przedziałami ufności. Model nie jest estymatorem,
rekomendacją procedury ani oceną gotowości organizacyjnej.

## 1. Obiekt porównania

Porównywane są:

- `formalSequential`, czyli formalny i sekwencyjny projekt przebiegu;
- `adaptiveCompliant`, czyli adaptacyjny i zgodny projekt przebiegu.

Oba warianty dotyczą tego samego zakupu oraz zadeklarowanych ram prawnych i ładu
zakupowego. W postępowaniu objętym PZP adaptacja oznacza wybór i sekwencjonowanie
dopuszczalnej pracy wewnątrz właściwej procedury. Nie oznacza odstępstwa od
ustawy.

Model zachowuje odrębność następujących osi:

1. ramy prawne i ład zakupowy;
2. rodzina procedury;
3. archetyp zakupu;
4. kanał realizacji zakupu;
5. wsparcie systemowe;
6. projekt przebiegu procesu zakupowego dla każdego wariantu;
7. konstrukcja umowy dla każdego wariantu;
8. data wszczęcia stosowana przez wersjonowany resolver prawny.

Gotowość organizacyjna do wdrożenia jest badana osobno. Nie jest ani wejściem,
ani wynikiem modelu kosztowego.

## 2. Kontrakt wersji

Natywny rekord 2.3 zawiera:

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

Dla przypadku zakresu `r` czas zakończenia kroku `s` wynosi:

`finish_r(s) = max(finish_r(p)) + activeDays_r(s) + queueDays_r(s)`

Dla kroku bez poprzednika część `max` wynosi zero. Czas całego wariantu jest
najpóźniejszym czasem zakończenia, czyli długością ścieżki krytycznej.

Rozdzielenie czasu aktywnego, kolejki i zależności pozwala opisać sekwencje,
pracę równoległą oraz ponowne połączenie gałęzi. Koszt ról i koszt
niepracowniczy obejmują wszystkie kroki, nie tylko ścieżkę krytyczną.

Silnik odrzuca cykle, nieznanych poprzedników, zduplikowane identyfikatory i
zmiany w obowiązkowych terminach prawnych.

## 4. Resolver prawny

Reguły `pl-pzp-2026-2027` obejmują daty wszczęcia od 1 stycznia 2026 do
31 grudnia 2027. Konteksty sektorowy oraz obronności i bezpieczeństwa są poza
zakresem pierwszego resolvera i kończą się kontrolowanym błędem.

Dla wspieranych klasycznych procedur PZP resolver tworzy kroki na podstawie
art. 283, art. 308 ust. 2, art. 138 ust. 1, art. 144 ust. 1,
art. 151 ust. 1 i art. 264 ust. 1 PZP. Dokładne wartości zależne od procedury,
przedmiotu i sposobu komunikacji opisuje rejestr parametrów.

Każda blokada prawna ma stałą wartość niską, centralną i wysoką, zero aktywnych
dni oraz identyczny czas oczekiwania w obu wariantach. Wsparcie systemowe nie
skraca tych kroków.

Resolver nie ocenia, czy w konkretnym postępowaniu zachodzi podstawa skrócenia,
wyjątku albo innego reżimu. Taka ocena należy do Zamawiającego i jego doradców.

## 5. Funkcje kosztu

Dla wariantu `j` i przypadku zakresu `r`:

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

Dodatnia wartość oznacza wyższy koszt wariantu
`formalSequential` przy zadeklarowanych wejściach. Ujemna oznacza wyższy koszt
`adaptiveCompliant`. Zero jest prawidłowym wynikiem.

Zamiana wariantów musi zamienić ich wyniki, odwrócić znak delty i odwrócić
zakres zewnętrzny. Model nie zawiera warunku, który wymusza preferowany znak.

## 6. Zakresy i status dowodowy

Każda wartość zawiera przypadek niski, centralny i wysoki, rodzaj zakresu,
klasę dowodu oraz identyfikatory źródeł. Obowiązuje porządek
`low <= central <= high`.

Trzy przypadki są deklarowanymi scenariuszami. Nie są kwantylami,
rozkładami prawdopodobieństwa ani przedziałami ufności. Obliczenie wykorzystuje
wyrównane przypadki niski, centralny i wysoki, a następnie tworzy zewnętrzną
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

Stres 2, 6 i 9 procent jest stosowany tylko wtedy, gdy porównanie jawnie
zakłada różnicę dostępu do konkurencji. Spośród scenariuszy startowych tylko
`stable_private_standard_service` deklaruje taką różnicę i przypisuje koszt
wariantowi adaptacyjnemu. W kalkulatorze użytkownik może wskazać dowolny
wariant z ograniczonym dostępem dostawców albo wyłączyć ten kanał:

`competitionTransfer = contractValue x {0,02; 0,06; 0,09}`

Jeżeli dostęp do konkurencji nie różni się, oba warianty otrzymują zero.

Szucs (2024) dostarcza kotwicy dla kanału cenowego dyskrecji w węgierskich
zamówieniach poniżej właściwego progu. Nie identyfikuje skutku projektu
przebiegu procesu w Polsce. Zakres ProcuraCost jest jawnym transferem
scenariuszowym, nie polską estymatą.

### 7.2 Zmiany umowy i TCO

Natywne scenariusze 2.3 mają zerową różnicę kosztu aneksów i TCO. Literatura o
niepełnych kontraktach oraz aneksach uzasadnia pytania badawcze, ale nie
dostarcza podpisanej konwencji alokacji kosztu pomiędzy dwie mapy procesu.

Analiza TCO może być przygotowana jako odrębny rachunek dla zakupu. Narzędzie
językowe, w tym Bielik, może porządkować dane rynkowe do weryfikacji przez
człowieka. Jawny model deterministyczny wykonuje obliczenie.

### 7.3 Nieformalne obejście procesu

Obejście procesu jest ujawnione jako wymiar nieobjęty monetyzacją. Model nie
wnioskuje prawdopodobieństwa obejścia z nazwy wariantu, posiadania systemu ani
odpowiedzi w samoopisie gotowości. Do monetyzacji potrzebna byłaby obserwowana częstość,
ekspozycja ekonomiczna i odrębna metoda.

## 8. Założenia przeniesione i ilustracyjne alokacje map

Wartości ekonomiczne, agregaty bazowych dni, stawki ról, profile wsparcia i
centralne koszty zwłoki zostały przeniesione z rejestru 2.2.2 jako
`retained_legacy_assumption`. W pięciu mapach mechanizmowych model 2.3
wprowadza ilustracyjną kolejność kroków, podział agregatu dni oraz alokację
godzin ról. Zachowanie pochodzenia umożliwia odtworzenie punktu startowego, ale
nie nadaje żadnej z tych klas statusu estymat.

Domyślny zakres dziennego kosztu zwłoki wynosi 0,25, 1 i 4 razy wartość
centralną. Model nie potrafi zweryfikować tego wejścia. W zastosowaniu
organizacyjnym należy je wyprowadzić z jawnego mechanizmu, na przykład
utraconej marży, przestoju albo kosztu rozwiązania zastępczego.

Profile wsparcia systemowego modyfikują czasy aktywne, nakład ról oraz
zadeklarowane koszty koordynacji i narzędzia. Są założeniami startowymi, a nie
szacunkiem efektu wdrożenia. W mapach mechanizmowych są stosowane do nowych
alokacji ilustracyjnych, dlatego rekord decyzji ujawnia obie klasy pochodzenia.
Nie przekładają się na gotowość organizacyjną.

## 9. Scenariusze i warunki zastosowania

Rejestr zawiera dziesięć scenariuszy. Służą do demonstracji mechanizmów,
testowania neutralności oraz zapisu pochodzenia założeń.

### 9.1 Warunki z odrębnym mechanizmem

- Transformacja ERP przy niepełnym wymaganiu może wykorzystywać definiowanie
  problemu i modularne podejście.
- Przeprojektowanie usługi logistycznej może wykorzystywać kontakt z rynkiem do
  sprawdzenia poziomów usług, interfejsów i podziału ryzyka.
- Publiczny zakup IT może korzystać ze wstępnych konsultacji rynkowych przed
  postępowaniem otwartym, bez zmiany obowiązkowych terminów.
- Odkrywanie i współprojektowanie może zwiększać czas i nakład pracy, jeżeli
  uczenie się oraz ponowne określenie zakresu są rzeczywistymi czynnościami.

### 9.2 Warunki bez odrębnego mechanizmu pracy

Stabilna standardowa usługa może wymagać tej samej pracy w obu wariantach.
Jej scenariusz startowy osobno deklaruje jednak różnicę konkurencji, więc nie
jest neutralną kontrolą kosztu całkowitego. Zamówienie katalogowe i zwolnienie
zlecenia MRP mają identyczne mapy i brak różnicy konkurencji. Są neutralnymi
kontrolami. Ich centralna delta wynosi zero.

Przykłady opisują warunki, nie zalecenia. Oficjalne przypadki z Kalifornii,
OECD, UZP i Komisji Europejskiej wspierają mechanizmy jakościowe, lecz nie
wyznaczają czasów ani kosztów scenariuszy.

## 10. Rekord decyzji i pokrycie

Rekord decyzji ujawnia:

1. pełny zestaw metadanych i status migracji;
2. osie kontekstu;
3. obie mapy przebiegu i konstrukcje umowy;
4. wynik każdego wariantu i deltę;
5. udział poszczególnych kanałów w różnicy;
6. zakres monetyzacji i dokładne ścieżki założeń;
7. wymiary nieobjęte monetyzacją;
8. wewnętrzną proweniencję ilustracyjnych alokacji, założenia przeniesione,
   dowody zewnętrzne i pochodzenie prawne.

Taki układ pozwala oddzielić wynik arytmetyczny od zakresu interpretacji.
Wysoka wartość całkowita nie oznacza, że wszystkie istotne skutki zostały
objęte monetyzacją.

## 11. Diagnostyka i replikacja

Diagnostyka dla wszystkich dziesięciu scenariuszy sprawdza:

- zgodność metadanych;
- uporządkowanie zakresów;
- tożsamość delty;
- neutralność scenariuszy kontrolnych;
- wspólne i zablokowane terminy prawne;
- symetrię po zamianie wariantów.

Pakiet replikacyjny generuje deterministyczne JSON, CSV i Markdown z tego samego
rejestru i silnika, których używa aplikacja. Brak znacznika czasu i stała
kolejność scenariuszy pozwalają porównać czyste ponowne wygenerowanie.

Replikacja potwierdza zgodność ścieżki obliczeniowej. Nie potwierdza
empirycznej trafności wejść ani prawidłowości wyboru procedury dla konkretnego
zakupu.

## 12. Walidacja empiryczna

Najpierw należy oceniać osobne komponenty:

- możliwość odtworzenia map z wersjonowanych dokumentów i logów;
- zgodność przewidywanego czasu z obserwowanym czasem;
- zgodność nakładu ról z ewidencją;
- dostęp do konkurencji i liczbę ważnych ofert;
- konstrukcję klauzul oraz aneksy;
- zaobserwowane użycie kontroli systemowych.

Pełna walidacja delty wymaga wiarygodnego kontrfaktycznego wyniku dla drugiego
wariantu i niezależnie uzasadnionego dziennego kosztu zwłoki. Pojedynczy rekord
zakupu nie dostarcza obu elementów.

Ocena na danych odłożonych powinna raportować błąd komponentu, pokrycie przez
zakres, szerokość zakresu i porównanie z prostą bazą. Nie wolno poszerzać zakresu
wyłącznie w celu zwiększenia pokrycia.

## 13. Wkład i ograniczenia

Wkładem artykułu jest audytowalny kontrakt łączący dwie mapy procesu z zakresem
monetyzacji, pochodzeniem założeń i testem symetrii. Model pokazuje, jaka część
różnicy wynika z jawnych działań i kosztu czasu, a jaka pozostaje poza
rachunkiem.

Model nie szacuje pełnego dobrobytu społecznego, jakości trudnej do
monetyzacji, wszystkich sankcji ani ryzyka prawnego. Nie obejmuje procedur
sektorowych oraz obronności i bezpieczeństwa. Nie jest opinią prawną,
benchmarkiem organizacji ani rekomendacją procedury.

## 14. Obserwacje praktyków

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) wskazuje pytania o właściciela
wdrożenia, tarcie procesu, wymagania, zakupy operacyjne, uproszczenie polityki,
TCO i ograniczone zastosowanie AI. Materiał jest wywiadem praktycznym opartym
na automatycznych napisach w języku polskim.

Może służyć do projektowania pytań i hipotez. Nie może ustalać wartości,
zakresów, odpowiedzi w samoopisie gotowości ani progu decyzyjnego.

## Bibliografia

Bajari, P., Houghton, S., i Tadelis, S. (2014). Bidding for Incomplete
Contracts: An Empirical Analysis of Adaptation Costs. *American Economic Review,
104*(4), 1288-1319. https://doi.org/10.1257/aer.104.4.1288

California Department of Technology. (2022). California Redefines State
Technology Procurement.
https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/

European Commission. Guidance on Innovation Procurement.
https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement

OECD. Public Procurement in Lithuania, przykład pilotażu RVUL.
https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117-160.
https://doi.org/10.1093/jeea/jvad017

Urząd Zamówień Publicznych. Wstępne konsultacje rynkowe.
https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe
