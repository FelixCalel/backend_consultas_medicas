
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthDatasourceImpl } from "src/infrastructure/datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "src/infrastructure/repositories/auth.repository.impl";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDatasourceImpl();
    const repository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(repository);

    router.post("/login", controller.login);
    router.post("/register", controller.register);

    return router;
  }
}
