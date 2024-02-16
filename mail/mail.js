import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    debug: true,
    logger: true,
});

export const sendRegisterMail = async (to, token) => {
    const mailOptions = {
        from: 'minesweeperpvp@gmail.com',
        to: to,
        subject: 'Confirm register',
        html: `
            <p>Click this link to confirm email. <a href="http://localhost:3001/confirm/${token}">localhost:3001/confirm/${token}</a></p>
        `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail sent: ' + info.response);
        }
    });
}