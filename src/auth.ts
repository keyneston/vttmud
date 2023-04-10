import { Request, Response } from "express";

export function isLoggedIn(req: Request): boolean {
    const user = req.signedCookies["discord-user"];
    return user;
}

export {};
