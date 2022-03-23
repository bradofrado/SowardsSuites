const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const rooms = require('./rooms.js');
const users = require('./users.js');


const bookingSchema = new mongoose.Schema({
    startDate: String,
    endDate: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    rooms: [{
        type: mongoose.Schema.ObjectId,
        ref: "Room"
    }]
});

const Booking = mongoose.model('Booking', bookingSchema);


const Room = rooms.model;
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        Booking.find().populate('rooms').populate('user').exec((err, bookings) => {
            if (err) throw err;

            console.log(bookings);
            res.send(bookings);
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/', validUser, async (req, res) => {
    try {
        if (!req.body.rooms || !req.body.end || !req.body.start) {
            res.status(403).send({
                message: "Invalid body parameters"
            });
        }

        const booking = new Booking({
            startDate: req.body.start,
            endDate: req.body.end,
            user: req.user,
            rooms: req.body.rooms
        });
    
        await booking.save();

        console.log("sending booking");
    
        res.send(booking);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    model: Booking,
    routes: router
}