import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { logger } from './config/logger';

(async () => {
    try {
        await main();
    } catch (error) {
        logger.error("Error en la inicialización de la aplicación: %s", error);
    }
})();

async function main() {
    const server = new Server({
        port: envs.PORT,
        host: envs.HOST,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });

    try {
        await server.start();
    } catch (error) {
        logger.error("Error al iniciar el servidor: %s", error);
    }
}
