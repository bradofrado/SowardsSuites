const nodemailer = require("nodemailer");
const dayjs = require('dayjs');
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

function dateFormat(date) {
    return date ? dayjs(date).format('MM/DD/YYYY') : ''
}

const sendEmail = async (to, subject, text) => {
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

const sendNewBookingEmails = async (booking) => {
    if (!booking.user || !booking.user.firstname) {
        throw Error("Booking must have user to send notification email");
    }

    const numRooms = booking.rooms.length;

    if (!numRooms) {
        throw Error("Booking must have rooms");
    }
    
    const roomNames = booking.rooms.reduce((prev, curr, i) => {
        prev += `${curr.name}`;

        if (i < numRooms - 1) {
            if (numRooms == 2) {
                prev += ' and ';
            } else if (i === numRooms - 2) {
                prev += ', and ';
            } else {
                prev += ', ';
            }
        }

        return prev;
    }, '');

    const subject = `New Booking-${booking.user.firstname} ${booking.user.lastname}`;
    const message = `${booking.user.firstname} just booked the room${numRooms > 1 ? 's' : ''} ${roomNames} from ${dateFormat(booking.startDate)} to ${dateFormat(booking.endDate)}`
    
    const toSends = await userController.getRoles(['Notify']);

    for (let i = 0; i < toSends.length; i++) {
        await sendEmail(toSends[i].email, subject, message);
    }
    
}

module.exports = {
    sendEmail: sendEmail,
    sendNewBookingEmails: sendNewBookingEmails
}