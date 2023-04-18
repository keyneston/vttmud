export interface DowntimeEntry {
    id?: number;
    characterID?: number;

    activity: Activity;
    assurance: boolean;
    bonus: number;
    date: Date;
    dc: number;
    details: string;
    level: number;
    roll?: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export enum Activity {
    Unknown = "",
    EarnIncome = "Earn Income",
    Perform = "Perform",
    Craft = "Craft",
    GatherResources = "Gather Resources",
    LearnASpell = "Learn a Spell",
    Retraining = "Retraining",
}

export const ActivityColors: Map<string, string> = new Map([
    [String(Activity.GatherResources), "green"],
    [String(Activity.Perform), "#ef476f"],
    [String(Activity.Craft), "#ffd166"],
    [String(Activity.EarnIncome), "#06d6a0"],
    [String(Activity.LearnASpell), "#118ab2"],
    [String(Activity.Retraining), "#073b4c"],
    [String(Activity.Unknown), "#ef233c"],
]);

export async function listDowntimeEntries(characterID: number): Promise<DowntimeEntry[]> {
    let resp = await fetch(`/api/v1/character/${characterID}/downtime`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());

    resp = resp.map((i: any) => {
        return {
            ...i,
            date: new Date(i.date),
            createdAt: new Date(i.createdAt),
            updatedAt: new Date(i.updatedAt),
        };
    });

    return resp;
}

export async function createDowntimeEntries(characterID: number, entries: DowntimeEntry[]): Promise<DowntimeEntry[]> {
    const resp = await fetch(`/api/v1/character/${characterID}/downtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
    });
    return resp.json();
}

export async function updateDowntimeEntry(characterID: number, entry: DowntimeEntry): Promise<DowntimeEntry> {
    const resp = await fetch(`/api/v1/character/${characterID}/downtime`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
    }).then((d) => d.json());
    return {
        ...resp,
        date: new Date(resp.date),
        createdAt: new Date(resp.createdAt),
        updatedAt: new Date(resp.updatedAt),
    };
}
