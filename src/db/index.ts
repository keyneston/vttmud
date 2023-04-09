import { Client } from "ts-postgres";
import { createPool } from "generic-pool";

export const pool = createPool(
    {
        create: async () => {
            const client = new Client({
                host: process.env.DATABASE_HOST ?? "localhost",
                port: parseInt(process.env.DATABASE_PORT ?? "5432"),
                database: process.env.DATABASE_NAME ?? "tabitha", // TODO: better generic db name
            });
            return client.connect().then(() => {
                client.on("error", console.log);
                return client;
            });
        },
        destroy: async (client: Client) => {
            return client.end().then(() => {});
        },
        validate: (client: Client) => {
            return Promise.resolve(!client.closed);
        },
    },
    { testOnBorrow: true }
);
