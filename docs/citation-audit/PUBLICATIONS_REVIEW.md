# Przegląd publikacji z Jev, 21 września 2026

Ten raport i katalogi `publications-before/` oraz `publications-after/` opisują
przegląd merytoryczny wydany w commicie `b2b9dd3`. Zachowują ówczesne brzmienie
tekstów. Późniejszą korektę językową opisuje
[`STYLE_REVIEW.md`](STYLE_REVIEW.md), a końcowy przegląd źródeł
[`FINAL_REVIEW.md`](FINAL_REVIEW.md); starszych wyników nie należy traktować
jako oceny obecnego brzmienia sekcji.

Status: korekty zaakceptowane przez autora do wydania w repozytorium
21 września 2026. Nie oznacza walidacji empirycznej ani recenzji naukowej.

## Zakres

Przejrzano i poprawiono wszystkie siedem aktywnych papers i artykułów:

| Tekst | Główna korekta |
|---|---|
| `RESEARCH.md` | odrębna rodzina procedury; czas wykonania robót a czas postępowania; zakresy wspólnych wejść; ostrożność wobec dokładnego efektu Beuve’a |
| `docs/articles/doktorat/article-1-tunnel-or-field-EN.md` | interpretacja Coviello i Mariniello; granica iteracji w grafie acyklicznym |
| `docs/articles/doktorat/article-2-model-kosztu-PL.md` | obwiednia a możliwa zmiana znaku; reprezentacja powtórzeń; poprawne tłumaczenie signed allocation |
| `docs/articles/doktorat/article-3-empiria-PZP-PL.md` | zakres progu PZP; cenzurowanie i logarytm z zera; precyzja wymagana do osłabienia hipotezy |
| `docs/articles/pl/2026-07-tunel-pole-lepszy-biznes.md` | tytuł bez obietnicy skrócenia; warunki równego wyniku; interpretacja obwiedni |
| `docs/articles/pl/2026-09-bariery-autonomicznego-sourcingu.md` | populacje i mianowniki badań; GenAI a mandat negocjacyjny; udział a porozumienie; zakres AI Act; usunięcie nieudokumentowanych ocen platform i uogólnień |
| `docs/articles/pl/2026-09-wdrozenie-bez-wlasciciela.md` | dwie role i warunek ciągłości; scenariusze zamiast pewnych skutków; usunięcie nieuzasadnionych częstości, czasu wdrożenia i wykluczenia zespołowego właścicielstwa |

Sprawdzono także publiczny skrót paperu `researchPaperEn` w `lib/i18n.ts`:
nie wymagał zmiany. Uzgodniono lokalnie wspólną podstawę artykułów, specyfikację
i plan empiryczny. Archiwum modelu 1.x oraz historyczny audyt 2.2.2 nie zostały
przepisane. Nie zmieniano parametrów ani kodu modelu. Sam audyt nie obejmował
wdrożenia serwisu; wydanie następuje po osobnej zgodzie autora.

## Użycie Jev i granice oceny

`jev-1.13.0` ocenił 95 sekcji przed zmianami oraz 96 po zmianach
(dodatkowa pozycja to publiczny skrót paperu). Każda sekcja miała trzy
niezależne pytania Noul: wewnętrzna sprzeczność, nadmierne twierdzenie oraz
potrzeba weryfikacji źródła. To screening tekstu, nie porównanie całego tekstu
z oryginalną literaturą i nie korekta generowana przez model.

Raporty `publications-before/` i `publications-after/` zachowują treść sekcji,
lokalizację, hash pliku i zapytania, model, wyniki oraz tokeny. Nie zawierają
klucza API. Sygnał 0,35 służył wyłącznie do sortowania kolejki przeglądu:
przed korektą siedem sekcji przekraczało go dla nadmiernych twierdzeń, po
korekcie żadna. Nie jest to zwalidowany próg akceptacji ani miara trafności.
Korekty oparto również na lekturze sekcji z niższym sygnałem.

Osobny plik `publication-source-checks.json` zawiera 12 kontroli, w tym trzy
celowo zachowane nieuzasadnione twierdzenia sprzed korekty. `source` zawiera
**streszczenia recenzenta na podstawie wskazanych źródeł**, nie pełne oryginały
ani cytaty. Jev ocenił relację twierdzenia do tych streszczeń. Wyniki są w
`publication-source-results.json`: 12 odpowiedzi zgodnych z oceną przygotowaną
przez agenta, zero błędów API. Nie jest to ślepy test ani ludzki zbiór wzorcowy.
Niska confidence dla niektórych odpowiedzi (np. Walmart: 0,28) wymagała
powrotu do źródła i nie została pominięta w raporcie.

## Najważniejsze źródła i decyzje

- [EFESO](https://www.efeso.com/en-americas/insights-events/bring-genai-to-procurement-organizations/): dane dotyczą GenAI i rozmów z 50 europejskimi CPO; nie ustalają częstości delegowania mandatu negocjacyjnego.
- [ProcureAbility](https://www.prnewswire.com/news-releases/procureabilitys-2026-cpo-report-reveals-the-top-barriers-to-ai-adoption-among-procurement-organizations-302666226.html): zachowano kontekst respondentów bez pełnej gotowości, zamiast populacyjnego twierdzenia o wszystkich organizacjach.
- [Procure Ai/Kärcher](https://www.procure.ai/case-studies/kaercher) i [Pactum/Walmart](https://pactum.com/clients): wyniki dostawców, odmienne definicje udziału i sukcesu; bez niezależnego potwierdzenia efektów.
- [Zero100](https://zero100.com/insights/rise-of-the-ai-enabled-cpo/): zachowano deklaracje ankietowe, bez przenoszenia ich na skuteczność wdrożeń.
- [Coviello i Mariniello, wersja autorów](https://tintin.hec.ca/pages/decio.coviello/research_files/publicity.pdf): wynik dotyczy m.in. prawdopodobieństwa spóźnionego wykonania robót, nie długości procedury zakupowej. Skorygowano dwa papers.
- [Beuve i in., wersja autorów](https://mpra.ub.uni-muenchen.de/117230/1/Renegotiations_v5c.pdf): sekcja 4.1 definiuje liczbę aneksów na rok. Sekcja 6.2 podaje 7,7–10,5%, natomiast odczyt tabeli 4 wskazuje współczynniki 0,014 / 0,011 / 0,012. Przy wzroście siedmiu składowych o jednostkę daje to 0,098 / 0,077 / 0,084. Rozbieżność wymaga uzgodnienia wersji i interpretacji; usunięto dokładny zakres z aktywnego working paperu. Zerowa alokacja aneksów w modelu pozostaje bez zmian.
- [Szucs](https://academic.oup.com/jeea/article/22/1/117/7071896): zachowano rozdzielenie produktywności i prawdopodobieństwa wyboru firmy powiązanej; źródło nie kalibruje polskiego efektu topologii pracy.
- [AI Act, wyjaśnienie Komisji](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act): doprecyzowano podmiot obowiązku, interakcję z osobą fizyczną i wyjątek oczywistości.
- [Dz.U. 2025 poz. 1173](https://eli.gov.pl/eli/DU/2025/1173/ogl): potwierdzono zmianę progu i datę wejścia w życie; zawężono opis do zamówień klasycznych zamawiających publicznych.
- Sprawdzono jakościowe odniesienia do [OECD/RVUL](https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html), [California CDT](https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/), [UZP](https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe), [Komisji Europejskiej](https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement) i [Bajari i in.](https://www.aeaweb.org/articles?id=10.1257/aer.104.4.1288). Nie przypisano im nowych współczynników.

## Pozostałe granice

- Automatyczne napisy Procurement&Beyond nie zostały odsłuchane i zweryfikowane
  przez człowieka. Parafrazy oraz odnośniki czasowe pozostają do sprawdzenia autora.
- Przegląd nie obejmuje ponownego odtworzenia danych badań ani każdej pozycji
  bibliograficznej w pełnym tekście. Historyczne liczby EC 2011 nie zostały
  ponownie wyliczone; zachowano jawny status dawnego audytu 2.2.2.
- Usunięcie nieudokumentowanej tabeli platform nie dowodzi, że opisane funkcje
  nie istnieją. Brakowało podstawy do porównania wersji i konfiguracji.
- Plan badawczy pozostaje projektem: wymaga zatwierdzenia miar, obsługi braków,
  MSI i strategii identyfikacji przed pozyskaniem danych.

## Weryfikacja lokalna

`npm test`: 79 plików, 864 testy przeszły. Testy narzędzia:
`node --test tests/citation-audit.node.mjs`: 5/5. Składnia skryptu sprawdzona
przez `node --check`. `npm run lint` i kontrola diffu zakończyły się bez błędów.

Izolowany pakiet wydania, bez wcześniejszych lokalnych zmian strony praktycznej:
79 plików, 858 testów oraz 5/5 testów narzędzia. Wszystkie 96 zapisów audytu
po korekcie odpowiada hashem plikom wydania.

Ponowne uruchomienie (wysyła sekcje publikacji do TypeSafe):

```sh
node --env-file=.env.local scripts/audit-publications.mjs docs/citation-audit/publications-after
```

Skrypt korzysta z cache zgodnego z hashem zapytania. Zmienione sekcje są
oceniane ponownie; niezmienione nie wymagają wywołania API. Nowy katalog
raportu uruchamia pełny przebieg. Dokumentów wewnętrznych i pliku `.env.local`
nie wysyła się jako treści oceny.
