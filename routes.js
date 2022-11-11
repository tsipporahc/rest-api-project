'use strict';

const express = require('express');
const router = express.Router(); // Construct a router instance.
const User = require('./models').User;
const bcrypt = require('bcryptjs'); // hashes passwords

// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
}

// Route that returns a list of users.
router.get(
    '/users',
    asyncHandler(async (req, res) => {
        let users = await User.findAll();
        res.json(users);
        return res.status(200).end(); // 200 OK - http status code
    })
);

// Route that creates a new user.
router.post(
    '/users',
    asyncHandler(async (req, res) => {
        try {
            // The user  is set from the request body.
            const user = await User.create(req.body);
            console.log(user);

            // Set location header (redirect after creating new resources) and 201 Created http status code and end the response.
            res.location('/')
                .status(201)
                .json({ message: 'Account successfully created!' })
                .end();

            /* // Validate that we have a `name` value.
            if (!user.name) {
                // The `user.name` property isn't defined or is set to `undefined`, `null`, or an empty string
                errors.push({
                    message: `The request body must contain a "name" field set to the user's name`,
                    userMessage: 'Please provide a value for "name"',
                });
            }

            // Validate that we have an `email` value.
            if (!user.email) {
                errors.push({
                    message: `The request body must contain a "email" field set to the user's email address`,
                    userMessage: 'Please provide a value for "email"',
                });
            }

            // Validate that we have a `password` value.
            if (!user.password) {
                errors.push('Please provide a value for "password"');
            } else if (password.length < 8 || password.length > 20) {
                errors.push(
                    'Your password should be between 8 and 20 characters'
                );
            } else {
                user.password = bcrypt.hashSync(user.password, 10);
            } */
        } catch (error) {
            console.log('ERROR: ', error.name);
            // If there are any errors...
            if (
                error.name === 'SequelizeValidationError' ||
                error.name === 'SequelizeUniqueConstraintError'
            ) {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

module.exports = router;
