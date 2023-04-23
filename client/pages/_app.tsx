import React from "react";
import { loginAction, logoutAction } from "./routes/login";
import { NavBar } from "../components/NavBar";

import "./_app.scss";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// import Root from "./routes/root";
// import Templates from "./routes/templates";
// import Home from "./routes/home";
// import CharacterLog from "./routes/CharacterLog";
// import CharacterSheet from "./routes/CharacterSheet";
// import DowntimeLog from "./routes/DowntimeLog";

export default function App({ Component, pageProps }) {
	return (
		<React.StrictMode>
			<NavBar></NavBar>
			<Component {...pageProps} />
		</React.StrictMode>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
