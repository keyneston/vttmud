import { useState } from "react";
import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { GoldEntry } from "./GoldEntry";
import { Gold } from "../api/items";

import "./CharacterCreation.scss";

export default function CharacterCreation({
	visible = false,
	setVisible,
}: {
	visible: boolean;
	setVisible: (x: boolean) => void;
}) {
	const navigate = useNavigate();
	const [money, setMoney] = useState<Gold>({ spend: false });

	const formik = useFormik({
		initialValues: {
			character_name: "",
			spend: false,
			gold: 0,
			silver: 0,
			copper: 0,
			level: 1,
			experience: 0,
		},
		validate: (data) => {
			let errors: FormikErrors<FormikValues> = {};

			if (!data.character_name) {
				errors.character_name = "Character Name must not be blank";
			}

			return errors;
		},
		onSubmit: async (data) => {
			var gold = (data.spend ? -1 : 1) * (data.gold + data.silver / 10 + data.copper / 100);

			let jData = JSON.stringify({ ...data, gold: gold, spend: null, silver: null, copper: null });
			console.log(`submitting: ${jData}`);

			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: jData,
			};

			var results = await fetch("/api/v1/character", requestOptions).then((d) => {
				return d.json();
			});

			setVisible(false);
			navigate(`/character/${results.id}`);

			formik.resetForm();
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
			<Dialog
				header="Character Creator"
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => {
					setVisible(false);
				}}
			>
				<form onSubmit={formik.handleSubmit} className="p-fluid">
					<div className="cc-grid">
						<div className="cc-left-top">
							<span className="p-float-label p-input-icon-right">
								<InputText
									id="character_name"
									value={formik.values.character_name}
									onChange={formik.handleChange}
								/>
								<label htmlFor="character_name">Character Name</label>
							</span>
						</div>
						<div className="cc-center">{getFormErrorMessage("character_name")}</div>
						<div className="cc-right"></div>

						<div className="cc-left-bottom">
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

						<div className="cc-right-bottom">
							<Button label="Submit" severity="success" type="submit" />
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
}
