import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { AutoComplete } from "primereact/autocomplete";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { MinItemLevel, MaxItemLevel } from "./constants";
import { simplifyGold, Item } from "./api/items";
import { subDate, formatDate } from "./date";
import { formulaCost, craftDC } from "./pf2e/income";

import "./CraftTemplate.css";

var itemsDB: Item[] = [];

getItemsDB();

function emptyPerson(id: number): CraftPerson {
	const character_name = localStorage.getItem(`character_name_${id}`) || "";
	return { name: character_name, days: 1, endDate: new Date() };
}

function CraftTemplate({ name, setName }: { name: string; setName: (name: string) => void }) {
	const [item, setItem] = useState<Item | void>();
	const [itemCount, setItemCount] = useState<number>(1);
	const [level, setLevel] = useState<number>(0);
	const [people, setPeople] = useState<CraftPerson[]>([
		emptyPerson(0),
		emptyPerson(1),
		emptyPerson(2),
		emptyPerson(3),
	]);
	const [peopleCount, setPeopleCount] = useState<number>(() => {
		const value = localStorage.getItem("craft_template_people_count");
		return parseInt(value || "0");
	});

	localStorage.setItem("character_name_0", people[0].name);
	localStorage.setItem("character_name_1", people[1].name);
	localStorage.setItem("character_name_2", people[2].name);
	localStorage.setItem("character_name_3", people[3].name);
	localStorage.setItem("craft_template_people_count", peopleCount.toString());

	const updatePerson = (id: number): ((i: CraftPerson) => void) => {
		return (i: CraftPerson) => {
			people[id] = i;
			setPeople([...people]);
		};
	};

	return (
		<Panel header="Crafting Template">
			<Output people={people.slice(0, peopleCount)} level={level} itemCount={itemCount} item={item} />

			<Divider />
			<InputNumber
				min={1}
				max={4}
				value={peopleCount}
				onValueChange={(e: InputNumberValueChangeEvent) => {
					setPeopleCount(e.value || 1);
				}}
				showButtons
				buttonLayout="horizontal"
				decrementButtonClassName="p-button-danger"
				incrementButtonClassName="p-button-success"
				incrementButtonIcon="pi pi-plus"
				decrementButtonIcon="pi pi-minus"
			/>

			<div className="cf-box card">
				<div>
					<ItemAutoComplete item={item} setLevel={setLevel} setItem={setItem} />
				</div>
				<div>
					<span className="p-float-label">
						<InputNumber
							value={level}
							onValueChange={(e) => setLevel(e.value || 0)}
							min={MinItemLevel}
							max={MaxItemLevel}
							id="level"
						/>
						<label htmlFor="level">Item Level</label>
					</span>
				</div>

				<div>
					<ItemCount itemCount={itemCount} item={item} setItemCount={setItemCount} />
				</div>

				{Array.from({ length: peopleCount }, (_, i) => (
					<>
						<Divider />
						<div>
							<CraftPersonTemplate
								id={i}
								value={people[i]}
								setValue={updatePerson(i)}
							/>
						</div>
					</>
				))}
			</div>

			<Divider />
			<ItemInformation item={item} level={level || 0} itemCount={itemCount} />
		</Panel>
	);
}

interface CraftPerson {
	name: string;
	endDate: Date;
	days: number;
}

function CraftPersonTemplate({
	id,
	value,
	setValue,
}: {
	id: number;
	value: CraftPerson;
	setValue: (i: CraftPerson) => void;
}) {
	return (
		<>
			<div>
				<span className="p-float-label">
					<InputText
						id={`${id}-character`}
						value={value.name}
						onChange={(e) => setValue({ ...value, name: e.target.value })}
					/>
					<label htmlFor={`${id}-character`}>Character Name</label>
				</span>
			</div>
			<div>
				<span className="p-float-label">
					<Calendar
						value={value.endDate}
						onChange={(e) => {
							let d = Array.isArray(e.value) ? e.value[0] : e.value;
							setValue({ ...value, endDate: new Date(d || "") });
						}}
						id={`${id}-endDate`}
					/>
					<label htmlFor={`${id}-endDate`}>End Date</label>
				</span>
			</div>
			<span className="p-float-label">
				<InputNumber
					value={value.days}
					onValueChange={(e) => setValue({ ...value, days: e.value || 0 })}
					min={0}
					max={7}
					id={`${id}-days`}
				/>
				<label htmlFor={`${id}-days`}>Number of Days</label>
			</span>
		</>
	);
}

function Output({
	people,
	level,
	item,
	itemCount,
}: {
	people: CraftPerson[];
	level: number;
	item: void | Item | undefined;
	itemCount: number;
}) {
	var itemCountString = itemCount > 1 ? ` ${itemCount} x ` : "";

	const formatNames = (people: CraftPerson[]) => people.map((x) => x.name).join(", ");
	const formatDateRange = (person: CraftPerson, wrap: boolean) => {
		var str = "";
		if (person.days === 1) {
			str = `${formatDate(person.endDate)}`;
		} else {
			str = `${formatDate(subDate(person.endDate, person.days))}-${formatDate(person.endDate)}`;
		}
		if (wrap) {
			return `${person.name}(${str})`;
		} else {
			return str;
		}
	};

	return (
		<p className="m-0">
			<b>Character: </b> {formatNames(people)}
			<br />
			<b>Activity: </b> Craft {itemCountString} {item ? item.name : ""} <br />
			<b>Days:</b> {people.map((x) => formatDateRange(x, people.length > 1)).join(" ")} <br />
			<b>Item Level:</b> {level || 0} <b>DC:</b> {craftDC(level)} <br />
			<b>Result: Success Assurance</b>
		</p>
	);
}

function ItemCount({
	itemCount,
	setItemCount,
	item,
}: {
	itemCount: number;
	setItemCount: (itemCount: number) => void;
	item: Item | void | undefined;
}) {
	var consumable = false;
	item?.traits?.value.forEach((t: string) => {
		if (t === "consumable") {
			consumable = true;
		}
	});

	if (consumable === false) {
		setItemCount(1);
	}

	return (
		<span className="p-float-label">
			<InputNumber
				value={itemCount}
				onChange={(e) => setItemCount(e.value || 1)}
				id="itemCount"
				min={1}
				max={10}
				disabled={!consumable}
			/>
			<label htmlFor="itemCount">Item Count</label>
		</span>
	);
}

type ItemAutoCompleteProps = {
	item: void | Item | undefined;
	setLevel: (level: number) => void;
	setItem: (item: void | Item | undefined) => void;
};

function ItemAutoComplete({ item, setLevel, setItem }: ItemAutoCompleteProps) {
	const [searchEntries, setSearchEntires] = useState<Item[] | void>();

	return (
		<span className="p-float-label">
			<AutoComplete
				id="item"
				value={item}
				suggestions={searchEntries || undefined}
				completeMethod={(e: any) => {
					var term = e.query.toLowerCase();
					var results = itemsDB.filter((entry) =>
						entry.name.toLowerCase().includes(term)
					);
					setSearchEntires(results);
				}}
				field="name"
				onChange={(e) => {
					setItem(e.value);
				}}
				onSelect={(e) => {
					setLevel(e.value.level);
				}}
				itemTemplate={(e) => {
					return `${e.name} [${e.level}]`;
				}}
				forceSelection
			/>
			<label htmlFor="item">Item</label>
		</span>
	);
}

type ItemInformationProps = {
	item: void | Item | undefined;
	level: number;
	itemCount: number;
};

function ItemInformation({ item, level, itemCount }: ItemInformationProps) {
	var itemCost = item ? simplifyGold(item.cost) : 0;
	var formula = formulaCost(level);

	return (
		<div className="box">
			<div className="template-label">
				<label>Item Cost</label>
			</div>
			<div className="template-value">
				{itemCount > 1 ? `${itemCount} x ` : ""} {itemCost} gp
			</div>
			<div className="template-label">
				<label>Formula Cost</label>
			</div>
			<div className="template-value">{formula} gp</div>
			<div className="template-label">
				<label>Total Cost</label>
			</div>
			<div className="template-value">
				{itemCost * itemCount} + {formula} = {itemCost * itemCount + formulaCost(level)} gp
			</div>
		</div>
	);
}

function getItemsDB() {
	console.log("itemsDB: Starting fetch");
	return fetch("/items.db.json")
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("itemsDB: Updated");
			itemsDB = responseJson;
		})
		.catch((error) => {
			console.error(error);
		});
}

export { CraftTemplate };
