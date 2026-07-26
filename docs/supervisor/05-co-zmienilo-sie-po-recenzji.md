# Co zmieniło się od poprzedniej recenzji

**Adresat:** prof. Krzysztof Piech
**Stan na:** 26 lipca 2026 · model 2.2.2
**Poprzednia recenzja dotyczyła:** modelu 1.x (czerwiec 2026)

Ta nota istnieje po to, żeby nie musiał Pan rekonstruować historii zmian z repozytorium.
Opisuje trzy rzeczy: co wynikło z Pana uwag, co się z tym stało, i co zostało znalezione
później — w tym błędy, które sam projekt wprowadził, korygując poprzednie.

---

## 1. Pana uwaga i jej los

Z Pana recenzji modelu 1.x wynikło rozróżnienie **Direct/Indirect × Upstream/Downstream** —
uznanie, że model nie może traktować wszystkich zakupów jednakowo. Wprowadzono je w wydaniu
2026.19.3.0 z jawną atrybucją w changelogu.

**Co się z tym stało — bez upiększeń:**

1. **Model 2.0/2.1 uprościł ten wymiar do trzech mnożników pracy i dwóch mnożników
   koordynacji.** Powód był merytoryczny: pierwotna implementacja miała szczegółowe profile
   ról i nakładające się kompresje czasu, które sugerowały precyzję niemającą pokrycia
   w żadnych danych. Uproszczenie było moim zdaniem słuszne.
2. **Atrybucja została przy tym skasowana.** Wpis changeloga wskazujący Pana recenzję jako
   źródło zniknął wraz ze skróceniem pliku w commicie `78d98c1`. To nie było celowe, ale
   efekt jest taki, że w korpusie 2.1 Pana wkład nie występuje. Przywracam to tutaj.
3. **Co gorsza — wymiar był w 2.1 w dużej mierze martwy.** Z siedmiu mnożników kontekstowych
   **pięć było zaszytych na wartość 1**. Kontekst realnie dotykał tylko godzin pracy
   i kosztu koordynacji. Cztery z siedmiu wymiarów modelu nie miały żadnej wrażliwości
   kontekstowej, a API i tabela parametrów sugerowały, że mają. Kombinacja
   `direct + downstream` dawała na czasie ×0,99, czyli efekt zerowy.

**Co zrobiłem w 2.2:** usunąłem pięć martwych mnożników zamiast zostawiać je jako fasadę,
i zapisałem wprost w `docs/MODEL_PARAMETERS.md`, których wymiarów kontekst **nie** dotyczy.
Ożywienie któregokolwiek z nich wymaga argumentu o konkretnym mechanizmie, a nie stałej.

Jeżeli uzna Pan, że kontekst powinien sięgać dalej — w szczególności do częstości aneksów
i do ekspozycji na obejścia, gdzie istnieje argument merytoryczny — to jest to decyzja
do podjęcia z Panem, a nie do zaszycia w kodzie.

---

## 2. Błędy, które projekt sam wprowadził

Model 2.1 był deklarowany jako korekta konfabulacji z 1.x. Audyt przeprowadzony przed tą
recenzją pokazał, że **przy okazji wprowadził nowe**. Podaję je, bo uznaję, że recenzent
powinien je dostać od autora, a nie znaleźć sam.

### 2.1. Efekt produktywności u Szucsa: 28% zamiast 10%

Model 2.1 podawał, że dyskrecja prowadzi do wyboru wykonawców o **28% niższej
produktywności**, i dodatkowo twierdził, że wcześniejsza wartość „około 10%" była błędem.

Było odwrotnie. Estymaty strukturalne Szucsa to **6% ceny i 10% produktywności**. Liczba 28
występuje w tej pracy, ale dotyczy zupełnie czego innego — wzrostu o 28 punktów procentowych
szansy wygranej firm powiązanych politycznie. Nieprawidłowa liczba trafiła do dokumentu
wiążącego cykl doktorski, do tabeli parametrów, do working papera, do README, na trzy strony
publiczne i do żywych ciągów eksportu.

Poprawione we wszystkich lokalizacjach; `CHANGELOG.md` odnotowuje, że źródłem błędu było
wydanie 2.1.

### 2.2. Kotwica „OECD", której nie ma

Parametr `CORRUPTION_RISK_CONTEXT` — żywy, bo skaluje koszt selekcji — miał w komentarzu
uzasadnienie: „kierunek porządkowy wzięty z OECD". W całym korpusie nie ma żadnej publikacji
OECD: ani tytułu, ani roku, ani tabeli. Nazwa organizacji bez publikacji jest niesprawdzalna.

Usunięte. Wektor jest teraz jawnie oznaczony jako założenie porządkowe klasy C bez zewnętrznej
podstawy.

### 2.3. Odwrócona populacja przy tej samej kotwicy

Ten sam komentarz wiązał wartość `pzp_eu = 1,0` — maksymalne ryzyko dyskrecji — z pracą
Szucsa. Szucs identyfikuje swój efekt na zamówieniach **poniżej progu ok. 25 mln HUF**
(ok. 90 tys. USD), czyli na najmniejszym końcu rozkładu wartości. Przypisanie maksymalnej
wartości największym, najszerzej publikowanym postępowaniom unijnym odwraca jego populację.

Atrybucja usunięta.

### 2.4. Jednostka u Beuve'a

Estymata 0,077–0,105 dotyczy jednoczesnego wzrostu o jedno odchylenie standardowe
**w każdej** z siedmiu kategorii sztywności. Kilka dokumentów 2.1 gubiło słowo „każdej",
zamieniając siedmiokategoryjne przesunięcie na jedno. Dodatkowo model mnoży ten współczynnik
przez profil 0–1, który nie jest z-score — czyli po cichu utożsamia „profil = 1,0"
z przesunięciem, którego autorzy nie mierzyli.

Współczynnik przeklasyfikowany z kotwicy empirycznej na **założenie kalibracyjne z zewnętrzną
kotwicą rzędu wielkości**. Zapisane też, że interpretowalna jest wyłącznie różnica między
ścieżkami, nie poziom.

### 2.5. „Sanity-check", którego nie było

Badanie EC (2011) było opisywane jako zewnętrzna kontrola zdroworozsądkowa kosztów
administracyjnych. Żadnego porównania nigdy nie wykonano, żadna liczba z tego badania nie
wchodzi do modelu. Zdegradowane do „kontekst wyłącznie". Odnotowany też jego własny wynik —
że ograniczenia dyskrecji wiążą się z wyższymi cenami — który działa **przeciwko** kanałowi,
który model importuje od Szucsa.

---

## 3. Najpoważniejsze ustalenie: nagłówkowa liczba była tożsamością

To nie jest błąd cytowania, tylko konstrukcji, i uważam go za najważniejszą rzecz w tej nocie.

Model 2.1 raportował jedną liczbę ΔC. Rozłożenie jej pokazało, że **od 80,5% do 99,6%**
każdej opublikowanej delty to iloczyn dwóch wielkości, których model nie mierzy:

> (różnica dni z własnego szablonu) × (koszt dnia bezczynności podany przez użytkownika)

W scenariuszu `production` to 1 400 000 z 1 406 145 zł, czyli 99,6%. Nagłówek „Δ = 73,9%
kosztu ścieżki adaptacyjnej" był więc komunikatem o wielkości założenia użytkownika, a nie
o kosztowności procedury.

**Model 2.2 raportuje ΔC rozbite na trzy kubełki** o różnej bazie czasowej i różnym statusie
dowodowym: proces, opóźnienie, cykl życia. Kanał opóźnienia jest jawnie oznaczony jako
tożsamość rachunkowa.

Skutek jest ciekawszy, niż się spodziewałem: **po odjęciu tożsamości opóźnienia ścieżka
formalna jest tańsza na koszcie procesu w 7 z 10 scenariuszy wbudowanych.** Teza Tunnel–Field
w tej parametryzacji jest opowieścią o zwłoce, nie o koszcie procesu. To twierdzenie węższe,
ale sprawdzalne — i odwrotne do tego, co sugerował nagłówek 2.1.

Powiązany defekt: **próg kosztu dnia bezczynności**, który był w pakiecie 2.1 przedstawiany
Panu jako funkcja modelu, zwracał 0 w siedmiu scenariuszach i `null` w trzech. Nigdy nie
zwrócił informatywnej wartości dodatniej, bo był ucinany przez `Math.max(0, …)`. Ucięcie
usunięte; próg raportuje teraz wartość surową wraz ze statusem.

---

## 4. Neutralność: z deklaracji na demonstrację, i co z tego wyszło

Working paper ma teraz sekcję 4.1, która mówi wprost coś, czego wcześniej nie mówił żaden
dokument: **architektura modelu nie jest symetryczna.** W większości typów procesu kanały są
z konstrukcji uporządkowane na korzyść adaptacji; jedyny kanał mogący sprzyjać formalności —
selekcja — jest ograniczony do ok. 0,3% wartości kontraktu dla `pzp_eu`, podczas gdy kanał
opóźnienia jest nieograniczony. Centralnie dwa z siedmiu wymiarów są tożsamościowo zerowe.

Ale przyczyna leżała głębiej, niż w parametrach, i warto ją nazwać dokładnie.

### 4.1. Szablony przesądzały wynik

**W każdym kroku każdego szablonu zachodziło `flexibleDays ≤ rigidDays`.** „Adaptacja jest
szybsza" nie było więc wynikiem, tylko tożsamością wpisaną w dane wejściowe. Dodatkowo
ułamek nakładu pracy był ucięty do 1, więc wolniejsza adaptacja była niewyrażalna nawet
w zasadzie. Przegląd wrażliwości zwracał **0 wyników odpornie pro-formalnych na 11 340
konfiguracji** — liczba opisująca szablony, nie zamówienia.

Model 2.2 dodaje typ **zakupu odkrywczego**: wymaganie powstaje w trakcie, adaptacja kupuje
uczenie się czasem (współprojektowanie, runda przeprojektowania, czasem porzucona runda
negocjacyjna), a formalność zamraża wymaganie wcześnie i płaci gorszą specyfikacją oraz
słabszym wychwyceniem wartości cyklu życia. To jedyny wiersz tabeli profili z szeroką różnicą
konkurencji (0,82 / 0,62), bo współprojektowanie z wąskim gronem dostawców realnie ją
osłabia. Test może teraz zawieść w obie strony.

### 4.2. Przedział niepewności obejmował niewłaściwe wielkości

Drugi, poważniejszy problem: przedział zmieniał **pięć skalarów z literatury**, a trzymał
nieruchomo **koszt dnia bezczynności i czasy etapów** — czyli dokładnie te dwa wejścia, które
niosą 80–99% wyniku. Model raportował najwęższą niepewność tam, gdzie jest najsłabszy.

Model 2.2.1 dokłada **oś strukturalną**: koszt dnia ×0,25 … ×4, czasy etapów nieobowiązkowych
×0,7 … ×1,3. Ustawowe terminy PZP pozostają nienaruszone w obu osiach. Obie osie są
raportowane osobno, żeby było widać, która niesie szerokość — i w każdym scenariuszu
z różnicą dni niesie ją strukturalna.

**Wynik działa przeciwko tezie i to jest najważniejsza liczba w tej nocie:**

| | tylko oś dowodowa | obie osie (kalibracja 2.2.2) |
|---|---:|---:|
| scenariusze przechodzące przez zero | 5 z 10 | **10 z 10** |
| przegląd: odpornie pro-formalne | — | 1 042 z 12 960 |
| przegląd: odpornie pro-adaptacyjne | — | 5 374 z 12 960 |

**Po audycie kalibracji żaden scenariusz wbudowany nie wskazuje odpornie żadnej
ścieżki.** Obie liczby odporności spadły, nie tylko jedna — przedział jest szerszy uczciwie,
a nie przechylony.

Zdaję sobie sprawę, że to najsłabsze twierdzenie, jakie ten projekt kiedykolwiek postawił.
Uważam je za mocniejsze pozycyjnie niż poprzednie: pytanie przestaje brzmieć „czy Pan
przesadził", a zaczyna „co trzeba zmierzyć, żeby model rozstrzygał" — i na to odpowiada
`EMPIRICAL_VALIDATION_PLAN.md`.

Mnożniki ×0,25–×4 i ×0,7–×1,3 są jawnymi sądami o tym, jak bardzo można się mylić co do
niezmierzonego wejścia, a nie przedziałami estymowanymi. To jedyne miejsce, w którym ta
konstrukcja jest podatna na zarzut, i wolę je wskazać sam.

---

## 4a. Baza czasowa

Model 2.1 nie miał bazy czasowej. Mnożył roczną częstość aneksów przez czas trwania umowy
bez dyskontowania, jednocześnie ograniczając pulę TCO do trzech lat — dziesięcioletni CAPEX
wnosił więc dziesięć pełnowartościowych lat aneksów przeciwko trzyletniej puli, a `total`
sumował koszt zdarzenia z niedyskontowanym strumieniem wieloletnim.

Wszystkie raportowane wielkości są teraz **wartością bieżącą na moment udzielenia
zamówienia**. Oba kanały cyklu życia używają jednego czynnika annuitetowego. Stopa 0
odtwarza arytmetykę 2.1 co do grosza — i to jest asercja testowa, nie deklaracja. Domyślnie
4% realnie, jako jawne wejście kalkulatora, obecne w linkach i w śladzie replikacyjnym.

---

## 5. Warstwa prawna

Audyt prawny znalazł dwa błędy, które w narzędziu doradzającym tryb postępowania są
poważniejsze niż nieścisłość akademicka:

1. **Brakowało progu dla usług społecznych** (art. 359 PZP: 750 000 EUR = 3 232 500 zł).
   Zamówienie na usługi społeczne za 1,5 mln zł było klasyfikowane powyżej progu unijnego,
   a tryb podstawowy — właściwy, tańszy i szybszy — był odcinany. To dotyczy dużej części
   wydatków samorządowych.
2. **Zamawiający sektorowi i obronni** byli przepuszczani przez drabinę progów dla zamówień
   klasycznych. Sektorowa spółka wodociągowa kupująca dostawy za 500 tys. zł dostawała
   informację, że stosuje art. 275, podczas gdy PZP w ogóle jej nie dotyczyło.

Pierwszy błąd poprawiony, drugi rozwiązany przez **odmowę doradzenia** zamiast zgadywania.
Oba mają testy regresyjne. Dodatkowo narzędzie ujawnia teraz, które legalne tryby jego filtr
pomija i dlaczego — bo użytkownik, który dostaje obcięty zbiór wyboru bez informacji o tym,
może zrezygnować z trybu dopuszczalnego przez prawo.

---

## 5a. Audyt kalibracji (2.2.2)

Po rozstrzygnięciu kwestii konstrukcyjnych każde założenie liczbowe modelu zostało
sprawdzone wobec zewnętrznego benchmarku, z przeciwstawną weryfikacją każdego zarzutu
(`docs/research/CALIBRATION_BENCHMARKS.md`). Najważniejsze:

- **Check EC 2011, którego poprzednie wersje tylko obiecywały, został wykonany — i model
  go przechodzi** (23,8 osobodnia na postępowanie UE vs mediana 22 / średnia 36).
- Szablony dni są o 25–50% SZYBSZE niż średnie UZP — konserwatywne odchylenie przeciwko
  własnej tezie modelu, teraz jawnie opisane.
- **Pięć wartości kosztu dnia bezczynności nie miało obronialnego wyprowadzenia**
  i zostało przeliczonych z jawnych formuł (m.in. logistics 20 000 → 1 800; domyślny
  seed kalkulatora 10 000 → 500). Po rekalibracji delta logistics spadła z 417k do 53k.
- Drabina kontroli obejść zawężona z 15× do 3× (kotwica Hackett), koszt narzędzia
  rozdzielony na strategiczny i operacyjny (2 000 zł za pojedyncze PO było 30–100×
  ponad benchmark APQC), etykieta stopy dyskontowej poprawiona (4% = stopa finansowa
  MFiPR, nie społeczna).

Skutek zbiorczy: przy uczciwych wejściach **wszystkie 10 scenariuszy wbudowanych
przechodzi przez zero**. Model nie wskazuje odpornego zwycięzcy w żadnym z nich.

## 6. O co proszę na tym spotkaniu

Nie proszę o ocenę wyników empirycznych, bo ich nie ma. Proszę o ocenę trzech rzeczy:

1. Czy rozbicie ΔC i jawne postawienie asymetrii architektury czynią z tego model, który
   da się obronić na seminarium — czy przeciwnie, pokazują, że kanał opóźnienia trzeba
   z modelu w ogóle wyjąć.
2. Czy przy takiej konstrukcji wkładem jest model kosztowy, czy raczej projekt empiryczny,
   który go testuje. Moja deklaracja jest w `03-decisions-needed.md`; poprzednia wersja tego
   dokumentu prosiła Pana o rozstrzygnięcie tego za mnie, co było błędem.
3. Czy `docs/research/EMPIRICAL_VALIDATION_PLAN.md` jest wykonalny w warunkach, jakie mogę
   realnie zorganizować.

Materiały weryfikacyjne: `RESEARCH.md`, `docs/MODEL_PARAMETERS.md`, `CHANGELOG.md`
(sekcje 2.2.1 i 2.2.0), `replication/outputs/`. Wszystkie liczby w tekstach są generowane przez
`npm run replicate` z tego samego kodu, który stoi za kalkulatorem.
