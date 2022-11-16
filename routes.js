'use strict';

const express = require('express');
const router = express.Router(); // Construct a router instance.
const { User, Course } = require('./models'); // import models
const bcrypt = require('bcryptjs'); // hashes passwords
const { authenticateUser } = require('./middleware/auth-user'); // protect specific routes in your application from unauthorized users

/* 
{
        "firstName": "Tree",
        "lastName": "House",
        "emailAddress": "th6@test.com",
        "password": "123456789",
        "createdAt": "2022-11-09T06:16:19.000Z",
        "updatedAt": "2022-11-09T06:16:19.000Z"
}
*/

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

// Returns a list of users.
router.get(
    '/users',
    authenticateUser,
    asyncHandler(async (req, res) => {
        const user = req.currentUser;
        return res.status(200).json(user).end();

        //const users = await User.findAll();
        //return res.status(200).json(users).end(); // 200 OK - http status code
    })
); // route GET requests to the path "/api/users" first to our custom middleware function and then to the inline router handler function.

// Creates a new user.
router.post(
    '/users',
    asyncHandler(async (req, res) => {
        try {
            // The user  is set from the request body.
            const user = await User.create(req.body);

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

// Returns a list of courses.
router.get(
    '/courses',
    asyncHandler(async (req, res) => {
        const courses = await Course.findAll();
        return res.status(200).json(courses).end();
    })
);

// Returns a individual course.
router.get(
    '/courses/:id',
    asyncHandler(async (req, res) => {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            return res.status(200).json(course).end();
        } else {
            const error = new Error(); // custom error object
            error.status = 404;
            error.message = 'Sorry, this page is not found :(';
            throw error;
        }
    })
);

// Create a new course.
router.post(
    '/courses',
    authenticateUser,
    asyncHandler(async (req, res) => {
        try {
            const courses = await Course.create(req.body);
            res.location('/')
                .status(201)
                .json({ message: 'Course successfully created!' })
                .end();
        } catch (error) {
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

// Update a course.
router.put(
    '/courses/:id',
    authenticateUser,
    asyncHandler(async (req, res) => {
        let course;
        try {
            const course = await Course.findByPk(req.params.id);
            await course.update(req.body);
            res.status(204).end();
        } catch (error) {
            if (
                error.name === 'SequelizeValidationError' ||
                error.name === 'SequelizeUniqueConstraintError'
            ) {
                course = await Course.build(req.body);
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

// Delete a course
router.delete(
    '/courses/:id',
    authenticateUser,
    asyncHandler(async (req, res) => {
        const courses = await Course.findByPk(req.params.id);
        if (courses) {
            await courses.destroy();
            return res.status(204).end();
        } else {
            const error = new Error(); // custom error object
            error.status = 404;
            error.message = 'Sorry, this page is not found :(';
            throw error;
        }
    })
);

module.exports = router;
