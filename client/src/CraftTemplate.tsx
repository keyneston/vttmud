import React, { useEffect, useState } from "react";
import "./CraftTemplate.css";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { AutoComplete } from "primereact/autocomplete";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { MinItemLevel, MaxItemLevel } from "./constants";
import { Client, Item } from './api/items';

const client = new Client();
var itemsDB: Item[] = []

getItemsDB()

function CraftTemplate() {
	const [name, setName] = useState<string>("");
	const [item, setItem] = useState<Item|void>();
	const [level, setLevel] = useState<number>(0);
	const [days, setDays] = useState<number>(4);
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [searchEntries, setSearchEntires] = useState<Item[]|void>()

	useEffect(function persistForm() {
		localStorage.setItem("craftTemplateForm", name);
	});

	return (
		<Panel header="Crafting Template">
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

			<div className="box">
				<div className="template-label">
					<label>Formula Cost</label>
				</div>
				<div className="template-value">{formulaCost(level)} gp</div>
			</div>
		</Panel>
	);
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

export { CraftTemplate };
