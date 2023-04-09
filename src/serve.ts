import "./env";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import url, { URL, fileURLToPath } from "url";
import audit from "express-requests-logger";
import cookieParser from "cookie-parser";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";

import { appendLogEndpoint } from "./log";
import { callbackEndpoint, loginEndpoint } from "./login";
import { characterEndpoint, characterCreationEndpoint } from "./character";
import { pool } from "./db";

const app = express();
const port = process.env.PORT || 3001;
const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";
const cookiePassword = process.env.COOKIE_PASSWORD || "development";
const s3Bucket = process.env.S3_BUCKET || "";
const s3endpoint = process.env.S3_ENDPOINT || "ams3.digitaloceanspaces.com";
const s3keyID = process.env.S3_KEY_ID || "";
const s3accessKey = process.env.S3_ACCESS_KEY || "";

if (s3Bucket === "" || s3keyID === "" || s3accessKey === "") {
    console.error("S3_BUCKET, S3_KEY_ID and S3_ACCESS_KEY must be set.");
    process.exit(1);
}

const s3Client = new S3({
    credentials: {
        accessKeyId: s3keyID,
        secretAccessKey: s3accessKey,
    },
    endpoint: s3endpoint,
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: s3Bucket,
        acl: "public-read",
        key: function (req: Request, file: any, cb: any) {
            cb(null, file.originalname);
        },
    }),
});

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

app.listen(port, () => console.log(`vttmud-backend listening on port ${port}!`));
