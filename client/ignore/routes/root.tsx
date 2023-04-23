import { NavBar } from "../NavBar";
import { Sidebar } from "../components/Sidebar";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

const queryClient = new QueryClient();

export default function Root() {
	checkDomain();

	return (
		<>
			<div className="root">
				<CookiesProvider>
					<QueryClientProvider client={queryClient}>
						<div className="header">
							<NavBar />
						</div>
						<Sidebar />
						<div className="content">
							<Outlet />
						</div>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</CookiesProvider>
			</div>
		</>
	);
}
