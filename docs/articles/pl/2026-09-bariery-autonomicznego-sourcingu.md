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

Agent prowadzący negocjacje potrzebuje określonego zakresu uprawnień: trzeba
ustalić, jakie warunki może uzgodnić i kiedy ma przekazać sprawę kupcowi.
To szersza odpowiedzialność niż streszczanie umowy, porządkowanie wniosku czy
podpowiadanie kategorii. Przy ocenie wdrożenia należy ustalić, które z tych
zadań rzeczywiście powierzamy systemowi.

Kontrola jest potrzebna także przy zadaniach pomocniczych: błędna interpretacja
wniosku może przejść niezauważona do dalszych decyzji. Zakres nadzoru należy
dobrać do skutków działania systemu i możliwości ich cofnięcia.

Raport EFESO opublikowany w styczniu 2026 r., oparty na wywiadach
przeprowadzonych w grudniu 2025 r. z 50 dyrektorami zakupów średnich i dużych
organizacji europejskich, podaje 5% szerokich wdrożeń GenAI i 75% organizacji
w fazie eksperymentowania. To opis badanej grupy oraz
generatywnej AI ogółem, nie pomiar odsetka firm, które oddały agentowi mandat
negocjacyjny. Pozwala postawić pytanie o skalowanie, ale nie wyjaśnia sam
przyczyn różnicy między pilotażem a wdrożeniem.

Poniższy porządek jest propozycją pytań do projektu. Kolejność i znaczenie
barier zależą od kategorii, organizacji oraz zakresu uprawnień agenta.

## Osiem barier do sprawdzenia przed uruchomieniem

### 1. Zakres uprawnień agenta

Przed uruchomieniem negocjacji organizacja musi ustalić, które decyzje handlowe
powierza systemowi i kto odpowiada za nadzór.

Według publicznej zapowiedzi raportu Zero100 z 30 stycznia 2026 r.
85% badanych CPO i przedstawicieli kadry kierowniczej sourcingu spodziewa się zasadniczej zmiany
pracy sourcingowej pod wpływem agentowej AI, a 78% chce zachowania ludzkiej
kontroli nad całą pracą strategiczną. Oczekiwanie zmian może więc współistnieć
z zamiarem utrzymania nadzoru nad decyzjami.

Komunikat ProcureAbility przypisuje obawę przed zastąpieniem ludzkiego osądu
51 procentom respondentów w opisie barier grupy, która nie deklarowała pełnej
gotowości do AI. Nie należy przedstawiać tego jako odsetka wszystkich firm
na rynku ani wyłącznie użytkowników agentów negocjacyjnych. W kontekście
negocjacji warto sprawdzić, czy agent ma informacje, którymi dysponuje kupiec:
historię relacji, planowany przetarg w sąsiedniej kategorii i zależności
techniczne. Ich brak może prowadzić do ustępstw, których kupiec nie
zaakceptowałby przy tym samym wolumenie.

### 2. Akceptacja po stronie dostawcy

Udział dostawców trzeba sprawdzić odrębnie od gotowości kupującego do wdrożenia.

W opisie wdrożenia Kärchera dostawca Procure Ai podaje 90 procent zaangażowania
dostawców w rozpoczętych negocjacjach, 50 procent skuteczności negocjacji
i sześć procent średniego rabatu.
Zaangażowanie nie jest zatem tożsame z zawarciem porozumienia. Pactum podaje
dla Walmart 68 procent porozumień wśród dostawców zaangażowanych przez
platformę oraz wydłużenie terminów płatności. Są to wyniki raportowane przez
dostawców narzędzi, bez niezależnego odtworzenia w tym artykule.

Tych wyników nie można przyjąć za normę rynkową. W pilotażu należy sprawdzić
udział, odmowy i porozumienia osobno dla kategorii oraz grup dostawców.
W rozmowach z dostawcami warto zapytać o następujące obawy:

- powtórzenie mechaniki aukcji elektronicznej i zejścia cenowego bez granicy;
- ujawnienie własnej struktury kosztu i zasady przechowywania tych informacji;
- brak zrozumienia dla wielkości opakowania, minimalnej wielkości zamówienia
  albo kosztu oprzyrządowania;
- brak osoby, do której można eskalować wyjątek.

Sposób przekazania wyjątku człowiekowi powinien być widoczny dla dostawcy
od pierwszej wiadomości.

### 3. Jakość danych i specyfikacji

Przed uruchomieniem zapytania należy sprawdzić kompletność opisu potrzeby,
spójność klasyfikacji, historię cen i aktualność dokumentacji technicznej.
Nieaktualny rysunek lub różne klasyfikacje w dwóch systemach mogą zmienić treść
zapytania. W pilotażu trzeba sprawdzić, czy agent wykrywa takie sprzeczności
i zatrzymuje sprawę do wyjaśnienia. Przy ocenie błędnego wyniku należy
oddzielić błędy danych od sposobu ich przetworzenia przez model.

### 4. Integracja z systemem zapisu

Wynik negocjacji trzeba przenieść do właściwego rejestru umowy lub zamówienia.
Zależnie od procesu może to wymagać także aktualizacji rekordu informacyjnego
lub listy źródeł. Ręczne przepisanie wyniku może być rozwiązaniem pilotażowym,
ale jego czas i ryzyko błędów należy uwzględnić w rachunku korzyści.

Przed pilotażem należy wskazać rejestr obowiązujących warunków oraz osobę
odpowiedzialną za zgodność zapisu. Jeżeli dane są przenoszone ręcznie do ERP,
trzeba ustalić, jak wykrywać rozbieżności i która wersja jest wiążąca.

### 5. Umocowanie, odpowiedzialność i prawo

Analiza prawna powinna ustalić, kto wiąże spółkę, gdy agent akceptuje warunki,
i jak jego działanie odpowiada zasadom reprezentacji oraz zatwierdzania umów. Uzgodnienie
warunków przez system, który działa w imieniu organizacji, wymaga wcześniejszego
ustalenia zakresu umocowania, progu wartości i katalogu warunków, których agent
nie może zmienić.

Trzeba także ocenić skutki zachowania systemu. Konsekwentne
zachowanie agenta, na przykład przyjmowanie ofert w powtarzalnym schemacie, może
w niektórych porządkach prawnych rodzić skutki nawet bez formalnego podpisu.

Osobnej oceny wymaga zakres regulacji AI. Art. 6 ust. 2
rozporządzenia (UE) 2024/1689 z 13 czerwca 2024 r.
w powiązaniu z załącznikiem III nie klasyfikuje automatycznie każdego systemu
wpływającego na decyzje gospodarcze jako wysokiego ryzyka. Załącznik III wymienia konkretne
zastosowania, a typowa negocjacja handlowa między przedsiębiorcami do nich nie
należy wyłącznie z racji prowadzenia negocjacji. Art. 50 ust. 1 dotyczy
dostawców systemów przeznaczonych do bezpośredniej interakcji z osobami
fizycznymi: mają zapewnić informację o interakcji z AI, chyba że jest to
oczywiste w okolicznościach wskazanych w przepisie. Nie jest to identyczny
obowiązek dla każdej wymiany między systemami. Digital Omnibus
(rozporządzenie 2026/1744) nie zmienia ust. 1. Zmienia ust. 7 dotyczący
kodeksów praktyk, a w art. 111 ust. 4 dodaje termin 2 grudnia 2026 r.
dla dostosowania systemów generujących treści, wprowadzonych na rynek przed
2 sierpnia 2026 r., do obowiązku oznaczania z art. 50 ust. 2.
Ten okres przejściowy nie odracza obowiązku z ust. 1.
Zastosowanie w sektorze publicznym oraz
przetwarzanie danych osób kontaktowych po stronie dostawcy wymagają odrębnej
analizy.

W zakresie prawa konkurencji trzeba sprawdzić, czy
system nie ujawnia informacji handlowych konkurentom ani nie realizuje
niedozwolonych uzgodnień. Sam fakt użycia agentów po dwóch stronach negocjacji
nie dowodzi zmowy. Ocenę przepływów informacji i odpowiedzialności trzeba
odnieść do konkretnego zastosowania, a nie do etykiety „autonomiczny”.

W zamówieniach publicznych i sektorach regulowanych należy też zbadać ryzyko
stronniczości opisu potrzeby. Opis wygenerowany przez system, który w danych
treningowych albo kontekstowych ma dokumentację jednego dostawcy, może
faworyzować to rozwiązanie bez świadomej decyzji kogokolwiek.

### 6. Dobór kategorii zakupowej

Kandydatami do ograniczonego pilotażu są zakupy, gdzie przedmiot jest
powtarzalny, a zmienne dają się zamknąć
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

### 7. Zadania kupca i centrum usług wspólnych

Automatyzacja może ograniczyć zadania zespołu operacyjnego lub zakres usług
outsourcingowych. Trzeba uzgodnić, czym pracownicy zajmą się w uwolnionym
czasie i jak będzie oceniana ich praca. Miara oparta na liczbie ręcznie
prowadzonych postępowań może utrudniać przyjęcie takiej zmiany.

### 8. Niejasny zwrot poza pilotażem

Pilotaż może wykazać rabat, brak poprawy albo pogorszenie warunków. Rozszerzenie
wdrożenia wymaga obsługi większej liczby dostawców, określenia uprawnień dla
kolejnych kategorii i przenoszenia wyników do zamówień. Rachunek powinien
uwzględnić licencję, integrację, pracę zespołu i skutki dla relacji z dostawcami.

Dane EFESO opisują poziom wdrożenia GenAI w badanej grupie. Nie identyfikują
przyczyn zatrzymania pilotażu ani zwrotu z autonomicznych negocjacji.

## Jak ująć zmianę w ProcuraCost

Model 2.3 rozdziela ramy prawne i ład zakupowy, rodzinę procedury, archetyp
zakupu, projekt przebiegu procesu zakupowego, kanał realizacji, wsparcie
systemowe i konstrukcję umowy. Pozwala to wskazać, które elementy zakupu
zmienia wdrożenie agenta.

Agent negocjacyjny jest zmianą na osi wsparcia systemowego. Sam z siebie nie
zmienia ram prawnych, rodziny procedury ani obowiązkowych terminów oczekiwania.
Może natomiast zmienić projekt przebiegu procesu, jeżeli usuwa czynność,
uruchamia pracę równolegle albo skraca oczekiwanie na odpowiedź dostawcy. Może
też zmienić konstrukcję umowy, jeżeli negocjuje warunki płatności lub formułę
indeksacji.

Uzasadnienie biznesowe musi wskazać konkretną zmianę: w zależnościach między
krokami, ich czasie, nakładzie ról, koszcie wsparcia lub konstrukcji umowy.
Zmiana samej nazwy narzędzia nie daje podstawy do przypisania korzyści.
Model porównuje zadeklarowane wejścia, także przy niezmienionej kolejności pracy.

Trzy granice modelu mają tu bezpośrednie zastosowanie:

1. Znak różnicy kosztu nie jest z góry ustalony. Agent może wydłużyć przebieg,
   na przykład przez rundę wyjaśnień z dostawcą, który nie zrozumiał zapytania.
   Przy przyjętej definicji delty wyższy koszt wariantu adaptacyjnego daje wynik ujemny.
2. Obowiązkowe terminy prawne pozostają zablokowane i identyczne po obu
   stronach porównania. Automatyzacja przygotowania nie skraca ustawowego
   terminu składania ofert ani terminu oczekiwania przed zawarciem umowy.
3. Gotowość organizacyjna do wdrożenia jest opisywana osobno i nie wpływa na
   różnicę kosztu. Odpowiedzi o opisanych barierach nie są przeliczane na koszt.
   Koszty integracji lub pracy można ująć tylko jako odrębnie uzasadnione wejścia.

Nieformalne obejście procesu pozostaje poza monetyzacją. Jego występowanie
wymaga odrębnego badania; przywołane źródła nie ustalają częstości tego zjawiska.

## Co o tych barierach mówi praktyka wdrożeń

Z rozmowy w ósmym odcinku Procurement&Beyond o wdrażaniu systemów zakupowych
wybieram pytania przydatne także przy planowaniu pilotażu agenta. Poniższe
odniesienia są propozycją autora; nagranie nie bada agentów negocjacyjnych
i nie dostarcza parametrów do ich oceny.

Przy ustalaniu mandatu agenta można wykorzystać pytania z rozmowy o osobie,
która po stronie organizacji rozumie zakup i potrafi zakwestionować założenia
dostawcy narzędzia. W pilotażu agenta należy dodatkowo wskazać, kto zatwierdza
jego uprawnienia. Fragmenty:
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
wyjątek muszą być ujęte w zakresie. Jeżeli agent kończy pracę na
rozstrzygnięciu, trzeba wskazać odpowiedzialność za dalsze czynności. Fragment:
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
samo rozróżnienie pomaga ustalić zakres pracy agenta i nadzoru człowieka. Fragment:
[Standaryzacja pracy i osąd ekspercki](https://youtu.be/5KYUdTLlvvg?t=271)
(04:31 do 06:48).

Fragment [Pełny koszt zamiast ceny zakupu](https://youtu.be/5KYUdTLlvvg?t=2863)
(47:43 do 49:14) wprowadza projekt „Czym pojadę” i przykład TCO pojazdu:
cena zakupu nie wyczerpuje kosztu posiadania. Przeniesienie tego rozróżnienia
na barierę ósmą, zwrot poza pilotażem, jest zastosowaniem redakcyjnym autora.
W rachunku wdrożenia agenta proponuję uwzględnić licencję, integrację,
utrzymanie i zmianę organizacyjną. To propozycja dla tego artykułu, a nie lista
kosztów oprogramowania wymieniona w przywołanym fragmencie rozmowy.

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

Oprócz oszczędności względem z góry ustalonej podstawy porównania trzeba
zmierzyć udział dostawców, pracę nad wyjątkami i zapis wyników. W małej próbie
należy też sprawdzić, jak dobór kategorii wpłynął na wynik. Proponuję cztery
uzupełniające mierniki:

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

## Wybór zakresu pilotażu

Przywołane przypadki opisują między innymi pilotaże obejmujące ogon wydatków.
W innej organizacji dobór kategorii wymaga osobnej oceny jakości danych,
skutków błędu i możliwości nadzoru. Przed startem trzeba zapisać dopuszczalne
warunki cenowe, pozostałe uprawnienia agenta i zasady przekazywania spraw kupcowi.

## Źródła i granice twierdzeń

Źródła sprawdzone 21 września 2026 r. Potwierdzenie publikacji liczby nie
jest niezależnym potwierdzeniem wyniku organizacji:

- Zero100. (2026, 30 stycznia). *Rise of the AI-Enabled CPO* [publiczna
  zapowiedź raportu]. Podaje 85% i 78% dla badanych CPO i kadry kierowniczej
  sourcingu. Pełny raport wymaga dostępu członkowskiego; zapowiedź nie podaje
  liczebności próby ani terminu badania.
  https://zero100.com/insights/rise-of-the-ai-enabled-cpo/
- ProcureAbility. (2026, 21 stycznia). *ProcureAbility's 2026 CPO Report
  Reveals the Top Barriers to AI Adoption Among Procurement Organizations*
  [komunikat prasowy]. Podaje 51% w opisie barier grupy bez pełnej gotowości
  do AI, stanowiącej 89% respondentów. Pełnego raportu i dokładnej podstawy
  procentowania pytania nie zweryfikowano.
  https://www.prnewswire.com/news-releases/procureabilitys-2026-cpo-report-reveals-the-top-barriers-to-ai-adoption-among-procurement-organizations-302666226.html
  Strona opisu *The 2026 Annual ProcureCon CPO Report*:
  https://procureability.com/2026-annual-procurecon-cpo-report/
- EFESO Management Consultants. (2026). *2026 CPO Annual Pulse Report*, s. 4.
  Wywiady z 50 europejskimi CPO przeprowadzono w grudniu 2025 r.
  Raport podaje 5% szerokich wdrożeń i 75% eksperymentowania (40% wczesnej
  eksploracji i 35% pilotaży). Nie wyjaśnia dostatecznie podstaw procentowania
  i zaokrągleń; tych odsetków nie przeliczamy na liczby organizacji.
  https://www.efeso.com/wp-content/uploads/2026/01/2026-CPO-Annual-Pulse-Report-EFESO.pdf
- Procure Ai. (b.d.). *Automated procurement: Kärcher's path to negotiation
  efficiency and quality through AI-driven solutions* [studium przypadku
  dostawcy]. Podaje 90% zaangażowania w rozpoczętych negocjacjach, 50%
  skuteczności i 6% średniego rabatu. Brak liczebności, okresu pomiaru,
  jednoznacznego mianownika skuteczności i podstawy średniego rabatu.
  https://www.procure.ai/case-studies/kaercher
- Pactum. (b.d.). *Enterprise Client Success with Agentic AI in Procurement*,
  sekcja Walmart [strona dostawcy]. Podaje 68% porozumień wśród dostawców
  zaangażowanych przez platformę. Nie podaje liczebności ani okresu pomiaru.
  https://pactum.com/clients
- Parlament Europejski i Rada Unii Europejskiej. (2024). Rozporządzenie
  (UE) 2024/1689 z 13 czerwca 2024 r., art. 6 ust. 2, art. 50 ust. 1
  i załącznik III, z uwzględnieniem zmian rozporządzeniem 2026/1744.
  https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3
- Parlament Europejski i Rada Unii Europejskiej. (2026). Rozporządzenie
  (UE) 2026/1744 z 8 lipca 2026 r. (Digital Omnibus on AI), art. 1 pkt 20
  oraz pkt 39 lit. b; Dz.U. UE L, 2026/1744, 24 lipca 2026.
  https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32026R1744
- Komisja Europejska. (b.d.). *Transparency obligations under Article 50 of
  the AI Act* [FAQ, materiał objaśniający]. Nie zastępuje tekstu aktu prawnego.
  https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- Procurement&Beyond. (2026, 26 sierpnia). *Odcinek 8. Nawet najlepsze
  narzędzie nie uratuje złego wdrożenia*. Rozmowa praktyczna z Pawłem
  Mamcarzem, 67 minut. Odnośniki czasowe w tekście prowadzą do czternastu
  zarejestrowanych fragmentów.
  https://www.youtube.com/watch?v=5KYUdTLlvvg

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

Paweł Mamcarz zajmuje się zakupami, negocjacjami i wdrożeniami systemów
zakupowych po stronie organizacji. Jest autorem modelu ProcuraCost i rozmówcą
w przywołanym ósmym odcinku Procurement&Beyond. Strona autora:
https://mamcarz.com. Nagranie: https://www.youtube.com/watch?v=5KYUdTLlvvg.
