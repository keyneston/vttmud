import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Character, fetchCharacter } from "../api/characters";
import { money2string } from "../api/items";
import { CDN, MaximumImageSize } from "../constants";

import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { parseBlob } from "../blob";

import "./CharacterSheet.scss";

export default function CharacterSheet() {
	const [data, setData] = useState<Character | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [edit, setEdit] = useState(false);
	const urlParams = useParams();

	const fetchData = async () => {
		var id: string = urlParams.id || "";
		var data = await fetchCharacter(id);
		setData(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [urlParams]);

	const chooseOptions = {
		icon: "pi pi-fw pi-upload",
		className: "p-button-info",
	};

	return (
		<div className="cs-root justify-end">
			{loading && "Loading"}{" "}
			{data && <DisplayCharacter character={data} edit={edit} refresh={fetchData} />}
			<div className="cs-button-collection justify-end">
				<Button
					className="cs-edit-button"
					label={edit ? "Save" : "Edit"}
					severity={edit ? "success" : "warning"}
					icon="pi pi-user-edit"
					style={{ height: "3rem" }}
					onClick={(e) => {
						setEdit(!edit);
					}}
				/>
				<FileUpload
					auto
					mode="basic"
					name="json"
					url={`/api/v1/upload/${data?.id}/json`}
					accept="application/json"
					maxFileSize={MaximumImageSize}
					chooseLabel="Upload JSON"
					chooseOptions={chooseOptions}
				/>
			</div>
		</div>
	);
}

function DisplayCharacter({ character, edit, refresh }: { character: Character; edit: boolean; refresh: () => void }) {
	const imageMissing = (
		<i className="pi pi-image cs-avatar-missing" style={{ fontSize: "8rem", color: "white" }} />
	);

	const avatar = (
		<img
			src={`${CDN}/${character.avatar}`}
			alt={`${character.name} avatar`}
			style={{ maxWidth: "400px", maxHeight: "400px" }}
		/>
	);
	const chooseOptions = {
		icon: "pi pi-fw pi-image",
		className: "p-button-info",
	};

	return (
		<>
			<div className="cs-root">
				<div className="cs-avatar-uploader">
					<div className="cs-avatar-holder">
						<div className="cs-avatar">
							{(character.avatar && avatar) || imageMissing}
						</div>
					</div>
					{edit && (
						<FileUpload
							auto
							mode="basic"
							name="character"
							url={`/api/v1/upload/${character.id}/avatar`}
							accept="image/*"
							maxFileSize={MaximumImageSize}
							chooseLabel="Change Avatar"
							onUpload={(e) => refresh()}
							chooseOptions={chooseOptions}
						/>
					)}
				</div>
				<div className="cs-headline-info">
					<h1>{character.name}</h1>
					<h3>
						Level {Math.floor(character.experience / 1000) + 1} — Exp{" "}
						{character.experience % 1000} / 1000
					</h3>
					<h3>{money2string(character.gold)}</h3>
					<h3>
						{"Server: "}
						{character?.server?.name ?? "unknown"}
					</h3>
				</div>
			</div>
		</>
	);
}
