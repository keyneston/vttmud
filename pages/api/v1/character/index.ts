import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { getCookie } from "cookies-next";

export default async function characterCreationEndpoint(req: NextRequest, res: NextResponse) {
    if (req.method !== "POST") {
        res.status(400);
        res.json({ error: "Bad Request" });
        return
    }

    const user = JSON.parse(getCookie("discord-user", { req, res }));
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
