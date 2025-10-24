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

        router.use(requireAuth);

        // Crear doctor (solo admin)
        router.post("/", requireAdmin, doctorController.createDoctor);

        // Listar todos los doctores (admin o doctor)
        router.get("/", requireAdminOrDoctor, doctorController.getAllDoctors);

        // Obtener doctor por ID (admin o doctor)
        router.get("/:id", requireAdminOrDoctor, doctorController.getDoctorById);

        // Obtener doctor por userId (admin o doctor)
        router.get("/user/:userId", requireAdminOrDoctor, doctorController.getDoctorByUserId);

        // Obtener doctores por especialidad (admin o doctor)
        router.get("/specialty/:specialty", requireAdminOrDoctor, doctorController.getDoctorsBySpecialty);

        // Actualizar doctor (solo admin)
        router.put("/:id", requireAdmin, doctorController.updateDoctor);

        // Eliminar doctor (solo admin)
        router.delete("/:id", requireAdmin, doctorController.deleteDoctor);

        return router;
    }
}