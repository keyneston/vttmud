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

export const authURL = oauth2.generateAuthUrl({
    scope: ["identify", "guilds", "guilds.members.read"],
    state: "foobar", // crypto.randomBytes(16).toString("hex"),
});
