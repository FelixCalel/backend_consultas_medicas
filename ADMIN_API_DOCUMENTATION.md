# API de Administración - Sistema de Consultas Médicas

## 🛡️ Sistema de Roles y Autenticación

### Roles Disponibles
- **ADMIN**: Acceso completo al sistema
- **DOCTOR**: Puede gestionar citas y ver pacientes
- **PATIENT**: Puede ver sus propias citas y datos (rol por defecto)

### Autenticación
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

## 👤 Registro de Usuarios (Actualizado)

### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "password123"
  // El rol por defecto será PATIENT
}
```

**Nota**: Todos los usuarios nuevos se registran automáticamente como **PATIENT**. Solo los administradores pueden cambiar roles posteriormente.

## 🔧 Endpoints de Administración

### 📊 Métricas del Sistema
**Solo para ADMIN**
```http
GET /admin/metrics
Authorization: Bearer <admin_token>
```

**Respuesta**:
```json
{
  "ok": true,
  "message": "Métricas del sistema obtenidas exitosamente",
  "data": {
    "totalUsers": 150,
    "totalDoctors": 25,
    "totalPatients": 120,
    "totalAppointments": 500,
    "usersByRole": {
      "ADMIN": 5,
      "DOCTOR": 25,
      "PATIENT": 120
    },
    "appointmentsByStatus": {
      "PENDING": 50,
      "CONFIRMED": 300,
      "CANCELLED": 150
    },
    "timestamp": "2024-12-15T10:30:00.000Z"
  }
}
```

### 👥 Gestión de Usuarios

#### Obtener Todos los Usuarios
**Solo para ADMIN**
```http
GET /admin/users?role=PATIENT&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Obtener Usuarios por Rol
**Solo para ADMIN**
```http
GET /admin/users/role/DOCTOR
Authorization: Bearer <admin_token>
```

#### Obtener Usuario Específico
**ADMIN o el propio usuario**
```http
GET /admin/users/:id
Authorization: Bearer <token>
```

#### Actualizar Información del Usuario
**ADMIN o el propio usuario**
```http
PUT /admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juan.carlos@email.com"
}
```

#### Cambiar Rol del Usuario
**Solo para ADMIN**
```http
PATCH /admin/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "DOCTOR"
}
```

**Validaciones**:
- No se puede cambiar el rol si el usuario tiene citas activas en el rol actual
- Los roles válidos son: `ADMIN`, `DOCTOR`, `PATIENT`

#### Eliminar Usuario
**Solo para ADMIN**
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>
```

**Validaciones**:
- No se puede eliminar un usuario con citas activas
- No se puede eliminar a sí mismo

## 🏥 Endpoints Protegidos por Rol

### Doctores (`/doctors`)

| Endpoint | Método | Permisos | Descripción |
|----------|--------|----------|-------------|
| `/` | POST | ADMIN | Crear doctor |
| `/` | GET | Todos | Ver todos los doctores |
| `/:id` | GET | Todos | Ver doctor específico |
| `/:id` | PUT | ADMIN o DOCTOR propietario | Actualizar doctor |
| `/:id` | DELETE | ADMIN | Eliminar doctor |
| `/user/:userId` | GET | Todos | Buscar doctor por usuario |
| `/specialty/:specialty` | GET | Todos | Buscar por especialidad |

### Pacientes (`/patients`)

| Endpoint | Método | Permisos | Descripción |
|----------|--------|----------|-------------|
| `/` | POST | Todos autenticados | Crear perfil de paciente |
| `/` | GET | ADMIN o DOCTOR | Ver todos los pacientes |
| `/:id` | GET | ADMIN o DOCTOR | Ver paciente específico |
| `/:id` | PUT | ADMIN o PATIENT propietario | Actualizar paciente |
| `/:id` | DELETE | ADMIN | Eliminar paciente |
| `/user/:userId` | GET | ADMIN, DOCTOR o propietario | Buscar por usuario |

### Citas Médicas (`/appointments`)

| Endpoint | Método | Permisos | Descripción |
|----------|--------|----------|-------------|
| `/` | POST | ADMIN o DOCTOR | Crear cita |
| `/` | GET | ADMIN o DOCTOR | Ver todas las citas |
| `/:id` | GET | Relacionado con la cita | Ver cita específica |
| `/:id` | PUT | Relacionado con la cita | Actualizar cita |
| `/:id` | DELETE | ADMIN o DOCTOR | Eliminar cita |
| `/patient/:patientId` | GET | ADMIN, DOCTOR o PATIENT propietario | Citas del paciente |
| `/doctor/:doctorId` | GET | ADMIN, DOCTOR propietario | Citas del doctor |
| `/status/:status` | GET | ADMIN o DOCTOR | Citas por estado |
| `/date-range` | GET | ADMIN o DOCTOR | Citas por fecha |
| `/available-slots/:doctorId` | GET | Todos | Horarios disponibles |

## 🔐 Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos inválidos o faltantes
- **401**: Token de autenticación requerido o inválido
- **403**: Permisos insuficientes
- **404**: Recurso no encontrado
- **409**: Conflicto (email duplicado, citas activas, etc.)
- **500**: Error interno del servidor

## 🛠️ Flujos de Trabajo Administrativos

### Flujo: Admin Cambia Rol de Usuario a Doctor

1. **Verificar usuario**:
```http
GET /admin/users/5
```

2. **Cambiar rol**:
```http
PATCH /admin/users/5/role
{
  "role": "DOCTOR"
}
```

3. **Crear perfil de doctor**:
```http
POST /doctors
{
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología",
  "phone": "+573001234567",
  "email": "juan@email.com",
  "licenseNumber": "MD12345",
  "userId": 5
}
```

### Flujo: Doctor Crea Cita para Paciente

1. **Ver horarios disponibles**:
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
  "patientId": 3,
  "doctorId": 1
}
```

### Flujo: Usuario Crea su Perfil de Paciente

1. **Registrarse** (automáticamente PATIENT):
```http
POST /auth/register
{
  "name": "María García",
  "email": "maria@email.com",
  "password": "password123"
}
```

2. **Crear perfil de paciente**:
```http
POST /patients
{
  "name": "María García",
  "birthDate": "1990-05-15",
  "phone": "+573009876543",
  "address": "Calle 123 #45-67",
  "userId": 6
}
```

## ⚠️ Consideraciones de Seguridad

1. **Tokens JWT**: Incluyen información del rol del usuario
2. **Validación de Propiedad**: Los usuarios solo pueden acceder a sus propios datos
3. **Validación de Integridad**: No se permite eliminar usuarios/datos con dependencias activas
4. **Roles Jerárquicos**: ADMIN > DOCTOR > PATIENT en términos de permisos
5. **Auditoría**: Todas las operaciones administrativas son rastreables

Este sistema proporciona un control granular de acceso y mantiene la integridad de los datos mientras permite flexibilidad en la gestión de usuarios y roles.