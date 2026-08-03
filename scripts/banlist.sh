#!/bin/bash
# Shows every IP fail2ban currently has banned, plus a history of past
# bans/unbans, and why: for nginx-php-scan, cross-references each IP
# against access.log to show the actual scanned paths that triggered it.
#
# Usage: bash scripts/banlist.sh (or `make banlist`)
set -euo pipefail

cd "$(dirname "$0")/.."

ACCESS_LOG="logs/access.log"
FAIL2BAN_LOG="/var/log/fail2ban.log"

echo "=== Currently banned ==="
jails=$(sudo fail2ban-client status | awk -F: '/Jail list/ {print $2}' | tr ',' ' ')
any_banned=0

for jail in $jails; do
  jail=$(echo "$jail" | xargs)
  banip_output=$(sudo fail2ban-client get "$jail" banip --with-time 2>/dev/null || true)
  [ -z "$banip_output" ] && continue
  any_banned=1

  echo
  echo "--- jail: $jail ---"

  while IFS=$'\t' read -r ip rest; do
    [ -z "$ip" ] && continue
    ip="${ip%%[[:space:]]*}"  # fail2ban pads a trailing space before the tab
    start=$(awk -F' \\+ ' '{print $1}' <<< "$rest")
    end=$(awk -F' = ' '{print $2}' <<< "$rest")
    if [[ "$end" == 9999-* ]]; then
      status="PERMANENT"
    else
      status="expires $end"
    fi
    printf "  %-16s banned %s   %s\n" "$ip" "$start" "$status"

    if [ "$jail" = "nginx-php-scan" ]; then
      echo "    reason:"
      matches=$(grep "^$ip " "$ACCESS_LOG" 2>/dev/null \
        | grep -E '"(GET|POST|HEAD)\s+\S*\.(php[0-9]?|phtml|phar|asp|aspx|jsp|cgi)' \
        | tail -3 || true)
      if [ -n "$matches" ]; then
        while IFS= read -r line; do
          line="${line#"$ip" }"
          line="${line#- - }"
          line="${line#\[*\] }"
          echo "      $line"
        done <<< "$matches"
      else
        echo "      (no longer in access.log — likely rotated out)"
      fi
    fi
  done <<< "$banip_output"
done

[ "$any_banned" -eq 0 ] && echo "(none)"

echo
echo "=== Historical IPs (ever banned) ==="
history=$(sudo grep -E "NOTICE +\[.*\] Ban " "$FAIL2BAN_LOG" 2>/dev/null \
  | sed -E 's/^([0-9-]+ [0-9:,]+).*NOTICE +\[(.*)\] Ban (.*)$/\1\t\2\t\3/' || true)

if [ -n "$history" ]; then
  echo "$history" | awk -F'\t' '
    {
      key = $2 "|" $3
      count[key]++
      last[key] = $1
      jailof[key] = $2
      ipof[key] = $3
    }
    END {
      for (k in count) {
        printf "  %-16s jail=%-16s banned %dx   last: %s\n", ipof[k], jailof[k], count[k], last[k]
      }
    }' | sort
else
  echo "  (none)"
fi
