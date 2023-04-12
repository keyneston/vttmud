import { Request, Response } from "express";
import { StatusError } from "./error";
import { PrismaClient } from "@prisma/client";

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
        },
    });

    res.json(results);
    return;
};

export const characterEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];
    const id = parseInt(req.params.id);

    var result = await prisma.character.findUnique({
        where: {
            id: id,
        },
    });

    if (result == null) {
        return next(new StatusError("Not Found", 404));
    }
    if (result.owner != user.id) {
        return next(new StatusError("unauthorized", 403));
    }

    var ret: { [key: string]: any } = { ...result };
    try {
        var sums = await prisma.characterLogEntry.groupBy({
            by: ["spend"],
            _sum: {
                gold: true,
                silver: true,
                copper: true,
                platinum: true,
                experience: true,
            },
            where: {
                characterID: id,
            },
        });

        var pos: any;
        var neg: any;

        sums.forEach((x: any) => (x?.spend || false ? (neg = x) : (pos = x)));

        ret.gold = (pos._sum.gold || 0) - (neg._sum.gold || 0);
        ret.platinum = (pos._sum.platinum || 0) - (neg._sum.platinum || 0);
        ret.silver = (pos._sum.silver || 0) - (neg._sum.silver || 0);
        ret.copper = (pos._sum.copper || 0) - (neg._sum.silver || 0);
        // experience is signed so simply add it all together.
        ret.experience = (pos._sum.experience || 0) + (neg._sum.experience || 0);
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
