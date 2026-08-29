# ProcuraCost 2.3.0: nota koncepcyjna

## Problem

Debata o „sztywnych zakupach” często łączy przebieg pracy, dostęp do
konkurencji, dyskrecję, konstrukcję umowy, kanał realizacji, wsparcie systemowe
i gotowość organizacyjną. Wtedy ustalenie dotyczące jednego mechanizmu jest
przenoszone na inne bez podstawy.

## Pytanie

Jak dwa zgodne projekty przebiegu procesu zakupowego różnią się czasem,
nakładem ról, kosztami niepracowniczymi, kosztem zwłoki i objętą monetyzacją
częścią konstrukcji umowy, jeżeli ramy prawne i ład zakupowy pozostają takie
same?

## Model

ProcuraCost 2.3 wykorzystuje dwie niezależne mapy przebiegu:

- `formalSequential`;
- `adaptiveCompliant`.

Każda mapa jest skierowanym grafem acyklicznym. Model oblicza ścieżkę krytyczną,
sumuje nakład ról i koszty niepracownicze, a następnie stosuje tożsamość:

`deltaCost = formalSequential.total - adaptiveCompliant.total`

Dodatni, ujemny i zerowy wynik są dopuszczalne. Zamiana wariantów odwraca znak.
Obowiązkowe terminy prawne są źródłowe, zablokowane i identyczne po obu
stronach.

Wartości niski, centralny i wysoki są zadeklarowanymi scenariuszami, nie
przedziałami ufności.

## Granica monetyzacji

Model obejmuje koszt ról, koszt niepracowniczy, koszt zwłoki i ograniczony stres
transferu konkurencji tam, gdzie dostęp do rynku rzeczywiście różni się między
wariantami.

Szucs (2024) kotwiczy wyłącznie ten ostatni kanał. Nie identyfikuje wpływu
projektu przebiegu procesu w Polsce. Różnice kosztu aneksów i TCO wynoszą w
natywnych scenariuszach zero. Nieformalne obejście procesu pozostaje poza
monetyzacją.

Wartości ekonomiczne, agregaty dni, stawki i profile wsparcia przeniesione z
modelu 2.2.2 są oznaczone jako założenia historyczne, nie estymaty. W pięciu
mapach mechanizmowych model 2.3 wprowadza ilustracyjną kolejność kroków, podział
dni i godziny ról. Oficjalne przypadki wspierają mechanizm, nie te liczby.

## Warunki z mechanizmem i bez mechanizmu

Mechanizm adaptacji można badać przy:

- transformacji ERP z niepełnym wymaganiem;
- przeprojektowaniu usługi logistycznej;
- publicznym zakupie IT ze wstępnymi konsultacjami rynkowymi;
- odkrywaniu i współprojektowaniu, które może zwiększać czas oraz pracę.

Stabilna standardowa usługa może nie mieć odrębnego mechanizmu pracy, choć jej
scenariusz startowy osobno deklaruje różnicę konkurencji. Zamówienie katalogowe
i zwolnienie MRP mają identyczne mapy i brak różnicy konkurencji jako neutralne
kontrole.

Przypadki oficjalne wspierają istnienie mechanizmu, nie wartość efektu
ProcuraCost.

## Potencjalny wkład

1. Rozdzielenie granicy prawnej, procedury, mapy procesu, kanału realizacji,
   systemu, umowy i gotowości organizacyjnej.
2. Audytowalny rachunek oparty na dwóch niezależnych mapach zamiast agregatowego
   wyniku sztywności.
3. Neutralność sprawdzalna przez zamianę wariantów i scenariusze kontrolne.
4. Jawny zakres monetyzacji oraz zapis skutków pozostawionych poza rachunkiem.
5. Protokół empiryczny oparty na danych zdarzeniowych, wersjonowanych dokumentach
   i logach.
6. Deterministyczny pakiet replikacyjny JSON, CSV i Markdown.

## Plan empiryczny

Najpierw badane są komponenty: możliwość odtworzenia mapy, czas, nakład ról,
dostęp do rynku, zmiany umowy i faktyczne użycie kontroli. Pełna walidacja delty
wymaga wiarygodnego kontrfaktycznego wyniku drugiej mapy oraz niezależnie
uzasadnionego dziennego kosztu zwłoki.

Podstawowy projekt identyfikuje asocjację wewnątrz organizacji. Wnioskowanie
przyczynowe jest rozważane wyłącznie dla porównywalnej, jasno datowanej
interwencji z wiarygodną grupą kontrolną.

## Gotowość i materiał praktyczny

Gotowość organizacyjna do wdrożenia jest odrębnym narzędziem bez punktów, wag i
wpływu na `deltaCost`. Samo posiadanie systemu nie dowodzi konfiguracji ani
wykorzystania kontroli.

[Procurement&Beyond, odcinek
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) dostarcza pytań o wewnętrznego
właściciela, tarcie procesu, wymagania, zakupy operacyjne, politykę, TCO i
ograniczone zastosowanie AI. Nagranie i automatyczne napisy mogą informować
pytania oraz hipotezy. Nie kalibrują modelu. Bielik może porządkować dane do
weryfikacji, a rachunek wykonuje jawny model deterministyczny.

## Granica twierdzenia

ProcuraCost nie dowodzi, że adaptacyjny przebieg jest przeciętnie tańszy w
Polsce. Nie wybiera procedury, nie ocenia dojrzałości, nie zastępuje analizy
prawnej i nie przedstawia scenariuszy jako wyników organizacji.

Wartość naukowa zależy od rzetelności pomiaru, warunków identyfikacji i oceny na
danych, których nie użyto do dopasowania założeń.
