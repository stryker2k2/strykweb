#!/bin/bash
# First-time Let's Encrypt certificate setup.
# Run this once DNS for DOMAIN_APEX, DOMAIN_WWW, and DOMAIN (see .env)
# all point to this machine.
# Usage: bash scripts/cert-init.sh
set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env not found. Copy .env.example to .env and fill in your domain/email first." >&2
  exit 1
fi

set -a
source .env
set +a

if [ "$DOMAIN" = "dev.example.com" ] || [ "$CERT_EMAIL" = "you@example.com" ]; then
  echo "ERROR: .env still has placeholder values from .env.example. Edit .env with your real domain and email before running this script." >&2
  exit 1
fi

# DOMAIN is also the certbot lineage name (nginx config references
# /etc/letsencrypt/live/$DOMAIN/) — keep this first even though the SAN
# list below also covers DOMAIN_APEX and DOMAIN_WWW.
EMAIL="$CERT_EMAIL"

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

# --entrypoint certbot is required: the certbot service's default entrypoint
# is a `certbot renew` loop (see docker-compose.yml), which silently
# swallows any command args passed via `docker compose run certbot ...`.
sudo docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --expand \
  -d "$DOMAIN" -d "$DOMAIN_APEX" -d "$DOMAIN_WWW"

echo "==> Starting certbot renewal service and reloading nginx..."
sudo docker compose up -d certbot
sudo docker compose exec nginx nginx -s reload

echo ""
echo "Done! Your site is live at https://$DOMAIN_APEX"
