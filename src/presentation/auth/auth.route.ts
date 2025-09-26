
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthDatasourceImpl } from "../../infrastructure/datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { EmailService } from "../services/email.service";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService();
    const datasource = new AuthDatasourceImpl();
    const repository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(repository, emailService);

    router.post("/login", controller.login);
    router.post("/register", controller.register);

    return router;
  }
}
