import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { prisma } from "utils/db";

export default async function listCharacters(req: Request, res: Response) {
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    var result = await prisma.character.findMany({
        where: {
            owner: user.id,
        },
    });

    res.json(result);
}
