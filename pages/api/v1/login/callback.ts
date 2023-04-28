import { NextResponse, NextRequest } from "next/server";
import DiscordOauth2 from "discord-oauth2";
import { setCookie } from "cookies-next";
import { oauth2 } from "utils/discord";

export default async function callbackEndpoint(req: NextRequest, res: NextResponse) {
    const code = req.query.code as string;

    try {
        const response = await oauth2.tokenRequest({
            code: code,
            scope: "identify guilds",
            grantType: "authorization_code",
        });

        setCookie("discord", JSON.stringify(response), {
            sameSite: true,
            req,
            res,
            path: "/",
        });

        const user = await oauth2.getUser(response.access_token);
        setCookie("discord-user", JSON.stringify(user), { path: "/", signed: true, sameSite: true, req, res });
    } catch (e: any) {
        res.status(500).json({ error: e.message, description: e?.response?.error_description });
        return;
    }

    res.redirect(302, "/");
    return res;
}
