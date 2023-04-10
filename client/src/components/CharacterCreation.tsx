import { useState, useRef } from "react";
import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { MaximumImageSize } from "../constants";
import { useNavigate } from "react-router-dom";

import "./CharacterCreation.scss";

export default function CharacterCreation({
	visible = false,
	setVisible,
}: {
	visible: boolean;
	setVisible: (x: boolean) => void;
}) {
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			character_name: "",
		},
		validate: (data) => {
			let errors: FormikErrors<FormikValues> = {};

			if (!data.character_name) {
				errors.character_name = "Character Name must not be blank";
			}

			return errors;
		},
		onSubmit: async (data) => {
			let jData = JSON.stringify(data);
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

	const itemTemplate = (file: any, props: any) => {
		return <Image src={file.objectURL} width="360" height="360" />;
	};

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

						<div className="cc-left-bottom"></div>

						<div className="cc-right-bottom">
							<Button label="Submit" severity="success" type="submit" />
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
}
