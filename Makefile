.PHONY: run
run:
	cd client && npm run start &
	cd server && npm watch

.PHONY: build
build:
	cd client && npm run build
	cd server && npm run build

