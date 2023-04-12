import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { ReactNode } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Gold, formatGold } from "../api/items";
import { updateLog, getLog, CharacterLogEntry } from "../api/characters";
import { GoldEntry } from "../components/GoldEntry";
import "./log.scss";

export default function CharacterLog() {
	const urlParams = useParams();
	const [visible, setVisible] = useState(false);
	const [logEntries, setLogEntries] = useState<CharacterLogEntry[]>([]);
	const [sum, setSum] = useState<Gold>({ spend: false });

	const id = parseInt(urlParams.id || "0");

	useEffect(() => {
		getLog(id).then((data: CharacterLogEntry[]) => {
			setLogEntries(data);
		});
	}, [id]);

	useEffect(() => {
		var newSum: Gold = { spend: false, gold: 0, silver: 0, copper: 0 };
		logEntries.forEach((e) => {
			newSum.gold! += (e.gold || 0) * (e.spend ? -1 : 1);
			newSum.silver! += (e.silver || 0) * (e.spend ? -1 : 1);
			newSum.copper! += (e.copper || 0) * (e.spend ? -1 : 1);
		});
		setSum(newSum);
	}, [id, logEntries]);

	const appendEntry = (logEntry: CharacterLogEntry) => {
		setLogEntries([logEntry, ...logEntries]);
	};

	const formatCharGold = (e: CharacterLogEntry): ReactNode => {
		if (!e.gold && !e.silver && !e.copper) {
			return "";
		}
		return `${e.spend ? "-" : ""}${e.gold || 0} gp ${e.silver || 0} sp ${e.copper || 0} cp`;
	};

	const formatDate = (e: CharacterLogEntry): ReactNode => {
		if (!e.createdAt) {
			return "";
		}
		const createdAt = new Date(e.createdAt);

		return `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}-${createdAt.getDate()}`;
	};

	// var sum: Gold = sumGold(
	// 	...products.map((e): Gold => {
	// 		return e.gold;
	// 	})
	// );

	return (
		<>
			<div className="log-header">
				<div className="log-header-left">
					<p>
						<strong>Sum Gold:</strong> {formatGold(sum)}
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
					<NewEntry id={id} setVisible={setVisible} appendEntry={appendEntry} />
				</Dialog>

				<DataTable
					className="character-log"
					value={logEntries}
					tableStyle={{ minWidth: "50rem" }}
					stripedRows
					paginator
					rows={20}
					rowsPerPageOptions={[20, 50, 100]}
				>
					<Column field="date" header="Date" body={formatDate} />
					<Column field="money" header="Money" body={formatCharGold} />
					<Column
						field="exp"
						header="Experience"
						body={(e) => (e.experience !== 0 ? e.experience : "")}
					/>
					<Column field="desc" header="Description" body={(e) => e.description} />
				</DataTable>
			</div>
		</>
	);
}

function NewEntry({
	id,
	setVisible,
	appendEntry,
}: {
	id: number;
	setVisible: (visible: boolean) => void;
	appendEntry: (x: CharacterLogEntry) => void;
}) {
	const [money, setMoney] = useState<Gold>({ spend: false });
	const [posExp, setPosExp] = useState<string>("+");
	const navigate = useNavigate();

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
			if (posExp === "-") {
				data.experience *= -1;
			}

			var results = await updateLog(data);
			appendEntry(results);

			setVisible(false);
			formik.resetForm();
			navigate(`/character/${id}/log`);
		},
	});

	const errors: { [key: string]: string } = formik.errors;
	const touched: FormikTouched<FormikValues> = formik.touched;
	const isFormFieldValid = (name: string) => !!(touched[name] && errors[name]);
	const getFormErrorMessage = (name: string) => {
		let error = errors[name];

		return isFormFieldValid(name) && <small className="p-error">{error}</small>;
	};

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
					<h2>Initial Money</h2>
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

					<div className="exp">
						<SelectButton
							options={["-", "+"]}
							unselectable={false}
							value={posExp}
							onChange={(e) => setPosExp(e.value)}
						/>
						<span className="p-float-label">
							<InputNumber
								className="exp-input"
								id="exp"
								min={0}
								value={formik.values.experience}
								onChange={(event) => {
									formik.values["experience"] = event.value || 0;
								}}
							/>
							<label htmlFor="exp">Experience</label>
						</span>
					</div>
					<Button label="Record" type="submit" severity="success" />
				</form>
			</div>
		</>
	);
}

export {};
