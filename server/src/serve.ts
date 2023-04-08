import "./env";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import Client from "pg";
import { callbackEndpoint, loginEndpoint } from "./login";
import url, { URL, fileURLToPath } from "url";
import audit from "express-requests-logger";

const app = express();
const port = process.env.PORT || 3001;
const publicFolder = process.env.PUBLIC_FOLDER || "/app/public";

//const client = new Client({ query_timeout: 1000 });
// client.connect()

// TODO: don't hardcode these paths in incase the location changes from /app/
app.use(express.static(publicFolder));
app.use(cors());
app.use(
    audit({
        excludeURLs: ["0"],
    })
);

// Handle GET requests to /api route
app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "Hello from server!" });
});

app.get("/api/v1/login", loginEndpoint);
app.get("/api/v1/login/callback", callbackEndpoint);

/*
app.get("/api/v1/items", (req: Request, res: Response) => {
    var filter = req.query.filter ? `%${req.query.filter}%` : "%";
    client
        .query("SELECT id, name, level, cost FROM items WHERE name ilike $1 LIMIT 50;", [filter])
        .then((results) => {
            res.json(results.rows);
        })
        .catch((e) => {
            console.error(e);
            res.status(500);
            res.json({ error: e.message });
        });
});
*/

// All other GET requests not handled before will return our React app
app.get("*", (req: Request, res: Response) => {
    // TODO: don't hardcode these paths in incase the location changes from /app/
    res.sendFile(path.resolve(publicFolder, "index.html"));
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
