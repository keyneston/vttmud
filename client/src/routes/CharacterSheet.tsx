import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Character, fetchCharacter, uploadAvatar } from "../api/characters";
import { money2string } from "../api/items";
import { CDN, MaximumImageSize } from "../constants";

import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Slider } from "primereact/slider";

import Cropper from "react-easy-crop";
import { getCroppedImg } from "../helpers/crop";

import "./CharacterSheet.scss";

export default function CharacterSheet() {
	const [edit, setEdit] = useState(false);
	const queryClient = useQueryClient();

	const urlParams = useParams();

	var id: number = parseInt(urlParams.id || "0");
	const { isLoading, data } = useQuery({
		queryKey: ["character", id],
		queryFn: () => fetchCharacter(id),
		cacheTime: 10 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	const chooseOptions = {
		icon: "pi pi-fw pi-upload",
		className: "p-button-info",
		style: { display: "flex" },
	};

	return (
		<div className="cs-root justify-end">
			{isLoading && "Loading"} {data && <DisplayCharacter character={data} edit={edit} />}
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
					className="justify-stretch"
					onUpload={(e) => queryClient.invalidateQueries(["character", id])}
				/>
				<Button
					className="cs-blob-download-button"
					label="Download JSON"
					icon="pi pi-download"
					style={{ height: "3rem" }}
					disabled={!data?.blob}
					onClick={(e) => {
						const json = JSON.stringify(data!.blob, null, 4);
						const blob = new Blob([json], {
							type: "application/json",
						});
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a"); //

						a.setAttribute("href", url);
						a.setAttribute("download", `${data?.name || "character"}.json`);
						a.click();
					}}
				/>
			</div>
		</div>
	);
}

function DisplayCharacter({ character, edit }: { character: Character; edit: boolean }) {
	const queryClient = useQueryClient();
	const [showCropper, setShowCropper] = useState<boolean>(false);
	const [src, setSrc] = useState<string>("");
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
							customUpload={true}
							mode="basic"
							accept="image/*"
							maxFileSize={MaximumImageSize}
							chooseLabel="Change Avatar"
							onUpload={(e) =>
								queryClient.invalidateQueries([
									"character",
									character.id,
								])
							}
							chooseOptions={chooseOptions}
							onSelect={(e) => {
								e.originalEvent.preventDefault();
								setSrc(URL.createObjectURL(e.files[0]));
								setShowCropper(true);
							}}
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

				{showCropper && (
					<DoCropper id={character.id} src={src} setShowCropper={setShowCropper} />
				)}
			</div>
		</>
	);
}

function DoCropper({ id, src, setShowCropper }: { id: number; src: string; setShowCropper: (x: boolean) => void }) {
	const queryClient = useQueryClient();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);

	const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
		console.log({ croppedArea, croppedAreaPixels });
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	return (
		<>
			<div className="crop-container">
				<Cropper
					image={src}
					crop={crop}
					zoom={zoom}
					minZoom={1}
					maxZoom={3}
					zoomSpeed={0.5}
					aspect={1}
					onCropComplete={onCropComplete}
					onCropChange={setCrop}
					onZoomChange={setZoom}
					rotation={rotation}
					onRotationChange={setRotation}
					objectFit="auto-cover"
				/>
			</div>
			<div className="controls">
				<div>
					<Slider
						value={zoom}
						onChange={(e) => {
							let d = Array.isArray(e.value) ? e.value[0] : e.value;
							setZoom(d);
						}}
						min={1}
						max={3}
						step={0.1}
						style={{ width: "8rem" }}
						aria-labelledby="Zoom"
					/>
				</div>
				<div>
					<Slider
						id="rotation-slider"
						value={rotation}
						onChange={(e) => {
							let d = Array.isArray(e.value) ? e.value[0] : e.value;
							setRotation(d);
						}}
						min={1}
						max={360}
						step={1}
						style={{ width: "8rem" }}
						aria-labelledby="Zoom"
					/>
				</div>
				<div>
					<Button
						icon="pi pi-cross"
						label="Cancel"
						severity="danger"
						onClick={async (e) => {
							setShowCropper(false);
						}}
					/>
				</div>
				<div>
					<Button
						label="Done"
						onClick={async (e) => {
							var croppedSrc = await getCroppedImg(
								src,
								croppedAreaPixels,
								rotation
							);
							const fileRes = await fetch(croppedSrc);
							const blob = await fileRes.blob();
							await uploadAvatar(id, blob);
							queryClient.invalidateQueries(["character", id]);
							queryClient.invalidateQueries(["listCharacters"]);

							setShowCropper(false);
						}}
					/>
				</div>
			</div>
		</>
	);
}
