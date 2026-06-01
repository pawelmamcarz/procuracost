#!/bin/zsh
# Szybkie ściągnięcie najnowszego kodu z main do folderu ClaudeSync
# Używaj przed dłuższą sesją z Claude, żeby miał aktualny stan z Rokale.

set -e

CLAUDE_DIR="/Users/pawelmamcarz/iCloud Drive/ClaudeSync/claude/procedura"

echo "→ Ściągam najnowszy kod do folderu Claude..."
cd "$CLAUDE_DIR"
git pull origin main
echo "✓ Gotowe. Claude widzi aktualny stan z Rokale."