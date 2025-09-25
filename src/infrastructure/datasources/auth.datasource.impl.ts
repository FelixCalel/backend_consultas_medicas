
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

    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const userExists = await prisma.user.findUnique({
      where: {
        email: registerUserDto.email,
      },
    });

    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const user = await prisma.user.create({
      data: {
        email: registerUserDto.email,
        password: hashedPassword,
        role: registerUserDto.role,
      },
    });

    return user;
  }
}
