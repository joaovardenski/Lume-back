import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailDTO {
  to: string;
  subject: string;
  html: string;
}

export class MailService {
  async send({ to, subject, html }: SendMailDTO) {
    await resend.emails.send({
      from: process.env.MAIL_FROM as string,
      to,
      subject,
      html,
    });
  }
}
