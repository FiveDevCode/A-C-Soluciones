import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jonier145@gmail.com',
      pass: 'vjrd wzmr pxxx opew',
    },
  });
};

export const sendEmail = async (to, subject, text, filePath) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: 'tuemail@gmail.com',
    to,
    subject,
    text,
    attachments: [{ path: filePath }],
  });
};
