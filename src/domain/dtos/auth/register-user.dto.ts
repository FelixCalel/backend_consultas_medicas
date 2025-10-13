
import { Role } from "@prisma/client";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: Role
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password, role } = object;

    if (!name) return ["El nombre es requerido"];
    if (!email) return ["El email es requerido"];
    if (!password) return ["La contraseña es requerida"];

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return ["El email no tiene formato válido"];

    // Validación de contraseña
    if (password.length < 6) return ["La contraseña debe tener al menos 6 caracteres"];

    // Por defecto, todos los usuarios nuevos son PATIENT
    const userRole = role || Role.PATIENT;

    return [undefined, new RegisterUserDto(name, email, password, userRole)];
  }
}
