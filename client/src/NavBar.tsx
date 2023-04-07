import "./NavBar.css";
import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { redirect } from "react-router-dom";

function NavBar() {
	const menu = useRef<Menu>(null);
	const items = loggedOutMenu();

	return (
		<div className="navbar">
			<div className="navbar-left">VTTMUD</div>
			<div className="navbar-right">
				<button className="avatar" onClick={(e) => menu.current!.toggle(e)}>
					<Avatar
						label="U"
						size="xlarge"
						style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
					/>
				</button>
				<Menu model={items} popup ref={menu} />
			</div>
		</div>
	);
}

function loggedOutMenu() {
	return [
		{
			label: "Account",
			items: [
				{
					label: "Login",
					icon: "pi pi-user",
					command: () => {
						fetch("http://localhost:3001/api/v1/login") // TODO: something here to sort out the hostname
							.then((response) => response.json())
							.catch((error) => {
								console.log(error);
							})
							.then((parsed) => {
								console.log("redirecting to: ", parsed.redirect_url);
								redirect(parsed.redirect_url);
							});
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
