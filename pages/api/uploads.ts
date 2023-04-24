import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import { getCharacter, setAvatar, setJSON } from "./model";
import { StatusError } from "./error";
import path from "path";


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

export {};
