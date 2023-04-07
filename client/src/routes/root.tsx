import { NavBar } from "../NavBar";
import { CraftTemplate } from "../CraftTemplate";
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
						<CraftTemplate></CraftTemplate>
					</div>
				</div>
				<div className="centerRight"></div>
			</div>
		</>
	);
}
