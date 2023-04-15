import { Request, Response } from "express";
import { StatusError } from "./error";
import { oauth2 } from "./login";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "./redis";

const prisma = new PrismaClient();

export const listServersEndpoint = async (req: Request, res: Response, next: any) => {
    const discord = req.signedCookies["discord"];
    const user = req.signedCookies["discord-user"];

    var isCached = false;

    if (!discord) {
        return new StatusError("Unauthorized", 403);
    }

    let guilds;

    try {
        const redisKey = `${user.id}.guilds`;
        const cacheResults = await redisClient.get(redisKey);
        if (cacheResults) {
            isCached = true;
            guilds = JSON.parse(cacheResults);
        } else {
            guilds = await oauth2.getUserGuilds(discord.access_token);

            await redisClient.set(redisKey, JSON.stringify(guilds));
        }

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
    } catch (e: any) {
        return new StatusError("Internal Server Error", 500, e.message);
    }
};
