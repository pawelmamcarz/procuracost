# Korekta językowa publikacji, 21 września 2026

Ten raport i `publications-style-after/` zachowują stan wydany w commicie
`b44a606`. Późniejsze doprecyzowania bibliografii i atrybucji opisuje
[`FINAL_REVIEW.md`](FINAL_REVIEW.md). Hashe poniżej dotyczą tamtego wydania.

Korekta uzupełnia przegląd merytoryczny z commitu `b2b9dd3`. Obejmuje lekturę
całych siedmiu tekstów, redakcję akapitów i ponowny przegląd po zmianach.
Sprawdzono także wspólną podstawę cyklu doktorskiego i publiczny skrót `/research`.

## Zakres zmian

| Tekst | Korekta |
|---|---|
| `RESEARCH.md` | krótsze streszczenie, prostszy opis pochodzenia wejść i replikacji, mniej powtórzeń w historii korekt |
| `article-1-tunnel-or-field-EN.md` | konkretne pytanie badawcze, usunięcie ogólnych puent i powtarzanych zastrzeżeń w przykładach, prostszy opis wkładu |
| `article-2-model-kosztu-PL.md` | tytuł opisujący porównanie, usunięcie kalek takich jak „kontrakt wersji” i „przypadek zakresu”, czytelny opis wartości kroków |
| `article-3-empiria-PZP-PL.md` | prostsze streszczenie, nazwanie zmiennych wynikowych i metod odniesienia, rozróżnienie analizy potwierdzającej i eksploracyjnej |
| `2026-07-tunel-pole-lepszy-biznes.md` | konkretny przykład na otwarcie, mniej sztucznych kontrastów, nagłówki opisujące pracę, krótsze zakończenie i nota o autorze |
| `2026-09-bariery-autonomicznego-sourcingu.md` | usunięcie sloganów i nieuzasadnionych uogólnień, konkretne zadania kontrolne, krótsze przejścia, usunięcie historii audytu z treści artykułu |
| `2026-09-wdrozenie-bez-wlasciciela.md` | role opisane przez zadania, usunięcie urywanych puent i powtórzeń, praktyczny opis zastępstwa i diagnozy problemów |
| `00-shared-foundation.md` | prostsze sformułowania, doprecyzowanie wspólnych wejść w scenariuszach kontrolnych |
| `lib/i18n.ts#researchPaperEn` | prostsze streszczenie, nagłówki i opis ograniczeń; bez zmian struktury danych ani modelu |

## Zachowane treści

Porównanie z bazą potwierdziło zachowanie adresów źródeł oraz zapisanych
w kodzie wzorów we wszystkich ośmiu plikach Markdown. Hipotezy H1a–H5 i
propozycje P1a–P5 w cyklu doktorskim pozostały bez zmian. Ręczny przegląd
obejmował również równania LaTeX, wartości liczbowe i warunki interpretacji:
znak delty, zakresy scenariuszowe, wspólne wejścia, obowiązkowe terminy prawne,
zerowe różnice aneksów i TCO oraz niezależność gotowości od rachunku.

Skracanie nie było celem samym w sobie. Dwa polskie teksty metodologiczne są
nieco dłuższe, ponieważ część skrótów technicznych zastąpiono objaśnieniami.
W siedmiu artykułach łącznie liczba słów liczona po białych znakach spadła
z 15 801 do 14 820. Licznik obejmuje metadane i bibliografie.

## Uzupełniający przegląd Jev

`jev-1.13.0` ocenił 96 sekcji siedmiu tekstów i publicznego skrótu. Katalog
`publications-style-after/` zawiera końcową treść każdej sekcji, lokalizację,
hash pliku i zapytania oraz surowe odpowiedzi. Manifest zapisuje pełne pytania:

- `stockRhetoric`: zbędne slogany, promocyjne ogólniki i retoryczne kontrasty;
- `redundancy`: powtarzanie tej samej myśli bez nowej informacji;
- `overclaim`: twierdzenia wykraczające poza zadeklarowane podstawy.

Zastosowano pytania Noul, zgodnie z [API TypeSafe](https://docs.typesafe.ai/api).
Wyniki służyły do kolejnej lektury, nie do automatycznej akceptacji tekstu.
Nie jest to detektor autorstwa AI ani zwalidowany pomiar jakości redakcyjnej.
Model nie generował poprawionej prozy. Nie wysyłano pliku środowiskowego,
dokumentów wewnętrznych ani wspólnej podstawy doktorskiej.

Wszystkie 96 odpowiedzi zakończyło się bez błędu API i odpowiada końcowym
hashom tekstów. Najwyższy sygnał retoryczny (0,68) dotyczył samych metadanych
i tytułu „Tunel czy pole”, które zachowano jako celową metaforę. Ponownie
przeczytano też wskazane fragmenty o zakupach operacyjnych, pytaniu do sponsora,
scenariuszach kontrolnych i historii dowodów. Zachowano potrzebne rozróżnienia
metodologiczne oraz pochodzenie danych. Wyniki nie są sprowadzane do progu
„braku AI slopu”.

Pełne odtworzenie zapytania jest możliwe z `manifest.json` (model i pytania)
oraz `section` w każdym rekordzie jako `state.section`. Starsze katalogi
`publications-before/` i `publications-after/` pozostają historycznymi zapisami
przeglądu merytorycznego sprzed tej korekty.

## Weryfikacja

- Testy publicznego paperu, danych strukturalnych i routingu: 54/54.
- Pełny lokalny zestaw: 79 plików, 864 testy.
- `recompute`, `sweep`, `replicate`, `build` i `lint`: bez błędów.
- Symetria: 10 wejść, zero naruszeń. Pliki replikacyjne bez zmian.
- Kod i parametry `lib/model-v2/` bez zmian.

Lokalny zestaw zawiera wcześniejsze prace nad stroną praktyczną, które nie
należą do tej korekty. Pakiet wydania jest sprawdzany osobno przez CI.
