.PHONY: dev build lint up down logs cert-init archive-logs banlist favicon update-versions fix-permissions

dev: fix-permissions
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

archive-logs:
	bash scripts/archive-logs.sh

banlist:
	bash scripts/banlist.sh

favicon:
	python3 scripts/make-favicon.py $(SRC) frontend/public/favicon.ico

update-versions:
	python3 scripts/update-project-versions.py

fix-permissions:
	bash scripts/fix-public-permissions.sh
