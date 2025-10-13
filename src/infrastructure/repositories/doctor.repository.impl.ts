import { DoctorRepository } from "../../domain/repositories/doctor.repository";
import { CreateDoctorDto } from "../../domain/dtos/doctor/create-doctor.dto";
import { UpdateDoctorDto } from "../../domain/dtos/doctor/update-doctor.dto";
import { DoctorEntity } from "../../domain/entities/doctor.entity";
import { DoctorDatasource } from "../../domain/datasources/doctor.datasource";

export class DoctorRepositoryImpl implements DoctorRepository {
    constructor(private readonly doctorDatasource: DoctorDatasource) { }

    create(createDoctorDto: CreateDoctorDto): Promise<DoctorEntity> {
        return this.doctorDatasource.create(createDoctorDto);
    }

    getAll(): Promise<DoctorEntity[]> {
        return this.doctorDatasource.getAll();
    }

    findById(id: number): Promise<DoctorEntity> {
        return this.doctorDatasource.findById(id);
    }

    findByUserId(userId: number): Promise<DoctorEntity> {
        return this.doctorDatasource.findByUserId(userId);
    }

    findBySpecialty(specialty: string): Promise<DoctorEntity[]> {
        return this.doctorDatasource.findBySpecialty(specialty);
    }

    update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<DoctorEntity> {
        return this.doctorDatasource.update(id, updateDoctorDto);
    }

    delete(id: number): Promise<DoctorEntity> {
        return this.doctorDatasource.delete(id);
    }
}