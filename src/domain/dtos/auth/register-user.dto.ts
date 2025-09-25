
import { Role } from "@prisma/client";

export class RegisterUserDto {
  private constructor(
    public email: string,
    public password: string,
    public role: Role,
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { email, password, role } = object;

    if (!email) return ["Missing email"];
    if (!password) return ["Missing password"];

    return [undefined, new RegisterUserDto(email, password, role)];
  }
}
