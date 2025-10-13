
import { Router } from "express";
import { AdminController } from "./admin.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdmin, requireOwnershipOrAdmin } from "../../middleware/admin.middleware";

export class AdminRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new AdminController();

    // Todas las rutas requieren autenticación
    router.use(requireAuth);

    // === Métricas del Sistema ===
    router.get("/metrics", requireAdmin, controller.getMetrics);

    // === Gestión de Usuarios ===

    // Obtener todos los usuarios (solo admin)
    router.get("/users", requireAdmin, controller.getAllUsers);

    // Obtener usuarios por rol (solo admin)
    router.get("/users/role/:role", requireAdmin, controller.getUsersByRole);

    // Obtener usuario específico (admin o el propio usuario)
    router.get("/users/:id", requireOwnershipOrAdmin, controller.getUserById);

    // Actualizar información básica del usuario (admin o el propio usuario)
    router.put("/users/:id", requireOwnershipOrAdmin, controller.updateUser);

    // Cambiar rol del usuario (solo admin)
    router.patch("/users/:id/role", requireAdmin, controller.updateUserRole);

    // Eliminar usuario (solo admin)
    router.delete("/users/:id", requireAdmin, controller.deleteUser);

    return router;
  }
}
