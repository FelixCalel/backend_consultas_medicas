export class CreatePatientDto {
    private constructor(
        public name: string,
        public birthDate: Date,
        public phone: string,
        public address: string,
        public userId: number,
        public gender?: string,
        public bloodType?: string,
        public emergencyContact?: string,
        public medicalHistory?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreatePatientDto?] {
        const {
            name,
            birthDate,
            phone,
            address,
            userId,
            gender,
            bloodType,
            emergencyContact,
            medicalHistory
        } = object;

        if (!name) return ["El nombre es requerido", undefined];
        if (!birthDate) return ["La fecha de nacimiento es requerida", undefined];
        if (!phone) return ["El teléfono es requerido", undefined];
        if (!address) return ["La dirección es requerida", undefined];
        if (!userId) return ["El ID del usuario es requerido", undefined];

        // Validar fecha de nacimiento
        const birth = new Date(birthDate);
        if (isNaN(birth.getTime())) return ["La fecha de nacimiento no es válida", undefined];

        const today = new Date();
        if (birth > today) return ["La fecha de nacimiento no puede ser futura", undefined];

        // Calcular edad mínima (debe ser mayor a 0 años)
        const age = today.getFullYear() - birth.getFullYear();
        if (age > 150) return ["La fecha de nacimiento no es realista", undefined];

        return [
            undefined,
            new CreatePatientDto(
                name,
                birth,
                phone,
                address,
                userId,
                gender,
                bloodType,
                emergencyContact,
                medicalHistory
            ),
        ];
    }
}