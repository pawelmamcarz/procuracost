# Synchronizacja między maszynami (Rokale + drugi komputer)

## Aktualny setup

- **Główny development**: robisz na maszynie **Rokale**.
- **Praca z Claude**: odbywa się w folderze `iCloud Drive/ClaudeSync/claude/procedura`.
- Ten folder jest synchronizowany przez iCloud Drive między maszynami.
- Repozytorium na GitHubie jest źródłem prawdy.

## Zalecany sposób pracy (najmniej bólu)

### Na co dzień (Rokale)

1. Pracujesz normalnie w swoim głównym katalogu na Rokale (np. `~/dev/procedura` lub gdziekolwiek masz klona).
2. Regularnie commitujesz i pushujesz (`git push`).

### Przed dłuższą sesją z Claude

Z dowolnej maszyny (najlepiej z Rokale przed rozpoczęciem rozmowy):

```bash
cd "/Users/pawelmamcarz/iCloud Drive/ClaudeSync/claude/procedura"
git pull origin main
```

Dzięki temu Claude widzi najnowszy stan kodu z Rokale.

### Po sesji z Claude (zmiany zrobione tutaj)

```bash
cd "/Users/pawelmamcarz/iCloud Drive/ClaudeSync/claude/procedura"
git add .
git commit -m "..." 
git push origin main
```

Następnie na Rokale:

```bash
git pull origin main
```

## Szybsze komendy (skrypty)

W folderze `bin/` są gotowe skrypty:

```bash
# Przed sesją z Claude (żeby miał aktualny kod z Rokale)
./bin/claude-pull.sh

# Po sesji z Claude (wypycha zmiany na GitHub)
./bin/claude-push.sh
```

Na Rokale potem klasycznie: `git pull`.

Możesz też dodać aliasy do `~/.zshrc`:

```bash
alias claude-pull='$HOME"/iCloud Drive/ClaudeSync/claude/procedura/bin/claude-pull.sh"'
alias claude-push='$HOME"/iCloud Drive/ClaudeSync/claude/procedura/bin/claude-push.sh"'
```

## Ważne zasady

- **Nigdy** nie wrzucaj do iCloud Drive folderów `node_modules`, `.next`, `.turbo`, `dist`, `build`.
- `.gitignore` w tym projekcie już to ogarnia.
- iCloud Drive czasem ma problemy z dużą ilością małych plików — dlatego trzymamy tylko źródła + lockfile.

## Jeśli chcesz mieć jeden katalog roboczy

Najczystsze rozwiązanie długoterminowe:

- Na Rokale masz główny klon w `~/dev/procedura`.
- Folder w `ClaudeSync` traktujesz wyłącznie jako "kontekst dla Claude" (pull/push przed i po sesji).
- Nie edytujesz bezpośrednio plików w ClaudeSync na co dzień.

---

Chcesz, żebym przygotował skrypty (`bin/sync-pull.sh`, `bin/sync-push.sh`) albo dodał aliasy do dokumentacji? Albo inną strategię (np. git worktree)? Podaj dokładne ścieżki, które używasz na Rokale.