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
           //The new start date is in between an existing booking
           {
               startDate: {
                   $lte: this.startDate
               },
               endDate: {
                   $gte: this.startDate
               }
           },
           //The new end date is in between an existing booking
           {
                startDate: {
                    $lte: this.endDate
                },
                endDate: {
                    $gte: this.endDate
                }
           },
           //An existing booking is in between a new booking
           {
                startDate: {
                    $gte: this.startDate
                },
                endDate: {
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
        //We don't want this booking to fail with its self
        if (booking._id.toString() === this._id.toString()) {
            return false;
        }

        return booking.rooms.some(room => {
            const _flag = this.rooms.find(x => {
                return room._id.toString() === x._id.toString()
            });
    
            return _flag !== undefined;
        });
    })

    return flag;
}

bookingSchema.methods.isValid = function() {
    const now = new Date();

    return this.endDate >= now;
}

bookingSchema.methods.hasRooms = function(rooms) {
    if (!rooms) return true;

    roomsIdStrings = this.rooms.map(x => x._id.toString());

    return rooms.every(room => {
        return roomsIdStrings.includes(room.toString())
    });
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

    //Make sure the date is not in the past
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    if (start > end || start < new Date() || end < new Date()) {
        return res.status(400).send({
            message: "Invalid dates"
        });
    }

    next();
}

router.get('/', async (req, res) => {
    try {
        Booking.find().populate('rooms').populate('user').exec(async (err, bookings) => {
            if (err) throw err;

            //Git rid of the dates that are passed their bookings or don't have the given rooms
            for (let i = bookings.length - 1; i >= 0; i--) {
                if (!bookings[i].isValid()) {
                    await bookings[i].delete();
                    bookings.splice(i,1);
                }

                if (!bookings[i].hasRooms(req.query.rooms)) {
                    bookings.splice(i,1);
                }
            }

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

router.put('/:id', validUser, checkDate, async (req, res) => {
    try {
        if (!req.body.rooms || !req.body.end || !req.body.start) {
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!booking) {
            return res.status(400).send({
                message: "Either could not find booking with id " + req.params.id + " or invalid user"
            });
        }

        booking.startDate = req.body.start;
        booking.endDate = req.body.end;
        booking.user = req.user;
        booking.rooms = req.body.rooms
         
        

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

router.delete('/:id', validUser, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!booking) {
            return res.status(400).send({
                message: "Either could not find booking with id " + req.params.id + " or invalid user"
            });
        }

        await booking.delete();

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    model: Booking,
    routes: router
}