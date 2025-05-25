#!/bin/bash

echo "🔁 Running Prettier formatting..."
npx prettier --write .

echo "🧹 Running ESLint auto-fix pass..."
npx eslint . --ext .ts,.tsx --fix || echo "⚠️ ESLint encountered some issues. Check logs above."

echo "📋 Summary of Remaining Issues:"
npx eslint . --ext .ts,.tsx --format stylish > lint-report.txt

echo ""
echo "✅ Done! Check lint-report.txt for any remaining manual fixes."
