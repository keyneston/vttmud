import { Character } from "../api/characters";
import { CDN } from "../constants";
import { Avatar } from "primereact/avatar";
import { getColor } from "../helpers/colors";

export type AvatarProps = {
	character: Character | undefined;
};

export function CharacterAvatar({ character }: AvatarProps) {
	if (!character) {
		return <Avatar size="large" shape="circle" label="U" />;
	}

	var color = getColor(character.id + character.name);
	return (
		<Avatar
			key={`${character.id}-avatar`}
			label={character.name.substring(0, 1)}
			size="large"
			style={character.avatar ? {} : { backgroundColor: color.backgroundColor, color: color.color }}
			image={character.avatar ? `${CDN}/${character.avatar}` : ""}
			shape="circle"
		/>
	);
}
