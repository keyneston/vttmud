import { prisma } from "utils/db";
import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "utils/error";
import { getCookie } from "cookies-next";
import { Character, CharacterLogEntry, Money } from "./types";

export default function handler(req: NextRequest, res: NextResponse) {
    switch (req.method) {
        case "GET":
            return getLogEntriesEndpoint(req, res);
        case "POST":
            return appendLogEndpoint(req, res);
        case "PATCH":
            return updateLogEntryEndpoint(req, res);
    }
}

export const appendLogEndpoint = async (req: NextRequest, res: NextResponse) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    const data = await prisma.characterLogEntry.create({
        data: {
            characterID: parseInt(req.query.id),
            gold: req.body.gold,
            experience: req.body.experience,
            description: req.body.description,
        },
    });

    res.json(data);
};

export const getLogEntriesEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    const data = await prisma.characterLogEntry.findMany({
        where: { characterID: parseInt(req.query.id) },
        orderBy: [{ createdAt: "desc" }],
    });

    res.json(data);
};

export const updateLogEntryEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));
    const id = parseInt(req.query.id);
    if (id != req.body.characterID) {
        return next(new StatusError("Bad Request", 400, "url id and body id don't match"));
    }

    const character = await prisma.character.findUnique({
        where: {
            id: id,
        },
    });

    if (!character || character.owner != user.id) {
        return next(new StatusError("Unauthorized", 403));
    }

    const updatedEntry = await prisma.characterLogEntry.update({
        where: {
            id: req.body.id,
        },
        data: {
            ...req.body,
        },
    });

    res.json(updatedEntry);
};
