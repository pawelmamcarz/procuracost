#!/bin/zsh
# Wypycha zmiany zrobione podczas sesji z Claude na GitHub.
# Potem na Rokale wystarczy git pull.

set -e

CLAUDE_DIR="/Users/pawelmamcarz/iCloud Drive/ClaudeSync/claude/procuracost"

cd "$CLAUDE_DIR"

FORCE_MAIN=0
if [[ "$1" == "--force-main" ]]; then
  FORCE_MAIN=1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "main" && "$FORCE_MAIN" -ne 1 ]]; then
  echo "✗ Jesteś na main. To skrypt nie commituje ani nie pushuje bezpośrednio na main."
  echo "  Utwórz branch (git checkout -b <nazwa>) albo uruchom z --force-main, jeśli na pewno chcesz commitować na main."
  exit 1
fi

if [[ -z $(git status --porcelain) ]]; then
  echo "Brak zmian do wypchnięcia."
  exit 0
fi

echo "→ Commituję i wypycham zmiany z sesji Claude (branch: $BRANCH)..."
git add .
git commit -m "chore: zmiany z sesji Claude ($(date '+%Y-%m-%d %H:%M'))"
git push origin "$BRANCH"
echo "✓ Wypchnięte. Na Rokale zrób: git pull"
