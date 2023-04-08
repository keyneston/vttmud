import "./NavBar.css";
import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function NavBar() {
	const navigate = useNavigate();
	const menu = useRef<Menu>(null);
	const items = loggedIn() ? loggedInMenu(navigate) : loggedOutMenu(navigate);
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
		</>
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
	return user?.username ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "";
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

function loggedInMenu(navigate: any) {
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
	];
}

export { NavBar };
