import express, { Request, Response } from "express";
import path from "path";

import { appendLogEndpoint, getLogEntriesEndpoint, updateLogEntryEndpoint } from "./log";
import { callbackEndpoint, loginEndpoint } from "./login";
import { listCharacters, characterEndpoint, characterCreationEndpoint } from "./character";
import { uploadAvatar, uploadJSON } from "./uploads";
import { requireAuthorization } from "./auth";
import { listServersEndpoint } from "./servers";

const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";

function registerRotues(app: express.Application) {
    app.get("/api/v1/login", loginEndpoint);
    app.get("/api/v1/login/callback", callbackEndpoint);

    // Register restricted routes after all normal routes have been registered
    registerRestrictedRoutes(app);

    // All other GET requests not handled before will return our React app
    app.get("*", (req: Request, res: Response) => {
        // TODO: don't hardcode these paths in incase the location changes from /app/
        res.sendFile(path.resolve(publicFolder, "index.html"));
    });
}

function registerRestrictedRoutes(app: express.Application) {
    app.get("/api/v1/characters", requireAuthorization(listCharacters));
    app.post("/api/v1/character", requireAuthorization(characterCreationEndpoint));

    app.get("/api/v1/character/:id", requireAuthorization(characterEndpoint));

    app.get("/api/v1/character/:id/log", requireAuthorization(getLogEntriesEndpoint));
    app.post("/api/v1/character/:id/log", requireAuthorization(appendLogEndpoint));
    app.patch("/api/v1/character/:id/log", requireAuthorization(updateLogEntryEndpoint));

    app.post("/api/v1/upload/:id/avatar", requireAuthorization(uploadAvatar));
    app.post("/api/v1/upload/:id/json", requireAuthorization(uploadJSON));

    app.get("/api/v1/servers", requireAuthorization(listServersEndpoint));
}

export { registerRotues };
