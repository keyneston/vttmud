import { Request, Response } from "express";
import { Query } from "ts-postgres";
import { pool } from "./db";
import { StatusError } from "./error";
import { Character } from "./types";

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

export const characterEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];

    const query = new Query("SELECT owner, name FROM characters WHERE id=$1 and owner=$2 limit 1;", [
        req.params.id,
        user.id,
    ]);
    var results = await pool.use(async (c) => {
        const results = await c.execute(query);
        return results;
    });
    var data = { owner: "", name: "" };

    if (results.rows.length == 0) {
        return next(new StatusError("Not Found", 404));
    }

    for (const row of results.rows) {
        data.owner = row[0] as string;
        data.name = row[1] as string;
        break;
    }

    res.json(data);
};

export const listCharacters = async (req: Request, res: Response) => {
    const user = req.signedCookies["discord-user"];

    const query = new Query("SELECT id, owner, name FROM characters WHERE owner=$1 limit 50;", [user.id]);

    var data: Character[] = [];
    var results = await pool.use(async (c) => {
        const results = await c.execute(query);
        return results;
    });

    for (const row of results.rows) {
        data.push({
            id: row[0] as number,
            owner: row[1] as string,
            name: row[2] as string,
        });
    }

    res.json(data);
};
