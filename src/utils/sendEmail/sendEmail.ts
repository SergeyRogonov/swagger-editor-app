import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export default async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  const TRANSPORT = getTransport();
  await TRANSPORT.sendMail({
    from: `Server <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
