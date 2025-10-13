
// src/types/express.d.ts
import { Role } from "@prisma/client";

export type AuthUser = { sub: number; email: string; role: Role };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
