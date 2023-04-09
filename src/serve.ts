import "./env";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import url, { URL, fileURLToPath } from "url";
import audit from "express-requests-logger";
import cookieParser from "cookie-parser";

import { appendLogEndpoint } from "./log";
import { callbackEndpoint, loginEndpoint } from "./login";
import { characterEndpoint, characterCreationEndpoint } from "./character";
import { pool } from "./db";

const app = express();
const port = process.env.PORT || 3001;
const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";
const cookiePassword = process.env.COOKIE_PASSWORD || "development";

// TODO: don't hardcode these paths in incase the location changes from /app/
app.use(express.static(publicFolder));
app.use(express.json());
app.use(cors());
app.use(cookieParser(cookiePassword));
app.use(
    audit({
        excludeURLs: ["0"],
    })
);

pool.ready();

// Handle GET requests to /api route
app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "Hello from server!" });
});

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

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
