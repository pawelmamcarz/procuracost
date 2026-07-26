# Ile kosztuje projekt procesu? Siedmiowymiarowy model decyzyjny ProcuraCost 2.1

**Artykuł 2 cyklu doktorskiego · ekonomia i finanse · szkic metodologiczny**

## Streszczenie

Artykuł przedstawia transparentny model porównujący formalną, sekwencyjną
ścieżkę zakupu z adaptacyjną, lecz zgodną ścieżką dla tego samego przedmiotu i
tej samej granicy prawnej. Model rozdziela siedem kanałów kosztu: pracę ludzi,
administrację, opóźnienie, selekcję dostawcy, formalne aneksy, wartość cyklu życia i
obejścia. Nie jest estymatorem ani wynikiem badania polskich zakupów. Parametry o
słabym oparciu empirycznym są szerokimi scenariuszami. Wynik może wskazać każdą
ze ścieżek albo pozostać nierozstrzygający.

## 1. Obiekt porównania

Niech `F` oznacza ścieżkę formalną/sekwencyjną, a `A` ścieżkę
adaptacyjną/zgodną. Obie dotyczą tego samego zakupu, rynku, progu prawnego i
obowiązków konkurencyjnych. Dla ścieżki `j`:

`C_j = C_staff,j + C_admin,j + d_j × c_d + B × π_j + H × λ_j × c_aneks + B × τ_j + p_j × E_j`

oraz `ΔC = C_F − C_A`. Dodatnie `ΔC` sprzyja `A`, ujemne `F`. Jest to rachunek
warunkowy: mówi, co wynika z danych i założeń, a nie co spowodowałaby reforma.

## 2. Wymiary

**Praca ludzi.** Koszt jest sumą godzin uczestnictwa według roli i stawki obciążonej.
Godziny są sumą dla całej roli, nie na osobę: liczba osób w roli jest danymi opisowymi
i nie zwielokrotnia kosztu ustalonego zakresu pracy. Czas kalendarzowy i roboczogodziny
pozostają różnymi wielkościami — dni pochodzą z szablonu procesu, godziny z macierzy
uczestnictwa. Kontekst działa przez pięć mnożników: trzy na pracę (Upstream ×1,15,
Downstream ×0,90, Direct ×1,10) i dwa na koordynację w kanale administracyjnym
(Upstream ×1,15, Downstream ×0,85). Nie sięga do pozostałych wymiarów. Model nie
przypisuje pozornie precyzyjnych mnożników poszczególnym stanowiskom.

**Administracja.** Obejmuje niepracowniczy narzut administracyjny na dzień oraz koszt narzędzia.
Jeżeli obie ścieżki korzystają z tej samej technologii, koszt narzędzia jest
równy. Narzut nie obejmuje godzin ról policzonych już jako praca ludzi.

**Opóźnienie.** `C_delay,j = days_j × daily_cost_of_inaction`. Koszt dnia podaje
użytkownik. Powinien wynikać z utraconej marży, przestoju albo innego możliwego
do obrony rachunku, a nie z wartości kontraktu pomnożonej przez arbitralny
procent.

Ten wymiar wymaga osobnego ostrzeżenia, bo jest największy. Jego różnica między ścieżkami
to iloczyn liczby dni z własnego szablonu modelu i ceny dnia podanej z zewnątrz — czyli
**tożsamość rachunkowa, a nie wynik modelowania**. W scenariuszach wbudowanych niesie
77,7–99,5% całej ΔC wszędzie tam, gdzie ścieżki różnią się czasem trwania. Dlatego model 2.2
raportuje ΔC rozbite na trzy kubełki (proces, opóźnienie, cykl życia) zamiast jednej sumy:
jedna liczba pozwalała czytać założenie użytkownika jako ustalenie badawcze.

**Selekcja.** Empiryczną kotwicą jest Szucs (2024), lecz model używa jej tylko
dla ryzyka dyskrecji i osłabionej konkurencji. Centralny scenariusz ceny wynosi
6%, a zakres 2–9% reprezentuje niepewność transferu. Efekt produktywności
wykonawcy nie jest monetyzowany drugi raz.

**Formalne aneksy.** Koszt jednego aneksu oraz czas trwania umowy podaje użytkownik.
Roczna częstość jest funkcją sztywności kontraktu, nie sztywności obiegu. Zakres
0,077–0,105 dodatkowego aneksu na rok wykorzystuje badanie Beuve’a, Moszoro i Spillera
(2023) jako zewnętrzną kotwicę rzędu wielkości. To nie jest prawdopodobieństwo pojedynczego
zdarzenia, a średnia z ich próby nie staje się bazą dla każdej branży.

Kotwica jest słabsza, niż sugerowały wcześniejsze wersje, i słabość dotyczy jednostki.
Autorzy szacują efekt jednoczesnego wzrostu o jedno odchylenie standardowe **w każdej**
z siedmiu z-standaryzowanych kategorii sztywności. Model mnoży ten współczynnik przez profil
0–1, który nie jest z-score, więc milcząco utożsamia „profil = 1,0" z tym siedmiokategoryjnym
przesunięciem. Konwersja między tymi skalami nie istnieje. Dlatego współczynnik jest
w modelu 2.2 **parametrem klasy trzeciej** (założenie kalibracyjne z zewnętrzną kotwicą),
a nie klasy drugiej, i interpretowalna jest wyłącznie **różnica** między ścieżkami — nie
poziom żadnej z nich, bo estymata jest przyrostowa, a model nie podaje bazy.

**TCO.** Model tworzy pulę możliwej wartości cyklu życia i mnoży ją przez część
niewychwyconą przez daną ścieżkę. Scenariusz centralny wynosi 0%, a stres-test
sięga 15% jako trzyletnia pula skumulowana; krótszy horyzont skaluje ją przez
`min(horyzont/3, 1)`. Nie istnieje tu
reguła „10% rocznie” ani automatyczny limit 30%.

**Obejście.** Koszt to ekspozycja audytowa użytkownika razy scenariusz częstości
i działanie kontroli systemowych. Zakresy 1–30% nie pochodzą z literatury; służą
testowi wrażliwości do czasu zebrania obserwacji lokalnych.

## 3. Scenariusze i niepewność

Model raportuje wariant niski, centralny i wysoki dla `ΔC`. Niski wzmacnia
argument za formalnością: wysoka premia dyskrecji, brak importowanego efektu
renegocjacji i TCO oraz większe obejścia po stronie adaptacyjnej. Wysoki wzmacnia
argument za adaptacją. To celowe testy naprężeniowe, nie kwantyle rozkładu i nie
przedziały ufności.

Jeżeli zakres przecina zero, narzędzie nie powinno rekomendować jednej ścieżki
bezwarunkowo. Jeżeli nie przecina, znak jest stabilny wyłącznie w zadanych
granicach. Ta reguła chroni tezę przed ustawieniem parametrów pod z góry wybrany
wynik.

### 3.1 Profile i reguły ochronne

Profile startowe opisują osobno skuteczność konkurencji, sztywność kontraktu i
zdolność wychwycenia wartości TCO. Nie są obserwowanym indeksem organizacji.
Dawny `PROCESS_RIGIDITY` nie uczestniczy w formułach ekonomicznych. Gdy dostępne
są dane o ofertach, klauzulach i wynikach cyklu życia, powinny zastąpić wartości
domyślne bez automatycznej zmiany pozostałych konstruktów.

Implementacja waliduje wejścia, traktuje koszt technologii symetrycznie i zapisuje ślad
wszystkich składników. Ograniczenie częstości aneksów wynika teraz ze struktury — profil
jest z przedziału 0–1, więc iloczyn nie może przekroczyć samego współczynnika — a nie
z osobnej stałej. Poprzednia wersja deklarowała limit 0,105 jako regułę ochronną, choć
maksymalna osiągalna wartość wynosiła 0,079 i limit nigdy nie działał. Nie gwarantuje to
trafności, ale ogranicza arbitralność oraz ułatwia wykrycie podwójnego liczenia.

### 3.2 Asymetria konstrukcyjna

Model dopuszcza obie ścieżki, ale nie jest wobec nich symetryczny i artykuł musi to
powiedzieć przed recenzentem. Sześć z siedmiu kanałów jest z konstrukcji uporządkowanych na
korzyść ścieżki adaptacyjnej: ma ona w każdym szablonie nie więcej dni, a w każdym wierszu
tabeli profili niższą sztywność kontraktu i wyższe wychwycenie TCO. Jedyny kanał mogący
sprzyjać formalności — selekcja — jest ograniczony iloczynem premii dyskrecji i różnicy
skuteczności konkurencji, co dla `pzp_eu` daje pułap rzędu 0,3% wartości kontraktu, podczas
gdy kanał opóźnienia jest nieograniczony.

Konsekwencja dla interpretacji przeglądu wrażliwości: w 11 340 konfiguracjach wynik centralny
sprzyja formalności w 1 482, ale **żadna nie sprzyja jej odpornie**. To nie jest wynik
o zamówieniach, tylko własność konstrukcji przedziału — scenariusze niski i wysoki zmieniają
pięć skalarów dowodowych, natomiast szablony dni i koszt dnia zwłoki pozostają nieruszone
w każdym opublikowanym przebiegu. Rzetelny test symetrii wymaga drugiej osi wrażliwości po
koszcie dnia i po czasach trwania etapów nieobowiązkowych oraz co najmniej jednego szablonu,
w którym wykonanie adaptacyjne jest **wolniejsze**. Takiego szablonu jeszcze nie ma.

W postępowaniach PZP okresy publikacji i standstill wybrane w szablonie pozostają
takie same w obu ścieżkach i nie są kompresowane przez technologię. Szablon UE
używa standardowych 35 dni i 10 dni; ustawowe skrócenia oraz wyjątki wymagają
osobnego scenariusza. Wspólna bazowa cena
zakupu nie jest dodawana do żadnej strony; porównanie obejmuje jedynie przyrostową
stratę selekcyjną. Model raportuje także próg kosztu dnia bezczynności, powyżej
którego centralna przewaga czasowa zmienia znak wyniku.

## 4. Pochodzenie parametrów

Parametry należy opisywać w trzech klasach:

1. **Dane użytkownika:** wartość, stawki, godziny, daty, koszt zwłoki i ekspozycja.
2. **Kotwice zewnętrzne:** wyniki badań zastosowane tylko do zgodnego konstruktu,
   z jawnym ryzykiem transferu.
3. **Założenia kalibracyjne:** profile konkurencji, kontraktu, TCO i obejść,
   przeznaczone do zastąpienia danymi organizacji.

Parametr klasy trzeciej nie może być przedstawiany w artykule ani interfejsie
jako „badania pokazują”. Eksport badawczy zapisuje użyte wartości i wersję modelu,
aby wynik dało się odtworzyć.

## 5. Identyfikacja i walidacja

Model rozliczeniowy nie identyfikuje efektów przyczynowych. Walidacja wymaga
zdarzeń zakupowych, a nie opinii o procesie. Minimalny rekord powinien obejmować
znaczniki czasu, godziny według roli, liczbę i jakość ofert, typ klauzul zmiany,
aneksy, wyniki dostawcy, udokumentowane obejścia i ustalenia audytu.

Najpierw należy estymować wyniki składowe, dopiero potem je monetyzować. Dobrym
projektem są dopasowane zakupy w tej samej organizacji i kategorii, z kontrolą
złożoności. Sam wybór procedury jest endogeniczny: trudniejsze lub pilniejsze
zakupy mogą trafiać na inną ścieżkę. Porównanie średnich bez tej korekty nie jest
dowodem działania modelu.

### 5.1 Walidacja i wrażliwość

Ocena powinna raportować osobno błąd dni, pracy, zmian i wyniku netto. Dla znaku
`ΔC` należy pokazać trafność, pokrycie obserwowanego wyniku przez zakres oraz
szerokość tego zakresu. Samo pokrycie nie wystarcza, ponieważ dowolnie szeroki
przedział zawsze wygląda bezpiecznie. Potrzebne jest porównanie z prostą bazą,
np. medianą kategorii.

Minimalna analiza wrażliwości zmienia kolejno koszt dnia zwłoki, premię
dyskrecji, koszt aneksu, pulę TCO i ekspozycję obejścia. Raport wskazuje
próg zmiany znaku. Losowanie z jawnych zakresów nie staje się analizą
probabilistyczną bez uzasadnionych rozkładów.

## 6. Przykład interpretacyjny

Jeżeli adaptacyjna ścieżka skraca kalendarz, lecz osłabia konkurencję, model może
pokazać korzyść `A` w czasie i opóźnieniu oraz korzyść `F` w selekcji. Gdy niski
scenariusz jest ujemny, a wysoki dodatni, rekomendacją nie jest automatycznie
„wybrać pole”, lecz zebrać dane o koszcie zwłoki i konkurencji albo połączyć
krótszy obieg z otwartym rynkiem. Przykład nie zawiera kwot, aby hipotetyczny
rachunek nie został odczytany jako benchmark branżowy.

## 7. Ograniczenia i wkład

Model nie obejmuje pełnego dobrobytu społecznego, jakości trudnej do
monetyzacji ani wszystkich sankcji prawnych. Profile startowe nie są pomiarami
organizacji. Zewnętrzne efekty pochodzą z innych państw i sektorów. Wynik nie jest
poradą prawną.

**Wkład tego artykułu.** Nie jest nim liczba „kosztu sztywności” ani teza Tunnel–Field.
Jest nim **audytowalna dekompozycja, która rozdziela to, co model wie, od tego, co zakłada,
i pokazuje, że dominujący składnik popularnego argumentu o kosztach procedury jest
tożsamością rachunkową, a nie ustaleniem.** Po odjęciu tej tożsamości ścieżka formalna jest
tańsza na koszcie procesu w sześciu z dziewięciu scenariuszy wbudowanych — wynik węższy niż
teza wyjściowa, ale sprawdzalny i przeciwny do intuicji, którą sam projekt wcześniej
komunikował.

Artykuł nie dowodzi żadnego efektu przyczynowego i nie jest estymacją. Jego rolą w cyklu jest
dostarczenie konstrukcji pomiarowej, którą artykuł 3 poddaje testowi na danych.

## Bibliografia

Bajari, P., Houghton, S., i Tadelis, S. (2014). Bidding for Incomplete
Contracts: An Empirical Analysis of Adaptation Costs. *American Economic Review,
104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Doing It by the Book:
Political Contestability and Public Contract Renegotiations. *Journal of Law,
Economics, and Organization, 39*(1), 281–308.
https://doi.org/10.1093/jleo/ewab039

European Commission. (2011). *Public Procurement in Europe: Cost and
Effectiveness*. PwC, London Economics i Ecorys. [Benchmark całkowitych kosztów
procedury, nie przyrostowego kosztu formalności.]

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117–160.
https://doi.org/10.1093/jeea/jvad017
