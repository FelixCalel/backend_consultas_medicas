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
    const { port, host, routes, public_path = "public" } = options;
    this.port = port;
    this.host = host;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    await initDB();

    // Middlewares
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static public folder
    this.app.use(express.static(this.publicPath));

    // Endpoint para probar conexión DB
    this.app.get("/health", async (_req, res) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).send("OK");
      } catch (err) {
        logger.error("BD sin respuesta 🔴", { err });
        res.status(500).send("DB DOWN");
      }
    });

    // Rutas principales
    this.app.use("/", this.routes);

    // SPA fallback
    this.app.get("/", (_req, res) => {
      const indexPath = path.join(__dirname, "../../../", this.publicPath, "index.html");
      res.sendFile(indexPath);
    });

    // Arrancar servidor
    const server = createServer(this.app);
    server.listen(this.port, this.host, () => {
      logger.info(`✅ Servidor corriendo en http://${this.host}:${this.port}`);
    });
  }
}
