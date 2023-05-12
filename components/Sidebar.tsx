import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CharacterCreation from "components/CharacterCreation";
import { loggedIn } from "utils/cookies/discord";
import Link from "next/link";
import { CharacterAvatar } from "components/CharacterAvatar";
import Conditional from "components/Conditional";
import * as api from "api/characters";
import * as types from "types/characters";
import { getColor } from "utils/colors";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

import styles from "./Sidebar.module.scss";

export function Sidebar() {
	const [ccVisible, setCCVisible] = useState(false);
	const [showLoggedIn, setShowLoggedIn] = useState(false);

	useEffect(() => setShowLoggedIn(loggedIn()));

	const { isLoading, error, data } = useQuery({
		queryKey: ["listCharacters"],
		queryFn: () => api.listCharacters(),
		placeholderData: [],
		cacheTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	let charSections;

	if (isLoading) {
		charSections = <div>Loading...</div>;
	} else if (error) {
		charSections = <div>Error loading character list.</div>;
	} else {
		charSections = data!.map((x: api.Character) => <CharacterSection key={`${x.id}-${x.name}`} char={x} />);
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
			<Conditional show={showLoggedIn}>
				<ServersSection />
				{charSections}
				<CharacterCreation visible={ccVisible} setVisible={setCCVisible} />
			</Conditional>
			<div className={styles.sidebar_section}>
				<h3>Links and Contact</h3>
				<div className={styles.sidebar_section_items}>
					<div>
						<Link href="https://github.com/keyneston/vttmud">
							<Button
								icon="pi pi-github"
								severity="success"
								tooltip="Github"
								rounded
								outlined
								aria-label="Github"
							/>
						</Link>
					</div>
					<div>
						<Link href="https://discordapp.com/users/620653174469951512">
							<Button
								icon="pi pi-discord"
								tooltip="Discord"
								rounded
								outlined
								aria-label="Discord"
							/>
						</Link>
					</div>
					<div>
						<Link href="https://github.com/keyneston/vttmud/issues/new">
							<Button
								icon="pi pi-times-circle"
								severity="danger"
								tooltip="Report Issue"
								rounded
								outlined
								aria-label="Github Issues"
							/>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

function ServersSection() {
	const { data, isFetching, isLoading, error } = useQuery({
		queryKey: ["listServers"],
		queryFn: () => api.listServers(),
		placeholderData: [],
		staleTime: 10 * 60 * 1000,
		cacheTime: 15 * 60 * 1000,
	});

	const loaded = !isFetching && !isLoading && !error && data;

	return (
		<>
			<Conditional show={error}>
				<small className="p-error">Error loading servers: {error?.message ?? ""}</small>
			</Conditional>
			<Conditional show={loaded}>
				{(data &&
					data.map((e: any) => {
						return (
							<div key={e.slug} className={styles.sidebar_section}>
								<div className={styles.sidebar_section_header}>
									<Avatar
										size="large"
										style={getColor(e.slug)}
										label={e.slug[0].toUpperCase()}
									/>
									<div>{e.name}</div>
								</div>
								<div className={styles.sidebar_character_items}>
									<div className={styles.sidebar_sublink}>
										<Link
											href={`/server/${encodeURIComponent(
												e.slug
											)}`}
										>
											<Button
												icon="pi pi-table"
												severity="info"
												outlined
												size="large"
												rounded
												tooltip="Character Directory"
											/>
										</Link>
									</div>
								</div>
							</div>
						);
					})) ||
					""}
			</Conditional>
		</>
	);
}

function CharacterSection({ char }: { char: types.Character }) {
	return (
		<>
			<div className={styles.sidebar_section}>
				<div className={styles.sidebar_section_header}>
					<CharacterAvatar character={char} />
					<div>{char.name}</div>
				</div>
				<div className={styles.sidebar_character_items}>
					<div className={styles.sidebar_sublink}>
						<Link
							className={styles.sidebar_link}
							href={`/character/${encodeURIComponent(char.id)}`}
						>
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
								tooltip="Experience and Money"
								rounded
								outlined
								aria-label="Experience and Money"
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
