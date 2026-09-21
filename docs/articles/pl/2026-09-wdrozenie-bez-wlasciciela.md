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

Tytuł ósmego odcinka Procurement&Beyond brzmi jak przestroga: nawet najlepsze
narzędzie nie uratuje złego wdrożenia. W rozmowie o systemach zakupowych łatwo
usłyszeć w tym zdaniu krytykę narzędzi. Chodzi o coś innego. Chodzi o to, że
wdrożenie ma właściciela albo go nie ma, a system tego nie zmienia.

Dwa wcześniejsze teksty z tej serii zajmują się innymi warstwami. Artykuł
[Tunel czy pole](2026-07-tunel-pole-lepszy-biznes.md) opisuje geometrię
przebiegu procesu: co musi zostać sekwencją, a co może być polem z granicą.
Artykuł o [barierach autonomicznego sourcingu](2026-09-bariery-autonomicznego-sourcingu.md)
pyta, kiedy organizacja odda mandat handlowy agentowi. Ten tekst zostawia
narzędzie i mapę procesu na boku i pyta o osobę. Kto po stronie organizacji
rozumie zakup, ma mandat i zostanie do końca.

Na podstawie rozmowy proponuję rozróżnić dwie role i jeden warunek ich
utrzymania. To interpretacja praktyczna do sprawdzenia, nie przetestowana
typologia ani dowód, że brak jednej z ról przesądza o wyniku projektu.

## Rola pierwsza: wewnętrzny kwestionujący

Pierwszą rolą jest osoba, która rozumie, co organizacja kupuje, i potrafi
zakwestionować założenia dostawcy, integratora oraz własnego zespołu. Fragment
[Wewnętrzny właściciel decyzji (27:19 do 28:09)](https://youtu.be/5KYUdTLlvvg?t=1639)
dotyczy właśnie tego: projekt potrzebuje kogoś, kto zna zakup od środka, a nie
tylko zna system.

Możliwy scenariusz bez tej roli wygląda następująco. Dostawca proponuje
konfigurację, która sprawdziła się gdzie indziej. Integrator dopytuje o
wymagania i dostaje listę funkcji przepisaną z prezentacji. Nikt nie zadaje
pytania, czy dana funkcja rozwiązuje problem, który uzasadnił zakup. Lista
rośnie, zakres puchnie, a pierwotna nieefektywność procesu zostaje nietknięta.

Sponsor powinien zapytać przed podpisem: kto w organizacji potrafi wskazać
konkretną nieefektywność, którą ten system ma usunąć, i kto powie dostawcy
„nie" w granicach uzgodnionego mandatu. Samo przypisanie zadania do IT albo
komitetu nie rozstrzyga sprawy. Trzeba wskazać kompetencje zakupowe, osobę
odpowiedzialną i sposób podejmowania decyzji; rolę można też pełnić zespołowo.

Fragment [Nieefektywność procesu przed wyborem systemu (09:52 do 10:56)](https://youtu.be/5KYUdTLlvvg?t=592)
pokazuje, skąd ta osoba czerpie mandat merytoryczny. Punktem wyjścia jest
rozpoznana nieefektywność, nie deklaracja wdrożenia. Kto zmapował tarcie w
procesie przed wyborem narzędzia, ten potrafi później odrzucić funkcję, która
tego tarcia nie dotyka.

## Rola druga: wewnętrzny ambasador

Drugą rolą jest ambasador. Fragment
[Mandat i komunikacja (28:27 do 29:06)](https://youtu.be/5KYUdTLlvvg?t=1707)
pozwala postawić pytanie o połączenie trzech rzeczy:
wizję biznesową, mandat decyzyjny i komunikację z użytkownikami.

Kwestionujący ma chronić zakres, a ambasador wspierać adopcję. Bez odpowiedzialności
za komunikację istnieje ryzyko, że techniczne uruchomienie nie przełoży się na
użytkowanie. W takim scenariuszu wnioskodawcy biznesowi wracają
do poczty i arkuszy, ponieważ nikt nie przetłumaczył im, po co nowy przebieg
istnieje i co zmienia w ich pracy. Zespół zakupowy uczy się omijać ekrany,
które nie mają dla niego sensu. Raporty pokazują, że system działa, a
organizacja pracuje obok niego.

Ta rola wymaga czegoś więcej niż entuzjazmu. Wymaga mandatu. Osoba, która
komunikuje zmianę, ale nie może zdecydować o wyjątku, szybko traci wiarygodność.
Osoba, która ma mandat, ale nie rozmawia z użytkownikami, szybko traci kontakt
z tym, co się dzieje na ekranach.

Sponsor powinien zapytać: kto będzie tłumaczył ten przebieg wnioskodawcom
biznesowym po zakończeniu projektu, kiedy integrator już wyjdzie, i jaki ma
mandat, żeby zmienić konfigurację, gdy użytkownicy pokażą, że coś nie działa.
Jeżeli odpowiedź brzmi „zespół projektowy", warto dopytać, kto z tego zespołu
zostaje po odbiorze.

## Warunek ciągłości właścicielstwa

Ciągłość nie jest trzecią rolą, lecz warunkiem utrzymania odpowiedzialności. Fragment
[Ciągłość właścicielstwa (29:41 do 29:49)](https://youtu.be/5KYUdTLlvvg?t=1781)
jest krótki i dotyczy sytuacji, w której osoba napędzająca projekt odchodzi, a
nikt nie przygotował zastępstwa ani ścieżki decyzji.

Odejście właściciela może przerwać decyzje o zakresie i kontakt z użytkownikami,
jeżeli nikt nie przejmuje tych zadań. Jest to ryzyko do oceny w danym projekcie.
Rozmowa nie ustala częstości takiego przebiegu, typowego czasu wdrożenia ani
wpływu rotacji na adopcję.

Sponsor powinien zapytać: kto przejmie tę rolę, jeżeli obecny właściciel
zmieni pracę w trzecim kwartale, i czy ta osoba wie o tym dzisiaj. Odpowiedź
„zobaczymy" oznacza, że warunek nie jest spełniony. Odpowiedź z nazwiskiem i
datą rozmowy oznacza, że jest spełniony do potwierdzenia.

## Jak rozpoznać ryzyka związane z tymi zadaniami

Poniższe wzorce są scenariuszami diagnostycznymi. Mogą pomóc zadać pytania,
ale nie pozwalają przypisać przyczyny na podstawie samego objawu.

Bez kwestionowania zakresu projekt może zakończyć się systemem, który robi dużo rzeczy i nie
usuwa nieefektywności, dla której powstał. Objawem jest lista funkcji dłuższa
niż lista problemów. Interwencją jest powrót do mapy tarcia sprzed wyboru
systemu.

Bez wsparcia adopcji może powstać system technicznie działający, lecz rzadko
używany. Sygnałem jest rozjazd między raportem z systemu a faktycznym przebiegiem
spraw. Interwencją jest osoba z mandatem, która zaczyna rozmawiać z
wnioskodawcami biznesowymi.

Bez ciągłości odpowiedzialności rozwój systemu może się zatrzymać. Sygnałem
jest brak zmian konfiguracji przez kilka kwartałów mimo zgłoszeń. Interwencją
jest wyznaczenie właściciela na nowo, z pełnym mandatem, a nie „opiekuna".

Podobne objawy mogą wynikać także z wad narzędzia, integracji lub niedoboru
zasobów. Diagnoza wymaga rozpatrzenia tych wyjaśnień, a nie tylko właścicielstwa.

## Dwa fragmenty, które właściciel powinien znać na pamięć

Dwa fragmenty rozmowy dotyczą decyzji, które właściciel podejmuje w pierwszych
tygodniach i których później nie da się łatwo cofnąć.

Pierwszy to [System nie powinien kopiować archaicznej sekwencji (39:45 do 41:35)](https://youtu.be/5KYUdTLlvvg?t=2385).
Odwzorowanie obecnego obiegu zatwierdzeń jeden do jednego może wydawać się
łatwiejsze niż uzgodnienie nowej kolejności. Może jednak utrwalić zbędną pracę. Ocena
jej kosztu wymaga porównania wariantów, a nie założenia, że odwzorowanie
obecnego obiegu jest zawsze najdroższe.

Drugi to [Polityka jako granica kontroli (43:34 do 44:19)](https://youtu.be/5KYUdTLlvvg?t=2614).
Polityka zakupowa może wyznaczać szerszą granicę zgodności niż jedna stała
sekwencja kroków. Uprawnienia, zasady konkurencji, wymagany ślad decyzji i tryb
obsługi wyjątków pozostają niezmienne. Kolejność czynności wewnątrz tych ram
może być projektowana. Właściciel, który tego rozróżnienia nie rozumie, będzie
bronił każdego kroku jako wymogu zgodności. Właściciel, który je rozumie,
potrafi wskazać, które kroki są granicą, a które nawykiem.

Trzeci fragment jest uzupełnieniem obu poprzednich:
[Standaryzacja pracy i osąd ekspercki (04:31 do 06:48)](https://youtu.be/5KYUdTLlvvg?t=271).
Rozmowa odróżnia pracę nadającą się do standaryzacji od sytuacji wymagających
osądu. Właściciel, który potrafi to rozdzielić, wie, gdzie system ma prowadzić,
a gdzie ma zostawić miejsce na decyzję człowieka.

## Koszt, którego nie ma w ofercie

Fragment [Pełny koszt zamiast ceny zakupu (47:43 do 49:14)](https://youtu.be/5KYUdTLlvvg?t=2863)
dotyczy uzasadnienia biznesowego. Cena licencji i koszt wdrożenia są w ofercie.
Koszt integracji, utrzymania i zmiany organizacyjnej trzeba policzyć samemu.

Dwie role i zapewnienie ciągłości są częścią tego ostatniego składnika. Kwestionujący
poświęca na projekt czas, którego nie ma w harmonogramie dostawcy. Ambasador
prowadzi rozmowy, które nie są w zakresie integratora. Zastępstwo trzeba
przygotować, zanim będzie potrzebne. To nie jest koszt ukryty. To koszt, który
organizacja powinna ująć w planie, aby móc później ocenić faktyczny nakład.

## Pierwsze trzydzieści dni właściciela

Poniższa kolejność jest propozycją autora inspirowaną rozmową. Pierwszy miesiąc
i trzy sprawy są roboczą skalą warsztatu, nie zwalidowanymi progami. Pytania
warto rozważyć przed konfiguracją i dostosować do zakresu projektu.

1. Wskazać jedną nieefektywność, która uzasadnia zakup, i zapisać ją w jednym
   zdaniu. Jeżeli zdanie zaczyna się od nazwy systemu, trzeba je napisać od
   nowa.
2. Przejść trzy zakończone sprawy zakupowe od wniosku do faktury i zaznaczyć,
   gdzie sprawa czekała, a nie była przetwarzana. To jest mapa tarcia.
3. Dla każdego kroku obecnego obiegu zatwierdzeń odpowiedzieć, czy wynika z
   polityki, z przepisu, czy z przyzwyczajenia. Wymogi prawne wymagają poprawnego
   odwzorowania. Wymogi polityki również warto ocenić; ich zmiana wymaga
   decyzji uprawnionego właściciela, a nie samodzielnego pominięcia w konfiguracji.
4. Ustalić z zarządem zakres własnego mandatu na piśmie: jakie decyzje
   konfiguracyjne podejmuje właściciel sam, a jakie wymagają sponsora.
5. Wyznaczyć następcę i odbyć z nim pierwszą rozmowę o projekcie w pierwszym
   miesiącu, nie w ostatnim.

Pięć kroków nie gwarantuje udanego wdrożenia. Ich wartości prognostycznej
nie sprawdzono; służą organizacji rozmowy i ujawnieniu brakujących ustaleń.

## Jak ProcuraCost trzyma tę warstwę osobno

Model ProcuraCost 2.3 nie liczy gotowości organizacyjnej. Porównuje koszt
dwóch projektów przebiegu procesu zakupowego w tych samych ramach prawnych i
ładzie zakupowym. Pytania o właściciela, mandat i ciągłość nie mają w tym
rachunku żadnego miejsca, i to jest decyzja projektowa, nie przeoczenie.

Gotowość organizacyjna do wdrożenia jest osobnym samoopisem. Obejmuje osiem
obszarów: cel, właściciel biznesowy i mandat, proces, wymagania, dane i
automatyzacja, ład, adopcja oraz wartość i wdrożenie. W sumie szesnaście pytań.
Na każde są trzy odpowiedzi: warunek niespełniony, do uzupełnienia,
potwierdzony. Obszar właściciela biznesowego i mandatu czerpie tematycznie z
trzech fragmentów omawianych w tym tekście.

Samoopis nie ma punktów, wag, oceny zbiorczej ani decyzji „idziemy albo nie".
Nie zmienia różnicy kosztu ani o złotówkę. Organizacja, która odpowie
„niespełniony" na wszystkie szesnaście pytań, przy identycznych wejściach
kosztowych dostanie ten sam wynik
co organizacja, która odpowie „potwierdzony". Powód jest prosty: gotowość nie
jest parametrem modelu kosztowego, a mieszanie tych warstw prowadzi do rachunku,
którego nie da się odtworzyć.

Jeżeli ktoś chce zobaczyć, jak to wygląda w praktyce, kolejność jest ustalona:
najpierw zapis porównania kosztu, dopiero potem samoopis gotowości. Nie
odwrotnie i nie równolegle.

## Co jest obserwacją, a co hipotezą

Warto jasno oddzielić trzy rodzaje twierdzeń w tym tekście.

Punktem wyjścia są obserwacje praktyczne z rozmowy. Podział na dwie role,
warunek ciągłości i opisane scenariusze niepowodzenia są ich redakcyjnym
rozwinięciem. Nie są wynikiem badania ani dosłownym odtworzeniem nagrania.

Decyzje projektowe to konstrukcja samoopisu gotowości: osiem obszarów,
szesnaście pytań, trzy odpowiedzi. Lista została opracowana jako zbiór hipotez
operacyjnych. Rozmowa dostarczyła kontekstu do jej pytań, ale nie dowodzi, że
którykolwiek warunek jest spełniony w jakiejkolwiek organizacji.

Hipotezy wymagające niezależnych danych są trzy:

1. Trwałe wewnętrzne właścicielstwo przewiduje adopcję systemu lepiej niż
   jakość narzędzia.
2. Zmapowanie tarcia w procesie przed wdrożeniem ogranicza zbędną konfigurację.
3. Uproszczenie polityki zmniejsza obciążenie zatwierdzeniami bez osłabienia
   kontroli na granicy.

Każda z nich brzmi przekonująco. Żadna nie została sprawdzona na danych. Ich
sformułowanie jest celem tego tekstu, nie ich udowodnienie.

## Pytanie do zadania przed podpisem

Wszystko powyższe sprowadza się do jednego pytania, które sponsor powinien
zadać, zanim podpisze umowę na system zakupowy:

> Kto po naszej stronie rozumie ten zakup, ma mandat, żeby powiedzieć
> dostawcy „nie", będzie rozmawiał z użytkownikami po odbiorze i ma następcę,
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
