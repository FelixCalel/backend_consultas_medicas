
import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { LoginUserDto } from "../dtos/auth/login-user.dto";

export abstract class AuthDatasource {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  abstract getUserByEmail(email: string): Promise<UserEntity | null>;
}
