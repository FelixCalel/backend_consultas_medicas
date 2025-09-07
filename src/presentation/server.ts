import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { logger } from '../config/logger';
import { initDB, prisma } from '../config/database';

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
        const { port, host, routes, public_path = 'public' } = options;
        this.port = port;
        this.host = host;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {

        await initDB();

        this.app.use(cors({ origin: '*' }));

        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Conexion DB
        this.app.get('/health', async (_req, res) => {
            try {
                await prisma.$queryRaw`SELECT 1`;
                res.status(200).send('OK');
            } catch (err) {
                logger.error('BD sin respuesta 🔴', { err });
                res.status(500).send('DB DOWN');
            }
        });

        //* Routes
        this.app.use('/', this.routes);

        //* SPA - Enviar archivo index.html
        this.app.get('/', (_req, res) => {
            const indexPath = path.join(__dirname, '../../../', this.publicPath, 'index.html');
            res.sendFile(indexPath);
        });

        const server = createServer(this.app);
        server.listen(this.port, this.host, () => {
            logger.info(`✅ Servidor corriendo en "http://${this.host}:${this.port}"`);
        });
    }
}
