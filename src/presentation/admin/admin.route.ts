
import { Router } from "express";
import { AdminController } from "./admin.controller";
import { requireAuth, authorize } from "../../middleware/auth.middleware";
import { Role } from "@prisma/client";

export class AdminRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new AdminController();

    router.get(
      "/metrics",
      [requireAuth, authorize(Role.ADMIN)],
      controller.getMetrics
    );

    return router;
  }
}
