import { Status } from "@prisma/client";

export class UpdateAppointmentDto {
    private constructor(
        public date?: Date,
        public time?: string,
        public reason?: string,
        public notes?: string,
        public status?: Status
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateAppointmentDto?] {
        const {
            date,
            time,
            reason,
            notes,
            status
        } = object;

        // Validaciones opcionales
        if (date) {
            const appointmentDate = new Date(date);
            if (isNaN(appointmentDate.getTime())) return ["La fecha no es válida", undefined];

            // Validar que la fecha no sea en el pasado
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (appointmentDate < today) return ["La fecha no puede ser en el pasado", undefined];
        }

        if (time) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(time)) return ["El formato de hora debe ser HH:MM", undefined];
        }

        if (status && !Object.values(Status).includes(status)) {
            return ["El estado no es válido", undefined];
        }

        return [
            undefined,
            new UpdateAppointmentDto(
                date ? new Date(date) : undefined,
                time,
                reason,
                notes,
                status
            ),
        ];
    }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.date) returnObj.date = this.date;
        if (this.time) returnObj.time = this.time;
        if (this.reason) returnObj.reason = this.reason;
        if (this.notes) returnObj.notes = this.notes;
        if (this.status) returnObj.status = this.status;

        return returnObj;
    }
}