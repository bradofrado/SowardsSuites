const express = require('express');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const logger = require('./logging.js');
const mailer = require('./email-service.js');
const env = require('./env.js');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const expirationTime = 15;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    roles: [{
        type: String,
        default: ""
    }]
});

const forgotPasswordSchema = new mongoose.Schema({
	username: String,
	authtoken: String,
	expirationDate: Date,
	isDeleted: {
		type: Boolean,
		default: false
	}
});

forgotPasswordSchema.pre(/^find/, function() {
    this.where({isDeleted: false, expirationDate: { $gte: new Date() }}).sort({expirationDate: 1});
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    try {
        const hash = await argon2.hash(this.password);
        this.password = hash;
        next();
    } catch (error) {
        logger.error(error);
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

userSchema.methods.hasRoles = function(roles) {
    return roles.every(role => this.roles.includes(role));
}

const User = mongoose.model('User', userSchema);
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

/* Middleware */
const validUserRoles = async (req, res, next, roles) => {
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

        if (roles) {
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (user && !user.roles.includes(role)) {
                    return res.status(403).send({
                        message: "Must have role " + role + " to perform this feature"
                    });
                }
            }
        }
        

        req.user = user;
    } catch (error) {
        return res.status(403).send({
            message: "not logged in"
        });
    }

    next();
}

const validUser = function(roles) {
    //valid user used normally without roles (req, res, next  as arguments)
    if (arguments.length === 3) {
        return validUserRoles.apply(this, arguments);
    }

    //Called with roles
    return function() {
        arguments[arguments.length] = roles;
        arguments.length += 1;
        return validUserRoles.apply(this, arguments);
    }
}

const getRoles = async function(roles) {
    const users = await User.find();

    return users.filter(x => x.hasRoles(roles));
}

/* Endpoints */

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).send({
            message: "username, password, and email are required"
        });
    }

    try {
        const existingUser = await User.findOne({
            username: req.body.username.toLowerCase()
        });
        if (existingUser) {
            logger.error('Username already exists: ' + req.body.username);
            return res.status(403).send({
                message: "username already exists"
            });
        }

        if (req.body.role) {
            logger.error('Tried to specify role: ' + req.body.username);
            return res.status(403).send({
                message: "Must be admin to specify role"
            })
        }

        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();

        req.session.userID = user._id;

        logger.info('Created user: '+user.username, user._id);

        return res.send({
            user: user
        });
    } catch(error) {
        logger.error(error, req.session.userID);
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
            username: req.body.username.toLowerCase()
        });

        // Return an error if user does not exist.
        if (!user) {
            logger.error('Failed login: ' + req.body.username);

            return res.status(403).send({
                message: "username or password is incorrect"
            });
        }
  
        // Return the SAME error if the password is wrong. This ensure we don't
        // leak any information about which users exist.
        if (!await user.comparePassword(req.body.password)) {
            logger.error('Failed login: ' + req.body.username);

            return res.status(403).send({
                message: "username or password is incorrect"
            });
        }

        //set user session info
        req.session.userID = user._id;

        logger.info('User logged in: ' + user.username, user._id);
  
      return res.send({
        user: user
      });
    } catch (error) {
      logger.error(error, req.session.userID);
      return res.sendStatus(500);
    }
});

router.post('/forgot', async (req, res) => {
	if (!req.body.email) {
		return res.status(400).send({
			message: "must include email"
		});
	}
	try {
		//  lookup user record
		const user = await User.findOne({
			email: req.body.email.toLowerCase()
		});

		 // Return an error if user does not exist.
		 if (!user) {
			logger.error('Failed forgot password: ' + req.body.email);

			return res.status(403).send({
				message: "email is incorrect"
			});
        }

		const uuid = uuidv4();
		const forgotPassword = new ForgotPassword({
			username: user.username,
			authtoken: uuid,
			expirationDate: moment(new Date()).add(expirationTime, 'm').toDate()
		});

		await forgotPassword.save();
		const forgotPasswordUrl = `${env.site}/password-reset?id=${uuid}&username=${user.username}`;
		const text = `Please visit this link to reset your password <a href="${forgotPasswordUrl}">here</a>. The link will expire in ${expirationTime} minutes`;
		await mailer.sendEmail(user.email, "Forgot My Password", text);
		res.sendStatus(200);
	} catch (error) {
		logger.error(error, req.session.userID);
		return res.sendStatus(500);
	}
})

router.post('/reset', async (req, res) => {
	if (!req.body.username || !req.body.id || !req.body.password) {
		return res.status(400).send({
			message: "Invalid body parameters"
		});
	}
	try {
		const forgot = await ForgotPassword.findOne({
			username: req.body.username.toLowerCase(),
			authtoken: req.body.id
		});

		const user = await User.findOne({
			username: req.body.username.toLowerCase()
		});

		 // Return an error if user does not exist.
		 if (!forgot || !user) {
			logger.error(`Failed password reset: ${req.body.username}, ${req.body.id}`);

			return res.status(403).send({
				message: "invalid or expired link"
			});
        }

		forgot.isDeleted = true;
		await forgot.save();

		user.password = req.body.password;
		await user.save();

		res.sendStatus(200);
	} catch (error) {
		logger.error(error, req.session.userID);
		return res.sendStatus(500);
	}
})

// get logged in user
router.get('/', validUser, async (req, res) => {
    try {
      res.send({
        user: req.user
      });
    } catch (error) {
      logger.error(error, req.session.userID);
      return res.sendStatus(500);
    }
});

// logout
router.delete("/", validUser, async (req, res) => {
    try {
        logger.info('User logged out: ' + req.user.username, req.user._id)
        req.session = null;
        res.sendStatus(200);
    } catch (error) {
        logger.error(error, req.session.userID);
        return res.sendStatus(500);
    }
});


module.exports = {
    routes: router,
    model: User,
    valid: validUser,
    getRoles: getRoles
}