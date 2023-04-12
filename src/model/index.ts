import { PrismaClient, Character } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCharacter(id: number): Promise<Character | null> {
    return await prisma.character.findUnique({
        where: {
            id: id,
        },
    });
}

export async function setAvatar(id: number, path: string): Promise<Character> {
    return await prisma.character.update({
        data: {
            avatar: path,
        },
        where: {
            id: id,
        },
    });
}
