const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');


const router = express.Router();

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
        console.log(error);
        res.sendStatus(500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        let room = await Room.findOne({
            _id: req.params.id
        });

        if (!room) {
            return res.status(400).send({
                message: "Could not find room " + req.params.id
            });
        }

        res.send(room);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})
const roomUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]);

router.post('/', validUser(['Admin']), roomUpload, async (req, res) => {
    try {
        if (!req.body.name || !req.body.description || !req.files['image']) {
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

        return res.send(room);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.put('/:id', validUser(['Admin']), roomUpload, async (req, res) => {
    try {
        if (!req.body.name || !req.body.description) {
            return res.status(400).send({
                message: "Invalid body parameters"
            });
        }

        const room = await Room.findOne({ 
            _id: req.params.id
        });

        if (!room) {
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

        return res.send(room);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:id', validUser(['Admin']), async (req, res) => {
    try {
        const room = await Room.findOne({
            _id: req.params.id
        });

        if (!room) {
            return res.status(400).send({
                message: "Either could not find room with id " + req.params.id
            });
        }

        if (room.image) {
            deletePhoto(room.image);
        }

        if (room.thumbnail) {
            deletePhoto(room.thumbnail);
        }

        await room.delete();

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Room,
}