import React from "react";
import "./App.scss";
import { NavBar } from "./NavBar";
import { CraftTemplate } from "./CraftTemplate";
import PrimeReact from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

PrimeReact.inputStyle = "filled";

function App() {
	return (
		<div className="App">
			<div className="AppHeader">
				<NavBar />
			</div>
			<div className="Content">
				<div className="CenterLeft">
					<CraftTemplate></CraftTemplate>
				</div>
				<div className="CenterRight"></div>
			</div>
		</div>
	);
}

export default App;
