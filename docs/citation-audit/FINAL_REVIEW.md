# Końcowy przegląd publikacji i materiału praktycznego

Dalsze ustalenia po PR #38: [SOURCE_FOLLOWUP.md](SOURCE_FOLLOWUP.md).
Poniższy raport zachowuje stan poprzedniego przeglądu.


Data: 21 września 2026. Stan wyjściowy: `b44a606` (PR #37).

## Zakres i wynik

Przegląd obejmuje bibliografie siedmiu aktywnych tekstów oraz sposób użycia
odcinka Procurement&Beyond 8. Macierze źródeł rozdzielają metadane, dostęp
do pełnego tekstu, sprawdzone twierdzenie i ograniczenia:

- [Literatura naukowa i książki](SCHOLARLY_REVIEW.md): 11 pozycji.
- [Źródła urzędowe, prawne i materiały dostawców](OFFICIAL_VENDOR_REVIEW.md).
- [Nagranie i odnośniki czasowe](PRACTICE_REVIEW.md).

Doprecyzowano jednostki efektów Szucsa, grupy porównawcze estymatorów DiD,
cytowanie testu gęstości i granice wnioskowania z literatury. Uzupełniono
pełne tytuły, lata, lokalizatory prawne, daty badań i mianowniki procentów.
Przykład TCO samochodu oddzielono od redakcyjnego zastosowania do kosztów
wdrożenia systemu w obu wersjach strony praktyki i dwóch artykułach PL.

To przegląd wszystkich pozycji wskazanych w macierzach, nie deklaracja
lektury każdej strony wszystkich oryginałów. Brak pełnego źródła oznaczono
wprost. Nierozstrzygnięte pozostają m.in. rozbieżność Beuve'a, historyczne
porównanie EC2011, pełne metodologie części raportów dostawców i aktualne
brzmienie art. 50 AI Act. Teksty nie przedstawiają tych kwestii jako
rozstrzygniętych ani nie używają ich do kalibracji.

## Jev i historia wyników

`publications-before/`, `publications-after/` i `publications-style-after/`
zachowują wcześniejsze wydania opisane w odpowiadających im raportach.
`publications-final-after/` zawiera końcowy screening redakcyjny 97 sekcji
siedmiu publikacji i publicznego skrótu paperu. Niezmienione zapytania mogą
korzystać z poprzednich odpowiedzi przy identycznym hashu zapytania;
metadane plików są odświeżane. Zmienione sekcje ocenia `jev-1.13.0`.
Pytania i treść wejściowa są zapisane w wynikach. Ocena nie jest recenzją
naukową ani automatycznym dowodem prawdziwości tekstu.

## Aplikacja i granice

Obie strony odcinka otrzymały VideoObject z 14 Clip, datą publikacji wraz
ze strefą czasową i czasem trwania. Adres strony YouTube jest `sameAs`;
`embedUrl` wskazuje odtwarzacz. Nie używa się go jako `contentUrl`, który
według [dokumentacji Google](https://developers.google.com/search/docs/appearance/structured-data/video)
powinien wskazywać plik wideo. Dane strukturalne nie gwarantują specjalnego
wyświetlania w wynikach wyszukiwarki.

Brief roboczy ma poprawione ścieżki wejścia i opisy fragmentów. Nie jest
zewnętrznie opublikowanym artykułem. Lint i Vitest pomijają zagnieżdżone
worktrees, zachowując domyślne wykluczenia testów.

Nie zmieniono wzorów, parametrów, zakresów ani rozstrzygnięć modelu 2.3.
Materiał praktyczny nadal nie służy do kalibracji. Kontrola automatyczna
napisów nie uprawnia do ustawienia `transcriptHumanVerified: true`.

## Wynik kontroli przed wydaniem

97/97 rekordów Jev ma poprawną odpowiedź i hash zgodny z końcową treścią.
Najwyższy sygnał retoryczny 0,68 nadal dotyczy tytułu „Tunel czy pole”;
zachowano celową metaforę. Ponownie przeczytano fragmenty o zakupach
operacyjnych, pytaniu do sponsora, granicach prawnych i rozróżnieniu
estymatorów. Zachowano merytoryczne rozróżnienia. Maksymalny sygnał nadmiernego
twierdzenia wynosi 0,31; nie traktuje się go jako progu akceptacji.

Walidacja lokalna: 15/15 testów materiału praktycznego, 864/864 testów całej
aplikacji i 5/5 testów narzędzia audytu; lint oraz build zakończone poprawnie.
Recompute i sweep: 10 scenariuszy, zero naruszeń symetrii. Replicate nie
zmienił śledzonych wyników obliczeń. Testy nie dowodzą poprawności źródeł.

Zdalny punkt powrotu przed wydaniem:
`rollback/pre-publications-final-20260921` →
`b44a606f613b606e5d3b573fd463e6fb298ba492`.
