export class UpdateDoctorDto {
    private constructor(
        public name?: string,
        public specialty?: string,
        public phone?: string,
        public email?: string,
        public licenseNumber?: string,
        public experience?: number,
        public education?: string,
        public bio?: string,
        public consultationFee?: number,
        public availableHours?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateDoctorDto?] {
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
            availableHours
        } = object;

        // Validaciones opcionales
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return ["El email no tiene formato válido", undefined];
        }

        if (experience && experience < 0) return ["La experiencia no puede ser negativa", undefined];
        if (consultationFee && consultationFee < 0) return ["La tarifa de consulta no puede ser negativa", undefined];

        return [
            undefined,
            new UpdateDoctorDto(
                name,
                specialty,
                phone,
                email,
                licenseNumber,
                experience,
                education,
                bio,
                consultationFee,
                availableHours
            ),
        ];
    }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.name) returnObj.name = this.name;
        if (this.specialty) returnObj.specialty = this.specialty;
        if (this.phone) returnObj.phone = this.phone;
        if (this.email) returnObj.email = this.email;
        if (this.licenseNumber) returnObj.licenseNumber = this.licenseNumber;
        if (this.experience !== undefined) returnObj.experience = this.experience;
        if (this.education) returnObj.education = this.education;
        if (this.bio) returnObj.bio = this.bio;
        if (this.consultationFee !== undefined) returnObj.consultationFee = this.consultationFee;
        if (this.availableHours) returnObj.availableHours = this.availableHours;

        return returnObj;
    }
}