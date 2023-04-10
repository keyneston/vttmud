import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";

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

export function uploadArt(req: Request, resp: Response, next: any) {
    // TODO: authenticate user
    // TODO: find way to tie uploaded image to character creation
    upload.single("character")(req, resp, function (error: any) {
        if (error) {
            console.log(error);
            resp.status(500);
            return resp.json({ error: error });
        }
        console.log("File uploaded successfully.");
        resp.redirect("/success");
    });
}

export {};
