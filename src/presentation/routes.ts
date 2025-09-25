
import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { UserRoutes } from "./user/user.route";
import { AdminRoutes } from "./admin/admin.route";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Ruta de prueba inicial
    router.get("/", (_req, res) => res.send("API OK"));

    // === API Routes ===
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/users", UserRoutes.routes);
    router.use("/api/admin", AdminRoutes.routes);

    return router;
  }
}
