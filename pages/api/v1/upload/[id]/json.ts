import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { getCharacter, setAvatar, setJSON } from "model";
import { StatusError } from "utils/error";
import { getCookie } from "cookies-next";
import path from "path";
import IFile from "types/ifile";

const memoryStorage = multer.memoryStorage(),
    uploadMemory = multer({
        storage: memoryStorage,
    });

export const config = {
  api: {
    bodyParser: false,
  },
}
    

export default async function uploadJSON(req: Request, res: Response, next: any) {
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

    uploadMemory.single("json")(req, res, async function (error: any) {
        if (error) {
            throw new StatusError("Error", 500, error);
        }
        if (!req.file) {
            throw new StatusError("Internal Error", 500, "req.file doesn't exist");
        }
        var file: IFile = req.file as IFile;

        if (!file.buffer) {
            throw new StatusError("Bad Request", 400);
        }

        var results = await setJSON(id, JSON.parse(file.buffer!.toString()));
        res.json(results);
    });
}
