import nodemailer from 'nodemailer';
import { sendEmail, createTransporter } from '../../../src/services/email.services.js';

jest.mock('nodemailer');

describe('email.services', () => {
  let mockSendMail;

  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue('Email enviado');
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransporter', () => {
    it('debe crear un transporter con la configuración correcta', () => {
      const transporter = createTransporter();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      expect(transporter.sendMail).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    it('debe enviar un correo con los argumentos correctos', async () => {
      await sendEmail('cliente@example.com', 'Asunto', 'Contenido del mensaje', 'ruta/del/archivo.pdf');

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: 'cliente@example.com',
        subject: 'Asunto',
        text: 'Contenido del mensaje',
        attachments: [{ path: 'ruta/del/archivo.pdf' }],
      });
    });

    it('debe propagar errores si sendMail falla', async () => {
      mockSendMail.mockRejectedValue(new Error('Fallo al enviar'));

      await expect(
        sendEmail('cliente@example.com', 'Asunto', 'Texto', 'ruta/archivo.pdf')
      ).rejects.toThrow('Fallo al enviar');
    });
  });
});
