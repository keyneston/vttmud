import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "../error";
import { oauth2 } from "./login";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { createClient } from "redis";
import { prisma } from "../../../utils/db";

export let redisClient = createClient({
    url: process.env.REDIS_URL,
});

(async () => {
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

const upsertStaticServers = async () => {
    let results = await prisma.server.createMany({
        data: [
            { id: 1, discordID: "802423566196539412", name: "Covalon" },
            { id: 2, discordID: "1079822138900492320", name: "Thistle Academy" },
        ],
        skipDuplicates: true,
    });
};

// make sure the servers list is accurate at boot
upsertStaticServers();

export default async function listServersEndpoint(req: Request, res: Response, next: any) {
    const discord = JSON.parse(getCookie("discord", { req, res }));
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    var isCached = false;

    if (!discord) {
        throw new StatusError("Unauthorized", 403);
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

            await redisClient.set(redisKey, JSON.stringify(guilds), {
                EX: 3600,
            });
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
        throw new StatusError("Internal Server Error", 500, e.message);
    }
}
