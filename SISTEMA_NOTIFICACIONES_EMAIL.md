# 📧 Sistema de Notificaciones por Email para Citas Médicas

## 📋 Descripción General

El sistema de notificaciones por email está diseñado para enviar automáticamente correos electrónicos a los pacientes cuando se realizan operaciones relacionadas con sus citas médicas. Este sistema garantiza que los pacientes estén siempre informados sobre el estado de sus citas.

## 🚀 Características Principales

### ✅ Tipos de Notificaciones Implementadas

1. **Confirmación de Cita** - Se envía cuando se crea una nueva cita
2. **Actualización de Cita** - Se envía cuando se modifica una cita existente
3. **Cancelación de Cita** - Se envía cuando se cancela/elimina una cita
4. **Recordatorio de Cita** - Se puede enviar manualmente para recordar citas próximas

### 🎨 Características de las Plantillas

- **Diseño Responsivo**: Compatible con dispositivos móviles y escritorio
- **Plantillas HTML Profesionales**: Diseño moderno con gradientes y estilos atractivos
- **Información Completa**: Incluye todos los detalles relevantes de la cita
- **Branding Consistente**: Colores y estilos coherentes en todas las plantillas
- **Accesibilidad**: Texto legible y estructura semántica adecuada

## 🔧 Configuración del Sistema

### Variables de Entorno Requeridas

```env
# Configuración del servicio de email
MAILER_SERVICE=gmail          # Servicio de email (gmail, outlook, etc.)
MAILER_EMAIL=tu-email@gmail.com    # Email del remitente
MAILER_SECRET_KEY=tu-app-password  # Contraseña de aplicación o API key
```

### Dependencias

```json
{
  "nodemailer": "^6.9.0",
  "@types/nodemailer": "^6.4.0"
}
```

## 📡 API Endpoints

### 🏥 Citas Médicas con Notificaciones

#### Crear Cita (con notificación automática)
```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-12-20T10:00:00.000Z",
  "patientId": 1,
  "doctorId": 1,
  "reason": "Consulta general",
  "notes": "Primera consulta del paciente"
}
```

**Respuesta:**
```json
{
  "ok": true,
  "message": "Cita médica creada exitosamente",
  "data": {
    "id": 123,
    "date": "2024-12-20T10:00:00.000Z",
    "status": "PENDING",
    "patient": {
      "name": "Juan Pérez",
      "email": "juan@email.com"
    },
    "doctor": {
      "name": "Dr. María González",
      "specialty": "Medicina General"
    }
  }
}
```

#### Actualizar Cita (con notificación automática)
```http
PUT /appointments/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-12-21T14:00:00.000Z",
  "status": "CONFIRMED",
  "reason": "Consulta de seguimiento"
}
```

#### Cancelar Cita (con notificación automática)
```http
DELETE /appointments/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Cancelación por parte del doctor debido a emergencia"
}
```

#### Enviar Recordatorio Manual
```http
POST /appointments/123/reminder
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "ok": true,
  "message": "Recordatorio enviado exitosamente",
  "data": {
    "appointmentId": 123,
    "sentTo": "juan@email.com",
    "sentAt": "2024-10-13T15:30:00.000Z"
  }
}
```

## 📨 Tipos de Emails y Plantillas

### 1. ✅ Email de Confirmación

**Se envía cuando:** Se crea una nueva cita médica

**Contiene:**
- Badge de "CONFIRMADA"
- Información del doctor (nombre, especialidad)
- Fecha y hora de la cita
- Motivo de la consulta
- Costo de la consulta (si aplica)
- Instrucciones importantes para el paciente

**Ejemplo visual:**
```
┌─────────────────────────────────────┐
│ ✅ Cita Médica Confirmada           │
│ Su cita ha sido agendada exitosamente │
└─────────────────────────────────────┘

Estimado/a Juan Pérez,

Su cita médica ha sido confirmada:

┌─────────────────────────┐
│      CONFIRMADA         │
└─────────────────────────┘

📋 ID de Cita: #123
👨‍⚕️ Doctor: Dr. María González
🏥 Especialidad: Medicina General
📅 Fecha: viernes, 20 de diciembre de 2024, 10:00
📝 Motivo: Consulta general
💰 Costo: $50,000
```

### 2. 📝 Email de Actualización

**Se envía cuando:** Se modifica una cita existente

**Contiene:**
- Badge de "ACTUALIZADA"
- Información actualizada de la cita
- Lista detallada de los cambios realizados
- Nueva fecha/hora si fue modificada

### 3. ❌ Email de Cancelación

**Se envía cuando:** Se elimina/cancela una cita

**Contiene:**
- Badge de "CANCELADA"
- Información de la cita cancelada
- Motivo de la cancelación (si se proporciona)
- Mensaje de comprensión y opción de reprogramar

### 4. 🔔 Email de Recordatorio

**Se envía cuando:** Un admin/doctor envía un recordatorio manual

**Contiene:**
- Badge de "PRÓXIMA"
- Tiempo restante hasta la cita
- Instrucciones de preparación
- Información de contacto para cancelaciones

## 🛠️ Implementación Técnica

### Arquitectura del Sistema

```
EmailService
├── sendEmail() - Método base para envío
├── sendAppointmentConfirmation()
├── sendAppointmentUpdate()
├── sendAppointmentCancellation()
└── sendAppointmentReminder()

AppointmentController
├── createAppointment() - Envía confirmación automática
├── updateAppointment() - Envía actualización automática
├── deleteAppointment() - Envía cancelación automática
└── sendAppointmentReminder() - Envía recordatorio manual
```

### Manejo de Errores

- **Email Fallido**: No interrumpe la operación principal (crear/actualizar/eliminar cita)
- **Logging**: Se registran todos los intentos de envío y errores
- **Validaciones**: Se verifica que el email del paciente esté disponible

### Ejemplo de Log
```
Console Output:
✅ Email de confirmación enviado a juan@email.com
✅ Email de actualización enviado a maria@email.com  
❌ Error enviando email de cancelación: SMTP Authentication failed
✅ Recordatorio enviado a carlos@email.com
```

## 🔒 Seguridad y Permisos

### Roles y Permisos para Notificaciones

| Acción | PATIENT | DOCTOR | ADMIN |
|--------|---------|--------|-------|
| Crear cita (auto-email) | ❌ | ✅ | ✅ |
| Actualizar cita (auto-email) | ✅* | ✅ | ✅ |
| Cancelar cita (auto-email) | ❌ | ✅ | ✅ |
| Enviar recordatorio | ❌ | ✅ | ✅ |

*\* Los pacientes solo pueden actualizar sus propias citas*

## 📊 Monitoreo y Logs

### Logs del Sistema
- Cada envío de email se registra en la consola
- Errores de email se capturan sin interrumpir operaciones
- Información de debug incluye: email destinatario, tipo de notificación, timestamp

### Ejemplo de Implementación de Monitoreo

```typescript
// En el futuro se puede implementar:
interface EmailLog {
  id: number;
  appointmentId: number;
  patientEmail: string;
  emailType: 'confirmation' | 'update' | 'cancellation' | 'reminder';
  status: 'success' | 'failed';
  sentAt: Date;
  error?: string;
}
```

## 🚀 Próximas Mejoras

### Funcionalidades Planeadas

1. **📊 Dashboard de Emails**
   - Estadísticas de envío
   - Tasa de entrega
   - Emails fallidos

2. **⏰ Recordatorios Automáticos**
   - Cron jobs para recordatorios 24h antes
   - Recordatorios 1 hora antes de la cita

3. **🎨 Plantillas Personalizables**
   - Editor de plantillas en el admin
   - Múltiples temas/diseños
   - Logos personalizados

4. **📱 Notificaciones SMS**
   - Integración con Twilio
   - Notificaciones por WhatsApp

5. **📈 Analytics Avanzados**
   - Tracking de apertura de emails
   - Clicks en enlaces
   - Métricas de engagement

## 🧪 Testing

### Casos de Prueba Recomendados

1. **Creación de Cita**
   - ✅ Email de confirmación se envía
   - ✅ Contenido del email es correcto
   - ✅ Cita se crea aunque falle el email

2. **Actualización de Cita**
   - ✅ Email de actualización se envía
   - ✅ Cambios se reflejan correctamente
   - ✅ Solo se envía email si hay cambios

3. **Cancelación de Cita**
   - ✅ Email de cancelación se envía
   - ✅ Motivo se incluye si se proporciona
   - ✅ Cita se elimina aunque falle el email

4. **Recordatorio Manual**
   - ✅ Solo admins/doctores pueden enviar
   - ✅ Solo para citas confirmadas y futuras
   - ✅ Email contiene información correcta

### Comando de Prueba

```bash
# Instalar dependencias
npm install

# Ejecutar el servidor
npm run dev

# Probar endpoints con Postman o curl
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-12-20T10:00:00.000Z","patientId":1,"doctorId":1,"reason":"Test"}'
```

## 📚 Documentación Técnica

### EmailService Interface

```typescript
interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: Date;
  description?: string;
  consultationFee?: number;
  appointmentId: number;
}

class EmailService {
  sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean>
  sendAppointmentUpdate(data: AppointmentEmailData, changes: string): Promise<boolean>
  sendAppointmentCancellation(data: AppointmentEmailData, reason?: string): Promise<boolean>
  sendAppointmentReminder(data: AppointmentEmailData): Promise<boolean>
}
```

---

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta:
- **Email**: soporte@clinica.com
- **Documentación**: Ver archivos README.md del proyecto
- **Issues**: Reportar en el repositorio del proyecto

---

*Sistema implementado el 13 de octubre de 2025*
*Versión 1.0 - Sistema de Notificaciones por Email*