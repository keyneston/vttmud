import redis, { RedisClientType } from "redis";

let redisClient: RedisClientType;

(async () => {
    redisClient = redis.createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

export { redisClient };
