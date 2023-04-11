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
import { sumGold, Gold, formatGold } from "../api/items";
import { updateLog, getLog, CharacterLogEntry } from "../api/characters";
import "./log.scss";

export default function CharacterLog() {
	const urlParams = useParams();
	const [visible, setVisible] = useState(false);
	const [logEntries, setLogEntries] = useState<CharacterLogEntry[]>([]);
	const [sum, setSum] = useState<Gold>({});

	const id = parseInt(urlParams.id || "0");

	useEffect(() => {
		getLog(id).then((data: CharacterLogEntry[]) => {
			setLogEntries(data);

			var newSum: Gold = { gp: 0, sp: 0, cp: 0 };
			data.forEach((e) => {
				newSum.gp! += (e.gold || 0) * (e.spend ? -1 : 1);
				newSum.sp! += (e.silver || 0) * (e.spend ? -1 : 1);
				newSum.cp! += (e.copper || 0) * (e.spend ? -1 : 1);
			});
			setSum(newSum);
		});
	}, []);

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
				>
					<Column field="date" header="Date" body={formatDate} />
					<Column field="money" header="Money" body={formatCharGold} />
					<Column
						field="exp"
						header="Experience"
						body={(e) => (e.experience != 0 ? e.experience : "")}
					/>
					<Column field="desc" header="Description" body={(e) => e.description} />
				</DataTable>
			</div>
		</>
	);
}

function NewEntry({ id, setVisible }: { id: number; setVisible: (visible: boolean) => void }) {
	const [spend, setSpend] = useState<string>("+");
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
			if (spend === "-") {
				data.spend = true;
			}

			var results = await updateLog(data);

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
					<div className="money">
						<SelectButton
							id="spend"
							options={["-", "+"]}
							unselectable={false}
							value={spend}
							onChange={(e) => setSpend(e.value)}
						/>
						<span className="p-float-label">
							<InputNumber
								className="money-input"
								id="gold"
								value={formik.values.gold}
								onChange={(event) => {
									formik.values["gold"] = event.value || 0;
								}}
							/>
							<label htmlFor="gold">Gold</label>
						</span>
						{getFormErrorMessage("gold")}
						<span className="p-float-label">
							<InputNumber
								className="money-input"
								id="silver"
								value={formik.values.silver}
								onChange={(event) => {
									formik.values["silver"] = event.value || 0;
								}}
							/>
							<label htmlFor="silver">Silver</label>
						</span>
						{getFormErrorMessage("silver")}
						<span className="p-float-label">
							<InputNumber
								className="money-input"
								id="copper"
								value={formik.values.copper}
								onChange={(event) => {
									formik.values["copper"] = event.value || 0;
								}}
							/>
							<label htmlFor="copper">Copper</label>
						</span>
						{getFormErrorMessage("copper")}
					</div>

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
