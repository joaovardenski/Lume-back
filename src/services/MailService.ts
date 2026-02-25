import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

interface SendMailDTO {
  to: string;
  subject: string;
  html: string;
}

export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send({ to, subject, html }: SendMailDTO) {
    await this.resend.emails.send({
      from: process.env.MAIL_FROM as string,
      to,
      subject,
      html,
    });
  }
}