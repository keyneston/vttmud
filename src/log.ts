import { Request, Response } from "express";
import { Character, CharacterLogEntry, Money } from "./types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appendLogEndpoint = async (req: Request, res: Response) => {
    const user = req.signedCookies["discord-user"];

    var data = await prisma.characterLogEntry.create({
        data: {
            characterID: parseInt(req.params.id),
            gold: (req.body.spend ? -1 : 1) * req.body.gold + req.body.silver / 10 + req.body.copper / 100,
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
