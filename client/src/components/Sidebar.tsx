import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listCharacters, Character } from "../api/characters";
import CharacterCreation from "../components/CharacterCreation";
import { loggedIn } from "../cookies/discord";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { CharacterAvatar } from "../components/Avatar";

import "./Sidebar.scss";

export function Sidebar() {
	const [ccVisible, setCCVisible] = useState(false);

	const { isLoading, error, data } = useQuery({
		queryKey: ["listCharacters"],
		queryFn: () => listCharacters(),
		cacheTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	var charSections;

	if (isLoading) {
		charSections = <div>Loading...</div>;
	} else if (error) {
		charSections = <div>Error loading character list.</div>;
	} else {
		charSections = data!.map((x: Character) => <CharacterSection key={`${x.id}-${x.name}`} char={x} />);
	}

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
									severity="success"
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
	return (
		<>
			<div className="sidebar-section">
				<div className="sidebar-section-header">
					<CharacterAvatar character={char} />
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
					<div className="sidebar-sublink">
						<Link className="sidebar-link" to={`/character/${char.id}/downtime`}>
							<Button
								icon="pi pi-moon"
								tooltip="Downtime"
								rounded
								outlined
								aria-label="Downtime"
								severity="warning"
								size="large"
							/>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
