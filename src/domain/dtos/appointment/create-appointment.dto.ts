import { Status } from "@prisma/client";

export class CreateAppointmentDto {
    private constructor(
        public date: Date,
        public time: string,
        public patientId: number,
        public doctorId: number,
        public reason?: string,
        public notes?: string,
        public status?: Status
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateAppointmentDto?] {
        const {
            date,
            time,
            patientId,
            doctorId,
            reason,
            notes,
            status
        } = object;

        if (!date) return ["La fecha es requerida", undefined];
        if (!time) return ["La hora es requerida", undefined];
        if (!patientId) return ["El ID del paciente es requerido", undefined];
        if (!doctorId) return ["El ID del doctor es requerido", undefined];

        // Validar que la fecha sea válida
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) return ["La fecha no es válida", undefined];

        // Validar que la fecha no sea en el pasado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (appointmentDate < today) return ["La fecha no puede ser en el pasado", undefined];

        // Validar formato de hora (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) return ["El formato de hora debe ser HH:MM", undefined];

        return [
            undefined,
            new CreateAppointmentDto(
                appointmentDate,
                time,
                patientId,
                doctorId,
                reason,
                notes,
                status
            ),
        ];
    }
}