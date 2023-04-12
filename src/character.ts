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

    var ret: { [key: string]: any } = { ...result };
    var pos: any;
    var neg: any;

    sums.forEach((x) => (x.spend ? (neg = x) : (pos = x)));

    ret.gold = pos._sum.gold - neg._sum.gold;
    ret.platinum = pos._sum.platinum - neg._sum.platinum;
    ret.silver = pos._sum.silver - neg._sum.silver;
    ret.copper = pos._sum.copper - neg._sum.silver;
    // experience is signed so simply add it all together.
    ret.experience = pos._sum.experience + neg._sum.experience;

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
