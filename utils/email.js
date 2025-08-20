const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail
};
