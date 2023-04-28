import React, { useEffect } from "react";
import { loginAction, logoutAction } from "./routes/login";
import { NavBar } from "components/NavBar";
import { Sidebar } from "components/Sidebar";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./_app.scss";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// import Root from "./routes/root";
// import Templates from "./routes/templates";
// import Home from "./routes/home";
// import CharacterLog from "./routes/CharacterLog";
// import CharacterSheet from "./routes/CharacterSheet";
// import DowntimeLog from "./routes/DowntimeLog";
const queryClient = new QueryClient();

const checkDomain = () => {
	const domain = process.env.REACT_APP_DOMAIN;
	if (!domain) {
		return;
	}

	var proto = window.location.protocol;
	var hostname = window.location.host;
	var urlWithoutPort = `${proto}//${hostname}`;

	if (domain !== urlWithoutPort) {
		window.location.replace(window.location.href.replace(urlWithoutPort, domain));
	}
};

export default function App({ Component, pageProps }) {
	useEffect(() => checkDomain());

	return (
		<React.StrictMode>
			<div className="root">
				<CookiesProvider>
					<QueryClientProvider client={queryClient}>
						<div className="header">
							<NavBar />
						</div>
						<Sidebar />
						<div className="content">
							<Component {...pageProps} />
						</div>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</CookiesProvider>
			</div>
		</React.StrictMode>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
