export interface Character {
    id: number;
    owner: string;
    name: string;
    avatar?: string;
}

export async function listCharacters(): Promise<Character[]> {
    const results = await fetch("/api/v1/characters").then((d) => d.json());
    return results;
}

export async function fetchCharacter(id: string | number): Promise<Character> {
    const resp = await fetch(`/api/v1/character/${id}`);
    return resp.json();
}

export {};
