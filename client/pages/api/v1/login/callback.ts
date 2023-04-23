import { NextResponse, NextRequest } from "next/server";
import DiscordOauth2 from "discord-oauth2";
import { setCookie } from "cookies-next";

if (
    process.env.DISCORD_OAUTH_ID === undefined ||
    process.env.DISCORD_OAUTH_SECRET === undefined ||
    process.env.DISCORD_REDIRECT_URI === undefined
) {
    console.error("DISCORD environment variables must be set.");
    process.exit(1);
}

export const oauth2 = new DiscordOauth2({
    clientId: process.env.DISCORD_OAUTH_ID,
    clientSecret: process.env.DISCORD_OAUTH_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
});

export default async function callbackEndpoint(req: NextRequest, res: NextResponse) {
    let code = req.query.code as string;

    try {
        let response = await oauth2.tokenRequest({
            code: code,
            scope: "identify guilds",
            grantType: "authorization_code",
        });

        setCookie("discord", response, {
            sameSite: true,
            req,
            res,
        });

        let user = await oauth2.getUser(response.access_token);
        setCookie("discord-user", user, { signed: true, sameSite: true, req, res });
    } catch (e: any) {
        res.status(500).json({ error: e.message, description: e?.response?.error_description });
        return;
    }

    res.redirect(302, "/");
    return res;
}
