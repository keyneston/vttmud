import express, { Request, Response } from "express";
import { StatusError } from "../../error";
import { PrismaClient, DowntimeEntry } from "@prisma/client";

const prisma = new PrismaClient();

export const createDowntimeEntriesEndpoint = async (req: Request, res: Response, next: any) => {
    try {
        const user = req.signedCookies["discord-user"];
        const id = parseInt(req.params.id);

        var character = await prisma.character.findUnique({
            where: {
                id: id,
            },
        });

        if (!character || character.owner != user.id) {
            return next(new StatusError("Unauthorized", 403));
        }

        var entries = req.body;
        entries = entries.map((x: DowntimeEntry) => {
            return { ...x, characterID: id };
        });

        const results = await prisma.downtimeEntry.createMany({
            data: entries,
        });

        console.log("results: ", JSON.stringify(results));

        res.json({ status: "success" });
    } catch (e: any) {
        return next(new StatusError("Internal Server Error", 500, e.message));
    }
};

export const getDowntimeEntriesEndpoint = async (req: Request, res: Response, next: any) => {
    try {
        const user = req.signedCookies["discord-user"];
        const id = parseInt(req.params.id);

        var character = await prisma.character.findUnique({
            where: {
                id: id,
            },
            include: {
                DowntimeEntry: true,
            },
        });

        if (!character || character.owner != user.id) {
            return next(new StatusError("Unauthorized", 403));
        }

        console.log("Returning endpoints: ", character.DowntimeEntry);

        return res.json(character.DowntimeEntry);
    } catch (e: any) {
        return next(new StatusError("Internal Server Error", 500, e.message));
    }
};

export {};
