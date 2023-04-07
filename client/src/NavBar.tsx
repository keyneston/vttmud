import "./NavBar.css";
import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom"

function NavBar() {
	const navigate = useNavigate()
	const menu = useRef<Menu>(null);
	const items = loggedOutMenu(navigate);

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

function loggedOutMenu(navigate: any) {
	return [
		{
			label: "Account",
			items: [
				{
					label: "Login",
					icon: "pi pi-user",
					command: () => {
						navigate('/login')
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
