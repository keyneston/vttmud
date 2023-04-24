import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "../../../../../utils/error";
import { getCharacter } from "../../../../../model/";
import { prisma } from "../../../../../utils/db";
import { getCookie } from "cookies-next";

export default function handle(req: NextRequest, res: NextResponse, next: any) {
    if (req.method === "GET") {
        return characterEndpoint(req, res);
    }
}

export const characterEndpoint = async (req: NextRequest, res: NextResponse, next: any) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));
    const id = parseInt(req.query.id);

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
