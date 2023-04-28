import { DataView, DataViewLayoutOptions } from "primereact/dataview";

export default function ShowServerCatalog() {
	const products = [];

	const charTemplate = (character: api.Character) => {
		return <>{character.name}</>;
	};

	return <DataView value={products} itemTemplate={charTemplate} />;
}
