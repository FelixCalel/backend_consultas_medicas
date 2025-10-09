import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { logger } from './config/logger';
import patientRoutes from "./patients/patients.routes";
import express from 'express';


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

const app = express();

app.use(express.json()); // 👈 esto es necesario para leer JSON
app.use('/api/patients', patientRoutes); // 👈 aquí se agregan tus rutas

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
app.use("/api/patients", patientRoutes);
