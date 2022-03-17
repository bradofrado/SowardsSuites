const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//connect to the database
mongoose.connect('mongodb://localhost:27017/sowardssuites', {
    useNewUrlParser: true
});

const root = '/var/www/sowardssuites.braydonjones.com';

const upload = multer({
    dest: root + '/images/',
    limits: {
        fileSize: 10000000
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

const rooms = [
    {id: 0, name: "Room 1", path: "/rooms/0", img: "room1.jpg", description: "A lovely room"},
    {id: 1, name: "Room 2", path: "/rooms/1", img: "room2.jpg", description: "Yes good"},
    {id: 2, name: "Room 3", path: "/rooms/2", img: "room3.jpg", description: "The best one"},
    {id: 3, name: "Room 4", path: "/rooms/3", img: "room4.jpg", description: "Oh baby yes"},
]

app.get('/api/rooms', async (req, res) => {
    try {
        //let rooms = await Room.find();
        res.send(rooms);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(3000, () => console.log('Server listening on port 3000!'));