.PHONY: dev build up down logs cert-init

dev:
	cd frontend && npm run dev

build:
	cd frontend && npm run build

up: build
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

cert-init:
	bash scripts/cert-init.sh
