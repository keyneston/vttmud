import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Character, fetchCharacter } from "../api/characters";

import { Image } from "primereact/image";

import "./CharacterSheet.scss";

export default function CharacterSheet() {
	const [data, setData] = useState<Character | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const urlParams = useParams();

	useEffect(() => {
		const fetchData = async () => {
			var id: string = urlParams.id || "";
			var data = await fetchCharacter(id);
			setData(data);
			setLoading(false);
		};

		fetchData();
	}, [urlParams]);

	return (
		<div>
			{loading && "Loading"} {data && <DisplayCharacter character={data} />}
		</div>
	);
}

function DisplayCharacter({ character }: { character: Character }) {
	const imageMissing = (
		<i className="pi pi-image cs-avatar-missing" style={{ fontSize: "8rem", color: "white" }} />
	);

	const avatar = <Image src={character.avatar} width="400" height="400" preview />;

	return (
		<>
			<div className="cs-root">
				<div className="cs-avatar-holder">
					<div className="cs-avatar">{(character.avatar && avatar) || imageMissing}</div>
				</div>
				<div className="cs-headline-info">
					<h1>{character.name}</h1>
					<h3>
						Level {Math.floor(character.experience / 1000)} Experience{" "}
						{character.experience % 1000}
					</h3>
					<h3>
						{character.gold} gp {character.silver} sp {character.copper} cp
					</h3>
				</div>
			</div>
		</>
	);
}
