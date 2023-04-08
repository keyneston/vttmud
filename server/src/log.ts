import { Request, Response } from "express";

export const appendLogEndpoint = async (req: Request, res: Response) => {
    console.log(req.query);
    console.log(req.url);

    res.redirect("/character/1");
};
