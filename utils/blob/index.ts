export interface CharacterInfo {
    name: string;
    level: number;
    backstory?: string;
    appearance?: string;
    alignment?: string;
    abilities?: { [key: string]: number };
    skills?: Map<string, ProficiencyRank>;
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

export enum Skill {
    Acrobatics = "acr",
    Arcane = "arc",
    Athletics = "ath",
    Crafting = "cra",
    Deception = "dec",
    Diplomacy = "dip",
    Intimidation = "itm",
    Medicine = "med",
    Nature = "nat",
    Occultism = "occ",
    Performance = "prf",
    Religion = "rel",
    Society = "soc",
    Stealth = "ste",
    Survival = "sur",
    Thievery = "thi",
    Unknown = "unk",
}

export interface SkillInfo {
    name: string;
    shortName: string;
    ability: string;
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

function expandSkillName(input: string): Skill {
    switch (String(input).trim()) {
        case "acr":
            return Skill.Acrobatics;
        case "arc":
            return Skill.Arcane;
        case "ath":
            return Skill.Athletics;
        case "cra":
            return Skill.Crafting;
        case "dec":
            return Skill.Deception;
        case "dip":
            return Skill.Diplomacy;
        case "itm":
            return Skill.Intimidation;
        case "med":
            return Skill.Medicine;
        case "nat":
            return Skill.Nature;
        case "occ":
            return Skill.Occultism;
        case "prf":
            return Skill.Performance;
        case "rel":
            return Skill.Religion;
        case "soc":
            return Skill.Society;
        case "ste":
            return Skill.Stealth;
        case "sur":
            return Skill.Survival;
        case "thi":
            return Skill.Thievery;
        default:
            return Skill.Unknown;
    }
}

export function getSkillInfo(skill: Skill): SkillInfo {
    switch (skill) {
        case Skill.Acrobatics:
            return { shortName: "acr", name: "Acrobatics", ability: "dex" };
        case Skill.Arcane:
            return { shortName: "arc", name: "Arcane", ability: "int" };
        case Skill.Athletics:
            return { shortName: "ath", name: "Athletics", ability: "str" };
        case Skill.Crafting:
            return { shortName: "cra", name: "Crafting", ability: "int" };
        case Skill.Deception:
            return { shortName: "dec", name: "Deception", ability: "cha" };
        case Skill.Diplomacy:
            return { shortName: "dip", name: "Diplomacy", ability: "cha" };
        case Skill.Intimidation:
            return { shortName: "itm", name: "Intimidation", ability: "cha" };
        case Skill.Medicine:
            return { shortName: "med", name: "Medicine", ability: "wis" };
        case Skill.Nature:
            return { shortName: "nat", name: "Nature", ability: "wis" };
        case Skill.Occultism:
            return { shortName: "occ", name: "Occultism", ability: "int" };
        case Skill.Performance:
            return { shortName: "prf", name: "Performance", ability: "cha" };
        case Skill.Religion:
            return { shortName: "rel", name: "Religion", ability: "wis" };
        case Skill.Society:
            return { shortName: "soc", name: "Society", ability: "int" };
        case Skill.Stealth:
            return { shortName: "ste", name: "Stealth", ability: "dex" };
        case Skill.Survival:
            return { shortName: "sur", name: "Survival", ability: "wis" };
        case Skill.Thievery:
            return { shortName: "thi", name: "Thievery", ability: "dex" };
        default:
            return { shortName: "unk", name: "Unknown", ability: "con" };
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
        return { name: "", level: 0 };
    }

    const name = input?.name ?? "";
    const level = input?.system?.details?.level?.value;
    const backstory = input?.system?.details?.biography?.backstory;
    const appearance = input?.system?.details?.biography?.appearance;
    const alignment = input?.system?.details?.alignment?.value;

    const skills: Map<string, ProficiencyRank> = new Map();
    const rawSkills = new Map(Object.entries(input?.system?.skills));

    rawSkills.forEach((v: any, k: string) => {
        const skillName = expandSkillName(k);
        if (skillName === Skill.Unknown) {
            return;
        }
        skills.set(skillName, expandRank(v.rank));
    });

    const abilityBoosts: { [key: string]: number } = { str: 0, con: 0, dex: 0, wis: 0, int: 0, cha: 0 };

    if (input?.system?.build?.abilities?.boosts) {
        const boosts = input.system.build.abilities.boosts;
        for (const v in boosts) {
            boosts[v].forEach((x: string) => {
                abilityBoosts[x] += 1;
            });
        }
    }

    // Handle changes from 'items'
    input.items.forEach((v: any) => {
        // Check for boosts
        if (v?.system?.boosts) {
            for (const b in v.system.boosts) {
                if (v.system.boosts[b]?.selected) {
                    abilityBoosts[v.system.boosts[b]?.selected] += 1;
                }
            }
        }

        // Check for key ability score
        if (v?.system?.keyAbility?.value) {
            const value = v?.system?.keyAbility?.value;
            if (value.length > 0) {
                abilityBoosts[value[0]] += 1;
            }
        }

        // Check for background skills
        if (v?.system?.trainedSkills?.value) {
            const value = v?.system?.trainedSkills?.value;
            if (value === "") {
                return;
            }
            const skillName = expandSkillName(value);
            if (skillName === Skill.Unknown) {
                return;
            }

            const current = skills.get(skillName);

            if (current) {
                skills.set(skillName, expandRank(current!.id + 1));
            } else {
                skills.set(skillName, expandRank(1));
            }
        }

        if (v?.system?.rules) {
            const rules = v?.system?.rules;
            rules.forEach((r: any) => {
                var match = r?.path?.match(/system\.skills\.([a-z]+)\.rank/);
                if (!match || match.length < 2) {
                    return;
                }

                const skillName = expandSkillName(match[1]);
                if (skillName === Skill.Unknown) {
                    return;
                }

                if (r.mode === "upgrade") {
                    skills.set(skillName, expandRank(r.value));
                }
            });
        }
    });

    return { name, backstory, appearance, alignment, skills, abilities: calculateScores(abilityBoosts), level };
}

export {};
