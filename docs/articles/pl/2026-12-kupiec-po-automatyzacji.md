---
tytuł: "Kupiec po automatyzacji"
podtytuł: "Rola zakupów, gdy rutynę przejmują agenci AI"
data: 2026-12
autor: "Paweł Mamcarz"
autor_www: "https://mamcarz.com"
model: "ProcuraCost 2.3.1"
status: "szkic do redakcji, materiał przed panelem 2 grudnia 2026 r."
---

# Kupiec po automatyzacji

## Rola zakupów, gdy rutynę przejmują agenci AI

Gdy system sam sprawdza budżet, uprawnienia i zgodność z umową, a agent
prowadzi proste negocjacje, kupcowi zostaje mniej przepisywania i ręcznych
akceptacji. Nie wynika z tego jeszcze, czym ten kupiec ma się zająć, kto ustala
reguły dla automatu ani kto odpowiada za decyzję, którą automat przygotował.

2 grudnia 2026 r. prowadzę na ten temat panel z dwoma dyrektorami zakupów.
Ten tekst porządkuje cztery wątki rozmowy. Przy każdym oddzielam to, co da się
oprzeć na modelu ProcuraCost i cytowanych w nim źródłach, od tego, co jest
hipotezą albo pytaniem. Danych o tym, jak zmienia się praca kupców po
wdrożeniu agentów, w projekcie nie ma. Tam, gdzie ich brakuje, piszę to wprost.

## 1. Na co pójdzie odzyskany czas

Zacznijmy od podziału pracy, który można opisać bez prognoz. Przy transakcji
operacyjnej, czyli zamówieniu z katalogu albo zwolnieniu zlecenia MRP z
obowiązującej umowy, system może automatycznie:

- sprawdzić budżet, uprawnienia i zgodność z umową;
- pobrać zatwierdzone dane dostawcy, materiału i centrum kosztów;
- porównać zapotrzebowanie, zamówienie, odbiór i fakturę;
- skierować odchylenie do wskazanego właściciela;
- zachować ślad zwolnienia i wyjątku.

Człowiek zostaje tam, gdzie potrzebna jest ocena: przy niestandardowej
potrzebie, analizie rynku, negocjowaniu podziału ryzyka i rozstrzyganiu
wyjątku. To rozróżnienie opisałem w tekście
[Tunel czy pole](2026-07-tunel-pole-lepszy-biznes.md). Wraca ono w rozmowie w
8. odcinku Procurement&Beyond jako granica między pracą, którą da się
standaryzować, a sytuacją wymagającą osądu eksperta.

Odzyskany czas nie przechodzi sam na pracę strategiczną. W artykule o
[barierach autonomicznego sourcingu](2026-09-bariery-autonomicznego-sourcingu.md)
wskazałem jedną przeszkodę: jeżeli zespół jest oceniany według liczby ręcznie
prowadzonych postępowań, automatyzacja odbiera mu to, za co dostaje premię.
Zanim agent przejmie część pracy, trzeba ustalić, co zespół robi zamiast niej
i według czego będzie oceniany.

Jak duża jest ta zmiana? Dostępne liczby to deklaracje, nie pomiary. W
zapowiedzi raportu Zero100 z 30 stycznia 2026 r. 85% badanych CPO i
przedstawicieli kadry kierowniczej sourcingu spodziewa się zasadniczej zmiany
pracy sourcingowej pod wpływem agentowej AI, a 78% chce zachować ludzką
kontrolę nad całą pracą strategiczną. Zapowiedź nie podaje liczebności próby.
Raport EFESO, oparty na wywiadach z 50 europejskimi CPO z grudnia 2025 r.,
podaje 5% szerokich wdrożeń GenAI i 75% organizacji na etapie eksperymentów.
Z tych liczb wynika tyle, że wiele osób spodziewa się zmiany, a niewiele
organizacji ma ją za sobą.

Jakie kompetencje będą potrzebne za trzy lata? Na to pytanie model nie
odpowiada. Proponuję pięć hipotez do sprawdzenia na panelu:

1. **Opis problemu przed wyborem rozwiązania.** Mechanizmy, które model
   rozpoznaje w zakupie ERP, usługi logistycznej czy publicznego IT, zaczynają
   się od zdefiniowania potrzeby i sprawdzenia rynku. Agent nie zrobi tego bez
   kogoś, kto wie, jaki problem zakup ma rozwiązać.
2. **Pisanie mandatu dla automatu.** Ktoś musi ustalić, jakie warunki agent może
   uzgodnić, do jakiej kwoty i kiedy oddaje sprawę człowiekowi.
3. **Kwestionowanie danych.** Nieaktualny rysunek albo dwie różne klasyfikacje
   w dwóch systemach zmieniają treść zapytania. Kupiec musi umieć zatrzymać
   sprawę, zanim błąd przejdzie dalej.
4. **Wyjątek i relacja z dostawcą.** Dostawca powinien od pierwszej wiadomości
   wiedzieć, do kogo eskalować sprawę, z którą agent sobie nie radzi.
5. **Myślenie pełnym kosztem.** Model językowy może uporządkować dane rynkowe,
   ale rachunek TCO powinien wykonać jawny, deterministyczny model, który
   ktoś rozumie i potrafi sprawdzić.

## 2. Czas na strategię: kto pisze reguły i kto je zmienia

W systemie strategia zakupowa przestaje być dokumentem. Staje się zestawem
reguł: kto ma jakie uprawnienia, jakie są progi wartości, które kategorie idą
przez katalog, kiedy sprawa trafia do człowieka. Polityka zakupowa wyznacza te
granice, a projekt przebiegu procesu organizuje pracę w ich obrębie.

Reguła bez właściciela starzeje się szybciej niż system. W tekście
[Wdrożenie bez właściciela](2026-09-wdrozenie-bez-wlasciciela.md) opisałem dwie
role, bez których konfiguracja dryfuje: osobę oceniającą wymagania i osobę,
która po uruchomieniu pracuje z użytkownikami i ma mandat do zmiany
konfiguracji. Przy regułach dla agentów pytanie jest to samo: kto może zmienić
próg, katalog dopuszczalnych warunków albo listę kategorii, i na jakiej
podstawie.

Sam ProcuraCost stosuje do własnych parametrów prostą zasadę, którą można
przenieść na reguły zakupowe. Zmiana jest dopuszczalna, gdy ma zapisane źródło,
zachowuje wspólne granice obu wariantów, trafia do historii wersji i została
uzasadniona, zanim sprawdzono, komu pomoże. Ostatni warunek jest najtrudniejszy
i najważniejszy: chroni przed regułą dopisaną pod oczekiwany wynik.

Proponuję prowadzić rejestr reguł z czterema polami: właściciel, uzasadnienie,
data wejścia w życie i zdarzenie, które wymusza przegląd, na przykład zmiana
rynku, odejście właściciela albo powtarzający się wyjątek. Nowy przebieg
warto sprawdzić najpierw na jednej kategorii, z zamrożonym okresem, miernikami
i warunkami zatrzymania ustalonymi przed startem.

Pytanie, które warto zadać przy każdej regule agenta: czy ta granica wynika z
polityki, czy odtwarza starą sekwencję kroków, bo nikt nie sprawdził, po co ona
była.

## 3. Procedura czy polityka zakupowa

Procedura działa jak tunel: jedna ścieżka, ustalona kolejność kroków. Polityka
wsparta systemem działa jak pole z jasnymi granicami. Standard obsługuje
automat, wyjątek ocenia człowiek. W obu przypadkach obowiązują te same
uprawnienia, zasady konkurencji, etyki i dokumentacji. W modelu zapisuję to
jako ∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}. Pole nie zwalnia z
żadnego z tych wymagań, a obowiązkowe terminy PZP są w obu wariantach takie
same i zablokowane.

Co z tego porównania wynika w liczbach? ProcuraCost liczy dziesięć scenariuszy
referencyjnych i nie zakłada, który wariant wyjdzie taniej. Wyniki są
ilustracyjne, bo opierają się na zadeklarowanych założeniach, nie na
pomiarach w organizacjach. Ich układ jest jednak pouczający:

- W pięciu scenariuszach z rozpoznanym mechanizmem (flota, ERP, logistyka,
  materiał krytyczny, publiczne IT) oraz w wymianie środka trwałego wariant
  adaptacyjny ma krótszą mapę. Różnica dni jest założeniem przeniesionym z
  wcześniejszej wersji modelu. Większość różnicy kosztu daje koszt zwłoki,
  czyli dni pomnożone przez zadeklarowany koszt dnia. W scenariuszu floty
  różnica centralna wynosi około 104 tys. zł, z czego 100 tys. zł to 20 dni
  razy 5 tys. zł dziennie. To tożsamość rachunkowa, nie wynik badania.
- W scenariuszu odkrywania i współprojektowania wariant adaptacyjny jest
  droższy o około 92 tys. zł, bo uczenie się jest pracą i wydłuża przebieg.
- W stabilnej usłudze standardowej wariant adaptacyjny jest droższy o
  300 tys. zł. Model zakłada tu zawężenie konkurencji do krótkiej listy i
  stosuje ostrożny test oparty na badaniu Szucsa (2024) dotyczącym węgierskich
  zamówień. Nie jest to estymata dla Polski.
- W zamówieniu katalogowym i zwolnieniu MRP obie mapy są identyczne, więc
  różnica wynosi zero. To scenariusze kontrolne. Sprawdzają, że model nie
  przypisuje korzyści samej nazwie wariantu.

Z tego układu wynikają dwie rzeczy ważne dla debaty. Po pierwsze, wynik
porównania zależy od tego, ile kosztuje dzień zwłoki w konkretnym zakupie. To
liczba, której model nie zna i nie może sprawdzić. Po drugie, przy zakupach
operacyjnych różnica między tunelem a polem w samym przebiegu znika. Zysk z
automatyzacji pochodzi tam z kanału realizacji i obsługi wyjątków, nie z
wyboru między procedurą a polityką.

Model nie rozstrzyga też, czy pole jest bezpieczniejsze. Nieformalne obejście
procesu, czyli zakup poza oficjalnym obiegiem, pozostaje w rachunku bez
wyceny, bo brakuje podstaw do przypisania mu wartości. Teza, że sztywna
procedura sprzyja obchodzeniu, jest w projekcie hipotezą.

## 4. Kontrola i miary

Kto odpowiada za decyzję przygotowaną przez AI? Model nie odpowiada na to
pytanie, ale pokazuje, czego trzeba, żeby ktokolwiek mógł odpowiadać: zapisu,
z którego da się odtworzyć decyzję. W ProcuraCost taki zapis obejmuje kontekst
zakupu, obie mapy przebiegu, wynik centralny i zakres, składniki różnicy,
wymiary pozostawione bez wyceny, założenia, źródła i pochodzenie obowiązkowych
terminów. Dla agenta potrzebny jest odpowiednik: wejścia, uprawnienia, zmiany
warunków i decyzja zatwierdzająca.

Odpowiedzialność ma też wymiar prawny. Trzeba ustalić, kto wiąże spółkę, gdy
agent akceptuje warunki, jak to się ma do zasad reprezentacji, jaki jest próg
wartości i których warunków agent nie może zmienić. Osobno trzeba ocenić
przepisy o AI i prawo konkurencji dla konkretnego zastosowania. Ten tekst nie
jest poradą prawną.

Co mierzyć poza czasem cyklu? Krótszy cykl nie wystarcza, jeżeli pogarsza się
dostęp do konkurencji albo kompletność dokumentacji. Dłuższy przebieg nie jest
z góry zły, jeżeli jego celem jest uczenie się. Proponuję raportować osobno,
przed jakąkolwiek próbą przeliczenia na złotówki:

- czas całkowity z podziałem na pracę aktywną i oczekiwanie;
- godziny pracy według roli;
- liczbę ważnych ofert i cenę względem benchmarku ustalonego przed startem;
- udział dostawców: ilu zaproszono, ilu wzięło udział, ilu zawarło porozumienie;
- liczbę eskalacji do człowieka wraz z przyczyną;
- odsetek rozstrzygnięć agenta odwróconych albo poprawionych przez kupca;
- czas od rozstrzygnięcia do zapisu w systemie transakcyjnym;
- liczbę wyjątków i spraw prowadzonych poza oficjalnym obiegiem;
- kompletność rejestru decyzji;
- zmiany umowy i wyniki dostawy ustalone przed startem.

Odsetek poprawek kupca warto czytać ostrożnie. Sama korekta nie mówi, czy
zawiodły dane, reguły mandatu czy osąd agenta. Mówi tyle, że nadzór działa.

## Pytania do panelu

1. Na co w waszym zespole poszedł czas odzyskany dzięki automatyzacji i skąd
   to wiecie?
2. Jakiej kompetencji zabraknie kupcom za trzy lata, jeśli dziś nic nie
   zmienimy w rekrutacji i ocenie pracy?
3. Kto u was może zmienić regułę, według której działa system albo agent? Jak
   długo trwa taka zmiana?
4. Która reguła w waszym obiegu odtwarza historyczną sekwencję, a nie wymóg
   polityki?
5. Gdzie procedura z jedną ścieżką jest lepszym wyborem niż pole z granicami?
6. Czy znacie koszt dnia zwłoki dla najważniejszych zakupów? Kto go szacuje?
7. Kto podpisuje się pod decyzją przygotowaną przez agenta i co musi zobaczyć,
   zanim to zrobi?
8. Jaki miernik poza czasem cyklu pokazał wam problem, którego czas cyklu nie
   pokazał?

## Źródła i granice twierdzeń

- ProcuraCost 2.3.1, kontrakt parametrów i dowodów:
  `docs/MODEL_PARAMETERS.md`; pakiet replikacyjny: `replication/outputs/`.
- Mamcarz, P. (2026). *Tunel czy pole?* oraz *Bariery autonomicznego
  sourcingu i negocjacji* oraz *Wdrożenie bez właściciela*. Szkice w
  `docs/articles/pl/`.
- Zero100. (2026, 30 stycznia). *Rise of the AI-Enabled CPO* [publiczna
  zapowiedź raportu; deklaracje respondentów, bez podanej liczebności próby].
  https://zero100.com/insights/rise-of-the-ai-enabled-cpo/
- EFESO Management Consultants. (2026). *2026 CPO Annual Pulse Report*, s. 4.
  Wywiady z 50 europejskimi CPO, grudzień 2025 r.
  https://www.efeso.com/wp-content/uploads/2026/01/2026-CPO-Annual-Pulse-Report-EFESO.pdf
- Szucs, F. (2024). *Discretion and Favoritism in Public Procurement*. Journal
  of the European Economic Association, 22(1), 117-160.
  https://doi.org/10.1093/jeea/jvad017
- Procurement&Beyond, odcinek 8. Rozmowa praktyczna, automatyczne napisy.
  https://www.youtube.com/watch?v=5KYUdTLlvvg

Liczby z ProcuraCost są wynikami zadeklarowanych założeń, nie obserwacjami.
Badania rynkowe opisują deklaracje badanych grup. Materiał Procurement&Beyond
służy do stawiania pytań i hipotez, nie do kalibracji modelu. Hipotezy o
kompetencjach i obchodzeniu procesu nie mają w projekcie danych empirycznych.

## O autorze

Paweł Mamcarz zajmuje się zakupami, negocjacjami i wdrożeniami systemów
zakupowych po stronie organizacji. Jest autorem modelu ProcuraCost. Strona
autora: https://mamcarz.com.
