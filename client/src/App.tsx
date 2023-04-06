import React from "react";
import "./App.css";
import { NavBar } from "./NavBar";
import { CraftTemplate } from "./CraftTemplate";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
	return (
		<div className="App">
			<div className="AppHeader">
				<NavBar />
			</div>
			<div className="CenterLeft">
				<CraftTemplate></CraftTemplate>
			</div>
			<div className="CenterRight"></div>
		</div>
	);
}

export default App;
