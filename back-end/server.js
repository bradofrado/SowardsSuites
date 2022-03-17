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

const mongoConnection = 'mongodb+srv://bradofrado:%23Kylie5789@mycluster.yq8un.mongodb.net/sowardssuites';

//connect to the database
mongoose.connect(mongoConnection, {
    useNewUrlParser: true
});

//const root = '/var/www/sowardssuites.com';
const root = '../front-end/public';

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

app.get('/api/rooms', async (req, res) => {
    try {
        let rooms = await Room.find();
        res.send(rooms);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(3001, () => console.log('Server listening on port 3001!'));