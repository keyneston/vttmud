import { useState } from "react";
import { useFormik, FormikValues, FormikErrors, FormikTouched } from "formik";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { MaximumImageSize } from "../constants";
import "./CharacterCreation.scss";
import { useNavigate } from "react-router-dom";

export default function CharacterCreation() {
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

			navigate(`/character/${results.id}`);

			formik.resetForm();
		},
	});

	const chooseOptions = {
		icon: "pi pi-fw pi-cloud-upload",
		iconOnly: true,
		className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
	};

	const imageURL =
		"https://keyneston-foundry.s3.eu-central-1.amazonaws.com/tokenizer/cleric.AvatarO58TTG7ayoY1qkBr.webp?1680301573868";

	const errors: { [key: string]: string } = formik.errors;
	const touched: FormikTouched<FormikValues> = formik.touched;
	const isFormFieldValid = (name: string) => !!(touched[name] && errors[name]);
	const getFormErrorMessage = (name: string) => {
		let error = errors[name];

		return isFormFieldValid(name) && <small className="p-error">{error}</small>;
	};

	// const uploadHandler = async (event: any) => {
	// 	fetch("/upload", {
	// 		method: "POST",
	// 		body: event,
	// 		headers: { "Content-Type": "multipart/form-data" },
	// 	});
	// };

	return (
		<>
			<Card title="Character Creator">
				<form onSubmit={formik.handleSubmit} className="p-fluid">
					<div className="cc-grid">
						<div className="cc-left-top">
							<div className="cc-image-holder">
								<Image
									src={imageURL}
									width="360"
									height="360"
									preview
								/>
							</div>
						</div>
						<div className="cc-center">
							<span className="p-float-label p-input-icon-right">
								<InputText
									id="character_name"
									value={formik.values.character_name}
									onChange={formik.handleChange}
								/>
								<label htmlFor="character_name">Character Name</label>
							</span>
							{getFormErrorMessage("character_name")}
						</div>
						<div className="cc-right"></div>

						<div className="cc-left-bottom">
							<Tooltip
								target=".custom-upload-btn"
								content="Upload"
								position="bottom"
							/>
							<FileUpload
								accept="image/*"
								name="character"
								maxFileSize={MaximumImageSize}
								mode="basic"
								chooseOptions={chooseOptions}
								url="/upload"
								auto
							/>
						</div>

						<div className="cc-right-bottom">
							<Button label="Submit" severity="success" type="submit" />
						</div>
					</div>
				</form>
			</Card>
		</>
	);
}
