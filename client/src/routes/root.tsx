import { NavBar } from "../NavBar";
import { Sidebar } from "../components/Sidebar";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import "./root.scss";

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

export default function Root() {
	checkDomain();

	return (
		<>
			<div className="root">
				<CookiesProvider>
					<div className="header">
						<NavBar />
					</div>
					<Sidebar />
					<div className="content">
						<Outlet />
					</div>
				</CookiesProvider>
			</div>
		</>
	);
}
