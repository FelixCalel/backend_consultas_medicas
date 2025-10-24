import { Router } from "express";
// ...existing code...
import { requireAuth } from "../../middleware/auth.middleware";


export class AppointmentRoutes {
    static get routes(): Router {
        const router = Router();

        // ...existing code...


        router.use(requireAuth);




        return router;
    }
}