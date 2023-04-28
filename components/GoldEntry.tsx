import React from "react";
import { Gold } from "api/items";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";

import styles from "./GoldEntry.module.scss";

export interface GoldEntryProp {
	value: Gold;
	setValue: (g: Gold) => void;
}

export function GoldEntry({ value, setValue }: GoldEntryProp) {
	return (
		<>
			<div className={styles.ge_box}>
				<div className={styles.ge_set}>
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
				<div className={styles.ge_set}>
					<label className={styles.ge_label} htmlFor="gold">
						<h3>Gold</h3>
					</label>
					<InputNumber
						className={styles.ge_input}
						id="gold"
						showButtons
						value={value.gold}
						style={{ gridArea: "2/2" }}
						onChange={(event: any) => {
							setValue({ ...value, gold: event.value });
						}}
					/>
				</div>
				<div className={styles.ge_set}>
					<label className={styles.ge_label} htmlFor="silver">
						<h3>Silver</h3>
					</label>
					<InputNumber
						className={styles.ge_input}
						id="silver"
						showButtons
						value={value.silver}
						style={{ gridArea: "2/3" }}
						onChange={(event: any) => {
							setValue({ ...value, silver: event.value });
						}}
					/>
				</div>

				<div className={styles.ge_set}>
					<label className={styles.ge_label} htmlFor="copper">
						<h3>Copper</h3>
					</label>
					<InputNumber
						className={styles.ge_input}
						id="copper"
						showButtons
						value={value.copper}
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
