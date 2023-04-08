import { NavBar } from "../NavBar";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import "./root.scss";

export default function Root() {
	return (
		<>
			<div className="root">
				<CookiesProvider>
					<div className="header">
						<NavBar />
					</div>
					<div className="centerLeft">
						<div className="content">
							<Outlet />
						</div>
					</div>
					<div className="centerRight"></div>
				</CookiesProvider>
			</div>
		</>
	);
}
