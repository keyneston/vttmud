import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { listCharacters, Character } from "api/characters";
import CharacterCreation from "components/CharacterCreation";
import { loggedIn } from "utils/cookies/discord";
import { Button } from "primereact/button";
import Link from "next/link";
import { CharacterAvatar } from "components/CharacterAvatar";
import Conditional from "components/Conditional";

import styles from "./Sidebar.module.scss";

export function Sidebar() {
	const [ccVisible, setCCVisible] = useState(false);
	const [showLoggedIn, setShowLoggedIn] = useState(false);

	useEffect(() => setShowLoggedIn(loggedIn()));

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
		<div className={styles.sidebar_root}>
			<div className={styles.sidebar_section}>
				<h3>General</h3>
				<div className={styles.sidebar_section_items}>
					<div>
						<Link className={styles.sidebar_link} href="/">
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
					<Conditional show={showLoggedIn}>
						<div>
							<Link
								className={styles.sidebar_link}
								onClick={(e: any) => {
									e.preventDefault();
									setCCVisible(true);
								}}
								href="/"
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
					</Conditional>
					<div>
						<Link className={styles.sidebar_link} href="/templates">
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
					{showLoggedIn ? (
						<div>
							<Link className={styles.sidebar_link} href="/api/v1/logout">
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
							<Link className={styles.sidebar_link} href="/api/v1/login">
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
			<Conditional show={showLoggedIn}>
				<CharacterCreation visible={ccVisible} setVisible={setCCVisible} />
			</Conditional>
		</div>
	);
}

function CharacterSection({ char }: { char: Character }) {
	return (
		<>
			<div className={styles.sidebar_section}>
				<div className={styles.sidebar_section_header}>
					<CharacterAvatar character={char} />
					<div>{char.name}</div>
				</div>
				<div className={styles.sidebar_character_items}>
					<div className={styles.sidebar_sublink}>
						<Link className={styles.sidebar_link} href={`/character/${char.id}/`}>
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
					<div className={styles.sidebar_sublink}>
						<Link
							className={styles.sidebar_link}
							href={`/character/${char.id}/log`}
						>
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
					<div className={styles.sidebar_sublink}>
						<Link
							className={styles.sidebar_link}
							href={`/character/${char.id}/downtime`}
						>
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
