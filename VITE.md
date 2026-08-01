# Vite Dev Server vs. Production

## What the Vite dev server is

A local, dev-only web server for the React frontend. It serves the app with
hot-reload — edit a file, the browser updates in place, no rebuild step. It's
started with `make dev` and listens on port 5173. It's fast for iteration but
not meant to serve real traffic (no SSL, no hardening, no optimized build).

## What's actually in production

nginx, serving the static output of `npm run build` (`frontend/dist`) via
Docker Compose. This also handles SSL (Certbot), the `/downloads/` addon
files, and security headers. This is already the correct setup — there is no
"migration" to do here. The dev server and production nginx are not
alternatives to each other; they serve different jobs and can run at the
same time since they're on different ports (5173 vs 80/443).

## Previewing changes locally (dev server)

1. On the server:
   ```
   make dev
   ```
   This starts Vite on port 5173.

2. From your Windows machine, open an SSH tunnel (the server has no browser,
   and `localhost` on the server isn't reachable directly from Windows):
   ```
   ssh -L 5173:localhost:5173 <user>@<server>
   ```

3. Browse to `http://localhost:5173` on Windows.

4. When done, `Ctrl+C` the `make dev` process. No need to touch nginx or
   Docker Compose — the live site at dev.strykersoft.us is untouched the
   whole time.

## Shipping to production

```
cd frontend && npm run build
```

nginx serves `frontend/dist` via a bind mount, so changes show up
automatically — no restart needed. A restart/recreate (`sudo docker compose
up -d nginx`) is only required when `docker-compose.yml` or the nginx config
itself changes (volume mounts, server blocks, etc.), not for frontend code
changes.
