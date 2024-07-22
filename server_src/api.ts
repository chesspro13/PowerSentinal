import { Router, Response, Request } from "express";
import { getLast, getLoad, getLoadOverTime, getOldestRecord } from "./database.js";

export const router = Router();

router.get("/status", (req: Request, res: Response) => {
    res.send(getLast());
});

router.get("/load", (req: Request, res: Response) => {
    res.send(getLoad());
});

router.get("/load/overtime", (req: Request, res: Response) => {
    res.send(getLoadOverTime("",""));
});

router.get("/date/oldest", (req: Request, res: Response) => {
    res.send(getOldestRecord());
});

