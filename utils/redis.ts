import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

(async () => {
    redisClient.on("error", (error) => console.error(`Redis Error : ${error}`));

    await redisClient.connect();
})();
