
import { PrismaClient } from "@prisma/client";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class AuthDatasourceImpl implements AuthDatasource {
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return new UserEntity(
      user.id,
      user.name!,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const userExists = await prisma.user.findUnique({
      where: {
        email: registerUserDto.email,
      },
    });

    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: hashedPassword,
        role: registerUserDto.role,
      },
    });

    // Si el usuario es paciente, crear registro de paciente automáticamente
    if (user.role === "PATIENT") {
      // Datos mínimos para paciente
      await prisma.patient.create({
        data: {
          name: user.name || "Paciente",
          birthDate: new Date(), // Se puede actualizar luego
          phone: "",
          address: "",
          userId: user.id,
        },
      });
    }

    return new UserEntity(
      user.id,
      user.name!,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.name!,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }
}
