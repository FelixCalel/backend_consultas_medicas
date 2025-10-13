import { Request, Response } from "express";
import { CreateDoctorDto } from "../../domain/dtos/doctor/create-doctor.dto";
import { UpdateDoctorDto } from "../../domain/dtos/doctor/update-doctor.dto";
import { DoctorRepository } from "../../domain/repositories/doctor.repository";

export class DoctorController {
    constructor(private readonly doctorRepository: DoctorRepository) { }

    public createDoctor = async (req: Request, res: Response) => {
        try {
            const [error, createDoctorDto] = CreateDoctorDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const doctor = await this.doctorRepository.create(createDoctorDto!);

            res.status(201).json({
                ok: true,
                message: "Doctor creado exitosamente",
                data: doctor,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAllDoctors = async (req: Request, res: Response) => {
        try {
            const doctors = await this.doctorRepository.getAll();

            res.status(200).json({
                ok: true,
                data: doctors,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getDoctorById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const doctor = await this.doctorRepository.findById(Number(id));

            res.status(200).json({
                ok: true,
                data: doctor,
            });
        } catch (error: any) {
            res.status(404).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getDoctorByUserId = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (isNaN(Number(userId))) {
                return res.status(400).json({
                    ok: false,
                    message: "User ID debe ser un número válido",
                });
            }

            const doctor = await this.doctorRepository.findByUserId(Number(userId));

            res.status(200).json({
                ok: true,
                data: doctor,
            });
        } catch (error: any) {
            res.status(404).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getDoctorsBySpecialty = async (req: Request, res: Response) => {
        try {
            const { specialty } = req.params;

            if (!specialty) {
                return res.status(400).json({
                    ok: false,
                    message: "La especialidad es requerida",
                });
            }

            const doctors = await this.doctorRepository.findBySpecialty(specialty);

            res.status(200).json({
                ok: true,
                data: doctors,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public updateDoctor = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const [error, updateDoctorDto] = UpdateDoctorDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const doctor = await this.doctorRepository.update(Number(id), updateDoctorDto!);

            res.status(200).json({
                ok: true,
                message: "Doctor actualizado exitosamente",
                data: doctor,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public deleteDoctor = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const doctor = await this.doctorRepository.delete(Number(id));

            res.status(200).json({
                ok: true,
                message: "Doctor eliminado exitosamente",
                data: doctor,
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