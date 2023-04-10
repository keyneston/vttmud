import { Request, Response } from "express";
import { Query } from "ts-postgres";
import { pool } from "./db";
import { Client } from "ts-postgres";
import { Character, CharacterLogEntry, Money } from "./types";

export const appendLogEndpoint = async (req: Request, res: Response) => {
    console.log(req.query);
    console.log(req.url);

    res.redirect("/character/1");
};

export const getLogEntriesEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];

    // TODO: restructure this query to ensure character is owned by the requesting user.
    const query = new Query(
        `
SELECT
	l.id,
	c.id,
	experience,
	spend,
	gold,
	silver,
	copper,
	l."createdAt",
	l."updatedAt"
FROM
	character_log AS l
	JOIN characters AS c ON "l"."characterID" = c.id
WHERE
	l."characterID" = $1
	AND c."owner" = $2
LIMIT 50;`,
        [req.params.id, user.id]
    );
    var results = await pool.use(async (c: Client) => {
        const results = await c.execute(query);
        return results;
    });

    var data: CharacterLogEntry[] = [];

    for (const row of results.rows) {
        data.push({
            id: row[0] as number,
            characterID: row[1] as number,
            experience: row[2] as number | undefined,
            createdAt: row[8] as Date,
            updatedAt: row[9] as Date,
        });
    }

    res.json(data);
};
