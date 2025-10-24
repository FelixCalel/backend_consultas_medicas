// ...eliminar bloque duplicado fuera de la clase...
import { PrismaClient } from "@prisma/client";
import { PatientDatasource } from "../../domain/datasources/patient.datasource";
import { CreatePatientDto } from "../../domain/dtos/patient/create-patient.dto";
import { UpdatePatientDto } from "../../domain/dtos/patient/update-patient.dto";
import { PatientEntity } from "../../domain/entities/patient.entity";

const prisma = new PrismaClient();

export class PatientDatasourceImpl implements PatientDatasource {
    async search(query: string): Promise<PatientEntity[]> {
        // Buscar por nombre, correo o teléfono (case-insensitive)
        const patients = await prisma.patient.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { phone: { contains: query, mode: 'insensitive' } },
                    { user: { email: { contains: query, mode: 'insensitive' } } },
                ],
            },
            include: {
                user: true,
            },
            take: 10, // Limitar resultados para autocompletado
        });
        return patients.map((patient) => PatientEntity.fromObject(patient));
    }
    async create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
        const userExists = await prisma.patient.findUnique({
            where: {
                userId: createPatientDto.userId,
            },
        });

        if (userExists) throw new Error("User is already associated with a patient");

        const patient = await prisma.patient.create({
            data: {
                name: createPatientDto.name,
                birthDate: createPatientDto.birthDate,
                phone: createPatientDto.phone,
                address: createPatientDto.address,
                gender: createPatientDto.gender,
                bloodType: createPatientDto.bloodType,
                emergencyContact: createPatientDto.emergencyContact,
                medicalHistory: createPatientDto.medicalHistory,
                userId: createPatientDto.userId,
            },
        });

        return PatientEntity.fromObject(patient);
    }

    async getAll(): Promise<PatientEntity[]> {
        const patients = await prisma.patient.findMany({
            include: {
                user: true,
                appointments: {
                    include: {
                        doctor: true,
                    },
                },
            },
        });

        return patients.map((patient) => PatientEntity.fromObject(patient));
    }

    async findById(id: number): Promise<PatientEntity> {
        const patient = await prisma.patient.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                appointments: {
                    include: {
                        doctor: true,
                    },
                },
            },
        });

        if (!patient) throw new Error("Patient not found");

        return PatientEntity.fromObject(patient);
    }

    async findByUserId(userId: number): Promise<PatientEntity> {
        const patient = await prisma.patient.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
                appointments: {
                    include: {
                        doctor: true,
                    },
                },
            },
        });

        if (!patient) throw new Error("Patient not found");

        return PatientEntity.fromObject(patient);
    }

    async update(id: number, updatePatientDto: UpdatePatientDto): Promise<PatientEntity> {
        const patientExists = await prisma.patient.findUnique({
            where: {
                id,
            },
        });

        if (!patientExists) throw new Error("Patient not found");

        const patient = await prisma.patient.update({
            where: {
                id,
            },
            data: updatePatientDto.values,
            include: {
                user: true,
            },
        });

        return PatientEntity.fromObject(patient);
    }

    async delete(id: number): Promise<PatientEntity> {
        const patientExists = await prisma.patient.findUnique({
            where: {
                id,
            },
        });

        if (!patientExists) throw new Error("Patient not found");

        // Verificar si tiene citas pendientes o confirmadas
        const hasActiveAppointments = await prisma.appointment.findFirst({
            where: {
                patientId: id,
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
        });

        if (hasActiveAppointments) {
            throw new Error("Cannot delete patient with active appointments");
        }

        const patient = await prisma.patient.delete({
            where: {
                id,
            },
        });

        return PatientEntity.fromObject(patient);
    }
}