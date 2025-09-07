import { Router } from "express";

export class AppRoutes {
    static get routers(): Router {

        const router = Router();

        router.get('/', (_req, res) => res.send('API OK'));

        return router;
    }
}