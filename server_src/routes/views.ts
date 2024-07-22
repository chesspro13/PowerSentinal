import { Router, Response, Request } from "express";
import { getLast } from "../database.js";

export const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("views/main");
});

router.get("/last_reading", (req: Request, res: Response) => {
    res.render("views/last_reading", {
        jsonData: getLast(),
    });
});
