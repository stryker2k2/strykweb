#!/bin/bash
# Ensures dist/ and frontend/public/ (served directly by nginx) stay
# world-readable: 755 on directories, 644 on files. Files land there via
# scp, manual copy, or a strict umask and can end up non-readable by the
# nginx worker (uid 101 in the container), causing silent 403s for every
# visitor regardless of who created the file.
#
# Usage: bash scripts/fix-public-permissions.sh (or `make fix-permissions`)
set -e

cd "$(dirname "$0")/.."

for dir in dist frontend/public; do
  if [ -d "$dir" ]; then
    find "$dir" -type d -exec chmod 755 {} +
    find "$dir" -type f -exec chmod 644 {} +
    echo "Fixed permissions under $dir/"
  fi
done
