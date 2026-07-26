# ProcuraCost 2.1 — nota koncepcyjna

## Problem

Debata o „sztywnych” zakupach często miesza przebieg pracy, konkurencję,
dyskrecję, konstrukcję kontraktu i kontrolę technologiczną. Wtedy wynik badania
jednego mechanizmu bywa bezpodstawnie przenoszony na pozostałe.

## Teza

Polityka wyznacza prawne i zarządcze granice, a procedura jest jedną z dróg ich
spełnienia. Sekwencyjny „tunel” może zwiększać pracę, oczekiwanie i koszt
adaptacji. Adaptacyjne „pole” może te koszty ograniczyć, ale osłabienie
konkurencji lub rozliczalności może odwrócić wynik. Obie ścieżki muszą być
legalne i podlegać tej samej granicy governance.

## Model

`ΔC = C_formal − C_adaptive` jest sumą siedmiu różnic: pracy ludzi,
administracji, opóźnienia, selekcji dostawcy, formalnych aneksów, TCO oraz obejść.
Dodatni wynik sprzyja adaptacji, ujemny formalności. Model raportuje scenariusz
niski, centralny i wysoki; nie są to przedziały ufności.

## Potencjalny wkład

1. Rozdzielenie workflow, konkurencji i sztywności kontraktu.
2. Audytowalna dekompozycja kosztu zamiast jednego indeksu sztywności.
3. Neutralna hipoteza dopuszczająca zmianę znaku.
4. Protokół walidacji na danych zdarzeniowych, a nie deklaracjach ogólnych.
5. Otwarta implementacja i generowany pakiet replikacyjny.

## Stan dowodów

Szucs (2024) kotwiczy ryzyko dyskrecji w wyborze wykonawcy. Beuve, Moszoro i
Spiller (2023) dotyczą sztywności kontraktu i rocznej częstości formalnych aneksów,
nie prawdopodobieństwa zdarzenia. Literatura
nie dostarcza uniwersalnej stopy TCO ani prawdopodobieństwa obejścia; te wartości
są jawnymi scenariuszami.

## Granica twierdzenia

Model nie dowodzi, że adaptacyjne zakupy są przeciętnie tańsze w Polsce. Nie
zastępuje analizy prawnej. Wartość naukowa zależy od poprawnego pomiaru
mechanizmów i projektu identyfikacyjnego zaakceptowanego przed zebraniem danych.

Model zachowuje obowiązkowe terminy PZP w obu ścieżkach. TCO wynosi centralnie zero
i jest wyłącznie stres-testowane.

## Co zmieniła wersja 2.2

ΔC jest raportowane **rozbite na trzy kubełki** — proces, opóźnienie, cykl życia — bo
kubełek opóźnienia jest tożsamością rachunkową między liczbą dni z szablonu a ceną dnia
podaną przez użytkownika, i niósł 77,7–99,5% dawnej liczby nagłówkowej.

**Po odjęciu tej tożsamości ścieżka formalna jest tańsza na koszcie procesu w sześciu
z dziewięciu scenariuszy wbudowanych.**

Próg kosztu dnia bezczynności nie jest już ucinany do zera. W modelu 2.1 zwracał 0 w siedmiu
scenariuszach i wartość nieokreśloną w trzech — czyli nigdy nie działał, mimo że poprzednia
wersja tej noty przedstawiała go jako funkcję modelu. Teraz raportuje wartość surową wraz ze
statusem, który mówi, czy o wyniku decyduje kanał opóźnienia, czy ścieżka formalna przegrywa
już przy zerowym koszcie zwłoki.
