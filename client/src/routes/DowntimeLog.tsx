import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
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

const resultTemplate = (r: DowntimeEntry) => {
	if (!r || !r.dc || !r.bonus) {
		return <></>;
	}
	var tagColor: "danger" | "warning" | "success" | "info" | null | undefined = undefined;
	var tagLabel: string = "";
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

	switch (level) {
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
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: false,
			roll: 20,
			bonus: 9,
			dc: 20,
			details: "Example Data",
		},
		{
			date: new Date(),
			level: 5,
			activity: "Earn Income",
			assurance: false,
			roll: 1,
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
				<Column field="result" header="Result" body={resultTemplate} />
				<Column field="details" header="Additional Details" body={(e) => e.details} />
			</DataTable>
		</div>
	);
}
