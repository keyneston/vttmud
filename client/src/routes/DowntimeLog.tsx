import { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { useParams } from "react-router-dom";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Tag } from "primereact/tag";

import { createDowntimeEntries, listDowntimeEntries, DowntimeEntry, Activity } from "../api/downtime";
import { subDate, formatDate } from "../date";
import "./DowntimeLog.scss";

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

const activities = [
	Activity.EarnIncome,
	Activity.Perform,
	Activity.Craft,
	Activity.GatherResources,
	Activity.LearnASpell,
	Activity.Retraining,
];

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

const activityTemplate = (activity: Activity) => {
	var tagLabel = activity as string;
	var tagColor: string = "green";

	switch (activity) {
		case Activity.GatherResources:
			tagColor = "green";
			break;
		case Activity.Perform:
			tagColor = "#ef476f";
			break;
		case Activity.Craft:
			tagColor = "#ffd166";
			break;
		case Activity.EarnIncome:
			tagColor = "#06d6a0";
			break;
		case Activity.LearnASpell:
			tagColor = "#118ab2";
			break;
		case Activity.Retraining:
			tagColor = "#073b4c";
			break;
		case Activity.Unknown:
			tagColor = "#ef233c";
			break;
		default:
			activity satisfies never;
	}

	return <Tag value={tagLabel} style={{ background: tagColor }} />;
};

export default function DowntimeLog() {
	const [visible, setVisible] = useState<boolean>(false);
	const [data, setData] = useState<DowntimeEntry[]>([]);

	const urlParams = useParams();
	const id: number = parseInt(urlParams.id || "0");

	useEffect(() => {
		listDowntimeEntries(id).then((d: DowntimeEntry[]) => setData(d));
	}, [listDowntimeEntries]);

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
				<Column field="activity" header="Activity" body={(e) => activityTemplate(e.activity)} />
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

type FormikDowntimeEntry = {
	endDate: Date;
	days: number;
	dc: number;
	details: string;
	entries: DayEntry[];
	activity: string;
	level: number;
};

function NewDowntimeEntry({ visible, setVisible }: NewDowntimeEntryProps) {
	const urlParams = useParams();
	const id: number = parseInt(urlParams.id || "0");
	const formik = useFormik<FormikDowntimeEntry>({
		initialValues: {
			endDate: new Date(),
			days: 1,
			dc: 20,
			details: "",
			activity: "Earn Income",
			level: 1,
			entries: Array.from({ length: 7 }, () => {
				return { assurance: false, bonus: 0, roll: 0 };
			}),
		},
		validate: (data) => {
			let errors: FormikErrors<FormikValues> = {};

			if (data.days > 7 || data.days < 1) {
				errors.days = "Days must be between 1-7";
			}

			if (!data.activity) {
				errors.activity = "Activity must be set";
			}

			return errors;
		},
		onSubmit: async (data) => {
			// munge the data:
			const entries = Array.from({ length: data.days }, (_, i) => {
				return {
					date: subDate(data.endDate, i),
					dc: data.dc,
					roll: data.entries[i].assurance ? null : data.entries[i].roll,
					assurance: data.entries[i].assurance,
					bonus: data.entries[i].bonus,
					details: data.details,
					activity: data.activity,
					level: data.level,
				} as DowntimeEntry;
			});

			createDowntimeEntries(id, entries);

			setVisible(false);
			formik.resetForm();
		},
	});

	const updateEntry = (i: number): ((d: DayEntry) => void) => {
		return (d: DayEntry): void => {
			var _data = [...formik.values.entries];
			_data[i] = d;
			formik.setFieldValue("entries", _data);
		};
	};

	return (
		<Dialog
			header="New Downtime Entry"
			style={{ width: "80vw", height: "85hw" }}
			visible={visible}
			onHide={() => setVisible(false)}
		>
			<form onSubmit={formik.handleSubmit}>
				<div className="new-downtime-entry-root">
					<div className="new-downtime-label-set">
						<label htmlFor="end-date">End Date</label>
						<Calendar
							className="dt-input-width"
							id="end-date"
							value={formik.values.endDate}
							onChange={(e) => {
								let d = Array.isArray(e.value) ? e.value[0] : e.value;
								formik.setFieldValue("endDate", new Date(d || ""));
							}}
						/>
					</div>
					<div className="new-downtime-label-set">
						<label htmlFor="days">Days</label>
						<InputNumber
							className="dt-input-width"
							id="days"
							value={formik.values.days}
							onChange={(e) => formik.setFieldValue("days", e?.value ?? 1)}
							min={1}
							max={7}
							showButtons
						/>
					</div>
					<div className="new-downtime-label-set">
						<label htmlFor="days">Level</label>
						<InputNumber
							className="dt-input-width"
							id="level"
							value={formik.values.level}
							onChange={(e) => formik.setFieldValue("level", e?.value ?? 1)}
							min={1}
							max={20}
							showButtons
						/>
					</div>
					<div className="new-downtime-label-set">
						<label htmlFor="dc">DC</label>
						<InputNumber
							className="dt-input-width"
							id="dc"
							value={formik.values.dc}
							onChange={(e) => formik.setFieldValue("dc", e.value ?? 20)}
							min={1}
							showButtons
						/>
					</div>
					<div className="new-downtime-label-set">
						<label htmlFor="activity">Activity</label>
						<Dropdown
							id="activity"
							value={formik.values.activity}
							onChange={(e) => formik.setFieldValue("activity", e.value)}
							options={activities}
							placeholder="Select an Activity"
							valueTemplate={activityTemplate}
							itemTemplate={activityTemplate}
							className="w-full md:w-14rem"
							style={{ width: "12rem" }}
						/>
					</div>
					<div className="new-downtime-label-set">
						<label htmlFor="details">Additional Details</label>
						<InputText
							className="dt-input-width"
							id="details"
							value={formik.values.details}
							onChange={(e) =>
								formik.setFieldValue("details", e.target.value ?? "")
							}
						/>
					</div>
					{Array.from({ length: formik.values.days }, (_, i) => {
						return (
							<>
								<Divider />
								<PerDayEntry
									key={`per-day-entry-${i}`}
									id={i}
									value={formik.values.entries[i]}
									setValue={updateEntry(i)}
									endDate={formik.values.endDate}
								/>
							</>
						);
					})}

					<Button
						label="Record"
						type="submit"
						severity="success"
						icon="pi pi-file-edit"
					/>
				</div>
			</form>
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
