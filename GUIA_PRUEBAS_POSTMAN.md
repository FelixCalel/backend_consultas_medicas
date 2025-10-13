# 🧪 Guía Completa para Probar el Sistema de Emails en Postman

## 📋 Prerequisitos

### 1. ⚙️ Configurar Variables de Entorno
Asegúrate de que tu archivo `.env` tenga configurado el sistema de emails:

```env
# Email Configuration
MAILER_SERVICE=gmail
MAILER_EMAIL=tuclinica@gmail.com
MAILER_SECRET_KEY=abcd efgh ijkl mnop

# Otras variables necesarias...
PORT=3000
HOST=localhost
DATABASE_URL="postgresql://..."
JWT_SECRET=tu-secreto-jwt
```

### 2. 🚀 Servidor Corriendo
Ejecuta el servidor:
```bash
npm run dev
# o
npm start
```

## 📝 Pasos para Probar en Postman

### Paso 1: 🔐 Autenticarse (Obtener Token)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

**Respuesta esperada:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@email.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📌 Importante:** Copia el `token` de la respuesta para usarlo en las siguientes peticiones.

---

### Paso 2: 👥 Crear un Paciente de Prueba (si no existe)

**Endpoint:** `POST http://localhost:3000/patients`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@gmail.com",
  "phone": "1234567890",
  "address": "Calle 123 #45-67",
  "dateOfBirth": "1990-05-15T00:00:00.000Z",
  "gender": "MALE",
  "medicalHistory": "Sin antecedentes médicos relevantes",
  "allergies": "Ninguna alergia conocida",
  "emergencyContactName": "María Pérez",
  "emergencyContactPhone": "0987654321"
}
```

**📌 Nota:** Anota el `id` del paciente creado para el siguiente paso.

---

### Paso 3: 👨‍⚕️ Crear un Doctor de Prueba (si no existe)

**Endpoint:** `POST http://localhost:3000/doctors`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "name": "Dr. María González",
  "email": "dra.maria@clinica.com",
  "phone": "1111111111",
  "specialty": "Cardiología",
  "licenseNumber": "12345678",
  "yearsOfExperience": 10,
  "education": "Universidad Nacional - Especialización en Cardiología",
  "consultationFee": 75000,
  "availableHours": "Lunes a Viernes: 8:00 AM - 5:00 PM"
}
```

**📌 Nota:** Anota el `id` del doctor creado para el siguiente paso.

---

### Paso 4: 📅 Crear una Cita (¡AQUÍ SE ENVÍA EL EMAIL!)

**Endpoint:** `POST http://localhost:3000/appointments`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "date": "2024-12-20T10:00:00.000Z",
  "patientId": 1,
  "doctorId": 1,
  "reason": "Control cardiológico rutinario",
  "notes": "Primera consulta del paciente. Revisar antecedentes familiares."
}
```

**🔥 ¡Este es el momento mágico!** Cuando envíes esta petición:

1. ✅ Se creará la cita en la base de datos
2. ✅ Se enviará automáticamente un email de confirmación al paciente
3. ✅ Verás en la consola del servidor el mensaje: `Email de confirmación enviado a juan.perez@gmail.com`

**Respuesta esperada:**
```json
{
  "ok": true,
  "message": "Cita médica creada exitosamente",
  "data": {
    "id": 1,
    "date": "2024-12-20T10:00:00.000Z",
    "time": "10:00",
    "status": "PENDING",
    "patientId": 1,
    "doctorId": 1,
    "reason": "Control cardiológico rutinario",
    "notes": "Primera consulta del paciente...",
    "patient": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan.perez@gmail.com"
    },
    "doctor": {
      "id": 1,
      "name": "Dr. María González",
      "specialty": "Cardiología",
      "consultationFee": 75000
    }
  }
}
```

## 📧 ¿Qué Email se Enviará?

El paciente `juan.perez@gmail.com` recibirá un email como este:

```
✅ Cita Médica Confirmada
Su cita ha sido agendada exitosamente

Estimado/a Juan Pérez,

Nos complace confirmar que su cita médica ha sido agendada exitosamente.

┌─────────────────────────┐
│      CONFIRMADA         │
└─────────────────────────┘

📋 ID de Cita: #1
👨‍⚕️ Doctor: Dr. María González
🏥 Especialidad: Cardiología
📅 Fecha y Hora: viernes, 20 de diciembre de 2024, 10:00
📝 Descripción: Control cardiológico rutinario
💰 Costo de Consulta: $75,000

📌 Información Importante:
• Llegue 15 minutos antes de su cita
• Traiga su documento de identidad
• Si necesita cancelar, hágalo con al menos 24 horas de anticipación

Gracias por confiar en nuestros servicios médicos
```

## 🔍 Verificar que Funcionó

### 1. En la Consola del Servidor
Busca este mensaje:
```
✅ Email de confirmación enviado a juan.perez@gmail.com
```

### 2. En el Email del Paciente
El paciente debe recibir el email en su bandeja de entrada.

### 3. En Caso de Error
Si hay un error con el email, verás algo como:
```
❌ Error enviando email de confirmación: Error: Invalid login
```

## 🧪 Pruebas Adicionales

### Probar Actualización de Cita (Email Automático)
**Endpoint:** `PUT http://localhost:3000/appointments/1`

**Body:**
```json
{
  "date": "2024-12-21T14:00:00.000Z",
  "status": "CONFIRMED"
}
```
→ **Resultado:** Email de actualización automático

### Probar Recordatorio Manual
**Endpoint:** `POST http://localhost:3000/appointments/1/reminder`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ **Resultado:** Email de recordatorio manual

### Probar Cancelación (Email Automático)
**Endpoint:** `DELETE http://localhost:3000/appointments/1`

**Body (opcional):**
```json
{
  "reason": "Cancelación por motivos personales del paciente"
}
```
→ **Resultado:** Email de cancelación automático

## 🚨 Solución de Problemas Comunes

### Error: "Authentication failed"
**Problema:** Las credenciales de email son incorrectas
**Solución:** 
1. Verifica `MAILER_EMAIL` y `MAILER_SECRET_KEY` en `.env`
2. Para Gmail, usa contraseña de aplicación (no la contraseña normal)

### Error: "Patient not found"
**Problema:** El `patientId` no existe
**Solución:** Verifica que hayas creado el paciente primero

### Error: "Doctor not found"
**Problema:** El `doctorId` no existe
**Solución:** Verifica que hayas creado el doctor primero

### Error: "Missing Authorization header"
**Problema:** No incluiste el token de autenticación
**Solución:** Agrega el header: `Authorization: Bearer <tu-token>`

## 🎯 Resumen del Flujo Completo

1. 🔐 **Autenticarse** → Obtener token
2. 👥 **Crear paciente** → Obtener ID del paciente
3. 👨‍⚕️ **Crear doctor** → Obtener ID del doctor
4. 📅 **Crear cita** → ¡Se envía email automáticamente!
5. 📧 **Verificar email** → Revisar bandeja del paciente

**¡Listo! Ya puedes probar tu sistema completo de notificaciones por email.** 🎉

---

*Guía creada el 13 de octubre de 2025*
*Sistema completamente funcional* ✅