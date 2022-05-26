const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const uploader = require('./uploader.js');
const upload = uploader.upload('events');

const users = require('./users.js');
const validUser = users.valid;

const eventsSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    image: String 
});

const Event = mongoose.model('Event', eventsSchema);

router.get('/', (req, res) => {
    try {
        Event.find().sort({startDate: 1}).populate('user').exec(async (err, events) => {
            if (err) throw err;

            res.send(events);
        });

        
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser, upload.single('image'), async (req, res) => {
    try {
        if (!req.body.title || !req.body.startDate || !req.body.endDate) {
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const event = new Event({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            title: req.body.title,
            description: req.body.description,
            image: '/image/events/' + req.file.filename,
            user: req.user
        });

        await event.save();

        return res.send(event);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
    model: Event,
}