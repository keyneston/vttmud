import { useState } from "react";
import { classNames } from "primereact/utils";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Tag } from "primereact/tag";

import { subDate, formatDate } from "../date";
import "./DowntimeLog.scss";

type DowntimeEntry = {
	date: Date;
	level: number;
	activity: string;
	assurance: boolean;
	roll?: number;
	bonus?: number;
	dc?: number;
	details?: string;
};

const calculateSuccess = function (r: DowntimeEntry): number {
	var level = 2;

	var dc = r.dc ?? 0;
	var bonus = r.bonus ?? 0;
	var roll = r.roll ?? 1;

	var total = (r.assurance ? 10 : roll) + bonus;
	if (total >= 10 + dc) {
		level = 4;
	} else if (total >= dc) {
		level = 3;
	} else if (total <= dc - 10) {
		level = 1;
	} else {
		level = 2;
	}

	if (r.roll === 1) {
		r.roll -= 1;
	} else if (r.roll === 20) {
		r.roll += 1;
	}

	if (level > 4) {
		return 4;
	} else if (level < 1) {
		return 1;
	} else {
		return level;
	}
};

const resultTemplate = (r: DowntimeEntry) => {
	if (!r || !r.dc || !r.bonus) {
		return <></>;
	}
	var tagColor: "danger" | "warning" | "success" | "info" | null | undefined = undefined;
	var tagLabel: string = "";

	switch (calculateSuccess(r)) {
		case 0:
		case 1:
			tagColor = "danger";
			tagLabel = "Critical Failure";
			break;
		case 2:
			tagColor = "warning";
			tagLabel = "Failure";
			break;
		case 3:
			tagColor = "success";
			tagLabel = "Success";
			break;
		case 4:
		case 5:
			tagColor = "info";
			tagLabel = "Critical Success";
			break;
	}

	return <Tag severity={tagColor} value={tagLabel} />;
};

const assuranceBodyTemplate = (rowData: DowntimeEntry) => {
	return (
		<i
			className={classNames("pi", {
				"true-icon pi-check-circle": rowData.assurance,
				"false-icon pi-times-circle": !rowData.assurance,
			})}
		></i>
	);
};

export default function DowntimeLog() {
	const [visible, setVisible] = useState<boolean>(false);

	const data: DowntimeEntry[] = [
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: false,
			roll: 11,
			bonus: 9,
			dc: 20,
			details: "Example Data",
		},
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: true,
			bonus: 9,
			dc: 20,
			details: "Example Data",
		},
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: false,
			roll: 20,
			bonus: 9,
			dc: 20,
			details: "Example Data",
		},
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: false,
			roll: 1,
			bonus: 9,
			dc: 20,
			details: "Example Data",
		},
	];

	return (
		<div className="downtime-root">
			<div className="downtime-header">
				<Button
					severity="success"
					icon="pi pi-plus"
					rounded
					onClick={(e) => setVisible(true)}
				/>
			</div>
			<NewDowntimeEntry visible={visible} setVisible={setVisible} />
			<DataTable
				value={data}
				tableStyle={{ minWidth: "50rem" }}
				stripedRows
				paginator
				rows={20}
				rowsPerPageOptions={[20, 50, 100]}
			>
				<Column
					field="date"
					header="Date"
					body={(e) => `${e.date.getMonth() + 1}/${e.date.getDate()}`}
				/>
				<Column field="level" header="Level" body={(e) => e.level} />
				<Column field="assurance" header="Assurance" body={assuranceBodyTemplate} />
				<Column field="roll" header="Roll" body={(e) => e.roll} />
				<Column field="bonus" header="Bonus" body={(e) => e.bonus} />
				<Column
					field="total"
					header="Total"
					body={(e) => (e.assurance ? 10 : e.roll) + e.bonus}
				/>
				<Column field="dc" header="DC" body={(e) => e.dc} />
				<Column field="result" header="Result" body={resultTemplate} />
				<Column field="details" header="Additional Details" body={(e) => e.details} />
			</DataTable>
		</div>
	);
}

type NewDowntimeEntryProps = {
	visible: boolean;
	setVisible: (x: boolean) => void;
};

function NewDowntimeEntry({ visible, setVisible }: NewDowntimeEntryProps) {
	const [dc, setDC] = useState<number>(1);
	const [days, setDays] = useState<number>(1);
	const [details, setDetails] = useState<string>("");
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [data, setData] = useState<DayEntry[]>(
		Array.from({ length: 7 }, () => {
			return { assurance: false, bonus: 0 };
		})
	);

	const updateEntry = (i: number): ((d: DayEntry) => void) => {
		return (d: DayEntry): void => {
			var _data = [...data];
			_data[i] = d;
			setData(_data);
		};
	};

	return (
		<Dialog
			header="New Downtime Entry"
			style={{ width: "80vw", height: "85hw" }}
			visible={visible}
			onHide={() => setVisible(false)}
		>
			<div className="new-downtime-entry-root">
				<div className="new-downtime-label-set">
					<label htmlFor="end-date">End Date</label>
					<Calendar
						className="dt-input-width"
						id="end-date"
						value={endDate}
						onChange={(e) => {
							let d = Array.isArray(e.value) ? e.value[0] : e.value;
							setEndDate(new Date(d || ""));
						}}
					/>
				</div>
				<div className="new-downtime-label-set">
					<label htmlFor="days">Days</label>
					<InputNumber
						className="dt-input-width"
						id="days"
						value={days}
						onChange={(e) => setDays(e?.value ?? 1)}
						min={1}
						max={7}
						showButtons
					/>
				</div>
				<div className="new-downtime-label-set">
					<label htmlFor="dc">DC</label>
					<InputNumber
						className="dt-input-width"
						id="dc"
						value={dc}
						onChange={(e) => setDC(e.value ?? 1)}
						min={1}
						showButtons
					/>
				</div>
				<div className="new-downtime-label-set">
					<label htmlFor="details">Additional Details</label>
					<InputText
						className="dt-input-width"
						id="details"
						value={details}
						onChange={(e) => setDetails(e.target.value ?? "")}
					/>
				</div>
				{Array.from({ length: days }, (_, i) => {
					return (
						<>
							<Divider />
							<PerDayEntry
								key={`per-day-entry-${i}`}
								id={i}
								value={data[i]}
								setValue={updateEntry(i)}
								endDate={endDate}
							/>
						</>
					);
				})}
			</div>
		</Dialog>
	);
}

type DayEntry = {
	assurance: boolean;
	roll?: number;
	bonus: number;
};

function PerDayEntry({
	id,
	value,
	setValue,
	endDate,
}: {
	id: number;
	value: DayEntry;
	setValue: (i: DayEntry) => void;
	endDate: Date;
}) {
	if (!value) {
		return <></>;
	}

	return (
		<div className="new-downtime-per-day-entry">
			<h3>Day {formatDate(subDate(endDate, id))}</h3>
			<div className="new-downtime-label-set">
				<label htmlFor={`${id}-assurance`}>Assurance</label>
				<InputSwitch
					id={`${id}-assurance`}
					checked={value.assurance}
					onChange={(e: InputSwitchChangeEvent) => {
						value.assurance = e.value || false;
						setValue({ ...value });
					}}
				/>
			</div>
			<div className="new-downtime-label-set">
				<label htmlFor="roll">Roll</label>
				<InputNumber
					className="dt-input-width"
					id="roll"
					value={value.roll}
					onChange={(e) => {
						value.roll = e.value || 0;
						setValue({ ...value });
					}}
					min={1}
					max={20}
					showButtons
					disabled={value.assurance}
				/>
			</div>
			<div className="new-downtime-label-set">
				<label htmlFor={`${id}-bonus`}>Bonus</label>
				<InputNumber
					className="dt-input-width"
					id={`${id}-bonus`}
					value={value.bonus}
					onChange={(e) => {
						value.bonus = e.value || 0;
						setValue({ ...value });
					}}
					showButtons
				/>
			</div>
		</div>
	);
}
