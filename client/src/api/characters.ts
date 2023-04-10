export interface Character {
    id: number;
    owner: string;
    name: string;
}

export async function listCharacters(): Promise<Character[]> {
    const results = await fetch("/api/v1/characters").then((d) => d.json());
    return results;
}

export {};
