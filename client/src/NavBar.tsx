import "./NavBar.css";
import React, { useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Link, useNavigate } from "react-router-dom";
import { loggedIn, avatarImage } from "./cookies/discord";
import CharacterCreation from "./components/CharacterCreation";

function NavBar() {
	const [ccVisible, setCCVisible] = useState(false);
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
					icon: "pi pi-user",
					command: () => {
						navigate("/login");
					},
				},
			],
		},
	];
}

function loggedInMenu(navigate: any, setCCVisible: (x: boolean) => void) {
	return [
		{
			label: "Account",
			items: [
				{
					label: "Logout",
					icon: "pi pi-cancel",
					command: () => {
						navigate("/logout");
					},
				},
			],
		},
		{
			label: "Character",
			items: [
				{
					label: "Create",
					icon: "pi pi-plus",
					command: () => {
						setCCVisible(true);
					},
				},
			],
		},
	];
}

export { NavBar };
