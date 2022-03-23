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

const env = require('./env.js');
const mongoConnection = env.mongoConnection;
const root = env.root;
const port = env.port;

//connect to the database
mongoose.connect(mongoConnection, {
    useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

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

const users = require("./users.js");
const rooms = require("./rooms.js");
const bookings = require('./bookings.js');

app.use("/api/users", users.routes);
app.use('/api/rooms', rooms.routes);
app.use('/api/bookings', bookings.routes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));