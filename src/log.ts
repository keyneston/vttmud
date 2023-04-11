import { Request, Response } from "express";
import { Character, CharacterLogEntry, Money } from "./types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appendLogEndpoint = async (req: Request, res: Response) => {
    console.log(req.query);
    console.log(req.url);

    res.redirect("/character/1");
};

export const getLogEntriesEndpoint = async (req: Request, res: Response, next: any) => {
    const user = req.signedCookies["discord-user"];

    var data = await prisma.characterLogEntry.findMany({
        where: { characterID: parseInt(req.params.id) },
    });

    res.json(data);
};
