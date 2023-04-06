import React, { useEffect, useState } from "react";
import "./CraftTemplate.css";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";

function CraftTemplate() {
	const [name, setName] = useState<string>("");
	const [item, setItem] = useState<string>("");
	const [level, setLevel] = useState<number>(0);
	const [days, setDays] = useState<number>(4);
	const [endDate, setEndDate] = useState<Date>(new Date());

	useEffect(function persistForm() {
		localStorage.setItem("craftTemplateForm", name);
	});

	return (
		<Panel header="Crafting Template">
			<p className="m-0">
				<em>Character: </em> {name} <br></br>
				<em>Activity: </em> Craft {item} ({level ? level : 0})<br></br>
				<em>Days: </em> {formatDate(subDate(endDate, days))}-{formatDate(endDate)}
				<br></br>
				<em>DC: </em> {craftDC(level)}
				<br></br>
				<em>Result: Success Assurance</em>
				<br></br>
				<br></br>
			</p>

			<Divider />

			<div className="box">
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
					<InputText id="item" value={item} onChange={(e) => setItem(e.target.value)} />
					<label htmlFor="item">Item Description</label>
				</span>
				<span className="p-float-label">
					<InputNumber
						value={level}
						onValueChange={(e) => setLevel(e.value || 0)}
						min={-1}
						max={20}
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
	if (level < 0 || isNaN(level)) {
		level = 0;
	}
	if (level > 20) {
		level = 20;
	}

	return [0.5, 1, 2, 3, 5, 8, 13, 18, 25, 35, 50, 70, 100, 150, 225, 325, 500, 750, 1200, 2000, 3500][level];
}

function craftDC(level: number) {
	if (level < 0 || isNaN(level)) {
		level = 0;
	}
	if (level > 20) {
		level = 20;
	}

	return [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40][level];
}

export { CraftTemplate };
