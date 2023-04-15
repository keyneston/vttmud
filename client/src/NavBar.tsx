import "./NavBar.css";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loggedIn, avatarImage } from "./cookies/discord";
import CharacterCreation from "./components/CharacterCreation";
import { listCharacters } from "./api/characters";

import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";

function NavBar() {
	const [ccVisible, setCCVisible] = useState(false);
	const toast = useRef<Toast>(null);
	const navigate = useNavigate();
	const menu = useRef<Menu>(null);
	const items = loggedIn() ? loggedInMenu(navigate, setCCVisible) : loggedOutMenu(navigate);
	const image = avatarImage();
	const style = loggedIn() ? {} : { backgroundColor: "#2196F3", color: "#ffffff" };

	return (
		<>
			<div className="navbar">
				<div className="navbar-left">
					<div className="logo">
						<Link className="logo" to="/">
							VTTMUD
						</Link>
					</div>
				</div>
				<div className="navbar-right">
					<button className="avatar" onClick={(e) => menu.current!.toggle(e)}>
						<Avatar
							label="U"
							size="xlarge"
							style={style}
							image={image}
							shape="circle"
						/>
					</button>
					<Menu model={items} popup ref={menu} />
					<Toast ref={toast} />
				</div>
			</div>
			<div className="navbar-divider" />
			<CharacterCreation visible={ccVisible} setVisible={setCCVisible} />
		</>
	);
}

function loggedOutMenu(navigate: any) {
	return [
		{
			label: "Account",
			items: [
				{
					label: "Login",
					icon: "pi pi-sign-in",
					command: () => {
						navigate("/login");
					},
				},
			],
		},
	];
}

function loggedInMenu(navigate: any, setCCVisible: (x: boolean) => void) {
	const menu = [
		{
			label: "Account",
			items: [
				{
					label: "Create Character",
					icon: "pi pi-plus",
					command: () => {
						setCCVisible(true);
					},
				},
				{
					label: "Logout",
					icon: "pi pi-sign-out",
					command: () => {
						navigate("/logout");
					},
				},
			],
		},
	];

	return menu;
}

export { NavBar };
