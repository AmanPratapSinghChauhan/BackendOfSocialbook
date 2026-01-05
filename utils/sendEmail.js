import nodeMailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config({ path: './Config/config.env' });

export const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      secure: false,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    await transporter.verify();
    console.log("SMTP VERIFIED");
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");

  } catch (error) {
    console.error("MAIL ERROR 👉", error);
  }
};
