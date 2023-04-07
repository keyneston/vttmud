import { NavBar } from "../NavBar";
import { Outlet } from "react-router-dom";
import "./root.scss";

export default function Root() {
		return (
			<>
				<div className="root">
					<div className="header">
						<NavBar />
					</div>
					<div className="centerLeft">
						<div className="content">
							<Outlet />
						</div>
					</div>
					<div className="centerRight"></div>
				</div>
			</>
		);
}
