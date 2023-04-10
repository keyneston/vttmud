import express, { Request, Response } from "express";
import path from "path";

import { appendLogEndpoint } from "./log";
import { callbackEndpoint, loginEndpoint } from "./login";
import { characterEndpoint, characterCreationEndpoint } from "./character";
import { uploadArt } from "./uploads";

const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";

function registerRotues(app: express.Application) {
    app.get("/api/v1/login", loginEndpoint);
    app.get("/api/v1/login/callback", callbackEndpoint);
    app.post("/api/v1/log", appendLogEndpoint);
    app.get("/api/v1/character/:id", characterEndpoint);
    app.post("/api/v1/character", characterCreationEndpoint);

    // All other GET requests not handled before will return our React app
    app.get("*", (req: Request, res: Response) => {
        // TODO: don't hardcode these paths in incase the location changes from /app/
        res.sendFile(path.resolve(publicFolder, "index.html"));
    });

    // Register restricted routes after all normal routes have been registered
    registerRestrictedRoutes(app);

    app.post("/upload", uploadArt);
}

function registerRestrictedRoutes(app: express.Application) {}

export { registerRotues };
