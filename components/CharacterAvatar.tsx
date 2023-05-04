import React from "react";
import { Character } from "api/characters";
import { CDN } from "utils/constants";
import { Avatar } from "primereact/avatar";
import { getColor } from "utils/colors";

export type AvatarProps = {
	character: Character | undefined;
	size: string;
};

export function CharacterAvatar({ character, size = "large" }: AvatarProps) {
	if (!character) {
		return <Avatar size="large" shape="circle" label="U" />;
	}

	const color = getColor(character.id + character?.name);
	return (
		<Avatar
			key={`${character.id}-avatar`}
			label={character?.name?.substring(0, 1)}
			size={size}
			style={character.avatar ? {} : { backgroundColor: color.backgroundColor, color: color.color }}
			image={character.avatar ? `${CDN}/${character.avatar}` : ""}
			shape="circle"
		/>
	);
}
