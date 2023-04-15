import { Request, Response } from "express";
import { StatusError } from "./error";
import { oauth2 } from "./login";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listServersEndpoint = async (req: Request, res: Response, next: any) => {
    const discord = req.signedCookies["discord"];
    if (!discord) {
        return new StatusError("Unauthorized", 403);
    }

    let guilds = await oauth2.getUserGuilds(discord.access_token);
    let guildIDs = guilds.map((g: any) => g.id);

    let orClauses = guildIDs.map((g: any) => {
        return {
            discordID: g,
        };
    });

    var servers = await prisma.server.findMany({
        where: {
            OR: [...orClauses],
        },
    });
    res.json(servers);
};
