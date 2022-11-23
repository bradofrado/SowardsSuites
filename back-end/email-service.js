const nodemailer = require("nodemailer");
const userController = require('./users.js');
const env = require('./env.js');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'bradofrado@gmail.com',
        pass: env.smtp_key
    }
});

const sendEmail = async (to, subject, text) => {
    //Don't send emails in development mode
    if (env.isDevelopment) {
        return;
    }

    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Sowards Suites <bradofrado@gmail.com>', 
            to: to, 
            subject: subject, 
            text: text, 
        });

        console.log(`Sent email to ${to} with subject ${subject} and id ${info.messageId}`);
    } catch(error) {
        console.log(error);
    }
    
}

module.exports = {
    sendEmail: sendEmail,
}