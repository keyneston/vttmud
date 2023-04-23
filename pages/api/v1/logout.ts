import { NextResponse, NextRequest } from "next/server";
import { deleteCookie } from "cookies-next";
import { useEffect } from "react";
import { DiscordCookie, DiscordUserCookie, DiscordGuildsCookie } from "../../../utils/cookies/discord";

export default async function callbackEndpoint(req: NextRequest, res: NextResponse) {
    deleteCookie(DiscordCookie, { req, res });
    deleteCookie(DiscordUserCookie, { req, res });
    deleteCookie(DiscordGuildsCookie, { req, res });

    return res.redirect("/");
}
