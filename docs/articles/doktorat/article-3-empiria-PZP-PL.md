# Jak sprawdzić koszt projektu procesu? Protokół empiryczny dla polskich zamówień publicznych

**Artykuł 3 cyklu doktorskiego · nauki o polityce i administracji · protokół badawczy**

## Streszczenie

Artykuł przekłada model ProcuraCost 2.0 na falsyfikowalny projekt badania
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

Podstawowa analiza porównuje podobne zakupy wewnątrz organizacji i kategorii.
Model czasu powinien uwzględniać wartość, CPV, złożoność, pilność, liczbę ofert,
rok oraz efekty stałe zamawiającego. Osobne modele dotyczą konkurencji, zmian
umowy, wyników dostawy i ustaleń audytu. Dopiero po ich prezentacji można
zbudować rachunek pieniężny ProcuraCost.

Progi kwotowe mogą wspierać projekt quasi-eksperymentalny tylko po sprawdzeniu,
czy wartość nie jest manipulowana oraz czy po obu stronach progu zmienia się
konkretny mechanizm. Szucs (2024) pokazuje, dlaczego sortowanie przy progu może
unieważnić prosty RDD. Test gęstości jest diagnostyką, a nie naprawą wszystkich
naruszeń. „Donut” wokół progu nie przywraca identyfikacji automatycznie.

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

## 6. Test modelu 2.0

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
