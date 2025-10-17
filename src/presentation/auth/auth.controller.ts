
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
  ) { }

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

      const firebaseUser = await firebaseAuth.createUser({
        uid: user.id.toString(),
        email: user.email,
        password: registerDto!.password,
        displayName: user.name,
        emailVerified: false,
      });

      console.log("Usuario creado en Firebase:", firebaseUser.uid);

      const verificationLink = await firebaseAuth.generateEmailVerificationLink(
        user.email
      );
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Confirma tu cuenta - SaludAgenda",
        htmlBody: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de cuenta - SaludAgenda</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 40px 30px; text-align: center;">
                <div style="background-color: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 36px; color: white;">⚕️</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">SaludAgenda</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Sistema de Citas Médicas</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">¡Bienvenido/a, ${user.name}!</h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  Gracias por registrarte en <strong>SaludAgenda</strong>. Para completar tu registro y comenzar a gestionar tus citas médicas, necesitamos que confirmes tu dirección de correo electrónico.
                </p>

                <div style="background-color: #e3f2fd; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; color: #1565c0; font-weight: 500;">
                    📧 Tu cuenta está casi lista. Solo falta un paso más.
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" 
                     style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                            color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; 
                            font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);">
                    Confirmar mi cuenta
                  </a>
                </div>

                <!-- Benefits -->
                <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="color: #495057; margin: 0 0 15px; font-size: 18px;">Una vez confirmada tu cuenta podrás:</h3>
                  <ul style="color: #6c757d; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">📅 Agendar citas médicas fácilmente</li>
                    <li style="margin-bottom: 8px;">🔔 Recibir recordatorios automáticos</li>
                    <li style="margin-bottom: 8px;">📋 Gestionar tu historial médico</li>
                    <li style="margin-bottom: 8px;">⚕️ Contactar con profesionales de la salud</li>
                  </ul>
                </div>

                <!-- Security Note -->
                <div style="border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <p style="margin: 0; color: #6c757d; font-size: 14px;">
                    🔒 <strong>Nota de seguridad:</strong> Este enlace de verificación expirará en 24 horas por tu seguridad. 
                    Si no solicitaste esta cuenta, puedes ignorar este correo.
                  </p>
                </div>

                <p style="color: #666; font-size: 14px; margin: 25px 0 0;">
                  Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
                  <a href="${verificationLink}" style="color: #007bff; word-break: break-all;">${verificationLink}</a>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #dee2e6;">
                <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px;">
                  <strong>SaludAgenda</strong> - Tu plataforma de confianza para citas médicas
                </p>
                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                  Este correo fue enviado desde una dirección que no acepta respuestas.<br>
                  © ${new Date().getFullYear()} SaludAgenda. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

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

      try {
        const firebaseUser = await firebaseAuth.getUser(user.id.toString());

        if (!firebaseUser.emailVerified) {
          return res.status(403).json({
            message: "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada y haz clic en el enlace de verificación.",
            requiresEmailVerification: true,
            userEmail: user.email
          });
        }
      } catch (firebaseError) {
        console.warn("Usuario no encontrado en Firebase, pero existe en BD:", firebaseError);
        return res.status(403).json({
          message: "Tu cuenta requiere verificación adicional. Por favor contacta al soporte técnico.",
          requiresEmailVerification: true,
          userEmail: user.email
        });
      }

      const token = this.signToken(user);
      return res.json({ user, token });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  public resendVerificationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    try {
      const user = await this.authRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const firebaseUser = await firebaseAuth.getUser(user.id.toString());
      if (firebaseUser.emailVerified) {
        return res.status(400).json({ message: "El correo electrónico ya está verificado" });
      }

      const verificationLink = await firebaseAuth.generateEmailVerificationLink(email);

      await this.emailService.sendEmail({
        to: email,
        subject: "Confirma tu cuenta - SaludAgenda (Reenvío)",
        htmlBody: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de cuenta - SaludAgenda</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 40px 30px; text-align: center;">
                <div style="background-color: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 36px; color: white;">⚕️</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">SaludAgenda</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Sistema de Citas Médicas</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">¡Hola, ${user.name}! 👋</h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  Hemos reenviado tu enlace de verificación. Para acceder a <strong>SaludAgenda</strong> y gestionar tus citas médicas, necesitas confirmar tu dirección de correo electrónico.
                </p>

                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; color: #856404; font-weight: 500;">
                    🔄 Este es un reenvío del correo de verificación. Si ya confirmaste tu cuenta, puedes ignorar este mensaje.
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" 
                     style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                            color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; 
                            font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);">
                    Confirmar mi cuenta ahora
                  </a>
                </div>

                <!-- Security Note -->
                <div style="border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <p style="margin: 0; color: #6c757d; font-size: 14px;">
                    🔒 <strong>Nota de seguridad:</strong> Este enlace de verificación expirará en 24 horas. 
                    No podrás iniciar sesión hasta verificar tu cuenta.
                  </p>
                </div>

                <p style="color: #666; font-size: 14px; margin: 25px 0 0;">
                  Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
                  <a href="${verificationLink}" style="color: #007bff; word-break: break-all;">${verificationLink}</a>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #dee2e6;">
                <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px;">
                  <strong>SaludAgenda</strong> - Tu plataforma de confianza para citas médicas
                </p>
                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                  Este correo fue enviado desde una dirección que no acepta respuestas.<br>
                  © ${new Date().getFullYear()} SaludAgenda. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      return res.json({
        message: "Correo de verificación reenviado exitosamente. Revisa tu bandeja de entrada.",
        email: email
      });

    } catch (error: any) {
      console.error("Error reenviando correo de verificación:", error);
      return res.status(500).json({
        message: "Error al reenviar el correo de verificación. Inténtalo de nuevo más tarde."
      });
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
