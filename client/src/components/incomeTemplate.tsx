import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { subDate, formatDate } from "../date";
import { Dropdown } from "primereact/dropdown";
import { getLevel } from "../pf2e/income";
import "./incomeTemplate.scss";

const mutliplierKey = "earn_income_multiplier";
const levelKey = "earn_income_level";
const proficiencyKey = "character_proficiency";

export default function IncomeTemplate({ name, setName }: { name: string; setName: (name: string) => void }) {
	const [days, setDays] = useState<number>(1);
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [success, setSuccess] = useState<number>(0);
	const [critSuccess, setCritSuccess] = useState<number>(0);
	const [failure, setFailure] = useState<number>(0);
	const [critFailure, setCritFailure] = useState<number>(0);
	const [multiplier, setMultiplier] = useState<number>(() => {
		const multiplier = localStorage.getItem(mutliplierKey);
		return parseInt(multiplier || "1") || 1;
	});
	const [proficiency, setProficiency] = useState<string>(() => {
		const character_proficiency = localStorage.getItem(proficiencyKey);
		return character_proficiency || "Untrained";
	});
	const [level, setLevel] = useState<number>(() => {
		const earn_income_level = localStorage.getItem(levelKey);
		return parseInt(earn_income_level || "1") || 1;
	});

	localStorage.setItem(proficiencyKey, proficiency);
	localStorage.setItem(levelKey, `${level}`);
	localStorage.setItem(mutliplierKey, `${multiplier}`);

	return (
		<Panel header="Earn Income Template">
			<Output
				name={name}
				success={success}
				critSuccess={critSuccess}
				failure={failure}
				critFailure={critFailure}
				days={days}
				endDate={endDate}
				level={level}
				proficiency={proficiency}
				total={calcTotal({
					level: level,
					success: success,
					critSuccess: critSuccess,
					failure: failure,
					critFailure: critFailure,
					multiplier: multiplier,
					proficiency: proficiency,
				})}
			/>
			<Divider />
			<div className="box card">
				<span className="p-float-label">
					<InputText
						id="character"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<label htmlFor="character">Character Name</label>
				</span>
				<span className="p-float-label">
					<Dropdown
						id="proficiency"
						value={proficiency}
						onChange={(e) => setProficiency(e.value)}
						options={["Untrained", "Trained", "Expert", "Master", "Legendary"]}
						placeholder="Select a Proficiency"
					/>
					<label htmlFor="proficiency">Proficiency Level</label>
				</span>
				<div>
					<span className="p-float-label">
						<Calendar
							value={endDate}
							onChange={(e) => {
								let d = Array.isArray(e.value) ? e.value[0] : e.value;
								setEndDate(new Date(d || new Date()));
							}}
							id="endDate"
						/>
						<label htmlFor="endDate">End Date</label>
					</span>
				</div>
				<span className="p-float-label">
					<InputNumber
						value={days}
						onValueChange={(e) => setDays(e.value || 0)}
						min={0}
						max={7}
						id="days"
					/>
					<label htmlFor="days">Number of Days</label>
				</span>
				<span className="p-float-label">
					<InputNumber
						value={level}
						onValueChange={(e) => setLevel(e.value || 1)}
						min={0}
						max={20}
						id="level"
					/>
					<label htmlFor="level">Attempted Level</label>
				</span>
				<span className="p-float-label">
					<InputNumber
						value={multiplier}
						onValueChange={(e) => setMultiplier(e.value || 1)}
						min={0}
						max={10}
						id="multiplier"
					/>
					<label htmlFor="multiplier">Multiplier</label>
				</span>
				<div className="success-counter-set">
					<div>
						<label htmlFor="critSuccess" className="success-counter-label">
							Critical Success
						</label>
					</div>
					<div>
						<label htmlFor="success" className="success-counter-label">
							Success
						</label>
					</div>
					<div>
						<label htmlFor="failure" className="success-counter-label">
							Failure
						</label>
					</div>
					<div>
						<label htmlFor="critFailure" className="success-counter-label">
							Critical Failure
						</label>
					</div>
					<SuccessCounter
						id="critSuccess"
						value={critSuccess}
						setValue={setCritSuccess}
					/>
					<SuccessCounter id="success" value={success} setValue={setSuccess} />
					<SuccessCounter id="failure" value={failure} setValue={setFailure} />
					<SuccessCounter
						id="critFailure"
						value={critFailure}
						setValue={setCritFailure}
					/>
				</div>
			</div>
		</Panel>
	);
}

function SuccessCounter({ id, value, setValue }: { id: string; value: number; setValue: (value: number) => void }) {
	return (
		<div className="card flex justify-content-center">
			<InputNumber
				className="success-counter"
				value={value}
				onValueChange={(e) => setValue(e.value || 0)}
				min={0}
				max={7}
				id={id}
				showButtons
				buttonLayout="vertical"
				style={{ width: "4rem" }}
				decrementButtonClassName="p-button-secondary"
				incrementButtonClassName="p-button-secondary"
				incrementButtonIcon="pi pi-plus"
				decrementButtonIcon="pi pi-minus"
			/>
		</div>
	);
}

function calcTotal({
	level,
	success,
	critSuccess,
	failure,
	critFailure,
	proficiency,
	multiplier,
}: {
	level: number;
	success: number;
	critSuccess: number;
	failure: number;
	critFailure: number;
	proficiency: string;
	multiplier: number;
}): string {
	let data = getLevel(level);
	let critData = getLevel(level + 1);
	var total = 0;

	total += data.failed * failure;

	switch (proficiency) {
		case "Trained":
			total += data.trained * success;
			total += critData.trained * critSuccess;
			break;
		case "Expert":
			total += data.expert * success;
			total += critData.expert * critSuccess;
			break;
		case "Master":
			total += data.master * success;
			total += critData.master * critSuccess;
			break;
		case "Legendary":
			total += data.legendary * success;
			total += critData.legendary * critSuccess;
			break;
	}

	return `${(total * multiplier).toFixed(2)} gp`;
}

function Output({
	name,
	success,
	critSuccess,
	failure,
	critFailure,
	days,
	endDate,
	level,
	proficiency,
	total,
}: {
	name: string;
	success: number;
	critSuccess: number;
	failure: number;
	critFailure: number;
	days: number;
	endDate: Date;
	level: number;
	proficiency: string;
	total: string;
}) {
	var summaryParts: string[] = [];
	if (critSuccess > 0) summaryParts.push(`${critSuccess} x Critical Successes`);
	if (success > 0) summaryParts.push(`${success} x Successes`);
	if (failure > 0) summaryParts.push(`${failure} x Failures`);
	if (critFailure > 0) summaryParts.push(`${critFailure} x Critical Failures`);

	let dc = getLevel(level).dc;

	return (
		<p className="m-0">
			<b>Character:</b> {name} <br />
			<b>Days: </b> {formatDate(subDate(endDate, days))}-{formatDate(endDate)} <br />
			<b>Attempted:</b> {proficiency} Level {level}; DC {dc}
			<br />
			<b>Results:</b> {summaryParts.join(", ")} <br />
			<b>Earned:</b> {total}
		</p>
	);
}

export { IncomeTemplate };
