
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
    router.use("/auth", AuthRoutes.routes);
    router.use("/users", UserRoutes.routes);
    router.use("/admin", AdminRoutes.routes);

    return router;
  }
}
