
import { Request, Response } from "express";

export class AdminController {
  getMetrics = (_req: Request, res: Response) => {
    res.json({ secret: "solo ADMIN ve esto" });
  };
}
