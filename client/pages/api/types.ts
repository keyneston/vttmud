export interface Character {
    id: number;
    owner: string;
    name: string;
    avatar?: string;
}

export interface Money {
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
}

export interface CharacterLogEntry {
    id: number;
    characterID: number;
    experience?: number;
    spend?: boolean;
    money?: Money;
    createdAt: Date;
    updatedAt: Date;
}
