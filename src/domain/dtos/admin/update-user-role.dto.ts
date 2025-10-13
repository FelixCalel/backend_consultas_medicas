import { Role } from "@prisma/client";

export class UpdateUserRoleDto {
    private constructor(
        public role: Role
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateUserRoleDto?] {
        const { role } = object;

        if (!role) return ["El rol es requerido"];

        // Verificar que el rol sea válido
        if (!Object.values(Role).includes(role)) {
            return ["Rol no válido. Debe ser: ADMIN, DOCTOR o PATIENT"];
        }

        return [undefined, new UpdateUserRoleDto(role)];
    }
}