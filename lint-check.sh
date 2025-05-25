#!/bin/bash

echo "Running ESLint fix on .ts and .tsx files..."
echo "-------------------------------------------"

# File to track which files still have issues
UNFIXED_LOG="eslint-unfixed.log"
> "$UNFIXED_LOG"

# Run ESLint with fix, collect unfixed files
FILES=$(find ./src -name "*.ts" -o -name "*.tsx")
for FILE in $FILES; do
  echo "Checking $FILE"
  npx eslint "$FILE" --fix --quiet

  # If issues remain, add to log
  if ! npx eslint "$FILE" --quiet --max-warnings=0; then
    echo "$FILE" >> "$UNFIXED_LOG"
  fi
done

echo "-------------------------------------------"
if [ -s "$UNFIXED_LOG" ]; then
  echo "⚠️ The following files still have unresolved ESLint issues:"
  cat "$UNFIXED_LOG"
else
  echo "✅ All files are linted and fixed."
fi
