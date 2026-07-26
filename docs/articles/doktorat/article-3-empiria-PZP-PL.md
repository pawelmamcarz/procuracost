# Jak sprawdzić koszt projektu procesu? Protokół empiryczny dla polskich zamówień publicznych

**Artykuł 3 cyklu doktorskiego · nauki o polityce i administracji · protokół badawczy**

## Streszczenie

Artykuł przekłada model ProcuraCost 2.1 na falsyfikowalny projekt badania
polskich zamówień publicznych. Nie przedstawia nieistniejących wyników. Dane BZP,
TED i e-Zamówień mogą opisać konkurencję, czas oraz zmiany umów, lecz nie mierzą
wiarygodnie pracy wewnętrznej, kosztu zwłoki, TCO ani nieformalnych obejść. Dlatego
projekt rozdziela analizę danych wtórnych od badania organizacyjnego. Głównym
wynikiem jest czas cyklu; pozostałe wymiary są analizowane oddzielnie, bez
tworzenia jednego obserwowanego indeksu „sztywności”.

## 1. Pytanie i granica wnioskowania

Pytanie brzmi: czy przy porównywalnym przedmiocie, wartości i warunkach rynku
bardziej sekwencyjny przebieg postępowania wiąże się z większym czasem i kosztem,
bez pogorszenia konkurencji, zgodności i wyniku kontraktu?

Nie wolno utożsamiać trybu PZP z topologią pracy. Ten sam tryb może być
przygotowany sekwencyjnie lub równolegle. Nie wolno też porównywać postępowania
ustawowego z bezprawnym zleceniem bez konkurencji. Od 1 stycznia 2026 r. próg
stosowania PZP wynosi 170 000 zł netto; progi unijne zależą od przedmiotu i typu
zamawiającego. Próg jest granicą prawną, nie automatycznym instrumentem dla
każdego efektu.
W paśmie od 170 000 zł do właściwego progu unijnego art. 266 wyłącza tryby
unijne, a art. 275 ustanawia tryb podstawowy; warianty nie są zamienne z trybami
ponadprogowymi.

## 2. Hipotezy

- **H1:** większa liczba rzeczywistych zależności i oczekiwań między etapami
  zwiększa czas cyklu, po uwzględnieniu złożoności zakupu.
- **H2:** skuteczna konkurencja obniża ryzyko straty selekcyjnej niezależnie od
  organizacji pracy.
- **H3:** sztywność klauzul zmiany zwiększa ekspozycję na formalne aneksy lub
  renegocjację; sama liczba akceptacji przed wszczęciem nie musi tego robić.
- **H4:** adaptacyjny przebieg skraca czas tylko wtedy, gdy zespół rzeczywiście
  równolegli pracę i ma zdolność decyzyjną.
- **H5:** kontrola technologiczna moderuje obejścia tylko wtedy, gdy jej użycie
  jest widoczne w logach lub śladzie audytowym.

Każda hipoteza dopuszcza wynik zerowy lub przeciwny.

## 3. Warstwa danych wtórnych

Rejestry publiczne mogą dostarczyć identyfikatory zamawiającego i wykonawcy,
CPV, wartość, tryb, daty ogłoszenia i udzielenia, liczbę ofert, kryteria, wynik i
część informacji o zmianach umowy. Przed analizą należy zamrozić schemat danych,
reguły deduplikacji i obsługę braków. Każda opublikowana liczba opisowa musi być
generowana skryptem z wersjonowanego wycinka danych.

Z tych danych można badać:

- czas widocznej części postępowania;
- uczestnictwo i pojedynczą ofertę jako niedoskonałe wskaźniki konkurencji;
- różnice ceny względem jawnego benchmarku, jeśli benchmark jest porównywalny;
- wystąpienie i zakres opublikowanych zmian umowy.

Nie można z nich bezpośrednio wywnioskować roboczogodzin, kosztu dnia zwłoki,
pełnego kosztu cyklu życia, jakości wszystkich klauzul ani obejścia procesu.
Brak rekordu obejścia nie oznacza braku obejścia.

## 4. Pomiar organizacyjny

Druga warstwa wymaga dostępu do śladów procesu w kilku organizacjach. Jednostką
analizy jest zdarzenie zakupowe. Kodowanie obejmuje:

1. znaczniki rozpoczęcia, przekazań, akceptacji i podpisania;
2. aktywną pracę i oczekiwanie według roli;
3. sekwencyjność, równoległość i cofnięcia;
4. zaproszenia, oferty i powody wykluczeń;
5. klauzule adaptacyjne, aneksy i koszt zmiany;
6. zaobserwowane odstępstwa, sposób wykrycia i skutek audytowy;
7. mierniki dostawy uzgodnione przed poznaniem ścieżki procesu.

Co najmniej dwóch przeszkolonych koderów powinno niezależnie oceniać elementy
uznaniowe, a rozbieżności rozstrzygać według zamrożonego podręcznika. Wyniki
finansowe należy odseparować od kodowania procesu, aby ograniczyć dopasowywanie
ocen do tezy.

## 5. Strategia analityczna

Pełny plan analizy, wraz z rachunkiem mocy i harmonogramem, znajduje się w
`docs/research/EMPIRICAL_VALIDATION_PLAN.md`. Poniżej jego rdzeń.

**Zmienna objaśniająca.** `prescriptiveness` mierzona *ex ante* — z macierzy akceptacji
i wersji polityki obowiązującej w dniu autoryzacji potrzeby, a nie z faktycznego przebiegu
postępowania. Przebieg faktyczny jest współokreślony przez wynik, więc kodowanie go jako
ekspozycji tworzy odwrotną przyczynowość. Indeks jest sumą pięciu z-standaryzowanych
składowych: liczby bram decyzyjnych, wymuszonych par sekwencyjnych, głębokości eskalacji,
sztywności dokumentacji i odwróconej autonomii zespołu.

Z ekspozycji **wykluczam udział czasu oczekiwania i długość ścieżki krytycznej**, mimo że
wcześniejszy szkic je zawierał: obie dzielą jednostki z wynikiem głównym i mechanicznie go
ograniczają.

**Wynik główny:** `log(dni cyklu)` od autoryzacji potrzeby do podpisania umowy.

**Specyfikacja bazowa:**

`log(dni) = β · z(prescriptiveness) + γ′X + α_zamawiający + δ_CPV + θ_rok + ε`

z błędami klastrowanymi na poziomie zamawiającego (przy < 30 klastrach —
*wild cluster bootstrap*).

**Kontrole dozwolone (przed-ekspozycyjne):** wartość szacunkowa, CPV, złożoność, pilność
deklarowana przed wszczęciem, rok, efekty stałe zamawiającego.

**Kontrole zakazane (po-ekspozycyjne):** liczba ofert, cena względem benchmarku, liczba
aneksów, wynik dostawy. Wcześniejsza wersja tego protokołu umieszczała **liczbę ofert
w modelu czasu cyklu**. To był błąd specyfikacji: liczba ofert powstaje po publikacji,
zależy od projektu procesu i mechanicznie wpływa na czas oceny, więc jest zmienną
pośredniczącą, a jej kontrolowanie obciąża współczynnik główny. Liczba ofert jest zmienną
zależną w modelu konkurencji (H2), nie kontrolą w modelu czasu (H1).

Osobne modele dotyczą konkurencji, zmian umowy, wyników dostawy i ustaleń audytu. Dopiero
po ich prezentacji można zbudować rachunek pieniężny ProcuraCost.

### 5.0 Identyfikacja i moc

**Wariant bazowy** (dopasowane zdarzenia wewnątrz organizacji) identyfikuje asocjację
warunkową, nie efekt przyczynowy — wybór ścieżki jest endogeniczny, co artykuł 2 przyznaje
wprost.

**Wariant rekomendowany dla warstwy przyczynowej:** zmiana wersji polityki wewnętrznej
(macierzy akceptacji, uruchomienie modułu workflow) przy niezmienionych progach ustawowych,
estymowana jako *staggered DiD* estymatorem odpornym na heterogeniczne efekty
(Callaway–Sant’Anna albo Sun–Abraham; nie dwukierunkowe efekty stałe). Wymaga testu trendów
równoległych i wykluczenia antycypacji.

**Minimalny istotny efekt** deklaruję przed zebraniem danych: `|β| = 0,10`, czyli 10%
skrócenia czasu cyklu na jedno odchylenie standardowe indeksu. Przy medianie ok. 60 dni to
6 dni — poniżej tego progu efekt jest nieodróżnialny od szumu kalendarzowego.

**Moc.** Przy α = 0,05, mocy 0,80, `sd(log dni) ≈ 0,55` i `R²` kontroli ≈ 0,30 rachunek
zamknięty daje ok. 166 zdarzeń, ale korekta na klastrowanie (ICC ≈ 0,15, ok. 60 zdarzeń na
organizację) podnosi to do rzędu 1 600 zdarzeń. Wniosek jest niewygodny i trzeba go postawić:
**przy tej strukturze danych moc wiąże liczba organizacji, nie liczba zdarzeń.** Wariant
przekrojowy wymagałby 25–30 organizacji, co jest nierealne; wariant wewnątrzorganizacyjny
przy 6 organizacjach i 2 zmianach polityki daje wykrywalny efekt rzędu 12–15%. To jest
argument za wariantem B jako osią artykułu. Ostateczne `n` wyznaczy symulacja na strukturze
pilotażu.

Progi kwotowe mogą wspierać projekt quasi-eksperymentalny tylko po sprawdzeniu,
czy wartość nie jest manipulowana oraz czy po obu stronach progu zmienia się
konkretny mechanizm. Szucs (2024) pokazuje, dlaczego sortowanie przy progu może
unieważnić prosty RDD. Test gęstości — w wersji Cattaneo, Jansson i Ma (2020) —
jest diagnostyką, a nie naprawą wszystkich naruszeń. „Donut” wokół progu nie
przywraca identyfikacji automatycznie. Zakładam, że wariant progowy tych testów
nie przejdzie, i nie buduję na nim rozprawy.

Plan analizy, wyniki główne, wyłączenia, okna i transformacje należy
prerejestrować przed oszacowaniem efektów. Analizy eksploracyjne muszą być tak
nazwane.

### 5.1 Słownik, braki i testy odporności

Główny wynik czasu należy zdefiniować przed pobraniem danych, wskazując początek
i koniec oraz rozdzielając przygotowanie, postępowanie i wykonanie. Liczba ofert
powinna odróżniać oferty złożone, ważne i ocenione. Zmiana umowy wymaga
zakodowania podstawy, zakresu, ceny i terminu; sama flaga aneksu jest zbyt uboga.

Sekwencyjność powinna wynikać z grafu zdarzeń: udziału oczekiwania, długości
ścieżki krytycznej, liczby przekazań i możliwej równoległości. Nie może być
etykietą nadaną po poznaniu wyniku. Raport pokazuje kompletność danych według
roku, zamawiającego i typu zakupu, ponieważ braki mogą korelować z jakością
procesu.

Testy odporności zmieniają definicje czasu, wyłączają tryby wyjątkowe, stosują
alternatywne miary konkurencji i pokazują wyniki bez monetyzacji. Test placebo na
progu, który nie zmienia obowiązków, może ujawnić trend mylony z efektem prawa.

## 6. Test modelu 2.1

Walidacja nie polega na sprawdzeniu, czy kalkulator przewidział własne założenia.
Dla każdego zdarzenia najpierw oblicza się niezależnie obserwowane składniki.
Następnie porównuje się znak, kalibrację i błąd wyniku scenariuszowego z wynikiem
rzeczywistym. Parametry można aktualizować na zbiorze treningowym, ale końcowa
ocena wymaga odłożonej próby lub późniejszego okresu.

Teza słabnie, jeżeli po uwzględnieniu złożoności sekwencyjność nie zwiększa czasu
ani pracy, adaptacyjność regularnie osłabia konkurencję lub mechanizmy zmian nie
poprawiają wykonania. Teza pozostaje sensowna, jeśli efekty są heterogeniczne:
adaptacja pomaga w zakupach niepewnych i kosztownych czasowo, a formalność w
stabilnych sytuacjach o wysokim ryzyku dyskrecji.

## 7. Etyka, prawo i ograniczenia

Dane publiczne nie znoszą obowiązku dokumentowania pochodzenia, licencji i zmian
schematu. Dane organizacyjne mogą zawierać informacje osobowe, handlowe i
sygnały nieprawidłowości; wymagają podstawy prawnej, minimalizacji, kontroli
dostępu i oceny etycznej przed pozyskaniem. Publikacja powinna używać agregatów
i procedury ochrony przed identyfikacją.

Projekt nie pozwoli zredukować jakości zamówienia do jednej ceny. Nie wszystkie
zmiany umowy są porażką, nie każda pojedyncza oferta oznacza korupcję i nie każde
odstępstwo jest obejściem. Te ograniczenia są częścią modelu badawczego, a nie
przypisem dodanym po uzyskaniu wyniku.

## 8. Pakiet replikacyjny

Pakiet powinien zawierać słownik danych, kod pobrania i czyszczenia, manifest
wersji źródeł, prerejestrację, skrypty tabel i dziennik odstępstw od planu.
Surowe dane chronione nie muszą być publiczne, ale syntetyczny zestaw testowy
powinien umożliwiać audyt kodu. Żadna tabela wynikowa nie może być wpisywana
ręcznie: publikację generuje kod z zamrożonego zbioru analitycznego. Jeżeli
kluczowej zmiennej nie da się odtworzyć, artykuł raportuje brak zamiast zastąpić
go niezweryfikowaną liczbą z raportu wtórnego.

## Bibliografia i źródła prawne

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Doing It by the Book:
Political Contestability and Public Contract Renegotiations. *Journal of Law,
Economics, and Organization, 39*(1), 281–308.
https://doi.org/10.1093/jleo/ewab039

Cattaneo, M. D., Jansson, M., i Ma, X. (2020). Simple Local Polynomial Density
Estimators. *Journal of the American Statistical Association, 115*(531),
1449–1455. https://doi.org/10.1080/01621459.2019.1635480

Coviello, D., i Mariniello, M. (2014). Publicity Requirements in Public
Procurement. *Journal of Public Economics, 109*, 76–100.
https://doi.org/10.1016/j.jpubeco.2013.10.008

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117–160.
https://doi.org/10.1093/jeea/jvad017

Ustawa z dnia 11 września 2019 r. – Prawo zamówień publicznych, z późn. zm.

Ustawa z dnia 25 lipca 2025 r. o zmianie ustawy – Prawo zamówień publicznych
oraz niektórych innych ustaw, Dz.U. 2025 poz. 1173.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w
sprawie progów unijnych na lata 2026–2027, M.P. 2025 poz. 1247.
