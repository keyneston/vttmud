import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import styles from "./ExperienceEntry.module.scss";

export interface ExperienceEntryProps {
	value: number;
	onChange: (value: number) => void;
}

export function ExperienceEntry({ value, onChange }: ExperienceEntryProps) {
	const [posExp, setPosExp] = useState<string>("+");

	return (
		<div className={styles.ee_box}>
			<SelectButton
				options={["-", "+"]}
				unselectable={false}
				value={posExp}
				onChange={(e) => {
					setPosExp(e.value);
				}}
			/>
			<div>
				<span className="p-float-label">
					<InputNumber
						className={styles.exp_input}
						id="exp"
						min={0}
						step={250}
						showButtons
						value={Math.abs(value)}
						onChange={(e: any) =>
							onChange(e.value * (posExp === "+" ? 1 : -1) || 0)
						}
					/>
					<label htmlFor="exp">Experience</label>
				</span>
			</div>
		</div>
	);
}
