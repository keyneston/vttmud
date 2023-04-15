import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { listCharacters, Character } from "../api/characters";
import { getColor } from "../helpers/colors";
import { CDN } from "../constants";
import CharacterCreation from "../components/CharacterCreation";
import { loggedIn } from "../cookies/discord";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

import "./Sidebar.scss";

export function Sidebar() {
	const [authToken, setAuthToken] = useCookies(["discord"]);
	const [characters, setCharacters] = useState<Character[]>([]);
	const [ccVisible, setCCVisible] = useState(false);

	useEffect(() => {
		if (loggedIn()) {
			listCharacters().then((chars: Character[]) => {
				setCharacters(chars);
			});
		} else {
			setCharacters([]);
		}
	}, [authToken]);

	const charSections = characters.map((x: Character) => <CharacterSection key={x.name} char={x} />);

	return (
		<div className="sidebar-root">
			<div className="sidebar-section">
				<h3>General</h3>
				<div className="sidebar-section-items">
					<div>
						<Link className="sidebar-link" to="/">
							<Button
								icon="pi pi-home"
								tooltip="Home"
								rounded
								outlined
								aria-label="Home"
								size="large"
							/>
						</Link>
					</div>
					{loggedIn() && (
						<div>
							<Link
								className="sidebar-link"
								onClick={(e: any) => {
									e.preventDefault();
									setCCVisible(true);
								}}
								to="/"
							>
								<Button
									icon="pi pi-user-plus"
									tooltip="Create Character"
									rounded
									outlined
									severity="success"
									aria-label="Create Character"
									size="large"
								/>
							</Link>
						</div>
					)}
					<div>
						<Link className="sidebar-link" to="/templates">
							<Button
								icon="pi pi-sliders-h"
								tooltip="Templates"
								severity="info"
								rounded
								outlined
								aria-label="Templates"
								size="large"
							/>
						</Link>
					</div>
					{loggedIn() ? (
						<div>
							<Link className="sidebar-link" to="/logout">
								<Button
									icon="pi pi-sign-out"
									tooltip="Logout"
									rounded
									outlined
									severity="danger"
									aria-label="Logout"
									size="large"
								/>
							</Link>
						</div>
					) : (
						<div>
							<Link className="sidebar-link" to="/login">
								<Button
									icon="pi pi-sign-in"
									tooltip="Login"
									rounded
									outlined
									aria-label="Login"
								/>
							</Link>
						</div>
					)}
				</div>
			</div>
			{charSections}
			<CharacterCreation visible={ccVisible} setVisible={setCCVisible} />
		</div>
	);
}

function CharacterSection({ char }: { char: Character }) {
	const formatAvatar = () => {
		var color = getColor(char.name);
		return (
			<Avatar
				label={char.name.substring(0, 1)}
				size="large"
				style={
					char.avatar
						? {}
						: { backgroundColor: color.backgroundColor, color: color.color }
				}
				image={char.avatar ? `${CDN}/${char.avatar}` : ""}
				shape="circle"
			/>
		);
	};

	return (
		<>
			<div className="sidebar-section">
				<div className="sidebar-section-header">
					{formatAvatar()}
					<div>{char.name}</div>
				</div>
				<div className="sidebar-character-items">
					<div className="sidebar-sublink">
						<Link className="sidebar-link" to={`/character/${char.id}/`}>
							<Button
								icon="pi pi-id-card"
								tooltip="Character Sheet"
								rounded
								outlined
								aria-label="Character Sheet"
								severity="success"
								size="large"
							/>
						</Link>
					</div>
					<div className="sidebar-sublink">
						<Link className="sidebar-link" to={`/character/${char.id}/log`}>
							<Button
								icon="pi pi-book"
								tooltip="Log"
								rounded
								outlined
								aria-label="Log"
								severity="info"
								size="large"
							/>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
