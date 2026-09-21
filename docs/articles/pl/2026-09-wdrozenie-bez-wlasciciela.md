---
tytuł: "Wdrożenie bez właściciela"
podtytuł: "Dwie role i ciągłość odpowiedzialności we wdrożeniu systemu zakupowego"
data: 2026-09
autor: "Paweł Mamcarz"
autor_www: "https://mamcarz.com"
model: "ProcuraCost 2.3.0"
status: "szkic do redakcji"
---

# Wdrożenie bez właściciela

## Dwie role i ciągłość odpowiedzialności we wdrożeniu systemu zakupowego

Przed zakupem systemu trzeba ustalić, kto po stronie organizacji będzie
rozstrzygał spory o wymagania, odbierał pracę dostawcy i odpowiadał na zgłoszenia
użytkowników po uruchomieniu. Samo wskazanie sponsora lub kierownika projektu
nie wyjaśnia, kto przejmie te zadania po odbiorze.

Do tego problemu wracam po rozmowie w ósmym odcinku Procurement&Beyond.
Artykuł uzupełnia dwa wcześniejsze teksty: [Tunel czy pole](2026-07-tunel-pole-lepszy-biznes.md),
poświęcony kolejności pracy, oraz artykuł o
[barierach autonomicznego sourcingu](2026-09-bariery-autonomicznego-sourcingu.md),
dotyczący uprawnień agentów negocjacyjnych.

Na podstawie rozmowy proponuję rozróżnić dwie role i jeden warunek ich
utrzymania. To interpretacja praktyczna do sprawdzenia, nie przetestowana
typologia ani dowód, że brak jednej z ról przesądza o wyniku projektu.

## Kto ocenia wymagania i pilnuje zakresu

Organizacja potrzebuje osoby lub zespołu, który zna jej zakupy i potrafi
ocenić założenia dostawcy, integratora oraz użytkowników. Do tego zadania
odnosi się fragment
[Wewnętrzny właściciel decyzji (27:19 do 28:09)](https://youtu.be/5KYUdTLlvvg?t=1639)
rozmowy o kompetencjach po stronie klienta.

Rozważmy sytuację, w której dostawca proponuje konfigurację sprawdzoną
w innej organizacji. Integrator dopytuje o
wymagania i dostaje listę funkcji przepisaną z prezentacji. Nikt nie zadaje
pytania, czy dana funkcja rozwiązuje problem, który uzasadnił zakup. Można w ten
sposób rozbudować zakres bez poprawy procesu. To przykład ryzyka, które osoba
oceniająca wymagania powinna wychwycić przed zatwierdzeniem konfiguracji.

Sponsor powinien zapytać przed podpisem: kto w organizacji potrafi wskazać
konkretną nieefektywność, którą ten system ma usunąć, i kto powie dostawcy
„nie” w granicach uzgodnionego mandatu. Samo przypisanie zadania do IT albo
komitetu nie rozstrzyga sprawy. Trzeba wskazać kompetencje zakupowe, osobę
odpowiedzialną i sposób podejmowania decyzji; rolę można też pełnić zespołowo.

Fragment [Nieefektywność procesu przed wyborem systemu (09:52 do 10:56)](https://youtu.be/5KYUdTLlvvg?t=592)
dotyczy rozpoznania problemu przed zakupem. Mapa oczekiwania, powtórnej pracy
i przekazań między rolami daje podstawę do oceny, które funkcje są potrzebne.

## Kto pracuje z użytkownikami po uruchomieniu

Drugie zadanie to przygotowanie użytkowników do zmiany i rozpatrywanie ich
uwag. Fragment
[Mandat i komunikacja (28:27 do 29:06)](https://youtu.be/5KYUdTLlvvg?t=1707)
dotyczy celu wdrożenia, uprawnień do podejmowania decyzji i komunikacji.

Po technicznym uruchomieniu wnioskodawcy mogą nadal korzystać z poczty i arkuszy.
Trzeba wtedy ustalić, czy rozumieją nowy sposób pracy, czy potrafią obsłużyć
system i czy konfiguracja odpowiada ich sprawom. Za taką diagnozę oraz decyzję
o poprawkach powinna odpowiadać wskazana osoba. Potrzebuje dostępu do
użytkowników i uprawnień do rozstrzygania wyjątków lub kierowania ich do sponsora.

Sponsor powinien zapytać: kto będzie tłumaczył ten przebieg wnioskodawcom
biznesowym po zakończeniu projektu, kiedy integrator już wyjdzie, i jaki ma
mandat, żeby zmienić konfigurację, gdy użytkownicy pokażą, że coś nie działa.
Jeżeli odpowiedź brzmi „zespół projektowy”, warto dopytać, kto z tego zespołu
zostaje po odbiorze.

## Warunek ciągłości właścicielstwa

Oba zadania wymagają zastępstwa na wypadek odejścia osoby odpowiedzialnej. Fragment
[Ciągłość właścicielstwa (29:41 do 29:49)](https://youtu.be/5KYUdTLlvvg?t=1781)
jest krótki i dotyczy sytuacji, w której osoba napędzająca projekt odchodzi, a
nikt nie przygotował zastępstwa ani ścieżki decyzji.

Odejście właściciela może przerwać decyzje o zakresie i kontakt z użytkownikami,
jeżeli nikt nie przejmuje tych zadań. Jest to ryzyko do oceny w danym projekcie.
Rozmowa nie ustala częstości takiego przebiegu, typowego czasu wdrożenia ani
wpływu rotacji na adopcję.

Przed startem należy uzgodnić, kto przejmie decyzje i kontakt z użytkownikami
w razie zmiany właściciela. Zastępca powinien znać zakres zadania, mieć dostęp
do dokumentacji i potwierdzone uprawnienia. Samo wpisanie nazwiska do planu
projektu nie potwierdza gotowości do przejęcia odpowiedzialności.

## Jak rozpoznać ryzyka związane z tymi zadaniami

Do diagnozy potrzebne są konkretne sprawy, zgłoszenia i decyzje.

Jeżeli nowe funkcje nie rozwiązują problemu uzasadniającego zakup, warto wrócić
do mapy procesu i sprawdzić podstawę każdej zmiany zakresu. Gdy raport z systemu
nie odpowiada rzeczywistemu obiegowi spraw, potrzebne są rozmowy z użytkownikami
i prześledzenie konkretnych zakupów. Z kolei zaległe zgłoszenia mogą wymagać
sprawdzenia, kto ma uprawnienia i czas na decyzje o konfiguracji.

Podobne objawy mogą wynikać także z wad narzędzia, integracji lub niedoboru
zasobów. Diagnoza wymaga rozpatrzenia tych wyjaśnień, a nie tylko właścicielstwa.

## Co sprawdzić przed odwzorowaniem obecnego procesu

Przy ustalaniu konfiguracji przydatne są trzy tematy poruszone w rozmowie.

Pierwszy to [System nie powinien kopiować archaicznej sekwencji (39:45 do 41:35)](https://youtu.be/5KYUdTLlvvg?t=2385).
Odwzorowanie obecnego obiegu zatwierdzeń jeden do jednego może wydawać się
łatwiejsze niż uzgodnienie nowej kolejności. Może jednak utrwalić zbędną pracę.
Porównanie wariantów pozwala ocenić, czy zmiana kolejności rzeczywiście
ograniczy jej koszt.

Drugi to [Polityka jako granica kontroli (43:34 do 44:19)](https://youtu.be/5KYUdTLlvvg?t=2614).
Polityka zakupowa może wyznaczać szerszą granicę zgodności niż jedna stała
sekwencja kroków. Uprawnienia, zasady konkurencji, wymagany ślad decyzji i tryb
obsługi wyjątków pozostają niezmienne. Kolejność czynności wewnątrz tych ram
może być projektowana. Dla każdego zatwierdzenia trzeba więc ustalić, z jakiego
wymagania wynika i czy wymaga ono właśnie takiej kolejności.

Trzeci fragment jest uzupełnieniem obu poprzednich:
[Standaryzacja pracy i osąd ekspercki (04:31 do 06:48)](https://youtu.be/5KYUdTLlvvg?t=271).
Rozmowa odróżnia pracę nadającą się do standaryzacji od sytuacji wymagających
osądu. To podstawa do wskazania czynności automatycznych oraz wyjątków
wymagających decyzji człowieka.

## Nakład pracy po stronie organizacji

Fragment [Pełny koszt zamiast ceny zakupu (47:43 do 49:14)](https://youtu.be/5KYUdTLlvvg?t=2863)
dotyczy uzasadnienia biznesowego. Oprócz ceny licencji i usług dostawcy trzeba
oszacować własną pracę przy integracji, utrzymaniu i zmianie organizacyjnej.

Ocena wymagań, rozmowy z użytkownikami i przygotowanie zastępstwa zajmują czas
pracowników. W planie projektu należy przypisać im nakład i odpowiedzialność,
a potem porównać te założenia z rzeczywistą pracą.

## Pierwsze trzydzieści dni właściciela

Poniższa kolejność jest propozycją autora inspirowaną rozmową. Pierwszy miesiąc
i trzy sprawy są roboczą skalą warsztatu, nie zwalidowanymi progami. Pytania
warto rozważyć przed konfiguracją i dostosować do zakresu projektu.

1. Wskazać jedną nieefektywność, która uzasadnia zakup, i zapisać ją w jednym
   zdaniu, opisując problem użytkownika lub koszt obecnego procesu.
2. Przejść trzy zakończone sprawy zakupowe od wniosku do faktury i zaznaczyć,
   czas pracy, oczekiwania i powtórzenia czynności.
3. Dla każdego kroku obecnego obiegu zatwierdzeń odpowiedzieć, czy wynika z
   polityki, z przepisu, czy z przyzwyczajenia. Wymogi prawne wymagają poprawnego
   odwzorowania. Wymogi polityki również warto ocenić; ich zmiana wymaga
   decyzji uprawnionego właściciela, a nie samodzielnego pominięcia w konfiguracji.
4. Ustalić z zarządem zakres własnego mandatu na piśmie: jakie decyzje
   konfiguracyjne podejmuje właściciel sam, a jakie wymagają sponsora.
5. Wyznaczyć zastępcę i uzgodnić z nim sposób przejęcia odpowiedzialności.

Lista służy organizacji rozmowy i ujawnieniu brakujących ustaleń.

## Gotowość organizacyjna w ProcuraCost

Model ProcuraCost 2.3 nie liczy gotowości organizacyjnej. Porównuje koszt
dwóch projektów przebiegu procesu zakupowego w tych samych ramach prawnych i
ładzie zakupowym. Odpowiedzi o właścicielu, mandacie i ciągłości są zapisywane
oddzielnie od wejść kosztowych.

Gotowość organizacyjna do wdrożenia jest osobnym samoopisem. Obejmuje osiem
obszarów: cel, właściciel biznesowy i mandat, proces, wymagania, dane i
automatyzacja, ład, adopcja oraz wartość i wdrożenie. Zawiera szesnaście pytań,
każde z trzema odpowiedziami: warunek niespełniony, do uzupełnienia,
potwierdzony. Obszar właściciela biznesowego i mandatu czerpie tematycznie z
trzech fragmentów omawianych w tym tekście.

Samoopis nie przyznaje punktów ani wag i nie wydaje zbiorczej oceny lub decyzji
o uruchomieniu. Przy identycznych wejściach kosztowych wynik porównania
pozostaje taki sam niezależnie od odpowiedzi o gotowości. W serwisie samoopis
jest dostępny po zapisaniu porównania kosztu.

## Co jest obserwacją, a co hipotezą

Punktem wyjścia są obserwacje praktyczne z rozmowy. Podział na dwie role,
warunek ciągłości i opisane scenariusze niepowodzenia są ich redakcyjnym
rozwinięciem. Nie są wynikiem badania ani dosłownym odtworzeniem nagrania.

Opisany wcześniej samoopis gotowości jest autorską listą kontrolną, której
pytań dostarczyły także tematy rozmowy. Odpowiedzi wymagają potwierdzenia
w danej organizacji.

Hipotezy wymagające niezależnych danych są trzy:

1. Trwałe wewnętrzne właścicielstwo przewiduje adopcję systemu lepiej niż
   jakość narzędzia.
2. Zmapowanie tarcia w procesie przed wdrożeniem ogranicza zbędną konfigurację.
3. Uproszczenie polityki zmniejsza obciążenie zatwierdzeniami bez osłabienia
   kontroli na granicy.

Hipotezy te nie zostały sprawdzone na danych.

## Pytanie do zadania przed podpisem

Przed podpisaniem umowy sponsor powinien uzgodnić odpowiedź na pytanie:

> Kto po naszej stronie rozumie ten zakup, ma mandat, żeby powiedzieć
> dostawcy „nie”, będzie rozmawiał z użytkownikami po odbiorze i ma następcę,
> który o tym wie?

Jedno nazwisko nie wystarcza do potwierdzenia mandatu, a podział zadań między
kilka osób nie oznacza braku właścicielstwa. Istotne jest, czy odpowiedzialność,
uprawnienia i zastępstwo są uzgodnione oraz możliwe do wykonania.

## Źródła i granice twierdzeń

- Procurement&Beyond. (2026, 26 sierpnia). *Odcinek 8. Nawet najlepsze
  narzędzie nie uratuje złego wdrożenia* [rozmowa z praktykiem].
  https://www.youtube.com/watch?v=5KYUdTLlvvg
- Odnośniki czasowe w tekście prowadzą do fragmentów zarejestrowanych w
  rejestrze źródeł praktycznych ProcuraCost 2.3: 04:31, 09:52, 27:19, 28:27,
  29:41, 39:45, 43:34, 47:43.

Dostępna transkrypcja nagrania została wygenerowana automatycznie przez
YouTube i nie została zweryfikowana przez człowieka. Tekst nie zawiera cytatów
dosłownych. Opisy fragmentów są parafrazą autora, który jest rozmówcą w
nagraniu.

Materiał praktyczny służy do projektowania pytań i formułowania hipotez. Nie
ustala progów, wag, czasów przebiegu, stawek ról ani zakresów kalibracji modelu
ProcuraCost. Lista kontrolna gotowości jest zbiorem hipotez operacyjnych, nie
zwalidowanym instrumentem pomiarowym. Odpowiedzi w samoopisie nie wpływają na
różnicę kosztu. Tekst nie stanowi porady prawnej ani rekomendacji procedury.

## O autorze

Paweł Mamcarz zajmuje się zakupami, analityką i negocjacjami. Jest autorem
modelu ProcuraCost i rozmówcą w ósmym odcinku Procurement&Beyond, z którego
pochodzą obserwacje omawiane w tym tekście. Więcej na
[mamcarz.com](https://mamcarz.com). Pełne nagranie odcinka:
[youtube.com/watch?v=5KYUdTLlvvg](https://www.youtube.com/watch?v=5KYUdTLlvvg).
