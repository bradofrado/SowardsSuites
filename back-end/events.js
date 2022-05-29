const express = require('express');
const mongoose = require('mongoose');
const { deletePhoto } = require('./uploader.js');

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
    image: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

eventsSchema.methods.isValid = function() {
    const now = new Date();

    return this.endDate >= now;
}

//Every find query should only returned the not deleted
eventsSchema.pre(/^find/, function(next) {
    this.where({isDeleted: false});
    next();
});

const Event = mongoose.model('Event', eventsSchema);

router.get('/', (req, res) => {
    try {
        Event.find().sort({startDate: 1}).populate('user').exec(async (err, events) => {
            if (err) throw err;

            //Delete the events that are passed their dates
            for (let i = events.length - 1; i >= 0; i--) {
                if (!events[i].isValid()) {
                    events[i].isDeleted = true;
                    await events[i].save();

                    events.splice(i,1);
                }                
            }

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
            image: '/images/events/' + req.file.filename,
            user: req.user
        });

        await event.save();

        return res.send(event);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:id', validUser, upload.single('image'), async (req, res) => {
    try {
        if (!req.body.title || !req.body.startDate || !req.body.endDate) {
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const event = await Event.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!event) {
            return res.status(400).send({
                message: "Could not find event or invalid user"
            });
        }

        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.title = req.body.title;
        event.description = req.body.description;

        if (req.file) {
            const filename = '/images/events/' + req.file.filename;

            //Delete the old photo
            if (filename != event.image) {
                deletePhoto(event.image);
            }

            event.image = filename;
        }

        await event.save();

        return res.send(event);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', validUser, async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!event) {
            return res.status(400).send({
                message: "Either could not find event with id " + req.params.id + " or invalid user"
            });
        }

        //Admins can do hard deletes. Other wise just mark it as deleted
        if (req.query.hard === 'true') {
            if (req.user.hasRole('Admin')) {
                deletePhoto(event.image);
                await event.delete();
            } else {
                return res.status(400).send({
                    message: "Only admins can do a hard delete"
                });
            }
        } else {
            event.isDeleted = true;
            await event.save();
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    
})

module.exports = {
    routes: router,
    model: Event,
}