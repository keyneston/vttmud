.PHONY: run
run:
	cd client && npm run start 

run-backend:
	cd server && npm run watch

.PHONY: build
build:
	cd client && npm run build
	cd server && npm run build

