import React, { useState } from "react";
import "./CraftTemplate.css";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { AutoComplete } from "primereact/autocomplete";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { MinItemLevel, MaxItemLevel } from "./constants";
import { Item, Gold } from './api/items';

var itemsDB: Item[] = []

getItemsDB()

function CraftTemplate() {
	const [name, setName] = useState<string>(() => {
		const character_name = localStorage.getItem("character_name");
		return character_name || ""
	});
	const [item, setItem] = useState<Item|void>();
	const [level, setLevel] = useState<number>(0);
	const [days, setDays] = useState<number>(4);
	const [endDate, setEndDate] = useState<Date>(new Date());

	localStorage.setItem("character_name", name)

	return (
		<Panel header="Crafting Template">
			<Output name={name} item={item} days={days} endDate={endDate} level={level} />

			<Divider />

			<div className="box card">
				<div>
					<span className="p-float-label">
						<InputText
							id="character"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<label htmlFor="character">Character Name</label>
					</span>
				</div>
				<ItemAutoComplete item={item} setLevel={setLevel} setItem={setItem}/>
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

				<div>
					<Calendar
						value={endDate}
						onChange={(e) => {
							let d = Array.isArray(e.value) ? e.value[0] : e.value;
							setEndDate(new Date(d || new Date()));
						}}
					/>
				</div>
				<span className="p-float-label">
					<InputNumber
						value={days}
						onValueChange={(e) => setDays(e.value || 0)}
						min={0}
						max={7}
						id="days"
					/>
					<label htmlFor="days">Number of Days</label>
				</span>
			</div>

			<Divider />
			<ItemInformation item={item} level={level||0} />
		</Panel>
	);
}


function Output({name, item, days, endDate, level}: {name: string; item: void|Item|undefined; days: number; endDate: Date; level: number; }) {
		return (
			<p className="m-0">
				<b>Character: </b> {name} <br></br>
				<b>Activity: </b> Craft {item ? item.name : ""}<br></br>
				<b>Days: </b> {formatDate(subDate(endDate, days))}-{formatDate(endDate)}
				<br></br>
				<b>Item Level:</b> {level || 0} <b>DC:</b> {craftDC(level)}
				<br></br>
				<b>Result: Success Assurance</b>
				<br></br>
				<br></br>
			</p>
		)
}

type ItemAutoCompleteProps = {
		item: void|Item|undefined;
		setLevel: (level: number)=>void;
		setItem: (item: void|Item|undefined)=> void;
}

function ItemAutoComplete({item, setLevel, setItem}: ItemAutoCompleteProps) {
		const [searchEntries, setSearchEntires] = useState<Item[]|void>()

		return (
				<span className="p-float-label">
						<AutoComplete
								id="item"
								value={item}
								suggestions={searchEntries || undefined}
								completeMethod={(e: any) => {
										var term = e.query.toLowerCase()
										var results = itemsDB.filter((entry) => entry.name.toLowerCase().includes(term))
										setSearchEntires(results)
								}}
								field="name"
								onChange={(e) => {
										setItem(e.value)
								}}
								onSelect={(e) => {
										setLevel(e.value.level)
								}}
								itemTemplate={(e) => {
										return `${e.name} [${e.level}]`
								}}
								forceSelection />
						<label htmlFor="item">Item</label>
				</span>
		)
}

type ItemInformationProps = {
		item: void|Item|undefined;
		level: number;
}

function ItemInformation({item, level}: ItemInformationProps) {
	return (
		<div className="box">
			<div className="template-label"> <label>Item Cost</label>
			</div>
			<div className="template-value">{item ? simplifyGold(item.cost) : 0} gp</div>
			<div className="template-label">
					<label>Formula Cost</label>
			</div>
			<div className="template-value">{formulaCost(level)} gp</div>
			<div className="template-label">
					<label>Total Cost</label>
			</div>
			<div className="template-value">{(item ? simplifyGold(item.cost) : 0) + formulaCost(level)} gp</div>
		</div>
	)
}

function getItemsDB() {
	console.log("itemsDB: Starting fetch")
	return fetch('/items.db.json')
   .then((response) => response.json())
   .then((responseJson) => {
	 console.log("itemsDB: Updated")
     itemsDB = responseJson
   })
   .catch((error) => {
     console.error(error);
   });
}


function subDate(date: Date, days: number): Date {
	if (isNaN(days)) {
		days = 0;
	}
	var d2 = new Date(date);

	d2.setDate(d2.getDate() - days);

	return d2;
}

function formatDate(date: Date): string {
	return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formulaCost(level: number) {
	if (level < MinItemLevel || isNaN(level)) {
		level = 0;
	}
	if (level > MaxItemLevel) {
		level = 20;
	}

	return [0.5, 1, 2, 3, 5, 8, 13, 18, 25, 35, 50, 70, 100, 150, 225, 325, 500, 750, 1200, 2000, 3500][level];
}

function craftDC(level: number) {
	if (level < MinItemLevel || isNaN(level)) {
		level = 0;
	}
	if (level > MaxItemLevel) {
		level = 20;
	}

	return [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40][level];
}

function simplifyGold(input: Gold): number {
		var value = 0
		console.log(`simplifyGold(${JSON.stringify(input)})`)

		if (!input) {
				return value
		}

		if (input.pp) {
				value += input.pp* 10
		}
		if (input.gp) {
				value += input.gp
		}
		if (input.sp) {
				value += input.sp/ 10
		}
		if (input.cp) {
				value += input.cp/ 100
		}

		return value
}

export { CraftTemplate };
