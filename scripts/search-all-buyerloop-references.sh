#!/bin/bash

echo "Searching for all 'buyerloop' references in the codebase..."
echo "=================================================="

# Search in all TypeScript/JavaScript files
echo "In TypeScript/JavaScript files:"
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in TS/JS files"

echo ""
echo "In configuration files:"
find . -name "*.json" -o -name "*.config.*" -o -name "*.mjs" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in config files"

echo ""
echo "In all files (detailed search):"
find . -type f $$ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.config.*" $$ | grep -v node_modules | xargs grep -n "buyerloop" 2>/dev/null || echo "No references found anywhere"

echo ""
echo "Search complete."
