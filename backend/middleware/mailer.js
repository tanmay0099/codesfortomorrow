import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export async function sendEmail({ to, subject, html }) {
    const mailOption = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOption);
        console.log("email sent", info.response);
        return true;
    } catch (err) {
        throw new Error("fail to send email")
    }
}