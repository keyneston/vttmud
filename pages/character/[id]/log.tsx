import { useRouter } from "next/router";
import { useFormik, FormikValues, FormikErrors } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { ReactNode } from "react";
import { money2string, Gold } from "api/items";
import { updateLog, getLog, CharacterLogEntry, fetchCharacter } from "api/characters";
import { GoldEntry } from "components/GoldEntry";
import { ExperienceEntry } from "components/ExperienceEntry";
import { changeLogEntry } from "api/characters";
import { CharacterAvatar } from "components/CharacterAvatar";
import dayjs from "dayjs";

import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

import styles from "./log.module.scss";

const goldEditor = (options: any) => {
	return (
		<InputNumber
			value={options.value}
			onValueChange={(e: any) => options.editorCallback(e.value)}
			mode="currency"
			currency="EUR"
			locale="en-US"
		/>
	);
};

const textEditor = (options: any) => {
	return (
		<InputText
			type="text"
			value={options.value}
			onChange={(e: any) => options.editorCallback(e.target.value)}
		/>
	);
};

const experienceEditor = (options: any) => {
	return <InputNumber value={options.value} onChange={(e: any) => options.editorCallback(e.value)} />;
};

export default function CharacterLog() {
	const datatable = useRef(null);
	const params = useRouter().query;
	const queryClient = useQueryClient();

	const [visible, setVisible] = useState(false);
	const [filename, setFilename] = useState("character-log");

	useEffect(() => {
		setFilename(`character-log-${dayjs().format("YYYY-MM-DD")}`);
	});

	const id = parseInt(params.id || "0");

	const { data } = useQuery({
		queryKey: ["character", id, "log"],
		queryFn: () => getLog(id),
		placeholderData: [],
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
	const logEntries: CharacterLogEntry[] = useMemo(() => {
		return data || [];
	}, [data]);

	const character = useQuery({
		queryFn: () => fetchCharacter(id),
		queryKey: ["character", id],
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const formatDate = (e: CharacterLogEntry): ReactNode => {
		if (!e.createdAt) {
			return "";
		}
		const createdAt = new Date(e.createdAt);

		return `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}-${createdAt.getDate()}`;
	};

	const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
		await changeLogEntry({
			id: e.newData.id,
			characterID: e.newData.characterID,
			spend: e.newData.spend,
			description: e.newData.description,
			gold: e.newData.gold,
			experience: e.newData.experience,
		});

		queryClient.invalidateQueries(["character", id]);
	};

	const exportCSV = (selectionOnly) => {
		datatable.current.exportCSV({ selectionOnly });
	};

	const header = (
		<div className={styles.log_header}>
			<div className={styles.log_header_left}>
				<CharacterAvatar character={character.data} />
				<p>
					<strong>Gold:</strong> {money2string(character?.data?.gold || 0)}
				</p>
			</div>
			<div className={styles.log_header_right}>
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
						icon="pi pi-plus"
						severity="success"
						raised
						rounded
						onClick={() => setVisible(true)}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div className={styles.character_log}>
				<Dialog
					header="Log New Income/Expense"
					visible={visible}
					style={{ width: "70vw" }}
					breakpoints={{ "960px": "100vw", "641px": "120vw" }}
					onHide={() => {
						setVisible(false);
					}}
				>
					<NewEntry id={id} setVisible={setVisible} />
				</Dialog>

				<DataTable
					className={styles.character_log}
					value={logEntries}
					tableStyle={{ minWidth: "50rem" }}
					stripedRows
					paginator
					rows={20}
					rowsPerPageOptions={[20, 50, 100]}
					editMode="row"
					dataKey="id"
					onRowEditComplete={onRowEditComplete}
					header={header}
					ref={datatable}
					exportFilename={filename}
				>
					<Column field="date" header="Date" body={formatDate} />
					<Column
						field="gold"
						header="Money"
						body={(e) => money2string(e.gold)}
						editor={goldEditor}
					/>
					<Column
						field="experience"
						header="Experience"
						body={(e) => (e.experience !== 0 ? e.experience : "")}
						editor={experienceEditor}
					/>
					<Column
						field="description"
						header="Description"
						body={(e) => e.description}
						editor={textEditor}
					/>
					<Column
						rowEditor
						headerStyle={{ width: "10%", minWidth: "8rem" }}
						bodyStyle={{ textAlign: "center" }}
					></Column>
				</DataTable>
			</div>
		</>
	);
}

function NewEntry({ id, setVisible }: { id: number; setVisible: (visible: boolean) => void }) {
	const [money, setMoney] = useState<Gold>({ spend: false });
	const queryClient = useQueryClient();

	const formik = useFormik({
		initialValues: {
			characterID: id,
			gold: 0,
			silver: 0,
			copper: 0,
			spend: false,
			experience: 0,
			description: "",
		},
		validate: (data) => {
			let errors: FormikErrors<FormikValues> = {};
			return errors;
		},
		onSubmit: async (data) => {
			await updateLog(data);
			queryClient.invalidateQueries(["character", id]);

			setVisible(false);
			formik.resetForm();
			setVisible(false);
		},
	});

	return (
		<>
			<div className={styles.new_entry}>
				<form onSubmit={formik.handleSubmit}>
					<div className={styles.field}>
						<span className={styles.p_float_label}>
							<InputText
								id="description"
								style={{ width: "100%" }}
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
							<label htmlFor="description">Description</label>
						</span>
					</div>
					<div className={styles.le_gold_entry}>
						<GoldEntry
							value={money}
							setValue={(g: Gold) => {
								formik.values.spend = g.spend;
								formik.values.gold = g.gold || 0;
								formik.values.silver = g.silver || 0;
								formik.values.copper = g.copper || 0;
								setMoney(g);
							}}
						/>
					</div>
					<div className={styles.le_experience_entry}>
						<ExperienceEntry
							value={formik.values.experience}
							onChange={(value) => {
								formik.values["experience"] = value || 0;
							}}
						/>
					</div>

					<Button label="Record" type="submit" severity="success" />
				</form>
			</div>
		</>
	);
}
