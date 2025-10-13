import { Status } from "@prisma/client";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { CreateAppointmentDto } from "../../domain/dtos/appointment/create-appointment.dto";
import { UpdateAppointmentDto } from "../../domain/dtos/appointment/update-appointment.dto";
import { AppointmentEntity } from "../../domain/entities/appointment.entity";
import { AppointmentDatasource } from "../../domain/datasources/appointment.datasource";

export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private readonly appointmentDatasource: AppointmentDatasource) { }

    create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity> {
        return this.appointmentDatasource.create(createAppointmentDto);
    }

    getAll(): Promise<AppointmentEntity[]> {
        return this.appointmentDatasource.getAll();
    }

    findById(id: number): Promise<AppointmentEntity> {
        return this.appointmentDatasource.findById(id);
    }

    findByPatientId(patientId: number): Promise<AppointmentEntity[]> {
        return this.appointmentDatasource.findByPatientId(patientId);
    }

    findByDoctorId(doctorId: number): Promise<AppointmentEntity[]> {
        return this.appointmentDatasource.findByDoctorId(doctorId);
    }

    findByDateRange(startDate: Date, endDate: Date): Promise<AppointmentEntity[]> {
        return this.appointmentDatasource.findByDateRange(startDate, endDate);
    }

    findByStatus(status: Status): Promise<AppointmentEntity[]> {
        return this.appointmentDatasource.findByStatus(status);
    }

    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentEntity> {
        return this.appointmentDatasource.update(id, updateAppointmentDto);
    }

    delete(id: number): Promise<AppointmentEntity> {
        return this.appointmentDatasource.delete(id);
    }

    getAvailableSlots(doctorId: number, date: Date): Promise<string[]> {
        return this.appointmentDatasource.getAvailableSlots(doctorId, date);
    }
}