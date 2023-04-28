import { NextRequest, NextResponse } from "next/server";
import { StatusError } from "utils/error";
import * as models from "models";
import { prisma } from "utils/db";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";

export default function handle(req: NextRequest, res: NextResponse) {
    switch (req.method) {
        case "GET":
            return characterEndpoint(req, res);
        case "DELETE":
            return deleteCharacter(req, res);
    }
}

export const characterEndpoint = async (req: NextRequest, res: NextResponse) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));
    const id = parseInt(req.query.id);

    var result = await models.getCharacter(id);

    if (result == null) {
        throw new StatusError("Not Found", 404);
    }
    if (result.owner != user.id) {
        throw new StatusError("unauthorized", 403);
    }

    var ret: { [key: string]: any } = { ...result };
    ret.remainingDowntime = await getDowntime(id);

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

export async function getDowntime(id: number): number {
    try {
        var downtime = await prisma.downtimeEntry.findMany({
            where: {
                characterID: id,
                date: {
                    gte: dayjs().subtract(7, "days").toDate(),
                },
                AND: [
                    {
                        NOT: {
                            activity: {
                                contains: "Learn a Spell",
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        NOT: {
                            activity: {
                                contains: "Other",
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            },
        });
        return 7 - downtime.length;
    } catch (e: any) {
        console.log({ e });
        return 0;
    }
}

export const deleteCharacter = async (req: NextRequest, res: NextResponse) => {
    const user = JSON.parse(getCookie("discord-user", { req, res }));
    const id = parseInt(req.query.id);

    await model.deleteCharacter(user.id, id);

    res.status(200).json({ status: 200 });
};
