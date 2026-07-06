import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  const TRANSPORT = getTransport();
  await TRANSPORT.sendMail({
    from: "no-reply@example.local",
    to,
    subject,
    html,
  });
}
