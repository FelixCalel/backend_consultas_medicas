import { PrismaClient, Status } from "@prisma/client";
import { AppointmentDatasource } from "../../domain/datasources/appointment.datasource";
import { CreateAppointmentDto } from "../../domain/dtos/appointment/create-appointment.dto";
import { UpdateAppointmentDto } from "../../domain/dtos/appointment/update-appointment.dto";
import { AppointmentEntity } from "../../domain/entities/appointment.entity";

const prisma = new PrismaClient();

export class AppointmentDatasourceImpl implements AppointmentDatasource {
    async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity> {
        // Verificar que el doctor existe
        const doctorExists = await prisma.doctor.findUnique({
            where: {
                id: createAppointmentDto.doctorId,
            },
        });

        if (!doctorExists) throw new Error("Doctor not found");

        // Verificar que el paciente existe
        const patientExists = await prisma.patient.findUnique({
            where: {
                id: createAppointmentDto.patientId,
            },
        });

        if (!patientExists) throw new Error("Patient not found");

        // Verificar que no hay conflictos de horario
        const conflictingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: createAppointmentDto.doctorId,
                date: createAppointmentDto.date,
                time: createAppointmentDto.time,
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
        });

        if (conflictingAppointment) {
            throw new Error("Doctor is not available at this time");
        }

        const appointment = await prisma.appointment.create({
            data: {
                date: createAppointmentDto.date,
                time: createAppointmentDto.time,
                reason: createAppointmentDto.reason,
                notes: createAppointmentDto.notes,
                status: createAppointmentDto.status || Status.PENDING,
                patientId: createAppointmentDto.patientId,
                doctorId: createAppointmentDto.doctorId,
            },
            include: {
                patient: true,
                doctor: true,
            },
        });

        return AppointmentEntity.fromObject(appointment);
    }

    async getAll(): Promise<AppointmentEntity[]> {
        const appointments = await prisma.appointment.findMany({
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        return appointments.map((appointment) => AppointmentEntity.fromObject(appointment));
    }

    async findById(id: number): Promise<AppointmentEntity> {
        const appointment = await prisma.appointment.findUnique({
            where: {
                id,
            },
            include: {
                patient: true,
                doctor: true,
            },
        });

        if (!appointment) throw new Error("Appointment not found");

        return AppointmentEntity.fromObject(appointment);
    }

    async findByPatientId(patientId: number): Promise<AppointmentEntity[]> {
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId,
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        return appointments.map((appointment) => AppointmentEntity.fromObject(appointment));
    }

    async findByDoctorId(doctorId: number): Promise<AppointmentEntity[]> {
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        return appointments.map((appointment) => AppointmentEntity.fromObject(appointment));
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<AppointmentEntity[]> {
        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        return appointments.map((appointment) => AppointmentEntity.fromObject(appointment));
    }

    async findByStatus(status: Status): Promise<AppointmentEntity[]> {
        const appointments = await prisma.appointment.findMany({
            where: {
                status,
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        return appointments.map((appointment) => AppointmentEntity.fromObject(appointment));
    }

    async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentEntity> {
        const appointmentExists = await prisma.appointment.findUnique({
            where: {
                id,
            },
        });

        if (!appointmentExists) throw new Error("Appointment not found");

        // Si se está actualizando fecha/hora, verificar conflictos
        if (updateAppointmentDto.values.date || updateAppointmentDto.values.time) {
            const date = updateAppointmentDto.values.date || appointmentExists.date;
            const time = updateAppointmentDto.values.time || appointmentExists.time;

            const conflictingAppointment = await prisma.appointment.findFirst({
                where: {
                    doctorId: appointmentExists.doctorId,
                    date,
                    time,
                    status: {
                        in: ['PENDING', 'CONFIRMED'],
                    },
                    NOT: {
                        id,
                    },
                },
            });

            if (conflictingAppointment) {
                throw new Error("Doctor is not available at this time");
            }
        }

        const appointment = await prisma.appointment.update({
            where: {
                id,
            },
            data: updateAppointmentDto.values,
            include: {
                patient: true,
                doctor: true,
            },
        });

        return AppointmentEntity.fromObject(appointment);
    }

    async delete(id: number): Promise<AppointmentEntity> {
        const appointmentExists = await prisma.appointment.findUnique({
            where: {
                id,
            },
        });

        if (!appointmentExists) throw new Error("Appointment not found");

        const appointment = await prisma.appointment.delete({
            where: {
                id,
            },
            include: {
                patient: true,
                doctor: true,
            },
        });

        return AppointmentEntity.fromObject(appointment);
    }

    async getAvailableSlots(doctorId: number, date: Date): Promise<string[]> {
        // Horarios típicos de consulta (8:00 AM - 6:00 PM)
        const allSlots = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00'
        ];

        // Obtener citas ocupadas para ese doctor en esa fecha
        const occupiedAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date,
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
            select: {
                time: true,
            },
        });

        const occupiedSlots = occupiedAppointments.map(appointment => appointment.time);

        // Filtrar horarios disponibles
        return allSlots.filter(slot => !occupiedSlots.includes(slot));
    }
}