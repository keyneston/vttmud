import React, { useEffect, useState } from "react";

function CraftTemplate() {
	const [name, setName] = useState<string>("");
	const [item, setItem] = useState<string>("");
	const [level, setLevel] = useState<number>(0);
	const [days, setDays] = useState<number>(4);

	useEffect(function persistForm() {
		localStorage.setItem("formData", name);
	});
	// reset(e: any) {
	// 	console.log("Hello World");
	// }

	// updateFormat() {
	// 	console.log("updateFormat called");
	// 	this.render();
	// }

	// format() {
	// 	return (
	// 		<div>
	// 			<em>Name:</em
	// 		</div>
	// 	);
	// }

	// render() {
	return (
		<div className="CraftingTemplate">
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
			<div id="craftDCOutput">
				<em>Character: </em> {name} <br></br>
				<em>Activity: </em> Craft {item} ({level})<br></br>
				<em>Days: </em> {days} <br></br>
				<em>DC: </em> {craftDC(level)}
				<br></br>
				<em>Formula Cost: </em> {formulaCost(level)} gp
			</div>
		</div>
	);
}

function formulaCost(level: number) {
	if (level < 0) {
		level = 0;
	}
	if (level > 20) {
		level = 20;
	}

	return [0.5, 1, 2, 3, 5, 8, 13, 18, 25, 35, 50, 70, 100, 150, 225, 325, 500, 750, 1200, 2000, 3500][level];
}

function craftDC(level: number) {
	if (level < 0) {
		level = 0;
	}
	if (level > 20) {
		level = 20;
	}

	return [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40][level];
}

export { CraftTemplate };
