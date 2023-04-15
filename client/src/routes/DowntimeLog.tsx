import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";

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

export default function DowntimeLog() {
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

	return (
		<div className="downtime-root">
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
				<Column field="details" header="Additional Details" body={(e) => e.details} />
			</DataTable>
		</div>
	);
}
