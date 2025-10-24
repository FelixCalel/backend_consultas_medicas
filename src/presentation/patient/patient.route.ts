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


        router.get("/", requireAdminOrDoctor, patientController.searchPatients);

        router.get("/:id", requireAdminOrDoctor, patientController.getPatientById);
        router.put("/:id", patientController.updatePatient);
        router.delete("/:id", requireAdmin, patientController.deletePatient);
        router.get("/user/:userId", patientController.getPatientByUserId);

        return router;
    }
}