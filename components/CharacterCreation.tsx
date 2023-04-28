import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik, FormikValues, FormikErrors } from "formik";
import { useRouter } from "next/router";
import { GoldEntry } from "./GoldEntry";
import { Gold } from "api/items";
import { listServers, Server } from "api/characters";
import { AncestrySelector, HeritageSelector } from "components/AncestrySelector";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import styles from "./CharacterCreation.module.scss";

export default function CharacterCreation({
	visible = false,
	setVisible,
}: {
	visible: boolean;
	setVisible: (x: boolean) => void;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [money, setMoney] = useState<Gold>({ spend: false });
	const [server, setServer] = useState<Server>({ id: 0, name: "", discordID: "" });

	const { data } = useQuery({
		queryKey: ["listServers"],
		queryFn: () => listServers(),
		placeholderData: [],
		staleTime: 10 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
	const serverList = data || [];

	const formik = useFormik({
		initialValues: {
			character_name: "",
			spend: false,
			gold: 0,
			silver: 0,
			copper: 0,
			level: 1,
			ancestry: { name: "" },
			heritage: { name: "" },
			experience: 0,
			server: { id: 0, name: "", discordID: "" },
		},
		validate: (data) => {
			const errors: FormikErrors<FormikValues> = {};

			if (!data.character_name) {
				errors.character_name = "Character Name must not be blank";
			}

			if (!data.server || data.server.id === 0) {
				errors.server = "Server must be set";
			}

			if (!data.ancestry.name) {
				errors.ancestry = "Ancestry must be set";
			}

			if (!data.heritage.name) {
				errors.heritage = "Heritage must be set";
			}

			return errors;
		},
		onSubmit: async (data) => {
			const gold = (data.spend ? -1 : 1) * (data.gold + data.silver / 10 + data.copper / 100);
			const exp = (data.level - 1) * 1000 + data.experience;

			const jData = JSON.stringify({
				...data,
				gold: gold,
				spend: null,
				silver: null,
				copper: null,
				level: null,
				experience: exp,
				ancestry: data.ancestry.name,
				heritage: data.heritage.name,
			});

			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: jData,
			};

			const results = await fetch("/api/v1/character", requestOptions).then((d) => {
				return d.json();
			});

			queryClient.invalidateQueries(["listCharacters"]);

			router.push(`/character/${results.id}`);
			setVisible(false);

			formik.resetForm();
		},
	});

	const errors: { [key: string]: any } = formik.errors;
	const isFormFieldValid = (name: string) => !!errors[name];
	const getFormErrorMessage = (name: string) => {
		const error = errors[name];

		return isFormFieldValid(name) && <small className="p-error">{error}</small>;
	};

	return (
		<>
			<Dialog
				header="Character Creator"
				visible={visible}
				style={{ width: "60vw" }}
				onHide={() => {
					setVisible(false);
				}}
			>
				<form onSubmit={formik.handleSubmit} className="p-fluid">
					<div className={styles.cc_grid}>
						<div className={styles.cc_left_top}>
							<div>
								<span className="p-float-label p-input-icon-right">
									<InputText
										id="character_name"
										value={formik.values.character_name}
										onChange={formik.handleChange}
									/>
									<label htmlFor="character_name">
										Character Name
									</label>
								</span>
								{getFormErrorMessage("character_name")}
							</div>
							<div className={styles.ancestry_group}>
								<div style={{ width: "50%" }}>
									<AncestrySelector
										value={formik.values.ancestry}
										setValue={(e) => {
											formik.setFieldValue(
												"ancestry",
												e
											);
										}}
									/>
									{getFormErrorMessage("ancestry")}
								</div>
								<div style={{ width: "50%" }}>
									<HeritageSelector
										value={formik.values.heritage}
										setValue={(e) => {
											formik.setFieldValue(
												"heritage",
												e
											);
										}}
										ancestry={formik.values.ancestry}
									/>
									{getFormErrorMessage("heritage")}
								</div>
							</div>
						</div>
						<div className={styles.cc_center}></div>
						<div className={styles.cc_right}>
							<Dropdown
								id="server"
								name="server"
								value={server}
								placeholder="Select a Server"
								optionLabel="name"
								options={serverList}
								onChange={(e: DropdownChangeEvent) => {
									setServer(e.value);
									formik.setFieldValue("server", e.value, true);
								}}
							/>
							<div>{getFormErrorMessage("server")}</div>
						</div>

						<div className={styles.cc_left_center}>
							<h2>Initial Money</h2>
							<GoldEntry
								value={money}
								setValue={(g: Gold) => {
									formik.values.spend = g.spend;
									formik.values.gold = g.gold || 0;
									formik.values.silver = g.silver || 0;
									formik.values.copper = g.copper || 0;
									setMoney(g);
								}}
							/>
						</div>
						<div className={styles.cc_middle_middle}>
							<div className={styles.cc_exp_entry}>
								<div>
									<h2>Initial Experience</h2>
								</div>
								<div>
									<label htmlFor="level">Level</label>
									<InputNumber
										id="level"
										showButtons
										min={1}
										max={20}
										value={formik.values.level}
										onChange={(e) => {
											formik.values.level =
												e.value || 1;
										}}
									/>
								</div>
								<div>
									<label htmlFor="experience">Experience</label>
									<InputNumber
										id="experience"
										showButtons
										min={0}
										max={1000}
										step={250}
										value={formik.values.experience}
										onChange={(e) => {
											formik.values.experience =
												e.value || 1;
										}}
									/>
								</div>
							</div>
						</div>

						<div className={styles.cc_right_bottom}>
							<Button
								className="flex_end"
								label="Save"
								severity="success"
								type="submit"
							/>
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
}
