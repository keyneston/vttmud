import React from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as serversAPI from "api/servers";
import { CharacterAvatar } from "components/CharacterAvatar";

import { Card } from "primereact/card";

export default function ShowServerCatalog() {
	const slug = useRouter().query.slug;

	const { isLoading, error, data } = useQuery({
		queryKey: ["server", slug],
		queryFn: () => serversAPI.fetchServer(slug),
		cacheTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
	});

	const charTemplate = (character: api.Character) => {
		return (
			<Card style={{ width: "100%", gap: "1rem" }}>
				<CharacterAvatar size="xlarge" character={character} />
				<div>{character.name}</div>
			</Card>
		);
	};

	let characters = [];
	if (data) {
		characters = data.Character;
	}

	return (
		<>
			<DataView value={characters} itemTemplate={charTemplate} paginator rows={10} />
		</>
	);
}
