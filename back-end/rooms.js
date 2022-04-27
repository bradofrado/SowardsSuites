const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');


const router = express.Router();

const env = require('./env.js');
const root = env.root;

const upload = multer({
    dest: root+'/images',
    limits: {
        fileSize: 50000000
    }
});

const deletePhoto = function(path) {
    const url = `${root}${path}`;

    console.log("Removing photo at " + path);
    fs.unlinkSync(url);
    console.log("File removed:", url);
}

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
const roomUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]);
router.post('/', validUser(['Admin']), roomUpload, async (req, res) => {
    try {
        const room = new Room({
            name: req.body.name,
            image: '/images/' + req.files['image'][0].filename,
            thumbnail: '/images/' + req.files['thumbnail'][0].filename,
            description: req.body.description
        });

        await room.save();

        return res.send(room);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Room,
}