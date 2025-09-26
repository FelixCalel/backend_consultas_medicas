import { Request, Response } from "express";
import { firebaseAuth } from "../auth/firebase";

export class UserController {
  public getProfile = async (req: Request, res: Response) => {
    // `req.user` es el payload que tu middleware de autenticación adjunta a la solicitud.
    // El archivo `src/types/express.d.ts` que creé extiende la interfaz Request para que TypeScript no se queje.
    const userFromJwt = req.user as { sub: number; [key: string]: any };

    if (!userFromJwt || !userFromJwt.sub) {
      return res
        .status(401)
        .json({ message: "Authentication error: User data not found in token" });
    }

    try {
      // Usamos el ID (sub) del token para buscar al usuario en Firebase
      const firebaseUser = await firebaseAuth.getUser(userFromJwt.sub.toString());
      // Devolvemos tanto el usuario de la base de datos local (del token) como el de Firebase.
      return res.json({ postgresUser: userFromJwt, firebaseUser: firebaseUser.toJSON() });
    } catch (error) {
      return res.status(404).json({
        message: "User found in local DB but not in Firebase. A sync issue might exist.",
      });
    }
  };
}