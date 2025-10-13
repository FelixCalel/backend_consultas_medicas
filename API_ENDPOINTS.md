# API de Consultas Médicas - Endpoints Completos

## 📋 Resumen

Esta API proporciona un sistema completo de gestión de consultas médicas con las siguientes funcionalidades:

- **CRUD completo de Doctores**
- **CRUD completo de Pacientes** 
- **CRUD completo de Citas Médicas**
- **Sistema de disponibilidad de horarios**
- **Gestión de estados de citas**

## 🏥 Endpoints de Doctores

### Crear Doctor
```http
POST /doctors
Content-Type: application/json

{
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología",
  "phone": "+573001234567",
  "email": "juan.perez@hospital.com",
  "licenseNumber": "MD12345",
  "experience": 10,
  "education": "Universidad Nacional de Colombia",
  "bio": "Especialista en cardiología con 10 años de experiencia",
  "consultationFee": 150000,
  "availableHours": "08:00-18:00",
  "userId": 1
}
```

### Obtener Todos los Doctores
```http
GET /doctors
```

### Obtener Doctor por ID
```http
GET /doctors/:id
```

### Obtener Doctor por User ID
```http
GET /doctors/user/:userId
```

### Obtener Doctores por Especialidad
```http
GET /doctors/specialty/:specialty
```

### Actualizar Doctor
```http
PUT /doctors/:id
Content-Type: application/json

{
  "name": "Dr. Juan Carlos Pérez",
  "consultationFee": 180000
}
```

### Eliminar Doctor
```http
DELETE /doctors/:id
```

## 👥 Endpoints de Pacientes

### Crear Paciente
```http
POST /patients
Content-Type: application/json

{
  "name": "María García",
  "birthDate": "1990-05-15",
  "phone": "+573009876543",
  "address": "Calle 123 #45-67, Bogotá",
  "gender": "Femenino",
  "bloodType": "O+",
  "emergencyContact": "+573001111111",
  "medicalHistory": "Alergia a la penicilina",
  "userId": 2
}
```

### Obtener Todos los Pacientes
```http
GET /patients
```

### Obtener Paciente por ID
```http
GET /patients/:id
```

### Obtener Paciente por User ID
```http
GET /patients/user/:userId
```

### Actualizar Paciente
```http
PUT /patients/:id
Content-Type: application/json

{
  "phone": "+573009999999",
  "address": "Nueva dirección"
}
```

### Eliminar Paciente
```http
DELETE /patients/:id
```

## 📅 Endpoints de Citas Médicas

### Crear Cita Médica
```http
POST /appointments
Content-Type: application/json

{
  "date": "2024-12-15",
  "time": "10:30",
  "reason": "Consulta de control",
  "notes": "Paciente con historial de hipertensión",
  "patientId": 1,
  "doctorId": 1,
  "status": "PENDING"
}
```

### Obtener Todas las Citas
```http
GET /appointments
```

### Obtener Cita por ID
```http
GET /appointments/:id
```

### Obtener Citas por Paciente
```http
GET /appointments/patient/:patientId
```

### Obtener Citas por Doctor
```http
GET /appointments/doctor/:doctorId
```

### Obtener Citas por Rango de Fechas
```http
GET /appointments/date-range?startDate=2024-12-01&endDate=2024-12-31
```

### Obtener Citas por Estado
```http
GET /appointments/status/:status
```
Estados disponibles: `PENDING`, `CONFIRMED`, `CANCELLED`

### Obtener Horarios Disponibles
```http
GET /appointments/available-slots/:doctorId?date=2024-12-15
```

### Actualizar Cita
```http
PUT /appointments/:id
Content-Type: application/json

{
  "status": "CONFIRMED",
  "notes": "Cita confirmada por el paciente"
}
```

### Eliminar Cita
```http
DELETE /appointments/:id
```

## 🔐 Estados de Citas

- **PENDING**: Cita pendiente de confirmación
- **CONFIRMED**: Cita confirmada
- **CANCELLED**: Cita cancelada

## 🕐 Horarios Disponibles

El sistema maneja horarios de consulta de 8:00 AM a 6:00 PM con intervalos de 30 minutos:
- 08:00, 08:30, 09:00, 09:30, etc.

## 📝 Validaciones Importantes

### Doctores
- Email único en el sistema
- Número de licencia único
- Un usuario solo puede estar asociado a un doctor
- No se puede eliminar un doctor con citas activas

### Pacientes
- Un usuario solo puede estar asociado a un paciente
- Fecha de nacimiento debe ser válida y no futura
- No se puede eliminar un paciente con citas activas

### Citas Médicas
- No se permiten citas en fechas pasadas
- No se permiten conflictos de horario para el mismo doctor
- Formato de hora debe ser HH:MM
- Doctor y paciente deben existir en el sistema

## 🚨 Códigos de Error

- **400**: Datos inválidos o faltantes
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: horario ocupado, email duplicado)
- **500**: Error interno del servidor

## 📋 Ejemplos de Uso Completo

### Flujo Típico: Doctor Crea Cita para Paciente

1. **Obtener horarios disponibles**:
```http
GET /appointments/available-slots/1?date=2024-12-15
```

2. **Crear la cita**:
```http
POST /appointments
{
  "date": "2024-12-15",
  "time": "10:30",
  "reason": "Consulta general",
  "patientId": 1,
  "doctorId": 1
}
```

3. **Confirmar la cita**:
```http
PUT /appointments/1
{
  "status": "CONFIRMED"
}
```

### Flujo: Paciente Ve Sus Citas

1. **Obtener citas del paciente**:
```http
GET /appointments/patient/1
```

2. **Ver detalles de una cita específica**:
```http
GET /appointments/1
```

Este sistema proporciona una funcionalidad completa para la gestión de consultas médicas con validaciones robustas y manejo de errores apropiado.