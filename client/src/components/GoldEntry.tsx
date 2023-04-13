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
			<div className="ge-box">
				<div className="ge-set">
					<SelectButton
						id="spend"
						options={["-", "+"]}
						unselectable={false}
						value={value.spend ? "-" : "+"}
						onChange={(e: any) => {
							setValue({ ...value, spend: e.value === "-" });
						}}
						style={{ height: "3rem", gridArea: "2 / 1" }}
					/>
				</div>
				<div className="ge-set">
					<label className="ge-label" htmlFor="gold">
						<h3>Gold</h3>
					</label>
					<InputNumber
						className="ge-input"
						id="gold"
						value={value.gold}
						style={{ gridArea: "2/2" }}
						onChange={(event: any) => {
							setValue({ ...value, gold: event.value });
						}}
					/>
				</div>
				<div className="ge-set">
					<label className="ge-label" htmlFor="silver">
						<h3>Silver</h3>
					</label>
					<InputNumber
						className="ge-input"
						id="silver"
						value={value.silver}
						style={{ gridArea: "2/3" }}
						onChange={(event: any) => {
							setValue({ ...value, silver: event.value });
						}}
					/>
				</div>

				<div className="ge-set">
					<label className="ge-label" htmlFor="copper">
						<h3>Copper</h3>
					</label>
					<InputNumber
						className="ge-input"
						id="copper"
						value={value.copper}
						buttonLayout="vertical"
						style={{ gridArea: "2/4" }}
						onChange={(event: any) => {
							setValue({ ...value, copper: event.value });
						}}
					/>
				</div>
			</div>
		</>
	);
}
