const multer = require('multer');
const fs = require('fs');

const env = require('./env.js');
const root = env.root;

const upload = function(path) {
    return multer({
        dest: root+'/images/'+path,
        limits: {
            fileSize: 50000000
        }
    })
};

const deletePhoto = function(path) {
    try {
        const url = `${root}${path}`;

        console.log("Removing photo at " + path);
        fs.unlinkSync(url);
        console.log("File removed:", url);
    } catch(error) {
        console.log(error);
    } 
}

module.exports = {
    upload: upload,
    deletePhoto: deletePhoto
}