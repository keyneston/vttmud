import "./NavBar.css";
import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function NavBar() {
	const navigate = useNavigate();
	const menu = useRef<Menu>(null);
	const items = loggedIn() ? loggedInMenu() : loggedOutMenu(navigate);
	const image = loggedIn() ? avatarImage() : "";

	return (
		<div className="navbar">
			<div className="navbar-left">VTTMUD</div>
			<div className="navbar-right">
				<button className="avatar" onClick={(e) => menu.current!.toggle(e)}>
					<Avatar
						label="U"
						size="xlarge"
						style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
						image={image}
						shape="circle"
					/>
				</button>
				<Menu model={items} popup ref={menu} />
			</div>
		</div>
	);
}

// function getCookie(name: string) {
// 	const value = `; ${document.cookie}`;
// 	const parts = value.split(`; ${name}=`);
// 	if (parts.length === 2) return cookieParser.JSONCookie(parts!.pop()!.split(";").shift() || "");
// }

function loggedIn(): boolean {
	return cookies.get("discord-user")?.username ? true : false;
}

function avatarImage(): string {
	let user = cookies.get("discord-user");
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
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

function loggedInMenu() {
	return [
		{
			label: "Account",
			items: [
				{
					label: "Logout",
					icon: "pi pi-cancel",
					command: () => {},
				},
			],
		},
	];
}

export { NavBar };
