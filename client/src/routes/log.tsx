import { useFormik, FormikValues, FormikErrors } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ReactNode } from "react";
import { money2string, Gold } from "../api/items";
import { updateLog, getLog, CharacterLogEntry } from "../api/characters";
import { GoldEntry } from "../components/GoldEntry";
import { ExperienceEntry } from "../components/ExperienceEntry";
import { changeLogEntry } from "../api/characters";

import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

import "./log.scss";

export default function CharacterLog() {
	const urlParams = useParams();
	const queryClient = useQueryClient();
	const [visible, setVisible] = useState(false);

	const id = parseInt(urlParams.id || "0");

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

	var sum = useMemo(() => {
		var newSum: number = 0;
		logEntries.forEach((e) => {
			newSum = +(e.gold || 0) + +newSum;
		});
		return newSum;
	}, [logEntries]);

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

	return (
		<>
			<div className="log-header">
				<div className="log-header-left">
					<p>
						<strong>Sum Gold:</strong> {money2string(sum)}
					</p>
				</div>
				<div className="log-header-right">
					<Button
						icon="pi pi-plus"
						severity="success"
						raised
						rounded
						onClick={() => setVisible(true)}
					/>
				</div>
			</div>

			<div className="character-log">
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
					className="character-log"
					value={logEntries}
					tableStyle={{ minWidth: "50rem" }}
					stripedRows
					paginator
					rows={20}
					rowsPerPageOptions={[20, 50, 100]}
					editMode="row"
					dataKey="id"
					onRowEditComplete={onRowEditComplete}
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
	const navigate = useNavigate();
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
			navigate(`/character/${id}/log`);
		},
	});

	return (
		<>
			<div className="new-entry">
				<form onSubmit={formik.handleSubmit}>
					<div className="field">
						<span className="p-float-label">
							<InputText
								id="description"
								style={{ width: "100%" }}
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
							<label htmlFor="description">Description</label>
						</span>
					</div>
					<div className="le-gold-entry">
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
					<div className="le-experience-entry">
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

export {};
