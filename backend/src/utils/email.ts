import nodemailer, { TransportOptions } from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// import { Resend } from 'resend';

export const sendEmail = async (options: EmailOptions): Promise<void> => {
// const resend = new Resend('re_BFnGYgfX_KhVDzLXu4nCGi3zXtZmBVcCZ');

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'dm.skakov@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Email sent to ${options.email}`);
};
