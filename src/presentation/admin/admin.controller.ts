
import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { UpdateUserRoleDto } from "../../domain/dtos/admin/update-user-role.dto";
import { UpdateUserDto } from "../../domain/dtos/admin/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

const prisma = new PrismaClient();

export class AdminController {
  // Métricas del sistema
  getMetrics = async (_req: Request, res: Response) => {
    try {
      const totalUsers = await prisma.user.count();
      const totalDoctors = await prisma.doctor.count();
      const totalPatients = await prisma.patient.count();
      const totalAppointments = await prisma.appointment.count();

      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      });

      const appointmentsByStatus = await prisma.appointment.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });

      const metrics = {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        usersByRole: usersByRole.reduce((acc: any, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {}),
        appointmentsByStatus: appointmentsByStatus.reduce((acc: any, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {}),
        timestamp: new Date().toISOString(),
      };

      res.status(200).json({
        ok: true,
        message: "Métricas del sistema obtenidas exitosamente",
        data: metrics,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Obtener todos los usuarios
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { role, page = 1, limit = 10 } = req.query;

      const whereClause: any = {};
      if (role && Object.values(Role).includes(role as Role)) {
        whereClause.role = role;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            doctor: true,
            patient: true,
          },
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      const userEntities = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        doctor: user.doctor,
        patient: user.patient,
      }));

      res.status(200).json({
        ok: true,
        data: userEntities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / Number(limit)),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Obtener usuario por ID
  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({
          ok: false,
          message: "ID debe ser un número válido",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          doctor: true,
          patient: {
            include: {
              appointments: {
                include: {
                  doctor: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      const userEntity = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        doctor: user.doctor,
        patient: user.patient,
      };

      res.status(200).json({
        ok: true,
        data: userEntity,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Actualizar información básica del usuario
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({
          ok: false,
          message: "ID debe ser un número válido",
        });
      }

      const [error, updateUserDto] = UpdateUserDto.create(req.body);

      if (error) return res.status(400).json({ error });

      // Verificar que el usuario existe
      const userExists = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!userExists) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      // Verificar email único si se está actualizando
      if (updateUserDto!.values.email) {
        const emailExists = await prisma.user.findFirst({
          where: {
            email: updateUserDto!.values.email,
            NOT: {
              id: Number(id),
            },
          },
        });

        if (emailExists) {
          return res.status(409).json({
            ok: false,
            message: "Email ya está en uso por otro usuario",
          });
        }
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: updateUserDto!.values,
        include: {
          doctor: true,
          patient: true,
        },
      });

      const userEntity = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        doctor: updatedUser.doctor,
        patient: updatedUser.patient,
      };

      res.status(200).json({
        ok: true,
        message: "Usuario actualizado exitosamente",
        data: userEntity,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Cambiar rol del usuario
  updateUserRole = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({
          ok: false,
          message: "ID debe ser un número válido",
        });
      }

      const [error, updateUserRoleDto] = UpdateUserRoleDto.create(req.body);

      if (error) return res.status(400).json({ error });

      // Verificar que el usuario existe
      const userExists = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          doctor: true,
          patient: true,
        },
      });

      if (!userExists) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      // Verificar si el usuario tiene datos relacionados que puedan causar conflictos
      if (updateUserRoleDto!.role !== Role.DOCTOR && userExists.doctor) {
        const hasActiveAppointments = await prisma.appointment.findFirst({
          where: {
            doctorId: userExists.doctor.id,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        });

        if (hasActiveAppointments) {
          return res.status(409).json({
            ok: false,
            message: "No se puede cambiar el rol. El usuario tiene citas médicas activas como doctor",
          });
        }
      }

      if (updateUserRoleDto!.role !== Role.PATIENT && userExists.patient) {
        const hasActiveAppointments = await prisma.appointment.findFirst({
          where: {
            patientId: userExists.patient.id,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        });

        if (hasActiveAppointments) {
          return res.status(409).json({
            ok: false,
            message: "No se puede cambiar el rol. El usuario tiene citas médicas activas como paciente",
          });
        }
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          role: updateUserRoleDto!.role,
        },
        include: {
          doctor: true,
          patient: true,
        },
      });

      const userEntity = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        doctor: updatedUser.doctor,
        patient: updatedUser.patient,
      };

      res.status(200).json({
        ok: true,
        message: "Rol del usuario actualizado exitosamente",
        data: userEntity,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Eliminar usuario
  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({
          ok: false,
          message: "ID debe ser un número válido",
        });
      }

      // Verificar que el usuario existe
      const userExists = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          doctor: true,
          patient: true,
        },
      });

      if (!userExists) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      }

      // Evitar que se elimine a si mismo
      if (req.user && req.user.id === Number(id)) {
        return res.status(409).json({
          ok: false,
          message: "No puedes eliminar tu propia cuenta",
        });
      }

      // Verificar si tiene citas activas
      let hasActiveAppointments = false;
      if (userExists.doctor) {
        hasActiveAppointments = await prisma.appointment.findFirst({
          where: {
            doctorId: userExists.doctor.id,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        }).then(result => !!result);
      }

      if (!hasActiveAppointments && userExists.patient) {
        hasActiveAppointments = await prisma.appointment.findFirst({
          where: {
            patientId: userExists.patient.id,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        }).then(result => !!result);
      }

      if (hasActiveAppointments) {
        return res.status(409).json({
          ok: false,
          message: "No se puede eliminar el usuario. Tiene citas médicas activas",
        });
      }

      // Eliminar en cascada: primero las citas, luego doctor/patient, finalmente el usuario
      if (userExists.doctor) {
        await prisma.appointment.deleteMany({
          where: { doctorId: userExists.doctor.id },
        });
        await prisma.doctor.delete({
          where: { id: userExists.doctor.id },
        });
      }

      if (userExists.patient) {
        await prisma.appointment.deleteMany({
          where: { patientId: userExists.patient.id },
        });
        await prisma.patient.delete({
          where: { id: userExists.patient.id },
        });
      }

      const deletedUser = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        ok: true,
        message: "Usuario eliminado exitosamente",
        data: {
          id: deletedUser.id,
          name: deletedUser.name,
          email: deletedUser.email,
          role: deletedUser.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };

  // Obtener usuarios por rol
  getUsersByRole = async (req: Request, res: Response) => {
    try {
      const { role } = req.params;

      if (!Object.values(Role).includes(role as Role)) {
        return res.status(400).json({
          ok: false,
          message: "Rol no válido. Debe ser: ADMIN, DOCTOR o PATIENT",
        });
      }

      const users = await prisma.user.findMany({
        where: {
          role: role as Role,
        },
        include: {
          doctor: true,
          patient: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const userEntities = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        doctor: user.doctor,
        patient: user.patient,
      }));

      res.status(200).json({
        ok: true,
        data: userEntities,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  };
}
