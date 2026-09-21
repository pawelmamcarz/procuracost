# Procurement&Beyond 8: kontrola źródła i atrybucji

Data: 21 września 2026. [Nagranie pierwotne](https://www.youtube.com/watch?v=5KYUdTLlvvg).

## Metoda i granice

Pobrano publiczne metadane, polskie automatyczne napisy (`asr`, JSON3)
i ścieżkę audio. YouTube podaje datę publikacji
`2026-08-26T08:00:26-07:00`, autora Procurement&Beyond i 4026 sekund
w `videoDetails.lengthSeconds`. Pole długości w microformat podaje 4027;
zachowano czas odtwarzania 67:06 z videoDetails.

Porównanie obejmuje 14 zakresów z `lib/model-v2/evidence.ts`, nie całą
rozmowę. Niezależną transkrypcję audio przygotowano lokalnie przez
`faster-whisper` 1.2.1, model `small`, język `pl`, CPU/int8, beam_size=3,
vad_filter=true. Fragmenty wycięto ffmpeg do mono PCM 16 kHz.
Treść obu automatycznych transkrypcji porównano pod kątem tematu i atrybucji.
Nie jest to odsłuch przez człowieka ani weryfikacja każdego słowa.
Oba systemy popełniają błędy, zwłaszcza w nazwach, skrótach i urwanych zdaniach.
Zgodność tematyczna nie potwierdza wszystkich szczegółów ani prawdziwości
przekonań rozmówcy. `transcriptHumanVerified` pozostaje `false`.

Pełnego audio ani transkrypcji nie dodano do repozytorium. Odtworzenie:
pobrać polskie napisy automatyczne i audio dla powyższego identyfikatora,
wyciąć poniższe zakresy i zastosować wskazane ustawienia. Zmiana wersji
napisów lub kodowania audio może zmienić hash bez zmiany treści rozmowy.

## Kontrola fragmentów

| Zakres, sekundy | Temat zgodny w obu transkrypcjach | Decyzja redakcyjna |
|---|---|---|
| 271–408 | Standaryzowalne czynności i osąd kupca | Zachowano temat, bez przenoszenia twierdzeń rozmówcy na uniwersalny wynik. |
| 592–656 | Rozpoznanie trudności procesu przed wyborem narzędzia | Zachowano. |
| 946–1017 | Nadmiernie szczegółowe wymagania w małym wycinku procesu | Zachowano. |
| 1023–1068 | Zakupy operacyjne, ERP i dane zamówienia | Pytania o pełny przebieg są rozwinięciem autora listy, nie dosłownym cytatem. |
| 1074–1103 | Pomijane obszary specyfikacji | Zachowano. |
| 1639–1689 | Osoba po stronie klienta rozumiejąca zakup | Zachowano jako temat; nie dowodzi konieczności jednej konkretnej struktury zespołu. |
| 1707–1746 | Wewnętrzny ambasador i wizja zmiany | Mandat i pytania diagnostyczne są operacjonalizacją autora. |
| 1781–1789 | Utrata osoby napędzającej projekt i osłabienie wdrożenia | Zachowano ostrożny opis ciągłości, bez oszacowania efektu. |
| 2385–2495 | Odwzorowanie starej procedury i licznych zatwierdzeń | Zachowano. |
| 2614–2659 | Polityka jako ramy i procedura jako jedna droga | Zachowano metaforę, bez twierdzenia o zgodności dowolnej alternatywy z prawem. |
| 2863–2954 | Wprowadzenie Czym pojadę i kosztów posiadania samochodu | Poprawiono błędną atrybucję kosztów wdrożenia oprogramowania. Ich analiza jest zastosowaniem redakcyjnym przykładu TCO. |
| 3539–3649 | Lokalny Bielik i kompromis czasu oraz kosztu przetwarzania | Zachowano; brak nowych ilościowych twierdzeń o sprzęcie lub wydajności. |
| 3678–3807 | Koncepcyjne przeniesienie TCO/NPV między kategoriami | Zachowano jako propozycję, nie walidację transferu parametrów. |
| 3810–3954 | Przetwarzanie danych, matematyka i wsparcie ML | Zachowano odrębność ról, bez utożsamiania konstrukcji omawianego narzędzia z modelem ProcuraCost. |

Zakresy są odnośnikami tematycznymi. Część zaczyna lub kończy się wewnątrz
wypowiedzi. Przed publikacją osobnych klipów trzeba dobrać marginesy montażowe
i odsłuchać kontekst; brief nie jest gotową listą cięć.

Materiał służy wyłącznie pytaniom i hipotezom. Nie ustala parametrów,
progów, wag, zakresów ani wyników ProcuraCost.

## Identyfikacja pobranych plików

SHA-256 audio WebM:
`b8c67a2416a80d7dfa080ea2c7f206e08045bfecf8098dcc63a44570bf1b41fe`.
SHA-256 napisów JSON3:
`77db7e39ff86787c27ea1735d1e58a26aab426e7f093c058f73c6f5fed733d32`.
