import { loggedIn } from "../cookies/discord";

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

export interface DowntimeEntry {
    id?: number;
    characterID?: number;

    activity: string;
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

export async function listCharacters(): Promise<Character[]> {
    if (!loggedIn()) {
        return [];
    }

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

export async function changeLogEntry(data: CharacterLogEntry): Promise<CharacterLogEntry> {
    return await fetch(`/api/v1/character/${data.characterID}/log`, {
        method: "PATCH",
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

export async function listServers(): Promise<Server[]> {
    const resp = await fetch(`/api/v1/servers`);
    return resp.json();
}

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

export {};
