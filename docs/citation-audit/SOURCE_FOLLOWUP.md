# Uzupełnienie źródeł po PR #38

21 września 2026. Baza: `84f97a9`.

Poprzednie macierze i `publications-final-after/` zachowują stan PR #38.
Ten raport dokumentuje dalsze próby zamknięcia wskazanych tam luk.

- [AI Act](AI_ACT_FOLLOWUP.md): pełny akt zmieniający dostępny; wyjaśniono
  zakres zmian art. 50 oraz okresu przejściowego. Poprawiono artykuł o barierach.
- [EC2011 i EC2021](EC2011_FOLLOWUP.md): pozyskano pełne raporty i aneks.
  Potwierdzono medianę 22 i średnią 36 osobodni oraz lokalizatory wytycznych.
  RESEARCH doprecyzowuje porównanie z zapisanym wynikiem historycznym 23,8;
  nie wykonano ponownie obliczenia modelu 2.2.2.
- [Pozostała literatura i raporty](REMAINING_SOURCES_FOLLOWUP.md): wyniki
  poszukiwania pełnych tekstów i metodologii.

Nie zastępujemy brakujących danych interpretacją agenta. Pełny tekst może
zamknąć problem dostępu, ale nie usuwa sam przez się rozbieżności wewnątrz
publikacji ani nie waliduje przeniesienia wyniku na model ProcuraCost.

Human verification napisów nadal nie została przeprowadzona. Weryfikacja
automatyczna 14 fragmentów pozostaje opisana w PRACTICE_REVIEW.md.

Walidacja tej partii: 23 testy treści publicznych i lint zakończone poprawnie.
`source-followup-after/` zawiera tylko zmienione sekcje ponownie ocenione
przez Jev, z aktualnymi hashami. Starsze rekordy pozostają historyczne.
Nie zmieniono kodu aplikacji ani modelu; pełny zestaw CI uruchamiany jest
przy wydaniu. Punkt powrotu: `rollback/pre-source-followup-20260921`,
commit `84f97a90b99823cac972adcd64c19c3dcf868654`.
