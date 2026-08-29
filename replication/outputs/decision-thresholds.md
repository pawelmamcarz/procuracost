# Mapa progów decyzyjnych (model 2.2.2)

> **KWARANTANNA HISTORYCZNA.** Ten plik nie jest artefaktem modelu 2.3 i nie powstaje w `npm run replicate`.
> Pozostaje śledzony wyłącznie do czasu osobno
> zatwierdzonego usunięcia. Aktywne wyniki to `built-in-scenarios.json`,
> `built-in-scenarios.csv` i `built-in-scenarios.md`. Nie używać tej mapy do
> interpretacji modelu 2.3.

> Wyniki deterministyczne przy ustandaryzowanych wejściach porównawczych (czas trwania 2 lata,
> koszt aneksu 4% CV, ekspozycja 10% CV, stawki domyślne, dyskonto 4%). To NIE są scenariusze
> wbudowane. Progi są dokładne (delta jest liniowa w koszcie dnia), nie próbkowane.

Jak czytać: `formalna ODPORNIE poniżej X` = przy koszcie dnia bezczynności poniżej X zł/dzień
ścieżka formalna wygrywa w KAŻDYM scenariuszu dowodowym; `adaptacyjna ODPORNIE powyżej Y`
= powyżej Y wygrywa adaptacyjna w każdym; między X a Y decydują założenia (pas nierozstrzygnięty).
Oś strukturalna (±30% czasów etapów) przesuwa progi w przybliżeniu proporcjonalnie do różnicy dni —
porównaj wiersze manual vs end_to_end, które rozpinają tę oś naturalnie (×2 na dniach).

| kategoria | technologia | CV | Δdni | formalna ODPORNIE poniżej [zł/dz] | próg centralny [zł/dz] | adaptacyjna ODPORNIE powyżej [zł/dz] | werdykt przy koszcie zwłoki ≈ 0 |
|---|---|---:|---:|---:|---:|---:|---|
| pzp_eu | manual | 2M | 22.4 | 0 | 0 | 1.0k | adaptacyjna (centralnie) |
| pzp_eu | manual | 5M | 22.4 | 0 | 0 | 4.3k | adaptacyjna (centralnie) |
| pzp_eu | manual | 20M | 22.4 | 0 | 29 | 20.3k | formalna (centralnie) |
| pzp_eu | partial_erp | 2M | 16.0 | 0 | 0 | 1.0k | adaptacyjna (centralnie) |
| pzp_eu | partial_erp | 5M | 16.0 | 0 | 0 | 3.6k | adaptacyjna (centralnie) |
| pzp_eu | partial_erp | 20M | 16.0 | 0 | 878 | 16.3k | formalna (centralnie) |
| pzp_eu | end_to_end | 2M | 11.2 | 0 | 0 | 1.4k | adaptacyjna (centralnie) |
| pzp_eu | end_to_end | 5M | 11.2 | 0 | 0 | 4.3k | adaptacyjna (centralnie) |
| pzp_eu | end_to_end | 20M | 11.2 | 0 | 1.6k | 19.0k | formalna (centralnie) |
| pzp_krajowy | manual | 200k | 14.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| pzp_krajowy | manual | 500k | 14.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| pzp_krajowy | manual | 900k | 14.0 | 0 | 0 | 495 | adaptacyjna (centralnie) |
| pzp_krajowy | partial_erp | 200k | 10.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| pzp_krajowy | partial_erp | 500k | 10.0 | 0 | 0 | 39 | adaptacyjna (centralnie) |
| pzp_krajowy | partial_erp | 900k | 10.0 | 0 | 0 | 565 | adaptacyjna (centralnie) |
| pzp_krajowy | end_to_end | 200k | 7.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| pzp_krajowy | end_to_end | 500k | 7.0 | 0 | 0 | 215 | adaptacyjna (centralnie) |
| pzp_krajowy | end_to_end | 900k | 7.0 | 0 | 0 | 818 | adaptacyjna (centralnie) |
| private_formal | manual | 500k | 28.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| private_formal | manual | 2M | 28.0 | 0 | 0 | 773 | adaptacyjna (centralnie) |
| private_formal | manual | 5M | 28.0 | 0 | 0 | 3.2k | adaptacyjna (centralnie) |
| private_formal | manual | 20M | 28.0 | 0 | 0 | 15.6k | adaptacyjna (centralnie) |
| private_formal | partial_erp | 500k | 20.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| private_formal | partial_erp | 2M | 20.0 | 0 | 0 | 793 | adaptacyjna (centralnie) |
| private_formal | partial_erp | 5M | 20.0 | 0 | 0 | 2.7k | adaptacyjna (centralnie) |
| private_formal | partial_erp | 20M | 20.0 | 0 | 180 | 12.2k | formalna (centralnie) |
| private_formal | end_to_end | 500k | 14.0 | 0 | 0 | 0 | adaptacyjna (odpornie) |
| private_formal | end_to_end | 2M | 14.0 | 0 | 0 | 1.0k | adaptacyjna (centralnie) |
| private_formal | end_to_end | 5M | 14.0 | 0 | 0 | 3.2k | adaptacyjna (centralnie) |
| private_formal | end_to_end | 20M | 14.0 | 0 | 542 | 14.0k | formalna (centralnie) |
| policy_only | manual | 500k | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | manual | 2M | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | manual | 5M | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | partial_erp | 500k | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | partial_erp | 2M | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | partial_erp | 5M | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | end_to_end | 500k | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | end_to_end | 2M | 0.0 | — | — | — | formalna (centralnie) |
| policy_only | end_to_end | 5M | 0.0 | — | — | — | formalna (centralnie) |
| discovery | manual | 500k | -18.2 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (odpornie) |
| discovery | manual | 2M | -18.2 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | manual | 5M | -18.2 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | partial_erp | 500k | -13.0 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (odpornie) |
| discovery | partial_erp | 2M | -13.0 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | partial_erp | 5M | -13.0 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | end_to_end | 500k | -9.1 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | end_to_end | 2M | -9.1 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| discovery | end_to_end | 5M | -9.1 | n/d (odwrócona) | 0 | n/d (odwrócona) | formalna (centralnie) |
| capex | manual | 2M | 50.4 | 0 | 0 | 174 | adaptacyjna (centralnie) |
| capex | manual | 5M | 50.4 | 0 | 0 | 1.6k | adaptacyjna (centralnie) |
| capex | manual | 20M | 50.4 | 0 | 0 | 8.7k | adaptacyjna (centralnie) |
| capex | partial_erp | 2M | 36.0 | 0 | 0 | 375 | adaptacyjna (centralnie) |
| capex | partial_erp | 5M | 36.0 | 0 | 0 | 1.5k | adaptacyjna (centralnie) |
| capex | partial_erp | 20M | 36.0 | 0 | 261 | 7.1k | formalna (centralnie) |
| capex | end_to_end | 2M | 25.2 | 0 | 0 | 568 | adaptacyjna (centralnie) |
| capex | end_to_end | 5M | 25.2 | 0 | 0 | 1.9k | adaptacyjna (centralnie) |
| capex | end_to_end | 20M | 25.2 | 0 | 612 | 8.3k | formalna (centralnie) |
| catalog_order | manual | 50k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| catalog_order | manual | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| catalog_order | partial_erp | 50k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| catalog_order | partial_erp | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| catalog_order | end_to_end | 50k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| catalog_order | end_to_end | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | manual | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | manual | 500k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | partial_erp | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | partial_erp | 500k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | end_to_end | 200k | 0.0 | — | — | — | adaptacyjna (centralnie) |
| mrp_order | end_to_end | 500k | 0.0 | — | — | — | adaptacyjna (centralnie) |

Kategorie z Δdni = 0 (policy_only, catalog, mrp): koszt zwłoki nie różnicuje ścieżek —
decyduje wyłącznie koszt procesu i cyklu życia (kolumna werdyktu).
Kategoria odwrócona (discovery, Δdni < 0): ścieżka FORMALNA jest szybsza, więc im wyższy
koszt dnia, tym mocniej wygrywa formalna; adaptacja broni się tylko przy taniej zwłoce
i wysokiej wartości dopasowania (kanał TCO/cyklu życia w wysokim scenariuszu).
