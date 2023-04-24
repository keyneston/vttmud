import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import { getCharacter, setAvatar, setJSON } from "../../../../../model";
import { getCookie } from "cookies-next";
import { StatusError } from "../../../../../utils/error";
import IFile from "../../../../types/ifile";

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
    forcePathStyle: false,
    credentials: {
        accessKeyId: s3keyID,
        secretAccessKey: s3accessKey,
    },
    region: "us-east-1",
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

export const config = {
  api: {
    bodyParser: false,
  },
}
    

export default async function uploadAvatar(req: Request, res: Response, next: any) {
    const user = JSON.parse(getCookie("discord-user", { req, res }));
    const id = parseInt(req.query.id);

    if (!id) {
        throw new StatusError("Invalid id", 400);
    }

    const character = await getCharacter(id);

    if (!character) {
        throw new StatusError("Invalid id", 400);
    }
    if (character.owner != user.id) {
        throw new StatusError("unauthorized", 403);
    }

    upload.single("character")(req, res, async function (error: any) {
        if (error) {
            throw new StatusError("Error", 500, error);
        }
        if (!req.file) {
            throw new StatusError("Internal Error", 500, "req.file doesn't exist");
        }
        var file: IFile = req.file as IFile;

        var results = await setAvatar(id, file.key || "");
        res.json(results);
    });
}
