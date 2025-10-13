import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { AuthUser } from "../types/express";

const JWT_SECRET = process.env.JWT_SECRET || "dev";

/**
 * Requiere un token válido y adjunta el usuario a req.user
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid Authorization header" });
    return;
  }

  const token = header.substring("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & Partial<AuthUser>;

    // Valida y normaliza el payload
    const sub = typeof decoded.sub === "string" ? Number(decoded.sub) : decoded.sub;
    const email = decoded.email as string | undefined;
    const role = decoded.role as Role | undefined;

    if (!sub || !email || !role) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    req.user = { sub, email, role };
    next();
    return;
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}

/**
 * Verifica que el usuario autenticado tenga uno de los roles permitidos
 */
export function authorize(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthenticated" });
      return;
    }

    if (allowed.length > 0 && !allowed.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return;
    }

    next();
    return;
  };
}


