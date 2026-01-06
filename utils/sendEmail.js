// import nodeMailer from "nodemailer";
import dotenv from 'dotenv';
import sgMail from "@sendgrid/mail";
dotenv.config({ path: './Config/config.env' });

// export const sendEmail = async (options) => {
//   try {
//     const transporter = nodeMailer.createTransport({
//       host: process.env.SMPT_HOST,
//       port: process.env.SMPT_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMPT_MAIL,
//         pass: process.env.SMPT_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false
//       }
//     });
//     await transporter.verify();
//     console.log("SMTP VERIFIED");
//     const mailOptions = {
//       from: process.env.SMPT_MAIL,
//       to: options.email,
//       subject: options.subject,
//       text: options.message,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("MAIL SENT");

//   } catch (error) {
//     console.error("MAIL ERROR 👉", error);
//   }
// };


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await sgMail.send({
      to: email,
      from: process.env.SMPT_MAIL, // MUST be verified
      subject,
      text: message,
    });

    console.log("SENDGRID RESPONSE:", response[0].statusCode);
  } catch (error) {
    console.error("SENDGRID ERROR MESSAGE:", error.message);

    if (error.response) {
      console.error("SENDGRID RESPONSE BODY:", error.response.body);
    }
  }
};


