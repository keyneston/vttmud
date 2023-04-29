import React from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as serversAPI from "api/servers";
import { CharacterAvatar } from "components/CharacterAvatar";
import styles from "./index.module.scss";

import { Card } from "primereact/card";

export async function getServerSideProps({ res, req, query }) {
	res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=800");

	return {
		props: {
			slug: query.slug,
		},
	};
}

export interface ShowServerCatalogProps {
	slug: String;
}

export default function ShowServerCatalog({ slug }: ShowServerCatalogProps) {
	if (!slug) {
		slug = useRouter().query.slug;
	}

	const { isLoading, error, data } = useQuery({
		queryKey: ["server", slug],
		queryFn: () => serversAPI.fetchServer(slug),
		cacheTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	let characters = [];
	if (data) {
		characters = data.Character;
	}

	return (
		<>
			<DataView value={characters} itemTemplate={characterTemplate} paginator rows={10} />
		</>
	);
}

function characterTemplate(character) {
	return (
		<Card className={styles.character_template_root}>
			<div className={styles.character_template_contents}>
				<CharacterAvatar size="xlarge" character={character} />
				<h3>{character.name}</h3>
				<h4>
					{character.ancestry ?? "Other"} / {character.heritage ?? "Other"}
				</h4>
			</div>
		</Card>
	);
}
