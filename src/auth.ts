import { Request, Response } from "express";

export function isLoggedIn(req: Request): boolean {
    const user = req.signedCookies["discord-user"];
    return user;
}

export function requireAuthorization(
    fn: (req: Request, res: Response, next: any) => void
): (req: Request, res: Response, next: any) => void {
    return (req: Request, res: Response, next): void => {
        if (!isLoggedIn(req)) {
            res.status(403);
            res.json({ error: "unauthorized" });
            return;
        } else {
            fn(req, res, next);
        }
    };
}

export {};
