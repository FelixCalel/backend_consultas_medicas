export class CreateDoctorDto {
    private constructor(
        public name: string,
        public specialty: string,
        public phone: string,
        public email: string,
        public licenseNumber: string,
        public experience?: number,
        public education?: string,
        public bio?: string,
        public consultationFee?: number,
        public availableHours?: string,
        public userId?: number
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateDoctorDto?] {
        const {
            name,
            specialty,
            phone,
            email,
            licenseNumber,
            experience,
            education,
            bio,
            consultationFee,
            availableHours,
            userId
        } = object;

        if (!name) return ["El nombre es requerido", undefined];
        if (!specialty) return ["La especialidad es requerida", undefined];
        if (!phone) return ["El teléfono es requerido", undefined];
        if (!email) return ["El email es requerido", undefined];
        if (!licenseNumber) return ["El número de licencia es requerido", undefined];

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ["El email no tiene formato válido", undefined];

        if (experience && experience < 0) return ["La experiencia no puede ser negativa", undefined];
        if (consultationFee && consultationFee < 0) return ["La tarifa de consulta no puede ser negativa", undefined];

        return [
            undefined,
            new CreateDoctorDto(
                name,
                specialty,
                phone,
                email,
                licenseNumber,
                experience,
                education,
                bio,
                consultationFee,
                availableHours,
                userId
            ),
        ];
    }
}