const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();

const rooms = require('./rooms.js');
const users = require('./users.js');


const bookingSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    rooms: [{
        type: mongoose.Schema.ObjectId,
        ref: "Room"
    }]
});

bookingSchema.methods.alreadyExists = async function() {
    //Fetch all the bookings where this booking overlaps 
    const found = await Booking.find(
        {
       $or: [
           {
               startDate: {
                   $gte: this.startDate,
                   $lte: this.endDate
               }
           },
           {
               endDate: {
                   $gte: this.startDate,
                   $lte: this.endDate
               }
           }
       ]
    });

    //If there were none, we have no problem
    if (!found.length) {
        return false;
    }

    //Now check to see if there are rooms that overlap
    const flag = found.some(booking => {
        return booking.rooms.some(room => {
            const _flag = this.rooms.find(x => {
                return room._id.toString() === x._id.toString()
            });
    
            return _flag !== undefined;
        });
    })

    return flag;
}

const Booking = mongoose.model('Booking', bookingSchema);


const Room = rooms.model;
const validUser = users.valid;

const checkDate = async (req, res, next) => {
    if (!req.body.start || !req.body.end) {
        return res.status(400).send({
            message: "Invalid body parameters"
        }); 
    }

    req.body.start = req.body.start.substring(0,req.body.start.indexOf('T'));
    req.body.end = req.body.end.substring(0,req.body.end.indexOf('T'));

    next();
}

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

router.post('/', validUser, checkDate, async (req, res) => {
    try {
        if (!req.body.rooms || !req.body.end || !req.body.start) {
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const booking = new Booking({
            startDate: req.body.start,
            endDate: req.body.end,
            user: req.user,
            rooms: req.body.rooms
        });
         
        

        if (await booking.alreadyExists()) {
            return res.status(400).send({
                message: "One or more rooms is already booked"
            });
        }

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