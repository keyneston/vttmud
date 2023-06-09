import { redisClient } from "utils/redis";
import { oauth2 } from "utils/discord";

export function hasGuild(user: any, guildID: string): boolean {
    return false;
}

export interface Guild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
}

export async function getUserGuilds(user: any): Guild[] {
    var isCached = false;

    // const redisKey = `${user.id}.guilds`;
    // const cacheResults = await redisClient.get(redisKey);
    let guilds = [];
    // if (cacheResults) {
    //     isCached = true;
    //     guilds = JSON.parse(cacheResults);
    // } else {
    guilds = await oauth2.getUserGuilds(user.access_token);

    //     await redisClient.set(redisKey, JSON.stringify(guilds), {
    //         EX: 3600,
    //     });
    // }

    return guilds;
}
