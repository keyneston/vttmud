FOUNDRY_DIR=foundryvtt-pf2e
.PHONY: build run build-client build-server foundry_dir

run:
	npm run serve

run-frontend:
	cd client && npm run start
	
run-backend:
	npm run watch

clean:
	rm -rf build/*

build: clean 
	npm i
	npm run build


foundry_dir:
	test -d $(FOUNDRY_DIR) || git clone --depth=1 https://github.com/foundryvtt/pf2e.git $(FOUNDRY_DIR)

items.db.json:
	cd $(FOUNDRY_DIR) && git pull --ff-only
	cat $(FOUNDRY_DIR)/packs/data/equipment.db/* | jq -s '[.[] | {id: ."_id", name: .name, level: .system.level.value, cost: {gold: .system.price.value.gp, silver: .system.price.value.sp, copper: .system.price.value.sp}, traits: .system.traits, type: .type}]' > ./public/items.db.json

deploy:
	flyctl deploy

docker:
	docker build . -t keyneston/vttmud

docker-shell:
	docker run -it keyneston/vttmud /bin/bash

generate:
	npm run generate
