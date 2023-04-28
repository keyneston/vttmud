import { prisma } from "utils/db";
import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "utils/error";
import { getCookie } from "cookies-next";
import { getUserGuilds } from "models/server";

export default async function handler(req: NextRequest, res: NextResponse) {
    switch (req.method) {
        case "GET":
            return getServer(req, res);
    }
}

export async function getServer(req: NextRequest, res: NextResponse) {
    const discord = JSON.parse(getCookie("discord", { req, res }));
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    if (!discord) {
        throw new StatusError("Unauthorized", 403);
    }

    try {
        const guilds = await getUserGuilds(discord);

        const server = await prisma.server.findUnique({
            where: {
                slug: req.query.slug,
            },
            include: {
                Character: true,
            },
        });

        for (const i in guilds) {
            if (guilds[i].id == server?.discordID) {
                return res.json(server);
            }
        }
        throw new StatusError("Not Found", 404);
    } catch (e: any) {
        throw new StatusError("Internal Server Error", 500, e.message);
    }
}
