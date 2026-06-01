#!/bin/bash
# First-time Let's Encrypt certificate setup.
# Run this once DNS for dev.strykersoft.us points to this machine.
# Usage: bash scripts/cert-init.sh
set -e

DOMAIN="dev.strykersoft.us"
EMAIL="stryker2k2@msn.com"

cd "$(dirname "$0")/.."

echo "==> Downloading recommended TLS parameters..."
mkdir -p certbot/conf
curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
  -o certbot/conf/options-ssl-nginx.conf
curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
  -o certbot/conf/ssl-dhparams.pem

echo "==> Creating temporary self-signed cert so nginx can start..."
mkdir -p certbot/conf/live/"$DOMAIN"
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certbot/conf/live/"$DOMAIN"/privkey.pem \
  -out certbot/conf/live/"$DOMAIN"/fullchain.pem \
  -days 1 -subj "/CN=$DOMAIN" 2>/dev/null

echo "==> Building frontend..."
(cd frontend && npm ci && npm run build)

echo "==> Starting nginx..."
sudo docker compose up -d nginx
sleep 3

echo "==> Removing dummy cert and requesting real one from Let's Encrypt..."
rm -rf certbot/conf/live/"$DOMAIN"

sudo docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "==> Starting certbot renewal service and reloading nginx..."
sudo docker compose up -d certbot
sudo docker compose exec nginx nginx -s reload

echo ""
echo "Done! Your site is live at https://$DOMAIN"
