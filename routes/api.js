const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect(
    "mongodb://localhost:27017/local",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
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

router.post('/register', (req, res) => {
    let user = new User(req.body);
    user.save( (error, registeredUser) => {
        if (error) {
            console.error(error);
        } else {
            res.status(200).send(registeredUser.name);
        }
    } );
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            console.error(error);
        } else {
            if (!user) {
                res.status(401).send('In valid email.');
            } else {
                if ( user.password !== req.body.password ) {
                    res.status(401).send('Invalid password');
                } else {
                    res.status(200).send(user.name + ' has been logged in.');
                }
            }
        }
    });
});

router.get('/events', (req, res) => {
    const events = ['happy hour', 'beer party'];
    res.json(events);
});

router.get('/special', (req, res) => {
    const special = ['Disney World', 'Hawaii tour'];
    res.json(special);
})

module.exports = router;