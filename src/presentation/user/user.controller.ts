import { Request, Response } from "express";
import { firebaseAuth } from "../auth/firebase";

export class UserController {
  public getProfile = async (req: Request, res: Response) => {
    const userFromJwt = req.user as { sub: number;[key: string]: any };

    if (!userFromJwt || !userFromJwt.sub) {
      return res
        .status(401)
        .json({ message: "Authentication error: User data not found in token" });
    }

    try {
      const firebaseUser = await firebaseAuth.getUser(userFromJwt.sub.toString());
      return res.json({ postgresUser: userFromJwt, firebaseUser: firebaseUser.toJSON() });
    } catch (error) {
      return res.status(404).json({
        message: "User found in local DB but not in Firebase. A sync issue might exist.",
      });
    }
  };
}