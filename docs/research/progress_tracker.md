# Research Paper – Progress Tracker (8–10 tygodni)

**Jak używać:**
- Skopiuj do Notion, Obsidian, Google Sheets lub dowolnego task managera.
- Oznaczaj statusy: **To Do** / **In Progress** / **Done** / **Blocked**.
- Kolumna "Tydzień" pomaga utrzymać tempo.

---

## Tydzień 1 – Model Freeze + Math Appendix Start

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Zablokuj model jako v1.2 (tag w Git) | In Progress | | Kod i dokumentacja zaktualizowane; tag dopiero po pełnej weryfikacji |
| Wyeksportuj i wyczyść pełną tabelę parametrów | Done | | MODEL_PARAMETERS.md + replication/parameters/ |
| Stwórz folder `replication/parameters/` | Done | | Created with full_parameter_table.json example |
| Zacznij pisać `model_specification_draft.md` | Done | | Full closed-form spec + 2x2 rules |
| Opisz wpływ 2×2 na dni + godziny ról | Done | | Detailed in model_specification_draft.md |
| Stwórz listę 8–10 kluczowych papierów do literatury | To Do | | |

---

## Tydzień 2 – Hipotezy + Survey v0.1

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Napisz 6–8 hipotez w `testable_propositions_v1.md` | In Progress | | Draft istnieje; wymaga aktualizacji po audycie modelu v1.2 |
| Dla każdej hipotezy: uzasadnienie + operacjonalizacja | In Progress | | Oddzielić przewidywania mechaniczne modelu od hipotez empirycznych |
| Stwórz pierwszą wersję kwestionariusza (`survey_v0.1.md`) | To Do | | |
| Zrób crosswalk table (pytanie → parametr modelu) | To Do | | |
| Sprawdź długość kwestionariusza (cel: ≤15 min) | To Do | | |

---

## Tydzień 3 – Interview Protocol + Outreach

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Napisz protokół wywiadu (`interview_protocol_v1.md`) | Done | | Created grounded on 2×2 and model |
| Przygotuj 8–10 pytań głównych + pogłębiające | Done | | Included in protocol |
| Stwórz szablon case study pilotażowego + zgoda | Done | | pilot_case_study_protocol.md |
| Przygotuj listę 6–8 organizacji do pilotażu | In Progress | | Template in outreach_email_pilots.md + categories |
| Napisz roboczą wersję maila outreach | Done | | outreach_email_pilots.md (PL + EN) |
| Przygotuj 1-stronicowe summary projektu | Done | | project_summary_one_pager.md + supervisor_pitch.md |

---

## Tydzień 4 – Replication Package + Export Spec

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Utwórz strukturę folderu `replication/` | Done | | replication/ with README, parameters/, synthetic_data/ |
| Zacznij uzupełniać `full_parameter_table.xlsx` | Done | | replication/parameters/full_parameter_table.json (grounded extract) |
| Napisz specyfikację "Researcher Export" | Done | | Implemented in app (JSON + Markdown); spec in replication_package_spec.md |
| Uzupełnij `MODEL_PARAMETERS.md` | In Progress | | Already detailed; cross-referenced in new docs |
| Zrób pierwszy szkic README do pakietu replikacyjnego | Done | | replication/README.md updated with usage and samples |

---

## Tydzień 5 – Survey Pilot + Measurement Section

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Rozdystrybuuj survey v0.1 (15–25 osób) | To Do | | (real-world step) |
| Zbierz i przeanalizuj feedback | To Do | | |
| Przygotuj survey v0.9 | In Progress | | Draft i crosswalk istnieją; bez pilota nie należy nazywać wersji v0.9 |
| Napisz pierwszą wersję sekcji "Measurement" (paper) | Done | | Added to RESEARCH.md section 3.7 |
| Doprowadź replication package do ~60% | In Progress | | Structure + samples + parameters + README + exports; synthetic data can be generated live |

---

## Tydzień 6 – Interview Pilots + Hypotheses v2

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Przeprowadź 3–5 wywiadów pilotażowych | To Do | | |
| Zrób podsumowanie insightów (anonimizowane) | To Do | | |
| Zaktualizuj hipotezy → v2 | To Do | | |
| Rozbuduj literaturę o 6–8 nowych pozycji | To Do | | |

---

## Tydzień 7 – Full Replication + App Feature

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Zakończ replication package v1.0 | In Progress | | Structure + samples + parameters + full README + live exports (JSON/MD/CSV) for easy population |
| Otaguj release `replication-v1.0` | To Do | | |
| Zaimplementuj / prototyp "Researcher Export" w apce | Done | | Full (JSON + Markdown table + CSV) in calculator results, CostComparison, Assumptions Explorer (PL+EN) |
| Przygotuj pierwszą wersję Supervisor Pitch | Done | | docs/research/supervisor_pitch.md (filled, ready to send) + referenced in app/research and RESEARCH.md |

---

## Tydzień 8 – Pierwszy pełny draft paperu

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Złóż kompletny draft paperu v1.0 (15–20 stron) | In Progress | 2026-06-20 | Pozycjonowanie zatwierdzone: Paper 1 konceptualno-metodologiczny; Paper 2 empiryczny. RESEARCH.md po audycie dowodowym; pozostają redakcja i recenzja zewnętrzna. |
| Zintegruj nowe sekcje (Measurement, lit review, boundary conditions) | Done | | Measurement added; boundary conditions in Discussion; lit review references updated in reproducibility |
| Sprawdź, czy wszystkie liczby są traceable do replication package | In Progress | | Researcher exports (JSON/CSV) + model_spec provide full traceability; samples in replication/synthetic_data/ |
| Zrób wewnętrzną recenzję + poproś 1–2 osoby o feedback | In Progress | | Pakiet plików istnieje; faktyczne wysłanie i odbiorców trzeba potwierdzić poza repo |

---

## Tydzień 9–10 – Dopracowanie i przygotowanie do wysyłki

| Zadanie | Status | Data | Notatki |
|---------|--------|------|---------|
| Wprowadź feedback → paper v1.5 | To Do | | |
| Przygotuj pakiet do pierwszego target journal | To Do | | |
| Złóż co najmniej jeden abstract konferencyjny | To Do | | |
| Zakończ Supervisor Pitch v1.0 | To Do | | |
| (Opcjonalnie) Nagraj 10–12 min video walkthrough modelu | To Do | | |

---

## Legenda statusów

- **To Do** – jeszcze nie zaczęte
- **In Progress** – w trakcie
- **Done** – zakończone
- **Blocked** – zablokowane (dodaj notatkę dlaczego)

---

**Chcesz wersję tego trackera w formie:**
- Gotowego szablonu Notion (tekst do skopiowania)?
- Prostej tabeli do Google Sheets?
- Kanbanu w formacie Markdown do Obsidian?

Daj znać, to przygotuję.
