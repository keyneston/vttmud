export interface CharacterInfo {
    name: string;
    backstory?: string;
    appearance?: string;
    alignment?: string;
    abilities?: { [key: string]: number };
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

export function scoreToBonus(input: number): number {
    return Math.floor((input - 10) / 2);
}

export function calculateScores(input: { [key: string]: number }): { [key: string]: number } {
    const results: { [key: string]: number } = {};
    for (const k in input) {
        const v = input[k];
        results[k] = calculateScore(v);
    }
    return results;
}

export function calculateScore(input: number): number {
    let total = 10;

    if (input > 4) {
        total += 4 * 2 + (input - 4);
    } else {
        total += 2 * input;
    }
    return total;
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

    const abilityBoosts: { [key: string]: number } = { str: 0, con: 0, dex: 0, wis: 0, int: 0, cha: 0 };

    input.items.forEach((v: any) => {
        if (v?.system?.boosts) {
            for (const b in v.system.boosts) {
                if (v.system.boosts[b]?.selected) {
                    abilityBoosts[v.system.boosts[b]?.selected] += 1;
                }
            }
        }

        if (v?.system?.keyAbility?.value) {
            const value = v?.system?.keyAbility?.value;
            if (value.length > 0) {
                abilityBoosts[value[0]] += 1;
            }
        }
    });

    if (input?.system?.build?.abilities?.boosts) {
        const boosts = input.system.build.abilities.boosts;
        for (const v in boosts) {
            boosts[v].forEach((x: string) => {
                abilityBoosts[x] += 1;
            });
        }
    }

    return { name, backstory, appearance, alignment, skills, abilities: calculateScores(abilityBoosts) };
}

export {};
