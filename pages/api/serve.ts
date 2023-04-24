/*
import "./env";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import url, { URL, fileURLToPath } from "url";
import audit from "express-requests-logger";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./error";
import { registerRotues } from "./routes";
import { createClient } from "redis";

const app = express();
const port = process.env.PORT || 3001;
const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";
const cookiePassword = process.env.COOKIE_PASSWORD || "development";

export let redisClient = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

// TODO: don't hardcode these paths in in case the location changes from /app/
app.use(express.static(publicFolder));
app.use(express.json());
app.use(cors());
app.use(cookieParser(cookiePassword));
// app.use(
//     audit({
//         excludeURLs: ["0"],
//     })
// );

registerRotues(app);

app.use(errorMiddleware);
app.listen(port, () => console.log(`vttmud-backend listening on port ${port}!`));
*/