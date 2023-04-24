import { NextRequest, NextResponse } from "next/server";
import DiscordOauth2 from "discord-oauth2";

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

const authURL = oauth2.generateAuthUrl({
    scope: ["identify", "guilds"],
    state: "foobar", // crypto.randomBytes(16).toString("hex"),
});

export default function loginEndpoint(req: Request, res: Response) {
    res.redirect(authURL);
}

export {};
