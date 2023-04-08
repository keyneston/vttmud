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
					header="Header"
					visible={visible}
					style={{ width: "70vw" }}
					breakpoints={{ "960px": "100vw", "641px": "120vw" }}
					onHide={() => {
						setVisible(false);
					}}
				>
					{NewEntry()}
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

function NewEntry() {
	const [spend, setSpend] = useState<string>("+");
	const [posExp, setPosExp] = useState<string>("+");

	return (
		<>
			<div className="new-entry">
				<form action="/api/v1/log">
					<div>
						<span className="p-float-label">
							<InputText id="desc" style={{ width: "100%" }} />
							<label htmlFor="desc">description</label>
						</span>
					</div>
					<div className="money">
						<SelectButton
							value={spend}
							onChange={(e) => setSpend(e.value)}
							options={["-", "+"]}
							unselectable={false}
						/>
						<span className="p-float-label">
							<InputNumber className="money-input" id="gold" />
							<label htmlFor="gold">Gold</label>
						</span>
						<span className="p-float-label">
							<InputNumber className="money-input" id="silver" />
							<label htmlFor="silver">Silver</label>
						</span>
						<span className="p-float-label">
							<InputNumber className="money-input" id="copper" />
							<label htmlFor="copper">Copper</label>
						</span>
					</div>

					<div className="exp">
						<SelectButton
							value={posExp}
							onChange={(e) => setPosExp(e.value)}
							options={["-", "+"]}
							unselectable={false}
						/>
						<span className="p-float-label">
							<InputNumber className="exp-input" id="exp" />
							<label htmlFor="exp">Experience</label>
						</span>
					</div>
					<Button label="Submit" severity="success" />
				</form>
			</div>
		</>
	);
}

export {};
