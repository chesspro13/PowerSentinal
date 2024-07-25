import { Router, Response, Request } from "express";
import {
  getLast,
  getFirst,
  getLoad,
  getOldestRecord,
  getLoadInRange,
  getAll,
} from "./database.js";

export const router = Router();

router.get("/status", (req: Request, res: Response) => {
  res.send(getLast());
});

router.get("/load", (req: Request, res: Response) => {
  res.send(getLoad());
});

router.get("/load/last", (req: Request, res: Response) => {
  res.send(getLast());
});

router.get("/load/first", (req: Request, res: Response) => {
  res.send(getFirst());
});

router.get("/load/all", (req: Request, res: Response) => {
  res.send(getAll());
});

router.get(
  "/load/range/:start/:end/resolution/:resolution",
  (req: Request, res: Response) => {
    res.send(
      getLoadInRange(req.params.start, req.params.end, req.params.resolution)
    );
  }
);

router.get("/date/oldest", (req: Request, res: Response) => {
  res.send(getOldestRecord());
});
