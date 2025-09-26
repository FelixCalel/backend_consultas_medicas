
// src/types/express.d.ts

declare namespace Express {
  export interface Request {
    user?: any; // O un tipo más específico si lo tienes, ej: UserEntity
  }
}
