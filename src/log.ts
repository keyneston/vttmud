import { Request, Response } from "express";
import { Character, CharacterLogEntry, Money } from "./types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appendLogEndpoint = async (req: Request, res: Response) => {
    console.log("url: ", req.url);
    console.log("params: ", req.params);
    console.log("body: ", req.body);

    const user = req.signedCookies["discord-user"];

    var data = await prisma.characterLogEntry.create({
        data: {
            characterID: parseInt(req.params.id),
            spend: req.body.spend,
            gold: req.body.gold,
            silver: req.body.silver,
            copper: req.body.copper,
            experience: req.body.experience,
            description: req.body.description,
        },
    });

    res.json(data);
};

export const getLogEntriesEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];

    var data = await prisma.characterLogEntry.findMany({
        where: { characterID: parseInt(req.params.id) },
        orderBy: [{ createdAt: "desc" }],
    });

    res.json(data);
};
