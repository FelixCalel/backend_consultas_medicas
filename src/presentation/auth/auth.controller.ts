
import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import jwt from "jsonwebtoken";
import { UserEntity } from "../../domain/entities/user.entity";
import { firebaseAuth } from "./firebase";
import { EmailService } from "../services/email.service";

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService
  ) {}

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
      // 1. Registrar en tu base de datos de Postgres
      const user = await this.authRepository.register(registerDto!);

      // 2. Crear usuario en Firebase Auth
      const firebaseUser = await firebaseAuth.createUser({
        uid: user.id.toString(),
        email: user.email,
        password: registerDto!.password,
        displayName: user.name,
        emailVerified: false,
      });

      console.log("Usuario creado en Firebase:", firebaseUser.uid);

      // 3. Enviar correo de verificación
      const verificationLink = await firebaseAuth.generateEmailVerificationLink(
        user.email
      );
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Verifica tu cuenta",
        htmlBody: `
          <h3>Hola ${user.name},</h3>
          <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
          <a href="${verificationLink}">Verificar cuenta</a>
        `,
      });

      // 4. Generar el token de sesión de tu aplicación
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

  public verifyPhoneToken = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    try {
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const { uid, phone_number } = decodedToken;

      console.log(`User with phone ${phone_number} and UID ${uid} verified.`);

      return res.json({ message: "Token verified successfully", decodedToken });
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", error: error.message });
    }
  };
}
