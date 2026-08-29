# Nota o dowodach i integralności

**Aktywny model:** ProcuraCost 2.3.0
**Aktualizacja:** 29 sierpnia 2026
**Status:** nota metodologiczna do oceny promotora, bez wyników empirycznych

## 1. Zasady aktywnego modelu

- Dwa warianty, `formalSequential` i `adaptiveCompliant`, są porównywane przy
  tych samych ramach prawnych i ładzie zakupowym.
- Każdy wariant ma niezależną mapę przebiegu procesu i konstrukcję umowy.
- Obowiązkowe terminy prawne są źródłowe, zablokowane i identyczne po obu
  stronach.
- Różnica ma postać
  `deltaCost = formalSequential.total - adaptiveCompliant.total`. Znak nie jest
  ograniczony.
- Zakresy niski, centralny i wysoki są scenariuszami, nie przedziałami
  ufności.
- Porównanie przydatności procedur nie wykorzystuje punktów, rankingu ani
  rekomendacji.
- Gotowość organizacyjna do wdrożenia jest odrębnym konstruktem i nie wpływa na
  rachunek kosztu.

## 2. Granica monetyzacji

Model obejmuje koszt ról, koszt niepracowniczy, koszt zwłoki i ograniczony
transfer konkurencji, gdy porównanie jawnie zakłada różnicę dostępu do rynku.

Szucs (2024) jest wykorzystywany wyłącznie jako kotwica dla stresu 2, 6 i
9 procent w kanale konkurencji. Badanie nie identyfikuje wpływu projektu
przebiegu procesu w Polsce.

Różnice kosztu aneksów i TCO wynoszą w natywnych scenariuszach zero. Nieformalne
obejście procesu jest ujawnione jako nieobjęte monetyzacją. Literatura o
kontraktach, TCO i obejściu procesu może uzasadniać pytania, ale nie jest
automatycznie przeliczana na wynik.

Wartości ekonomiczne, agregaty bazowych dni, stawki ról i profile wsparcia
przeniesione z 2.2.2 są oznaczone jako `retained_legacy_assumption`.
Kolejność kroków, rozkład dni i godziny ról w pięciu mapach mechanizmowych są
ilustracyjnymi wejściami modelu 2.3. Odtwarzalność nie zmienia żadnej z tych klas
w empiryczne estymaty.

## 3. Przypadki i mechanizmy

Oficjalne przypadki z Kalifornii, OECD, UZP i Komisji Europejskiej wspierają
istnienie konkretnych mechanizmów, nie wartości liczbowe.

- Odkrywanie w transformacji ERP może wykorzystywać definiowanie problemu i
  modularne kontraktowanie.
- Przeprojektowanie logistyki może wykorzystywać kontakt z rynkiem do
  sprawdzenia parametrów usługi i podziału ryzyka.
- Publiczny zakup IT może stosować wstępne konsultacje rynkowe bez skracania
  terminów ustawowych.
- Odkrywanie i współprojektowanie może zwiększać czas oraz nakład pracy.

Stabilna standardowa usługa może nie mieć odrębnego mechanizmu pracy, ale jej
scenariusz startowy osobno deklaruje różnicę konkurencji. Zamówienie katalogowe
i zwolnienie MRP mają identyczne mapy oraz brak różnicy konkurencji jako
neutralne kontrole.

## 4. Materiał praktyczny

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) podnosi pytania o właściciela
wdrożenia, tarcie procesu, dyscyplinę wymagań, zakupy operacyjne,
upraszczanie polityki, TCO i ograniczone wykorzystanie AI.

Nagranie jest wywiadem praktycznym, a jego polska transkrypcja pochodzi z
automatycznych napisów. Może informować pytania i hipotezy. Nie może ustalać
parametrów, zakresów, wag, progów ani odpowiedzi w samoopisie gotowości. Bielik może porządkować
dane rynkowe do weryfikacji. Jawny model deterministyczny wykonuje rachunek.

## 5. Twierdzenia i nietwierdzenia

Model twierdzi, że:

- dwa jawne projekty przebiegu można porównać na wspólnej granicy;
- objęte monetyzacją kanały można rozdzielić i prześledzić do wejść;
- neutralność można sprawdzić przez zamianę wariantów;
- brak mechanizmu może prowadzić do równego wyniku.

Model nie twierdzi, że:

- adaptacyjny wariant zawsze wygrywa;
- scenariusze są obserwowanymi efektami organizacyjnymi;
- oficjalny przypadek dostarcza efektu kosztowego ProcuraCost;
- TCO, aneksy i obejście procesu są skalibrowanymi prognozami;
- wynik dla Węgier lub innej jurysdykcji przenosi się bezpośrednio do Polski;
- system informatyczny dowodzi gotowości organizacyjnej;
- kalkulator jest zwalidowanym estymatorem albo opinią prawną.

## 6. Historyczna korekta bibliograficzna

Prawidłowy rekord zachowany po audycie modelu 2.1:

Beuve, J., Moszoro, M. W., i Spiller, P. T. (2023). Doing It by the Book:
Political Contestability and Public Contract Renegotiations. *Journal of Law,
Economics, and Organization, 39*(1), 281-308.
https://doi.org/10.1093/jleo/ewab039

Wcześniejszy rekord łączył tytuł wersji roboczej NBER Working Paper 28491,
„Contractual Rigidity and Political Contestability: Revisiting Public Contract
Renegotiations”, z błędnym DOI `ewab022`. Tytuł był prawidłowy dla wersji
roboczej. Błąd dotyczył DOI i połączenia dwóch rekordów. Ta korekta jest
chronologią audytu, a nie aktywnym parametrem modelu 2.3.

## 7. Materiał historyczny

Audyt kalibracji 2.2.2 pozostaje w
`docs/research/CALIBRATION_BENCHMARKS.md`. Optymalizator, profile ścieżek,
współczynniki aneksów, pule TCO, stopy obejścia procesu i mapy progów z tamtej
wersji nie są aktywnymi twierdzeniami modelu 2.3.

Materiały modelu 1.x znajdują się w `docs/archive/model-1.x/` wyłącznie jako
pochodzenie zmian. Nie należy ich przesyłać ani cytować jako bieżącego opisu
modelu.
