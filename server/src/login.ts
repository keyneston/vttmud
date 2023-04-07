import { Request, Response } from "express";

const DiscordOauth2 = require("discord-oauth2");

var oauth2 = new DiscordOauth2({
    clientId: process.env.DISCORD_OAUTH_ID,
    clientSecret: process.env.DISCORD_OAUTH_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
});

export const loginEndpoint = (req: Request, res: Response) => {
    oauth2
        .tokenRequest({
            code: "query code",
            scope: "identify guilds",
            grantType: "authorization_code",
        })
        .then(console.log);
};

export {};
