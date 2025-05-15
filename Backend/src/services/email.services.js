import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // 

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Puerto seguro
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (to, subject, text, filePath) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER, // 
    to,
    subject,
    text,
    attachments: [{ path: filePath }],
  });
};
