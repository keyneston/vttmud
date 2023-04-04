import React, { useEffect, useState } from "react";

function CraftTemplate() {
	const [name, setName] = useState<string>("");
	const [item, setItem] = useState<string>("");
	const [level, setLevel] = useState<number>(0);
	const [days, setDays] = useState<number>(4);

	useEffect(function persistForm() {
		localStorage.setItem("craftTemplateForm", name);
	});

	let date = new Date();

	return (
		<div className="CraftingTemplate">
			<div id="craftDCOutput">
				<em>Character: </em> {name} <br></br>
				<em>Activity: </em> Craft {item} ({level ? level : 0})<br></br>
				<em>Days: </em> {formatDate(subDate(date, days))}-{formatDate(date)}
				<br></br>
				<em>DC: </em> {craftDC(level)}
				<br></br>
				<em>Formula Cost: </em> {formulaCost(level)} gp
			</div>

			<form>
				<div>
					<label htmlFor="name">Name</label>
					<input type="Text" id="name" onChange={(x) => setName(x.target.value)}></input>
				</div>
				<div>
					<label htmlFor="item">Item</label>
					<input type="Text" id="Item" onChange={(x) => setItem(x.target.value)}></input>
				</div>
				<div>
					<label htmlFor="level">Item Level</label>
					<input type="number" min="-1" max="20" onChange={(x) => setLevel(x.target.valueAsNumber)}></input>
				</div>
				<div>
					<label htmlFor="days">Days</label>
					<input type="number" min="0" max="7" onChange={(x) => setDays(x.target.valueAsNumber)}></input>
				</div>
				<div>
					<button type="button">Reset</button>
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
