import { CreateDoctorDto } from "../dtos/doctor/create-doctor.dto";
import { UpdateDoctorDto } from "../dtos/doctor/update-doctor.dto";
import { DoctorEntity } from "../entities/doctor.entity";

export abstract class DoctorDatasource {
    abstract create(createDoctorDto: CreateDoctorDto): Promise<DoctorEntity>;
    abstract getAll(): Promise<DoctorEntity[]>;
    abstract findById(id: number): Promise<DoctorEntity>;
    abstract findByUserId(userId: number): Promise<DoctorEntity>;
    abstract findBySpecialty(specialty: string): Promise<DoctorEntity[]>;
    abstract update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<DoctorEntity>;
    abstract delete(id: number): Promise<DoctorEntity>;
}