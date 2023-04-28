import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "utils/error";
import { DowntimeEntry } from "@prisma/client";
import { prisma } from "utils/db";
import { getCookie } from "cookies-next";

export default async function handler(req: NextRequest, res: NextResponse) {
    switch (req.method) {
        case "GET":
            return await getDowntimeEntriesEndpoint(req, res);
        case "POST":
            return await createDowntimeEntriesEndpoint(req, res);
        case "PATCH":
            return await updateDowntimeEntriesEndpoint(req, res);
    }
}

export const createDowntimeEntriesEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    try {
        const user = JSON.parse(getCookie("discord-user", { req, res }));
        const id = parseInt(req.query.id);

        const character = await prisma.character.findUnique({
            where: {
                id: id,
            },
        });

        if (!character || character.owner != user.id) {
            throw new StatusError("Unauthorized", 403);
        }

        let entries = req.body;
        entries = entries.map((x: DowntimeEntry) => {
            return { ...x, characterID: id, roll: x.assurance ? null : x.roll };
        });

        const results = await prisma.downtimeEntry.createMany({
            data: entries,
        });

        res.json({ status: "success" });
    } catch (e: any) {
        throw new StatusError("Internal Server Error", 500, e.message);
    }
};

export const getDowntimeEntriesEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    try {
        const user = JSON.parse(getCookie("discord-user", { req, res }));
        const id = parseInt(req.query.id);

        const character = await prisma.character.findUnique({
            where: {
                id: id,
            },
            include: {
                DowntimeEntry: {
                    orderBy: {
                        date: "desc",
                    },
                },
            },
        });

        if (!character || character.owner != user.id) {
            throw new StatusError("Unauthorized", 403);
        }

        return res.json(character.DowntimeEntry);
    } catch (e: any) {
        throw new StatusError("Internal Server Error", 500, e.message);
    }
};

export const updateDowntimeEntriesEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    try {
        const user = JSON.parse(getCookie("discord-user", { req, res }));
        const id = parseInt(req.query.id);
        const entry = req.body;

        const character = await prisma.character.findUnique({
            where: {
                id: id,
            },
        });

        if (!character || !user || character.owner != user.id) {
            throw new StatusError("Unauthorized", 403);
        }

        const currentEntry = await prisma.downtimeEntry.findUnique({
            where: {
                id: entry.id,
            },
        });

        // Check if the entry is currently owned by character.
        if (!currentEntry || currentEntry.characterID !== id) {
            throw new StatusError("Unauthorized", 403);
        }

        if (entry.assurance) {
            entry.roll = null;
        }

        const results = await prisma.downtimeEntry.update({
            data: entry,
            where: {
                id: entry.id,
            },
        });

        res.json(results);
    } catch (e: any) {
        throw new StatusError("Internal Server Error", 500, e.message);
    }
};

export {};
