const mongoose = require('mongoose');
const users = require('./users.js');

const LoggingType = {
    info: 'info',
    warning: 'warning',
    error: 'error'
}

const logSchema = new mongoose.Schema({
    type: {
        default: LoggingType.info,
        enum: [LoggingType.info, LoggingType.warning, LoggingType.error],
        type: String
    },
    message: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    date: Date
});

const Log = mongoose.model('Log', logSchema);

const currentUsers = {};

const getUser = async function(userId) {
    if (!currentUsers[userId]) {
        const user = await users.model.findOne({
            _id: userId
        });
        if (!user) return null;

        currentUsers[userId] = user;
    }

    return currentUsers[userId];
}

const newLog = async function(type, message, userId) {
    try {
        userId = userId || null;

        const log = new Log({
            user: userId,
            date: new Date(),
            type: type,
            message: message,
        });

        await log.save();
    } catch(error) {
        console.log(error);
    }
}

const info = function(message, userId) {
    console.log(message);
    newLog(LoggingType.info, message, userId);
}

const error = function(error, userId) {
    console.log(error);
    newLog(LoggingType.error, error, userId);
}

module.exports = {
    info,
    error
}