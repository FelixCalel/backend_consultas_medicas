
import { Request, Response } from "express";

export class UserController {
  getProfile = (req: Request, res: Response) => {
    res.json(req.user);
  };
}
