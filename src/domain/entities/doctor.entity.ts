export class DoctorEntity {
    constructor(
        public id: number,
        public name: string,
        public specialty: string,
        public phone: string,
        public email: string,
        public licenseNumber: string,
        public userId: number,
        public experience?: number,
        public education?: string,
        public bio?: string,
        public consultationFee?: number,
        public availableHours?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }

    static fromObject(object: { [key: string]: any }): DoctorEntity {
        const {
            id,
            name,
            specialty,
            phone,
            email,
            licenseNumber,
            userId,
            experience,
            education,
            bio,
            consultationFee,
            availableHours,
            createdAt,
            updatedAt
        } = object;

        return new DoctorEntity(
            id,
            name,
            specialty,
            phone,
            email,
            licenseNumber,
            userId,
            experience,
            education,
            bio,
            consultationFee,
            availableHours,
            createdAt,
            updatedAt
        );
    }
}