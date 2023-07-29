const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const mailerController = require('./email-service.js');

const router = express.Router();

const rooms = require('./rooms.js');
const users = require('./users.js');
const logger = require('./logging.js');

const mailer = Object.entries(mailerController).reduce((prev, [key, value]) => {
    if (typeof value == 'function') {
        prev[key] = async (...args) => {
            const toSends = await users.getRoles(['Notify']);
            return value(...args, toSends)
        } 
    } else {
        prev[key] = value;
    }

    return prev;
}, {})


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
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
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

//Every find query should only returned the not deleted
bookingSchema.pre(/^find/, function(next) {
    this.where({isDeleted: false});
    next();
});

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
        Booking.find().sort({startDate: 1}).populate('rooms').populate('user').exec(async (err, bookings) => {
            if (err) throw err;

            //Git rid of the dates that are passed their bookings or don't have the given rooms
            for (let i = bookings.length - 1; i >= 0; i--) {
                if (!bookings[i].isValid()) {
                    bookings[i].isDeleted = true;
                    await bookings[i].save();
                    bookings.splice(i,1);
                }

                if (!bookings[i].hasRooms(req.query.rooms)) {
                    bookings.splice(i,1);
                }
            }

            res.send(bookings);
        });
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
});

router.post('/', validUser, checkDate, async (req, res) => {
    try {
        if (!req.body.rooms || !req.body.end || !req.body.start) {
            logger.error('Invalid body parameters for new booking', req.session.userID);
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        //Create a new booking
        const booking = new Booking({
            startDate: req.body.start,
            endDate: req.body.end,
            user: req.user,
            rooms: req.body.rooms
        }, );
         
        
        //See if these rooms are already booked
        if (await booking.alreadyExists()) {
            logger.error('One or more rooms is already booked', req.session.userID);
            return res.status(400).send({
                message: "One or more rooms is already booked"
            });
        }

        await booking.save();

        //We need to populate the rooms before sending an email
        await booking.populate('rooms');
        await mailer.sendNewBookingEmails(booking);

        logger.info('Created new booking: ' + booking._id, req.user._id);
    
        res.send(booking);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser, checkDate, async (req, res) => {
    try {
        if (!req.body.rooms || !req.body.end || !req.body.start) {
            logger.error('Invalid body parameters for editing booking', req.session.userID);
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const isAdmin = req.user.hasRoles(['Admin']);

        let booking;
        
        //If this is admin, just find the booking
        if (isAdmin) {
            booking = await Booking.findOne({
                _id: req.params.id              
            });            
        //Otherwise the booking has to be tied to the current user
        } else {
            booking = await Booking.findOne({
                _id: req.params.id,
                user: req.user
            });
        }
        

        if (!booking) {
            logger.error('Either could not find booking with id ' + req.params.id + ' or invalid user', req.session.userID);
            return res.status(400).send({
                message: "Either could not find booking with id " + req.params.id + " or invalid user"
            });
        }

        //Save the old dates
        const oldStart = booking.startDate;
        const oldEnd = booking.endDate;

        booking.startDate = req.body.start;
        booking.endDate = req.body.end;
        booking.rooms = req.body.rooms
         
        

        if (await booking.alreadyExists()) {
            logger.error('One or more rooms is already booked', req.session.userID);
            return res.status(400).send({
                message: "One or more rooms is already booked"
            });
        }

        await booking.save();

        await booking.populate('rooms user');
        await mailer.sendEditBookingEmails(booking, oldStart, oldEnd);

        logger.info('Edited booking ' + booking._id, req.session.userID);
    
        res.send(booking);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser, async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');

        let booking;
        
        //If this is admin, just find the booking
        if (isAdmin) {
            booking = await Booking.findOne({
                _id: req.params.id                
            });            
        //Otherwise the booking has to be tied to the current user
        } else {
            booking = await Booking.findOne({
                _id: req.params.id,
                user: req.user
            });
        }

        if (!booking) {
            logger.error("Either could not find booking with id " + req.params.id + " or invalid user", req.session.userID);
            return res.status(400).send({
                message: "Either could not find booking with id " + req.params.id + " or invalid user"
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            if (isAdmin) {
                await booking.delete();
                logger.info('Hard deleted booking ' + booking._id, req.session.userID);            
            } else {
                logger.error("Only admins can do a hard delete for bookings", req.session.userID);
                return res.status(400).send({
                    message: "Only admins can do a hard delete"
                });
            }
        } else {
            booking.isDeleted = true;
            await booking.save();
            logger.info('Deleted booking ' + booking._id, req.session.userID);

            await booking.populate('rooms user');
            await mailer.sendDeleteBookingEmails(booking);
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
});

module.exports = {
    model: Booking,
    routes: router
}