import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import * as api from "models";

export default async function listCharacters(req: Request, res: Response) {
    const user = JSON.parse(getCookie("discord-user", { req, res }));

    const result = await api.listCharacters(user.id);
    res.json(result);
}
