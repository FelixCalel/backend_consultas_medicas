export class UpdateUserDto {
    private constructor(
        public name?: string,
        public email?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { name, email } = object;

        // Validaciones opcionales
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return ["El email no tiene formato válido"];
        }

        if (name && name.trim().length === 0) {
            return ["El nombre no puede estar vacío"];
        }

        return [undefined, new UpdateUserDto(name, email)];
    }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.name) returnObj.name = this.name;
        if (this.email) returnObj.email = this.email;

        return returnObj;
    }
}