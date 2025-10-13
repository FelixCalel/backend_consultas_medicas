import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { DoctorDatasourceImpl } from "../../infrastructure/datasources/doctor.datasource.impl";
import { DoctorRepositoryImpl } from "../../infrastructure/repositories/doctor.repository.impl";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdmin, requireAdminOrDoctor } from "../../middleware/admin.middleware";

export class DoctorRoutes {
    static get routes(): Router {
        const router = Router();

        const doctorDatasource = new DoctorDatasourceImpl();
        const doctorRepository = new DoctorRepositoryImpl(doctorDatasource);
        const doctorController = new DoctorController(doctorRepository);

        // Todas las rutas requieren autenticación
        router.use(requireAuth);

        // CRUD básico de doctores
        router.post("/", requireAdmin, doctorController.createDoctor); // Solo admin puede crear doctores
        router.get("/", doctorController.getAllDoctors); // Todos pueden ver la lista de doctores
        router.get("/:id", doctorController.getDoctorById); // Todos pueden ver detalles de un doctor
        router.put("/:id", requireAdminOrDoctor, doctorController.updateDoctor); // Admin o el propio doctor
        router.delete("/:id", requireAdmin, doctorController.deleteDoctor); // Solo admin puede eliminar

        // Endpoints específicos
        router.get("/user/:userId", doctorController.getDoctorByUserId); // Todos pueden buscar por usuario
        router.get("/specialty/:specialty", doctorController.getDoctorsBySpecialty); // Todos pueden buscar por especialidad

        return router;
    }
}