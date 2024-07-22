import { Router, Response, Request } from "express";
import { getLast } from "./database.js";

export const router = Router();

router.get("/status", (req: Request, res: Response) => {
    res.send(getLast());
});
