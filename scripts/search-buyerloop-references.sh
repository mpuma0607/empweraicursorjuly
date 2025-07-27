#!/bin/bash

echo "Searching for 'buyerloop' references in the entire codebase..."
echo "=================================================="

# Search in all TypeScript/JavaScript files
echo "=== TypeScript/JavaScript files ==="
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in TS/JS files"

# Search in all JSON files
echo ""
echo "=== JSON files ==="
find . -name "*.json" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in JSON files"

# Search in all CSS files
echo ""
echo "=== CSS files ==="
find . -name "*.css" -o -name "*.scss" -o -name "*.sass" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in CSS files"

# Search in all HTML files
echo ""
echo "=== HTML files ==="
find . -name "*.html" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in HTML files"

# Search in all markdown files
echo ""
echo "=== Markdown files ==="
find . -name "*.md" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in Markdown files"

# Search in config files
echo ""
echo "=== Config files ==="
find . -name "*.config.*" -o -name "*.json" -o -name "*.mjs" | grep -v node_modules | xargs grep -l "buyerloop" 2>/dev/null || echo "No references found in config files"

# Search for exact content matches
echo ""
echo "=== Exact content matches ==="
find . -type f $$ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" $$ | grep -v node_modules | xargs grep -n "buyerloop" 2>/dev/null || echo "No exact content matches found"

echo ""
echo "Search complete."
