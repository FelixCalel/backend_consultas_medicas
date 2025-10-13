import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

/**
 * Middleware específico para verificar que el usuario sea ADMIN
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({
            ok: false,
            message: "Token de autenticación requerido"
        });
        return;
    }

    if (req.user.role !== Role.ADMIN) {
        res.status(403).json({
            ok: false,
            message: "Acceso denegado. Se requieren permisos de administrador"
        });
        return;
    }

    next();
    return;
}

/**
 * Middleware para verificar que el usuario sea ADMIN o DOCTOR
 */
export function requireAdminOrDoctor(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({
            ok: false,
            message: "Token de autenticación requerido"
        });
        return;
    }

    if (req.user.role !== Role.ADMIN && req.user.role !== Role.DOCTOR) {
        res.status(403).json({
            ok: false,
            message: "Acceso denegado. Se requieren permisos de administrador o doctor"
        });
        return;
    }

    next();
    return;
}

/**
 * Middleware para verificar que el usuario pueda acceder a sus propios datos o sea admin
 */
export function requireOwnershipOrAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({
            ok: false,
            message: "Token de autenticación requerido"
        });
        return;
    }

    const { id } = req.params;

    // Si es admin, puede acceder a cualquier recurso
    if (req.user.role === Role.ADMIN) {
        next();
        return;
    }

    // Si no es admin, solo puede acceder a sus propios datos
    if (req.user.sub !== Number(id)) {
        res.status(403).json({
            ok: false,
            message: "Acceso denegado. Solo puedes acceder a tus propios datos"
        });
        return;
    }

    next();
    return;
}