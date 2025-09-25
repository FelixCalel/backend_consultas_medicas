// src/presentation/auth/auth.controller.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { type Request, type Response } from "express";

const prisma = new PrismaClient();

// Aseguramos tipos compatibles con jsonwebtoken@9
const JWT_SECRET: Secret = (process.env.JWT_SECRET ?? "dev") as Secret;
// SignOptions["expiresIn"] acepta number | StringValue ("1d", "2h", etc.)
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  ((process.env.JWT_EXPIRES_IN as unknown) as SignOptions["expiresIn"]) ?? "1d";

type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};

function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  // Forzamos la sobrecarga correcta: (payload, secret: Secret, options?: SignOptions)
  return jwt.sign(payload, JWT_SECRET, options);
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body as {
      email?: string;
      password?: string;
      role?: Role | string;
    };

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Normalizamos/validamos el rol contra el enum de Prisma
    const roleNorm = (role ?? "USER") as Role;
    if (!Object.values(Role).includes(roleNorm)) {
      return res
        .status(400)
        .json({ message: `invalid role. Allowed: ${Object.values(Role).join(", ")}` });
    }

    // En tu esquema el campo es "password"
    const user = await prisma.user.create({
      data: { email, password: hash, role: roleNorm },
    });

    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "register failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "login failed" });
  }
}
