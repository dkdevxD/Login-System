import nodemailer from 'nodemailer';
import { User } from '../entity/User';

async function createConfigEmail(user: User, link: string) {

  if (process.env.NODE_ENV === 'production') {
    const transporter = nodemailer.createTransport(
      {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    );
    const info = await transporter.sendMail(
      {
        from: `"RF ALL STAR ONLINE" ${process.env.EMAIL_USER}`,
        to: user.email,
        subject: 'Testando envio automatico de e-mail',
        text: `Ola, este é um e-mail de teste ${link}`,
        html: `<h1>Ola</h1>, <p>este é um e-mail de teste</p> <a href="${link}"> ${link} </a>`
      }
    );

  } else {

    const testAcc = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport(
      {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAcc.user,
          pass: testAcc.pass
        }
      }
    );
    const info = await transporter.sendMail(
      {
        from: `"RF ALL STAR ONLINE" testando@email.com`,
        to: "destinatario@hotmail.com",
        subject: 'Testando envio automatico de e-mail',
        text: `Ola, este é um e-mail de teste ${link}`,
        html: `<h1>Ola</h1>, <p>este é um e-mail de teste</p> <a href="${link}"> ${link} </a>`
      }
      );
      console.log('URL => ' + nodemailer.getTestMessageUrl(info));
  }
}

export class Email {
  static async sendEmail(user: User, link: string) {
    await createConfigEmail(user, link);
  }
}