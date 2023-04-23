import { NavBar } from "../NavBar";
import { Sidebar } from "../components/Sidebar";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./root.scss";

const queryClient = new QueryClient();

export default function Root() {
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
							<Component {...pageProps} />
						</div>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</CookiesProvider>
			</div>
		</>
	);
}
