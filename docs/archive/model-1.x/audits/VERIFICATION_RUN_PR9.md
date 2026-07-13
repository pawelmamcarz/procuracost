# Raport z niezależnej weryfikacji PR #9 (`fix/model-math-and-citation-audit`)

> **ARTEFAKT HISTORYCZNY MODELU 1.x.** Zachowany jako ślad audytowy; nie jest
> aktualnym źródłem parametrów, progów prawnych ani wniosków modelu 2.0.

- **Weryfikowany commit:** `33d0b65` — „fix(model+docs): full math correction A-G + online citation verification"
- **Data przebiegu:** 2026-07-02, niezależny przebieg w chmurze (kontynuacja pracy po wyłączeniu maszyny lokalnej)
- **Zakres:** 7 kontroli zleconych przez właściciela repo (typecheck, lint vs main, build, determinizm `recompute`, zgodność tabel z dokumentacją, grep po wycofanych twierdzeniach, inwariant honest-reframe)
- **Środowisko:** macOS (Darwin 25.5.0), Node + `npm ci`/`npm install` na czysto, `tsx` z lockfile'a gałęzi

---

## Wyniki kontroli

### ✅ 1. `npx tsc --noEmit`

Kod przechodzi typecheck bez błędów.

```
$ npx tsc --noEmit
TSC_EXIT=0
```

### ✅ 2. `npm run lint` — zero NOWYCH błędów względem `main`

Porównano pełne wyjście ESLint na `main` (`b52a824`) i na gałęzi (`33d0b65`), obie z własnym, świeżym `node_modules`:

| | main | PR #9 |
|---|---:|---:|
| `react/no-unescaped-entities` | 13 | 13 |
| `@typescript-eslint/no-explicit-any` | 13 | 13 |
| `@next/next/no-html-link-for-pages` | 1 | 1 |
| **Razem błędów** | **27** | **27** |

Zbiory plików z błędami są **identyczne** (diff posortowanych list plik-po-błędzie: pusty). Wszystkie 27 błędów to znane, odziedziczone problemy z `main`.

> Uwaga techniczna z tego przebiegu: surowe wyjście ESLint na maszynie weryfikującej pokazywało początkowo 54 błędy, bo ESLint zlintował **drugą kopię repo** w katalogu roboczym agenta (`.claude/worktrees/…`) leżącym wewnątrz projektu. Po wykluczeniu tej kopii liczby wracają do dokładnie 27 = 27. To artefakt środowiska weryfikacji, nie PR-a (patrz „Pozycje do decyzji" niżej).

### ✅ 3. `npm run build`

Produkcyjny build Next.js kończy się sukcesem (exit 0); wszystkie trasy PL/EN prerenderowane (Static/SSG), w tym `/shortcasty/[slug]` z `generateStaticParams`.

### ✅ 4. `npm run recompute` — determinizm i inwarianty

Uruchomiono **dwukrotnie**; wyjścia porównane `cmp` — **bajt w bajt identyczne**. Wyjście zawiera wszystkie cztery wymagane fakty:

- **deltaC dodatnia w 9 z 9 scenariuszy:** `### 5.2 Symmetry test: deltaC < 0 in 0 of 9 scenarios.` (wszystkie wartości kolumny **deltaC** dodatnie: od +1k do +3.48M);
- **faworytyzm sprzyja ścieżce sztywnej w 8/9:** `Favoritism dimension favors the rigid path (Δfavor < 0) in 8/9 scenarios.`;
- **audyt uplifitu kontekstowego:** `Max observed uplift: ×1.483 (time / direct+upstream / capex_investment) — invariant HOLDS (≤ ×1.5).`;
- **pipe_vs_field:** `**+1.79M** | +35.78%` względem CV.

### ✅ 5. Tabele w dokumentach = wyjście `recompute` *verbatim*

- `docs/articles/doktorat/00-shared-foundation.md` §5.1 (nagłówek + 9 wierszy danych) zdiffowana wprost z wyjściem `npm run recompute`: **identyczna co do znaku**.
- `docs/articles/doktorat/article-2-model-kosztu-PL.md` Tabela 2: po jedynej dozwolonej normalizacji (polski przecinek dziesiętny → kropka, np. `5,0M`→`5.0M`, `+10,58%`→`+10.58%`) wszystkie 9 wierszy danych **identyczne** z wyjściem skryptu.

### ✅ 6. Grep po wycofanych twierdzeniach (app/ lib/ components/ docs/ *.md scripts/)

Każdy wzorzec sprawdzony; **żadnego żywego wystąpienia** — wszystkie trafienia mieszczą się w dozwolonych wyjątkach (ślad audytowy: `CHANGELOG.md`, `docs/VERIFICATION_REPORT.md`, noty o usunięciach w `docs/MODEL_PARAMETERS.md`, lista wzorców-strażników w `docs/research/cloud-routines.md`, negatywne strażniki „do NOT attribute…" w `00-shared-foundation.md`):

| Wzorzec | Wynik |
|---|---|
| Sfabrykowane OECD „554"/„836" dni | tylko ślad audytowy; **0** w `app/`, `lib/`, `components/`, `scripts/` |
| „Saussier" jako współautor Beuve | tylko `CHANGELOG.md` (opis poprawki); wszędzie żywe cytowanie = Beuve, Moszoro & Spiller |
| Szucs jako „6pp"/„6 percentage points"/„6 punktów procentowych" | tylko ślad audytowy; żywe teksty konsekwentnie „~6 **procent**" (strukturalnie; forma zredukowana ~9%) |
| Swiss Casinos „4 weeks"/„cztery tygodnie"/„120-day"/EY/Skylight | żywe wystąpienia (scenariusze, optimizer, shortcasty, app/research) konsekwentnie: **LAP Alliance / World Procurement Awards 2020, ~6 tygodni vs ~6 miesięcy**; cytowania Skylight Digital w bibliografiach dotyczą wyłącznie ich własnego *Agile Procurement Playbook* (nie Swiss Casinos); szczegół nt. `RESEARCH.md:514` niżej |
| Air France KLM przypisane „EY Switzerland" | 0 żywych; żywe = LAP Alliance / Agile Business Consortium (2021), ~6 tygodni selekcji, POCAthlon |
| Szucsowska dekompozycja „two-thirds"/„dwie trzecie" | tylko ślad audytowy |
| TCO 30% przypisane ISM/CAPS jako fakt | 0 — wszystkie żywe wystąpienia (m.in. `lib/calculations.ts:16-17,122,415`, `app/research`, `app/methodology`, artykuły, `README.md`) opisują pułap jako **nieprzypisaną heurystykę praktyczną (szara literatura)** z explicite „no verifiable ISM source" |
| `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` / `FLEXIBLE_BYPASS_PROBABILITY_SCALE` / `staffIntensityMultiplier` jako żywy kod | **0 trafień w kodzie** (`app/`, `lib/`, `components/`, `scripts/`); w docs wyłącznie noty o usunięciu |
| Szucs „117–151" lub DOI „jvad036" | tylko ślad audytowy; żywe cytowania = 22(1):117–160, DOI 10.1093/jeea/jvad017 |
| „12–18 months" dla Air France | jedyne wystąpienie to negatywny strażnik w `00-shared-foundation.md:183` |

Dodatkowo przeskanowano **nowo dodane eksporty** `docs/articles/pl/2026-06-tunel-pole-lepszy-biznes.docx` (rozpakowany `word/document.xml`) i `.rtf`: zero wycofanych twierdzeń; niosą poprawne atrybucje (LAP Alliance, World Procurement Awards, Beuve/Moszoro/Spiller).

### ✅ 7. Inwariant honest-reframe

- `RIGIDITY_PRICE_PREMIUM` / `RIGIDITY_PRODUCTIVITY_LOSS`: **0 wystąpień w kodzie**; w docs tylko noty o usunięciu / strażniki (m.in. `CLAUDE.md`, `MODEL_PARAMETERS.md:7,43`, `00-spinka-rozprawa.md:132` — jawnie „usunięta i nie wraca").
- Nagłówek modelu nadal deklaruje symetrię — `lib/calculations.ts:1-5`: „Outputs are model **ESTIMATES** … not measured facts. The model is **SYMMETRIC**: … the rigid path can be net-cheaper for high-value, high-corruption-risk, competitive-market contexts."
- Wszystkie 17 wystąpień „100–400%" (README, RESEARCH, CLAUDE.md, artykuły doktorskie, plan walidacji, oba artykuły magazynowe PL/EN) jest ohedgowanych jako **estymacja modelowa z przedziałami wrażliwości / wielkość do przetestowania**; artykuły magazynowe niosą hedging w treści („bywa"/„can run") **i** w stopce („Liczby z modelu ProcuraCost to szacunki przy przyjętych założeniach, nie pomiary empiryczne").

---

## Poprawki naniesione w tym przebiegu

1. **`docs/MODEL_PARAMETERS.md` §2, wiersz „Manual"** — ostatnia przeoczona, nieaktualna atrybucja „OECD (2023), EY & Deloitte sourcing transformation studies, multiple Polish consulting projects". Stała w sprzeczności z (a) `CHANGELOG.md` („Unverifiable »EY/Deloitte sourcing transformation studies« attribution replaced"), (b) poprawionym komentarzem `lib/process-templates.ts:6` i (c) refutacją atrybucji OECD (2023) w `VERIFICATION_REPORT.md` (poz. 9 / C16-C17, C31). Zastąpiona brzmieniem zgodnym z kodem: „timeMultiplier anchored to APQC / Hackett benchmarks; coordination/tool costs are modeling assumptions (Polish consulting practice)". Typ „Calibrated" i wszystkie wartości liczbowe bez zmian.

## Pozycje do decyzji właściciela (nie ruszane)

1. **`RESEARCH.md:514`** — pozycja bibliograficzna zawiera frazę „…in just **4 Weeks**?", ale jest to **dosłowny tytuł** źródła: zweryfikowano online (lap-alliance.org, „Award-Winning Case Studies"), tytuł case study brzmi verbatim *„SwissCasinos - Is it possible to source an ERP System in just 4 Weeks?"*. Tekst główny `RESEARCH.md` (linie 136, 235) używa wyłącznie skorygowanego ~6 tygodni vs ~6 miesięcy. Uznano za poprawną praktykę cytowania (tytułu się nie poprawia); ewentualnie można dopisać przy tytule notkę „[tytuł oryginalny; zweryfikowany przebieg: ~6 tygodni]".
2. **Konfiguracja ESLint a katalog `.claude/worktrees/`** — lokalne przebiegi lint na maszynie z agentowym worktree wewnątrz projektu podwajają liczbę błędów (lintowana jest druga kopia repo). Warto rozważyć dodanie `.claude/` do ignorów ESLint — zmiana konfiguracyjna, więc poza mandatem tego przebiegu.
3. **`docs/VERIFICATION_REPORT.md`** miejscami zaleca korektę do „~6pp" (np. C2, C13), podczas gdy późniejsza weryfikacja online ustaliła „~6 **procent**". Plik jest historycznym śladem audytu (dozwolony wyjątek) i żywe teksty są już poprawne, więc nie ingerowano.

---

## Werdykt

**PR #9 jest bezpieczny do scalenia** — 7/7 kontroli ✅ (typecheck, lint bez nowych błędów, build, deterministyczny `recompute` ze wszystkimi inwariantami, tabele w docs verbatim, zero żywych wycofanych twierdzeń, inwariant honest-reframe zachowany); jedyna znaleziona usterka (przeoczona atrybucja w `MODEL_PARAMETERS.md`) naprawiona w tym commicie.
