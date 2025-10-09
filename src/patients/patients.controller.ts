import { Request, Response } from 'express';
import { prisma } from '../config/database';


// Crear un nuevo paciente
export const createPatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, birthDate, phone, address, userId } = req.body;

    // Crear paciente
    const patient = await prisma.patient.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        phone,
        address,
        userId,
      },
    });

    return res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating patient' });
  }
};


// Obtener todos los pacientes
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { user: true, appointments: true },
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
};

// Obtener paciente por ID
export const getPatientById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { user: true, appointments: true },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json(patient);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching patient' });
  }
};


// Actualizar paciente
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, birthDate, phone, address } = req.body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        phone,
        address,
      },
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient' });
  }
};

// Eliminar paciente
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.patient.delete({ where: { id } });
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient' });
  }
};

