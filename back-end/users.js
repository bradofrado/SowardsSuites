const express = require('express');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const router = express.Router();

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    role: {
        type: String,
        default: ""
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    try {
        const hash = await argon2.hash(this.password);
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch(error) {
        return false;
    }
}

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const User = mongoose.model('User', userSchema);

/* Middleware */
const validUser = async (req, res, next) => {
    if (!req.session.userID)
    {
        return res.status(403).send({
            message: "not logged in"
        });
    }
    
    try {
        const user = await User.findOne({
            _id: req.session.userID 
        });
        if (!user) {
            return res.status(403).send({
                message: "not logged in"
            });
        }

        req.user = user;
    } catch (error) {
        return res.status(403).send({
            message: "not logged in"
        });
    }

    next();
}

/* Endpoints */

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "username and password are required"
        });
    }

    try {
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (existingUser) {
            return res.status(403).send({
                message: "username already exists"
            });
        }

        if (req.body.role) {
            return res.status(403).send({
                message: "Must be admin to specify role"
            })
        }

        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();

        req.session.userID = user._id;

        return res.send({
            user: user
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login a user
router.post('/login', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    if (!req.body.username || !req.body.password)
      return res.status(400).send({
          message: "must include username and password"
      });
  
    try {
      //  lookup user record
      const user = await User.findOne({
        username: req.body.username
      });
      // Return an error if user does not exist.
      if (!user)
        return res.status(403).send({
          message: "username or password is incorrect"
        });
  
      // Return the SAME error if the password is wrong. This ensure we don't
      // leak any information about which users exist.
      if (!await user.comparePassword(req.body.password))
        return res.status(403).send({
          message: "username or password is incorrect"
        });

        //set user session info
        req.session.userID = user._id;
  
      return res.send({
        user: user
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
    try {
      res.send({
        user: req.user
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// logout
router.delete("/", validUser, async (req, res) => {
    try {
      req.session = null;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    routes: router,
    model: User,
    valid: validUser
}