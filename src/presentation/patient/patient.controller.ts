import { Request, Response } from "express";
import { CreatePatientDto } from "../../domain/dtos/patient/create-patient.dto";
import { UpdatePatientDto } from "../../domain/dtos/patient/update-patient.dto";
import { PatientRepository } from "../../domain/repositories/patient.repository";

export class PatientController {
    constructor(private readonly patientRepository: PatientRepository) { }

    public createPatient = async (req: Request, res: Response) => {
        try {
            const [error, createPatientDto] = CreatePatientDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const patient = await this.patientRepository.create(createPatientDto!);

            res.status(201).json({
                ok: true,
                message: "Paciente creado exitosamente",
                data: patient,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("already associated") ? 409 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAllPatients = async (req: Request, res: Response) => {
        try {
            const patients = await this.patientRepository.getAll();

            res.status(200).json({
                ok: true,
                data: patients,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getPatientById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const patient = await this.patientRepository.findById(Number(id));

            res.status(200).json({
                ok: true,
                data: patient,
            });
        } catch (error: any) {
            res.status(404).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getPatientByUserId = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (isNaN(Number(userId))) {
                return res.status(400).json({
                    ok: false,
                    message: "User ID debe ser un número válido",
                });
            }

            const patient = await this.patientRepository.findByUserId(Number(userId));

            res.status(200).json({
                ok: true,
                data: patient,
            });
        } catch (error: any) {
            res.status(404).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public updatePatient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const [error, updatePatientDto] = UpdatePatientDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const patient = await this.patientRepository.update(Number(id), updatePatientDto!);

            res.status(200).json({
                ok: true,
                message: "Paciente actualizado exitosamente",
                data: patient,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public deletePatient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const patient = await this.patientRepository.delete(Number(id));

            res.status(200).json({
                ok: true,
                message: "Paciente eliminado exitosamente",
                data: patient,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("active appointments") ? 409 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };
}