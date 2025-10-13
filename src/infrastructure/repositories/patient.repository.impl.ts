import { PatientRepository } from "../../domain/repositories/patient.repository";
import { CreatePatientDto } from "../../domain/dtos/patient/create-patient.dto";
import { UpdatePatientDto } from "../../domain/dtos/patient/update-patient.dto";
import { PatientEntity } from "../../domain/entities/patient.entity";
import { PatientDatasource } from "../../domain/datasources/patient.datasource";

export class PatientRepositoryImpl implements PatientRepository {
    constructor(private readonly patientDatasource: PatientDatasource) { }

    create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
        return this.patientDatasource.create(createPatientDto);
    }

    getAll(): Promise<PatientEntity[]> {
        return this.patientDatasource.getAll();
    }

    findById(id: number): Promise<PatientEntity> {
        return this.patientDatasource.findById(id);
    }

    findByUserId(userId: number): Promise<PatientEntity> {
        return this.patientDatasource.findByUserId(userId);
    }

    update(id: number, updatePatientDto: UpdatePatientDto): Promise<PatientEntity> {
        return this.patientDatasource.update(id, updatePatientDto);
    }

    delete(id: number): Promise<PatientEntity> {
        return this.patientDatasource.delete(id);
    }
}