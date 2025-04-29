import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    
      secure: true, 
      tls: {
        rejectUnauthorized: true // Verificar certificado
      }
    });
  }

  
  async enviarEmailRecuperacion(email, token) {
    try {
      const appUrl = process.env.APP_URL || 'https://ac-soluciones.com';
      const resetUrl = `${appUrl}/restablecer-contrasena?token=${token}`;
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_SENDER_NAME || 'A-C Soluciones'}" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: 'Recuperación de contraseña - A-C Soluciones',
        // Solo se envía la URL para que el frontend se encargue del formato
        text: `Recuperación de contraseña: ${resetUrl}`
      });
      
      return true;
    } catch (error) {
      console.error('[EmailService] Error al enviar email de recuperación:', error);
      return false;
    }
  }

 
  async enviarConfirmacionCambioContrasena(email) {
    try {
      const appUrl = process.env.APP_URL || 'https://ac-soluciones.com';
      const loginUrl = `${appUrl}/login`;
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_SENDER_NAME || 'A-C Soluciones'}" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: 'Contraseña actualizada - A-C Soluciones',
        // Solo se envía la URL para login
        text: `Confirmación de cambio de contraseña. Login: ${loginUrl}`
      });
      
      return true;
    } catch (error) {
      console.error('[EmailService] Error al enviar email de confirmación:', error);
      return false;
    }
  }

  
  async enviarAlertaSeguridad(email, datos) {
    try {
      const { ip, ubicacion, dispositivo, fecha } = datos;
      const cambiarContrasenaUrl = `${process.env.APP_URL || 'https://ac-soluciones.com'}/cambiar-contrasena`;
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_SENDER_NAME || 'A-C Soluciones - Seguridad'}" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: 'Alerta de Seguridad - A-C Soluciones',
        // Solo se envían los datos básicos para alertar
        text: `Alerta de seguridad - IP: ${ip}, Ubicación: ${ubicacion}, Dispositivo: ${dispositivo}, Fecha: ${fecha}. Cambiar contraseña: ${cambiarContrasenaUrl}`
      });
      
      return true;
    } catch (error) {
      console.error('[EmailService] Error al enviar alerta de seguridad:', error);
      return false;
    }
  }
}

export default new EmailService();