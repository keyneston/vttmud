import { NextRequest, NextResponse } from "next/server";
import { authURL } from "utils/discord";

export default function loginEndpoint(req: Request, res: Response) {
    res.redirect(authURL);
}

export {};
