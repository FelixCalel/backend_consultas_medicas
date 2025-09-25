import { Router } from "express";
import { register, login } from "./auth/auth.controller";
import { requireAuth, authorize } from "./auth/auth.middleware";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Ruta de prueba inicial
    router.get("/", (_req, res) => res.send("API OK"));

    // === Auth ===
    router.post("/auth/register", register);
    router.post("/auth/login", login);

    // === Rutas protegidas de ejemplo ===
    router.get("/me", requireAuth, (req, res) => res.json(req.user));

    router.get(
  "/admin/metrics",
  requireAuth,
  authorize("ADMIN"),
  (_req, res) => res.json({ secret: "solo ADMIN ve esto" })
);


    return router;
  }
}
