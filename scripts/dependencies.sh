#!/bin/bash
# Installs headless-browser tooling for testing the frontend (Chromium,
# Firefox, and WebKit via Playwright), plus the OS-level libraries each
# engine needs to render headless on a fresh machine/container. Also
# installs Pillow (via apt, not pip) for scripts/make-favicon.py.
#
# Usage:
#   bash scripts/dependencies.sh              # chromium + firefox + webkit
#   bash scripts/dependencies.sh chromium      # just one engine
#   bash scripts/dependencies.sh chromium firefox
set -e

cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Install Node.js first." >&2
  exit 1
fi

echo "==> Installing Pillow (python3-pil) for icon tooling..."
sudo apt-get install -y python3-pil

ENGINES=("$@")
if [ ${#ENGINES[@]} -eq 0 ]; then
  ENGINES=(chromium firefox webkit)
fi

echo "==> Installing npm packages (frontend)..."
(cd frontend && npm ci)

echo "==> Installing Playwright browsers + OS dependencies: ${ENGINES[*]}..."
(cd frontend && npx playwright install --with-deps "${ENGINES[@]}")

echo ""
echo "Done. Drive the app with, e.g.:"
echo "  cd frontend && npx playwright open http://localhost:5173"
echo "or write specs under frontend/tests and run:"
echo "  cd frontend && npx playwright test"
