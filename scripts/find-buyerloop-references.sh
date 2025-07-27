#!/bin/bash
# Script to find all references to buyerloop images
echo "Searching for buyerloop references..."
grep -r "buyerloop" . --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md"
