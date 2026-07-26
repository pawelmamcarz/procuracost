# Uzasadnienie kalibracji: każde założenie modelu wobec zewnętrznego benchmarku

**Wersja:** 1.0 dla modelu 2.2.2 · 26 lipca 2026
**Metoda:** audyt czteroobszarowy z niezależną weryfikacją przeciwstawną każdego zarzutu
(werdykt „nonsensowne" wymagał potwierdzenia benchmarku u źródła i sprzeczności ≥3×).
**Skutek:** 2 założenia zmienione jako niepodważalnie błędne, 5 wartości scenariuszowych
przeliczonych z jawnych formuł, ~20 założeń udokumentowanych, reszta potwierdzona.

Ten dokument istnieje, żeby na pytanie „skąd ta liczba?" każda liczba miała odpowiedź
krótszą niż wzruszenie ramion. Wypełnia też punkt 4 checklisty zamrożenia
z `replication/README.md` („parameter provenance has page/table references").

---

## 1. Wynik główny: check EC 2011 — wykonany i zdany

Korpus od wersji 2.2 przyznawał, że porównanie z badaniem Komisji Europejskiej (2011,
PwC/London Economics/Ecorys, *Public procurement in Europe: Cost and effectiveness*)
nigdy nie zostało wykonane. Zostało wykonane w ramach tego audytu, na pełnym tekście
raportu:

| wielkość | model | EC 2011 | werdykt |
|---|---:|---:|---|
| nakład zamawiającego na postępowanie UE | **23,8 osobodnia** (pzp_eu, partial_erp; 16,8–33,0 wg technologii) | mediana **22**, średnia **36** osobodni (s. 84–85) | **wewnątrz pasma** |
| nakład na procedurę krajową | 14,3 osobodnia | call-off 8–16 pd, pełny przetarg 22–36 pd (EC 2011/2014) | pomiędzy — właściwie |
| przetarg prywatny | 16,9 osobodnia | „szybszy i tańszy niż publiczny" (EC 2011, s. 6) → poniżej 22 | spójne (0,77× mediany publicznej) |
| koszt procesu jako % wartości | 0,03–2,2% wg scenariusza | strona zamawiającego ≈0,3% wolumenu; APQC 0,5–1,96% wydatku | ten sam rząd wielkości |

Wniosek: **warstwa nakładu pracy jest najlepiej skalibrowaną częścią modelu.** Godziny
uczestnictwa, które wyglądały podejrzanie nisko („17 osobodni na przetarg za 5M?"),
są dokładnie tam, gdzie kładzie je jedyne duże europejskie badanie kosztów procedur.

## 2. Czasy trwania: UZP potwierdza, z konserwatywnym odchyleniem

| szablon | model (formalny) | benchmark | źródło |
|---|---:|---|---|
| pzp_eu | 87 dni (70 od publikacji) | średnio **90 dni** od publikacji do umowy (2023; 92 w 2022, 99 w 2021) | Sprawozdanie Prezesa UZP 2023, tab. 10 |
| pzp_krajowy | 39 dni (27 od publikacji) | średnio **40 dni** od publikacji | UZP 2023, tab. 9 |
| private_formal | 44 dni | RFP 57 dni post-to-award (6 000+ RFP, Euna); 6–10 tyg. typowo | Euna Solutions, Responsive |
| policy_only | 20 dni | Swiss Casinos: sourcing ERP w 4 tyg. | LAP Alliance (praktyczny) |
| capex | **120 dni** (było 60 — zmienione) | 3–4 mies. (dolna granica) do 6–18 mies. | letsworkwise / ProcureKey |
| catalog / mrp | 2–3 / 2 dni | cykl PO: 5–8 h (najlepsi) do ~2 dni | APQC |

Kierunek odchyleń jest **konserwatywny przeciw tezie modelu**: szablony formalne są
o 25–50% *szybsze* niż realne średnie UZP (modelują pojedynczy, niezakłócony przebieg),
co zmniejsza różnicę dni niosącą kubełek opóźnienia. Faza po otwarciu ofert w pzp_eu
jest ~1,8× krótsza niż implikowana przez UZP — odnotowane jako świadome założenie.

**Zmiana: szablon capex 60/42 → 120/84 dni.** 60 dni na sourcing linii produkcyjnej za
15M PLN leżało poniżej najmiększej cytowalnej dolnej granicy (3–4 miesiące); praktyczne
źródła rozciągają się do 18 miesięcy. 120 dni = dolna granica pasma; proporcja
adaptacyjna 0,70 zachowana. Przy okazji naprawiona niespójność wewnętrzna:
`vendor_selection` (14 dni) był krótszy niż blok RFQ+negocjacje w private_formal
(20 dni) przy zakupie trzykrotnie większym — teraz 28 dni.

## 3. Stawki dzienne: Hays 2026 potwierdza wszystkie sześć ról

Stawka modelu ≈ miesięczny koszt pracodawcy / 21 dni. Wszystkie wartości mieszczą się
w widełkach Raportu płacowego Hays Poland 2026 (min/typ/max, brutto/mies.):

| rola | model PLN/dz | Hays 2026 (stanowisko) |
|---|---:|---|
| kupiec | 800 | Kupiec 9 000/14 000/16 000 |
| zamawiający | 900 | Specjalista ds. zaopatrzenia 8 000/10 000/12 000 |
| finanse | 900 | Specjalista ds. sprawozdawczości 13 000/15 000/18 000 |
| prawnik | 1 200 | Prawnik wewnętrzny 13 000/22 000/30 000 |
| kierownik | 1 500 | Menedżer zakupów 18 000/23 000/30 000 |
| zarząd | 2 500 | CFO/członek zarządu 30 000/40 000/57 000 |

## 4. Koszt dnia bezczynności: tu było najwięcej nonsensu — i tu wprowadzono zmiany

To wejście niesie 46,5–99,6% wyniku, a w 2.1/2.2.1 pięć z jedenastu wartości nie miało
żadnego obronialnego wyprowadzenia. Zasada po rekalibracji: **każda wartość ma jawną
formułę wyprowadzoną z historii scenariusza** (formuły w komentarzach `lib/scenarios.ts`).

| scenariusz | było | jest | rama ekonomiczna i wyprowadzenie |
|---|---:|---:|---|
| fleet | 5 000 | 5 000 | 50 aut × ~100 zł/dzień premii wynajmu krótkoterminowego vs FSL |
| erp | 15 000 | **8 200** | ambitny 12-mies. payback ex ante: 3M/365 (realized wg Panorama: 18–36 mies.) |
| logistics | 20 000 | **1 800** | premia spot 25% × dzienny wydatek 7 306 zł (DAT: spot vs kontrakt 25–35%) |
| production | 50 000 | 50 000 | **jedyny** kwalifikowany dostawca klasy A → zatrzymanie: utracona marża zakładu ~40M przychodu / 45% marży; historia jawnie zapisana |
| pipe_vs_field | 10 000 | 10 000 | projekt publiczny, BCR 2,2 — wewnątrz pasma 1–4 (EC CBA Guide 2014) |
| catalog | 500 | 500 | tarcie ręcznej obsługi PO (Levvel: $10–15 vs $2–3); Δdni = 0, bez wpływu na wynik |
| mrp | 8 000 | 8 000 | stockout pojedynczego zlecenia = postój linii; Δdni = 0, bez wpływu na wynik |
| capex | 30 000 | **13 700** | cash flow linii przy 3-letnim paybacku: 15M/3/365; annuitet 15–25% IRR daje 8,2–11,5k (Jagannathan i in., JFE 2016) |
| governance | 0 | 0 | scenariusz kontrolny: „pomijalny koszt zwłoki" z definicji |
| discovery | 8 000 | **5 500** | 18-mies. payback — konserwatywniej niż ERP, bo korzyści odkrywcze są mniej pewne |
| custom (domyślny) | 10 000 | **500** | placeholder 0,05% CV/dzień; poprzedni seed zasiewał deltę 200k (95% wyniku) implikując BCR 7,3 |

Weryfikator obalił dwa z pierwotnych zarzutów „nonsensu" i te wartości pozostały:
dla `production` mechanizm zatrzymania jest ekonomicznie spójny (epizody surowcowe
2021–2022 dokumentują premie >100%), wymagał tylko jawnego zapisania; dla `capex`
badacz mylnie użył hurdle rate jako rocznego cash flow — poprawne wyprowadzenie
annuitetowe i tak wskazało wartość niższą, którą przyjęto.

## 5. Technologia

- **Mnożniki czasu 1,40→0,70 (rozpiętość 2×): potwierdzone.** Literatura e-procurement:
  redukcje cyklu 30–50% (Hackett, Aberdeen); model = 50%, wewnątrz pasma.
- **Koszt narzędzia 2 000 zł/proces: potwierdzony dla sourcingu strategicznego**
  (licencja ~600k zł/rok / 100–500 postępowań = 1 200–6 000 zł), ale **nonsensowny dla
  zamówień operacyjnych** — 2 000 zł za pojedyncze PO to 30–100× cały koszt procesu PO
  wg APQC ($14–54). **Zmiana:** rozdzielony `toolCostPerOperationalOrder` (0/30/50/60 zł)
  z wyprowadzeniem amortyzacyjnym. Neutralne dla ΔC (koszt identyczny na obu ścieżkach).
- **Drabina obejść 1,50→0,10 (15×): zmieniona na 1,50→0,50 (3×).** Cytowalne dane
  o maverick spend wspierają rozpiętość ~1,6–2,9× (Hackett: compliance 91% vs 74%;
  Bartolini 2012: best-in-class ledwo 69%). Piętnastokrotny efekt kontrolny przypisany
  samej technologii nie miał żadnego oparcia. Materialność: wyłącznie obwiednia
  (centralna delta obejść = 0).

## 6. Profile ścieżek i kontekst korupcyjny

- **Kierunek konkurencji (formalna ≥ adaptacyjna): potwierdzony** — Coviello, Guglielmo
  & Spagnolo (2018, Management Science 64(2)): dyskrecja zmniejsza liczbę oferentów
  i zwiększa powtarzalność zwycięzcy; jednoofertowość UE: 31,1% (tryby otwarte) vs
  38,6% (nieotwarte) na 8,2 mln kontraktów.
- **Kierunek TCO (adaptacyjna wychwytuje więcej): wsparcie teoretyczne** — Bajari &
  Tadelis (2001), Bajari, McMillan & Tadelis (2009): kontraktowanie elastyczne wygrywa,
  gdy liczy się adaptacja ex post. Brak benchmarku ilościowego — wartości pozostają
  klasą C.
- **Porządek ryzyka korupcyjnego (publiczne > prywatne > transakcyjne): kierunkowo
  wsparty** — OECD (2016); Bandiera, Prat & Valletti (2009, QJE): jednostki publiczne
  płacą ≥22% więcej za te same dobra; jednoofertowość w Polsce 56% (2024) vs 28%
  średniej UE. Wartości liczbowe pozostają założeniem porządkowym klasy C.

## 7. Pozostałe

- **Koszt aneksu 0,5–10% CV: wsparty** — Bajari, Houghton & Tadelis (2014, AER):
  koszty adaptacji 7,5–14% wartości kontraktu w całym cyklu życia.
- **Ekspozycja audytowa ~10% CV: wsparta** — decyzja KE C(2019) 3452: korekty
  finansowe 5/10/25/100% wartości; bezprawne udzielenie z pominięciem trybu na końcu
  25–100%. Prywatnie: ACFE 2024, mediana straty ~$145k/przypadek.
- **Stopa dyskontowa 4%: wartość dobra, etykieta była zła.** Wytyczne MFiPR 2021–2027
  przepisują **4% jako realną stopę finansową** i **3% jako społeczną** (tak samo
  EC Vademecum 2021–2027). Model 2.2.1 nazywał 4% „stopą społeczną" — poprawione;
  dla modelu kosztów kupującego właściwa jest finansowa, ocena projektu publicznego
  może nadpisać na 3%.
- **Narzut koordynacyjny 500/200/100/20 zł/dzień aktywny: brak benchmarku** —
  powiedziane wprost. Najbliższy analog: konwencja Standard Cost Model (25–30% narzutu
  na koszt pracy), której EC 2011 samo używa; udziały narzutu w koszcie pracy modelu
  (5,7–141% wg technologii) są z nią luźno zgodne na środku drabiny.

## 8. Czego ten audyt nie ustala

Benchmarki potwierdzają, że założenia są **w cytowalnych pasmach** — nie że są
*prawdziwe* dla konkretnej organizacji. Profile ścieżek, wartości ryzyka korupcyjnego
i ekonomika zakładowa scenariuszy pozostają klasą C do zastąpienia danymi z planu
walidacji (`EMPIRICAL_VALIDATION_PLAN.md`). Dwa źródła praktyczne (ProcureKey,
letsworkwise) to poradniki bez metodologii — użyte wyłącznie do wyznaczenia dolnej
granicy tam, gdzie żadne lepsze źródło nie istnieje, i tak opisane.
