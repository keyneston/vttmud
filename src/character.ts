import { Request, Response } from "express";
import { Query } from "ts-postgres";
import { pool } from "./db";

export const characterCreationEndpoint = async (req: Request, res: Response) => {
    const user = req.signedCookies["discord-user"];
    if (!user) {
        res.status(403);
        res.json({ error: "unauthorized" });
        return;
    }

    const query = new Query("INSERT into characters (owner, name) VALUES ($1, $2) RETURNING id", [
        user.id,
        req.body.character_name,
    ]);

    var results = await pool.use(async (c) => {
        const results = await c.execute(query);
        return results;
    });
    for (const row of results.rows) {
        res.json({ id: row[0] });
        return;
    }
};

export const characterEndpoint = async (req: Request, res: Response) => {
    const query = new Query("SELECT owner, name FROM characters WHERE id=$1 limit 1;", [req.params.id]);
    var results = await pool.use(async (c) => {
        const results = await c.execute(query);
        return results;
    });
    var data = { owner: 0, name: "" };
    for (const row of results.rows) {
        data.owner = row[0] as number;
        data.name = row[1] as string;
        break;
    }

    const user = req.signedCookies["discord-user"];
    if (!user || user.id != data.owner) {
        res.status(403);
        res.json({ error: "unauthorized" });
        return;
    }

    res.json(data);
};
