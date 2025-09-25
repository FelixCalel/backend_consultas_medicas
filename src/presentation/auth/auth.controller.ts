
import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import jwt from "jsonwebtoken";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private signToken = (user: UserEntity) => {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev",
      { expiresIn: "1d" }
    );
  };

  public register = async (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.register(registerDto!);
      const token = this.signToken(user);
      return res.json({ user, token });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.login(loginDto!);
      const token = this.signToken(user);
      return res.json({ user, token });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
}
