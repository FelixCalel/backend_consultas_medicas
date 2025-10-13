import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { AppointmentDatasourceImpl } from "../../infrastructure/datasources/appointment.datasource.impl";
import { AppointmentRepositoryImpl } from "../../infrastructure/repositories/appointment.repository.impl";
import { EmailService } from "../services/email.service";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdminOrDoctor } from "../../middleware/admin.middleware";

export class AppointmentRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService();
        const appointmentDatasource = new AppointmentDatasourceImpl();
        const appointmentRepository = new AppointmentRepositoryImpl(appointmentDatasource);
        const appointmentController = new AppointmentController(appointmentRepository, emailService);

        // Todas las rutas requieren autenticación
        router.use(requireAuth);

        // CRUD básico de citas médicas
        router.post("/", requireAdminOrDoctor, appointmentController.createAppointment); // Solo admin o doctor pueden crear citas
        router.get("/", requireAdminOrDoctor, appointmentController.getAllAppointments); // Solo admin o doctor pueden ver todas las citas
        router.get("/:id", appointmentController.getAppointmentById); // Todos pueden ver detalles (se validará acceso en controlador)
        router.put("/:id", appointmentController.updateAppointment); // Todos pueden actualizar (se validará acceso en controlador)
        router.delete("/:id", requireAdminOrDoctor, appointmentController.deleteAppointment); // Solo admin o doctor pueden eliminar

        // Endpoints específicos
        router.get("/patient/:patientId", appointmentController.getAppointmentsByPatient); // Pacientes pueden ver sus citas (validar en controlador)
        router.get("/doctor/:doctorId", appointmentController.getAppointmentsByDoctor); // Doctores pueden ver sus citas (validar en controlador)
        router.get("/status/:status", requireAdminOrDoctor, appointmentController.getAppointmentsByStatus); // Solo admin o doctor
        router.get("/date-range", requireAdminOrDoctor, appointmentController.getAppointmentsByDateRange); // Solo admin o doctor
        router.get("/available-slots/:doctorId", appointmentController.getAvailableSlots); // Todos pueden ver horarios disponibles

        // Endpoint para recordatorios de citas
        router.post("/:id/reminder", requireAdminOrDoctor, appointmentController.sendAppointmentReminder); // Solo admin o doctor pueden enviar recordatorios

        return router;
    }
}