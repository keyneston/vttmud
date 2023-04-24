import { Request, Response } from "express";

class StatusError extends Error {
    name: string;
    status: number;
    message: string;

    constructor(name: string, status: number, message?: string) {
        super(name);
        this.name = name;
        this.message = message || name;
        this.status = status;
    }
}

interface StatusError extends Error {
    name: string;
    status: number;
    message: string;
}

function errorMiddleware(err: any, req: Request, res: Response, next: any) {
    console.log(`Handling error ${err.status || 500}: ${err.message}`);
    res.status(err.status || 500);
    res.json({ error: err.name || err.message, message: err.message });
}

export { StatusError, errorMiddleware };
