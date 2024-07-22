import { Router, Response, Request } from "express";
import { getLast, getLoad } from "./database.js";

export const router = Router();

router.get("/status", (req: Request, res: Response) => {
    res.send(getLast());
});

router.get("/load", (req: Request, res: Response) => {
    res.send(getLoad());
});
