import { PrismaClient } from "@prisma/client";
import { DoctorDatasource } from "../../domain/datasources/doctor.datasource";
import { CreateDoctorDto } from "../../domain/dtos/doctor/create-doctor.dto";
import { UpdateDoctorDto } from "../../domain/dtos/doctor/update-doctor.dto";
import { DoctorEntity } from "../../domain/entities/doctor.entity";

const prisma = new PrismaClient();

export class DoctorDatasourceImpl implements DoctorDatasource {
    async create(createDoctorDto: CreateDoctorDto): Promise<DoctorEntity> {
        const doctorExists = await prisma.doctor.findUnique({
            where: {
                email: createDoctorDto.email,
            },
        });

        if (doctorExists) throw new Error("Doctor with this email already exists");

        const licenseExists = await prisma.doctor.findUnique({
            where: {
                licenseNumber: createDoctorDto.licenseNumber,
            },
        });

        if (licenseExists) throw new Error("Doctor with this license number already exists");

        if (createDoctorDto.userId) {
            const userExists = await prisma.doctor.findUnique({
                where: {
                    userId: createDoctorDto.userId,
                },
            });

            if (userExists) throw new Error("User is already associated with a doctor");
        }

        const doctor = await prisma.doctor.create({
            data: {
                name: createDoctorDto.name,
                specialty: createDoctorDto.specialty,
                phone: createDoctorDto.phone,
                email: createDoctorDto.email,
                licenseNumber: createDoctorDto.licenseNumber,
                experience: createDoctorDto.experience,
                education: createDoctorDto.education,
                bio: createDoctorDto.bio,
                consultationFee: createDoctorDto.consultationFee,
                availableHours: createDoctorDto.availableHours,
                userId: createDoctorDto.userId!,
            },
        });

        return DoctorEntity.fromObject(doctor);
    }

    async getAll(): Promise<DoctorEntity[]> {
        const doctors = await prisma.doctor.findMany({
            include: {
                user: true,
                appointments: {
                    include: {
                        patient: true,
                    },
                },
            },
        });

        return doctors.map((doctor) => DoctorEntity.fromObject(doctor));
    }

    async findById(id: number): Promise<DoctorEntity> {
        const doctor = await prisma.doctor.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                appointments: {
                    include: {
                        patient: true,
                    },
                },
            },
        });

        if (!doctor) throw new Error("Doctor not found");

        return DoctorEntity.fromObject(doctor);
    }

    async findByUserId(userId: number): Promise<DoctorEntity> {
        const doctor = await prisma.doctor.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
                appointments: {
                    include: {
                        patient: true,
                    },
                },
            },
        });

        if (!doctor) throw new Error("Doctor not found");

        return DoctorEntity.fromObject(doctor);
    }

    async findBySpecialty(specialty: string): Promise<DoctorEntity[]> {
        const doctors = await prisma.doctor.findMany({
            where: {
                specialty: {
                    contains: specialty,
                    mode: 'insensitive',
                },
            },
            include: {
                user: true,
            },
        });

        return doctors.map((doctor) => DoctorEntity.fromObject(doctor));
    }

    async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<DoctorEntity> {
        const doctorExists = await prisma.doctor.findUnique({
            where: {
                id,
            },
        });

        if (!doctorExists) throw new Error("Doctor not found");

        // Verificar email único si se está actualizando
        if (updateDoctorDto.values.email) {
            const emailExists = await prisma.doctor.findFirst({
                where: {
                    email: updateDoctorDto.values.email,
                    NOT: {
                        id,
                    },
                },
            });

            if (emailExists) throw new Error("Email is already in use by another doctor");
        }

        // Verificar licencia única si se está actualizando
        if (updateDoctorDto.values.licenseNumber) {
            const licenseExists = await prisma.doctor.findFirst({
                where: {
                    licenseNumber: updateDoctorDto.values.licenseNumber,
                    NOT: {
                        id,
                    },
                },
            });

            if (licenseExists) throw new Error("License number is already in use by another doctor");
        }

        const doctor = await prisma.doctor.update({
            where: {
                id,
            },
            data: updateDoctorDto.values,
            include: {
                user: true,
            },
        });

        return DoctorEntity.fromObject(doctor);
    }

    async delete(id: number): Promise<DoctorEntity> {
        const doctorExists = await prisma.doctor.findUnique({
            where: {
                id,
            },
        });

        if (!doctorExists) throw new Error("Doctor not found");

        // Verificar si tiene citas pendientes o confirmadas
        const hasActiveAppointments = await prisma.appointment.findFirst({
            where: {
                doctorId: id,
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
        });

        if (hasActiveAppointments) {
            throw new Error("Cannot delete doctor with active appointments");
        }

        const doctor = await prisma.doctor.delete({
            where: {
                id,
            },
        });

        return DoctorEntity.fromObject(doctor);
    }
}