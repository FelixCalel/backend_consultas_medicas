
import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { UserRoutes } from "./user/user.route";
import { AdminRoutes } from "./admin/admin.route";
import { DoctorRoutes } from "./doctor/doctor.route";
import { PatientRoutes } from "./patient/patient.route";
import { AppointmentRoutes } from "./appointment/appointment.route";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_req, res) => res.send("API OK"));

    router.use("/auth", AuthRoutes.routes);
    router.use("/users", UserRoutes.routes);
    router.use("/admin", AdminRoutes.routes);

    router.use("/doctors", DoctorRoutes.routes);
    router.use("/patients", PatientRoutes.routes);
    router.use("/appointments", AppointmentRoutes.routes);

    return router;
  }
}
