import { CreatePatientDto } from "../dtos/patient/create-patient.dto";
import { UpdatePatientDto } from "../dtos/patient/update-patient.dto";
import { PatientEntity } from "../entities/patient.entity";

export abstract class PatientRepository {
    abstract create(createPatientDto: CreatePatientDto): Promise<PatientEntity>;
    abstract getAll(): Promise<PatientEntity[]>;
    abstract findById(id: number): Promise<PatientEntity>;
    abstract findByUserId(userId: number): Promise<PatientEntity>;
    abstract update(id: number, updatePatientDto: UpdatePatientDto): Promise<PatientEntity>;
    abstract delete(id: number): Promise<PatientEntity>;
    abstract search(query: string): Promise<PatientEntity[]>;
}