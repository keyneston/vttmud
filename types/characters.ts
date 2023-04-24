export interface Character {
    id: number;
    owner: string;
    name: string;
    avatar?: string;
    gold: number;
    experience: number;
    blob?: any;
    serverID?: number;
    server: Server;
    remainingDowntime?: number;
}

export interface CharacterLogEntry {
    id?: number;
    characterID: number;
    spend: boolean;
    gold?: number;
    silver?: number;
    copper?: number;
    experience?: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Server {
    id: number;
    discordID: string;
    name: string;
}
