export interface CharacterInfo {
    name: string;
    backstory?: string;
    appearance?: string;
    alignment?: string;
}

export function parseBlob(input: any): CharacterInfo {
    const name = input?.name ?? "";
    const backstory = input?.system?.details?.biography?.backstory;
    const appearance = input?.system?.details?.biography?.appearance;
    const alignment = input?.system?.details?.alignment?.value;

    return { name, backstory, appearance, alignment };
}

export {};
