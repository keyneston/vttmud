export interface CharacterInfo {
    name: string;
    backstory?: string;
    appearance?: string;
    alignment?: string;
    skills?: { [key: string]: ProficiencyRank };
}

export type ProficiencyRank = {
    id: number;
    name: string;
    bonus: number;
};

export enum Proficiency {
    Unknown = -1,
    Untrained = 0,
    Trained = 1,
    Expert = 2,
    Master = 3,
    Legendary = 4,
}

function expandSkillName(input: string): string {
    switch (input) {
        case "acr":
            return "Acrobatics";
        case "arc":
            return "Arcane";
        case "ath":
            return "Athletics";
        case "cra":
            return "Crafting";
        case "dec":
            return "Deception";
        case "dip":
            return "Diplomacy";
        case "itm":
            return "Intimidation";
        case "med":
            return "Medicine";
        case "nat":
            return "Nature";
        case "occ":
            return "Occultism";
        case "prf":
            return "Performance";
        case "rel":
            return "Religion";
        case "soc":
            return "Society";
        case "ste":
            return "Stealth";
        case "sur":
            return "Survival";
        case "thi":
            return "Thievery";
        default:
            return "Unknown";
    }
}

function expandRank(rank: number): ProficiencyRank {
    switch (rank) {
        case 0:
            return { id: 0, name: "Untrained", bonus: 0 };
        case 1:
            return { id: 1, name: "Trained", bonus: 2 };
        case 2:
            return { id: 2, name: "Expert", bonus: 4 };
        case 3:
            return { id: 3, name: "Master", bonus: 6 };
        case 4:
            return { id: 4, name: "Legendary", bonus: 8 };
        default:
            return { id: -1, name: "Unknown", bonus: 0 };
    }
}

export function parseBlob(input: any): CharacterInfo | undefined {
    if (!input) {
        return { name: "" };
    }

    const name = input?.name ?? "";
    const backstory = input?.system?.details?.biography?.backstory;
    const appearance = input?.system?.details?.biography?.appearance;
    const alignment = input?.system?.details?.alignment?.value;

    const skills: { [key: string]: ProficiencyRank } = {};
    const rawSkills = new Map(Object.entries(input?.system?.skills));

    rawSkills.forEach((v: any, k: string) => {
        skills[expandSkillName(k)] = expandRank(v.rank);
    });

    return { name, backstory, appearance, alignment, skills };
}

export {};
