
import nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

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

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      console.log('Mail sent:', sentInformation.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Métodos específicos para notificaciones de citas médicas

  async sendAppointmentConfirmation(appointmentData: AppointmentEmailData): Promise<boolean> {
    const { patientName, patientEmail, doctorName, doctorSpecialty, appointmentDate, description, consultationFee, appointmentId } = appointmentData;

    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlBody = this.getAppointmentConfirmationTemplate({
      patientName,
      doctorName,
      doctorSpecialty,
      formattedDate,
      description,
      consultationFee,
      appointmentId
    });

    return this.sendEmail({
      to: patientEmail,
      subject: `✅ Confirmación de Cita Médica - Dr. ${doctorName}`,
      htmlBody
    });
  }

  async sendAppointmentUpdate(appointmentData: AppointmentEmailData, changes: string): Promise<boolean> {
    const { patientName, patientEmail, doctorName, doctorSpecialty, appointmentDate, appointmentId } = appointmentData;

    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlBody = this.getAppointmentUpdateTemplate({
      patientName,
      doctorName,
      doctorSpecialty,
      formattedDate,
      changes,
      appointmentId
    });

    return this.sendEmail({
      to: patientEmail,
      subject: `📝 Actualización de Cita Médica - Dr. ${doctorName}`,
      htmlBody
    });
  }

  async sendAppointmentCancellation(appointmentData: AppointmentEmailData, reason?: string): Promise<boolean> {
    const { patientName, patientEmail, doctorName, doctorSpecialty, appointmentDate, appointmentId } = appointmentData;

    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlBody = this.getAppointmentCancellationTemplate({
      patientName,
      doctorName,
      doctorSpecialty,
      formattedDate,
      reason,
      appointmentId
    });

    return this.sendEmail({
      to: patientEmail,
      subject: `❌ Cancelación de Cita Médica - Dr. ${doctorName}`,
      htmlBody
    });
  }

  async sendAppointmentReminder(appointmentData: AppointmentEmailData): Promise<boolean> {
    const { patientName, patientEmail, doctorName, doctorSpecialty, appointmentDate, description, appointmentId } = appointmentData;

    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const timeUntilAppointment = Math.ceil((appointmentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));

    const htmlBody = this.getAppointmentReminderTemplate({
      patientName,
      doctorName,
      doctorSpecialty,
      formattedDate,
      description,
      appointmentId,
      timeUntilAppointment
    });

    return this.sendEmail({
      to: patientEmail,
      subject: `🔔 Recordatorio: Cita Médica con Dr. ${doctorName}`,
      htmlBody
    });
  }

  // Plantillas HTML privadas

  private getAppointmentConfirmationTemplate(data: {
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    formattedDate: string;
    description?: string;
    consultationFee?: number;
    appointmentId: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Cita Médica</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status-badge { background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .important { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Cita Médica Confirmada</h1>
          <p>Su cita ha sido agendada exitosamente</p>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${data.patientName}</strong>,</p>
          
          <p>Nos complace confirmar que su cita médica ha sido agendada exitosamente.</p>
          
          <div class="appointment-card">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">CONFIRMADA</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📋 ID de Cita:</span>
              <span class="detail-value">#${data.appointmentId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Doctor:</span>
              <span class="detail-value">Dr. ${data.doctorName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🏥 Especialidad:</span>
              <span class="detail-value">${data.doctorSpecialty}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Fecha y Hora:</span>
              <span class="detail-value">${data.formattedDate}</span>
            </div>
            
            ${data.description ? `
            <div class="detail-row">
              <span class="detail-label">📝 Descripción:</span>
              <span class="detail-value">${data.description}</span>
            </div>
            ` : ''}
            
            ${data.consultationFee ? `
            <div class="detail-row">
              <span class="detail-label">💰 Costo de Consulta:</span>
              <span class="detail-value">$${data.consultationFee.toLocaleString()}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="important">
            <strong>📌 Información Importante:</strong>
            <ul>
              <li>Llegue 15 minutos antes de su cita</li>
              <li>Traiga su documento de identidad</li>
              <li>Si necesita cancelar, hágalo con al menos 24 horas de anticipación</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Gracias por confiar en nuestros servicios médicos</p>
            <p><em>Este es un mensaje automático, por favor no responda a este correo</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAppointmentUpdateTemplate(data: {
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    formattedDate: string;
    changes: string;
    appointmentId: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización de Cita Médica</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status-badge { background: #ffc107; color: #212529; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .changes-box { background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📝 Cita Médica Actualizada</h1>
          <p>Se han realizado cambios en su cita</p>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${data.patientName}</strong>,</p>
          
          <p>Le informamos que se han realizado cambios en su cita médica:</p>
          
          <div class="appointment-card">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">ACTUALIZADA</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📋 ID de Cita:</span>
              <span class="detail-value">#${data.appointmentId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Doctor:</span>
              <span class="detail-value">Dr. ${data.doctorName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🏥 Especialidad:</span>
              <span class="detail-value">${data.doctorSpecialty}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Nueva Fecha y Hora:</span>
              <span class="detail-value">${data.formattedDate}</span>
            </div>
          </div>
          
          <div class="changes-box">
            <strong>🔄 Cambios realizados:</strong>
            <p>${data.changes}</p>
          </div>
          
          <div class="footer">
            <p>Si tiene alguna pregunta sobre estos cambios, no dude en contactarnos</p>
            <p><em>Este es un mensaje automático, por favor no responda a este correo</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAppointmentCancellationTemplate(data: {
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    formattedDate: string;
    reason?: string;
    appointmentId: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cancelación de Cita Médica</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status-badge { background: #dc3545; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❌ Cita Médica Cancelada</h1>
          <p>Su cita ha sido cancelada</p>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${data.patientName}</strong>,</p>
          
          <p>Lamentamos informarle que su cita médica ha sido cancelada:</p>
          
          <div class="appointment-card">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">CANCELADA</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📋 ID de Cita:</span>
              <span class="detail-value">#${data.appointmentId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Doctor:</span>
              <span class="detail-value">Dr. ${data.doctorName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🏥 Especialidad:</span>
              <span class="detail-value">${data.doctorSpecialty}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Fecha Original:</span>
              <span class="detail-value">${data.formattedDate}</span>
            </div>
          </div>
          
          ${data.reason ? `
          <div class="reason-box">
            <strong>📋 Motivo de la cancelación:</strong>
            <p>${data.reason}</p>
          </div>
          ` : ''}
          
          <p>Si desea reprogramar su cita, no dude en contactarnos. Estaremos encantados de ayudarle a encontrar una nueva fecha que se ajuste a su disponibilidad.</p>
          
          <div class="footer">
            <p>Gracias por su comprensión</p>
            <p><em>Este es un mensaje automático, por favor no responda a este correo</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAppointmentReminderTemplate(data: {
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    formattedDate: string;
    description?: string;
    appointmentId: number;
    timeUntilAppointment: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Cita Médica</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status-badge { background: #17a2b8; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .reminder-box { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔔 Recordatorio de Cita</h1>
          <p>Su cita médica se acerca</p>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${data.patientName}</strong>,</p>
          
          <p>Le recordamos que tiene una cita médica próxima:</p>
          
          <div class="appointment-card">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">PRÓXIMA</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📋 ID de Cita:</span>
              <span class="detail-value">#${data.appointmentId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Doctor:</span>
              <span class="detail-value">Dr. ${data.doctorName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">🏥 Especialidad:</span>
              <span class="detail-value">${data.doctorSpecialty}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Fecha y Hora:</span>
              <span class="detail-value">${data.formattedDate}</span>
            </div>
            
            ${data.description ? `
            <div class="detail-row">
              <span class="detail-label">📝 Descripción:</span>
              <span class="detail-value">${data.description}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="reminder-box">
            <strong>⏰ Su cita es en aproximadamente ${data.timeUntilAppointment} horas</strong>
            <ul>
              <li>Recuerde llegar 15 minutos antes</li>
              <li>Traiga su documento de identidad</li>
              <li>Si tiene algún impedimento, cancele con anticipación</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Nos vemos pronto</p>
            <p><em>Este es un mensaje automático, por favor no responda a este correo</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
