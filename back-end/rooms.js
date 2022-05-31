const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');


const router = express.Router();

const logger = require('./logging.js');

const uploader = require('./uploader.js');
const upload = uploader.upload('rooms');
const deletePhoto = uploader.deletePhoto;


const roomSchema = new mongoose.Schema({
    name: String,
    image: String,
    thumbnail: String,
    description: String,
});

const Room = mongoose.model('Room', roomSchema);

const users = require('./users.js');
const validUser = users.valid;

router.get('/', async (req, res) => {
    try {
        let rooms = await Room.find();
        res.send(rooms);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        let room = await Room.findOne({
            _id: req.params.id
        });

        if (!room) {
            logger.error('Invalid room: ' + req.params.id, req.session.userID);
            return res.status(400).send({
                message: "Could not find room " + req.params.id
            });
        }

        logger.info('Getting room ' + room.name, req.session.userID);

        res.send(room);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
})
const roomUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]);

router.post('/', validUser(['Admin']), roomUpload, async (req, res) => {
    try {
        if (!req.body.name || !req.body.description || !req.files['image']) {
            logger.error('Invalid body parameters uploading new room', req.session.useID);
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const image = req.files['image'][0];
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0] : req.files['image'][0];


        const room = new Room({
            name: req.body.name,
            image: '/images/rooms/' + image.filename,
            thumbnail: '/images/rooms/' + thumbnail.filename,
            description: req.body.description
        });

        await room.save();

        logger.info('Created new room ' + room.name, req.session.userID);

        return res.send(room);
    } catch(error) {
        logger.error(error, req.session.userID);
        return res.sendStatus(500);
    }
})

router.put('/:id', validUser(['Admin']), roomUpload, async (req, res) => {
    try {
        if (!req.body.name || !req.body.description) {
            logger.error('Invalid body parameters editing room', req.session.useID);
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const room = await Room.findOne({ 
            _id: req.params.id
        });

        if (!room) {
            logger.error('Could not find room ' + req.params.id, req.session.useID);
            return res.status(400).send({
                message: "Could not find room " + req.params.id
            });
        }

        room.name = req.body.name;

        if (req.files && req.files['image'])
            room.image = '/images/' + req.files['image'][0].filename;
        if (req.files && req.files['thumbnail'])
            room.thumbnail = '/images/' + req.files['thumbnail'][0].filename;
        room.description = req.body.description;

        await room.save();

        logger.info('Edited room ' + room.name, req.session.userID);

        return res.send(room);
    } catch(error) {
        logger.error(error, req.session.userID);
        return res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['Admin']), async (req, res) => {
    try {
        const room = await Room.findOne({
            _id: req.params.id
        });

        if (!room) {
            logger.error('Could not find room with id to delete ' + req.params.id);
            return res.status(400).send({
                message: "Could not find room with id " + req.params.id
            });
        }

        if (room.image) {
            deletePhoto(room.image);
        }

        if (room.thumbnail) {
            deletePhoto(room.thumbnail);
        }

        await room.delete();

        logger.info('Deleted room ' + room.name, req.session.userID);

        res.sendStatus(200);
    } catch (error) {
        logger.error(error, req.session.userID);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Room,
}