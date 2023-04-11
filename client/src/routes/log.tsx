import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { sumGold, Gold, formatGold } from "../api/items";
import "./log.scss";

export default function CharacterLog() {
	const urlParams = useParams();
	const [visible, setVisible] = useState(false);

	var products = [
		{ date: "4/16", gold: { gp: 50 }, exp: 500, desc: "Ran dungeon Foo" },
		{ date: "4/17", gold: { gp: 7 }, exp: null, desc: "Bought sugar" },
	];

	var sum: Gold = sumGold(
		...products.map((e): Gold => {
			return e.gold;
		})
	);

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
					<NewEntry id={urlParams.id || "0"} setVisible={setVisible} />
				</Dialog>

				<DataTable
					className="character-log"
					value={products}
					tableStyle={{ minWidth: "50rem" }}
					stripedRows
					paginator
					rows={20}
					rowsPerPageOptions={[20, 50, 100]}
				>
					<Column field="date" header="Date" />
					<Column field="money" header="Money" body={(e) => formatGold(e.gold)} />
					<Column field="exp" header="Experience" />
					<Column field="desc" header="Description" />
				</DataTable>
			</div>
		</>
	);
}

function NewEntry({ id, setVisible }: { id: number | string; setVisible: (visible: boolean) => void }) {
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
			description: undefined,
		},
		validate: (data) => {
			let errors: FormikErrors<FormikValues> = {};

			return errors;
		},
		onSubmit: async (data) => {
			var results = await fetch(`/api/v1/character/${id}/log`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}).then((d) => {
				return d.json();
			});

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
								id="desc"
								style={{ width: "100%" }}
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
							<label htmlFor="desc">Description</label>
						</span>
					</div>
					<div className="money">
						<SelectButton
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
