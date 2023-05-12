import { prisma } from "utils/db";

export async function getCharacter(id: number): Promise<Prisma.Character | null> {
    return await prisma.character.findFirst({
        where: {
            AND: {
                id: id,
                deletedAt: null,
            },
        },
        include: {
            server: true,
        },
    });
}

export async function listCharacters(ownerID: number): Promise<Prisma.Character[]> {
    var result = await prisma.character.findMany({
        where: {
            AND: {
                owner: ownerID,
                deletedAt: null,
            },
        },
    });
    return result;
}

export async function setAvatar(id: number, path: string): Promise<Prisma.Character> {
    return await prisma.character.update({
        data: {
            avatar: path,
        },
        where: {
            id: id,
        },
    });
}

export async function updateCharacter(id: number, owner: string, data: Map<string, any>): Promise<Prisma.Character> {
    return await prisma.character.update({
        data: {
            ...data,
        },
        where: {
            id: id,
            ownerID: owner,
        },
    });
}

export async function setJSON(id: number, blob: any): Promise<Prisma.Character> {
    return await prisma.character.update({
        data: {
            blob: blob,
        },
        where: {
            id: id,
        },
    });
}

export async function deleteCharacter(ownerID: number, id: number): Promise<boolean> {
    await prisma.character.update({
        data: {
            deletedAt: new Date(),
        },
        where: {
            id: id,
            owner: ownerID,
        },
    });

    return true;
}
