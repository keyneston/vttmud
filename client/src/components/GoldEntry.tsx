import { useState } from "react";
import { Gold } from "../api/items";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";

import "./GoldEntry.scss";

export interface GoldEntryProp {
	value: Gold;
	setValue: (g: Gold) => void;
}

export function GoldEntry({ value, setValue }: GoldEntryProp) {
	return (
		<>
			<div className="money">
				<SelectButton
					id="spend"
					options={["-", "+"]}
					unselectable={false}
					value={value.spend ? "-" : "+"}
					onChange={(e: any) => {
						setValue({ ...value, spend: e.value === "-" });
					}}
				/>
				<span className="p-float-label">
					<InputNumber
						className="money-input"
						id="gold"
						value={value.gold}
						onChange={(event: any) => {
							setValue({ ...value, gold: event.value });
						}}
					/>
					<label htmlFor="gold">Gold</label>
				</span>
				<span className="p-float-label">
					<InputNumber
						className="money-input"
						id="silver"
						value={value.silver}
						onChange={(event: any) => {
							setValue({ ...value, silver: event.value });
						}}
					/>
					<label htmlFor="silver">Silver</label>
				</span>
				<span className="p-float-label">
					<InputNumber
						className="money-input"
						id="copper"
						value={value.copper}
						onChange={(event: any) => {
							setValue({ ...value, copper: event.value });
						}}
					/>
					<label htmlFor="copper">Copper</label>
				</span>
			</div>
		</>
	);
}
