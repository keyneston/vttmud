export async function fetchCharacter(id: string | number): Promise<Character> {
    const resp = await fetch(`/api/v1/character/${id}`);
    return resp.json();
}

export async function updateLog(data: CharacterLogEntry): Promise<CharacterLogEntry> {
    var gold =
        (data.spend ? -1 : 1) *
        (Math.abs(data.gold || 0) + Math.abs(data.silver || 0) / 10 + Math.abs(data.copper || 0) / 100);

    const _data = { ...data, gold, silver: null, copper: null };

    console.log({
        _data,
    });

    return await fetch(`/api/v1/character/${data.characterID}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_data),
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

export function calculateLevel(experience: number): number {
    return Math.floor(experience / 1000) + 1;
}

export async function uploadAvatar(id: number, file: Blob) {
    const formData = new FormData();
    formData.append("character", file);

    var value = await fetch(`/api/v1/upload/${id}/avatar`, {
        method: "POST",
        body: formData,
    }).then((resp) => resp.json());

    return value;
}

export {};
