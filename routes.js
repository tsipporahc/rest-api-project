'use strict';

const express = require('express');
const router = express.Router(); // Construct a router instance.

// This array is used to keep track of user records
// as they are created.
const users = [];

// Route that returns a list of users.
router.get('/users', (req, res) => {
    res.json(users);
    return res.status(200).end(); // 200 OK - http status code
});

// Route that creates a new user.
router.post('/users', (req, res) => {
    // The user  is set from the request body.
    const user = req.body;
    console.log(user);

    // Add the user to the `users` array.
    users.push(user);

    // Set location header and 201 Created http status code and end the response.
    return res.location('/').status(201).end();
});

module.exports = router;
