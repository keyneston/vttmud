import { useState, useEffect } from "react";
import { Divider } from "primereact/divider";
import { Link } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { listCharacters, Character } from "../api/characters";
import { getColor } from "../helpers/colors";
import { CDN } from "../constants";
import "./Sidebar.scss";
/*
		characters.forEach((x) => {
			menu.push({
				label: x.name,
				items: [
					{
						label: "Sheet",
						icon: "pi pi-user",
						command: () => {
							navigate(`/character/${x.id}`);
						},
					},
					{
						label: `Log`,
						icon: "pi pi-book",
						command: () => {
							navigate(`/character/${x.id}/log`);
						},
					},
				],
			});
		});
	});
	*/

export function Sidebar() {
	const [characters, setCharacters] = useState<Character[]>([]);

	useEffect(() => {
		listCharacters().then((chars: Character[]) => {
			setCharacters(chars);
		});
	}, []);

	const charSections = characters.map((x: Character) => <CharacterSection key={x.name} char={x} />);

	return (
		<div className="sidebar-root">
			<div className="sidebar-section">
				<h3>General</h3>
				<div>
					<Link className="sidebar-link" to="/">
						Home
					</Link>
				</div>
				<div>
					<Link className="sidebar-link" to="/templates">
						Templates
					</Link>
				</div>
			</div>
			{charSections}
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
		<div className="sidebar-section">
			<div className="sidebar-section-header">
				{formatAvatar()}
				<div>{char.name}</div>
			</div>
			<div className="sidebar-sublink">
				<Link className="sidebar-link" to={`/character/${char.id}/`}>
					Character Sheet
				</Link>
			</div>
			<div className="sidebar-sublink">
				<Link className="sidebar-link" to={`/character/${char.id}/log`}>
					Log
				</Link>
			</div>
		</div>
	);
}
