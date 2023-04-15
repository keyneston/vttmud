import Prisma, { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCharacter(id: number): Promise<Prisma.Character | null> {
    return await prisma.character.findUnique({
        where: {
            id: id,
        },
        include: {
            server: true,
        }
    });
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
