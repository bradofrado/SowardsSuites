const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const roomSchema = new mongoose.Schema({
    name: String,
    image: String,
    thumbnail: String,
    description: String,
});

const Room = mongoose.model('Room', roomSchema);

router.get('/', async (req, res) => {
    try {
        let rooms = await Room.find();
        res.send(rooms);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = {
    routes: router,
    model: Room,
}