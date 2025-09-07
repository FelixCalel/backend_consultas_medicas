import { logger } from './logger';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function initDB(): Promise<void> {
    try {
        await prisma.$connect();
        logger.info('Base de datos conectada 🟢');
    } catch (err) {
        logger.error('No se pudo conectar a la base de datos 🔴', { err });
    }

    const shutdown = async () => {
        logger.warn('⚠️  Cerrando conexión Prisma…');
        await prisma.$disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}