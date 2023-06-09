import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState, useCallback, useMemo, ReactNode, Fragment } from "react";
import { router } from "next/router";
import * as api from "api/characters";
import Conditional from "components/Conditional";
import { money2string } from "api/items";
import { CDN, MaximumImageSize } from "utils/constants";
import { parseBlob, CharacterInfo, getSkillInfo, SkillInfo, Skill, ProficiencyRank, scoreToBonus } from "utils/blob";
import { AncestrySelector, HeritageSelector } from "components/AncestrySelector";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FileUpload } from "primereact/fileupload";
import { Slider } from "primereact/slider";
import { TabView, TabPanel } from "primereact/tabview";

import Cropper from "react-easy-crop";
import { getCroppedImg } from "utils/crop";
import DOMPurify from "dompurify";

import styles from "./index.module.scss";

export default function CharacterSheet() {
	const [edit, setEdit] = useState(false);
	const [src, setSrc] = useState<string>("");
	const [showCropper, setShowCropper] = useState<boolean>(false);

	const queryClient = useQueryClient();

	const urlParams = useRouter().query;
	const id: number = parseInt(urlParams.id || "0");

	const { isLoading, data } = useQuery({
		queryKey: ["character", id],
		queryFn: () => api.fetchCharacter(id),
		cacheTime: 10 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	const chooseOptions = {
		icon: "pi pi-fw pi-upload",
		className: "p-button-info",
		style: { display: "flex" },
	};

	const accept = () => {
		console.log(`deleting character: ${id}`);
		queryClient.invalidateQueries(["listCharacters"]);
		queryClient.invalidateQueries(["character", id]);
		api.deleteCharacter(id).then(() => {
			router.push("/");
		});
	};

	const confirmDelete = () => {
		confirmDialog({
			message: `Are you sure you want to delete ${data.name}?`,
			header: "Conrim Character Deletion",
			icon: "pi pi-exclamation-triangle",
			accept,
			reject: null,
		});
	};

	const formik = useFormik({
		initialValues: {
			ancestry: { id: "", name: "" },
			heritage: { id: "", name: "", ancestry: "" },
		},
		validate: (data) => {
			const errors: FormikErrors<FormikValues> = {};
			return errors;
		},
		onSubmit: async (data) => {
			await api.updateCharacter(id, { ancestry: data.ancestry.name, heritage: data.heritage.name });
			queryClient.invalidateQueries(["character", id]);
		},
	});

	return (
		<div className={styles.cs_root + " " + styles.justify_end}>
			{isLoading && "Loading"}{" "}
			{data && (
				<DisplayCharacter
					showCropper={showCropper}
					setShowCropper={setShowCropper}
					src={src}
					character={data}
					edit={edit}
					formik={formik}
				/>
			)}
			<div className={styles.cs_button_collection + " " + styles.justify_end}>
				<ConfirmDialog />
				<Button
					className={styles.cs_edit_button}
					label={edit ? "Save" : "Edit"}
					severity={edit ? "success" : "warning"}
					icon="pi pi-user-edit"
					style={{ height: "3rem" }}
					onClick={async (e) => {
						if (edit) {
							await formik.submitForm();
						}
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
					className={styles.justify_stretch}
					onUpload={(e) => queryClient.invalidateQueries(["character", id])}
				/>
				<Button
					className={styles.cs_blob_download_button}
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
				<Conditional show={edit}>
					<Button
						icon="pi pi-image"
						severity="info"
						label="Change Avatar"
						onClick={async (e) => {
							const input = document.createElement("input");
							input.setAttribute("type", "file");
							input.setAttribute("accept", "image/*");
							input.addEventListener("change", () => {
								if (!input.files) {
									return;
								}

								setSrc(URL.createObjectURL(input!.files[0]));
								setShowCropper(true);
							});
							input.click();
						}}
					/>
					<Button
						onClick={confirmDelete}
						icon="pi pi-times"
						label="Delete Character"
						severity="danger"
					/>
				</Conditional>
			</div>
		</div>
	);
}

function DisplayCharacter({
	character,
	edit,
	src,
	showCropper,
	setShowCropper,
	formik,
}: {
	character: api.Character;
	edit: boolean;
	src: string;
	showCropper: boolean;
	setShowCropper: (boolean) => void;
	formik: Formik;
}) {
	const imageMissing = (
		<i className={"pi pi-image " + styles.cs_avatar_missing} style={{ fontSize: "8rem", color: "white" }} />
	);

	const parsedBlob = useMemo(() => {
		return parseBlob(character.blob);
	}, [character.blob]);

	const avatar = (
		<img
			className={styles.cs_avatar}
			src={`${CDN}/${character.avatar}`}
			alt={`${character.name} avatar`}
			style={{ maxWidth: "400px", maxHeight: "400px" }}
		/>
	);

	return (
		<>
			<div className={styles.cs_root}>
				<div className={styles.cs_avatar_uploader}>
					<div className={styles.cs_avatar_holder}>
						<div className={styles.cs_avatar}>
							{(character.avatar && avatar) || imageMissing}
						</div>
					</div>
				</div>
				<div className={styles.cs_headline_info}>
					<h1>{character.name}</h1>
					<h3>
						Level {Math.floor(character.experience / 1000) + 1} — Exp{" "}
						{character.experience % 1000} / 1000
					</h3>
					<Conditional show={!edit}>
						<h3>
							{character.ancestry ?? "Unknown"} /{" "}
							{character.heritage ?? "Unknown"}
						</h3>
					</Conditional>
					<Conditional show={edit}>
						<div style={{ display: "flex", flexFlow: "row nowrap" }}>
							<AncestrySelector
								value={formik.values.ancestry}
								setValue={(e) => formik.setFieldValue("ancestry", e)}
							/>
							<HeritageSelector
								value={formik.values.heritage}
								setValue={(e) => formik.setFieldValue("heritage", e)}
								ancestry={formik.values.ancestry}
							/>
						</div>
					</Conditional>
					<h3>{money2string(character.gold)}</h3>
					<h3>
						{"Server: "}
						{character?.server?.name ?? "unknown"}
					</h3>
				</div>
				<div className={styles.cs_tab_menu}>
					<Card>
						<TabView>
							<TabPanel header="Stats">
								<StatsPanel data={parsedBlob} />
							</TabPanel>
							<TabPanel header="Details">
								<DetailsPanel data={parsedBlob} />
							</TabPanel>
						</TabView>
					</Card>
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
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	return (
		<>
			<div className={styles.crop_container}>
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
			<div className={styles.controls_background}>
				<div className={styles.controls}>
					<div>
						<Slider
							value={zoom}
							onChange={(e) => {
								const d = Array.isArray(e.value) ? e.value[0] : e.value;
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
								const d = Array.isArray(e.value) ? e.value[0] : e.value;
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
								const croppedSrc = await getCroppedImg(
									src,
									croppedAreaPixels,
									rotation
								);
								const fileRes = await fetch(croppedSrc);
								const blob = await fileRes.blob();
								await api.uploadAvatar(id, blob);
								queryClient.invalidateQueries(["character", id]);
								queryClient.invalidateQueries(["listCharacters"]);

								setShowCropper(false);
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

interface PanelProps {
	data: CharacterInfo | undefined;
}

function StatsPanel({ data }: PanelProps) {
	function calculateBonus(args: {
		level: number;
		skillInfo: SkillInfo;
		prof: ProficiencyRank;
		abilities: any;
	}): number {
		let bonus = 0;
		if (args.prof.id > 0) {
			bonus = args.level;
		}

		bonus += args.prof.bonus;
		const ability = args.abilities[args.skillInfo.ability];
		if (!ability) {
			console.log(`Can't find ability for ${args.skillInfo.name}: ${args.abilities}`);
			return bonus;
		}
		bonus += scoreToBonus(ability);
		return bonus;
	}

	const rows: ReactNode[] = useMemo(() => {
		if (!data) return [];

		const rows: ReactNode[] = [];
		data?.skills?.forEach((prof, s) => {
			const skillInfo = getSkillInfo(s as Skill);
			const bonus = calculateBonus({
				level: data.level,
				skillInfo: skillInfo,
				prof: prof || { id: 0, name: "", bonus: 0 },
				abilities: data.abilities,
			});

			rows.push(
				<Fragment key={`skill-${s}`}>
					<tr>
						<td>{skillInfo.name}</td>
						<td>{skillInfo.ability.toUpperCase()}</td>
						<td>{data?.skills?.get(s as Skill)?.name}</td>
						<td>
							{bonus >= 0 ? "+" : ""}
							{bonus}
						</td>
					</tr>
				</Fragment>
			);
		});
		return rows;
	}, [data]);

	if (!data) {
		// TODO: put something better here.
		return <div>Unavailable</div>;
	}

	return (
		<>
			<h3>This data is experimental and likely incorrect, please rely on foundry.</h3>
			<table>
				<thead>
					<tr>
						<th>Skill</th>
						<th>Ability</th>
						<th>Proficiency</th>
						<th>Modifier</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		</>
	);
}

function DetailsPanel({ data }: PanelProps) {
	const backstory = useMemo(() => DOMPurify.sanitize(data?.backstory || ""), [data]);
	const apperance = useMemo(() => DOMPurify.sanitize(data?.appearance || ""), [data]);

	if (!data) {
		return <div>Unavailable</div>;
	}

	return (
		<>
			<h3>Backstory</h3>
			<span dangerouslySetInnerHTML={{ __html: backstory }} />
			<h3>Appearance</h3>
			<span dangerouslySetInnerHTML={{ __html: apperance }} />
		</>
	);
}
