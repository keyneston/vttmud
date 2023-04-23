import "./NavBar.css";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { loggedIn, avatarImage } from "./cookies/discord";

import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";

function NavBar() {
	const toast = useRef<Toast>(null);
	const image = avatarImage();
	const style = loggedIn() ? {} : { backgroundColor: "#2196F3", color: "#ffffff" };

	return (
		<>
			<div className="navbar">
				<div className="navbar-left">
					<div className="logo">
						<Link className="logo" to="/">
							VTTMud
						</Link>
					</div>
				</div>
				<div className="navbar-right">
					<Avatar label="U" size="xlarge" style={style} image={image} shape="circle" />
					<Toast ref={toast} />
				</div>
			</div>
			<div className="navbar-divider" />
		</>
	);
}

export { NavBar };
