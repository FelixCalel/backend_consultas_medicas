import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private signToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "dev", {
      expiresIn: "1d",
    });
  }

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    this.authRepository
      .register(registerUserDto!)
      .then((user) => {
        const token = this.signToken({
          sub: user.id,
          email: user.email,
          role: user.role,
        });
        res.json({ user, token });
      })
      .catch((error) => res.status(400).json({ message: error.message }));
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    this.authRepository
      .login(loginUserDto!)
      .then((user) => {
        const token = this.signToken({
          sub: user.id,
          email: user.email,
          role: user.role,
        });
        res.json({ user, token });
      })
      .catch((error) => res.status(400).json({ message: error.message }));
  };
}