#!/bin/bash
# Archives any logs/*.log file over MAX_LOG_SIZE_BYTES (default 10MB) into
# logs/archive/{name}-YYYYMMDD-HHMMSS.txt, then tells nginx to reopen its
# log handles so it starts writing to fresh files at the original paths.
#
# Renaming (not truncating) is what lets this run safely while nginx is
# actively writing: nginx keeps its open file descriptor pointed at the
# now-archived file until the reopen signal tells it to open new ones.
#
# Usage: bash scripts/archive-logs.sh (or `make archive-logs`)
#
# Runs automatically via the dev user's crontab, hourly, guarded by flock
# so an overlapping run is skipped rather than queued:
#   0 * * * * /usr/bin/flock -n /tmp/strykweb-archive-logs.lock /home/dev/repo/strykweb/scripts/archive-logs.sh >/dev/null 2>&1
# View/edit with `crontab -l` / `crontab -e` as the dev user.
set -e

cd "$(dirname "$0")/.."

LOG_DIR="logs"
ARCHIVE_DIR="$LOG_DIR/archive"
MAX_LOG_SIZE_BYTES="${MAX_LOG_SIZE_BYTES:-10485760}"  # 10MB

mkdir -p "$ARCHIVE_DIR"

archived=0
shopt -s nullglob
for f in "$LOG_DIR"/*.log; do
  size=$(stat -c%s "$f")
  if [ "$size" -gt "$MAX_LOG_SIZE_BYTES" ]; then
    name=$(basename "$f" .log)
    timestamp=$(date +%Y%m%d-%H%M%S)
    dest="$ARCHIVE_DIR/${name}-${timestamp}.txt"
    mv "$f" "$dest"
    echo "Archived $f -> $dest ($size bytes)"
    archived=1
  fi
done
shopt -u nullglob

if [ "$archived" -eq 1 ]; then
  if docker compose ps nginx --status running --quiet >/dev/null 2>&1 && [ -n "$(docker compose ps nginx --status running --quiet)" ]; then
    docker compose exec nginx nginx -s reopen
    echo "Signaled nginx to reopen logs."
  else
    echo "nginx container not running; new log files will be created on next start."
  fi
fi
