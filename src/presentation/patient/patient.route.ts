import { Router } from "express";
import { PatientController } from "./patient.controller";
import { PatientDatasourceImpl } from "../../infrastructure/datasources/patient.datasource.impl";
import { PatientRepositoryImpl } from "../../infrastructure/repositories/patient.repository.impl";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdmin, requireAdminOrDoctor } from "../../middleware/admin.middleware";

export class PatientRoutes {
    static get routes(): Router {
        const router = Router();

        const patientDatasource = new PatientDatasourceImpl();
        const patientRepository = new PatientRepositoryImpl(patientDatasource);
        const patientController = new PatientController(patientRepository);

        router.use(requireAuth);

        router.get("/:id", requireAdminOrDoctor, patientController.getPatientById); // Solo admin o doctor pueden ver detalles de pacientes
        router.put("/:id", patientController.updatePatient); // Los pacientes pueden actualizar su propia información (se validará en el controlador)
        router.delete("/:id", requireAdmin, patientController.deletePatient); // Solo admin puede eliminar pacientes

        // Endpoints específicos
        router.get("/user/:userId", patientController.getPatientByUserId); // Buscar paciente por usuario (se validará acceso en controlador)

        return router;
    }
}