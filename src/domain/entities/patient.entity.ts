export class PatientEntity {
    constructor(
        public id: number,
        public name: string,
        public birthDate: Date,
        public phone: string,
        public address: string,
        public userId: number,
        public gender?: string,
        public bloodType?: string,
        public emergencyContact?: string,
        public medicalHistory?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): PatientEntity {
        const {
            id,
            name,
            birthDate,
            phone,
            address,
            userId,
            gender,
            bloodType,
            emergencyContact,
            medicalHistory,
            createdAt,
            updatedAt
        } = object;

        return new PatientEntity(
            id,
            name,
            birthDate,
            phone,
            address,
            userId,
            gender,
            bloodType,
            emergencyContact,
            medicalHistory,
            createdAt,
            updatedAt
        );
    }

    get age(): number {
        const today = new Date();
        const birth = new Date(this.birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }
}