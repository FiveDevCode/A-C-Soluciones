import nodemailer from 'nodemailer';
import { sendEmail } from '../../../src/services/email.services.js';

jest.mock('nodemailer');

describe('email.services', () => {
  let sendMailMock;

  beforeAll(() => {
    // Mock del transporter y sendMail
    sendMailMock = jest.fn().mockResolvedValue(true);

    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendEmail llama a transporter.sendMail con los argumentos correctos', async () => {
    const to = 'cliente@example.com';
    const subject = 'Asunto de prueba';
    const text = 'Contenido del email';
    const filePath = '/ruta/al/archivo.pdf';

    await sendEmail(to, subject, text, filePath);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'jonier145@gmail.com',
        pass: 'vjrd wzmr pxxx opew',
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'tuemail@gmail.com',
      to,
      subject,
      text,
      attachments: [{ path: filePath }],
    });
  });

  // Opcional: test para manejo de errores (si implementas try/catch)
  test('sendEmail propaga el error si sendMail falla', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('Fallo al enviar'));

    await expect(
      sendEmail('to@example.com', 'subj', 'text', '/file.pdf')
    ).rejects.toThrow('Fallo al enviar');
  });
});
