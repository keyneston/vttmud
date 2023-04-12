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
					style={{ height: "3rem" }}
				/>
				<div className="ge-label-set">
					<label htmlFor="gold">Gold</label>
					<InputNumber
						className="money-input"
						id="gold"
						value={value.gold}
						style={{ width: "5rem" }}
						onChange={(event: any) => {
							setValue({ ...value, gold: event.value });
						}}
					/>
				</div>
				<div className="ge-label-set">
					<label htmlFor="silver">Silver</label>
					<InputNumber
						className="money-input"
						id="silver"
						value={value.silver}
						style={{ width: "5rem" }}
						onChange={(event: any) => {
							setValue({ ...value, silver: event.value });
						}}
					/>
				</div>
				<div className="ge-label-set">
					<label htmlFor="copper">Copper</label>
					<InputNumber
						className="money-input"
						id="copper"
						value={value.copper}
						buttonLayout="vertical"
						style={{ width: "5rem" }}
						onChange={(event: any) => {
							setValue({ ...value, copper: event.value });
						}}
					/>
				</div>
			</div>
		</>
	);
}
