import React, { useEffect, useState } from "react";
import "./CraftTemplate.css";

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
		<div className="crafting-template">
			<div id="template-output">
				<em>Character: </em> {name} <br></br>
				<em>Activity: </em> Craft {item} ({level ? level : 0})<br></br>
				<em>Days: </em> {formatDate(subDate(date, days))}-{formatDate(date)}
				<br></br>
				<em>DC: </em> {craftDC(level)}
				<br></br>
				<em>Result: Success Assurance</em>
				<br></br>
				<br></br>
			</div>

			<form>
				<div className="box">
					<div>
						<label htmlFor="name" className="template-label">
							Character Name
						</label>
					</div>
					<div>
						<input
							type="Text"
							id="name"
							onChange={(x) => setName(x.target.value)}
						></input>
					</div>
					<div>
						<label htmlFor="item" className="template-label">
							Item Name
						</label>
					</div>
					<div>
						<input
							type="Text"
							id="Item"
							onChange={(x) => setItem(x.target.value)}
						></input>
					</div>
					<div>
						<label htmlFor="level" className="template-label">
							Item Level
						</label>
					</div>
					<div>
						<input
							type="number"
							min="-1"
							max="20"
							onChange={(x) => setLevel(x.target.valueAsNumber)}
						></input>
					</div>
					<div>
						<label htmlFor="days" className="template-label">
							Days
						</label>
					</div>
					<div>
						<input
							type="number"
							min="0"
							max="7"
							onChange={(x) => setDays(x.target.valueAsNumber)}
						></input>
					</div>
					<div>
						<label className="template-label">Formula Cost</label>
					</div>
					<div>{formulaCost(level)} gp</div>
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
