import express, { Router } from "express";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { logger } from "../config/logger";
import { initDB, prisma } from "../config/database";

interface Options {
  port: number;
  host: string;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly host: string;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, host, routes } = options;
    this.port = port;
    this.host = host;
    // Usar ruta absoluta para la carpeta public
    this.publicPath = path.join(__dirname, '../../public');
    this.routes = routes;
  }

  async start() {
    await initDB();


    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // 1. Endpoints de API y health primero
    this.app.get("/health", async (_req, res) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).send("OK");
      } catch (err) {
        logger.error("BD sin respuesta 🔴", { err });
        res.status(500).send("DB DOWN");
      }
    });

    this.app.use("/api", this.routes);

    // 2. Archivos estáticos
    this.app.use(express.static(this.publicPath));

    // 3. Handler para SPA (frontend) en rutas no-API (catch-all seguro)
    this.app.use((_req, res) => {
      const indexPath = path.join(this.publicPath, 'index.html');
      res.sendFile(indexPath);
    });

    const server = createServer(this.app);
    server.listen(this.port, this.host, () => {
      logger.info(`✅ Servidor corriendo en http://${this.host}:${this.port}`);
    });
  }
}
