import { Request, Response } from "express";
import { Status } from "@prisma/client";
import { CreateAppointmentDto } from "../../domain/dtos/appointment/create-appointment.dto";
import { UpdateAppointmentDto } from "../../domain/dtos/appointment/update-appointment.dto";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { EmailService } from "../services/email.service";

export class AppointmentController {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly emailService: EmailService
    ) { }

    public createAppointment = async (req: Request, res: Response) => {
        try {
            const [error, createAppointmentDto] = CreateAppointmentDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const appointment = await this.appointmentRepository.create(createAppointmentDto!);

            // Enviar notificación por email al paciente
            try {
                await this.emailService.sendAppointmentConfirmation({
                    patientName: appointment.patient?.name || 'Paciente',
                    patientEmail: appointment.patient?.email || '',
                    doctorName: appointment.doctor?.name || 'Doctor',
                    doctorSpecialty: appointment.doctor?.specialty || 'Medicina General',
                    appointmentDate: appointment.date,
                    description: appointment.reason,
                    consultationFee: appointment.doctor?.consultationFee,
                    appointmentId: appointment.id
                });
                console.log(`Email de confirmación enviado a ${appointment.patient?.email}`);
            } catch (emailError) {
                console.error('Error enviando email de confirmación:', emailError);
                // No fallar la creación de la cita si falla el email
            }

            res.status(201).json({
                ok: true,
                message: "Cita médica creada exitosamente",
                data: appointment,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("not available") ? 409 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAllAppointments = async (req: Request, res: Response) => {
        try {
            const appointments = await this.appointmentRepository.getAll();

            res.status(200).json({
                ok: true,
                data: appointments,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAppointmentById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const appointment = await this.appointmentRepository.findById(Number(id));

            res.status(200).json({
                ok: true,
                data: appointment,
            });
        } catch (error: any) {
            res.status(404).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAppointmentsByPatient = async (req: Request, res: Response) => {
        try {
            const { patientId } = req.params;

            if (isNaN(Number(patientId))) {
                return res.status(400).json({
                    ok: false,
                    message: "Patient ID debe ser un número válido",
                });
            }

            const appointments = await this.appointmentRepository.findByPatientId(Number(patientId));

            res.status(200).json({
                ok: true,
                data: appointments,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAppointmentsByDoctor = async (req: Request, res: Response) => {
        try {
            const { doctorId } = req.params;

            if (isNaN(Number(doctorId))) {
                return res.status(400).json({
                    ok: false,
                    message: "Doctor ID debe ser un número válido",
                });
            }

            const appointments = await this.appointmentRepository.findByDoctorId(Number(doctorId));

            res.status(200).json({
                ok: true,
                data: appointments,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAppointmentsByDateRange = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    ok: false,
                    message: "startDate y endDate son requeridos",
                });
            }

            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                    ok: false,
                    message: "Fechas no válidas",
                });
            }

            if (start > end) {
                return res.status(400).json({
                    ok: false,
                    message: "La fecha de inicio debe ser anterior a la fecha de fin",
                });
            }

            const appointments = await this.appointmentRepository.findByDateRange(start, end);

            res.status(200).json({
                ok: true,
                data: appointments,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAppointmentsByStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.params;

            if (!Object.values(Status).includes(status as Status)) {
                return res.status(400).json({
                    ok: false,
                    message: "Status no válido. Debe ser: PENDING, CONFIRMED o CANCELLED",
                });
            }

            const appointments = await this.appointmentRepository.findByStatus(status as Status);

            res.status(200).json({
                ok: true,
                data: appointments,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public getAvailableSlots = async (req: Request, res: Response) => {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            if (isNaN(Number(doctorId))) {
                return res.status(400).json({
                    ok: false,
                    message: "Doctor ID debe ser un número válido",
                });
            }

            if (!date) {
                return res.status(400).json({
                    ok: false,
                    message: "La fecha es requerida",
                });
            }

            const appointmentDate = new Date(date as string);
            if (isNaN(appointmentDate.getTime())) {
                return res.status(400).json({
                    ok: false,
                    message: "Fecha no válida",
                });
            }

            const availableSlots = await this.appointmentRepository.getAvailableSlots(
                Number(doctorId),
                appointmentDate
            );

            res.status(200).json({
                ok: true,
                data: availableSlots,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public updateAppointment = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            // Obtener la cita original para comparar cambios
            let originalAppointment;
            try {
                originalAppointment = await this.appointmentRepository.findById(Number(id));
            } catch (error) {
                return res.status(404).json({
                    ok: false,
                    message: "Cita no encontrada",
                });
            }

            const [error, updateAppointmentDto] = UpdateAppointmentDto.create(req.body);

            if (error) return res.status(400).json({ error });

            const appointment = await this.appointmentRepository.update(Number(id), updateAppointmentDto!);

            // Enviar notificación de actualización por email al paciente
            try {
                let changes = "Se han realizado las siguientes actualizaciones:\n";

                if (updateAppointmentDto!.date && originalAppointment.date.getTime() !== updateAppointmentDto!.date.getTime()) {
                    changes += `• Fecha cambiada de ${originalAppointment.date.toLocaleDateString()} a ${updateAppointmentDto!.date.toLocaleDateString()}\n`;
                }

                if (updateAppointmentDto!.status && originalAppointment.status !== updateAppointmentDto!.status) {
                    changes += `• Estado cambiado de ${originalAppointment.status} a ${updateAppointmentDto!.status}\n`;
                }

                if (updateAppointmentDto!.reason && originalAppointment.reason !== updateAppointmentDto!.reason) {
                    changes += `• Motivo actualizado: ${updateAppointmentDto!.reason}\n`;
                }

                if (updateAppointmentDto!.notes && originalAppointment.notes !== updateAppointmentDto!.notes) {
                    changes += `• Notas actualizadas\n`;
                }

                await this.emailService.sendAppointmentUpdate({
                    patientName: appointment.patient?.name || 'Paciente',
                    patientEmail: appointment.patient?.email || '',
                    doctorName: appointment.doctor?.name || 'Doctor',
                    doctorSpecialty: appointment.doctor?.specialty || 'Medicina General',
                    appointmentDate: appointment.date,
                    appointmentId: appointment.id
                }, changes);

                console.log(`Email de actualización enviado a ${appointment.patient?.email}`);
            } catch (emailError) {
                console.error('Error enviando email de actualización:', emailError);
                // No fallar la actualización si falla el email
            }

            res.status(200).json({
                ok: true,
                message: "Cita médica actualizada exitosamente",
                data: appointment,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("not available") ? 409 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    public deleteAppointment = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { reason } = req.body; // Motivo opcional de cancelación

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            // Obtener la cita antes de eliminarla para enviar el email
            let appointmentToCancel;
            try {
                appointmentToCancel = await this.appointmentRepository.findById(Number(id));
            } catch (error) {
                return res.status(404).json({
                    ok: false,
                    message: "Cita no encontrada",
                });
            }

            const appointment = await this.appointmentRepository.delete(Number(id));

            // Enviar notificación de cancelación por email al paciente
            try {
                await this.emailService.sendAppointmentCancellation({
                    patientName: appointmentToCancel.patient?.name || 'Paciente',
                    patientEmail: appointmentToCancel.patient?.email || '',
                    doctorName: appointmentToCancel.doctor?.name || 'Doctor',
                    doctorSpecialty: appointmentToCancel.doctor?.specialty || 'Medicina General',
                    appointmentDate: appointmentToCancel.date,
                    appointmentId: appointmentToCancel.id
                }, reason);

                console.log(`Email de cancelación enviado a ${appointmentToCancel.patient?.email}`);
            } catch (emailError) {
                console.error('Error enviando email de cancelación:', emailError);
                // No fallar la eliminación si falla el email
            }

            res.status(200).json({
                ok: true,
                message: "Cita médica eliminada exitosamente",
                data: appointment,
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };

    // Método adicional para enviar recordatorios de citas
    public sendAppointmentReminder = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return res.status(400).json({
                    ok: false,
                    message: "ID debe ser un número válido",
                });
            }

            const appointment = await this.appointmentRepository.findById(Number(id));

            // Verificar que la cita esté confirmada y sea futura
            if (appointment.status !== Status.CONFIRMED) {
                return res.status(400).json({
                    ok: false,
                    message: "Solo se pueden enviar recordatorios para citas confirmadas",
                });
            }

            const now = new Date();
            if (appointment.date <= now) {
                return res.status(400).json({
                    ok: false,
                    message: "No se pueden enviar recordatorios para citas pasadas",
                });
            }

            // Enviar recordatorio por email
            try {
                await this.emailService.sendAppointmentReminder({
                    patientName: appointment.patient?.name || 'Paciente',
                    patientEmail: appointment.patient?.email || '',
                    doctorName: appointment.doctor?.name || 'Doctor',
                    doctorSpecialty: appointment.doctor?.specialty || 'Medicina General',
                    appointmentDate: appointment.date,
                    description: appointment.reason,
                    appointmentId: appointment.id
                });

                console.log(`Recordatorio enviado a ${appointment.patient?.email}`);
            } catch (emailError) {
                console.error('Error enviando recordatorio:', emailError);
                return res.status(500).json({
                    ok: false,
                    message: "Error enviando recordatorio por email",
                });
            }

            res.status(200).json({
                ok: true,
                message: "Recordatorio enviado exitosamente",
                data: {
                    appointmentId: appointment.id,
                    sentTo: appointment.patient?.email,
                    sentAt: new Date()
                },
            });
        } catch (error: any) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                ok: false,
                message: error.message,
            });
        }
    };
}