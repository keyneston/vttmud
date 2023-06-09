import { Fragment, useState, useMemo, useReducer, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { classNames } from "primereact/utils";
import { useFormik, FormikValues, FormikErrors } from "formik";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Panel } from "primereact/panel";
import { Tag } from "primereact/tag";

import {
	createDowntimeEntries,
	listDowntimeEntries,
	updateDowntimeEntry,
	DowntimeEntry,
	Activity,
	ActivityColors,
} from "api/downtime";

import { CharacterAvatar } from "components/CharacterAvatar";
import { fetchCharacter, calculateLevel } from "api/characters";
import { subDate, formatDate } from "utils/date";
import { craftDC } from "utils/pf2e/income";
import styles from "./downtime.module.scss";

const chartWidth = 20;
const chartPanelWidth = 23;
const chartGap = 2;

const calculateSuccess = function (r: DowntimeEntry): number {
	let level = 2;

	const dc = r.dc ?? 0;
	const bonus = r.bonus ?? 0;
	const roll = r.roll ?? 1;

	const total = (r.assurance ? 10 : roll) + bonus;
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
	let tagColor: "danger" | "warning" | "success" | "info" | null | undefined = undefined;
	let tagLabel = "";

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
	Activity.Other,
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
	const tagLabel = activity as string;
	const tagColor: string = ActivityColors.get(activity) || "green";

	return <Tag value={tagLabel} style={{ background: tagColor }} />;
};

const textEditor = (options: any) => {
	return (
		<InputText
			type="text"
			value={options.value}
			onChange={(e: any) => options.editorCallback(e.target.value)}
			className={styles.dt_input_width}
		/>
	);
};

const numberEditor = (options: any) => {
	return (
		<InputNumber
			value={options.value}
			onValueChange={(e: any) => options.editorCallback(e.value)}
			className={styles.dt_input_width}
		/>
	);
};

const levelEditor = (options: any) => {
	return (
		<InputNumber
			value={options.value}
			max={20}
			min={1}
			onValueChange={(e: any) => options.editorCallback(e.value)}
			className={styles.dt_input_width}
		/>
	);
};

const assuranceEditor = (options: any) => {
	return (
		<InputSwitch
			id={`assurance`}
			checked={options.value}
			onChange={(e: InputSwitchChangeEvent) => {
				options.editorCallback(e.value);
			}}
		/>
	);
};

const activityEditor = (options: any) => {
	return (
		<Dropdown
			id="activity"
			value={options.value}
			onChange={(e) => options.editorCallback(e.value)}
			options={activities}
			placeholder="Select an Activity"
			valueTemplate={activityTemplate}
			itemTemplate={activityTemplate}
			className="w-full md:w-14rem"
			style={{ width: "12rem" }}
		/>
	);
};

const calendarEditor = (options: any) => {
	return (
		<Calendar
			style={{ width: "8rem" }}
			id="date"
			value={options.value}
			onChange={(e) => {
				const d = Array.isArray(e.value) ? e.value[0] : e.value;
				options.editorCallback(new Date(d || ""));
			}}
		/>
	);
};

export default function DowntimeLog() {
	const [visible, setVisible] = useState<boolean>(false);
	const datatable = useRef(null);
	const [filename, setFilename] = useState("character-downtime");

	useEffect(() => {
		setFilename(`character-downtime-${dayjs().format("YYYY-MM-DD")}`);
	});

	const queryClient = useQueryClient();
	const urlParams = useRouter().query;
	const id: number = parseInt(urlParams.id || "0");

	const entries = useQuery({
		queryKey: ["character", id, "downtime"],
		queryFn: () => listDowntimeEntries(id),
		placeholderData: [],
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
	const data = entries.data;

	const character = useQuery({
		queryKey: ["character", id],
		queryFn: () => fetchCharacter(id),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const mutation = useMutation({
		mutationFn: (data: DowntimeEntry) => {
			return updateDowntimeEntry(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["character", id]);
		},
	});

	const downtimeRemaining = (query: any) => {
		if (query.isLoading || query.isFetching) {
			return <i className="pi pi-spin pi-spinner" style={{ fontSize: "1rem" }}></i>;
		} else if (query.error) {
			return <small className="p-error">Error: {query.error.message}</small>;
		} else {
			return ` ${query.data?.remainingDowntime}`;
		}
	};

	const exportCSV = (selectionOnly) => {
		datatable.current.exportCSV({ selectionOnly });
	};

	const header = (
		<div className={styles.downtime_header}>
			<div className={styles.downtime_header_left}>
				<CharacterAvatar character={character?.data} />
				<p>
					<b>Downtime Remaining: </b>
					{downtimeRemaining(character)}
				</p>
			</div>
			<div className={styles.downtime_header_right}>
				<div>
					<Button
						type="button"
						icon="pi pi-file"
						rounded
						onClick={() => exportCSV(false)}
						data-pr-tooltip="CSV"
					/>
				</div>
				<div>
					<Button
						severity="success"
						icon="pi pi-plus"
						rounded
						onClick={(e) => setVisible(true)}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className={styles.downtime_root}>
			<NewDowntimeEntry visible={visible} setVisible={setVisible} />
			<DataTable
				value={data}
				tableStyle={{ minWidth: "50rem" }}
				stripedRows
				paginator
				rows={20}
				rowsPerPageOptions={[20, 50, 100]}
				onRowEditComplete={(e: DataTableRowEditCompleteEvent) => {
					mutation.mutate(e.newData as DowntimeEntry);
				}}
				editMode="row"
				header={header}
				ref={datatable}
				exportFilename={filename}
			>
				<Column
					field="date"
					header="Date"
					body={(e) => `${e.date.getMonth() + 1}/${e.date.getDate()}`}
					editor={calendarEditor}
				/>
				<Column field="level" header="Level" body={(e) => e.level} editor={levelEditor} />
				<Column
					field="assurance"
					header="Assurance"
					body={assuranceBodyTemplate}
					editor={assuranceEditor}
				/>
				<Column
					field="activity"
					header="Activity"
					body={(e) => activityTemplate(e.activity)}
					editor={activityEditor}
				/>
				<Column field="roll" header="Roll" body={(e) => e.roll} editor={numberEditor} />
				<Column field="bonus" header="Bonus" body={(e) => e.bonus} editor={numberEditor} />
				<Column
					field="total"
					header="Total"
					body={(e) => (e.assurance ? 10 : e.roll) + e.bonus}
				/>
				<Column field="dc" header="DC" body={(e) => e.dc} editor={numberEditor} />
				<Column field="result" header="Result" body={resultTemplate} />
				<Column
					field="details"
					header="Additional Details"
					body={(e) => e.details}
					editor={textEditor}
				/>
				<Column
					rowEditor
					headerStyle={{ width: "10%", minWidth: "8rem" }}
					bodyStyle={{ textAlign: "center" }}
				/>
			</DataTable>
			<div className={styles.dt_charts}>
				<ActivityPieChart data={data || []} />
				<SuccessRatePieChart data={data || []} />
				<RollDistributionChart data={data || []} />
			</div>
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
	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	const queryClient = useQueryClient();
	const urlParams = useRouter().query;
	const id: number = parseInt(urlParams.id || "0");

	const char = useQuery({
		queryKey: ["character", id],
		queryFn: () => fetchCharacter(id),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
		onSuccess: (data) => {
			const level = calculateLevel(data?.experience || 0);
			formik.setFieldValue("level", level);
			formik.setFieldValue("dc", craftDC(level));
		},
	});

	const formik = useFormik<FormikDowntimeEntry>({
		initialValues: {
			endDate: new Date(),
			days: 1,
			dc: craftDC(calculateLevel(char?.data?.experience || 0)),
			details: "",
			activity: "Earn Income",
			level: calculateLevel(char?.data?.experience || 0),
			entries: Array.from({ length: 7 }, () => {
				return { assurance: false, bonus: 0, roll: 0 };
			}),
		},
		validate: (data) => {
			const errors: FormikErrors<FormikValues> = {};

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
			queryClient.invalidateQueries(["character", id, "downtime"]);
			queryClient.refetchQueries(["character", id, "downtime"]);

			setVisible(false);
			formik.resetForm();
		},
	});

	const updateEntry = (i: number): ((d: DayEntry) => void) => {
		return (d: DayEntry): void => {
			const _data = [...formik.values.entries];
			_data[i] = d;
			formik.setFieldValue("entries", _data);
		};
	};

	return (
		<Dialog
			header="New Downtime Entry"
			style={{ width: "80vw", height: "40rem" }}
			visible={visible}
			onHide={() => setVisible(false)}
		>
			<form onSubmit={formik.handleSubmit}>
				<div className={styles.new_downtime_entry_root}>
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="end-date">End Date</label>
						<Calendar
							style={{ width: "8rem" }}
							id="end-date"
							value={formik.values.endDate}
							onChange={(e) => {
								const d = Array.isArray(e.value) ? e.value[0] : e.value;
								formik.setFieldValue("endDate", new Date(d || ""));
							}}
						/>
					</div>
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="days">Days</label>
						<InputNumber
							className={styles.dt_input_width}
							id="days"
							value={formik.values.days}
							onChange={(e) => formik.setFieldValue("days", e?.value ?? 1)}
							min={1}
							max={7}
							showButtons
						/>
					</div>
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="days">Character Level</label>
						<InputNumber
							className={styles.dt_input_width}
							id="level"
							value={formik.values.level}
							onChange={(e) => formik.setFieldValue("level", e?.value ?? 1)}
							min={1}
							max={20}
							showButtons
						/>
					</div>
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="dc">DC</label>
						<InputNumber
							className={styles.dt_input_width}
							id="dc"
							value={formik.values.dc}
							onChange={(e) => formik.setFieldValue("dc", e.value ?? 20)}
							min={1}
							showButtons
						/>
					</div>
					<div className={styles.new_downtime_label_set}>
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
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="bonus">Bonus</label>
						<InputNumber
							id="bonus"
							showButtons
							className={styles.dt_input_width}
							onChange={(e) => {
								formik.values.entries.forEach(
									(_, i) =>
										(formik.values.entries[i].bonus =
											e.value || 0)
								);

								forceUpdate();
							}}
						/>
					</div>
					<div className={styles.new_downtime_label_set}>
						<label htmlFor="details">Additional Details</label>
						<InputText
							className={styles.dt_input_width}
							id="details"
							value={formik.values.details}
							onChange={(e) =>
								formik.setFieldValue("details", e.target.value ?? "")
							}
						/>
					</div>
					{Array.from({ length: formik.values.days }, (_, i) => {
						return (
							<Fragment key={`per-day-entry-div-${i}`}>
								<PerDayEntry
									key={`per-day-entry-${i}`}
									id={i}
									value={formik.values.entries[i]}
									setValue={updateEntry(i)}
									endDate={formik.values.endDate}
								/>
							</Fragment>
						);
					})}

					<div className={styles.new_dt_bottom_right}>
						<Button
							label="Record"
							type="submit"
							severity="success"
							icon="pi pi-file-edit"
							style={{ height: "3rem" }}
						/>
					</div>
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
		<div className={styles.new_downtime_per_day_entry}>
			<h3>Day {formatDate(subDate(endDate, id))}</h3>
			<div className={styles.new_downtime_label_set}>
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
			<div className={styles.new_downtime_label_set}>
				<label htmlFor="roll">Roll</label>
				<InputNumber
					className={styles.dt_input_width}
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
			<div className={styles.new_downtime_label_set}>
				<label htmlFor={`${id}-bonus`}>Bonus</label>
				<InputNumber
					className={styles.dt_input_width}
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

function ActivityPieChart({ data }: { data: DowntimeEntry[] }) {
	const activityCounts = useMemo(() => {
		const activityCounts: { [key: string]: number } = {};
		data.forEach((x) => {
			activityCounts[x.activity] = 1 + (activityCounts[x.activity] || 0);
		});
		return activityCounts;
	}, [data]);

	const chartData = {
		labels: [
			Activity.Retraining,
			Activity.LearnASpell,
			Activity.EarnIncome,
			Activity.Craft,
			Activity.Perform,
			Activity.GatherResources,
			Activity.Other,
			"Unknown",
		],
		datasets: [
			{
				data: [
					activityCounts[Activity.Retraining],
					activityCounts[Activity.LearnASpell],
					activityCounts[Activity.EarnIncome],
					activityCounts[Activity.Craft],
					activityCounts[Activity.Perform],
					activityCounts[Activity.GatherResources],
					activityCounts[Activity.Other],
					activityCounts[Activity.Unknown],
				],
				backgroundColor: [
					ActivityColors.get(Activity.Retraining),
					ActivityColors.get(Activity.LearnASpell),
					ActivityColors.get(Activity.EarnIncome),
					ActivityColors.get(Activity.Craft),
					ActivityColors.get(Activity.Perform),
					ActivityColors.get(Activity.GatherResources),
					ActivityColors.get(Activity.Other),
					ActivityColors.get(Activity.Unknown),
				],
			},
		],
	};

	return (
		<Panel header="Activity Type" style={{ width: `${chartPanelWidth}rem` }}>
			<Chart
				type="pie"
				data={chartData}
				className=""
				style={{ width: `${chartWidth}rem`, height: `${chartWidth}rem` }}
			/>
		</Panel>
	);
}

function SuccessRatePieChart({ data }: { data: DowntimeEntry[] }) {
	const successRate = useMemo(() => {
		const successRate: number[] = [0, 0, 0, 0];
		data.forEach((x) => {
			const rate = calculateSuccess(x);
			successRate[4 - rate] += 1;
		});
		return successRate;
	}, [data]);

	const chartData = {
		labels: ["Critical Success", "Success", "Failure", "Critical Failure"],
		datasets: [
			{
				data: successRate,
				backgroundColor: ["#0288D1", "#689F38", "#FBC02D", "#D32F2F"],
			},
		],
	};

	return (
		<Panel header="Success Rate" style={{ width: `${chartPanelWidth}rem` }}>
			<Chart
				type="pie"
				data={chartData}
				className=""
				style={{ width: `${chartWidth}rem`, height: `${chartWidth}rem` }}
			/>
		</Panel>
	);
}

function RollDistributionChart({ data }: { data: DowntimeEntry[] }) {
	const rollRate = useMemo(() => {
		const rollRate: number[] = Array.from({ length: 20 }, () => 0);
		data.forEach((x) => {
			if (!x.roll || x.assurance || x.roll === 0) {
				return;
			}

			rollRate[x.roll - 1] += 1;
		});
		return rollRate;
	}, [data]);

	const chartData = {
		labels: Array.from({ length: 20 }, (_, i) => {
			return i + 1;
		}),
		datasets: [
			{
				label: "Rolls",
				data: rollRate,
				backgroundColor: ["#0288D1"],
			},
		],
	};

	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<Panel header="Roll Distribution" style={{ width: `${chartPanelWidth * 2 + chartGap}rem` }}>
			{/* width is equal to 2x normal width, plus 2rem for the gap */}
			<Chart
				type="bar"
				options={options}
				data={chartData}
				className=""
				style={{ width: `${chartWidth * 2 + chartGap}rem`, height: `${chartWidth}rem` }}
			/>
		</Panel>
	);
}
