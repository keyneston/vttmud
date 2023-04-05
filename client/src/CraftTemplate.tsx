import React, { useEffect, useState } from "react";
import "./CraftTemplate.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
		<div className="crafting-template">
			<div id="template-output">
				<em>Character: </em> {name} <br></br>
				<em>Activity: </em> Craft {item} ({level ? level : 0})<br></br>
				<em>Days: </em> {formatDate(subDate(endDate, days))}-{formatDate(endDate)}
				<br></br>
				<em>DC: </em> {craftDC(level)}
				<br></br>
				<em>Result: Success Assurance</em>
				<br></br>
				<br></br>
			</div>

			<form>
				<div className="box">
					<div className="template-label">
						<label htmlFor="name">Character Name</label>
					</div>
					<div>
						<input
							type="Text"
							id="name"
							onChange={(x) => setName(x.target.value)}
						></input>
					</div>
					<div className="template-label">
						<label htmlFor="item">Item Name</label>
					</div>
					<div>
						<input
							type="Text"
							id="Item"
							onChange={(x) => setItem(x.target.value)}
						></input>
					</div>
					<div className="template-label">
						<label htmlFor="level">Item Level</label>
					</div>
					<div>
						<input
							type="number"
							min="-1"
							max="20"
							onChange={(x) => setLevel(x.target.valueAsNumber)}
						></input>
					</div>
					<div className="template-label">
						<label htmlFor="endDate">End Date</label>
					</div>
					<div>
						<DatePicker
							selected={endDate}
							onChange={(date) => setEndDate(date || new Date())}
						/>
					</div>
					<div className="template-label">
						<label htmlFor="days">Days</label>
					</div>
					<div>
						<input
							type="number"
							min="0"
							value="4"
							max="7"
							onChange={(x) => setDays(x.target.valueAsNumber)}
						></input>
					</div>
					<div className="template-label">
						<label>Formula Cost</label>
					</div>
					<div className="template-value">{formulaCost(level)} gp</div>
				</div>
			</form>
		</div>
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
