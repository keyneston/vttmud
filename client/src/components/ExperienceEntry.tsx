import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import "./ExperienceEntry.scss";

export interface ExperienceEntryProps {
	value: number;
	onChange: (value: number) => void;
}

export function ExperienceEntry({ value, onChange }: ExperienceEntryProps) {
	const [posExp, setPosExp] = useState<string>("+");

	return (
		<div className="ee-box">
			<SelectButton
				options={["-", "+"]}
				unselectable={false}
				value={posExp}
				onChange={(e) => setPosExp(e.value)}
			/>
			<div>
				<span className="p-float-label">
					<InputNumber
						className="exp-input"
						id="exp"
						min={0}
						value={value}
						onChange={(e: any) => onChange(e.value || 0)}
					/>
					<label htmlFor="exp">Experience</label>
				</span>
			</div>
		</div>
	);
}
