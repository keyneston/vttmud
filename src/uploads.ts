import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import { getCharacter, setAvatar, setJSON } from "./model";
import { StatusError } from "./error";
import path from "path";

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
            cb(null, file.fieldname + "/" + file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        },
    }),
});

const memoryStorage = multer.memoryStorage(),
    uploadMemory = multer({
        storage: memoryStorage,
    });

interface IFile {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    size?: number;
    bucket?: string;
    key?: string;
    acl?: string;
    contentType?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    storageClass?: string;
    serverSideEncryption?: string;
    location?: string;
    etag?: string;
    buffer?: Buffer;
}

export async function uploadAvatar(req: Request, resp: Response, next: any) {
    const user = req.signedCookies["discord-user"];
    const id = parseInt(req.params.id);

    if (!id) {
        return next(new StatusError("Invalid id", 400));
    }

    const character = await getCharacter(id);

    if (!character) {
        return next(new StatusError("Invalid id", 400));
    }
    if (character.owner != user.id) {
        return next(new StatusError("unauthorized", 403));
    }

    upload.single("character")(req, resp, async function (error: any) {
        if (error) {
            resp.status(500);
            return resp.json({ error: error });
        }
        if (!req.file) {
            return next(new StatusError("Internal Error", 500));
        }
        var file: IFile = req.file as IFile;

        var results = await setAvatar(id, file.key || "");
        resp.json(results);
    });
}

export async function uploadJSON(req: Request, resp: Response, next: any) {
    const user = req.signedCookies["discord-user"];
    const id = parseInt(req.params.id);

    if (!id) {
        return next(new StatusError("Invalid id", 400));
    }

    const character = await getCharacter(id);

    if (!character) {
        return next(new StatusError("Invalid id", 400));
    }
    if (character.owner != user.id) {
        return next(new StatusError("unauthorized", 403));
    }

    uploadMemory.single("json")(req, resp, async function (error: any) {
        if (error) {
            next(new StatusError("Error", 500, error));
        }
        if (!req.file) {
            return next(new StatusError("Internal Error", 500, "req.file doesn't exist"));
        }
        var file: IFile = req.file as IFile;

        if (!file.buffer) {
            return next(new StatusError("Bad Request", 400));
        }

        var results = await setJSON(id, JSON.parse(file.buffer!.toString()));
        resp.json(results);
    });
}

export {};
