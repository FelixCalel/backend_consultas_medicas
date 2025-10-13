import { Status } from "@prisma/client";
import { CreateAppointmentDto } from "../dtos/appointment/create-appointment.dto";
import { UpdateAppointmentDto } from "../dtos/appointment/update-appointment.dto";
import { AppointmentEntity } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
    abstract create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity>;
    abstract getAll(): Promise<AppointmentEntity[]>;
    abstract findById(id: number): Promise<AppointmentEntity>;
    abstract findByPatientId(patientId: number): Promise<AppointmentEntity[]>;
    abstract findByDoctorId(doctorId: number): Promise<AppointmentEntity[]>;
    abstract findByDateRange(startDate: Date, endDate: Date): Promise<AppointmentEntity[]>;
    abstract findByStatus(status: Status): Promise<AppointmentEntity[]>;
    abstract update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentEntity>;
    abstract delete(id: number): Promise<AppointmentEntity>;
    abstract getAvailableSlots(doctorId: number, date: Date): Promise<string[]>;
}