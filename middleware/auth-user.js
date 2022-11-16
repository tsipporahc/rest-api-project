'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
    let message; // store the message to display

    /* Parse the user's credentials from the Authorization header. */
    const credentials = auth(req); // the user's stored password is hashed, and the password from the user credentials is in clear text

    /* If the user's credentials are available...
    Attempt to retrieve the user from the data store
    by their username (i.e. the user's "key"
    from the Authorization header). */
    if (credentials) {
        const user = await User.findOne({
            where: { emailAddress: credentials.name },
        }); //credentials.name is the name key

        /* If a user was successfully retrieved from the data store...
        Use the bcrypt npm package to compare the user's password
        (from the Authorization header) to the user's password
        that was retrieved from the data store. */
        if (user) {
            const authenticated = bcrypt.compareSync(
                credentials.pass,
                user.password
            ); // credentials.pass is password secret. compareSync() method hashes the user's password before comparing it to the stored hashed value).

            /* If the passwords match...
            Store the retrieved user object on the request object
            so any middleware functions that follow this middleware function
            will have access to the user's information. */

            if (authenticated) {
                console.log(
                    `Authentication successful for user: ${user.firstName} ${user.lastName}`
                );

                // Store the user on the Request object.
                req.currentUser = user;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    /* If user authentication failed...
    Return a response with a 401 Unauthorized HTTP status code.

    Or if user authentication succeeded...
    Call the next() method. */
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
