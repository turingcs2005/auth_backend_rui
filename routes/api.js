const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },

    err => {
        if (err) {
            console.error('Error! ' + err);
        } else {
            console.log('Connected to MongoDB');
        }
    }
)

router.get('/', (req, res) => {
    res.send('API route');
});

// register a new account
router.post('/register', async (req, res) => {

    const u = await User.findOne({ email: req.body.email});

    if (u) {     // if email already exist
        res.status(400).json({error: 'Email exists.'});
    } else {     
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // create a new user using hashed password
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });

        user.save( (error, registeredUser) => {
            if (error) {
                console.error(error);
            } else {
                res.status(200).json(registeredUser);
            }
        });
    }
});

// delete an existing account
router.delete('/delete', (req, res) => {
    User.findOneAndDelete( {email: req.body.email }, (error, user) => {
        if (error) {
            console.error(error);
        } else {
            if (!user) {
                res.status(400).json({error: 'Invalid email.'});
            } else {
                res.status(200).json({message: 'Account has been deleted!'});
            }
        }
    });
});

// update an existing account
router.put('/update', (req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, req.body, (error, user) => {
        if (error) {
            console.error(error);
        } else {
            if (!user) {
                res.status(400).json({error: 'Invalid email.'});
            } else {
                res.status(200).json({status: 'Account has been updated.'});
            }
        }
    });
});

// login
router.post('/login', async (req, res) => {
    const u = await User.findOne({email: req.body.email});
    if (!u) {
        res.status(400).json({error: 'Invalid email.'});
    } else {
        // check password
        const validPass = await bcrypt.compare(req.body.password, u.password);
        if (!validPass) {
            res.status(400).json({error: 'Invalid password.'});
        } else {
            // create and sign a token
            const token = jwt.sign({_id: u._id}, process.env.TOKEN_SECRET);
            res.status(200).header('auth-token', token).send(token);
        }
    }
});

router.get('/free-access', (req, res) => {
    res.status(200).json({response: 'No authentication.'})
});

router.get('/authorized-access', (req, res) => {
    res.status(200).json({response: 'Authentication.'});
})

module.exports = router;