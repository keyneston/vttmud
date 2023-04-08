import React, { useState } from "react";
import { CraftTemplate } from "../CraftTemplate";
import { IncomeTemplate } from "../components/incomeTemplate";
import "./templates.scss";

export default function Templates() {
	const [name, setName] = useState<string>(() => {
		const character_name = localStorage.getItem("character_name");
		return character_name || "";
	});

	return (
		<>
			<div className="fifty-fifty">
				<div className="content-left">
					<CraftTemplate name={name} setName={setName} />
				</div>
				<div className="content-right">
					<IncomeTemplate name={name} setName={setName} />
				</div>
			</div>
		</>
	);
}
