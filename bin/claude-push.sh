#!/bin/zsh
# Wypycha zmiany zrobione podczas sesji z Claude na GitHub.
# Potem na Rokale wystarczy git pull.

set -e

CLAUDE_DIR="/Users/pawelmamcarz/iCloud Drive/ClaudeSync/claude/procedura"

cd "$CLAUDE_DIR"

if [[ -z $(git status --porcelain) ]]; then
  echo "Brak zmian do wypchnięcia."
  exit 0
fi

echo "→ Commituję i wypycham zmiany z sesji Claude..."
git add .
git commit -m "chore: zmiany z sesji Claude ($(date '+%Y-%m-%d %H:%M'))"
git push origin main
echo "✓ Wypchnięte. Na Rokale zrób: git pull"