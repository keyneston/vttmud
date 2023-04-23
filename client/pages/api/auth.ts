import { Request, Response } from "express";
import { StatusError } from "./error";

export function isLoggedIn(req: Request): boolean {
    const user = req.signedCookies["discord-user"];
    return user;
}

export function requireAuthorization(
    fn: (req: Request, res: Response, next: any) => void
): (req: Request, res: Response, next: any) => void {
    return (req: Request, res: Response, next): void => {
        if (!isLoggedIn(req)) {
            return next(new StatusError("unauthorized", 403));
        } else {
            fn(req, res, next);
        }
    };
}

export {};
