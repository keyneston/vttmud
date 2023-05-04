import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import useLocalStorage from "utils/useLocalStorage";
import { subDate, formatDate } from "utils/date";
import { getLevel } from "utils/pf2e/income";

import styles from "./index.module.scss";

const multiplierKey = "earn_income_multiplier";
const levelKey = "earn_income_level";
const proficiencyKey = "character_proficiency";
const descriptionKey = "earn_income_description";

interface IncomeTemplateProps {
	name: string;
	setName(name: string): void;
}

export default function IncomeTemplate({ name, setName }: IncomeTemplateProps) {
	const [days, setDays] = useState<number>(1);
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [success, setSuccess] = useState<number>(0);
	const [critSuccess, setCritSuccess] = useState<number>(0);
	const [failure, setFailure] = useState<number>(0);
	const [critFailure, setCritFailure] = useState<number>(0);
	const [multiplier, setMultiplier] = useLocalStorage<number>(multiplierKey, 1);
	const [proficiency, setProficiency] = useLocalStorage<string>(proficiencyKey, "Untrained");
	const [description, setDescription] = useLocalStorage<string>(descriptionKey, "");
	const [level, setLevel] = useLocalStorage<number>(levelKey, 1);

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
				description={description}
				total={calcTotal({
					level: level,
					success: success,
					critSuccess: critSuccess,
					failure: failure,
					multiplier: multiplier,
					proficiency: proficiency,
				})}
			/>
			<Divider />
			<div className={styles.box}>
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
				<span className="p-float-label" style={{ gridColumn: "1/3" }}>
					<InputText
						id="description"
						value={description}
						style={{ width: "95%" }}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<label htmlFor="description">Description</label>
				</span>
				<div>
					<span className="p-float-label">
						<Calendar
							value={endDate}
							onChange={(e) => {
								const d = Array.isArray(e.value) ? e.value[0] : e.value;
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
				<div className={styles.success_counter_set}>
					<div>
						<label htmlFor="critSuccess" className={styles.success_counter_label}>
							Critical Success
						</label>
					</div>
					<div>
						<label htmlFor="success" className={styles.success_counter_label}>
							Success
						</label>
					</div>
					<div>
						<label htmlFor="failure" className={styles.success_counter_label}>
							Failure
						</label>
					</div>
					<div>
						<label htmlFor="critFailure" className={styles.success_counter_label}>
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
				className={styles.success_counter}
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
	proficiency,
	multiplier,
}: {
	level: number;
	success: number;
	critSuccess: number;
	failure: number;
	proficiency: string;
	multiplier: number;
}): string {
	const data = getLevel(level);
	const critData = getLevel(level + 1);
	let total = 0;

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
	description,
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
	description: string;
	total: string;
}) {
	const summaryParts: string[] = [];
	if (critSuccess > 0) summaryParts.push(`${critSuccess} x Critical Successes`);
	if (success > 0) summaryParts.push(`${success} x Successes`);
	if (failure > 0) summaryParts.push(`${failure} x Failures`);
	if (critFailure > 0) summaryParts.push(`${critFailure} x Critical Failures`);

	const dc = getLevel(level).dc;

	return (
		<p className="m-0">
			<b>Character:</b> {name} <br />
			<b>Description:</b> {description}
			<br />
			<b>Days: </b> {formatDate(subDate(endDate, days - 1))}-{formatDate(endDate)} <br />
			<b>Attempted:</b> {proficiency} Level {level}; DC {dc}
			<br />
			<b>Results:</b> {summaryParts.join(", ")} <br />
			<b>Earned:</b> {total}
		</p>
	);
}

export { IncomeTemplate };
