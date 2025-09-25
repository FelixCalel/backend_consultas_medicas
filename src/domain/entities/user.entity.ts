
import { Role } from "@prisma/client";

export class UserEntity {
  constructor(
    public id: number,
    public email: string,
    public password,
    public role: Role,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
