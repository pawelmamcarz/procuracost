# Uzupełnienie RESEARCH i weryfikacja Jev

21 września 2026. Baza: `feacb58864b8273123a9a3fd5a1ed7460f9d5ad0`.

## Zakres korekty

RESEARCH zawiera teraz lokalizatory i odsyłacze do pełnych źródeł EC2011,
EC2021 i Fazekas–Blum, opis ograniczeń konsultacji i konstrukcji umowy,
tabelę otwartych luk, granice automatycznej transkrypcji oraz plan pomiaru,
identyfikacji i walidacji na odłożonych danych. Sekcja walidacji opisuje
planowane czynności, nie przeprowadzone badanie. Plan wewnętrzny ujednolicono
z artykułem 3 w zakresie grup kontrolnych Callaway–Sant'Anna i Sun–Abraham.

## Weryfikacja źródłowa

[Przypadki](research-completion-cases.json) zawierają dokładne fragmenty
oryginalnych PDF, lokalizatory, adresy i sumy SHA256. [Wynik API](research-completion-results.json)
pochodzi z rzeczywistych wywołań `jev-1.13.0`, nie z symulacji.

| Twierdzenie | Wynik Jev | Confidence API |
|---|---|---|
| EC2011: mediana 22, średnia 36 osobodni | supports | 0,99 |
| EC2021: niewiążący charakter wytycznych | supports | 0,80 |
| Konsultacje: konkurencja, równe traktowanie, przejrzystość | supports | 0,97 |
| Umowa: wskaźniki, uczciwe warunki wyjścia i klauzule zmian | supports | 0,90 |
| Kontrola: odwrócenie średniej i mediany | contradicts | 1,00 |
| Kontrola: raport waliduje natywny model 2.3.0 | unsupported | 1,00 |

Wszystkie sześć wyników odpowiada zadanym oczekiwaniom; brak błędów usługi.
Oczekiwane etykiety nie były wysyłane do API. Ręcznie porównano twierdzenia
z fragmentami, w tym z jednoznacznym zastrzeżeniem niewiążącego charakteru
wytycznych. Confidence jest wynikiem klasyfikatora, nie prawdopodobieństwem
prawdziwości badania. Cztery pozytywne przypadki nie stanowią weryfikacji
wszystkich twierdzeń paperu ani aktualnego stanu prawa.

## Redakcja

Ponownie oceniono pięć zmienionych sekcji RESEARCH w trzech wymiarach:
schematyczna retoryka, redundancja i nadmierne twierdzenia. Pozostałe 92
sekcje dotychczasowego audytu miały identyczne żądania i wykorzystały cache.
[Manifest i nowe odpowiedzi](research-completion-after/) zachowują hashe
zmienionych sekcji. Najwyższy wynik wyniósł 0,41 dla redundancji sekcji
audytu: powracające ograniczenia odnoszą się do różnych źródeł i zostały
zachowane. Ocena redakcji jest pomocą w przeglądzie, nie certyfikatem jakości.

## Otwarte ograniczenia

Nadal brak końcowej tabeli lub wyjaśnienia rozbieżności Beuve, danych do
walidacji natywnego modelu i checklisty, zweryfikowanej przez człowieka
transkrypcji oraz części metodologii raportów dostawców. Nie uzupełniano
ich domysłami. Szczegóły: [pozostałe źródła](REMAINING_SOURCES_FOLLOWUP.md).
