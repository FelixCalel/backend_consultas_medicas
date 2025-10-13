import { Status } from "@prisma/client";

export class AppointmentEntity {
    constructor(
        public id: number,
        public date: Date,
        public time: string,
        public status: Status,
        public patientId: number,
        public doctorId: number,
        public reason?: string,
        public notes?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public patient?: any,
        public doctor?: any
    ) { }

    static fromObject(object: { [key: string]: any }): AppointmentEntity {
        const {
            id,
            date,
            time,
            status,
            patientId,
            doctorId,
            reason,
            notes,
            createdAt,
            updatedAt,
            patient,
            doctor
        } = object;

        return new AppointmentEntity(
            id,
            date,
            time,
            status,
            patientId,
            doctorId,
            reason,
            notes,
            createdAt,
            updatedAt,
            patient,
            doctor
        );
    }

    get isToday(): boolean {
        const today = new Date();
        const appointmentDate = new Date(this.date);

        return today.toDateString() === appointmentDate.toDateString();
    }

    get isPending(): boolean {
        return this.status === Status.PENDING;
    }

    get isConfirmed(): boolean {
        return this.status === Status.CONFIRMED;
    }

    get isCancelled(): boolean {
        return this.status === Status.CANCELLED;
    }

    get formattedDateTime(): string {
        const date = new Date(this.date);
        return `${date.toLocaleDateString()} ${this.time}`;
    }
}