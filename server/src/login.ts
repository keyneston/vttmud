import { Request, Response } from "express";
import DiscordOauth2 from "discord-oauth2";

if (
    process.env.DISCORD_OAUTH_ID === undefined ||
    process.env.DISCORD_OAUTH_SECRET === undefined ||
    process.env.DISCORD_REDIRECT_URI === undefined
) {
    console.error("DISCORD environment variables must be set.");
    process.exit(1);
}

const oauth2 = new DiscordOauth2({
    clientId: process.env.DISCORD_OAUTH_ID,
    clientSecret: process.env.DISCORD_OAUTH_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
});

const authURL = oauth2.generateAuthUrl({
    scope: ["identify", "guilds"],
    state: "foobar", // crypto.randomBytes(16).toString("hex"),
});

export const loginEndpoint = (req: Request, res: Response) => {
    res.json({ redirect_url: authURL });
};

export const callbackEndpoint = (req: Request, res: Response) => {
    let code = req.query.code as string;

    oauth2
        .tokenRequest({
            code: code,
            scope: "identify guilds",
            grantType: "authorization_code",
        })
        .then((response: any) => {
            console.log(response);
            res.status(200);
            res.json({ status: "success" });
        })
        .catch((e: any) => {
            res.status(500);
            res.json({ error: e.message, description: e.response.error_description });
        });
};

export {};
