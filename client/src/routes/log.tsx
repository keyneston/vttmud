import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";

export default function CharacterLog() {
	var products = [
		{ date: "4/16", money: "2gp 5sp", exp: "500", desc: "Ran dungeon Foo" },
		{ date: "4/17", money: "-5gp", exp: "", desc: "Bought sugar" },
	];
	return (
		<>
			<div>TODO: Stuff here like create new entry</div>
			<Divider />
			<div className="character-log">
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
					<Column field="money" header="Money" />
					<Column field="exp" header="Experience" />
					<Column field="desc" header="Description" />
				</DataTable>
			</div>
		</>
	);
}

export {};
