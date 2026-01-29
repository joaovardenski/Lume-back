import { mailTransporter } from "../config/mail";
import dotenv from "dotenv";

dotenv.config();

interface SendMailDTO {
  to: string;
  subject: string;
  html: string;
}

export class MailService {
  async send({ to, subject, html }: SendMailDTO) {
    await mailTransporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
