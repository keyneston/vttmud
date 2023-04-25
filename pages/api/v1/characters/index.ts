import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { prisma } from "utils/db";
import * as api from "model";

export default async function listCharacters(req: Request, res: Response) {
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    var result = await api.listCharacters(user.id);
    console.log({ result });

    res.json(result);
}
