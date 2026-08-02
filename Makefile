.PHONY: dev build lint up down logs cert-init

dev:
	cd frontend && npm run dev

build:
	cd frontend && npm run build

lint:
	cd frontend && npm run lint
	shellcheck scripts/*.sh

up: build
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

cert-init:
	bash scripts/cert-init.sh
