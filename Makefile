FOUNDRY_DIR=build/foundryvtt-pf2e

.PHONY: run
run:
	cd client && npm run start 

run-backend:
	cd server && npm run watch

.PHONY: build
build:
	rm -rf client/build/*
	rm -rf server/dist/*
	cd client && npm run build
	cd server && npm run build

foundry_dir:
	test -d $(FOUNDRY_DIR) || git clone --depth=1 https://github.com/foundryvtt/pf2e.git $(FOUNDRY_DIR)

items.db.json:
	cd $(FOUNDRY_DIR) && git pull
	cat $(FOUNDRY_DIR)/packs/data/equipment.db/* | jq -s '[.[] | {id: ."_id", name: .name, level: .system.level.value, cost: {gp: .system.price.value.gp, sp: .system.price.value.sp, cp: .system.price.value.sp}, traits: .system.traits, type: .type}]' > ./client/public/items.db.json

deploy:
	flyctl deploy
