import { Request, Response } from "express";
import { StatusError } from "./error";
import { PrismaClient } from "@prisma/client";
import { getCharacter } from "./model";

const prisma = new PrismaClient();

export const characterCreationEndpoint = async (req: Request, res: Response) => {
    const user = req.signedCookies["discord-user"];
    if (!user) {
        res.status(403);
        res.json({ error: "unauthorized" });
        return;
    }

    var results = await prisma.character.create({
        data: {
            owner: user.id,
            name: req.body.character_name ?? "",
            serverID: req.body.server.id,
        },
    });
    await prisma.characterLogEntry.create({
        data: {
            characterID: results.id,
            gold: req.body.gold,
            description: "Character Creation",
            experience: req.body.experience,
        },
    });

    res.json(results);
    return;
};

export const characterEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];
    const id = parseInt(req.params.id);

    var result = await getCharacter(id);

    if (result == null) {
        return next(new StatusError("Not Found", 404));
    }
    if (result.owner != user.id) {
        return next(new StatusError("unauthorized", 403));
    }

    var ret: { [key: string]: any } = { ...result };

    try {
        var d = new Date();
        d.setDate(new Date().getDate() - 7);

        var downtime = await prisma.downtimeEntry.findMany({
            where: {
                characterID: result.id,
                date: {
                    gte: d,
                },
                NOT: {
                    activity: {
                        contains: "Learn a Spell",
                        mode: "insensitive",
                    },
                },
            },
        });
        var days = 7 - downtime.length;
        ret.remainingDowntime = days >= 0 ? days : 0;
    } catch (e: any) {
        ret.remainingDowntime = 0;
    }

    try {
        var sums = await prisma.characterLogEntry.aggregate({
            _sum: {
                gold: true,
                experience: true,
            },
            where: {
                characterID: id,
            },
        });

        ret.gold = sums?._sum?.gold || 0;
        ret.experience = sums?._sum?.experience || 0;
    } catch (c) {
        // If no rows exist we will get an error. Do nothing.
        ret.experience = 0;
        ret.gold = 0;
    }

    res.json(ret);
};

export const listCharacters = async (req: Request, res: Response) => {
    const user = req.signedCookies["discord-user"];

    var result = await prisma.character.findMany({
        where: {
            owner: user.id,
        },
    });

    res.json(result);
};
