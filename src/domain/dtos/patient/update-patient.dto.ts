export class UpdatePatientDto {
    private constructor(
        public name?: string,
        public birthDate?: Date,
        public phone?: string,
        public address?: string,
        public gender?: string,
        public bloodType?: string,
        public emergencyContact?: string,
        public medicalHistory?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdatePatientDto?] {
        const {
            name,
            birthDate,
            phone,
            address,
            gender,
            bloodType,
            emergencyContact,
            medicalHistory
        } = object;

        // Validaciones opcionales
        if (birthDate) {
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) return ["La fecha de nacimiento no es válida", undefined];

            const today = new Date();
            if (birth > today) return ["La fecha de nacimiento no puede ser futura", undefined];

            const age = today.getFullYear() - birth.getFullYear();
            if (age > 150) return ["La fecha de nacimiento no es realista", undefined];
        }

        return [
            undefined,
            new UpdatePatientDto(
                name,
                birthDate ? new Date(birthDate) : undefined,
                phone,
                address,
                gender,
                bloodType,
                emergencyContact,
                medicalHistory
            ),
        ];
    }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.name) returnObj.name = this.name;
        if (this.birthDate) returnObj.birthDate = this.birthDate;
        if (this.phone) returnObj.phone = this.phone;
        if (this.address) returnObj.address = this.address;
        if (this.gender) returnObj.gender = this.gender;
        if (this.bloodType) returnObj.bloodType = this.bloodType;
        if (this.emergencyContact) returnObj.emergencyContact = this.emergencyContact;
        if (this.medicalHistory) returnObj.medicalHistory = this.medicalHistory;

        return returnObj;
    }
}