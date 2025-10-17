# API - SaludAgenda

## AUTENTICACIÓN

### Registrar usuario

```
POST http://localhost:3000/api/auth/register
```

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

### Iniciar sesión

```
POST http://localhost:3000/api/auth/login
```

```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Reenviar verificación

```
POST http://localhost:3000/api/auth/resend-verification
```

```json
{
  "email": "juan@example.com"
}
```

---

## USUARIOS

### Obtener mi perfil

```
GET http://localhost:3000/api/users/me
Authorization: Bearer {token}
```

---

## ADMINISTRACIÓN

### Obtener métricas

```
GET http://localhost:3000/api/admin/metrics
Authorization: Bearer {token}
```

### Obtener todos los usuarios

```
GET http://localhost:3000/api/admin/users
Authorization: Bearer {token}
```

### Obtener usuarios por rol

```
GET http://localhost:3000/api/admin/users/role/DOCTOR
Authorization: Bearer {token}
```

### Obtener usuario por ID

```
GET http://localhost:3000/api/admin/users/1
Authorization: Bearer {token}
```

### Actualizar usuario

```
PUT http://localhost:3000/api/admin/users/1
Authorization: Bearer {token}
```

```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

### Cambiar rol de usuario

```
PATCH http://localhost:3000/api/admin/users/1/role
Authorization: Bearer {token}
```

```json
{
  "role": "DOCTOR"
}
```

### Eliminar usuario

```
DELETE http://localhost:3000/api/admin/users/1
Authorization: Bearer {token}
```

---

## PACIENTES

### Crear paciente

```
POST http://localhost:3000/api/patients
Authorization: Bearer {token}
```

```json
{
  "name": "Juan Pérez",
  "birthDate": "1990-05-15T00:00:00.000Z",
  "phone": "+502 1234-5678",
  "address": "123 Calle Principal, Ciudad",
  "gender": "Masculino",
  "bloodType": "O+",
  "emergencyContact": "María Pérez - +502 8765-4321",
  "medicalHistory": "Diabetes tipo 2",
  "userId": 1
}
```

### Obtener todos los pacientes

```
GET http://localhost:3000/api/patients
Authorization: Bearer {token}
```

### Obtener paciente por ID

```
GET http://localhost:3000/api/patients/1
Authorization: Bearer {token}
```

### Obtener paciente por usuario

```
GET http://localhost:3000/api/patients/user/1
Authorization: Bearer {token}
```

### Actualizar paciente

```
PUT http://localhost:3000/api/patients/1
Authorization: Bearer {token}
```

```json
{
  "phone": "+502 9999-8888",
  "address": "Nueva dirección 456"
}
```

### Eliminar paciente

```
DELETE http://localhost:3000/api/patients/1
Authorization: Bearer {token}
```

---

## DOCTORES

### Crear doctor

```
POST http://localhost:3000/api/doctors
Authorization: Bearer {token}
```

```json
{
  "name": "Dra. María García",
  "specialty": "Cardiología",
  "phone": "+502 1111-2222",
  "email": "maria@hospital.com",
  "licenseNumber": "MED-12345",
  "experience": 10,
  "education": "Universidad de San Carlos",
  "bio": "Especialista en enfermedades cardiovasculares",
  "consultationFee": 250.00,
  "availableHours": "Lunes a Viernes 8:00 AM - 5:00 PM",
  "userId": 2
}
```

### Obtener todos los doctores

```
GET http://localhost:3000/api/doctors
```

### Obtener doctor por ID

```
GET http://localhost:3000/api/doctors/1
```

### Obtener doctor por usuario

```
GET http://localhost:3000/api/doctors/user/2
```

### Buscar por especialidad

```
GET http://localhost:3000/api/doctors/specialty/Cardiología
```

### Actualizar doctor

```
PUT http://localhost:3000/api/doctors/1
Authorization: Bearer {token}
```

```json
{
  "phone": "+502 3333-4444",
  "consultationFee": 275.00
}
```

### Eliminar doctor

```
DELETE http://localhost:3000/api/doctors/1
Authorization: Bearer {token}
```

---

## CITAS MÉDICAS

### Crear cita

```
POST http://localhost:3000/api/appointments
Authorization: Bearer {token}
```

```json
{
  "date": "2025-10-20T00:00:00.000Z",
  "time": "10:00 AM",
  "reason": "Consulta de control cardiovascular",
  "notes": "Paciente refiere dolor ocasional",
  "status": "PENDING",
  "patientId": 1,
  "doctorId": 1
}
```

### Obtener todas las citas

```
GET http://localhost:3000/api/appointments
Authorization: Bearer {token}
```

### Obtener cita por ID

```
GET http://localhost:3000/api/appointments/1
Authorization: Bearer {token}
```

### Obtener citas por paciente

```
GET http://localhost:3000/api/appointments/patient/1
Authorization: Bearer {token}
```

### Obtener citas por doctor

```
GET http://localhost:3000/api/appointments/doctor/1
Authorization: Bearer {token}
```

### Actualizar cita

```
PUT http://localhost:3000/api/appointments/1
Authorization: Bearer {token}
```

```json
{
  "date": "2025-10-21T00:00:00.000Z",
  "time": "11:00 AM",
  "status": "CONFIRMED"
}
```

### Eliminar cita

```
DELETE http://localhost:3000/api/appointments/1
Authorization: Bearer {token}
```

---

## ROLES

- **ADMIN**: Acceso completo al sistema
- **DOCTOR**: Gestión de citas y pacientes
- **PATIENT**: Acceso a sus propios datos

---

## AUTENTICACIÓN

Todas las rutas protegidas necesitan:

```
Authorization: Bearer {token}
```

Token válido por 24 horas.
