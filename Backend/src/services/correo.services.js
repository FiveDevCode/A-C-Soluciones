import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    
      secure: true, 
      tls: {
        rejectUnauthorized: true 
      }
    });
  }

  //se envia un correo para recuperacion
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

 //cinfirmacion de contra
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

  //alertas
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

  // Enviar notificación de cambio de estado de solicitud
  async enviarNotificacionCambioEstadoSolicitud(email, nombreCliente, estadoAnterior, estadoNuevo, idSolicitud, motivoCancelacion = null) {
    try {
      console.log('[EmailService] Preparando envío de correo...');
      console.log(`[EmailService] Destinatario: ${email}`);
      console.log(`[EmailService] Cliente: ${nombreCliente}`);
      console.log(`[EmailService] Estado: ${estadoAnterior} -> ${estadoNuevo}`);
      console.log(`[EmailService] ID Solicitud: ${idSolicitud}`);
      if (motivoCancelacion) {
        console.log(`[EmailService] Motivo de cancelación: ${motivoCancelacion}`);
      }
      
      const estadosMensajes = {
        'pendiente': 'está pendiente de revisión',
        'aceptada': 'ha sido aceptada y será procesada',
        'rechazada': 'ha sido rechazada'
      };

      const mensajeEstado = estadosMensajes[estadoNuevo] || estadoNuevo;
      const appUrl = process.env.APP_URL || 'https://ac-soluciones.com';
      const solicitudUrl = `${appUrl}/cliente/solicitudes/${idSolicitud}`;
      
      // Construir HTML con motivo de rechazo si aplica
      let motivoHtml = '';
      let motivoText = '';
      
      if (estadoNuevo === 'rechazada' && motivoCancelacion) {
        motivoHtml = `
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #856404;">Motivo de rechazo:</p>
            <p style="margin: 5px 0 0 0; color: #856404;">${motivoCancelacion}</p>
          </div>
        `;
        motivoText = `\n\nMotivo de rechazo: ${motivoCancelacion}`;
      }
      
      console.log('[EmailService] Enviando correo...');
      
      const esEstadoNegativo = estadoNuevo === 'rechazada';
      const subjectSuffix = estadoNuevo === 'rechazada' ? '(RECHAZADA)' : '';
      
      const resultado = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_SENDER_NAME || 'A-C Soluciones'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Actualización de tu solicitud ${subjectSuffix} - A-C Soluciones`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Contenedor principal -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                    
                    <!-- Header con gradiente -->
                    <tr>
                      <td style="background: linear-gradient(135deg, ${esEstadoNegativo ? '#f44336 0%, #d32f2f 100%' : '#2196f3 0%, #1976d2 100%'}); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                          ${esEstadoNegativo ? '⚠️ Actualización de Solicitud' : '✨ Actualización de Solicitud'}
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <!-- Saludo -->
                        <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Hola <strong style="color: #1976d2;">${nombreCliente}</strong>,
                        </p>
                        
                        <!-- Mensaje principal -->
                        <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                          Te informamos que el estado de tu solicitud <strong style="color: #333;">#${idSolicitud}</strong> ha sido actualizado:
                        </p>
                        
                        <!-- Tarjeta de cambio de estado -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 10px; border-left: 5px solid ${esEstadoNegativo ? '#f44336' : '#2196f3'}; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="padding-bottom: 12px;">
                                    <span style="display: block; color: #6c757d; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Estado Anterior</span>
                                    <span style="display: inline-block; background-color: #ffffff; color: #495057; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                      ${estadoAnterior}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 15px 0; text-align: center;">
                                    <span style="color: #adb5bd; font-size: 20px;">↓</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style="display: block; color: #6c757d; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Nuevo Estado</span>
                                    <span style="display: inline-block; background: ${esEstadoNegativo ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)' : 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)'}; color: #ffffff; padding: 10px 20px; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px ${esEstadoNegativo ? 'rgba(244, 67, 54, 0.3)' : 'rgba(33, 150, 243, 0.3)'}; letter-spacing: 0.3px;">
                                      ${estadoNuevo.toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        ${motivoHtml ? `
                        <!-- Motivo de rechazo -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%); border-radius: 10px; border-left: 5px solid #ffc107; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 20px 25px;">
                              <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                💬 Motivo de Rechazo
                              </p>
                              <p style="margin: 0; color: #856404; font-size: 15px; line-height: 1.6; font-weight: 500;">
                                ${motivoCancelacion}
                              </p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        <!-- Mensaje de estado -->
                        <p style="margin: 0 0 35px 0; color: #555555; font-size: 15px; line-height: 1.7; background-color: #f8f9fa; padding: 18px; border-radius: 8px; border-left: 3px solid ${esEstadoNegativo ? '#f44336' : '#2196f3'};">
                          ${esEstadoNegativo ? '⚠️' : '✅'} Tu solicitud <strong>${mensajeEstado}</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                          Si tienes alguna pregunta, no dudes en contactarnos
                        </p>
                        <p style="margin: 0; color: #2196f3; font-size: 15px; font-weight: 600;">
                          Equipo de A-C Soluciones
                        </p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                          <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                            © ${new Date().getFullYear()} A-C Soluciones. Todos los derechos reservados.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `Hola ${nombreCliente}, el estado de tu solicitud #${idSolicitud} ha cambiado de ${estadoAnterior} a ${estadoNuevo}. Tu solicitud ${mensajeEstado}.${motivoText}`
      });
      
      console.log('[EmailService] ✅ Correo enviado exitosamente. MessageId:', resultado.messageId);
      return true;
    } catch (error) {
      console.error('[EmailService] ❌ Error al enviar notificación de cambio de estado:', error);
      console.error('[EmailService] Error detallado:', error.message);
      return false;
    }
  }
}

export default new EmailService();