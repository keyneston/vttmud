import { Client } from "ts-postgres";
import { createPool } from "generic-pool";

const config = {
    // TODO: these can be replaced with PGHOST, etc env variables.
    host: process.env.DATABASE_HOST ?? "localhost",
    port: parseInt(process.env.DATABASE_PORT ?? "5432"),
    database: process.env.DATABASE_NAME ?? "tabitha", // TODO: better generic db name
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
};

export const pool = createPool(
    {
        create: async () => {
            const client = new Client(config);
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
