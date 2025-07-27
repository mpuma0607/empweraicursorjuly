#!/bin/bash
echo "Cleaning up buyerloop references..."

# Remove any buyerloop image files if they exist
rm -f public/images/buyerloop*.png
rm -f public/images/buyerloop*.jpg
rm -f public/images/buyerloop*.jpeg

echo "Cleanup complete"
