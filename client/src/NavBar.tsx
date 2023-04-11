import "./NavBar.css";
import React, { useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Link, useNavigate } from "react-router-dom";
import { loggedIn, avatarImage } from "./cookies/discord";
import CharacterCreation from "./components/CharacterCreation";
import { listCharacters } from "./api/characters";

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

	// TODO: cleaner way of doing this?
	listCharacters().then((characters) => {
		characters.forEach((x) => {
			menu.push({
				label: x.name,
				items: [
					{
						label: "Sheet",
						icon: "pi pi-user",
						command: () => {
							navigate(`/character/${x.id}`);
						},
					},
					{
						label: `Log`,
						icon: "pi pi-book",
						command: () => {
							navigate(`/character/${x.id}/log`);
						},
					},
				],
			});
		});
	});

	return menu;
}

export { NavBar };
