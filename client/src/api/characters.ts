export interface Character {
    id: number;
    owner: string;
    name: string;
    avatar?: string;
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

export async function listCharacters(): Promise<Character[]> {
    const results = await fetch("/api/v1/characters").then((d) => d.json());
    return results;
}

export async function fetchCharacter(id: string | number): Promise<Character> {
    const resp = await fetch(`/api/v1/character/${id}`);
    return resp.json();
}

export async function updateLog(data: CharacterLogEntry): Promise<CharacterLogEntry> {
    return await fetch(`/api/v1/character/${data.characterID}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((d) => {
        return d.json();
    });
}

export async function getLog(id: number): Promise<CharacterLogEntry[]> {
    const resp = await fetch(`/api/v1/character/${id}/log`);
    return resp.json();
}

export {};