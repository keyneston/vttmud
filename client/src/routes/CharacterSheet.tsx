import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CharacterSheet() {
	const [data, setData] = useState<{ owner: number; name: string }>({ owner: 0, name: "" });
	const [loading, setLoading] = useState(true);
	const urlParams = useParams();

	const fetchData = async () => {
		const resp = await fetch(`/api/v1/character/${urlParams.id}`);
		const data = await resp.json();
		setData(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData, urlParams]);

	return (
		<div>
			{loading && "Loading"} {data && <div>Character {data.name}</div>}
		</div>
	);
}
