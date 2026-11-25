#!/usr/bin/env bash
set -euo pipefail

SOURCE="${1:-develop}"
TARGET="${2:-main}"
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Abort if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Working tree is dirty. Commit or stash your changes first." >&2
  exit 1
fi

echo "Updating $SOURCE..."
git switch "$SOURCE"
git pull origin "$SOURCE"

echo "Updating $TARGET..."
git switch "$TARGET"
git pull origin "$TARGET"

echo "Merging $SOURCE into $TARGET..."
git merge "$SOURCE"

echo "Pushing $TARGET to origin..."
git push origin "$TARGET"

# Return to where you started
if [[ "$ORIGINAL_BRANCH" != "$TARGET" ]]; then
  git switch "$ORIGINAL_BRANCH"
fi

echo "Done: $SOURCE merged into $TARGET and pushed."
