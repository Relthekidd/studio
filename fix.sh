#!/bin/bash

echo "🧹 Running Prettier formatting..."
npx prettier --write .

echo "🔧 Running ESLint with auto-fix..."
npx eslint . --ext .ts,.tsx --fix || echo "⚠️ ESLint encountered issues"

echo "📋 Generating lint report..."
npx eslint . --ext .ts,.tsx --format stylish > lint-report.txt

echo "✅ Fix completed. Open lint-report.txt to manually resolve remaining problems."
