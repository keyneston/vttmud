import { NextRequest, NextResponse } from "next/server";
import { authURL, oauth2 } from "utils/discord";

export default function loginEndpoint(req: Request, res: Response) {
    res.redirect(authURL);
}

export {};
