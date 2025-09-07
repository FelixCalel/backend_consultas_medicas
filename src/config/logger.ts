import path from 'path';
import { createLogger, format, transports } from 'winston';
import fs from 'fs';

const logDir = path.join(__dirname, '..', '..', 'src', 'data', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const fileFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message, stack }) => {

        return `${timestamp} [${level}]: ${stack || message}`;
    })
);

export const logger = createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, stack }) => {
                    return `${timestamp} [${level}]: ${stack || message}`;
                })
            ),
        }),
        new transports.File({
            filename: path.join(logDir, 'logs.txt'),
            level: 'info',
            format: fileFormat,
        }),
    ],
});
