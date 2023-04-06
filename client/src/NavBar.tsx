import "./NavBar.css";
import { Avatar } from "primereact/avatar";

function NavBar() {
	return (
		<div id="navbar">
			<div id="navbar-left">VTTMUD</div>
			<div id="navbar-right">
				<Avatar
					label="U"
					size="xlarge"
					style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
				/>
			</div>
		</div>
	);
}

export { NavBar };
