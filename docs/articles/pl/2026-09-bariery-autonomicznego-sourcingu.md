---
tytuł: "Bariery autonomicznego sourcingu i negocjacji"
podtytuł: "Kiedy zacząć od ogona wydatków, a kiedy zachować decyzję po stronie kupca"
data: 2026-09
autor: "Paweł Mamcarz"
autor_www: "https://mamcarz.com"
model: "ProcuraCost 2.3.0"
status: "szkic po przeglądzie źródeł, do akceptacji redakcyjnej"
---

# Bariery autonomicznego sourcingu i negocjacji

## Kiedy zacząć od ogona wydatków, a kiedy zachować decyzję po stronie kupca

Dyskusja o sztucznej inteligencji w zakupach zwykle miesza dwie różne sprawy.
Pierwsza to asystent, który streszcza umowę, porządkuje wniosek zakupowy albo
podpowiada kategorię. Druga to agent, który samodzielnie uruchamia zapytanie
ofertowe, prowadzi negocjację i doprowadza sprawę do rozstrzygnięcia. Bariery
dla obu są zupełnie inne, dlatego wnioski z jednej dyskusji nie przenoszą się na
drugą.

Znaczenie ma zakres uprawnień i konsekwencje błędu. Błędna interpretacja
wniosku może wymagać korekty, ale może też przejść niezauważona do dalszych
decyzji. Agent negocjujący w imieniu organizacji dodatkowo wpływa na warunki
handlowe i relację z dostawcą. Dlatego oba zastosowania wymagają kontroli,
dobranej do skutków działania i możliwości jego cofnięcia.

Raport EFESO z 2026 r., oparty na rozmowach z 50 europejskimi dyrektorami
zakupów, podaje pięć procent szerokich wdrożeń GenAI i siedemdziesiąt pięć
procent organizacji w fazie eksperymentowania. To opis badanej grupy oraz
generatywnej AI ogółem, nie pomiar odsetka firm, które oddały agentowi mandat
negocjacyjny. Pozwala postawić pytanie o skalowanie, ale nie wyjaśnia sam
przyczyn różnicy między pilotażem a wdrożeniem.

Poniższy porządek jest propozycją pytań do projektu. Kolejność i znaczenie
barier zależą od kategorii, organizacji oraz zakresu uprawnień agenta.

## Osiem barier do sprawdzenia przed uruchomieniem

### 1. Zaufanie do autonomicznej decyzji, nie do chatbota

Pierwsza bariera jest organizacyjna, nie techniczna. Nie chodzi o to, czy model
językowy potrafi napisać zapytanie ofertowe. Chodzi o to, czy zarząd odda
mandat handlowy systemowi.

Badanie Zero100 pokazuje napięcie w czystej postaci: osiemdziesiąt pięć procent
dyrektorów zakupów zgadza się, że agentowa sztuczna inteligencja fundamentalnie
zmieni sposób pracy organizacji sourcingowych, a siedemdziesiąt osiem procent
chce, żeby ludzie zachowali kontrolę nad całą pracą strategiczną. Te dwie
odpowiedzi nie są sprzeczne. Opisują gotowość na zmianę narzędzi przy
jednoczesnej niechęci do oddania decyzji.

Komunikat ProcureAbility przypisuje obawę przed zastąpieniem ludzkiego osądu
51 procentom respondentów w opisie barier grupy, która nie deklarowała pełnej
gotowości do AI. Nie należy przedstawiać tego jako odsetka wszystkich firm
na rynku ani wyłącznie użytkowników agentów negocjacyjnych. W kontekście
negocjacji ta obawa jest racjonalna, nie irracjonalna. Agent może oddać rabat,
którego doświadczony kupiec kategorii nie oddałby przy tym samym wolumenie,
ponieważ zna historię relacji, planowany przetarg w sąsiedniej kategorii albo
zależność techniczną, której nie ma w danych.

Warto nazywać tę barierę precyzyjnie. To nie jest lęk przed technologią. To
pytanie o pełnomocnictwo.

### 2. Akceptacja po stronie dostawcy

Druga bariera dotyczy udziału dostawców. Kupujący może wdrożyć agenta jednostronną
decyzją. Nie może jednostronnie zmusić dostawcy do rozmowy z maszyną.

W opisie wdrożenia Kärchera dostawca Procure Ai podaje 90 procent zaangażowania
dostawców, 50 procent skuteczności negocjacji i sześć procent średniego rabatu.
Zaangażowanie nie jest zatem tożsame z zawarciem porozumienia. Pactum podaje
dla Walmart 68 procent porozumień wśród dostawców zaangażowanych przez
platformę oraz wydłużenie terminów płatności. Są to wyniki raportowane przez
dostawców narzędzi, bez niezależnego odtworzenia w tym artykule.

Tych wyników nie można przyjąć za normę rynkową. W pilotażu należy sprawdzić
udział, odmowy i porozumienia osobno dla kategorii oraz grup dostawców.
Przywołane opisy nie uzasadniają wniosków o kulturowych różnicach między regionami.

Obawy dostawców dają się wyliczyć i warto je adresować wprost w projekcie
procesu:

- powtórzenie mechaniki aukcji elektronicznej i zejścia cenowego bez granicy;
- ujawnienie własnej struktury kosztu w rozmowie z systemem, który zapamiętuje;
- brak zrozumienia dla wielkości opakowania, minimalnej wielkości zamówienia
  albo kosztu oprzyrządowania;
- brak osoby, do której można eskalować wyjątek.

Ostatni punkt jest projektowy, nie technologiczny. Ścieżka eskalacji do
człowieka powinna być widoczna dla dostawcy od pierwszej wiadomości.

### 3. Dane i specyfikacja, nie model

Trzecia bariera pojawia się na wejściu, zanim jakakolwiek negocjacja się
zacznie. Autonomiczne zapytanie ofertowe wymaga kompletnego opisu potrzeby,
spójnej klasyfikacji, historii cen i aktualnej dokumentacji technicznej.

W praktyce brief bywa niekompletny, klasyfikacja rozjechana między systemami,
rysunek nieaktualny, a dostawca dotychczasowy wymieszany w danych z ogonem
wydatków. Agent negocjuje wyłącznie to, co dostał na wejściu. Wadliwy opis
potrzeby daje wadliwe rozstrzygnięcie, tyle że szybciej i w większej skali.

To bariera, którą łatwo pomylić z barierą modelu. Organizacja mówi, że agent
sobie nie poradził, podczas gdy nie poradziłby sobie również kupiec, gdyby
dostał ten sam materiał wejściowy.

### 4. Integracja z systemem zapisu

Wynik negocjacji trzeba przenieść do właściwego rejestru umowy lub zamówienia.
Zależnie od procesu może to wymagać także aktualizacji rekordu informacyjnego
lub listy źródeł. Ręczne przepisanie wyniku może być rozwiązaniem pilotażowym,
ale jego czas i ryzyko błędów należy uwzględnić w rachunku korzyści.

Pytanie, które trzeba rozstrzygnąć przed pilotażem, brzmi: co jest źródłem
prawdy po rozstrzygnięciu. Jeżeli odpowiedź brzmi „agent, a potem ktoś to
wprowadzi", organizacja właśnie stworzyła drugi rejestr. W środowiskach z
działającym stosem ERP jest to bariera pierwszorzędna, ponieważ narzędzie bez
natywnego zapisu konkuruje z systemem transakcyjnym zamiast go zasilać.

### 5. Umocowanie, odpowiedzialność i prawo

Piąta bariera wymaga analizy prawnej konkretnego procesu i zakresu uprawnień.

Podstawowe pytanie dotyczy reprezentacji. Kto wiąże spółkę, kiedy agent wyraża
zgodę. Regulamin podpisywania, zasady reprezentacji łącznej i kontrola dwóch par
oczu powstawały przy założeniu, że oświadczenie woli składa człowiek. Uzgodnienie
warunków przez system, który działa w imieniu organizacji, wymaga wcześniejszego
ustalenia zakresu umocowania, progu wartości i katalogu warunków, których agent
nie może zmienić.

Kwestia druga dotyczy zachowania jako źródła zobowiązania. Konsekwentne
zachowanie agenta, na przykład przyjmowanie ofert w powtarzalnym schemacie, może
w niektórych porządkach prawnych rodzić skutki nawet bez formalnego podpisu.

Kwestia trzecia dotyczy regulacji sektorowej. Warto tu zachować precyzję,
ponieważ w dyskusji rynkowej pojawia się skrót myślowy. Akt o sztucznej
inteligencji nie klasyfikuje automatycznie każdego systemu wpływającego na
decyzje gospodarcze jako wysokiego ryzyka. Załącznik trzeci wymienia konkretne
zastosowania, a typowa negocjacja handlowa między przedsiębiorcami do nich nie
należy wyłącznie z racji prowadzenia negocjacji. Art. 50 ust. 1 AI Act dotyczy
dostawców systemów przeznaczonych do bezpośredniej interakcji z osobami
fizycznymi: mają zapewnić informację o interakcji z AI, chyba że jest to
oczywiste w okolicznościach wskazanych w przepisie. Nie jest to identyczny
obowiązek dla każdej wymiany między systemami. Zastosowanie w sektorze publicznym oraz
przetwarzanie danych osób kontaktowych po stronie dostawcy wymagają odrębnej
analizy.

Kwestia czwarta dotyczy prawa konkurencji. Projekt wymaga sprawdzenia, czy
system nie ujawnia informacji handlowych konkurentom ani nie realizuje
niedozwolonych uzgodnień. Sam fakt użycia agentów po dwóch stronach negocjacji
nie dowodzi zmowy. Ocenę przepływów informacji i odpowiedzialności trzeba
odnieść do konkretnego zastosowania, a nie do etykiety „autonomiczny”.

W zamówieniach publicznych i sektorach regulowanych dochodzi jeszcze zarzut
stronniczości opisu potrzeby. Opis wygenerowany przez system, który w danych
treningowych albo kontekstowych ma dokumentację jednego dostawcy, może
faworyzować to rozwiązanie bez świadomej decyzji kogokolwiek.

### 6. Dopasowanie kategorialne

Szósta bariera dotyczy dopasowania kategorii. Kandydatami do ograniczonego
pilotażu są zakupy, gdzie przedmiot jest powtarzalny, a zmienne dają się zamknąć
w kilku parametrach: materiały pośrednie, zakupy jednorazowe, ogon wydatków,
renegocjacja terminów płatności albo formuły indeksacji, kampanie obejmujące
setki indeksów.

Osobnej walidacji wymagają przypadki, gdzie istotna wartość leży poza ceną: zakupy bezpośrednie z
oprzyrządowaniem, krytyczne podwójne źródło dostaw, sourcing innowacji,
oligopol trzech dostawców, umowy ramowe z poziomami usług i ograniczeniem
odpowiedzialności.

Zakres pilotażu trzeba zestawić z kosztem integracji i zmiany organizacyjnej.
Wynik osiągnięty na ogonie wydatków nie wystarcza do uzasadnienia użycia agenta
w strategicznym zestawieniu materiałowym. Nie oznacza też, że korzyść na
ogonie wydatków jest z definicji za mała.

### 7. Rola kupca i opór centrum usług wspólnych

Siódma bariera jest polityczna. Autonomiczny sourcing zabiera pracę, która
uzasadnia etaty operacyjne i wartość kontraktu z dostawcą usług outsourcingu.
Bez przebudowy modelu operacyjnego uwolniony czas nie ma dokąd pójść, a
zespół obawia się, że będzie oceniany za liczbę postępowań, których już nie
prowadzi.

Zmiana miar oceny zespołu może pomóc, ale nie zastępuje uzgodnienia nowych
zadań, kompetencji i odpowiedzialności.

### 8. Niejasny zwrot poza pilotażem

Ósma bariera dotyczy zwrotu przy większym zakresie. Pilotaż może wykazać rabat,
brak poprawy albo pogorszenie warunków. Skala wymaga obsługi większej liczby
dostawców, ustawienia granic
dla każdej kategorii i zamknięcia drogi od rozstrzygnięcia do zamówienia.
Dyrektor finansowy widzi licencję, koszt zmiany organizacyjnej i ryzyko relacji
po jednej stronie, a niepewny kilkuprocentowy efekt na części wydatków po
drugiej.

Dane EFESO opisują poziom wdrożenia GenAI w badanej grupie. Nie identyfikują
przyczyn zatrzymania pilotażu ani zwrotu z autonomicznych negocjacji.

## Gdzie te bariery leżą na osiach ProcuraCost

Model 2.3 rozdziela ramy prawne i ład zakupowy, rodzinę procedury, archetyp
zakupu, projekt przebiegu procesu zakupowego, kanał realizacji, wsparcie
systemowe i konstrukcję umowy. To rozdzielenie jest tu użyteczne, ponieważ
większość nieporozumień wokół agentów bierze się ze sklejenia tych osi w jedną
etykietę technologiczną.

Agent negocjacyjny jest zmianą na osi wsparcia systemowego. Sam z siebie nie
zmienia ram prawnych, rodziny procedury ani obowiązkowych terminów oczekiwania.
Może natomiast zmienić projekt przebiegu procesu, jeżeli usuwa czynność,
uruchamia pracę równolegle albo skraca oczekiwanie na odpowiedź dostawcy. Może
też zmienić konstrukcję umowy, jeżeli negocjuje warunki płatności lub formułę
indeksacji.

Z tego wynika reguła porządkująca dyskusję o uzasadnieniu biznesowym.
Wprowadzenie agenta nie jest samo w sobie mechanizmem oszczędności. Mechanizmem
jest konkretna zmiana w mapie przebiegu albo w projekcie umowy, którą agent
umożliwia. Jeżeli zmienia się wyłącznie nazwa narzędzia, nie ma podstawy do
przypisania mu korzyści. Przy tej samej topologii mogą jednak zmienić się czasy
kroków, nakład ról i koszty wsparcia. Model może porównać takie zadeklarowane wejścia.

Trzy granice modelu mają tu bezpośrednie zastosowanie:

1. Znak różnicy kosztu nie jest z góry ustalony. Agent może wydłużyć przebieg,
   na przykład przez rundę wyjaśnień z dostawcą, który nie zrozumiał zapytania.
   Wynik ujemny jest pełnoprawnym wynikiem.
2. Obowiązkowe terminy prawne pozostają zablokowane i identyczne po obu
   stronach porównania. Automatyzacja przygotowania nie skraca ustawowego
   terminu składania ofert ani terminu oczekiwania przed zawarciem umowy.
3. Gotowość organizacyjna do wdrożenia jest opisywana osobno i nie wpływa na
   różnicę kosztu. Bariery od pierwszej do ósmej opisanej wyżej należą właśnie
   do tej warstwy. Są warunkami uruchomienia, nie składnikami rachunku.

Nieformalne obejście procesu pozostaje poza monetyzacją. Jest to istotne przy
ocenie agentów, ponieważ obejście nieprzejrzystego procesu jest jednym z ryzyk
do zbadania. Przywołane źródła nie ustalają jego częstości względem eskalacji.

## Co o tych barierach mówi praktyka wdrożeń

Ósmy odcinek Procurement&Beyond dotyczy wdrożeń systemów zakupowych, nie
agentów negocjacyjnych. Mimo to większość barier opisanych wyżej pojawia się w
rozmowie w innym przebraniu. Poniżej zestawiam je z konkretnymi fragmentami
nagrania. Każdy fragment stawia pytanie, którego warto użyć w warsztacie przed
pilotażem. Żaden nie dowodzi tezy ani nie ustala parametru.

Bariera pierwsza, mandat, sprowadza się w rozmowie do pytania, czy po stronie
organizacji jest osoba, która rozumie zakup i potrafi zakwestionować założenia
dostawcy narzędzia. Bez takiej osoby agent dostaje mandat, którego nikt
świadomie nie nadał. Fragmenty:
[Wewnętrzny właściciel decyzji](https://youtu.be/5KYUdTLlvvg?t=1639)
(27:19 do 28:09),
[Mandat i komunikacja](https://youtu.be/5KYUdTLlvvg?t=1707)
(28:27 do 29:06) oraz
[Ciągłość właścicielstwa](https://youtu.be/5KYUdTLlvvg?t=1781)
(29:41 do 29:49). Hipoteza do sprawdzenia: trwałe wewnętrzne właścicielstwo
przewiduje, czy rozstrzygnięcia agenta są odwracane, czy przyjmowane.

Bariera trzecia, dane i specyfikacja, ma w rozmowie trzy odsłony. Pierwsza
dotyczy tego, czy organizacja rozpoznała konkretną nieefektywność, zanim
wybrała narzędzie. Druga dotyczy ryzyka rozbudowy wymagań o szczegóły bez
znaczenia dla głównego problemu. Trzecia dotyczy obszarów pominiętych mimo
długiej listy funkcji. Dla agenta negocjacyjnego to dokładnie pytanie o jakość
opisu potrzeby na wejściu. Fragmenty:
[Nieefektywność procesu przed wyborem systemu](https://youtu.be/5KYUdTLlvvg?t=592)
(09:52 do 10:56),
[Wymagania marginalne](https://youtu.be/5KYUdTLlvvg?t=946)
(15:46 do 16:57) oraz
[Luki w specyfikacji](https://youtu.be/5KYUdTLlvvg?t=1074)
(17:54 do 18:23).

Bariera czwarta, zapis do systemu, odpowiada w rozmowie obserwacji, że wybór
dostawcy nie wyczerpuje procesu zakupowego. Zamówienie, odbiór, faktura i
wyjątek muszą być ujęte w zakresie. Agent, który kończy pracę na
rozstrzygnięciu, zostawia resztę przebiegu bez właściciela. Fragment:
[Zakupy operacyjne w pełnym przebiegu procesu](https://youtu.be/5KYUdTLlvvg?t=1023)
(17:03 do 17:48).

Bariera piąta, w części dotyczącej łańcuchów zatwierdzeń, ma w rozmowie
odpowiednik w pytaniu, czy konfiguracja utrwala historyczne kroki bez ponownego
uzasadnienia. Dla agenta jest to pytanie, czy jego granice odtwarzają starą
sekwencję, czy wynikają z polityki. Polityka może wyznaczać szerszą granicę
zgodności niż jedna stała kolejność kroków. Fragmenty:
[System nie powinien kopiować archaicznej sekwencji](https://youtu.be/5KYUdTLlvvg?t=2385)
(39:45 do 41:35) oraz
[Polityka jako granica kontroli](https://youtu.be/5KYUdTLlvvg?t=2614)
(43:34 do 44:19).

Bariera siódma, rola kupca, pojawia się w rozmowie jako rozróżnienie pracy
nadającej się do standaryzacji od sytuacji wymagających osądu eksperta. To
samo rozróżnienie decyduje, które kategorie mogą trafić do agenta, a które
zostają przy człowieku. Fragment:
[Standaryzacja pracy i osąd ekspercki](https://youtu.be/5KYUdTLlvvg?t=271)
(04:31 do 06:48).

Bariera ósma, zwrot poza pilotażem, ma w rozmowie odpowiednik w pytaniu o
pełny koszt zamiast ceny zakupu: wdrożenie, integrację, utrzymanie i zmianę
organizacyjną. Udział licencji agenta w tym rachunku wymaga osobnego oszacowania.
Fragment:
[Pełny koszt zamiast ceny zakupu](https://youtu.be/5KYUdTLlvvg?t=2863)
(47:43 do 49:14).

Granica wykorzystania sztucznej inteligencji, opisana w sekcji o osiach
modelu, ma w rozmowie dwa fragmenty. Pierwszy pokazuje użycie modelu
językowego do porządkowania danych rynkowych z jawnym kompromisem czasu i
kosztu. Drugi rozdziela przygotowanie danych, deterministyczne obliczenie i
wsparcie modelu jako trzy odrębne role. Ta sama zasada dotyczy agenta:
strukturyzuje i proponuje, a rachunek i decyzja pozostają przejrzyste.
Fragmenty:
[Bielik i strukturyzowanie danych rynkowych](https://youtu.be/5KYUdTLlvvg?t=3539)
(58:59 do 60:49) oraz
[Oddzielenie danych, matematyki i wsparcia ML](https://youtu.be/5KYUdTLlvvg?t=3810)
(63:30 do 65:54).

Rozmowa dotyczy wdrożeń systemów zakupowych. Odniesienie jej pytań do agentów
negocjacyjnych jest propozycją autora, wymagającą sprawdzenia w tym odrębnym
kontekście. Dostępne automatyczne napisy nie zostały zweryfikowane przez
człowieka; odnośniki czasowe służą odnalezieniu fragmentów do odsłuchu.

## Co z tego wynika dla wyboru narzędzia

Porównanie narzędzi powinno dotyczyć konkretnej wersji i zakresu wdrożenia.
Ogólne pozycjonowanie marki nie wystarcza do ustalenia jej uprawnień ani
zdolności integracyjnych. Na demonstracji warto użyć tych samych pytań:

| Obszar | Co pokazać na rzeczywistym przykładzie |
|---|---|
| Mandat | Które warunki agent może uzgodnić, a które wymagają zatwierdzenia? |
| Dostawca | Jak odmawia udziału i jak przekazuje wyjątek człowiekowi? |
| Dane | Jak system zatrzymuje niekompletną lub sprzeczną specyfikację? |
| Integracja | Jak zaakceptowane warunki trafiają do właściwego rekordu umowy lub zamówienia? |
| Kontrola | Jak odtworzyć wejścia, uprawnienia, zmianę warunków i decyzję zatwierdzającą? |

Odpowiedzi trzeba sprawdzić w oferowanej konfiguracji. Artykuł nie zawiera
niezależnego testu porównawczego platform.

## Co mierzyć na pilotażu

Jednym z błędów pilotażu jest sprowadzenie oceny do procentu oszczędności.
Ta liczba nie odpowiada na pytanie, czy bariery faktycznie opadły, a przy małej
próbie bywa artefaktem doboru kategorii.

Cztery mierniki mówią więcej:

1. Wskaźnik udziału dostawców w zainicjowanych rozmowach. Odpowiada na barierę
   drugą. Trzeba osobno podać liczbę zaproszonych, uczestniczących i tych,
   którzy zawarli porozumienie, aby ujawnić selekcję do wyniku.
2. Wskaźnik eskalacji do człowieka wraz z przyczyną. Odróżnia wyjątek
   projektowy od luki w opisie potrzeby.
3. Odsetek rozstrzygnięć odwróconych albo skorygowanych przez kupca. Mierzy
   wykorzystanie nadzoru; sama korekta nie rozstrzyga, czy zawiodły dane,
   reguły mandatu czy osąd agenta.
4. Czas od rozstrzygnięcia do zapisu w systemie transakcyjnym. Odpowiada na
   barierę czwartą i ujawnia ukrytą pracę administracyjną.

Do tego warto prowadzić rejestr decyzji w kształcie, jaki stosuje model: obie
mapy przebiegu przed zmianą i po zmianie, wartość centralną i zakres, składniki
różnicy, wymiary pozostawione poza rachunkiem oraz pochodzenie obowiązkowych
terminów. Krótszy cykl nie wystarcza, jeżeli pogarsza się dostęp do konkurencji
albo kompletność dokumentacji.

## Teza

Bariery autonomicznego sourcingu i negocjacji nie sprowadzają się do pytania,
czy model językowy potrafi napisać zapytanie ofertowe. Sprowadzają się do
mandatu handlowego, gotowości dostawcy, jakości opisu potrzeby, zapisu do
systemu transakcyjnego i prawa konkurencji.

Ograniczony pilotaż na ogonie wydatków jest jedną z dróg opisanych w
przywołanych przypadkach. Nie jest uniwersalną kolejnością wdrożenia.
Wybór zakresu powinien wynikać z jakości danych, skutków błędu i możliwości
kontroli. Granice ceny, warunków i eskalacji należy określić przed startem.

## Źródła i granice twierdzeń

Źródła sprawdzone 21 września 2026 r. Potwierdzenie publikacji liczby nie
jest niezależnym potwierdzeniem wyniku organizacji:

- Zero100. *Rise of the AI-Enabled CPO*. Osiemdziesiąt pięć procent zgadza się
  co do zmiany w sourcingu, siedemdziesiąt osiem procent chce zachowania
  kontroli nad pracą strategiczną.
  https://zero100.com/insights/rise-of-the-ai-enabled-cpo/
- ProcureAbility. *2026 Annual ProcureCon CPO Report*. Pięćdziesiąt jeden
  procent respondentów w opisie barier grupy bez pełnej gotowości do AI
  wskazuje obawę przed zastąpieniem ludzkiego osądu.
  https://www.prnewswire.com/news-releases/procureabilitys-2026-cpo-report-reveals-the-top-barriers-to-ai-adoption-among-procurement-organizations-302666226.html
- EFESO Management Consultants. *2026 CPO Annual Pulse Report*. Pięć procent
  szerokich wdrożeń GenAI i siedemdziesiąt pięć procent eksperymentowania;
  raport opiera się na rozmowach z 50 europejskimi CPO.
  https://www.efeso.com/en-americas/insights-events/bring-genai-to-procurement-organizations/
- Procure Ai. *Kärcher case study*. Dziewięćdziesiąt procent zaangażowania
  dostawców, pięćdziesiąt procent skuteczności negocjacji i sześć procent
  średniego rabatu według dostawcy narzędzia.
  https://www.procure.ai/case-studies/kaercher
- Pactum. *Client success*, w tym kampanie Walmart na ogonie wydatków.
  https://pactum.com/clients
- Komisja Europejska. *Transparency obligations under Article 50 of the AI Act*.
  Zakres bezpośredniej interakcji z osobami fizycznymi oraz wyjątek oczywistości.
  https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- Procurement&Beyond. (2026, 26 sierpnia). *Odcinek 8. Nawet najlepsze
  narzędzie nie uratuje złego wdrożenia*. Rozmowa praktyczna z Pawłem
  Mamcarzem, 67 minut. Odnośniki czasowe w tekście prowadzą do czternastu
  zarejestrowanych fragmentów.
  https://www.youtube.com/watch?v=5KYUdTLlvvg

Niepotwierdzone zestawy procentów przypisywane BCG i Ardent Partners,
nieudokumentowane oceny platform oraz wskaźnik łatwości obsługi Walmart
zostały wyłączone z argumentacji. Nie służą jako dowody pośrednie.

Granice interpretacyjne:

Liczby rynkowe pochodzą z badań deklaratywnych i materiałów dostawców.
Opisują badaną grupę i deklarowane obawy, nie stanowią estymat efektu dla
konkretnej organizacji. Przypadki wdrożeniowe publikowane przez dostawców
narzędzi wspierają opis mechanizmu, nie wielkości efektu.

Żadna z powyższych wartości nie kalibruje modelu ProcuraCost 2.3, nie ustawia
progów ani wag i nie wpływa na różnicę kosztu. Materiał praktyczny służy do
projektowania pytań i hipotez. Bariery wdrożeniowe należą do warstwy gotowości
organizacyjnej, opisywanej bez punktacji i bez wpływu na rachunek.

Tekst nie stanowi porady prawnej. Ocena umocowania, dopuszczalności w
zamówieniach publicznych oraz zgodności z prawem konkurencji wymaga analizy dla
konkretnego stanu faktycznego.

## O autorze

Paweł Mamcarz jest autorem modelu ProcuraCost i gościem ósmego odcinka
Procurement&Beyond, z którego pochodzą fragmenty przywołane w tym tekście.
Zajmuje się zakupami, negocjacjami i wdrożeniami systemów zakupowych od strony
organizacji, nie dostawcy narzędzia. Więcej materiałów, w tym kalkulator
porównania dwóch przebiegów procesu, znajduje się na https://mamcarz.com oraz
w nagraniu rozmowy: https://www.youtube.com/watch?v=5KYUdTLlvvg.
